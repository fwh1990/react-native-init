#!/usr/bin/env bash

if [ -z "$(which brew)" ]
then
  read -p "You didn't install brew. Press any key to install brew"
  /usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
fi

# Fix error: `fsevents` unavailable (this watcher can only be used on Darwin)
brew install watchman
