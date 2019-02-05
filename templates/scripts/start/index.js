const minimist = require('minimist');
const { execSync } = require('child_process');

const args = minimist(process.argv.slice(2));
const port = args.port || 8081;

const isMacOs = process.platform === 'darwin';
const isWindows = process.platform === 'win32';
const isLinux = ['freebsd', 'linux', 'openbsd'].some(function (item) {
  return item === process.platform;
});

if (isLinux) {
  console.log(colors.red('\nLinux is not supported yet.\n'));
  process.exit(1);
}

if (isMacOs) {
  execSync('sh scripts/start/launchAndroid.sh', {
    stdio: 'inherit',
  });
}

execSync('./node_modules/.bin/react-native link', {
  stdio: 'inherit',
});

execSync(`./node_modules/.bin/react-native run-android --port ${port}`, {
  stdio: 'inherit',
});

if (isMacOs) {
  execSync(`./node_modules/.bin/react-native run-ios --simulator 'iPhone 8' --port ${port}`, {
    stdio: 'inherit',
  });
}
