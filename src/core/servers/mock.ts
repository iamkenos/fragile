import * as path from "path";
import { NextFunction, Request, Response } from "express";
import UrlPattern from "url-pattern";
import limit from "express-rate-limit";

import { IConfig } from "../../cli/interfaces";
import { resolveFiles } from "../../cli/utils";
import { getDirsNested, getNearestParentDir, isModuleExisting, randIntBetween, slashify } from "../utils";
import { ResponseModuleNotFoundError } from "../../exceptions";
import { IResponseModule, IResponseModuleFallbackDetails, IResponseModuleReturn } from "../interfaces";
import logger from "../../logger";

export class MockServer {
  private static instance: MockServer;
  private config: IConfig
  private SUPPORTED_RESPONSE_TYPES = ["/**/*.{ts,js}"];

  private constructor(config: IConfig) {
    this.config = config;
    this.useRouterMiddleware = this.useRouterMiddleware.bind(this);
    this.useRateLimitMiddleware = this.useRateLimitMiddleware.bind(this);
    this.useEndMiddleware = this.useEndMiddleware.bind(this);

    // preload responses to reduce overhead on initial request
    resolveFiles(config.responsesDir, this.SUPPORTED_RESPONSE_TYPES, false).forEach(file => require(file));
  }

  private getComputedDelay(delay: IConfig["delay"]): number {
    return typeof delay === "number" ? delay : randIntBetween(delay.min, delay.max);
  }

  private getResponseModule(req: Request): { module: IResponseModule, fallback?: IResponseModuleFallbackDetails } {
    const { responsesDir, urlPatternOpts } = this.config;
    const module = path.join(responsesDir, req.path, req.method);
    const moduleShort = slashify(module, responsesDir);

    if (isModuleExisting(module)) {
      logger.info("Response: %s", moduleShort);
      return { module: require(module).default };
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
        return { module: require(fallback).default, fallback: fallbackDetails(fallbackShort) };
      } else {
        throw new ResponseModuleNotFoundError(moduleShort);
      }
    }
  }

  public useRouterMiddleware(req: Request, res: Response & IResponseModuleReturn, next: NextFunction): void {
    try {
      const responseModule = this.getResponseModule(req);
      const returned = responseModule.module({ req: req, res: res, fallback: responseModule.fallback });
      const { overrides, response } = returned;
      const computedRate = overrides?.rate || this.config.rate;
      const computedDelay = this.getComputedDelay(overrides?.delay || this.config.delay);
      // create `response` and `overrides` properties on the express response object
      // this is so we can use these on the final handler before the cycle ends
      res.response = response;
      res.overrides = { rate: computedRate, delay: computedDelay };
    } catch (e) {
      logger.warn("Unable to get mock response for: %s %s", req.method, req.path);
    }
    next();
  }

  public useRateLimitMiddleware(req: Request, res: Response & IResponseModuleReturn, next: NextFunction): void {
    const { response, overrides } = res;
    // doesnt work:
    // https://github.com/nfriedly/express-rate-limit/issues/221
    limit({
      windowMs: 1000,
      max: overrides?.rate.limit || this.config.rate.limit,
      handler: (req: Request, res: Response & IResponseModuleReturn, next: NextFunction) => {
        response.status = overrides?.rate.status || this.config.rate.status;
        response.body = "Request per second limit has been reached";
        next();
      }
    })(req, res, next);
  }

  public useEndMiddleware(req: Request, res: Response & IResponseModuleReturn): void {
    const { response, overrides } = res;
    Object.keys(response.headers || {}).forEach(key => res.set(key, response.headers[key]));
    Object.keys(response.cookies || {}).forEach(key => res.append("Set-Cookie", `${key}=${response.cookies[key]}`));

    setTimeout(
      () => { return res.status(response.status).send(response.body); },
      this.getComputedDelay(overrides?.delay || this.config.delay)
    );
  }

  public static getInstance(config: IConfig): MockServer {
    if (!MockServer.instance) MockServer.instance = new MockServer(config);
    return MockServer.instance;
  }
}
