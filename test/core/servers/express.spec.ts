import { DEFAULT } from "@src/cli/config";
import { ExpressServer } from "@src/core/servers/express";

describe("core/servers/express", () => {
  afterEach(() => {
    // @ts-ignore
    ExpressServer.instance = undefined;
  });

  it("should have an express server singleton", () => {
    expect(ExpressServer.getServer(DEFAULT)).toEqual(ExpressServer.getServer(DEFAULT));
    expect(ExpressServer.getServer(DEFAULT).settings).toMatchSnapshot({ views: expect.any(String) });
    expect(ExpressServer.getServer(DEFAULT)._router.stack).toMatchSnapshot();
  });

  it("should not apply cors when set to false ", () => {
    const config = { ...DEFAULT, cors: false };
    expect(ExpressServer.getServer(config)).toMatchSnapshot();
    expect(ExpressServer.getServer(config).settings).toMatchSnapshot({ views: expect.any(String) });
    expect(ExpressServer.getServer(config)._router.stack).toMatchSnapshot();
  });
});
