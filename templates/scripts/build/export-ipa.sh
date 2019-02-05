#!/usr/bin/env bash

# Variable export_type can be one of [app-store, ad-hoc]
export_type=$1

cd ios
rm -rf ./build/ipa-${export_type}

# Export
# The same as click Xcode -> Window -> Organizer -> Export
xcodebuild -exportArchive \
  -archivePath ./build/archive.xcarchive \
  -exportPath ./build/ipa-${export_type} \
  -exportOptionsPlist ./exportOptions/${export_type}.plist \
  -allowProvisioningUpdates
