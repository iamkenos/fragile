import * as path from "path";
import { NextFunction, Request, Response } from "express";
import { createProxyMiddleware as proxyRequest } from "http-proxy-middleware";
import limit from "express-rate-limit";
import merge from "lodash.merge";
import UrlPattern from "url-pattern";

import { IConfig } from "../../cli/interfaces";
import { inspect, resolveFiles } from "../../cli/utils";
import { getDirsNested, getNearestParentDir, isModuleExisting, randIntBetween, slashify } from "../utils";
import { ResponseModuleNotFoundError, ResponseModuleRequiredPropertyNotFoundError } from "../../exceptions";
import { IModuleMeta, IModuleReturn, IResponseModule } from "../interfaces";
import logger from "../../logger";

export class MockServer {
  private static instance: MockServer;
  private config: IConfig
  private SUPPORTED_RESPONSE_TYPES = ["/**/*.{ts,js}"];

  private constructor(config: IConfig) {
    this.config = config;
    this.useRouterMiddleware = this.useRouterMiddleware.bind(this);
    this.useRateLimitMiddleware = this.useRateLimitMiddleware.bind(this);
    this.useProxyMiddleware = this.useProxyMiddleware.bind(this);
    this.useEndMiddleware = this.useEndMiddleware.bind(this);

    // preload responses to reduce overhead on initial request
    resolveFiles(config.responsesDir, this.SUPPORTED_RESPONSE_TYPES, false).forEach(file => require(file));
  }

  private assignResponseModule(req: Request, res: Response & IModuleMeta): void {
    const { responsesDir, urlPatternOpts } = this.config;
    const module = path.join(responsesDir, req.path, req.method);
    const moduleShort = slashify(module, responsesDir);

    if (isModuleExisting(module)) {
      logger.info("Response: %s", moduleShort);
      res.moduleFullPath = module;
      res.modulePath = moduleShort;
    } else {
      // if the expected response module isn't found, look for a fallback module
      // fallback modules are matched based on a defined wildcard pattern basically
      // to handle requests with dynamic path paremeters e.g. /api/foo/1 to /api/foo/100

      // define fallback directories; matches /_abc123
      // then look for the closest match, relative to the nearest parent
      const wildcardPattern = /(?<token>\/_(?<param>[\dA-z]+))/g;
      const nearestParent = getNearestParentDir(module);
      const segmentCount = (p: string) => p.split("/").length;
      const fallbackPath = (p: string) => path.join(responsesDir, p, req.method);
      const fallbackDetails = (shortPath: string) => {
        // here we form a string to 'tokenize' such fallback directories
        // it's really just changing it from /_abc123 to (/:abc123)
        // this is mainly so we can catch those as 'wildcards' for url pattern matching
        // the loop here is for nested fallback directories
        let matches: RegExpExecArray;
        let tokenizedPath = shortPath;
        do {
          matches = wildcardPattern.exec(shortPath);
          if (matches) {
            tokenizedPath = tokenizedPath.replace(matches.groups.token, `(/:${matches.groups.param})`);
          }
        } while (matches);

        // see [this](https://www.npmjs.com/package/url-pattern)
        const urlPattern = new UrlPattern(tokenizedPath, urlPatternOpts);
        const wildcards = urlPattern.match(path.join(req.path, req.method));
        return { urlPattern: urlPattern, wildcards: wildcards };
      };

      if (nearestParent !== responsesDir) {
        const fallbackCandidates = getDirsNested(nearestParent)
          .map(dir => slashify(dir, responsesDir))
          .filter(dir =>
            dir.match(wildcardPattern) &&
            segmentCount(dir) === segmentCount(req.path) &&
            isModuleExisting(fallbackPath(dir)))
          .map(dir => fallbackPath(dir));

        if (fallbackCandidates.length === 0) throw new ResponseModuleNotFoundError(moduleShort);

        // totally possible, default to the first match if this happens
        const fallback = fallbackCandidates[0];
        const fallbackShort = slashify(fallback, responsesDir);
        if (fallbackCandidates.length > 1) {
          logger.warn("Found multiple fallback candidates");
          logger.warn("Defaulting to first match: %s", fallbackShort);
        }

        logger.info("Response: %s", fallbackShort);
        res.moduleFullPath = fallback;
        res.modulePath = fallbackShort;
        res.moduleFallback = fallbackDetails(fallbackShort);
      } else {
        throw new ResponseModuleNotFoundError(moduleShort);
      }
    }
  }

  private execResponseModule(req: Request, res: Response & IModuleMeta): void {
    const { delay, proxy, rate } = this.config;
    const returned = require(res.moduleFullPath).default as IResponseModule;
    const { moduleResponse, moduleOverrides } = returned({ req: req, res: res });
    const computedDelay = (d: IConfig["delay"]) => typeof d === "number" ? d : randIntBetween(d.min, d.max);

    if (!moduleResponse) throw new ResponseModuleRequiredPropertyNotFoundError("moduleResponse", res.modulePath);

    // create `moduleResponse` and `moduleOverrides` properties on the response
    // object so we can use these on the final handler before the cycle ends
    res.moduleResponse = moduleResponse;
    res.moduleOverrides = merge({}, { delay, proxy, rate }, moduleOverrides);
    res.moduleOverrides.delay = computedDelay(res.moduleOverrides.delay);
  }

  public useRouterMiddleware(req: Request, res: Response & IModuleMeta, next: NextFunction): void {
    try {
      this.assignResponseModule(req, res);
      this.execResponseModule(req, res);
    } catch (e) {
      if (e.name === ResponseModuleNotFoundError.name) {
        logger.warn("Response module not found: %s", res.modulePath);
      } else {
        logger.error(e);
      }
    }
    next();
  }

  public useRateLimitMiddleware(req: Request, res: Response & IModuleMeta, next: NextFunction): void {
    const { moduleResponse, moduleOverrides } = res;
    // doesnt work:
    // https://github.com/nfriedly/express-rate-limit/issues/221
    limit({
      windowMs: 1000,
      max: moduleOverrides.rate.limit,
      handler: (req: Request, res: Response & IModuleReturn, next: NextFunction) => {
        moduleResponse.status = moduleOverrides.rate.status;
        moduleResponse.body = "Request per second limit has been reached";
        next();
      }
    })(req, res, next);
  }

  public useProxyMiddleware(req: Request, res: Response & IModuleMeta, next: NextFunction): void {
    const { moduleOverrides, moduleResponse } = res;

    if (moduleResponse && moduleOverrides.proxy.target) {
      logger.info("Forwarding request to response override target: %s", moduleOverrides.proxy.target);
      logger.debug("Proxy options: %s", inspect(moduleOverrides.proxy));
      proxyRequest(req.path, moduleOverrides.proxy)(req, res, next);
    } else if (!moduleResponse && this.config.proxy.target) {
      logger.info("Forwarding request to global target: %s", this.config.proxy.target);
      logger.debug("Proxy options: %s", inspect(this.config.proxy));
      proxyRequest(req.path, this.config.proxy)(req, res, next);
    } else {
      next();
    }
  }

  public useEndMiddleware(req: Request, res: Response & IModuleMeta): void {
    const { moduleResponse, moduleOverrides } = res;
    const { headers, cookies, status, body } = moduleResponse;
    Object.keys(headers || {}).forEach(key => res.set(key, headers[key]));
    Object.keys(cookies || {}).forEach(key => res.cookie(key, cookies[key]));

    setTimeout(() => { return res.status(status).send(body); }, +moduleOverrides.delay);
  }

  public static getInstance(config: IConfig): MockServer {
    if (!MockServer.instance) MockServer.instance = new MockServer(config);
    return MockServer.instance;
  }
}
