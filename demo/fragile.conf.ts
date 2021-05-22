import { IConfig } from "@iamkenos/fragile";

const config: Partial<IConfig> = {
  recordResponses: true,
  urlPatternOpts: { segmentValueCharset: "a-zA-Z0-9-_~ %.@" },
  postResponseHook: "./hooks/after",
  preResponseHook: "./hooks/before"
};

export default config;
