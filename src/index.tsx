import { NativeModules, Platform } from 'react-native';
import type { NativePolywrapClient } from './types';
import { PolywrapClientWrapped } from './PolywrapClientWrapped';

export type { InvokeOptions } from '@polywrap/core-js';
export { Uri } from '@polywrap/core-js';
export type { Result } from '@polywrap/result';
export type { ClientConfigBuilder } from "@polywrap/client-config-builder-js";
export { PolywrapClientConfigBuilder } from "@polywrap/client-config-builder-js";

const LINKING_ERROR =
  `The package '@polywrap/react-native' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo Go\n';

const nativePolywrapClient = NativeModules.PolywrapClient
  ? NativeModules.PolywrapClient
  : new Proxy(
      {},
      {
        get() {
          throw new Error(LINKING_ERROR);
        },
      }
    );
const polywrapClientWrapped = new PolywrapClientWrapped(
  nativePolywrapClient as NativePolywrapClient
);

export { polywrapClientWrapped as PolywrapClient };
