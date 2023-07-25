package io.polywrap.reactnative

import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.LifecycleEventListener
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReadableArray
import com.facebook.react.bridge.WritableArray
import io.polywrap.client.PolywrapClient as AndroidPolywrapClient
import io.polywrap.configBuilder.polywrapClient
import io.polywrap.core.resolution.Uri

class PolywrapClient(reactContext: ReactApplicationContext)
  : ReactContextBaseJavaModule(reactContext), LifecycleEventListener {

  private var client: AndroidPolywrapClient = polywrapClient { addDefaults() }

  @ReactMethod
  fun invokeRaw(
    uri: String,
    method: String,
    args: ReadableArray? = null,
    env: ReadableArray? = null,
    promise: Promise
  ) {
    val result: Result<ByteArray> = client.invokeRaw(
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
  override fun onHostDestroy() = client.close()

  // React Module
  override fun getName(): String = NAME

  companion object {
    const val NAME = "PolywrapClient"
  }
}
