import { IConfig } from "../cli/interfaces";
import { ExpressServer, HttpxServer, MockServer } from "./servers";
import logger from "../logger";

export default (config: IConfig): void => {
  console.clear();

  const mock = MockServer.getInstance(config);
  const app = ExpressServer.getServer(config)
    .use(mock.useRouterMiddleware)
    .use(mock.useRateLimitMiddleware())
    .use(mock.useLoggerMiddleware)
    .use(mock.useProxyMiddleware)
    .use(mock.useSendMiddleware);

  HttpxServer.getServer(app, config)
    .listen(config.port, config.host, () => logger.info("Http/s server listening on %s:%s", config.host, config.port));
};
