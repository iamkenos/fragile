import * as ejs from "ejs";
import * as prettier from "prettier";
import * as fs from "fs-extra";
import * as inquirer from "inquirer";
import * as path from "path";
import merge from "lodash.merge";

import logger from "../../logger";
import { LEVELS } from "../../logger/config";
import {
  CONFIG_HELPER_INTRO,
  CONFIG_HELPER_SUCCESS_MESSAGE,
  CONFIG_INQUIRY,
  CONFIG_LOCAL_OUT_FILE,
  CONFIG_LOCAL_TPL_FILE,
  DEFAULT,
  PRETTIER_SETTINGS_FILE
} from "../config";
import { inspect, readFileSync, resolvePath } from "../utils";
import { IConfig } from "../interfaces";

function createFromTemplate(source: any, templateFile: string, outputFile: string): string {
  const fmt = readFileSync(path.join(__dirname, "../", PRETTIER_SETTINGS_FILE));
  const renderedFmt = { ...JSON.parse(fmt), parser: "babel" };

  const tpl = readFileSync(path.join(__dirname, "../", templateFile));
  const renderedTpl = ejs.render(tpl, { answers: source });

  if (fs.existsSync(outputFile)) {
    logger.debug("Deleting existing file %s", outputFile);
    fs.unlinkSync(outputFile);
  }

  logger.debug("Writing to file %s", outputFile);
  fs.outputFileSync(outputFile, prettier.format(renderedTpl, renderedFmt));

  logger.debug("Finished!");
  return outputFile;
}

export async function createLocalConfig(): Promise<any> {
  try {
    console.log(CONFIG_HELPER_INTRO.trim());

    const answers = await inquirer.prompt(CONFIG_INQUIRY);
    const outputFile = path.join(process.cwd(), CONFIG_LOCAL_OUT_FILE);
    const config: IConfig = { ...DEFAULT, ...answers };

    createFromTemplate(config, CONFIG_LOCAL_TPL_FILE, outputFile);

    console.log(CONFIG_HELPER_SUCCESS_MESSAGE.trim());

    process.exit(0);
  } catch (error) {
    logger.error(error);
    throw new Error(error);
  }
}

export function createParsedConfig(sourceFile: string, overrides: any): IConfig {
  try {
    const configFile = path.join(process.cwd(), sourceFile);
    const configDir = path.dirname(configFile);
    const config: IConfig = merge({}, DEFAULT, require(configFile).default, overrides);

    // soft check for logLevel
    if (!LEVELS.includes((config.logLevel as string))) {
      logger.warn("Logging level %s isn't supported. Use any one of %s", config.logLevel, LEVELS);
      logger.info("Falling back to logging level [%s]...", DEFAULT.logLevel);
      config.logLevel = DEFAULT.logLevel;
    }
    logger.setLevel(config.logLevel);

    // final manipulation for webdriverio config properties
    const parsed = {
      ...config,
      certsDir: resolvePath(configDir, config.certsDir),
      recordDir: resolvePath(configDir, config.recordDir),
      responsesDir: resolvePath(configDir, config.responsesDir),
      resourcesDir: resolvePath(configDir, config.resourcesDir)
    };

    logger.debug("Raw config:\n%s", inspect(config));
    logger.debug("Parsed config:\n%s", inspect(parsed));

    return parsed;
  } catch (error) {
    logger.error(error);
    throw new Error(error);
  }
}
