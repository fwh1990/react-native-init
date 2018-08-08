#!/usr/bin/env bash

react-native link

osascript \
  -e 'tell application "Terminal" to activate' \
  -e 'tell application "System Events" to keystroke "t" using {command down}' \
  -e "tell application \"Terminal\" to do script \"cd $(pwd) && react-native start\" in front window"

react-native run-android
react-native run-ios --simulator 'iPhone 8'
