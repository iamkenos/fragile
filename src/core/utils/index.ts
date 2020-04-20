import * as fs from "fs";
import * as path from "path";

export function randBetween(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getDirs(src: string): string[] {
  return fs.readdirSync(src).map(file => path.join(src, file)).filter(path => fs.statSync(path).isDirectory());
}

export function getDirsRecursive(src: string): string[] {
  const nestedDirectories = getDirs(src).map(getDirsRecursive);
  const directories = nestedDirectories.flat();
  directories.push(src);
  return directories;
}

export function isModuleExisting(path: string) {
  try {
    require.resolve(path);
    return true;
  } catch (e) {
    return false;
  }
}
