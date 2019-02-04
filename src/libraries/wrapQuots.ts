export const wrapQuots = (args: Array<string | number>) => {
  if (args.length) {
    return `"${args.join('" "')}"`;
  }

  return '';
};
