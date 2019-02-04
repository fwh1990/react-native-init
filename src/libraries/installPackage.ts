import { getYarnVersion } from './getYarnVersion';
import { runShell } from './runShell';

const yarnVersion = getYarnVersion();

export const installPackage = (packageName: string | string[], isDev = false) => {
  let installCommand;

  if (typeof packageName === 'string') {
    packageName = [packageName];
  }

  console.log(`Installing ${packageName.join(', ')}...`);

  if (yarnVersion) {
    installCommand = `yarn add ${packageName.join(' ')}`;

    if (isDev) {
      installCommand += ' --dev';
    }
  } else {
    installCommand = `npm install ${packageName.join(' ')}`;

    if (isDev) {
      installCommand += ' --save-dev';
    }
  }

  runShell(installCommand);
};
