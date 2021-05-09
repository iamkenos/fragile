import { DEFAULT } from "@src/cli/config";
import { MockServer } from "@src/core/servers/mock";

describe("core/servers/httpx", () => {
  afterEach(() => {
    // @ts-ignore
    MockServer.instance = undefined;
  });

  it("should have a mock server singleton", () => {
    expect(MockServer.getInstance(DEFAULT)).toEqual(MockServer.getInstance(DEFAULT));
    expect(MockServer.getInstance(DEFAULT)).toMatchSnapshot();
  });
});
