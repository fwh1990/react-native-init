const { execSync } = require('child_process');
const colors = require('colors');
const versionBetween = require('./versionBetween');

const isMacOs = process.platform === 'darwin';
const isWindows = process.platform === 'win32';
const isLinux = ['freebsd', 'linux', 'openbsd'].some(function (item) {
  return item === process.platform;
});

// Check node version
const nodeVersion = process.version;

if (!versionBetween(nodeVersion, ':minNodeVersion:')) {
  console.log(colors.red(`\nThe node version should between :minNodeVersion: and :maxNodeVersion:. Current version: ${nodeVersion}\n`));
  process.exit(1);
}

// Check jdk version
try {
  const jdkVersionInfo = execSync('java -version 2>&1 | awk \'NR==1{print $3}\'')
    .toString()
    .replace(/"/g, '');
  const matches = jdkVersionInfo.match(/^1\.(\d+)(.\d+)?.*/) || jdkVersionInfo.match(/^(\d+)(.\d+)?(.\d+)?.*/);
  let jdkVersion = '0';

  if (matches) {
    jdkVersion = matches[1] + (matches[2] || '') + (matches[3] || '');
  }

  if (!versionBetween(jdkVersion, ':minJdkVersion:', ':maxJdkVersion:')) {
    console.log(colors.red(`\nThe jdk version should between :minJdkVersion: and :maxJdkVersion:. Current version: ${jdkVersionInfo}\n`));
    process.exit(1);
  }
} catch (e) {
  console.log(colors.red(e.message || e));
  console.log([
    '',
    colors.yellow('If you didn\'t install jdk, Visit this site and download jdk: https://www.oracle.com/technetwork/java/javase/downloads/index.html'),
    '',
  ].join('\n'));
  process.exit(1);
}

const xcodeVersion = execSync('xcodebuild -version 2>&1 | awk \'NR==1{print $2}\'').toString().replace(/\n/g, '');
if (!versionBetween(xcodeVersion, ':minXcodeVersion:', ':maxXcodeVersion:')) {
  console.log(colors.red(`\nThe xcode version should between :minXcodeVersion: and :maxXcodeVersion:. Current version: ${xcodeVersion}\n`));
  process.exit(1);
}

// Your team should use the same tool to install packages.
// That dependencies on the project creator.
execSync(':install_tool: install', {
  stdio: 'inherit',
});

if (isMacOs) {
  execSync('sh scripts/init/watchman.sh', {
    stdio: 'inherit',
  });
}

if (isMacOs || isLinux) {
  execSync('sh scripts/init/setEnv.sh', {
    stdio: 'inherit',
  });

  execSync('sh scripts/init/sdkManager.sh', {
    stdio: 'inherit',
  });
}
