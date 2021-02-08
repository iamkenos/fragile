import { IConfig } from "../cli/interfaces";
import { ExpressServer, HttpServer, MockServer } from "./servers";
import logger from "../logger";

export default (config: IConfig): void => {
  const mock = MockServer.getInstance(config);
  const express = ExpressServer.getServer(config)
    .use(mock.useRouterMiddleware)
    .use(mock.useRateLimitMiddleware())
    .use(mock.useLoggerMiddleware)
    .use(mock.useProxyMiddleware)
    .use(mock.useSendMiddleware);
  const http = HttpServer.getServer(express);

  http.listen(config.port, config.host, () => logger.info("Http server listening on %s:%s", config.host, config.port));
};
