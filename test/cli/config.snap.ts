// Jest Snapshot v1, https://goo.gl/fbAQLP

exports[`cli/config should expose a cli directory 1`] = `"/cli"`;

exports[`cli/config should expose a config helper intro message 1`] = `
"
----------------------------------
Configuration Helper
----------------------------------"
`;

exports[`cli/config should expose a config helper success message 1`] = `
"
Configuration file was created successfully!
To start serving responses, execute:
$ npx fragile fragile.conf.ts
"
`;

exports[`cli/config should expose a default config 1`] = `
Object {
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
}
`;

exports[`cli/config should expose a local config template file 1`] = `"/resources/fragile.conf.tpl.ejs"`;

exports[`cli/config should expose a local output template file 1`] = `"fragile.conf.ts"`;

exports[`cli/config should expose a prettier config file 1`] = `"/resources/.prettierrc"`;

exports[`cli/config should expose a resources directory 1`] = `"/resources"`;

exports[`cli/config should expose a response module template file 1`] = `"/resources/response.tpl.ejs"`;

exports[`cli/config should expose a samples directory 1`] = `"/samples"`;

exports[`cli/config should expose a samples helper success message 1`] = `
"
Sample files created successfully!
To start serving sample responses, execute:
$ npx fragile ./samples/fragile.conf.ts
"
`;

exports[`cli/config should expose a samples helper tsconfig exists message 1`] = `
"
You seem to have already created a tsconfig.json file.
Consider adding the following:
"
`;

exports[`cli/config should expose a samples tsconfig file 1`] = `"tsconfig.json"`;

exports[`cli/config should expose the cli inquirer questions 1`] = `
Array [
  Object {
    "default": "0.0.0.0",
    "enabled": true,
    "message": "What is the host address do you want your server to listen on?",
    "name": "host",
    "type": "number",
  },
  Object {
    "default": 1080,
    "enabled": true,
    "message": "Which port do you want to use for mocking and proxying requests?",
    "name": "port",
    "type": "number",
  },
  Object {
    "default": true,
    "enabled": true,
    "message": "Would you like to enable CORS?",
    "name": "cors",
    "type": "confirm",
  },
  Object {
    "default": 0,
    "enabled": true,
    "message": "How much delay would you like to set before returning the response?",
    "name": "delay",
    "type": "number",
  },
  Object {
    "choices": Array [
      "silent",
      "error",
      "warn",
      "info",
      "debug",
      "trace",
    ],
    "default": "info",
    "enabled": true,
    "message": "What level of logging verbosity would you like?",
    "name": "logLevel",
    "type": "list",
  },
  Object {
    "default": "./responses",
    "enabled": true,
    "message": "Where would you like your response data to be served from?",
    "name": "responsesDir",
    "type": "input",
    "validate": [Function],
  },
  Object {
    "default": "./resources",
    "enabled": true,
    "message": "Where would you like your static resources to be served from?",
    "name": "resourcesDir",
    "type": "input",
    "validate": [Function],
  },
  Object {
    "default": false,
    "enabled": true,
    "message": "Would you like to record the responses as respoonse modules?",
    "name": "recordResponses",
    "type": "confirm",
  },
  Object {
    "default": "./recordings",
    "enabled": true,
    "message": "Where would you like your recorded responses to be saved?",
    "name": "recordDir",
    "type": "input",
    "validate": [Function],
    "when": [Function],
  },
]
`;

exports[`cli/config should expose the cli options 1`] = `
Array [
  Object {
    "alias": "h",
    "description": "Set the host address for the server to listen on",
    "enabled": true,
    "name": "host",
    "type": "string",
  },
  Object {
    "alias": "p",
    "description": "Set the server port for mocking and proxying requests",
    "enabled": true,
    "name": "port",
    "type": "number",
  },
  Object {
    "alias": "l",
    "description": "Set the level of logging verbosity",
    "enabled": true,
    "name": "logLevel",
    "type": "string",
  },
  Object {
    "alias": "rr",
    "description": "Record api responses and save with the expected response module format",
    "enabled": true,
    "name": "recordResponses",
    "type": "boolean",
  },
]
`;

exports[`cli/config should expose the cli usage message 1`] = `
"
Usage:
  fragile init                        Launches the configuration helper
  fragile samples                     Generate sample files to get started with
  fragile [file]                      Launches the mock server
  fragile [file] [options]            Stdin overrides for certain config properties; See options list below

Complete list of properties:
* Inquired when running the config helper

  * host	  Host address for the server to listen on
  * port	  HTTP and HTTPS port for both mocking and proxying requests
  certsDir	  Base directory of the SSL certs to be used for HTTPS protocol, relative to the config file
  * cors	  Whether to enable the use of CORS
  * delay	  Time in ms, or an object having the \`mix\` and \`max\` delay before returning a response
  etag	  Whether to enable the use of ETag
  * logLevel	  The level of logging verbosity
  proxy	  Object specifying the http proxy options; See https://www.npmjs.com/package/http-proxy-middleware
  rate	  Object having a \`limit\` of rps allowed and the return \`status\` if the limit is reached
  * responsesDir	  Base directory of the response data you want to mock, relative to the config file
  * resourcesDir	  Base directory of static resources (like images) you want to serve, relative to the config file
  * recordResponses	  Whether to record the responses on a defined directory; Use with \`recordDir\`
  * recordDir	  Base directory of the response data recordings, relative to the config file
  urlPatternOpts	  Options to use when matching url patterns; See https://www.npmjs.com/package/url-pattern"
`;
