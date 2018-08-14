#!/usr/bin/env bash

# Run 'sh shell/archive.sh' at first.
# Upload android and ios app to pgy.
# See more in website https://www.pgyer.com/

# Input your _api_key
API_KEY=??????
HOST=https://www.pgyer.com/apiv2/app/upload

rm -rf ios/build/ipa-ad-hoc
sh shell/build/ios/export-ipa.sh ad-hoc
IPA=`ls ./ios/build/ipa-ad-hoc/*.ipa 2>/dev/null`
APK=`ls ./android/app/build/outputs/apk/app-release.apk 2>/dev/null`

if [ -z "$IPA" ]; then
  echo "Ios ipa file is missing."
  exit 1
fi

if [ -z "$APK" ]; then
  echo "Android apk file is missing."
  exit 1
fi

# Ios
curl \
    --form "file=@$IPA" \
    --form "_api_key=${API_KEY}" \
    ${HOST}

# Android
curl \
    --form "file=@./android/app/build/outputs/apk/app-release.apk" \
    --form "_api_key=$API_KEY" \
    ${HOST}
