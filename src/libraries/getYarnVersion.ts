import { execSync } from 'child_process';
import semver from 'semver';
import minimist from 'minimist';
import { ProjectArgs } from '../../typings';

const { npm } = minimist<ProjectArgs>(process.argv.slice(2));

const yarnVersion = npm ? null : (function () {
  let version;

  try {
    version = (execSync('yarn --version 2>/dev/null').toString() || '').trim();
  } catch (error) {
    return null;
  }

  // yarn < 0.16 has a 'missing manifest' bug
  try {
    if (semver.gte(version, '0.16.0')) {
      return version;
    } else {
      return null;
    }
  } catch (error) {
    console.error('Cannot parse yarn version: ' + version);
    return null;
  }
})();

export const getYarnVersion = () => {
  return yarnVersion;
};
