#!/usr/bin/env bash

# Start the server for coding.

port=$1

react-native link
# Run android may fail before emulator boot complete.
react-native run-android --port ${port}
# You can replace simulator easily. Such as 'iPhone X', 'iPhone 6'.
react-native run-ios --simulator 'iPhone 8' --port ${port}
