#!/usr/bin/env bash

port=$1
if [ -z "${port}" ]; then
  port=8081
fi

# Android emulator must be launched by yourself.
sh shell/launch-android.sh

data=`curl --silent http://localhost:${port}/status`
if [ "${data}" = "packager-status:running" ]; then
  echo "JS server already running."
else
  open ./node_modules/react-native/scripts/launchPackager.command
fi

react-native link
# Run android may fail before emulator boot complete.
react-native run-android
# You can change simulator as you like. Such as 'iPhone X', 'iPhone 6'.
react-native run-ios --simulator 'iPhone 8'
