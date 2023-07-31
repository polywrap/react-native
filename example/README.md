This is a new [**React Native**](https://reactnative.dev) project, bootstrapped using [`@react-native-community/cli`](https://github.com/react-native-community/cli).

# Getting Started

>**Note**: Make sure you have completed the [React Native - Environment Setup](https://reactnative.dev/docs/environment-setup) instructions till "Creating a new application" step, before proceeding.

## Step 1: Build React Native Module

From the repo root, run the following command to build the React Native module. The command will install all dependencies and build the module. If you're using NVM, you can run `nvm use` first to ensure you're using the correct version of Node.

```bash
yarn && yarn clean && yarn build:android && yarn build:ios && yarn prepack
```

## Step 2: Start your application

To run the example app, you will need to start **Metro**, the JavaScript _bundler_ that ships _with_ React Native.

To start Metro, run the following command from the _root_ of this example project:

```bash
// to run Android app
yarn android

// to install iOS dependencies and run iOS app
yarn install --quiet && yarn ios
```

If everything is set up _correctly_, you should see your new app running in your _Android Emulator_ or _iOS Simulator_ shortly provided you have set up your emulator/simulator correctly.

This is one way to run your app — you can also run it directly from within Android Studio and Xcode respectively.

## Congratulations! :tada:

You've successfully run your React Native App. :partying_face:


# Troubleshooting

If you're using NVM, you may have trouble getting React Native to find your Node installation. These links may be helpful.

Run Android Studio from terminal with NVM Node installation in PATH: https://stackoverflow.com/questions/61922174/react-native-on-android-cannot-run-program-node-error-2-no-such-file-or-dir/76758284#76758284

Using NVM Node from XCode: https://blog.nigelsim.org/2022-12-09-nvm-node-from-xcode/
