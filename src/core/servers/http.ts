import { Express } from "express";
import http, { Server } from "http";

import logger from "../../logger";

export class HttpServer {
  private static instance: HttpServer;
  private static server: Server;

  private constructor(app: Express) {
    logger.debug("Creating http server");
    HttpServer.server = http.createServer(app);
  }

  public static getServer(app: Express): Server {
    if (!HttpServer.instance) HttpServer.instance = new HttpServer(app);
    return HttpServer.server;
  }
}
