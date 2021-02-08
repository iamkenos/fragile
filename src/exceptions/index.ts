export class ResponseModuleNotFoundError extends Error {
  constructor(key: string) {
    super(key);
    this.name = "ResponseModuleNotFoundError";
  }
}

export class ResponseModuleRequiredPropertyNotFoundError extends Error {
  constructor(prop: string, key: string) {
    super(`${prop} on ${key}`);
    this.name = "ResponseModuleRequiredPropertyNotFoundError";
  }
}

export class UnsupportedFileTypeError extends Error {
  constructor(extension: string, allowed: string[]) {
    super(`File type '${extension}' isn't supported. Use any one of [${allowed}].`);
    this.name = "UnsupportedFileTypeError";
  }
}
