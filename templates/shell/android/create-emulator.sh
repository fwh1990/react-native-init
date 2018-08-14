#!/usr/bin/env bash

# How to list the emulators
#     avdmanager list avd

# How to delete an emulator
#     avdmanager delete avd --name=THE_NAME_COPY_FROM_LIST

emulator_name=react-native-init-:rn_version:

avdmanager create avd \
  --name ${emulator_name} \
  --package :avd_package: \
  --sdcard 300M \
  --device "Nexus 5X"

cat >> $HOME/.android/avd/${emulator_name}.avd/config.ini << EOF
hw.ramSize=2048
showDeviceFrame=yes
hw.gpu.enabled=yes
hw.gpu.mode=auto
hw.keyboard=yes
hw.camera.front=emulated
hw.camera.back=virtualscene
skin.name=nexus_5x
skin.path=${ANDROID_HOME}/skins/nexus_5x
EOF

echo ""
echo "Emulator has been created."
echo ""
