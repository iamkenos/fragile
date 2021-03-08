import { Request, Response } from "express";
import UrlPattern from "url-pattern";
import { Server as NetServer } from "net";
import { Server as HttpServer } from "http";
import { Server as HttpsSever } from "https";

import { IConfig } from "../../cli/interfaces";

export type THttpxServer = NetServer & { http: HttpServer, https: HttpsSever }

export interface IModuleTime {
  moduleTime: number
}

export interface IModuleOverrides {
  proxy?: IConfig["proxy"];
  rate?: IConfig["rate"];
  delay?: IConfig["delay"];
}

export interface IModuleResponse {
  status: number;
  headers?: { [key: string]: any };
  cookies?: { [key: string]: any };
  body: any;
}

export interface IModuleArgs {
  req?: Request;
  res?: Response & Partial<IModuleMeta>;
}

export interface IModuleReturn {
  moduleOverrides?: IModuleOverrides;
  moduleResponse: IModuleResponse
}

export interface IModuleMeta extends IModuleReturn, IModuleTime {
  moduleError: Error;
  moduleFullPath: string;
  modulePath: string;
  moduleFallback?: { urlPattern: UrlPattern; wildcards: any; };
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

export interface IResponseModule {
  ({}: IModuleArgs): IModuleReturn
}
