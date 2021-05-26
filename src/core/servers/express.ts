import bp from "body-parser";
import bpx from "body-parser-xml";
import cp from "cookie-parser";
import crs from "cors";
import express, { Express } from "express";
import multer from "multer";

import { IConfig } from "../../cli/interfaces";
import logger from "../../logger";

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
    const { resourcesDir, cors } = this.config;
    // cors
    if (cors) {
      ExpressServer.server.use(crs({
        credentials: true,
        origin: true,
        exposedHeaders: "*"
      }));
    }
    // enable json request body parsing
    ExpressServer.server.use(bp.json());
    ExpressServer.server.use(bp.urlencoded({ extended: true }));
    // enable multipart formdata parsing
    ExpressServer.server.use(multer().any());
    // enable xml request body parsing
    ExpressServer.server.use(bp.xml({ xmlParseOptions: { explicitArray: false } }));
    // enable cookie parsing; this allows access to req.cookies
    ExpressServer.server.use(cp());
    // enable static files
    ExpressServer.server.use(express.static(resourcesDir));
  }

  public static getServer(config: IConfig): Express {
    if (!ExpressServer.instance) ExpressServer.instance = new ExpressServer(config);
    return ExpressServer.server;
  }
}
