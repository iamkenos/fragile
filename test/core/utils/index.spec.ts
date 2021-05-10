import * as path from "path";
import {
  getDirsNested,
  getNearestParentDir,
  isJSON,
  isModuleExisting,
  randIntBetween,
  slashify
} from "@src/core/utils";

describe("core/utils", () => {
  it("should expose a utility slashify function: without relative dir", () => {
    expect(slashify("\\foo\\baz\\bar")).toEqual("/foo/baz/bar");
  });

  it("should expose a utility slashify function: with relative dir", () => {
    expect(slashify(process.cwd() + "\\foo\\baz\\bar", process.cwd())).toEqual("/fragile/foo/baz/bar");
  });

  it("should expose a utility randIntBetween function", () => {
    const result = randIntBetween(6, 9);
    expect(result).toBeGreaterThanOrEqual(6);
    expect(result).toBeLessThanOrEqual(9);
  });

  it("should expose a utility getDirsNested function", () => {
    const result = getDirsNested(path.join(process.cwd(), "test", "cli"));
    expect(result).toHaveLength(4);
  });

  it.each`
  file                            | expected
  ${"config.spec.ts"}             | ${"test/cli/config.spec.ts"} 
  ${"foo/gaz/barx/index.spec.ts"} | ${"test/cli"} 
  `("should expose a utility getNearestParentDir function: $file", ({ file, expected }) => {
    const result = getNearestParentDir(path.join("test", "cli", file));
    expect(result).toEqual(expected);
  });

  it.each`
  file                            | expected
  ${"config.spec.ts"}             | ${true} 
  ${"foo/gaz/barx/index.spec.ts"} | ${false} 
  `("should expose a utility isModuleExisting function: $file", ({ file, expected }) => {
    const result = isModuleExisting(path.join(process.cwd(), "test", "cli", file));
    expect(result).toEqual(expected);
  });

  it.each`
  string             | expected
  ${"foobar"}        | ${false} 
  ${"[\"foobar\"]"}  | ${true} 
  ${"{}"}            | ${true} 
  ${"{\"foo\":1}"}   | ${true} 
  ${123}             | ${false} 
  ${{ foo: "bar" }}  | ${false} 
  `("should expose a utility isJSON function: $string", ({ string, expected }) => {
    const result = isJSON(string);
    expect(result).toEqual(expected);
  });
});
