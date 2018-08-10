const semver = require('semver');
const {getReactNativeVersion} = require('./getVersion');

function getJsonMap(fileName) {
  const map = require(`../maps/${fileName}.json`);
  const version = getReactNativeVersion();
  const mapKeys = Object
    .keys(map)
    .sort((prev, next) => {
      return semver.gt(next, prev) ? 1 : -1;
    });
  let mapKey = mapKeys.find((rnVersion) => {
    return semver.gte(version, rnVersion);
  });

  if (!mapKey) {
    mapKey = mapKeys.pop();
  }

  return map[mapKey];
}

module.exports = {
  getJsonMap,
};
