import { DEFAULT } from "@src/cli/config";
import { ExpressServer } from "@src/core/servers/express";
import { HttpServer } from "@src/core/servers/http";

describe("core/servers/http", () => {
  const app = ExpressServer.getServer(DEFAULT);
  afterEach(() => {
    // @ts-ignore
    HttpServer.instance = undefined;
  });

  it("should have an express server singleton", () => {
    expect(HttpServer.getServer(app)).toEqual(HttpServer.getServer(app));
    expect(HttpServer.getServer(app)).toMatchSnapshot();
  });
});
