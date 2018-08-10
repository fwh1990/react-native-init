const {createDir} = require('./createDir');
const fs = require('fs');
const path = require('path');
const templateFolder = path.join(__dirname, '../../templates');

function copyTemplateFile(fileName) {
  const parent = path.dirname(fileName);

  if (parent && parent !== '.' && parent !== '..') {
    createDir(parent);
  }

  fs.copyFileSync(path.join(templateFolder, fileName), fileName);
  console.log(`Created file -> ${fileName}.`);
}

module.exports = {
  copyTemplateFile,
};
