#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_REMAP_MODULE(PolywrapClient, PolywrapClientNative, NSObject)

RCT_EXTERN_METHOD(invokeRaw:(NSString *)uri
                  method:(NSString *)method
                  args:(NSArray<NSNumber *> *)args
                  env:(NSArray<NSNumber *> *)env
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(configureAndBuild:(NSDictionary *)clientConfig
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)

+ (BOOL)requiresMainQueueSetup
{
  return NO;
}

@end
