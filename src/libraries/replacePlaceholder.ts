const fs = require('fs');
const path = require('path');

export type ReplacePlaceholderMap = Array<{
  pattern: RegExp;
  value: string | number;
}>;

export const replacePlaceholder = (relativePath: string, replaceMap: ReplacePlaceholderMap = []) => {
  const absolutePath = path.resolve(relativePath);
  const finalData = replaceMap.reduce(
    (carry, map) => carry.replace(map.pattern, map.value),
    fs.readFileSync(absolutePath).toString(),
  );

  fs.writeFileSync(absolutePath, finalData);
};
