import {
  ResponseModuleNotFoundError,
  ResponseModuleRequiredPropertyNotFoundError,
  UnsupportedFileTypeError
} from "@src/exceptions";

describe("exceptions", () => {
  it("should expose a ResponseModuleNotFoundError", () => {
    const error = new ResponseModuleNotFoundError("foobar");
    expect(error).toMatchSnapshot();
  });

  it("should expose a ResponseModuleRequiredPropertyNotFoundError", () => {
    const error = new ResponseModuleRequiredPropertyNotFoundError("foobar", "foobaz");
    expect(error).toMatchSnapshot();
  });

  it("should expose a UnsupportedFileTypeError", () => {
    const error = new UnsupportedFileTypeError("foobar", ["foobaz", "gooby"]);
    expect(error).toMatchSnapshot();
  });
});
