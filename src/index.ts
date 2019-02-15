#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import minimist from 'minimist';
import colors from 'colors';
import fsExtra from  'fs-extra';
import maps from './maps';
import { runShell, runShellAndReturn } from './libraries/runShell';
import { ProjectArgs } from '../typings';
import { getRnVersion } from './libraries/getRnVersion';
import { replacePlaceholder } from './libraries/replacePlaceholder';
import { copyTemplateFile } from './libraries/copyTemplateFile';
import { createDir } from './libraries/createDir';
import { installPackage } from './libraries/installPackage';
import { getYarnVersion } from './libraries/getYarnVersion';
import { wrapQuots } from './libraries/wrapQuots';

const args = minimist<ProjectArgs>(process.argv.slice(2));

if (args._.length === 0) {
  console.log([
    '',
    colors.green('  Usage: react-native-init ProjectName [--npm]'),
    '',
  ].join('\n'));
  process.exit(1);
}

const projectName = args._[0];
const projectPath = path.resolve(projectName);

if (fs.existsSync(projectPath)) {
  console.error(colors.red(`Directory ${projectName} already exists.`));
  process.exit(1);
}

console.log(`Fetching latest react-native version between ${maps.minRnVersion} and ${maps.maxRnVersion}...`);
const rnVersion = getRnVersion();

if (!rnVersion) {
  console.log(colors.red('Unknown react-native version.'));
  process.exit(1);
}

let installCommand = `react-native init ${projectName} --version=${rnVersion}`;

if (args.npm) {
  installCommand += ' --npm';
}

runShell(installCommand);

// Change the working directory to new project
process.chdir(projectPath);

// Extend package.json
(function () {
  const packageFilePath = path.resolve('package.json');
  const packageData = require(packageFilePath);

  if (!packageData.scripts) {
    packageData.scripts = {};
  }

  packageData.scripts.start = 'node scripts/start --port=8081';
  fs.writeFileSync(packageFilePath, JSON.stringify(packageData, null, 2));
})();

// Fix warning: To run dex in process, the Gradle daemon needs a larger heap.
replacePlaceholder('android/gradle.properties', [
  {
    pattern: /#\s*(org\.gradle\.jvmargs\s*=.+)/,
    value: '$1',
  }
]);

createDir('scripts');
copyTemplateFile('.editorconfig');
copyTemplateFile('README.md');
fsExtra.copySync(path.join(__dirname, '../templates/scripts'), path.resolve('scripts'));

runShellAndReturn('echo start.command >> .gitignore');

replacePlaceholder('scripts/init/index.js', [
  {
    pattern: /:install_tool:/g,
    value: getYarnVersion() ? 'yarn' : 'npm',
  },
  {
    pattern: /:minJdkVersion:/g,
    value: maps.minJdkVersion,
  },
  {
    pattern: /:maxJdkVersion:/g,
    value: maps.maxJdkVersion,
  },
  {
    pattern: /:minNodeVersion:/g,
    value: maps.minNodeVersion,
  },
  {
    pattern: /:maxNodeVersion:/g,
    value: maps.maxNodeVersion,
  },
  {
    pattern: /:minXcodeVersion:/g,
    value: maps.minXcodeVersion,
  },
  {
    pattern: /:maxXcodeVersion:/g,
    value: maps.maxXcodeVersion,
  },
]);

replacePlaceholder('README.md', [
  {
    pattern: /:install_tool:/g,
    value: getYarnVersion() ? 'yarn' : 'npm',
  },
]);

replacePlaceholder('scripts/init/sdkManager.sh', [
  {
    pattern: /:sdk_packages:/g,
    value: wrapQuots(maps.androidSdkPackages),
  },
  {
    pattern: /:sdk_manager_code:/g,
    value: maps.androidSdkManagerCode,
  },
]);

replacePlaceholder('scripts/start/createEmulator.sh', [
  {
    pattern: /:rn_version:/g,
    value: rnVersion.split('.').join(''),
  },
  {
    pattern: /:avd_package:/g,
    value: wrapQuots(maps.androidAvd),
  }
]);

replacePlaceholder('scripts/build/archive.sh', [
  {
    pattern: /:project_name:/g,
    value: projectName,
  }
]);

replacePlaceholder('scripts/build/signature.sh', [
  {
    pattern: /:project_name:/g,
    value: projectName,
  }
]);

installPackage(
  [
    // ajv is required by eslint
    // When missing ajv, you may see:
    // ajv-keywords@3.2.0 requires a peer of ajv@^6.0.0 but none is installed. You must install peer dependencies yourself.
    'ajv',
    // 'watchman',
    'eslint',
    '@types/react-native',
    '@types/react',
    'compare-versions',
    'colors',
    'minimist',
  ],
  true,
);

console.log([
  '',
  colors.green(`New project '${projectName}' is created. Open project and read file README.md`),
  '',
  colors.green(`New Project path: ${projectPath}`),
  '',
].join('\n'));
