import { IConfig } from "@iamkenos/fragile";

const config: IConfig = {
  host: "0.0.0.0",
  port: 1080,
  cors: true,
  delay: 0,
  etag: false,
  logLevel: "warn",
  proxy: { target: "", changeOrigin: true, logLevel: "silent" },
  recordResponses: false,
  recordDir: "./recordings",
  responsesDir: "./responses",
  resourcesDir: "./resources",
  urlPatternOpts: { segmentValueCharset: "a-zA-Z0-9-_~ %.@" }
};

export default config;
