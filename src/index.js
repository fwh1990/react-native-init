#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const {execSync} = require('child_process');
const args = require('minimist')(process.argv.slice(2));
const semver = require('semver');
const mkdirp = require('mkdirp');

if (args._.length === 0) {
  console.error([
    '',
    '  Usage: react-native-init [ProjectName] [options]',
    '',
    '  Options:',
    '',
    '    --version {string} output the react native version number, default is latest RN version',
    '    --npm {boolean} use npm to install package, default is false',
    '',
  ].join('\n'));
  process.exit(1);
}

let version = args.version || '';

if (version && semver.lt(version, '0.55.4')) {
  console.error('The minimum react-native version is 0.55.4');
  process.exit(1);
}

// const reactNativeCli = path.resolve(__dirname, '../../react-native-cli/index.js');
const reactNativeCli = 'react-native';
const projectName = args._[0];
let installCommand = `${reactNativeCli} init ${projectName}`;

if (version) {
  installCommand += ` --version=${version}`;
}

if (args.npm) {
  installCommand += ' --npm';
}

try {
  execSync(installCommand, {stdio: 'inherit'});
} catch (err) {
  console.error(err.message || err);
  process.exit(1);
}

const projectPath = path.resolve(process.cwd(), projectName);
process.chdir(projectPath);

// const babelFilePath = path.resolve(projectPath, '.babelrc');
// const babel = eval('(' + fs.readFileSync(babelFilePath).toString() + ')');
//
// if (!Array.isArray(babel.plugins)) {
//     babel.plugins = [];
// }
//
// fs.writeFileSync(babelFilePath, JSON.stringify(babel, null, 2));

const packageFilePath = path.resolve('package.json');
const packageData = require(packageFilePath);

if (!packageData.scripts) {
  packageData.scripts = {};
}

packageData.scripts.start = 'sh shell/start.sh';
fs.writeFileSync(packageFilePath, JSON.stringify(packageData, null, 2));

if (!version) {
  version = packageData.dependencies['react-native'].replace(/^(?:^|~)/, '');
}

const yarnVersion = !args.npm && getYarnVersion();

makeDir('src');
copyTemplateFile('.editorconfig');
copyTemplateFile('README.md');
// ajv is required by eslint
// When missing ajv, you may see:
// ajv-keywords@3.2.0 requires a peer of ajv@^6.0.0 but none is installed. You must install peer dependencies yourself.
installPackage('ajv', true);
installPackage('eslint', true);
// installPackage('watchman', true);
installPackage('@types/react-native', true);
installPackage('@types/react', true);
getJsonMap('ios-rncache').forEach((pkg) => {
  copyTemplateFile(`rncache/${pkg}.tar.gz`);
});

const shellPath = path.resolve(__dirname, '..', 'templates', 'shell', '*.sh');

makeDir('shell');
try {
  execSync(`cp ${shellPath} shell/`, {stdio: 'inherit'});
} catch (err) {
  console.error(err.message || err);
  process.exit(1);
}

const initFilePath = path.resolve('shell', 'init.sh');
const avdProfile = getJsonMap('android-avd');
fs.writeFileSync(
  initFilePath,
  fs.readFileSync(initFilePath)
    .toString()
    .replace(':install:', yarnVersion ? 'yarn add' : 'npm install')
    .replace(':sdk_platforms:', `"${getJsonMap('android-sdk-platforms').join('" "')}"`)
    .replace(':sdk_tools:', `"${getJsonMap('android-sdk-tools').join('" "')}"`)
    .replace(':rn-version:', version)
    .replace(':avd-package:', `"${avdProfile.package}"`)
    .replace(':avd-size:', avdProfile.size)
);

try {
  execSync('sh shell/init.sh', {stdio: 'inherit'});
} catch (err) {
  console.error(err.message || err);
  process.exit(1);
}

function makeDir(dirName) {
  console.log(`Created directory -> ${dirName}.`);
  mkdirp.sync(dirName);
}

function copyTemplateFile(fileName) {
  console.log(`Created file -> ${fileName}.`);
  makeDir(path.dirname(fileName));
  fs.copyFileSync(path.join(__dirname, '../templates', fileName), fileName);
}

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

  try {
    execSync(installCommand, {stdio: 'inherit'});
  } catch (err) {
    console.error(err.message || err);
    process.exit(1);
  }
}

function getYarnVersion() {
  let yarnVersion;

  try {
    if (process.platform.startsWith('win')) {
      yarnVersion = (execSync('yarn --version').toString() || '').trim();
    } else {
      yarnVersion = (execSync('yarn --version 2>/dev/null').toString() || '').trim();
    }
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
}

function getJsonMap(fileName) {
  const map = require(`./maps/${fileName}.json`);
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
