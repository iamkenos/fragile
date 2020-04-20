import { IConfig } from "../build";

const config: IConfig = {
  port: 1080,
  cors: false,
  delay: 200,
  logLevel: "trace",
  responsesDir: "./responses",
  resourcesDir: "./resources",
  urlPatternOpts: {}
};

export default config;
