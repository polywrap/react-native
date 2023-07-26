export interface NativeClientConfig {
    envs: Record<string, Record<string, unknown>> | undefined;
    interfaces: Record<string, Array<string>> | undefined;
    redirects: Record<string, string> | undefined;
}

export interface NativePolywrapClient {
  configureAndBuild(clientConfig: NativeClientConfig): Promise<boolean>

  invokeRaw(
    uri: string,
    method: string,
    args: Array<number> | undefined,
    env: Array<number> | undefined
  ): Promise<Array<number>>;
}
