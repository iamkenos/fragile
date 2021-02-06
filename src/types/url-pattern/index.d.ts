interface IUrlPatternOptions {
  escapeChar?: string;
  segmentNameStartChar?: string;
  segmentValueCharset?: string;
  segmentNameCharset?: string;
  optionalSegmentStartChar?: string;
  optionalSegmentEndChar?: string;
  wildcardChar?: string;
}

declare module "url-pattern" {
  namespace UrlPattern {
    export type UrlPatternOptions = IUrlPatternOptions;
  }
  class UrlPattern {
    constructor(pattern: string, options?: IUrlPatternOptions);
    constructor(pattern: RegExp, groupNames?: string[]);

    match(url: string): any;
    stringify(values?: any): string;
  }

  export = UrlPattern;
}
