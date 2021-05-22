import * as fs from "fs-extra";
import * as inquirer from "inquirer";
import * as path from "path";
import { readFileSync } from "@src/cli/utils";
import { createLocalConfig, createParsedConfig } from "@src/cli/commands/init";
import { CONFIG_LOCAL_OUT_FILE, CONFIG_LOCAL_TPL_FILE, DEFAULT } from "@src/cli/config";

jest.mock("@src/cli/utils", () => ({
  ...jest.requireActual("@src/cli/utils"),
  readFileSync: jest.fn()
}));
jest.mock("fs-extra", () => ({
  ...jest.requireActual("fs-extra"),
  existsSync: jest.fn(),
  unlinkSync: jest.fn()
}));
jest.mock("inquirer");
jest.mock("process");

describe("cli/commands/init", () => {
  const SPY_CONSOLE_LOG = jest.spyOn(console, "log");
  const SPY_PROCESS_EXIT = jest.spyOn(process, "exit").mockImplementation((code: number) => code as never);
  const configPath = path.join(process.cwd(), CONFIG_LOCAL_OUT_FILE);
  const deleteConfig = () => jest.requireActual("fs-extra").unlinkSync(configPath);
  const fmt = fs.readFileSync(path.join(process.cwd(), ".prettierrc"));
  const tpl = fs.readFileSync(path.join(process.cwd(), "src", "cli", CONFIG_LOCAL_TPL_FILE), "utf-8");
  const args = {
    host: "6.9.6.9",
    port: 3000,
    cors: false,
    delay: 0,
    logLevel: "info",
    responsesDir: "./foo",
    resourcesDir: "./bar",
    recordResponses: false,
    recordDir: "./gar"
  };

  beforeEach(() => {
    (readFileSync as any as jest.Mock).mockReturnValueOnce(fmt).mockReturnValueOnce(tpl);
  });

  afterEach(() => {
    jest.resetAllMocks();

    try {
      deleteConfig();
    } catch (e) {

    }
  });

  it.each([
    { delay: 0, recordResponses: false },
    { delay: { min: 6, max: 9 }, recordResponses: false },
    { delay: 0, recordResponses: true },
    { preResponseHook: "foo/bar", postResponseHook: "foo/baz" }
  ])("should allow creating a local config file: %o", async(ans) => {
    (inquirer.prompt as any as jest.Mock).mockResolvedValue({ ...args, ...ans });
    (fs.existsSync as any as jest.Mock).mockReturnValue(true);
    await createLocalConfig();

    // check it deletes existing file
    expect(fs.unlinkSync).toHaveBeenCalled();

    // check it creates the file
    const config = fs.readFileSync(path.join(process.cwd(), CONFIG_LOCAL_OUT_FILE), "utf-8");
    expect(SPY_CONSOLE_LOG.mock.calls).toMatchSnapshot();
    expect(SPY_PROCESS_EXIT).toHaveBeenCalledWith(0);
    expect(config).toMatchSnapshot();
  });

  it("should throw an error when something goes wrong while creating a local config file", async() => {
    (inquirer.prompt as any as jest.Mock).mockRejectedValue({});
    let error: Error;

    try {
      await createLocalConfig();
    } catch (e) {
      error = e;
    } finally {
      expect(error).toBeDefined();
    }
  });

  it.each([
    { logLevel: "error" },
    { host: "localhost", logLevel: "foobar" },
    { port: 6969, recordResponses: "true" },
    { preResponseHook: "foo/bar", postResponseHook: "foo/baz" }
  ])("should allow parsing of the local config file: %o", async(overrides) => {
    (inquirer.prompt as any as jest.Mock).mockResolvedValue(args);
    await createLocalConfig();
    const parsed = createParsedConfig(CONFIG_LOCAL_OUT_FILE, overrides);
    expect(parsed).toMatchSnapshot({
      certsDir: expect.any(String),
      recordDir: expect.any(String),
      resourcesDir: expect.any(String),
      responsesDir: expect.any(String),
      preResponseHook: expect.any(String),
      postResponseHook: expect.any(String)
    });
    expect(parsed.certsDir).toEqual(path.join(process.cwd(), DEFAULT.certsDir));
    expect(parsed.recordDir).toEqual(path.join(process.cwd(), args.recordDir));
    expect(parsed.resourcesDir).toEqual(path.join(process.cwd(), args.resourcesDir));
    expect(parsed.responsesDir).toEqual(path.join(process.cwd(), args.responsesDir));
  });

  it("should throw an error when something goes wrong while parsing the local config file", async() => {
    (inquirer.prompt as any as jest.Mock).mockResolvedValue(args);
    await createLocalConfig();
    let error: Error;

    try {
      createParsedConfig("foobar", {});
    } catch (e) {
      error = e;
    } finally {
      expect(error).toBeDefined();
    }
  });
});
