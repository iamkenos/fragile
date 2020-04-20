import bp from "body-parser";
import bpx from "body-parser-xml";
import cors from "cors";
import express, { Express } from "express";

import { IConfig } from "../../cli/interfaces";
import logger from "../../logger";

export class ExpressServer {
  private static instance: ExpressServer;
  private static server: Express;

  private constructor(config: IConfig) {
    logger.debug("Creating express server");
    ExpressServer.server = express();

    bpx(bp); // initialize body-parser-xml so it gets included in the bode-parser middleware
    this.loadSettings(config);
    this.loadMiddleware(config);
  }

  private loadSettings(config: IConfig): void {
    // prettify json response body
    ExpressServer.server.set("json spaces", 2);
    // set etag
    ExpressServer.server.set("etag", config.etag);
  }

  private loadMiddleware(config: IConfig): void {
    // cors
    if (config.cors) { ExpressServer.server.use(cors()); }
    // enable json request body parsing
    ExpressServer.server.use(bp.json());
    ExpressServer.server.use(bp.urlencoded({ extended: true }));
    // enable xml request body parsing
    ExpressServer.server.use(bp.xml({ xmlParseOptions: { explicitArray: false } }));
    // enable static files
    ExpressServer.server.use(express.static(config.resourcesDir));
  }

  public static getServer(config: IConfig): Express {
    if (!ExpressServer.instance) ExpressServer.instance = new ExpressServer(config);
    return ExpressServer.server;
  }
}
