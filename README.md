## Requirements

- macos
- Install xcode 9+ [depend on react-native version]
- Install node 8+ [depend on react-native version]
- Install [JDK 8+](http://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html)  [depend on react-native version]

Android Studio is not required. We will use shell script to install sdk-platforms and sdk-tools.

## Install

```bash
npm install -g react-native-init@latest
```
## Create project

```bash
react-native-init YourProjectName
```

## Options

### version {string}
You can specify the version you want, default value is the latest react-native version.
```bash
react-native-init YourProjectName --version=0.56.0
```

### npm {boolean}
Using npm to install package whatever.
```bash
react-native-init YourProjectName --npm
```
If you don't append this parameter, we will check **yarn** at first, and then check **npm** when yarn is not installed.

## Supported version
React-Native 0.55.4+

## Chinese Developer
Launch vpn may be a better choice.
