import { Express } from "express";
import net from "net";

import { IConfig } from "../../cli/interfaces";
import { THttpxServer } from "../interfaces";
import { HttpServer } from "./http";
import { HttpsServer } from "./https";

import logger from "../../logger";

export class HttpxServer {
  private static instance: HttpxServer;
  private static server: THttpxServer;

  private constructor(app: Express, config: IConfig) {
    logger.debug("Creating http/s server");
    this.createNetServer(app, config);
  }

  private createNetServer(app: Express, config: IConfig) {
    // haxxor copy pasta powers from https://stackoverflow.com/a/42019773/2285470
    const server = net.createServer(socket => {
      socket.once("data", buffer => {
        socket.pause();
        const byte = buffer[0];

        let protocol: string;
        if (byte === 22) {
          protocol = "https";
        } else if (byte > 32 && byte < 127) {
          protocol = "http";
        }

        const proxy = server[protocol];
        if (proxy) {
          socket.unshift(buffer);
          proxy.emit("connection", socket);
        }
        process.nextTick(() => socket.resume());
      });
    }) as THttpxServer;

    server.http = HttpServer.getServer(app);
    server.https = HttpsServer.getServer(app, config);
    HttpxServer.server = server;
  }

  public static getServer(app: Express, config: IConfig): net.Server {
    if (!HttpxServer.instance) HttpxServer.instance = new HttpxServer(app, config);
    return HttpxServer.server;
  }
}
