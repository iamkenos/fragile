// Jest Snapshot v1, https://goo.gl/fbAQLP

exports[`core/servers/httpx should have a mock server singleton 1`] = `
MockServer {
  "SUPPORTED_RESPONSE_TYPES": Array [
    "/**/*.{ts,js}",
  ],
  "config": Object {
    "certsDir": "./certs",
    "cors": true,
    "delay": 0,
    "etag": false,
    "host": "0.0.0.0",
    "logLevel": "info",
    "port": 1080,
    "proxy": Object {
      "changeOrigin": true,
      "logLevel": "silent",
      "target": "",
    },
    "rate": Object {
      "limit": 0,
      "status": 429,
    },
    "recordDir": "./recordings",
    "recordResponses": false,
    "resourcesDir": "./resources",
    "responsesDir": "./responses",
    "urlPatternOpts": Object {
      "segmentValueCharset": "a-zA-Z0-9-_~ %.@",
    },
  },
  "useLoggerMiddleware": [Function],
  "useProxyMiddleware": [Function],
  "useRateLimitMiddleware": [Function],
  "useRouterMiddleware": [Function],
  "useSendMiddleware": [Function],
}
`;
