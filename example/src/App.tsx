import * as React from 'react';

import { StyleSheet, View, Text } from 'react-native';
import { PolywrapClient, Uri } from "@polywrap/react-native";

export default function App() {

  const [result, setResult] = React.useState<number | undefined>();

  React.useEffect(() => {
    PolywrapClient.invoke({
      uri: Uri.from("ipfs/QmThRxFfr7Hj9Mq6WmcGXjkRrgqMG3oD93SLX27tinQWy5"),
      method: "keccak_256",
      args: { message: "Hello World!" },
    }).then((hash) => setResult(hash.value))
    .catch((err) => console.log(err));
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
