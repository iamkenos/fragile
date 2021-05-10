import net from "net";
import { DEFAULT } from "@src/cli/config";
import run from "@src/core/run";
import { ExpressServer, HttpxServer, MockServer } from "@src/core/servers";

jest.mock("console");
jest.mock("net", () => ({
  createServer: jest.fn(() => ({ listen: jest.fn() }))
}));

describe("core/run", () => {
  const SPY_MOCK_SERVER_GET_INSTANCE = jest.spyOn(MockServer, "getInstance");
  const SPY_EXPRESS_SERVER_GET_SERVER = jest.spyOn(ExpressServer, "getServer");
  const SPY_HTTPX_SERVER_GET_SERVER = jest.spyOn(HttpxServer, "getServer");
  const SPY_CONSOLE_CLEAR = jest.spyOn(console, "clear").mockImplementation();

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("should start a mock, express and httpx server instance", () => {
    run(DEFAULT);
    expect(SPY_CONSOLE_CLEAR).toBeCalledTimes(1);
    expect(SPY_MOCK_SERVER_GET_INSTANCE).toHaveBeenCalledTimes(1);
    expect(SPY_MOCK_SERVER_GET_INSTANCE).toHaveBeenCalledWith(DEFAULT);
    expect(SPY_MOCK_SERVER_GET_INSTANCE).toHaveBeenCalledTimes(1);
    expect(SPY_EXPRESS_SERVER_GET_SERVER).toHaveBeenCalledTimes(1);
    expect(SPY_EXPRESS_SERVER_GET_SERVER).toHaveBeenCalledWith(DEFAULT);
    expect(SPY_HTTPX_SERVER_GET_SERVER).toHaveBeenCalledTimes(1);
    expect(SPY_HTTPX_SERVER_GET_SERVER).toHaveBeenCalledWith(ExpressServer.getServer(DEFAULT), DEFAULT);
    expect(net.createServer).toHaveBeenCalled();
  });
});
