<h1 align="center">FRAGILE</h1>

<p align="center">
  <a href="./docs/DETAILED_GUIDE.md">Detailed Guide</a> |
  <a href="./docs/RELEASES.md">Releases</a>
</p>

---

## About

A mocking framework powered by [Express](https://expressjs.com/), designed to serve mock HTTP/s responses.

Key features:

- write mocks with [TypeScript](https://www.typescriptlang.org/docs/handbook/modules.html)
- http / https support using a unified port
- proxy requests to another target
- record responses returned by a proxy and output as a mock response module
- serve static files
- rate limit
- xml content type request parsing
- response delays

Know more by going through the [detailed guide](./docs/DETAILED_GUIDE.md).

## Requirements

- NodeJS _`14.16.1`_ or LTS

## Get Started

1. Get it

   `npm install @iamkenos/fragile`

2. Try it

   `npx fragile samples`

3. Run it

   `npx fragile ./samples/fragile.conf.ts`

## License

MIT
