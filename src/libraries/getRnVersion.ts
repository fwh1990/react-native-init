import semver from 'semver';
import colors from 'colors';
import { getYarnVersion } from './getYarnVersion';
import { runShellAndReturn } from './runShell';
import maps from '../maps';

export const getRnVersion = () => {
  const yarnVersion = getYarnVersion();
  let rnVersions: string;

  if (yarnVersion) {
    rnVersions = runShellAndReturn('yarn info react-native versions').replace(/^[\s\S]+?(\[[\s\S]+?\])[\s\S]+?$/, '$1');
  } else {
    rnVersions = runShellAndReturn('npm info react-native versions');
  }

  try {
    return JSON.parse(rnVersions.replace(/'/g, '"'))
      .reverse()
      .find((version: string) => {
        return semver.gte(version, maps.minRnVersion) && semver.lte(version, maps.maxRnVersion);
      });
  } catch (err) {
    console.log(colors.red(`Unable to fetch react-native version: ${err.message}`));
    process.exit(1);
  }
};
