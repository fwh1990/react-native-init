## What can I do
##### 1、Create project based on react-native-cli.
##### 2、Download android sdk automatically without android studio.
##### 3、Create android emulator automatically without android studio.
##### 4、Run `npm start` or `yarn start` can launch android & ios simulator automatically.
##### 5、Build android & ios app by shell script automatically.
##### 6、Upload ios app to app-store by shell script automatically.
##### 7、You don't need to care about how to install any more, just focus to write javascript code.

## Requirements

- macos
- Install xcode 9.4+
- Install node 8.3+
- Install JDK 8

Android Studio is not required. We will use shell script to install sdk-platforms and sdk-tools.

You'd better install jdk8, not jdk10. Because jdk10 may make your app crash.

## Install

```bash
npm install -g react-native-init@latest
```

OR

```bash
yarn global add react-native-init@latest
```

## Create project
Open terminal and type script:
```bash
react-native-init YourProjectName
```
And then run your project:
```bash
cd YourProjectName

# For first time initialize.
node scripts/init

# Or yarn start
npm start
```

## Options

### npm
Using npm to install package whatever.
```bash
react-native-init YourProjectName --npm
```
If you don't append this parameter, we will check **yarn** at first, and then check **npm** when yarn is not installed.

## Supported version
<table>
  <tr>
    <th>repository</th>
    <th>react-native</th>
  </tr>
  <tr>
    <td>< 0.7.0</td>
    <td>0.54.* - 0.56.*</td>
  </tr>
  <tr>
    <td>0.58.*</td>
    <td>0.58.*</td>
  </tr>
</table>

