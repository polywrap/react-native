#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(PolywrapClientNative, NSObject)

RCT_EXTERN_METHOD(invokeRaw:(NSString *)uri
                  withMethod:(NSString *)method
                  withArgs:(NSArray<NSNumber *> *)args
                  withEnv:(NSArray<NSNumber *> *)env
                  withResolver:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)

+ (BOOL)requiresMainQueueSetup
{
  return NO;
}

@end
