const {getYarnVersion} = require('./getVersion');
const {runShell} = require('./runShell');

const yarnVersion = getYarnVersion();

function installPackage(packageName, isDev = false) {
  let installCommand;

  console.log(`Installing ${packageName}...`);

  if (yarnVersion) {
    installCommand = `yarn add ${packageName}`;

    if (isDev) {
      installCommand += ' --dev';
    }
  } else {
    installCommand = `npm install ${packageName}`;

    if (isDev) {
      installCommand += ' --save-dev';
    }
  }

  runShell(installCommand);
}

module.exports = {
  installPackage,
};
