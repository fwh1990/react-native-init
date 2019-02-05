#!/usr/bin/env bash

bash_file=~/.bash_profile

# Required by android
touch ${bash_file}

exports[0]='ANDROID_HOME=$HOME/Library/Android/sdk'
exports[1]='PATH=$PATH:$ANDROID_HOME/tools'
exports[2]='PATH=$PATH:$ANDROID_HOME/tools/bin'
exports[3]='PATH=$PATH:$ANDROID_HOME/platform-tools'

for export_sentence in ${exports[*]}
do
  if [ -z "$(cat ${bash_file} | grep ${export_sentence})" ]
  then
    echo "
      # Insert by npm package: react-native-init
      export $export_sentence" >> ${bash_file}
  fi
done

source ${bash_file}
