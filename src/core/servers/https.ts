import * as shell from "shelljs";

import { existsSync, readFileSync } from "fs";
import { join, relative } from "path";

import { Express } from "express";
import https, { Server } from "https";

import { IConfig } from "../../cli/interfaces";
import logger from "../../logger";

export class HttpsServer {
  private static instance: HttpsServer;
  private static server: Server;
  private config: IConfig;

  private constructor(app: Express, config: IConfig) {
    this.config = config;
    logger.debug("Creating https server");
    HttpsServer.server = https.createServer(this.getOptions(), app);
  }

  private getOptions() {
    const { certsDir } = this.config;
    const certs = relative(process.cwd(), certsDir);
    const key = join(certs, "server.key");
    const cert = join(certs, "server.crt");

    if (!existsSync(key) || !existsSync(cert)) {
      shell.exec(`mkdir -p ${certs} \\
      && openssl req -new -newkey rsa:2048 -days 9999 -nodes -x509 -keyout ${key} -out ${cert} -subj "/C=SG"`
      );
    }

    return {
      key: readFileSync(key),
      cert: readFileSync(cert)
    };
  }

  public static getServer(app: Express, config: IConfig): Server {
    if (!HttpsServer.instance) HttpsServer.instance = new HttpsServer(app, config);
    return HttpsServer.server;
  }
}
