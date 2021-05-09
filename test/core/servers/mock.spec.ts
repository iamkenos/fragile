import { DEFAULT } from "@src/cli/config";
import { MockServer } from "@src/core/servers/mock";

describe("core/servers/mock", () => {
  afterEach(() => {
    // @ts-ignore
    MockServer.instance = undefined;
    jest.resetAllMocks();
  });

  it("should have a mock server singleton", () => {
    expect(MockServer.getInstance(DEFAULT)).toEqual(MockServer.getInstance(DEFAULT));
    expect(MockServer.getInstance(DEFAULT)).toMatchSnapshot();
  });

  it("should expose a router middleware", () => {
    const instance = MockServer.getInstance(DEFAULT);
    expect(instance.useRouterMiddleware).toMatchSnapshot();
  });

  it("should expose a rate limit middleware", () => {
    const instance = MockServer.getInstance(DEFAULT);
    expect(instance.useRateLimitMiddleware().prototype).toMatchSnapshot();
  });

  it("should expose a logger middleware", () => {
    const instance = MockServer.getInstance(DEFAULT);
    expect(instance.useLoggerMiddleware).toMatchSnapshot();
  });

  it("should expose a proxy middleware", () => {
    const instance = MockServer.getInstance(DEFAULT);
    expect(instance.useProxyMiddleware).toMatchSnapshot();
  });

  it("should expose a send middleware", () => {
    const instance = MockServer.getInstance(DEFAULT);
    expect(instance.useSendMiddleware).toMatchSnapshot();
  });
});
