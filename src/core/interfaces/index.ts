import { Request, Response } from "express";
import UrlPattern from "url-pattern";
import { Server as NetServer } from "net";
import { Server as HttpServer } from "http";
import { Server as HttpsSever } from "https";

import { IConfig } from "../../cli/interfaces";

export type THttpxServer = NetServer & { http: HttpServer, https: HttpsSever }

export interface IMockTime {
  _mockTime: number
}

export interface IModuleOverrides {
  proxy?: IConfig["proxy"];
  rate?: IConfig["rate"];
  delay?: IConfig["delay"];
}

export interface IMockResponse {
  status: number;
  headers?: { [key: string]: any };
  cookies?: { [key: string]: any };
  body: any;
}

export interface IMockArgs {
  req?: Request;
  res?: Response & Partial<IMockMeta>;
}

export interface IMockReturn {
  mockOverrides?: IModuleOverrides;
  mockResponse: IMockResponse
}

export interface IMockMeta extends IMockReturn, IMockTime {
  _mockErr: Error;
  _mockFullPath: string;
  _mockPath: string;
  _mockFallback?: { urlPattern: UrlPattern; wildcards: any; };
}

export interface ILoggedMeta {
  request: {
    headers: Request["headers"];
    method: Request["method"];
    path: Request["path"];
    query: Request["query"];
    body: Request["body"];
  },
  response: {
    statusCode: Response["statusCode"];
    headers: any;
    body: any;
  }
}

export interface IMockModule {
  ({}: IMockArgs): IMockReturn
}
