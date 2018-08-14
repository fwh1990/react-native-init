#!/usr/bin/env bash

# Input your app_id and password.
# The account must be the owner of certificates.
APP_STORE_ACCOUNT=???????
APP_STORE_PASSWORD=???????

rm -rf ios/build/ipa-app-store
sh shell/build/ios/export-ipa.sh app-store
IPA=`ls ios/build/ipa-app-store/*.ipa 2>/dev/null`

if [ -z "$IPA" ]; then
  echo "Ipa file is missing."
  exit 1
fi

# Template folders, sometimes will cause upload failed.
rm -rf ~/.itmstransporter/ ~/.old_itmstransporter/

alias altool=/Applications/Xcode.app/Contents/Applications/Application\ Loader.app/Contents/Frameworks/ITunesSoftwareService.framework/Versions/A/Support/altool

# Validate
# The same as click Xcode -> Window -> Organizer -> Validate
altool  --validate-app  --file "$IPA"  --type ios  --username ${APP_STORE_ACCOUNT}  --password ${APP_STORE_PASSWORD}

# Upload
# The same as click Xcode -> Window -> Organizer -> Upload To App Store
altool --upload-app  --file "$IPA"  --type ios  --username ${APP_STORE_ACCOUNT}  --password ${APP_STORE_PASSWORD}
