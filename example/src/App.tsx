import * as React from 'react';

import { StyleSheet, View, Text } from 'react-native';
import { PolywrapClient, Uri } from "@polywrap/react-native";
import { PolywrapClientConfigBuilder } from "@polywrap/client-config-builder-js";

export default function App() {

  const [result, setResult] = React.useState<string>("");

  React.useEffect(() => {
    const testClient = async () => {
      const builder = new PolywrapClientConfigBuilder()
        .addEnvs({
          "ens/wraps.eth:async-ipfs-uri-resolver-ext@1.0.1": {
            provider: "https://ipfs.wrappers.io",
            fallbackProviders: ["https://ipfs.io"],
            retries: { tryResolveUri: 2, getFile: 2 },
          }
        })
        .addInterfaceImplementations(
          "ens/wraps.eth:ipfs-http-client@1.0.0",
          ["ens/wraps.eth:ipfs-http-client@1.0.0"]
        )
        .setRedirects({
          "ens/wraps.eth:ipfs-http-client@9.0.0": "ens/wraps.eth:ipfs-http-client@1.0.0"
        })

      const configureResult = await PolywrapClient.configureAndBuild(builder);
      if (!configureResult.ok) {
        console.log(configureResult.error)
        setResult(configureResult.error.toString())
        return
      }

      const invokeResult = await PolywrapClient.invoke<String>({
        uri: Uri.from("ipfs/QmThRxFfr7Hj9Mq6WmcGXjkRrgqMG3oD93SLX27tinQWy5"),
        method: "keccak_256",
        args: { message: "Hello World!" },
      });
      if (invokeResult.ok) {
        setResult(invokeResult.value);
      } else {
        console.log(invokeResult.error);
        setResult(invokeResult.error.toString());
      }
    }
    void testClient();
  }, []);

  return (
    <View style={styles.container}>
      <Text>Result: {result}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  box: {
    width: 60,
    height: 60,
    marginVertical: 20,
  },
});
