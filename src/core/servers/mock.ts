import * as ejs from "ejs";
import * as prettier from "prettier";
import * as fs from "fs-extra";
import * as path from "path";
import { NextFunction, Request } from "express";
import { ClientRequest } from "http";
import { createProxyMiddleware as proxyRequest } from "http-proxy-middleware";
import limit, { RateLimit } from "express-rate-limit";
import merge from "lodash.merge";
import UrlPattern from "url-pattern";

import { IConfig } from "../../cli/interfaces";
import { inspect, readFileSync, resolveFiles } from "../../cli/utils";
import { CLI_DIR, PRETTIER_SETTINGS_FILE, RESPONSE_MODULE_TPL_FILE } from "../../cli/config";
import { getDirsNested, getNearestParentDir, isJSON, isModuleExisting, randIntBetween, slashify } from "../utils";
import { ResponseModuleNotFoundError, ResponseModuleRequiredPropertyNotFoundError } from "../../exceptions";
import { IMock, IMockExecd, IMockFallback, IMockModule, TMockHook } from "../interfaces";
import logger from "../../logger";

export class MockServer {
  private static instance: MockServer;
  private config: IConfig;
  private SUPPORTED_RESPONSE_TYPES = ["/**/*.{ts,js}"];

  private constructor(config: IConfig) {
    this.config = config;
    this.useRouterMiddleware = this.useRouterMiddleware.bind(this);
    this.useRateLimitMiddleware = this.useRateLimitMiddleware.bind(this);
    this.useProxyMiddleware = this.useProxyMiddleware.bind(this);
    this.useLoggerMiddleware = this.useLoggerMiddleware.bind(this);
    this.useSendMiddleware = this.useSendMiddleware.bind(this);

    // preload responses to reduce overhead on initial request
    resolveFiles(config.responsesDir, this.SUPPORTED_RESPONSE_TYPES, false).forEach(file => require(file));
  }

  private assignMockResponse(req: Request, res: IMock): void {
    const { responsesDir, urlPatternOpts } = this.config;
    const { mock } = res;
    let fullPath = path.join(responsesDir, req.path, req.method);
    let shortPath = slashify(fullPath, responsesDir);

    if (!isModuleExisting(fullPath)) {
      // if the expected response module isn't found, look for a fallback module.
      // fallback modules are matched based on a defined wildcard pattern basically
      // to handle requests with dynamic path paremeters e.g. /api/foo/1 to /api/foo/100

      // define fallback directories; matches /abc123
      // then look for the closest match, relative to the nearest parent
      const wildcardPattern = /(?<token>\/_(?<param>[\dA-z]+))/g;
      const nearestParent = getNearestParentDir(fullPath);
      const segmentCount = (p: string) => p.split("/").length;
      const getFallbackFullPath = (p: string) => path.join(responsesDir, p, req.method);
      const getFallback = (shortPath: string): IMockFallback => {
        // here we form a string to 'tokenize' such fallback directories
        // it's really just changing it from /abc123 to (/:abc123)
        // this is mainly so we can catch those as 'wildcards' for url pattern matching
        // the do loop here is for nested fallback directories
        let matches: RegExpExecArray;
        let tokenizedPath = shortPath;
        do {
          matches = wildcardPattern.exec(shortPath);
          if (matches) {
            tokenizedPath = tokenizedPath.replace(matches.groups.token, `(/:${matches.groups.param})`);
          }
        } while (matches);

        /** see [this](https://www.npmjs.com/package/url-pattern) */
        const urlPattern = new UrlPattern(tokenizedPath, urlPatternOpts);
        const wildcards = urlPattern.match(path.join(req.path, req.method));
        return { urlPattern: urlPattern, wildcards: wildcards };
      };

      // if the nearest parent is equal to the same config response directory,
      // that just means there are no wildcards provided and there's simply no
      // response file available
      if (nearestParent !== responsesDir) {
        const fallbackMatches = getDirsNested(nearestParent)
          .map(dir => slashify(dir, responsesDir))
          .filter(dir =>
            dir.match(wildcardPattern) &&
            segmentCount(dir) === segmentCount(req.path) &&
            isModuleExisting(getFallbackFullPath(dir)))
          .map(dir => getFallbackFullPath(dir));

        if (fallbackMatches.length === 0) throw new ResponseModuleNotFoundError(shortPath);

        // totally possible, default to the first match if this happens
        fullPath = fallbackMatches[0];
        shortPath = slashify(fullPath, responsesDir);
        mock.fallback = getFallback(shortPath);
        if (fallbackMatches.length > 1) {
          logger.warn("Found multiple fallback candidates");
          logger.warn("Defaulting to first match: %s", shortPath);
        }
      } else {
        mock._fullPath = fullPath;
        mock._shortPath = shortPath;
        throw new ResponseModuleNotFoundError(shortPath);
      }
    }

    mock._config = this.config;
    mock._fullPath = fullPath;
    mock._shortPath = shortPath;
    mock.module = require(fullPath).default as IMockModule;
    logger.info("Response: %s", shortPath);
  }

  private execPreResponseHook(req: Request, res: IMock) {
    try {
      const { preResponseHook } = this.config;
      isModuleExisting(preResponseHook) && (require(preResponseHook).default as TMockHook)({ req: req, res: res });
    } catch (error) {
      logger.error("Error executing pre-response hook: %s", error);
    }
  }

  private execPostResponseHook(req: Request, res: IMock) {
    try {
      const { postResponseHook } = this.config;
      isModuleExisting(postResponseHook) && (require(postResponseHook).default as TMockHook)({ req: req, res: res });
    } catch (error) {
      logger.error("Error executing post-response hook: %s", error);
    }
  }

  private execMockResponse(req: Request, res: IMock): void {
    const { mock }: IMockExecd = res as any;
    const { delay, proxy, rate } = this.config;

    const { overrides, response } = mock.module({ req: req, res: res });
    const computedDelay = (d: IConfig["delay"]) => typeof d === "number" ? d : randIntBetween(d.min, d.max);

    if (!response) throw new ResponseModuleRequiredPropertyNotFoundError("response", mock._shortPath);

    mock.response = response;
    mock.overrides = merge({}, { delay, proxy, rate }, overrides);
    mock.overrides.delay = computedDelay(mock.overrides.delay);
  }

  private recordAsMockResponse(req: Request, res: IMockExecd): void {
    try {
      const { mock } = res;
      const body = isJSON(mock._chunk) ? mock._chunk : JSON.stringify(mock._chunk, null, 2);
      const response = { status: res.statusCode, headers: res.getHeaders(), body: body };
      const outputFile = path.join(this.config.recordDir, escape(mock._shortPath) + ".ts");
      const fmt = readFileSync(path.join(__dirname, "../../", CLI_DIR, PRETTIER_SETTINGS_FILE));
      const renderedFmt = { ...JSON.parse(fmt), parser: "babel" };

      const tpl = readFileSync(path.join(__dirname, "../../", CLI_DIR, RESPONSE_MODULE_TPL_FILE));
      const renderedTpl = ejs.render(tpl, { response });

      if (fs.existsSync(outputFile)) {
        logger.debug("Deleting existing file %s", outputFile);
        fs.unlinkSync(outputFile);
      }

      logger.debug("Writing to file %s", outputFile);
      fs.outputFileSync(outputFile, prettier.format(renderedTpl, renderedFmt));
    } catch (error) {
      logger.error(error);
    }
  }

  public useRouterMiddleware(req: Request, res: IMock, next: NextFunction): void {
    try {
      logger.info("Request: %s %s", req.method, req.path);
      (res as any).mock = {};
      this.assignMockResponse(req, res);
      this.execPreResponseHook(req, res);
      this.execMockResponse(req, res);
      this.execPostResponseHook(req, res);
    } catch (error) {
      res.mock._err = error;
    }
    next();
  }

  public useRateLimitMiddleware(): RateLimit {
    const { rate } = this.config;
    return limit({
      windowMs: 1000,
      max: (req: Request, res: IMockExecd) => res.mock.overrides?.rate?.limit || rate.limit,
      handler: (req: Request, res: IMockExecd, next: NextFunction) => {
        const { overrides, response } = res.mock;
        if (response) {
          response.status = overrides?.rate?.status || rate.status;
          response.body = "Request per second limit has been reached";
        } else {
          res.removeHeader("Retry-After");
        }
        next();
      }
    });
  }

  public useLoggerMiddleware(
    req: Request & Pick<IMockExecd["mock"], "_time">,
    res: IMockExecd,
    next: NextFunction): void {
    const { mock } = res;
    // i don't understand most of what's going on below ¯\_(ツ)_/¯
    // it's mostly a mishmash of these answers:
    // https://stackoverflow.com/a/58882269/2285470
    // https://stackoverflow.com/a/50161321/2285470
    // https://stackoverflow.com/a/34712950/2285470
    const [write, end] = [res.write, res.end];
    const chunks: Buffer[] = [];
    req._time = +new Date();
    mock._chunk = "";

    // override
    res.write = (...args: any[]) => {
      chunks.push(Buffer.from(args[0]));
      return write.apply(res, args);
    };

    // override
    res.end = (...args: any[]) => {
      if (args[0]) {
        chunks.push(Buffer.from(args[0]));
      }
      mock._chunk = Buffer.concat(chunks).toString("utf8");
      mock._time = +new Date() - req._time;

      const data = {
        request: {
          headers: req.headers,
          method: req.method,
          path: req.path,
          query: req.query,
          body: req.body
        },
        response: {
          status: res.statusCode,
          headers: res.getHeaders(),
          body: mock._chunk
        }
      };

      this.config.recordResponses && this.recordAsMockResponse(req, res);
      logger.debug("%s %s %sms \n%s", req.method, req.path, mock._time, JSON.stringify(data, null, 2));
      end.apply(res, args);
    };
    next();
  }

  public useProxyMiddleware(req: Request, res: IMockExecd, next: NextFunction): void {
    const { overrides, response } = res.mock;
    // this needs to be here because of how proxy middleware
    // complains when body parser is called first
    // see:
    // - https://github.com/chimurai/http-proxy-middleware/issues/320
    // - https://github.com/chimurai/http-proxy-middleware/issues/40#issuecomment-249430255
    const restream = function(proxyReq: ClientRequest, req: Request) {
      if (req.body) {
        const body = JSON.stringify(req.body);
        // incase if content-type is application/x-www-form-urlencoded -> we need to change to application/json
        proxyReq.setHeader("Content-Type", "application/json");
        proxyReq.setHeader("Content-Length", Buffer.byteLength(body));
        // stream the content
        proxyReq.write(body);
      }
    };

    if (response && overrides.proxy.target) {
      logger.info("Forwarding request to response override target: %s", overrides.proxy.target);
      logger.debug("Proxy options: %s", inspect(overrides.proxy));
      proxyRequest(req.path, { ...overrides.proxy, onProxyReq: restream })(req, res, next);
    } else if (!response && this.config.proxy.target) {
      logger.info("Forwarding request to global target: %s", this.config.proxy.target);
      logger.debug("Proxy options: %s", inspect(this.config.proxy));
      proxyRequest(req.path, { ...this.config.proxy, onProxyReq: restream })(req, res, next);
    } else {
      next();
    }
  }

  public useSendMiddleware(req: Request, res: IMockExecd): void {
    const { overrides, response, _err } = res.mock;

    if (response) {
      const { headers, cookies, status, body } = response;
      Object.keys(headers || {}).forEach(key => res.set(key, headers[key]));
      Object.keys(cookies || {}).forEach(key => res.cookie(key, cookies[key]));

      setTimeout(() => { return res.status(status).send(body); }, +overrides.delay);
    } else {
      if (_err.name === ResponseModuleNotFoundError.name) {
        res.status(404);
      } else {
        res.status(500);
      }
      logger.error(_err);
      res.send(`${_err.name}: ${_err.message}`);
    }
  }

  public static getInstance(config: IConfig): MockServer {
    if (!MockServer.instance) MockServer.instance = new MockServer(config);
    return MockServer.instance;
  }
}
