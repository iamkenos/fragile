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

  it("should error when user doesn't provide a valid responsesDir value", () => {
    const responsesDir: any = CONFIG_INQUIRY.find(i => i.name === "responsesDir");
    expect(responsesDir.validate("")).toEqual("This property is required");
  });

  it("should not error when user provides a valid responsesDir value", () => {
    const responsesDir: any = CONFIG_INQUIRY.find(i => i.name === "responsesDir");
    expect(responsesDir.validate("foobar")).toEqual(true);
  });

  it("should error when user doesn't provide a valid resourcesDir value", () => {
    const resourcesDir: any = CONFIG_INQUIRY.find(i => i.name === "resourcesDir");
    expect(resourcesDir.validate("")).toEqual("This property is required");
  });

  it("should not error when user provides a valid resourcesDir value", () => {
    const resourcesDir: any = CONFIG_INQUIRY.find(i => i.name === "resourcesDir");
    expect(resourcesDir.validate("foobar")).toEqual(true);
  });

  it("should ask for a recordDir value when recordResponses is true", () => {
    const answers = {
      recordResponses: true
    };
    const recordDir: any = CONFIG_INQUIRY.find(i => i.name === "recordDir");
    expect(recordDir.when(answers)).toEqual(true);
  });

  it("should not ask for a recordDir value when recordResponses is false", () => {
    const answers = {
      recordResponses: false
    };
    const recordDir: any = CONFIG_INQUIRY.find(i => i.name === "recordDir");
    expect(recordDir.when(answers)).toEqual(false);
  });

  it("should error when user doesn't provide a valid recordDir value", () => {
    const answers = {
      responsesDir: "foobar",
      resourcesDir: "goobaz"
    };
    const recordDir: any = CONFIG_INQUIRY.find(i => i.name === "recordDir");
    expect(recordDir.validate("", answers)).toEqual("This property is required");
  });

  it("should error when user provides recordDir with the same value as responsesDir value", () => {
    const answers = {
      responsesDir: "foobar",
      resourcesDir: "goobaz"
    };
    const recordDir: any = CONFIG_INQUIRY.find(i => i.name === "recordDir");
    expect(recordDir.validate("foobar", answers)).toEqual("This cannot be the same as `responsesDir` or `resourcesDir`");
  });

  it("should error when user provides recordDir with the same value as resourcesDir value", () => {
    const answers = {
      responsesDir: "foobar",
      resourcesDir: "goobaz"
    };
    const recordDir: any = CONFIG_INQUIRY.find(i => i.name === "recordDir");
    expect(recordDir.validate("goobaz", answers)).toEqual("This cannot be the same as `responsesDir` or `resourcesDir`");
  });

  it("should not error when user provides a valid recordDir value", () => {
    const answers = {
      responsesDir: "foobar",
      resourcesDir: "goobaz"
    };
    const recordDir: any = CONFIG_INQUIRY.find(i => i.name === "recordDir");
    expect(recordDir.validate("foobaz", answers)).toEqual(true);
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
