import type { NativePolywrapClient, NativeClientConfig } from './types';
import type { InvokeOptions } from "@polywrap/core-js";
import { msgpackEncode, msgpackDecode } from "@polywrap/msgpack-js";
import type { Result } from "@polywrap/result";
import { ResultErr, ResultOk } from "@polywrap/result";
import type { ClientConfigBuilder } from "@polywrap/client-config-builder-js"

class PolywrapClientWrapped {

  constructor(private client: NativePolywrapClient) {}

  public async configureAndBuild(configBuilder: ClientConfigBuilder): Promise<Result<true, Error>> {
    const { envs, interfaces, redirects, wrappers, packages, resolvers } = configBuilder.config;

    if (
      Object.keys(wrappers).length > 0 ||
      Object.keys(packages).length > 0 ||
      resolvers.length > 0
    ) {
      return ResultErr(Error("Embedded Wrappers, packages and resolvers are not yet supported in React Native."));
    }

    const nativeConfig: NativeClientConfig = {
      envs: envs,
      interfaces: Object.fromEntries(
        Object.entries(interfaces).map(([key, value]) => [key, Array.from(value)])
      ),
      redirects: redirects,
    }

    try {
      await this.client.configureAndBuild(nativeConfig);
      return ResultOk(true);
    } catch (e) {
      return ResultErr(e as Error);
    }
  }

  public async invoke<TData = unknown>(options: InvokeOptions): Promise<Result<TData, Error>> {
    const { uri, method, args, env } = options;
    try {
      const bytes = await this.client.invokeRaw(
        uri.toString(),
        method,
        args === undefined ? undefined : [...msgpackEncode(args)],
        env === undefined ? undefined : [...msgpackEncode(env)]
      );
      const decoded = msgpackDecode(new Uint8Array(bytes)) as TData;
      return ResultOk(decoded);
    } catch (e) {
      return ResultErr(e as Error)
    }
  }
}

export { PolywrapClientWrapped };
