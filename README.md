![Public Release Announcement](https://user-images.githubusercontent.com/5522128/177473887-2689cf25-7937-4620-8ca5-17620729a65d.png)

[**Polywrap**](https://polywrap.io/) is a developer tool that enables easy integration of Web3 protocols into any application. It makes it possible for applications on any platform, written in any language, to read and write data to Web3 protocols.

The @polywrap/react-native package brings the PolywrapClient to React Native apps.

Learn how to use Polywrap in JavaScript, Swift, Kotlin, and other languages at https://docs.polywrap.io/clients

# Getting Started

Have questions or want to get involved? Join our community [Discord](https://discord.polywrap.io) or [open an issue](https://github.com/polywrap/react-native/issues) on Github.

For detailed information about Polywrap and the WRAP standard, visit our [developer documentation](https://docs.polywrap.io/).

# Installation

```sh
npm install @polywrap/react-native
```

# Usage

```ts
import { PolywrapClient, Uri, PolywrapClientConfigBuilder } from '@polywrap/react-native';

// ...
  const [result, setResult] = React.useState<string>('');

  React.useEffect(() => {
    const testClient = async () => {
      // Configure envs, interfaces, and URI redirects
      const builder = new PolywrapClientConfigBuilder().add({ ... });
      const configureResult = await PolywrapClient.configureAndBuild(builder);
      if (!configureResult.ok) {
        setResult(configureResult.error!!.toString());
        return;
      }

      // Invoke a Wrap!
      const invokeResult = await PolywrapClient.invoke<string>({
        uri: Uri.from('ipfs/QmThRxFfr7Hj9Mq6WmcGXjkRrgqMG3oD93SLX27tinQWy5'),
        method: 'keccak_256',
        args: { message: 'Hello World!' },
      });
      if (invokeResult.ok) {
        setResult(invokeResult.value);
      } else {
        setResult(invokeResult.error!!.toString());
      }
    };
    void testClient();
  }, []);
```

# Why a React Native client?

React Native does not yet support JavaScript's WebAssembly API, which is required to run the JavaScript PolywrapClient. The React Native client is a feature-limited client that wraps the Kotlin and Swift Polywrap clients. If you're writing a React Native app and need a fully-featured JavaScript client, let us know and we'll prioritize it.

Alternatively, if you're writing a native Android or iOS app, you can use the Kotlin or Swift PolywrapClients directly to unlock the full suite of Polywrap features.
