#!/usr/bin/env bash

# Android emulator must be launched by yourself.
sh shell/launch-android.sh

# The shell script `react-native start` will hold current terminal, so we must open another terminal.
osascript \
  -e 'tell application "Terminal" to activate' \
  -e 'tell application "System Events" to keystroke "t" using {command down}' \
  -e "tell application \"Terminal\" to do script \"cd $(pwd) && react-native start\" in front window"

react-native link
react-native run-android
# You can change simulator as you like. Such as 'iPhone X', 'iPhone 6'.
react-native run-ios --simulator 'iPhone 8'
