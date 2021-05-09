import { DEFAULT } from "@src/cli/config";
import { ExpressServer } from "@src/core/servers/express";
import { HttpsServer } from "@src/core/servers/https";

describe("core/servers/https", () => {
  const app = ExpressServer.getServer(DEFAULT);
  afterEach(() => {
    // @ts-ignore
    HttpsServer.instance = undefined;
  });

  it("should have an https server singleton", () => {
    expect(HttpsServer.getServer(app, DEFAULT)).toEqual(HttpsServer.getServer(app, DEFAULT));
  });
});
