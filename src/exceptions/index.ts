export class ResponseModuleNotFoundError extends Error {
  constructor(key: string) {
    super(`Respononse module not found: ${key}`);
  }
}

export class UnsupportedFileTypeError extends Error {
  constructor(extension: string, allowed: string[]) {
    super(`File type '${extension}' isn't supported. Use any one of [${allowed}].`);
  }
}
