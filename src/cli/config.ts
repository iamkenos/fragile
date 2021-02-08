import { DEFAULT_LEVEL, LEVELS } from "../logger/config";
import { IConfig, IConfigProperty } from "./interfaces";

export const DEFAULT: IConfig = {
  host: "0.0.0.0",
  port: 1080,
  cors: true,
  delay: 0,
  etag: false,
  logLevel: DEFAULT_LEVEL,
  proxy: { target: "", changeOrigin: true, logLevel: "silent" },
  rate: { limit: 0, status: 429 },
  recordResponses: false,
  recordDir: "./recordings",
  responsesDir: "./responses",
  resourcesDir: "./resources",
  urlPatternOpts: { segmentValueCharset: "a-zA-Z0-9-_~ %.@" }
};

export const CLI_DIR = "/cli";

export const RESOURCES_DIR = "/resources";

export const RESPONSE_MODULE_TPL_FILE = RESOURCES_DIR + "/response.tpl.ejs";

export const PRETTIER_SETTINGS_FILE = RESOURCES_DIR + "/.prettierrc";

export const CONFIG_LOCAL_TPL_FILE = RESOURCES_DIR + "/fragile.conf.tpl.ejs";

export const CONFIG_LOCAL_OUT_FILE = "fragile.conf.ts";

export const SAMPLES_DIR = "/samples";

export const SAMPLES_TS_CONFIG_FILE = "tsconfig.json";

export const CONFIG_HELPER_INTRO = `
----------------------------------
Configuration Helper
----------------------------------`;

export const CONFIG_HELPER_SUCCESS_MESSAGE = `
Configuration file was created successfully!
To start serving responses, execute:
$ npx fragile ${CONFIG_LOCAL_OUT_FILE}
`;

export const SAMPLES_HELPER_SUCCESS_MESSAGE = `
Sample files created successfully!
To start serving sample responses, execute:
$ npx fragile .${SAMPLES_DIR}/${CONFIG_LOCAL_OUT_FILE}
`;

export const SAMPLES_HELPER_TS_CONFIG_EXISTS_MESSAGE = `
You seem to have already created a tsconfig.json file.
Consider adding the following:
`;

const CONFIG_PROPERTIES: IConfigProperty[] = [
  {
    name: "host",
    helptext: "Host address for the server to listen on",
    overrideOption: {
      enabled: true,
      alias: "h",
      type: "string",
      description: "Set the host address for the server to listen on"
    },
    inquiredOption: {
      enabled: true,
      type: "number",
      message: "What is the host address do you want your server to listen on?",
      default: DEFAULT.host
    }
  },
  {
    name: "port",
    helptext: "HTTP, HTTPS, SOCKS and HTTP CONNECT port for both mocking and proxying requests",
    overrideOption: {
      enabled: true,
      alias: "p",
      type: "number",
      description: "Set the server port for mocking and proxying requests"
    },
    inquiredOption: {
      enabled: true,
      type: "number",
      message: "Which port do you want to use for mocking and proxying requests?",
      default: DEFAULT.port
    }
  },
  {
    name: "cors",
    helptext: "Whether to enable the use of CORS",
    inquiredOption: {
      enabled: true,
      type: "confirm",
      message: "Would you like to enable CORS?",
      default: DEFAULT.cors
    }
  },
  {
    name: "delay",
    helptext: "Time in ms, or an object having the `mix` and `max` delay before returning a response",
    inquiredOption: {
      enabled: true,
      type: "number",
      message: "How much delay would you like to set before returning the response?",
      default: DEFAULT.delay
    }
  },
  {
    name: "etag",
    helptext: "Whether to enable the use of ETag"
  },
  {
    name: "logLevel",
    helptext: "The level of logging verbosity",
    overrideOption: {
      enabled: true,
      alias: "l",
      type: "string",
      description: "Set the level of logging verbosity"
    },
    inquiredOption: {
      enabled: true,
      type: "list",
      message: "What level of logging verbosity would you like?",
      choices: LEVELS,
      default: DEFAULT.logLevel
    }
  },
  {
    name: "proxy",
    helptext: "Object specifying the http proxy options; See https://www.npmjs.com/package/http-proxy-middleware"
  },
  {
    name: "rate",
    helptext: "Object having a `limit` of rps allowed and the return `status` if the limit is reached"
  },
  {
    name: "recordResponses",
    helptext: "Whether to record the responses on a defined directory; Use with `recordDir`",
    overrideOption: {
      enabled: true,
      alias: "rr",
      type: "boolean",
      description: "Record api responses and save with the expected response module format"
    }
  },
  {
    name: "recordDir",
    helptext: "Base directory of the response data recordings, relative to the config file; Use with `recordResponses`"
  },
  {
    name: "responsesDir",
    helptext: "Base directory of the response data you want to mock, relative to the config file",
    inquiredOption: {
      enabled: true,
      type: "input",
      message: "Where would you like your response data to be served from?",
      default: DEFAULT.responsesDir,
      validate: answer => (answer.length === 0 ? "This property is required" : true)
    }
  },
  {
    name: "resourcesDir",
    helptext: "Base directory of static resources (like images) you want to serve, relative to the config file",
    inquiredOption: {
      enabled: true,
      type: "input",
      message: "Where would you like your static resources to be served from?",
      default: DEFAULT.resourcesDir,
      validate: answer => (answer.length === 0 ? "This property is required" : true)
    }
  },
  {
    name: "urlPatternOpts",
    helptext: "Options to use when matching url patterns"
  }
];

export const CONFIG_OPTIONS: IConfigProperty[] = CONFIG_PROPERTIES
  .filter((i): boolean | undefined => i.overrideOption && i.overrideOption.enabled)
  .map((i): IConfigProperty => ({
    ...i.overrideOption,
    name: i.name
  }));

export const CONFIG_INQUIRY: IConfigProperty[] = CONFIG_PROPERTIES
  .filter((i): boolean | undefined => i.inquiredOption && i.inquiredOption.enabled)
  .map((i): IConfigProperty => ({
    ...i.inquiredOption,
    name: i.name
  }));

export const USAGE = `
Usage:
  fragile init                        Launches the configuration helper
  fragile samples                     Generate sample files to get started with
  fragile [file]                      Launches the stub server
  fragile [file1] [options]           Stdin overrides for certain config properties; See options list below

Complete list of properties:
* Inquired when running the config helper

${
  CONFIG_PROPERTIES
  // create an array of config property objects containing only the name and helptext properties
    .map((i): IConfigProperty => ({ name: i.name, helptext: i.helptext }))
  // create an array of config property strings marking those inquired with an '*'
    .map((i): string => `  ${CONFIG_INQUIRY
      .filter((j): boolean => i.name === j.name)
      .map((): string => "* ")}${i.name}\t  ${i.helptext}`)
  // transform the array into a big string, each element separated by a line break
    .join("\n")
}`;
