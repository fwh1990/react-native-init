#!/usr/bin/env bash

echo "\nInstalling watchman...\n"

if [ -z "$(which brew)" ]
then
  read -p "You didn't install brew. Press any key to install brew"
  /usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
fi

brew install watchman
