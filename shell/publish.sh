#!/usr/bin/env bash
registry=`npm config get registry`

npm config set registry https://registry.npmjs.org
whoami=`npm whoami 2> /dev/null`

if [ "$whoami" == "" ]; then
   echo "login plz..."
   npm login
fi
echo "who am i: $(npm whoami)"

sleep 3
echo "begin publish..."
npm publish .

npm config set registry ${registry}
