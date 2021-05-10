import { DEFAULT } from "@src/cli/config";
import { ExpressServer } from "@src/core/servers/express";
import { HttpxServer } from "@src/core/servers/httpx";

describe("core/servers/httpx", () => {
  const app = ExpressServer.getServer(DEFAULT);
  afterEach(() => {
    // @ts-ignore
    HttpxServer.instance = undefined;
  });

  it("should have an httpx server singleton", () => {
    expect(HttpxServer.getServer(app, DEFAULT)).toEqual(HttpxServer.getServer(app, DEFAULT));
  });
});
