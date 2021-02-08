import { existsSync } from "fs";
import { join } from "path";
import { Arguments } from "yargs";

import logger from "../logger";
import { CONFIG_OPTIONS } from "./config";
import { createLocalConfig, createparsedConfig } from "./commands/init";
import { generateSamples } from "./commands/samples";
import { inspect } from "./utils";
require("@babel/register")({ presets: ["@babel/preset-env"] });
require("tsconfig-paths/register");
require("ts-node/register");

export default (args: Arguments<any>): any => {
  // show help and exit if there are no arguments provided
  args.argv._.length === 0 && args.showHelp() && process.exit(0);

  // build the cli overrides object
  const overrides: any = CONFIG_OPTIONS
    .filter((i): boolean => args.argv[i.name])
    .reduce((i, j): object => ({ ...i, [j.name]: args.argv[j.name] }), {});
  logger.setLevel(overrides.logLevel);
  logger.debug("Started with args: \n%s", inspect(args.argv));
  logger.debug("Override options: \n%s", inspect(overrides));

  const firstArg = args.argv._[0];
  const localConfigFile = join(process.cwd(), firstArg);

  // if the first argument is "init"
  // then run the config helper
  if (firstArg === "init") {
    return createLocalConfig();
  }

  // if the first argument is "whistle"
  // then run the samples helper
  if (firstArg === "samples") {
    return generateSamples();
  }

  // if the provided config file exists
  // then parse the contents
  if (existsSync(localConfigFile)) {
    return createparsedConfig(firstArg, overrides);
  }

  // if the provided config file doesn't exist
  // then run the config helper
  if (!existsSync(localConfigFile)) {
    logger.warn("Config file '%s' not found", localConfigFile);
    return createLocalConfig();
  }
};
