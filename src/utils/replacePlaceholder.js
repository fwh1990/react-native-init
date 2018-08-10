const fs = require('fs');
const path = require('path');

function replacePlaceholder(relativePath, replaceMap = []) {
  const absolutePath = path.resolve(relativePath);
  const finalData = replaceMap.reduce(function (carry, map) {
    return carry.replace(map.pattern, map.value);
  }, fs.readFileSync(absolutePath).toString());

  fs.writeFileSync(absolutePath, finalData);
}

module.exports = {
  replacePlaceholder,
};
