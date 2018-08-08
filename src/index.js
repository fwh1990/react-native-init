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
    '    --version output the react native version number',
    '',
  ].join('\n'));
  process.exit(1);
}

// const reactNativeCli = path.resolve(__dirname, '../../react-native-cli/index.js');
const reactNativeCli = 'react-native';
const projectName = args._[0];
let version = args.version || '';
let installCommand = `${reactNativeCli} init ${projectName}`;

if (version) {
  installCommand += ` --version=${version}`;
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

const yarnVersion = getYarnVersion();

makeDir('src');
copyTemplateFile('.editorconfig');
copyTemplateFile('README.md');
// ajv is required by eslint
// When missing ajv, you may see:
// ajv-keywords@3.2.0 requires a peer of ajv@^6.0.0 but none is installed. You must install peer dependencies yourself.
installPackage('ajv', true);
installPackage('eslint', true);
installPackage('watchman', true);
installPackage('@types/react-native', true);
installPackage('@types/react', true);
copyReactNativeCache();

const shellPath = path.resolve(__dirname, '..', 'templates', 'shell', '*.sh');

makeDir('shell');
try {
  execSync(`cp ${shellPath} shell/`, {stdio: 'inherit'});
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

function copyReactNativeCache() {
  const rnCacheMap = require('./rncache.json');
  const rnVersionMap = Object
    .keys(rnCacheMap)
    .sort((prev, next) => {
      return semver.gt(next, prev) ? 1 : -1;
    });
  let rnVersion = rnVersionMap.find((rnVersion) => {
    return semver.gte(version, rnVersion);
  });

  if (!rnVersion) {
    rnVersion = rnVersionMap.pop();
  }

  rnCacheMap[rnVersion].forEach((pkg) => {
    copyTemplateFile(`rncache/${pkg}.tar.gz`);
  });
}
