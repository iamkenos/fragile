import * as path from "path";
import { NextFunction, Request, Response } from "express";

import { IConfig } from "../../cli/interfaces";
import { IResponseModule } from "../interfaces";
import { isModuleExisting, randBetween } from "../utils";
import logger from "../../logger";

export class MockServer {
  private static instance: MockServer;
  private config: IConfig

  private constructor(config: IConfig) {
    this.config = config;
    this.routerMiddleware = this.routerMiddleware.bind(this);
  }

  private getResponsModule(req: Request): IResponseModule {
    const modulePath = path.join(this.config.responsesDir, req.path, req.method);

    if (isModuleExisting(modulePath)) {
      return require(modulePath).default;
    } else {
      // TODO:
      // handle wildcards
    }
  }

  public routerMiddleware(req: Request, res: Response): void {
    const result = this.getResponsModule(req)({ req: req, res: res });
    const overrides = result.overrides;
    const response = result.response;
    const delay = overrides?.delay || this.config.delay;
    const time = typeof delay === "number" ? delay : randBetween(delay.min, delay.max);

    Object.keys(response.headers || {}).forEach(key => res.set(key, response.headers[key]));
    Object.keys(response.cookies || {}).forEach(key => res.append("Set-Cookie", `${key}=${response.cookies[key]}`));
    setTimeout(() => { return res.status(response.status).send(response.body); }, time);
  }

  public static getInstance(config: IConfig): MockServer {
    if (!MockServer.instance) MockServer.instance = new MockServer(config);
    return MockServer.instance;
  }
}
