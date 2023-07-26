package io.polywrap.reactnative

import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.LifecycleEventListener
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReadableArray
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.bridge.WritableArray
import io.polywrap.client.PolywrapClient as AndroidPolywrapClient
import io.polywrap.configBuilder.polywrapClient
import io.polywrap.core.WrapEnv
import io.polywrap.core.msgpack.EnvSerializer
import io.polywrap.core.msgpack.msgPackDecode
import io.polywrap.core.resolution.Uri

class PolywrapClient(reactContext: ReactApplicationContext)
  : ReactContextBaseJavaModule(reactContext), LifecycleEventListener {

  private var client: AndroidPolywrapClient? = null

  @ReactMethod
  fun configureAndBuild(clientConfig: ReadableMap, promise: Promise) {
    val envs = clientConfig.getMap("envs")
    val interfaces = clientConfig.getMap("interfaces")
    val redirects = clientConfig.getMap("redirects")
    try {
      client = polywrapClient {
        addDefaults()
        envs?.let {
          val envsIterator = it.keySetIterator()
          while (envsIterator.hasNextKey()) {
            val envName = envsIterator.nextKey()
            val envBytes = it.getArray(envName) ?: continue
            val env = msgPackDecode(EnvSerializer, readableArrayToByteArray(envBytes)).getOrThrow()
            addEnv(envName to env)
          }
        }
        interfaces?.let {
          val interfacesIterator = it.keySetIterator()
          while (interfacesIterator.hasNextKey()) {
            val interfaceName = interfacesIterator.nextKey()
            val implementationsArray = it.getArray(interfaceName) ?: continue
            val implementationsList = mutableListOf<String>()
            for (i in 0 until implementationsArray.size()) {
              implementationsList.add(implementationsArray.getString(i))
            }
            addInterfaceImplementations(interfaceName, implementationsList)
          }
        }
        redirects?.let {
          val redirectsIterator = it.keySetIterator()
          while (redirectsIterator.hasNextKey()) {
            val from = redirectsIterator.nextKey()
            val to = it.getString(from) ?: continue
            setRedirect(from to to)
          }
        }
      }
      promise.resolve(true)
    } catch (e: Exception) {
      promise.reject(e)
    }
  }

  @ReactMethod
  fun invokeRaw(
    uri: String,
    method: String,
    args: ReadableArray?,
    env: ReadableArray?,
    promise: Promise
  ) {
    if (client == null) {
      client = polywrapClient { addDefaults() }
    }
    val result: Result<ByteArray> = client!!.invokeRaw(
      uri = Uri(uri),
      method = method,
      args = args?.let { readableArrayToByteArray(it) },
      env = env?.let { readableArrayToByteArray(it) }
    )
    if (result.isFailure) {
      promise.reject(result.exceptionOrNull()!!)
    } else {
      val bytes = result.getOrThrow()
      promise.resolve(byteArrayToWritableArray(bytes))
    }
  }

  private fun readableArrayToByteArray(readableArray: ReadableArray): ByteArray {
    val size = readableArray.size()
    val byteArray = ByteArray(size)
    for (i in 0 until size) {
      byteArray[i] = readableArray.getInt(i).toByte()
    }
    return byteArray
  }

  private fun byteArrayToWritableArray(bytes: ByteArray): WritableArray {
    val array: WritableArray = Arguments.createArray()
    for (byte in bytes) {
      array.pushDouble(byte.toDouble())
    }
    return array
  }

  // LifeCycleEventListener
  init { reactContext.addLifecycleEventListener(this) }
  override fun onHostResume() {}
  override fun onHostPause() {}
  override fun onHostDestroy() = client?.close() ?: Unit

  // React Module
  override fun getName(): String = NAME

  companion object {
    const val NAME = "PolywrapClient"
  }
}
