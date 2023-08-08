import PolywrapClient
import Foundation

@objc(PolywrapClientNative)
class PolywrapClientNative: NSObject {

    static func moduleName() -> String! {
        return "PolywrapClientNative"
    }

    static func requiresMainQueueSetup() -> Bool {
        return false
    }

    private var client: PolywrapClient?

    @objc(invokeRaw:method:args:env:resolve:reject:)
    func invokeRaw(
        _ uri: String,
        method: String,
        args: [UInt8]?,
        env: [UInt8]?,
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {

        // Ensure the client is instantiated
        if self.client == nil {
            let builder = BuilderConfig()
            self.client = builder.build()
        }

        guard let clientUnwrapped = self.client else {
            reject("CLIENT_ERROR", "Failed to initialize client", nil)
            return
        }

        // Check if the URI is okay
        guard let uriSanitized = try? Uri(uri) else {
            reject("URI_ERROR", "Uri sanitization failed", nil)
            return
        }

        // Call client.invokeRaw with the sanitized URI
        do {
            let result = try clientUnwrapped.invokeRaw(
                uri: uriSanitized,
                method: method,
                args: args,
                env: env
            )
            resolve(result)
        } catch let error as NSError {
            reject("INVOKE_ERROR", "Failed to invoke raw method", error)
        }
    }

    @objc(configureAndBuild:resolve:reject:)
    func configureAndBuild(
        _ clientConfig: NSDictionary,
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        do {
            var builder = BuilderConfig()
            // Handling envs
            if let envs = clientConfig["envs"] as? NSDictionary {
                for (key, value) in envs {
                    guard let envName = key as? String, 
                        let envBytes = value as? [UInt8] else { continue }

                    guard let uri = try? Uri(envName) else {
                        reject("CONFIGURE_AND_BUILD_ERROR", "Env uri sanitization failed", nil)
                        return
                    }

                    builder.ffi.addEnv(uri: uri.ffi, env: envBytes)
                }
            }

            // Handling interfaces
            if let interfaces = clientConfig["interfaces"] as? NSDictionary {
                for (key, value) in interfaces {
                    guard let interfaceName = key as? String,
                        let implementationsArray = value as? [String] else { continue }
                    
                    let implementations = implementationsArray.compactMap { try? Uri($0) }
                    guard implementations.count == implementationsArray.count else {
                        reject("IMPLEMENTATION_URI_ERROR", "Implementation uri sanitization failed", nil)
                        return
                    }

                    guard let interface = try? Uri(interfaceName) else {
                        reject("CONFIGURE_AND_BUILD_ERROR", "Interface uri sanitization failed", nil)
                        return
                    }
                    builder = builder.addInterfaceImplementations(interface, implementations)
                }
            }

            // Handling redirects
            if let redirects = clientConfig["redirects"] as? NSDictionary {
                for (key, value) in redirects {
                    guard let redirectFrom = key as? String,
                        let redirectTo = value as? String else { continue }

                    
                    guard let from = try? Uri(redirectFrom) else {
                        reject("CONFIGURE_AND_BUILD_ERROR", "Redirect from uri sanitization failed", nil)
                        return
                    }
                    
                    guard let to = try? Uri(redirectTo) else {
                        reject("CONFIGURE_AND_BUILD_ERROR", "Redirect to uri sanitization failed", nil)
                        return
                    }
                    builder = builder.addRedirect(from, to)
                }
            }
            
            self.client = builder.addSystemDefault().build()
            resolve(true)
        } catch {
            reject("CONFIGURE_AND_BUILD_ERROR", "Failed to configure and build client", error)
        }
    }
}
