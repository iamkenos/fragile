import { LogLevelDesc } from "loglevel";
import { ChoiceCollection, Question, QuestionMap } from "inquirer";
import { UrlPatternOptions } from "url-pattern";
import { Options } from "yargs";

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
  host?: string;
  port?: number;
  cors?: boolean;
  delay?: number | { min: number, max: number }
  etag?: boolean;
  logLevel?: LogLevelDesc;
  rate?: { status?: number, limit?: number }
  responsesDir?: string;
  resourcesDir?: string;
  urlPatternOpts?: UrlPatternOptions;
}
