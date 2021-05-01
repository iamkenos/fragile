import fs from "fs";
import path from "path";
import got from "got";

describe("express mock server", () => {
  const baseUrl = "http://localhost:1080";
  const baseUrlHttps = "https://localhost:1080";
  const jsonHeader = { "content-type": "application/json" };
  const xmlHeader = { "content-type": "application/xml" };
  const formUrlEncodedHeader = { "content-type": "application/x-www-form-urlencoded" };
  const format = (body) => JSON.stringify(body, null, 2);

  it("/GET: should allow http requests and return", async() => {
    const response = await got(baseUrl);
    const expectedStatus = 200;
    const expectedBody = "I'm Fragile, But Not That Fragile.";

    expect(response.statusCode).toEqual(expectedStatus);
    expect(response.body).toEqual(expectedBody);
  });

  it("/GET: should allow https requests and return", async() => {
    const response = await got(baseUrlHttps, {
      https: {
        rejectUnauthorized: false,
        key: fs.readFileSync(path.join(__dirname, "../certs/server.key")),
        certificate: fs.readFileSync(path.join(__dirname, "../certs/server.crt"))
      }
    });
    const expectedStatus = 200;
    const expectedBody = "I'm Fragile, But Not That Fragile.";

    expect(response.statusCode).toEqual(expectedStatus);
    expect(response.body).toEqual(expectedBody);
  });

  it("/foo/HEAD: should return and ignore response body", async() => {
    const response = await got.head(baseUrl + "/foo");
    const expectedStatus = 200;
    const expectedHeaders = "seydoux";
    const expectedBody = "";

    expect(response.statusCode).toEqual(expectedStatus);
    expect(response.headers.lea).toEqual(expectedHeaders);
    expect(response.body).toEqual(expectedBody);
  });

  it("/foo/POST: should parse JSON body and return JSON data", async() => {
    const response = await got.post(baseUrl + "/foo", {
      headers: jsonHeader,
      json: {
        data: {
          anything: ["goes"]
        }
      }
    });
    const expectedStatus = 201;
    const expectedBody = format({ anything: ["goes"] });

    expect(response.statusCode).toEqual(expectedStatus);
    expect(response.timings.phases.total).toBeGreaterThanOrEqual(200);
    expect(response.timings.phases.total).toBeLessThanOrEqual(500);
    expect(response.body).toEqual(expectedBody);
  });

  it("/foo/POST: should parse XML body and return JSON data", async() => {
    const response = await got.post(baseUrl + "/foo", {
      headers: xmlHeader,
      body: `
      <data>
        <anything>
          <show-as>JSON</show-as>
          <bar>bar-val</bar>
          <baz>
            <qux>69</qux>
            <qux>96</qux>
          </baz>
        </anything>
      </data>
      `
    });
    const expectedStatus = 201;
    const expectedBody = format(
      {
        anything: {
          "show-as": "JSON",
          bar: "bar-val",
          baz: {
            qux: [
              "69",
              "96"
            ]
          }
        }
      }
    );

    expect(response.statusCode).toEqual(expectedStatus);
    expect(response.timings.phases.total).toBeGreaterThanOrEqual(1000);
    expect(response.timings.phases.total).toBeLessThanOrEqual(1100);
    expect(response.body).toEqual(expectedBody);
  });

  it("/foo/POST: should parse XML body and return XML data", async() => {
    const response = await got.post(baseUrl + "/foo", {
      headers: xmlHeader,
      body: `
      <data>
        <anything>
          <show-as>XML</show-as>
          <bar>bar-val</bar>
          <baz>
            <qux>69</qux>
            <qux>96</qux>
          </baz>
        </anything>
      </data>
      `
    });
    const expectedStatus = 201;
    const expectedBody = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<anything>
  <show-as>XML</show-as>
  <bar>bar-val</bar>
  <baz>
    <qux>69</qux>
    <qux>96</qux>
  </baz>
</anything>`;

    expect(response.statusCode).toEqual(expectedStatus);
    expect(response.timings.phases.total).toBeGreaterThanOrEqual(1000);
    expect(response.timings.phases.total).toBeLessThanOrEqual(1100);
    expect(response.body).toEqual(expectedBody);
  });

  it("/goo/_bar/baz/_qux/PUT: should parse wildcards and return wildcard data", async() => {
    const response = await got.put(baseUrl + "/goo/maybe-an-email@email.com/baz/orjustarandomstringhere123");
    const expectedStatus = 202;
    const expectedBody = format({
      urlPattern: {
        isRegex: false,
        ast: [
          {
            tag: "static",
            value: "/goo"
          },
          {
            tag: "optional",
            value: [
              {
                tag: "static",
                value: "/"
              },
              {
                tag: "named",
                value: "bar"
              }
            ]
          },
          {
            tag: "static",
            value: "/baz"
          },
          {
            tag: "optional",
            value: [
              {
                tag: "static",
                value: "/"
              },
              {
                tag: "named",
                value: "qux"
              }
            ]
          },
          {
            tag: "static",
            value: "/PUT"
          }
        ],
        regex: {},
        names: [
          "bar",
          "qux"
        ]
      },
      wildcards: {
        bar: "maybe-an-email@email.com",
        qux: "orjustarandomstringhere123"
      }
    }
    );

    expect(response.statusCode).toEqual(expectedStatus);
    expect(response.body).toEqual(expectedBody);
  });

  it("/goo/anythinggoes/POST: should proxy requests and return", async() => {
    const response = await got.post(baseUrl + "/goo/anythinggoes", {
      headers: jsonHeader,
      json: {
        email: "lipsum@foobar.com",
        password: "lipsum"
      }
    }
    );
    const expectedHeaders = "cloudflare";
    const expectedStatus = 201;
    const expectedBody = {
      email: "lipsum@foobar.com",
      password: "lipsum"
    };

    expect(response.statusCode).toEqual(expectedStatus);
    expect(response.headers.server).toEqual(expectedHeaders);
    expect(JSON.parse(response.body).email).toEqual(expectedBody.email);
    expect(JSON.parse(response.body).password).toEqual(expectedBody.password);
    expect(JSON.parse(response.body).id).toBeDefined();
    expect(JSON.parse(response.body).createdAt).toBeDefined();
  });

  it("/goo/POST: should parse x-www-form-urlencoded and cookie data and return", async() => {
    const response = await got.post(baseUrl + "/goo", {
      headers: { ...formUrlEncodedHeader, cookie: "_authdata=gorquz" },
      body: "name=Sam Porter Bridges&dad=Cliff"
    }
    );
    const expectedStatus = 201;
    const expectedBody = {
      name: "Sam Porter Bridges",
      dad: "Cliff",
      _authdata: "gorquz"
    };

    expect(response.statusCode).toEqual(expectedStatus);
    expect(response.body).toEqual(format(expectedBody));
  });

  it("/goo/POST: should block requests past the rate limit", async() => {
    try {
      for (let i = 0; i < 5; i++) {
        await got.post(baseUrl + "/goo", {
          headers: { ...formUrlEncodedHeader, cookie: "_authdata=gorquz" },
          body: "name=Sam Porter Bridges&dad=Cliff"
        });
      }
    } catch (e) {
      const expectedStatus = 429;
      const expectedBody = "Request per second limit has been reached";

      expect(e.response.statusCode).toEqual(expectedStatus);
      expect(e.response.body).toEqual(expectedBody);
    }
  });

  it("/favicon.png: should serve static resources", async() => {
    const response = await got(baseUrl + "/favicon.png");
    const expectedStatus = 200;
    const expectedBody = "PNG";

    expect(response.statusCode).toEqual(expectedStatus);
    expect(response.body).toContain(expectedBody);
  });

  it("/DELETE: should return error when response module is non-existent", async() => {
    try {
      await got.delete(baseUrl);
    } catch (e) {
      const expectedStatus = 404;
      const expectedBody = "ResponseModuleNotFoundError: /DELETE";

      expect(e.response.statusCode).toEqual(expectedStatus);
      expect(e.response.body).toEqual(expectedBody);
    }
  });

  it("/goo/_bar/baz/_qux/DELETE: should return error when response module is non-existent", async() => {
    try {
      await got.delete(baseUrl + "/goo/some@email.com/baz/123");
    } catch (e) {
      const expectedStatus = 404;
      const expectedBody = "ResponseModuleNotFoundError: /goo/some@email.com/baz/123/DELETE";

      expect(e.response.statusCode).toEqual(expectedStatus);
      expect(e.response.body).toEqual(expectedBody);
    }
  });
});
