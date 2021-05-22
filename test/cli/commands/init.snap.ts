// Jest Snapshot v1, https://goo.gl/fbAQLP

exports[`cli/commands/init should allow creating a local config file: { delay: { min: 6, max: 9 }, recordResponses: false } 1`] = `
Array [
  Array [
    "----------------------------------
Configuration Helper
----------------------------------",
  ],
  Array [
    "Configuration file was created successfully!
To start serving responses, execute:
$ npx fragile fragile.conf.ts",
  ],
]
`;

exports[`cli/commands/init should allow creating a local config file: { delay: { min: 6, max: 9 }, recordResponses: false } 2`] = `
"import { IConfig } from \\"@iamkenos/fragile\\";

const config: Partial<IConfig> = {
  host: \\"6.9.6.9\\",
  port: 3000,
  cors: false,
  certsDir: \\"./certs\\",
  delay: { min: 6, max: 9 },
  etag: false,
  logLevel: \\"info\\",
  preResponseHook: \\"\\",
  postResponseHook: \\"\\",
  proxy: { target: \\"\\", changeOrigin: true, logLevel: \\"silent\\" },
  rate: { limit: 0, status: 429 },
  recordResponses: false,
  recordDir: \\"./gar\\",
  responsesDir: \\"./foo\\",
  resourcesDir: \\"./bar\\",
  urlPatternOpts: { segmentValueCharset: \\"a-zA-Z0-9-_~ %.@\\" }
};

export default config;
"
`;

exports[`cli/commands/init should allow creating a local config file: { delay: 0, recordResponses: false } 1`] = `
Array [
  Array [
    "----------------------------------
Configuration Helper
----------------------------------",
  ],
  Array [
    "Configuration file was created successfully!
To start serving responses, execute:
$ npx fragile fragile.conf.ts",
  ],
]
`;

exports[`cli/commands/init should allow creating a local config file: { delay: 0, recordResponses: false } 2`] = `
"import { IConfig } from \\"@iamkenos/fragile\\";

const config: Partial<IConfig> = {
  host: \\"6.9.6.9\\",
  port: 3000,
  cors: false,
  certsDir: \\"./certs\\",
  delay: 0,
  etag: false,
  logLevel: \\"info\\",
  preResponseHook: \\"\\",
  postResponseHook: \\"\\",
  proxy: { target: \\"\\", changeOrigin: true, logLevel: \\"silent\\" },
  rate: { limit: 0, status: 429 },
  recordResponses: false,
  recordDir: \\"./gar\\",
  responsesDir: \\"./foo\\",
  resourcesDir: \\"./bar\\",
  urlPatternOpts: { segmentValueCharset: \\"a-zA-Z0-9-_~ %.@\\" }
};

export default config;
"
`;

exports[`cli/commands/init should allow creating a local config file: { delay: 0, recordResponses: true } 1`] = `
Array [
  Array [
    "----------------------------------
Configuration Helper
----------------------------------",
  ],
  Array [
    "Configuration file was created successfully!
To start serving responses, execute:
$ npx fragile fragile.conf.ts",
  ],
]
`;

exports[`cli/commands/init should allow creating a local config file: { delay: 0, recordResponses: true } 2`] = `
"import { IConfig } from \\"@iamkenos/fragile\\";

const config: Partial<IConfig> = {
  host: \\"6.9.6.9\\",
  port: 3000,
  cors: false,
  certsDir: \\"./certs\\",
  delay: 0,
  etag: false,
  logLevel: \\"info\\",
  preResponseHook: \\"\\",
  postResponseHook: \\"\\",
  proxy: { target: \\"\\", changeOrigin: true, logLevel: \\"silent\\" },
  rate: { limit: 0, status: 429 },
  recordResponses: true,
  recordDir: \\"./gar\\",
  responsesDir: \\"./foo\\",
  resourcesDir: \\"./bar\\",
  urlPatternOpts: { segmentValueCharset: \\"a-zA-Z0-9-_~ %.@\\" }
};

export default config;
"
`;

exports[`cli/commands/init should allow creating a local config file: { preResponseHook: 'foo/bar', postResponseHook: 'foo/baz' } 1`] = `
Array [
  Array [
    "----------------------------------
Configuration Helper
----------------------------------",
  ],
  Array [
    "Configuration file was created successfully!
To start serving responses, execute:
$ npx fragile fragile.conf.ts",
  ],
]
`;

exports[`cli/commands/init should allow creating a local config file: { preResponseHook: 'foo/bar', postResponseHook: 'foo/baz' } 2`] = `
"import { IConfig } from \\"@iamkenos/fragile\\";

const config: Partial<IConfig> = {
  host: \\"6.9.6.9\\",
  port: 3000,
  cors: false,
  certsDir: \\"./certs\\",
  delay: 0,
  etag: false,
  logLevel: \\"info\\",
  preResponseHook: \\"foo/bar\\",
  postResponseHook: \\"foo/baz\\",
  proxy: { target: \\"\\", changeOrigin: true, logLevel: \\"silent\\" },
  rate: { limit: 0, status: 429 },
  recordResponses: false,
  recordDir: \\"./gar\\",
  responsesDir: \\"./foo\\",
  resourcesDir: \\"./bar\\",
  urlPatternOpts: { segmentValueCharset: \\"a-zA-Z0-9-_~ %.@\\" }
};

export default config;
"
`;

exports[`cli/commands/init should allow parsing of the local config file: { host: 'localhost', logLevel: 'foobar' } 1`] = `
Object {
  "certsDir": Any<String>,
  "cors": false,
  "delay": 0,
  "etag": false,
  "host": "localhost",
  "logLevel": "info",
  "port": 3000,
  "postResponseHook": Any<String>,
  "preResponseHook": Any<String>,
  "proxy": Object {
    "changeOrigin": true,
    "logLevel": "silent",
    "target": "",
  },
  "rate": Object {
    "limit": 0,
    "status": 429,
  },
  "recordDir": Any<String>,
  "recordResponses": false,
  "resourcesDir": Any<String>,
  "responsesDir": Any<String>,
  "urlPatternOpts": Object {
    "segmentValueCharset": "a-zA-Z0-9-_~ %.@",
  },
}
`;

exports[`cli/commands/init should allow parsing of the local config file: { logLevel: 'error' } 1`] = `
Object {
  "certsDir": Any<String>,
  "cors": false,
  "delay": 0,
  "etag": false,
  "host": "6.9.6.9",
  "logLevel": "error",
  "port": 3000,
  "postResponseHook": Any<String>,
  "preResponseHook": Any<String>,
  "proxy": Object {
    "changeOrigin": true,
    "logLevel": "silent",
    "target": "",
  },
  "rate": Object {
    "limit": 0,
    "status": 429,
  },
  "recordDir": Any<String>,
  "recordResponses": false,
  "resourcesDir": Any<String>,
  "responsesDir": Any<String>,
  "urlPatternOpts": Object {
    "segmentValueCharset": "a-zA-Z0-9-_~ %.@",
  },
}
`;

exports[`cli/commands/init should allow parsing of the local config file: { port: 6969, recordResponses: 'true' } 1`] = `
Object {
  "certsDir": Any<String>,
  "cors": false,
  "delay": 0,
  "etag": false,
  "host": "6.9.6.9",
  "logLevel": "info",
  "port": 6969,
  "postResponseHook": Any<String>,
  "preResponseHook": Any<String>,
  "proxy": Object {
    "changeOrigin": true,
    "logLevel": "silent",
    "target": "",
  },
  "rate": Object {
    "limit": 0,
    "status": 429,
  },
  "recordDir": Any<String>,
  "recordResponses": "true",
  "resourcesDir": Any<String>,
  "responsesDir": Any<String>,
  "urlPatternOpts": Object {
    "segmentValueCharset": "a-zA-Z0-9-_~ %.@",
  },
}
`;

exports[`cli/commands/init should allow parsing of the local config file: { preResponseHook: 'foo/bar', postResponseHook: 'foo/baz' } 1`] = `
Object {
  "certsDir": Any<String>,
  "cors": false,
  "delay": 0,
  "etag": false,
  "host": "6.9.6.9",
  "logLevel": "info",
  "port": 3000,
  "postResponseHook": Any<String>,
  "preResponseHook": Any<String>,
  "proxy": Object {
    "changeOrigin": true,
    "logLevel": "silent",
    "target": "",
  },
  "rate": Object {
    "limit": 0,
    "status": 429,
  },
  "recordDir": Any<String>,
  "recordResponses": false,
  "resourcesDir": Any<String>,
  "responsesDir": Any<String>,
  "urlPatternOpts": Object {
    "segmentValueCharset": "a-zA-Z0-9-_~ %.@",
  },
}
`;
