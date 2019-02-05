#!/usr/bin/env bash

# Required by android
touch ~/.bash_profile

exports[0]='ANDROID_HOME=$HOME/Library/Android/sdk'
exports[1]='PATH=$PATH:$ANDROID_HOME/tools'
exports[2]='PATH=$PATH:$ANDROID_HOME/tools/bin'
exports[3]='PATH=$PATH:$ANDROID_HOME/platform-tools'

for export_sentence in ${exports[*]}
do
  export_sentence="export ${export_sentence}"

  echo $export_sentence

  if [ -z "$(cat ~/.bash_profile | grep '$export_sentence')" ]
  then
    echo "
      # Insert by npm package: react-native-init
      $export_sentence
    " >> ~/.bash_profile
  fi
done

source ~/.bash_profile
