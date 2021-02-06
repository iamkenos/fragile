import { IConfig } from "@iamkenos/fragile";

const config: IConfig = {
  host: "0.0.0.0",
  port: 1080,
  cors: true,
  rate: { limit: 0, status: 429 },
  delay: 0,
  etag: false,
  logLevel: "warn",
  responsesDir: "./responses",
  resourcesDir: "./resources",
  urlPatternOpts: { segmentValueCharset: "a-zA-Z0-9-_~ %.@" }
};

export default config;
