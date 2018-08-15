const semver = require('semver');
const {exeSync} = require('child_process');
const {getJsonMap} = require('./getJsonMap');
const minimist = require('minimist');
let reactNativeVersion;

function getReactNativeVersion() {
  if (!reactNativeVersion) {
    reactNativeVersion = minimist(process.argv.slice(2)).version || '';

    if (!reactNativeVersion) {
      reactNativeVersion = getJsonMap('misc')['max-support-rn'];
    }
  }

  return reactNativeVersion;
}

const yarnVersion = (function () {
  let yarnVersion;

  try {
    yarnVersion = (exeSync('yarn --version 2>/dev/null').toString() || '').trim();
  } catch (error) {
    return null;
  }

  // yarn < 0.16 has a 'missing manifest' bug
  try {
    if (semver.gte(yarnVersion, '0.16.0')) {
      return yarnVersion;
    } else {
      return null;
    }
  } catch (error) {
    console.error('Cannot parse yarn version: ' + yarnVersion);
    return null;
  }
})();

function getYarnVersion() {
  return yarnVersion;
}

module.exports = {
  getReactNativeVersion,
  getYarnVersion,
};
