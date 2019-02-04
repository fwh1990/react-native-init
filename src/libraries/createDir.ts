import mkdirp from 'mkdirp';

export const createDir = (dirName: string) => {
  mkdirp.sync(dirName);
  console.log(`Created directory -> ${dirName}.`);
};
