#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const minimist = require('minimist');
const semver = require('semver');
const misc = require('./maps/misc');
const {getJsonMap} = require('./utils/getJsonMap');
const {getYarnVersion, getReactNativeVersion} = require('./utils/getVersion');
const {installPackage} = require('./utils/installPackage');
const {copyTemplateFile} = require('./utils/copyTemplateFile');
const {createDir} = require('./utils/createDir');
const {replacePlaceholder} = require('./utils/replacePlaceholder');
const {runShell, runShellAndReturn} = require('./utils/runShell');

const args = minimist(process.argv.slice(2));

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

const nodeVersion = getJsonMap('node-version');
if (semver.lt(process.version, nodeVersion)) {
  console.error(`The minimum supported node version is ${nodeVersion}`);
  process.exit(1);
}

const projectName = args._[0];
const version = getReactNativeVersion();
if (semver.lt(version, misc['min-support-rn'])) {
  console.error(`The minimum supported react-native version is ${misc['min-support-rn']}`);
  process.exit(1);
}

const xcodeVersion = runShellAndReturn(`xcodebuild -version 2>&1 | awk 'NR==1{print $2}'`);
const minXcodeVersion = getJsonMap('ios-xcode');
if (semver.lt(xcodeVersion, minXcodeVersion)) {
  console.error(`The minimum supported xcode version is ${minXcodeVersion}`);
  process.exit(1);
}

const javaVersion = runShellAndReturn(`java -version 2>&1 | awk 'NR==1{ gsub(/"/,""); print $3 }'`);
const minJavaVersion = getJsonMap('android-jdk');
if (semver.lt(javaVersion.split('_')[0], minJavaVersion.java)) {
  console.error(`The minimum jdk version is ${minJavaVersion.jdk}`);
  process.exit(1);
}

if (fs.existsSync(path.resolve(projectName))) {
  console.error(`Directory ${projectName} already exists.`);
  process.exit(1);
}

let installCommand = `react-native init ${projectName} --version=${version}`;
if (args.npm) {
  installCommand += ' --npm';
}
runShell(installCommand);

const yarnVersion = !args.npm && getYarnVersion();
const projectPath = path.join(process.cwd(), projectName);
// change the working directory to new project
process.chdir(projectPath);

// todo: extend the babel
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

packageData.scripts.start = 'sh shell/start.sh 8081';
fs.writeFileSync(packageFilePath, JSON.stringify(packageData, null, 2));

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

const shellFolder = path.join(__dirname, '..', 'templates', 'shell', '*');

createDir('src');
createDir('shell');
runShell(`cp ${shellFolder} shell/`);

replacePlaceholder('shell/init.sh', [
  {
    pattern: /:install:/g,
    value: yarnVersion ? 'yarn add' : 'npm install',
  },
  {
    pattern: /:sdk_platforms:/g,
    value: `"${getJsonMap('android-sdk-platforms').join('" "')}"`,
  },
  {
    pattern: /:sdk_tools:/g,
    value: `"${getJsonMap('android-sdk-tools').join('" "')}"`,
  },
]);
replacePlaceholder('shell/create-android-emulator.sh', [
  {
    pattern: /:rn_version:/g,
    value: version.replace(/\./g, ''),
  },
  {
    pattern: /:avd_package:/g,
    value: `"${getJsonMap('android-avd').package}"`,
  }
]);
replacePlaceholder('shell/build.sh', [
  {
    pattern: /:project_name:/g,
    value: projectName,
  }
]);
replacePlaceholder('shell/signature-android.sh', [
  {
    pattern: /:project_name:/g,
    value: projectName,
  }
]);

runShell('sh shell/init.sh');

console.log(`Welcome to run "cd ${projectName} && npm start"`);
console.log('');
