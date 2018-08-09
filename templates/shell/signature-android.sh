#!/usr/bin/env bash

if [ ! -f "android/release.keystore" ]; then
  keytool \
    -genkey \
    -v \
    -keyalg RSA \
    -keysize 2048 \
    -validity 100000 \
    -keystore "android/release.keystore" \
    -storepass "input-your-password-a" \
    -alias "com.:project_name:" \
    -keypass "input-your-password-b" \
    -dname ""
fi
