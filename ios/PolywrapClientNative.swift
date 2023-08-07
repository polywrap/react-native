import PolywrapClient
import Foundation

@objc(PolywrapClientNative)
class PolywrapClientNative: NSObject, RCTBridgeModule {

    static func moduleName() -> String! {
        return "PolywrapClientNative"
    }

    static func requiresMainQueueSetup() -> Bool {
        return false
    }

    private var client: PolywrapClient?

    @objc
    func invokeRaw(
        _ uri: String,
        method: String,
        args: [UInt8]?,
        env: [UInt8]?,
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {

        if let client = self.client {
            client
        } else {
            let builder = BuilderConfig().build()
            builder.build()
        }
        // Your implementation goes here

        guard let uriSanitized = try Uri(uri) else {
            reject("Uri sanitization failed")
        }

        do {
            let result = try client.invokeRaw(
                uri: uriSanitized,
                method: method,
                args: args,
                env: env
            )
            resolve(result)
        } catch {
            reject(error)
        }
    }
}
