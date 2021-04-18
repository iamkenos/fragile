import * as fs from "fs-extra";
import * as path from "path";
import slash from "slash";

export function slashify(src: string, relativeFrom?: string) {
  return slash(relativeFrom ? path.join(path.sep, path.relative(relativeFrom, src)) : src);
}

export function randIntBetween(min: number, max: number): number {
  return min + Math.floor(Math.random() * (max - min));
}

function getDirs(src: string): string[] {
  return fs.readdirSync(src)
    .map(file => path.join(src, file))
    .filter(path => fs.statSync(path).isDirectory());
}

export function getDirsNested(src: string): string[] {
  const nestedDirectories = getDirs(src).map(getDirsNested);
  const directories = nestedDirectories.flat();
  directories.push(src);
  return directories;
}

export function getNearestParentDir(src: string): string {
  while (!fs.pathExistsSync(src)) { src = path.dirname(src); }
  return src;
}

export function isModuleExisting(path: string): boolean {
  try {
    require.resolve(path);
    return true;
  } catch (e) {
    return false;
  }
}

export function isJSON(str: string): boolean {
  if (typeof str !== "string") return false;
  try {
    const result = JSON.parse(str);
    return result instanceof Object || result instanceof Array;
  } catch (e) {
    return false;
  }
}
