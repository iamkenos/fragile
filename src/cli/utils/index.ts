import * as fs from "fs";
import * as glob from "glob";
import * as path from "path";
import * as util from "util";

import logger from "../../logger";

export function inspect(object: any): any {
  return util.inspect(object, false, null, true);
}

export function readFileSync(path: string): string {
  return fs.readFileSync(path, "utf8");
}

export function resolvePath(baseDir: string, filePath?: string): string {
  return filePath ? path.resolve(baseDir, filePath) : "";
}

export function resolveFiles(baseDir: string, fileGlob: string[], isStrict = true): string[] {
  const resolved = new Set<string>();

  fileGlob.filter(Boolean).forEach((i: string): void => {
    const filePath: string = path.resolve(path.join(baseDir, i));
    const files: string[] = glob.sync(filePath);

    if (files.length === 0) {
      logger.warn("No matches found for glob %s", filePath);
    } else {
      files.forEach(i => resolved.add(path.resolve(i)));
    }
  });

  if (resolved.size === 0 && isStrict) {
    throw new Error("Unable to resolve any existing file from the given paths. See warnings.");
  }

  return [...resolved];
}
