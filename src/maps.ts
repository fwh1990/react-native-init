export default {
  "minRnVersion": "0.58.0",
  "maxRnVersion": "0.58.99",

  "minNodeVersion": "8.3.0",
  "maxNodeVersion": "*",

  "minXcodeVersion": "9.4.0",
  "maxXcodeVersion": "*",

  "minJdkVersion": "8.0.0",
  // FIXME: High version jdk grater than 9 is not compatible with sdkmanager.
  "maxJdkVersion": "8.99.99",

  "androidAvd": [
    "system-images;android-28;google_apis;x86_64",
  ],
  "androidSdkPackages": [
    // Android SDK Platform-Tools
    "platform-tools",
    // Enhance: Launch the emulator by shell script.
    'emulator',
    // Fix warning: NDK is missing a "platforms" directory
    // NDK
    'ndk-bundle',


    // Android SDK Platform 28
    "platforms;android-28",
    // Intel x86 Atom_64 System Image
    "system-images;android-28;google_apis;x86_64",
    // Android SDK Build-Tools
    "build-tools;28.0.3",
  ],
  // @see https://developer.android.google.cn/studio/
  "androidSdkManagerCode": "4333796"
};
