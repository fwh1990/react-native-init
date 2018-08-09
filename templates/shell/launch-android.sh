#!/usr/bin/env bash

ANDROID_PATH_EXIST=`cat ~/.bash_profile | grep ANDROID_NDK=`

if [ "$ANDROID_PATH_EXIST" == "" ]; then
  echo '
    export ANDROID_NDK=$HOME/Library/Android/ndk
  ' >> ~/.bash_profile

  source $HOME/.bash_profile
fi

avds=`ls ~/.android/avd | grep .avd | sed "s#.avd##"`
avds=(${avds})
avd_count=`ls ~/.android/avd | grep .avd | wc -l`

echo ""
echo "Android emulator list："
echo ""
ls ~/.android/avd | grep .avd | sed "s#.avd##"
echo ""

if [ ${avd_count} == 0 ]; then
  read -p "Android emulator is not found，you may add one by IDE android-studio" next
  exit 1
elif [ ${avd_count} == 1 ]; then
  avd=${avds[0]}
else
  first_avd=${avds[0]}
  read -p "Select the emulator which you want to launch: [$first_avd]" avd
  echo ""

  if [ "$avd" == "" ]; then
    avd=${first_avd}
  fi
fi

process=`ps aux | grep "\-avd ${avd}" | grep -v grep`
process_count=`echo ${process} | wc -l`

if [ "${process}" != "" ] && [ ${process_count} == 1 ]; then
  process_id=`echo ${process} | awk '{print $2}'`
  echo "Force killing android emulator..."
  kill -9 ${process_id}
  # just in case fail to launch
  sleep 1
fi

echo "Android emulator of ${avd} is launching..."
cd ~/Library/Android/sdk/tools/
emulator -avd ${avd} &
echo "Launching complete."
