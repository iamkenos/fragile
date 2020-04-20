import { Request, Response } from "express";
import { IConfig } from "../../cli/interfaces";
export interface IResponseConfigOverrides {
  rate?: IConfig["rate"];
  delay?: IConfig["delay"];
}

export interface IResponse {
  status: number;
  headers?: { [key: string]: any };
  cookies?: { [key: string]: any };
  body: any;
}

export interface IResponseModuleArgs {
  req?: Request;
  res?: Response;
  wildcards?: any;
}

export interface IResponseModuleReturn {
  overrides?: IResponseConfigOverrides;
  response: IResponse
}

export interface IResponseModule {
  ({}: IResponseModuleArgs): IResponseModuleReturn
}
