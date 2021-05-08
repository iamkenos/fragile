import { DEFAULT_LEVEL, DEFAULT_LOG_COLORS, DEFAULT_NAME, LEVELS, STACK_TRACE_DEPTH } from "@src/logger/config";

describe("logger/config", () => {
  const colors = {
    silent: "white",
    error: "red",
    warn: "yellow",
    info: "cyanBright",
    debug: "green",
    trace: "cyan"
  };

  it("should have a stack trace depth: 2", () => {
    expect(STACK_TRACE_DEPTH).toEqual(2);
  });

  it("should have a default name: fragile", () => {
    expect(DEFAULT_NAME).toEqual("fragile");
  });

  it("should have a default level: info", () => {
    expect(DEFAULT_LEVEL).toEqual("info");
  });

  it("should have default colors", () => {
    expect(DEFAULT_LOG_COLORS).toEqual(colors);
  });

  it("should have default levels", () => {
    expect(LEVELS).toEqual(Object.keys(DEFAULT_LOG_COLORS));
  });
});
