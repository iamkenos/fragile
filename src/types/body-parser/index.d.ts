/// <reference types="node" />

/**
 * nasty 'extension' of "body-parser"
 * i can't figure out how to extend the types without
 * duplications so i copied the entire thing and added that
 * last function for xml().
 *
 * @see [body-parser-xml](https://www.npmjs.com/package/body-parser-xml)
 */
declare module "body-parser" {
  import { Options as X2JSOptions } from "xml2js";
  import { NextHandleFunction } from "connect";
  import * as http from "http";

  interface Options {
    /** When set to true, then deflated (compressed) bodies will be inflated; when false, deflated bodies are rejected. Defaults to true. */
    inflate?: boolean;
    /**
     * Controls the maximum request body size. If this is a number,
     * then the value specifies the number of bytes; if it is a string,
     * the value is passed to the bytes library for parsing. Defaults to '100kb'.
     */
    limit?: number | string;
    /**
     * The type option is used to determine what media type the middleware will parse
     */
    type?: string | string[] | ((req: http.IncomingMessage) => any);
    /**
     * The verify option, if supplied, is called as verify(req, res, buf, encoding),
     * where buf is a Buffer of the raw request body and encoding is the encoding of the request.
     */
    verify?(req: http.IncomingMessage, res: http.ServerResponse, buf: Buffer, encoding: string): void;
  }

  interface OptionsJson extends Options {
      /**
       *
       * The reviver option is passed directly to JSON.parse as the second argument.
       */
      reviver?(key: string, value: any): any;
      /**
       * When set to `true`, will only accept arrays and objects;
       * when `false` will accept anything JSON.parse accepts. Defaults to `true`.
       */
      strict?: boolean;
  }

  interface OptionsText extends Options {
      /**
       * Specify the default character set for the text content if the charset
       * is not specified in the Content-Type header of the request.
       * Defaults to `utf-8`.
       */
      defaultCharset?: string;
  }

  interface OptionsUrlencoded extends Options {
      /**
       * The extended option allows to choose between parsing the URL-encoded data
       * with the querystring library (when `false`) or the qs library (when `true`).
       */
      extended?: boolean;
      /**
       * The parameterLimit option controls the maximum number of parameters
       * that are allowed in the URL-encoded data. If a request contains more parameters than this value,
       * a 413 will be returned to the client. Defaults to 1000.
       */
      parameterLimit?: number;
  }

  interface OptonsXML {
    /**
     * Specify the default character set for the text content if the charset is not
     * specified in the Content-Type header of the request. Defaults to utf-8.
     */
    defaultCharset?: string
    /**
     * When set to true, then deflated (compressed) bodies will be inflated; when false,
     * deflated bodies are rejected. Defaults to true.
     */
    inflate?: boolean;
    /**
     * Controls the maximum request body size. If this is a number, then the value specifies the number of bytes;
     * if it is a string, the value is passed to the [bytes](https://www.npmjs.com/package/bytes)
     * library for parsing. Defaults to '100kb'.
     */
    limit?: number | string

    /**
     * The type option is used to determine what media type the middleware will parse.
     * This option can be a string, array of strings, or a function.
     * If not a function, type option is passed directly to the type-is library and this can be an extension
     * name (like xml), a mime type (like application/xml), or a mime type with a wildcard (like / or *\/xml).
     * If a function, the type option is called as fn(req) and the request is parsed if it returns a truthy value.
     * Defaults to ['*\/xml', '+xml'].
     */
    type?: string | string[] | Function
    /**
     * The verify option, if supplied, is called as verify(req, res, buf, encoding), where buf is a
     * Buffer of the raw request body and encoding is the encoding of the request.
     * The parsing can be aborted by throwing an error.
     */
    verify?: Function
    /**
     * This option controls the behaviour of the XML parser.
     * You can pass any option that is supported by the [xml2js](https://github.com/Leonidas-from-XIV/node-xml2js) library:
     * see [here](https://github.com/Leonidas-from-XIV/node-xml2js#options) for a list of these options.
     */
    xmlParseOptions?: X2JSOptions
  }

  /**
   * Returns middleware that only parses json and only looks at requests
   * where the Content-Type header matches the type option.
   */
  function json(options?: OptionsJson): NextHandleFunction;
  /**
   * Returns middleware that parses all bodies as a Buffer and only looks at requests
   * where the Content-Type header matches the type option.
   */
  function raw(options?: Options): NextHandleFunction;

  /**
   * Returns middleware that parses all bodies as a string and only looks at requests
   * where the Content-Type header matches the type option.
   */
  function text(options?: OptionsText): NextHandleFunction;
  /**
   * Returns middleware that only parses urlencoded bodies and only looks at requests
   * where the Content-Type header matches the type option
   */
  function urlencoded(options?: OptionsUrlencoded): NextHandleFunction;

  /**
   * Adds XML parsing to the body-parser library, so you can convert incoming XML data into a JSON representation.
   * This is really useful if you want to deal with plain old JavaScript objects, but you need to interface with XML APIs.
   */
  function xml(options?: OptonsXML): NextHandleFunction;
}
