import { LogLevelDesc } from "loglevel";
import { ChoiceCollection, Question, QuestionMap } from "inquirer";
import { UrlPatternOptions } from "url-pattern";
import { Options } from "yargs";
import { Options as ProxyOptions } from "http-proxy-middleware";

interface IOverrideOption {
  alias?: Options["alias"];
  enabled: boolean;
  type: Options["type"];
  description: Options["description"];
}

interface IInquiredOption extends Question {
  enabled: boolean;
  type: keyof QuestionMap;
  message: Question["message"];
  default: Question["default"];
  choices?: ChoiceCollection;
  when?: (answers: any) => boolean | Promise<boolean>;
}

export interface IConfigProperty {
  name: keyof IConfig;
  helptext?: string;
  overrideOption?: IOverrideOption;
  inquiredOption?: IInquiredOption;
}

export interface IConfig {
  /** Host address for the server to listen on */
  host: string;
  /** HTTP and HTTPS port for both mocking and proxying requests */
  port: number;
  /** Base directory of the SSL certs to be used for HTTPS protocol, relative to the config file */
  certsDir: string;
  /** Whether to enable the use of CORS */
  cors: boolean;
  /** Time in ms, or an object having the `mix` and `max` delay before returning a response */
  delay: number | { min: number, max: number }
  /** Whether to enable the use of ETag */
  etag: boolean;
  /** The level of logging verbosity */
  logLevel: LogLevelDesc;
  /** Object having a `limit` of rps allowed and the return `status` if the limit is reached */
  rate: { status?: number, limit?: number }
  /** Object specifying the http proxy options; See https://www.npmjs.com/package/http-proxy-middleware */
  proxy: ProxyOptions;
  /** Whether to record the responses on a defined directory; Use with `recordDir` */
  recordResponses: boolean;
  /** Base directory of the response data recordings, relative to the config file */
  recordDir: string;
  /** Base directory of the response data you want to mock, relative to the config file */
  responsesDir: string;
  /** Base directory of static resources (like images) you want to serve, relative to the config file */
  resourcesDir: string;
  /** Options to use when matching url patterns; See https://www.npmjs.com/package/url-pattern */
  urlPatternOpts: UrlPatternOptions;
}
