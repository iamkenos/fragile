import UrlPattern from "url-pattern";

import { Request, Response } from "express";
import { Server as NetServer } from "net";
import { Server as HttpServer } from "http";
import { Server as HttpsSever } from "https";

import { IConfig } from "../../cli/interfaces";

export type THttpxServer = NetServer & { http: HttpServer, https: HttpsSever }

export type TMockHook = ({}: IMockArgs) => void

export interface IMock extends Response {
  /** all accessible metadata that the mock response exposes */
  mock: {
    /** the config object used */
    _config: IConfig,
    /** errors encountered while processing the mock */
    _err: Error,
    /** the module's fullpath */
    _fullPath: string;
    /** the module's short path; this is relative to the response folder */
    _shortPath: string;
    /** the fallback module; if a reponse module isnt found using the request path and method.
     * e.g when the response being mocked came from a request that has dynamic path parameters */
    fallback?: IMockFallback;
    /** the response module associated with the current request, determined by the request path and method */
    module: IMockModule;
  }
}

export interface IMockExecd extends IMock {
  mock: IMock["mock"]
    & Partial<IMockReturn>
    & {
      /** response ttl */
      _time: number;
      _chunk: string;
    };
}

export interface IMockFallback {
  urlPattern: UrlPattern;
  wildcards: any;
}

export interface IMockArgs {
  /** express request object */
  req?: Request;
  /** extended express response object; lit. the express response object with an additional `mock` property */
  res?: IMock;
}

export interface IMockReturn {
  /** optional overrides property; useful for setting response module
   * specific settings for the exposed config properties */
  overrides?: IMockResponseOverrides;
  /** the response object you want to mock */
  response: IMockResponse
}

export interface IMockModule {
  ({}: IMockArgs): IMockReturn
}

export interface IMockResponseOverrides {
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
