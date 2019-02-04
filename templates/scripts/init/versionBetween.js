const compareVersions = require('compare-versions');

module.exports = function (version, min, max) {
  if (min !== '*' && min !== undefined && compareVersions(version, min) < 0) {
    return false;
  }

  if (max !== '*' && max !== undefined && compareVersions(version, max) > 0) {
    return false;
  }

  return true;
};
