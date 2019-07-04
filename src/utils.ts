import * as fs from 'fs';
import * as path from 'path';

export const createDocumentation = (str?: string, width = 80, indent = '') => {
  const isSingleLine = (a: string[]) => a.length === 1 && a[0].length < width - 7;
  if (!str) {
    return '';
  }
  const arr = fold(str, width);
  return isSingleLine(arr)
    ? `${indent}/** ${arr[0]} */\n`
    : `${indent}/**\n${arr.map(s => s.trim()).map(s => `${indent} * ${s}`).join('\n')}\n${indent} */\n`;
};

/**
 * Folds a string at a specified length, optionally attempting to insert newlines
 * after whitespace characters.
 *
 * Returns an array of strings that are no longer than n characters long. If a is
 * specified as an array, the lines found in s will be pushed onto the end of a.
 *
 * If s is huge and n is very small, this method will have problems...
 * @param str input string
 * @param width number of chars at which to separate lines, @default 80
 * @param useSpaces if true, attempt to insert newlines at whitespace, @default true
 * @param arr optional output result, also needed for recursive parsing the text.
 * @see http://jsfiddle.net/jahroy/Rwr7q/18/
 * @see https://stackoverflow.com/a/17895228/319711 (credits jahroy)
 */
export const fold = (str: string, width = 80, useSpaces = true, arr?: string[]): string[] => {
  arr = arr || [];
  if (str.length <= width) {
    arr.push(str);
    return arr;
  }
  let line = str.substring(0, width);
  if (!useSpaces) {
    // insert newlines anywhere
    arr.push(line);
    return fold(str.substring(width), width, useSpaces, arr);
  } else {
    // attempt to insert newlines after whitespace
    const lastSpaceRgx = /\s(?!.*\s)/;
    const idx = line.search(lastSpaceRgx);
    let nextIdx = width;
    if (idx > 0) {
      line = line.substring(0, idx);
      nextIdx = idx;
    }
    arr.push(line);
    return fold(str.substring(nextIdx), width, useSpaces, arr);
  }
};


export const getFilesFromInput = (inputFileOrFolder: string, extension: string = 'avsc'): string[] => {
  if (!fs.existsSync(inputFileOrFolder)) {
    console.warn(`Warning: input file "${inputFileOrFolder}" does not exist! Skipping...\n
Did you maybe forget to specify the "-o" flag for an output folder?`);
    return [];
  }
  if (fs.statSync(inputFileOrFolder).isFile()) {
    return [inputFileOrFolder];
  }
  if (fs.statSync(inputFileOrFolder).isDirectory()) {
    const folderFiles = fs.readdirSync(inputFileOrFolder, {withFileTypes: true})
      .filter(f => f.isFile())
      .filter(f => f.name.endsWith(extension))
      .map(f => path.join(inputFileOrFolder, f.name));
    return folderFiles;
  }
  return [];
}