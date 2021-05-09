import * as path from "path";
import {
  CONFIG_LOCAL_TPL_FILE,
  RESOURCES_DIR,
  RESPONSE_MODULE_TPL_FILE,
  SAMPLES_TS_CONFIG_FILE
} from "@src/cli/config";
import { readFileSync } from "@src/cli/utils";

describe("cli/resources", () => {
  it("should expose a local config template file", () => {
    const file = path.join(process.cwd(), "build", "cli", CONFIG_LOCAL_TPL_FILE);
    expect(readFileSync(file)).toMatchSnapshot();
  });

  it("should expose a response module template file", () => {
    const file = path.join(process.cwd(), "build", "cli", RESPONSE_MODULE_TPL_FILE);
    expect(readFileSync(file)).toMatchSnapshot();
  });

  it("should expose a ts config template file", () => {
    const file = path.join(process.cwd(), "build", "cli", RESOURCES_DIR, SAMPLES_TS_CONFIG_FILE);
    expect(readFileSync(file)).toMatchSnapshot();
  });
});
