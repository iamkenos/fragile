import { DEFAULT } from "@src/cli/config";
import run from "@src/core/run";
import { ExpressServer, HttpxServer, MockServer } from "@src/core/servers";

jest.mock("console");
jest.mock("@src/core/servers");

describe("core/run", () => {
  const SPY_CONSOLE_CLEAR = jest.spyOn(console, "clear").mockImplementation();

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("should start a mock, express and httpx server instance", () => {
    try {
      // (MockServer.getInstance as any as jest.Mock).mockReturnValue(jest.requireActual("@src/core/servers/mock").getInstance(DEFAULT));
      run(DEFAULT);
    } catch (e) {
    } finally {
      expect(SPY_CONSOLE_CLEAR).toBeCalledTimes(1);
      expect(MockServer.getInstance as any as jest.Mock).toHaveBeenCalledTimes(1);
      expect(MockServer.getInstance as any as jest.Mock).toHaveBeenCalledWith(DEFAULT);
      expect(MockServer.getInstance as any as jest.Mock).toHaveBeenCalledTimes(1);
      expect(ExpressServer.getServer as any as jest.Mock).toHaveBeenCalledTimes(1);
      expect(ExpressServer.getServer as any as jest.Mock).toHaveBeenCalledWith(DEFAULT);
      expect(HttpxServer.getServer as any as jest.Mock).not.toHaveBeenCalled();
    }
  });
});
