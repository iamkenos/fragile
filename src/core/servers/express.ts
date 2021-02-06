import bp from "body-parser";
import bpx from "body-parser-xml";
import crs from "cors";
import express, { Express } from "express";
import limit from "express-rate-limit";

import { IConfig } from "../../cli/interfaces";
import logger, { ExpressLog } from "../../logger";

export class ExpressServer {
  private static instance: ExpressServer;
  private static server: Express;
  private config: IConfig;

  private constructor(config: IConfig) {
    logger.debug("Creating express server");
    ExpressServer.server = express();

    bpx(bp); // initialize body-parser-xml so it gets included in the bode-parser middleware
    this.config = config;
    this.loadSettings();
    this.loadMiddleware();
  }

  private loadSettings(): void {
    const { etag } = this.config;
    // prettify json response body
    ExpressServer.server.set("json spaces", 2);
    // set etag
    ExpressServer.server.set("etag", etag);
    // proxy
    ExpressServer.server.set("trust proxy", 1);
  }

  private loadMiddleware(): void {
    const { resourcesDir, cors, rate } = this.config;
    // cors
    if (cors) { ExpressServer.server.use(crs()); }
    // request / response logging
    ExpressServer.server.use(ExpressLog.getLogger().useLoggerMiddleware);
    // enable json request body parsing
    ExpressServer.server.use(bp.json());
    ExpressServer.server.use(bp.urlencoded({ extended: true }));
    // enable xml request body parsing
    ExpressServer.server.use(bp.xml({ xmlParseOptions: { explicitArray: false } }));
    // enable static files
    ExpressServer.server.use(express.static(resourcesDir));
    // enable request per second limit
    ExpressServer.server.use(limit({ windowMs: 1000, max: rate.limit, statusCode: rate.status }));
  }

  public static getServer(config: IConfig): Express {
    if (!ExpressServer.instance) ExpressServer.instance = new ExpressServer(config);
    return ExpressServer.server;
  }
}
