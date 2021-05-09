import {
  CLI_DIR,
  CONFIG_HELPER_INTRO,
  CONFIG_HELPER_SUCCESS_MESSAGE,
  CONFIG_INQUIRY,
  CONFIG_LOCAL_OUT_FILE,
  CONFIG_LOCAL_TPL_FILE,
  CONFIG_OPTIONS,
  DEFAULT,
  PRETTIER_SETTINGS_FILE,
  RESOURCES_DIR,
  RESPONSE_MODULE_TPL_FILE,
  SAMPLES_DIR,
  SAMPLES_HELPER_SUCCESS_MESSAGE,
  SAMPLES_HELPER_TS_CONFIG_EXISTS_MESSAGE,
  SAMPLES_TS_CONFIG_FILE,
  USAGE
} from "@src/cli/config";

describe("cli/config", () => {
  it("should expose a default config", () => {
    expect(DEFAULT).toMatchSnapshot();
  });

  it("should expose a cli directory", () => {
    expect(CLI_DIR).toMatchSnapshot();
  });

  it("should expose a resources directory", () => {
    expect(RESOURCES_DIR).toMatchSnapshot();
  });

  it("should expose a response module template file", () => {
    expect(RESPONSE_MODULE_TPL_FILE).toMatchSnapshot();
  });

  it("should expose a prettier config file", () => {
    expect(PRETTIER_SETTINGS_FILE).toMatchSnapshot();
  });

  it("should expose a local config template file", () => {
    expect(CONFIG_LOCAL_TPL_FILE).toMatchSnapshot();
  });

  it("should expose a local output template file", () => {
    expect(CONFIG_LOCAL_OUT_FILE).toMatchSnapshot();
  });

  it("should expose a samples directory", () => {
    expect(SAMPLES_DIR).toMatchSnapshot();
  });

  it("should expose a samples tsconfig file", () => {
    expect(SAMPLES_TS_CONFIG_FILE).toMatchSnapshot();
  });

  it("should expose a config helper intro message", () => {
    expect(CONFIG_HELPER_INTRO).toMatchSnapshot();
  });

  it("should expose a config helper success message", () => {
    expect(CONFIG_HELPER_SUCCESS_MESSAGE).toMatchSnapshot();
  });

  it("should expose a samples helper success message", () => {
    expect(SAMPLES_HELPER_SUCCESS_MESSAGE).toMatchSnapshot();
  });

  it("should expose a samples helper tsconfig exists message", () => {
    expect(SAMPLES_HELPER_TS_CONFIG_EXISTS_MESSAGE).toMatchSnapshot();
  });

  it("should expose the cli options", () => {
    expect(CONFIG_OPTIONS).toMatchSnapshot();
  });

  it("should expose the cli inquirer questions", () => {
    expect(CONFIG_INQUIRY).toMatchSnapshot();
  });

  it("should expose the cli usage message", () => {
    expect(USAGE).toMatchSnapshot();
  });
});
