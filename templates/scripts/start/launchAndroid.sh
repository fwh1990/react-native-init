#!/usr/bin/env bash

set -e

avds=($(emulator -list-avds))
avd_count=${#avds[*]}

echo "\nAndroid emulator list：\n"
emulator -list-avds

if [ ${avd_count} == 0 ]
then
  echo "Android emulator is not found. Creating..."
  sh scripts/start/createEmulator.sh
  avd=$(emulator -list-avds)
elif [ ${avd_count} == 1 ]
then
  avd=${avds[0]}
else
  first_avd=${avds[0]}
  read -t 30 -p "Select the emulator which you want to launch: [$first_avd]" avd
  echo ""

  if [ -z "$avd" ]; then
    avd=${first_avd}
  fi
fi

# Do not use [ grep -v grep ] in node, it's not compatible with child_process.
process_count=$(ps aux | grep "\-avd $avd" | wc -l)

if [ ${process_count} == 2 ]
then
  echo "Android emulator had been launched"
  exit 0
fi

echo "Android emulator ${avd} is launching..."
cd ${ANDROID_HOME}/tools/
emulator -avd ${avd} &

# It's important to wait the emulator rendering the desktop, otherwise, script `react-native run-android` make no sense.
count=0
# FIXME: cannot read adb public key file
while [ "$(adb shell getprop sys.boot_completed 2>/dev/null)" != "1" ]
do
  sleep 1
  count=$((count + 1))
  echo "Waiting for boot complete, wasting ${count}/150 second..."
done
