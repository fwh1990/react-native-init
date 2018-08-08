#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const {execSync} = require('child_process');
const args = require('minimist')(process.argv.slice(2));
const semver = require('semver');

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
const {version} = args;
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
// const babelFilePath = path.resolve(projectPath, '.babelrc');
// const babel = eval('(' + fs.readFileSync(babelFilePath).toString() + ')');
//
// if (!Array.isArray(babel.plugins)) {
//     babel.plugins = [];
// }
//
// fs.writeFileSync(babelFilePath, JSON.stringify(babel, null, 2));

const yarnVersion = getYarnVersion();

makeDir('src');
makeDir('shell');
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

function makeDir(dirName) {
  console.log(`Created directory -> ${dirName}.`);
  fs.mkdirSync(path.join(projectPath, dirName));
}

function copyTemplateFile(fileName) {
  console.log(`Created file -> ${fileName}.`);
  fs.copyFileSync(
    path.join(__dirname, 'templates', fileName),
    path.join(projectPath, fileName)
  );
}

function installPackage(packageName, isDev = false) {
  const oldCwd = process.cwd();
  let installCommand;

  process.chdir(projectPath);
  console.log(`Installing ${packageName}...`);

  if (yarnVersion) {
    installCommand = `yarn add ${packageName}`;

    if (isDev) {
      installCommand += ' --dev';
    }
  } else {
    installCommand = `npm install ${packageName}`;

    if (isDev) {
      installCommand += '--save-dev';
    }
  }

  try {
    execSync(installCommand, {stdio: 'inherit'});
  } catch (err) {
    console.error(err.message || err);
    process.exit(1);
  }

  process.chdir(oldCwd);
}

// copy from react-native-cli
function getYarnVersion() {
  let yarnVersion;

  try {
    // execSync returns a Buffer -> convert to string
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
