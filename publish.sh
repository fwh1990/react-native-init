#!/usr/bin/env bash
registry=$(npm config get registry)

npm config set registry https://registry.npmjs.org
who=$(npm whoami 2> /dev/null)

if [ -z $who ]; then
   echo "Login plz..."
   npm login
fi
echo "Who am i: $(npm whoami)"

echo "Building..."
rm -rf ./build/
npx tsc
cp -r ./templates ./build/
echo "Begin publish..."
npm publish ./build/

npm config set registry ${registry}
