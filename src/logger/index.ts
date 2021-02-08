import chalk from "chalk";
import loglevel from "loglevel";
import prefix from "loglevel-plugin-prefix";
import { NextFunction, Request, Response } from "express";

import Stack from "./stack";
import { DEFAULT_LEVEL, DEFAULT_LOG_COLORS, DEFAULT_NAME, LEVELS } from "./config";

class Log {
  private static instance: Log;
  public logger: loglevel.Logger;
  public getCaller: Function;
  public getCallerFile: Function;

  private constructor() {
    this.getCaller = Stack.getCaller;
    this.getCallerFile = Stack.getCallerFile;
    this.logger = loglevel.getLogger(DEFAULT_NAME);
    this.logger.setLevel(DEFAULT_LEVEL);

    this.applyFormatter();
  }

  private applyFormatter(): void {
    prefix.reg(loglevel);
    prefix.apply(this.logger, {
      template: "%t %l %n",
      timestampFormatter: (date) => chalk.gray(date.toISOString()),
      // @ts-ignore
      levelFormatter: (level) => chalk[DEFAULT_LOG_COLORS[level]](level.toUpperCase()),
      nameFormatter: (name) => chalk.whiteBright(name)
    });
  }

  public static getLogger(): Log {
    if (!Log.instance) Log.instance = new Log();
    return Log.instance;
  }

  public setLevel(level: loglevel.LogLevelDesc): void {
    if (level) {
      if (LEVELS.includes(level.toString())) {
        this.logger.setLevel(level);
      } else {
        this.warn("Logging level %s isn't supported. Use any one of %s", level, LEVELS);
      }
    }
  }

  public error(message: any, ...args: any[]): void {
    const prefix = this.logger.getLevel() === 0 ? `${this.getCallerFile()} ` : "";
    this.logger.error(`${prefix}${message}`, ...args);
  }

  public warn(message: any, ...args: any[]): void {
    const prefix = this.logger.getLevel() === 0 ? `${this.getCallerFile()} ` : "";
    this.logger.warn(`${prefix}${message}`, ...args);
  }

  public info(message: any, ...args: any[]): void {
    const prefix = this.logger.getLevel() === 0 ? `${this.getCallerFile()} ` : "";
    this.logger.info(`${prefix}${message}`, ...args);
  }

  public debug(message: any, ...args: any[]): void {
    const prefix = this.logger.getLevel() === 0 ? `${this.getCallerFile()} ` : "";
    this.logger.debug(`${prefix}${message}`, ...args);
  }

  public trace(message: any, ...args: any[]): void {
    const prefix = this.logger.getLevel() === 0 ? `${this.getCallerFile()} ` : "";
    this.logger.trace(`${prefix}${message}`, ...args);
  }
}

export class ExpressLog {
  private static instance: ExpressLog;
  private logger: loglevel.Logger;

  private constructor() {
    this.logger = Log.getLogger().logger;
    this.useLoggerMiddleware = this.useLoggerMiddleware.bind(this);
  }

  public static getLogger(): ExpressLog {
    if (!ExpressLog.instance) ExpressLog.instance = new ExpressLog();
    return ExpressLog.instance;
  }

  public useLoggerMiddleware(
    req: Request & { time: number },
    res: Response & { time: number, body: string },
    next: NextFunction): void {
    req.time = +new Date();
    const end = res.end;

    const jsonParse = (str: string) => {
      try {
        return JSON.parse(str);
      } catch (e) {
        return undefined;
      }
    };

    const chunkParse = (chunk: string, isjson: boolean) => {
      const chunkStr = chunk && chunk.toString();
      if (isjson) return (jsonParse(chunk) || chunkStr); else return chunkStr;
    };

    // @ts-ignore
    res.end = (chunk: any, encoding: BufferEncoding) => {
      res.time = +new Date() - req.time;
      res.end = end;
      res.end(chunk, encoding);

      if (chunk) {
        const isJson = ((res.getHeader("content-type") as string)?.indexOf("json") >= 0);
        const body = chunk.toString();
        res.body = chunkParse(body, isJson);
      }

      const meta = JSON.stringify({
        request: { headers: req.headers, method: req.method, path: req.url, qs: req.query, body: req.body },
        response: { headers: res.getHeaders(), status: res.statusCode, body: res.body }
      }, null, 2);

      this.logger.getLevel() >= 2 && this.logger.info("%s %s %s %sms", req.method, res.statusCode, req.url, res.time);
      this.logger.debug("%s %s %s %sms \n%s", req.method, res.statusCode, req.url, res.time, meta);
    };
    next();
  }
}

export default Log.getLogger();
