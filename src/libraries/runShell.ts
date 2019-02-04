import { execSync } from 'child_process';

export const runShell = (shells: string | string[]) => {
  if (!Array.isArray(shells)) {
    shells = [shells];
  }

  try {
    for (const shell of shells) {
      execSync(shell, { stdio: 'inherit' });
    }
  } catch (err) {
    console.error(err.message || err);
    process.exit(1);
  }
};

export const runShellAndReturn = (shell: string) => {
  try {
    return execSync(shell).toString();
  } catch (err) {
    console.error(err.message || err);
    process.exit(1);
    return '';
  }
};
