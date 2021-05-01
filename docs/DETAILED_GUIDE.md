# Detailed Guide

➤ [Home](../README.md)

---

## Table of contents

1. [CLI tool](#cli-tool)
2. [Creating mocks](#creating-mocks)
3. [Configurations](#configurations)

For simplicity, all the examples shown below will be the same ones you get from running the `samples` command.

## CLI tool

Refer to the help menu for a quick overview of CLI usage and accepted commands

`npx fragile --help`

```txt
Usage:
  fragile init                        Launches the configuration helper
  fragile samples                     Generate sample files to get started with
  fragile [file]                      Launches the mock server
  fragile [file] [options]            Stdin overrides for certain config properties; See options list below

Complete list of properties:
* Inquired when running the config helper

  * host             Host address for the server to listen on
  * port             HTTP and HTTPS port for both mocking and proxying requests
  certsDir           Base directory of the SSL certs to be used for HTTPS protocol, relative to the config file
  * cors             Whether to enable the use of CORS
  * delay            Time in ms, or an object having the `mix` and `max` delay before returning a response
  etag               Whether to enable the use of ETag
  * logLevel         The level of logging verbosity
  proxy              Object specifying the http proxy options; See https://www.npmjs.com/package/http-proxy-middleware
  rate               Object having a `limit` of rps allowed and the return `status` if the limit is reached
  * responsesDir     Base directory of the response data you want to mock, relative to the config file
  * resourcesDir     Base directory of static resources (like images) you want to serve, relative to the config file
  * recordResponses  Whether to record the responses on a defined directory; Use with `recordDir`
  * recordDir        Base directory of the response data recordings, relative to the config file
  urlPatternOpts     Options to use when matching url patterns; See https://www.npmjs.com/package/url-pattern

Options:
      --help                   Show help                                                                       [boolean]
      --version                Show version number                                                             [boolean]
  -h, --host                   Set the host address for the server to listen on                                 [string]
  -p, --port                   Set the server port for mocking and proxying requests                            [number]
  -l, --logLevel               Set the level of logging verbosity                                               [string]
      --recordResponses, --rr  Record api responses and save with the expected response module format          [boolean]
```

### Commands

- `init`:

  - `$ npx fragile init`
  - launches an inquirer prompt that generates a default configuration file `fragile.conf.ts` based on the answers provided; the file will be on the same directory as where the command is executed

- `samples`:

  - `$ npx fragile samples`
  - generates sample files to get you started with; the files will be generated inside on a `samples` directory, relative to where the command is executed

### Arguments

- `[file]`:

  - `$ npx fragile fragile.conf.ts`
  - Launches an express server that serves mock responses based on the contents parsed from the config file provided

### Options

- apart from the options `--help` and `--version`, all the other options are intended to be used as runtime overrides — hence, a config file is required; see the [configuration overrides](##overrides) section below for usage

## Creating mocks

Best check the samples command!

## Configurations

### Properties

```txt
+==========================+===========================================+============================================================+
| Option                   | Default                                   | Description                                                |
+==========================+===========================================+============================================================+
| host                     | 0.0.0.0                                   | Host address for the server to listen on                   |
+--------------------------+-------------------------------------------+------------------------------------------------------------+
| port                     | 1080                                      | HTTP and HTTPS port for both mocking and proxying requests |
+--------------------------+-------------------------------------------+------------------------------------------------------------+
| certsDir                 | true                                      | Base directory of the SSL certs to be used for             |
|                          |                                           | HTTPS protocol, relative to the config file                |
+--------------------------+-------------------------------------------+------------------------------------------------------------+
| cors                     | ./certs                                   | Whether to enable the use of CORS               .          |
+--------------------------+-------------------------------------------+------------------------------------------------------------+
| delay                    | 0                                         | Time in ms, or an object having the `mix` and `max`        |
|                          |                                           | delay before returning a response                          |
+--------------------------+-------------------------------------------+------------------------------------------------------------+
| etag                     | false                                     | Whether to enable the use of ETag                          |
+--------------------------+-------------------------------------------+------------------------------------------------------------+
| logLevel                 | info                                      | The level of logging verbosity                             |
+--------------------------+-------------------------------------------+------------------------------------------------------------+
| proxy                    | {                                         | Object specifying the http proxy options;                  |
|                          |   target: "",                             | See https://www.npmjs.com/package/http-proxy-middleware    |
|                          |   changeOrigin: true,                     |                                                            |
|                          |   logLevel: "silent"                      |                                                            |
|                          | }                                         |                                                            |
+--------------------------+-------------------------------------------+------------------------------------------------------------+
| rate                     | { limit: 0, status: 429 }                 | Object having a `limit` of rps allowed and the             |
|                          |                                           | return `status` if the limit is reached                    |
+--------------------------+-------------------------------------------+------------------------------------------------------------+
| responsesDir             | ./responses                               | Base directory of the response data you want to mock,      |
|                          |                                           | relative to the config file                                |
+--------------------------+-------------------------------------------+------------------------------------------------------------+
| resourcesDir             | ./resources                               | Base directory of static resources (like images)           |
|                          |                                           | you want to serve, relative to the config file             |
+--------------------------+-------------------------------------------+------------------------------------------------------------+
| recordResponses          | false                                     | Whether to record the responses on a defined directory;    |
|                          |                                           | Use with `recordDir`                                       |
+--------------------------+-------------------------------------------+------------------------------------------------------------+
| recordDir                | ./recordings                              | Base directory of the response data recordings,            |
|                          |                                           | relative to the config file                                |
+--------------------------+-------------------------------------------+------------------------------------------------------------+
| urlPatternOpts           | {                                         | Options to use when matching url patterns;                 |
|                          |   segmentValueCharset: "a-zA-Z0-9-_~ %.@" | See https://www.npmjs.com/package/url-pattern              |
|                          | }                                         |                                                            |
+--------------------------+-------------------------------------------+------------------------------------------------------------+

```

### Overrides

Certain configuration properties can be overriden from the command line by passing in the keys as options.

For instance, to start the server with recording enabled and set the logging level to debug:

`npx fragile fragile.conf.ts --rr --l debug`

| Key             | Alias | Description                                                            |
| --------------- | ----- | ---------------------------------------------------------------------- |
| host            | h     | Set the host address for the server to listen on                       |
| port            | p     | et the server port for mocking and proxying requests                   |
| logLevel        | l     | Set the level of logging verbosity                                     |
| recordResponses | rr    | Record api responses and save with the expected response module format |
