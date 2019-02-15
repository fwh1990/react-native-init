#!/usr/bin/env bash

if [ ! -f "android/release.keystore" ]; then
  keytool \
    -genkey \
    -v \
    -keyalg RSA \
    -keysize 2048 \
    -validity 100000 \
    -keystore "android/release.keystore" \
    -storepass "_______your-password-a_______" \
    -alias "com.:project_name:" \
    -keypass "_______input-your-password-b_______" \
    -dname ""
fi
