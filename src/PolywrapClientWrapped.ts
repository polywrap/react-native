import type { NativePolywrapClient } from './types';
import type { InvokeOptions } from "@polywrap/core-js";
import { msgpackEncode, msgpackDecode } from "@polywrap/msgpack-js";
import type { Result } from "@polywrap/result";
import { ResultErr, ResultOk } from "@polywrap/result";

class PolywrapClientWrapped {

  constructor(private client: NativePolywrapClient) {}

  public async invoke<TData = unknown>(options: InvokeOptions): Promise<Result<TData, Error>> {
    const { uri, method, args, env } = options;
    try {
      const bytes = await this.client.invokeRaw(
        uri.toString(),
        method,
        args === undefined ? undefined : [...msgpackEncode(args)],
        env === undefined ? undefined : [...msgpackEncode(env)]
      );
      const decoded = msgpackDecode(bytes) as TData;
      return ResultOk(decoded);
    } catch (e) {
      return ResultErr(e as Error)
    }
  }

  public rebuild() {
    if (this.client.rebuild !== undefined && typeof this.client.rebuild === "function") {
      this.client.rebuild();
    }
  }

  public close() {
    if (this.client.close !== undefined && typeof this.client.close === "function") {
      this.client.close();
    }
  }
}

export { PolywrapClientWrapped };
