## Requirements

- macos
- Install xcode 9+  &nbsp;&nbsp;  [lookup](https://github.com/fwh1990/react-native-init/blob/master/src/maps/ios-xcode.json)
- Install node 8+  &nbsp;&nbsp;  [lookup](https://github.com/fwh1990/react-native-init/blob/master/src/maps/node-version.json)
- Install JDK 8+   &nbsp;&nbsp;  [lookup](https://github.com/fwh1990/react-native-init/blob/master/src/maps/android-jdk.json)

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
