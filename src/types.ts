export interface NativePolywrapClient {
  invokeRaw(
    uri: string,
    method: string,
    args: Array<number> | undefined,
    env: Array<number> | undefined
  ): Promise<Array<number>>;
}
