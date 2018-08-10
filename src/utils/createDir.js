const mkdirp = require('mkdirp');

function createDir(dirName) {
  mkdirp.sync(dirName);
  console.log(`Created directory -> ${dirName}.`);
}

module.exports = {
  createDir,
};
