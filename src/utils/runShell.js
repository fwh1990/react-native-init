const {execSync} = require('child_process');

/**
 *
 * @param {String|Array} shells
 */
function runShell(shells) {
  if (!Array.isArray(shells)) {
    shells = [shells];
  }

  try {
    for (const shell of shells) {
      execSync(shell, {stdio: 'inherit'});
    }
  } catch (err) {
    console.error(err.message || err);
    process.exit(1);
  }
}

/**
 * @param {String} shell
 * @return {String}
 */
function runShellAndReturn(shell) {
  try {
    return execSync(shell).toString();
  } catch (err) {
    console.error(err.message || err);
    process.exit(1);
  }
}

module.exports = {
  runShellAndReturn,
  runShell,
};
