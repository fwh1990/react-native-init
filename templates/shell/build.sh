#!/usr/bin/env bash

#############################
# Make sure you have override file ios/exportOptions/app-store.plist
#############################

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
rm -rf build/archive.xcarchive build/ipa-*

project_name=:project_name:

# Archive
# The same as click Xcode -> Product -> Archive
xcodebuild clean
xcodebuild archive \
  -project ./${project_name}.xcodeproj \
  -scheme ${project_name} \
  -configuration Release \
  -archivePath ./build/archive.xcarchive

# Export
# The same as click Xcode -> Window -> Organizer -> Export
xcodebuild -exportArchive \
    -archivePath ./build/archive.xcarchive \
    -exportPath ./build/ipa-app-store \
    -exportOptionsPlist ./exportOptions/app-store.plist \
    -allowProvisioningUpdates

cd -
