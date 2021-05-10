import * as fs from "fs";
import * as glob from "glob";
import * as path from "path";
import { inspect, readFileSync, resolveFiles, resolvePath } from "@src/cli/utils";

jest.mock("fs");
jest.mock("glob");
jest.mock("path", () => ({
  ...jest.requireActual("path"),
  resolve: jest.fn()
}));

afterEach(() => {
  jest.resetAllMocks();
});

describe("cli/utils", () => {
  it("should expose a utility inspect function", () => {
    const object = {
      foo: 1,
      bar: {
        baz: "qux",
        gar: [{ loo: "suz" }]
      }
    };
    expect(inspect(object)).toMatchSnapshot();
  });

  it("should expose a utility readFileSync function", () => {
    try {
      readFileSync("foobar");
    } finally {
      expect((fs.readFileSync as any as jest.Mock)).toHaveBeenCalledWith("foobar", "utf8");
    }
  });

  it("should expose a utility resolvePath function: with filePath", () => {
    resolvePath("foobar", "goobaz");
    expect((path.resolve as any as jest.Mock)).toHaveBeenCalledWith("foobar", "goobaz");
  });

  it("should expose a utility resolvePath function: without filePath", () => {
    const result = resolvePath("foobar");
    expect((path.resolve as any as jest.Mock)).not.toHaveBeenCalled();
    expect(result).toEqual("");
  });

  it("should expose a utility resolveFiles function: valid glob, strict mode", () => {
    const resolved = jest.requireActual("path").resolve(path.join(process.cwd(), "test/cli/utils/*.ts"));
    (path.resolve as any as jest.Mock).mockReturnValue(resolved);
    (glob.sync as any as jest.Mock).mockReturnValue(["foo", "bar", "baz"]);
    resolveFiles(process.cwd(), ["test/cli/utils/*.ts"]);
    expect((glob.sync as any as jest.Mock)).toHaveBeenCalledWith(resolved);
  });

  it("should expose a utility resolveFiles function: invalid glob, strict mode", () => {
    let error: Error;
    let result: string[];

    try {
      result = resolveFiles(process.cwd(), []);
    } catch (e) {
      error = e;
    } finally {
      expect(error).toBeDefined();
      expect(result).toBeUndefined();
      expect((glob.sync as any as jest.Mock)).not.toHaveBeenCalled();
    }
  });

  it("should expose a utility resolveFiles function: invalid glob, non-strict mode", () => {
    let error: Error;
    let result: string[];

    try {
      result = resolveFiles(process.cwd(), [], false);
    } catch (e) {
      error = e;
    } finally {
      expect(error).toBeUndefined();
      expect(result.length).toEqual(0);
    }
  });
});
