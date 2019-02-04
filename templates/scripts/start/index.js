const minimist = require('minimist');
const { execSync } = require('child_process');

const args = minimist(process.argv.slice(2));
const port = args.port || 8081;

const isMacOs = process.platform === 'darwin';
const isWindows = process.platform === 'win32';
const isLinux = ['freebsd', 'linux', 'openbsd'].some(function (item) {
  return item === process.platform;
});

if (isMacOs || isLinux) {
  execSync('sh scripts/start/launchAndroid.sh', {
    stdio: 'inherit',
  });
}

execSync('sh scripts/start/runServer.sh', {
  stdio: 'inherit',
});
