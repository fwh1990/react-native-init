import fs from 'fs';
import path from 'path';
import {createDir} from './createDir';

export const copyTemplateFile = (fileName: string) => {
  const parent = path.dirname(fileName);

  if (parent && parent !== '.' && parent !== '..') {
    createDir(parent);
  }

  fs.copyFileSync(path.join(__dirname, '../../templates', fileName), fileName);
  console.log(`Created file -> ${fileName}.`);
};
