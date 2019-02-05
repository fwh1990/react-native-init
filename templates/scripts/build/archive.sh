#!/usr/bin/env bash

# Build app for android and ios.

#############################
# Make sure you have override file ios/exportOptions/*.plist
#############################

# Prepare
react-native link

# Build for android
# The apk file will be at
# android/app/build/outputs/apk/app-release.apk
cd android
rm -rf build/ app/build/
./gradlew assembleRelease
cd -

# Build for ios.
# Make sure xcode is installed.
cd ios
mkdir -p build
rm -rf build/archive.xcarchive

project_name=:project_name:

# Archive
# The same as click Xcode -> Product -> Archive
xcodebuild clean
xcodebuild archive \
  -project ./${project_name}.xcodeproj \
  -scheme ${project_name} \
  -configuration Release \
  -archivePath ./build/archive.xcarchive
