#!/usr/bin/env bash

set -e

if [ ! -f ~/.android/avd ]
then
  echo "Android emulator is not found. Creating..."
  sh scripts/start/createEmulator.sh
fi

avds=($(ls ~/.android/avd | grep .avd | sed "s#.avd##"))
avd_count=${#avds[*]}

echo ""
echo "Android emulator list："
echo ""
ls ~/.android/avd | grep .avd | sed "s#.avd##"
echo ""

if [ ${avd_count} == 0 ]
then
  echo "Android emulator is not found. Creating..."
  sh scripts/start/createEmulator.sh
  avd=$(ls ~/.android/avd | grep .avd | sed "s#.avd##")
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
process=$(ps aux | grep "\-avd $avd")
process_count=$(echo ${process} | wc -l)

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
