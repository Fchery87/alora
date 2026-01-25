/**
 * Shim for React Native Reanimated on web.
 * Ensures the web runtime is initialized before any animations run.
 */

import "react-native-reanimated";

const perf =
  typeof globalThis !== "undefined" ? globalThis.performance : undefined;
const now =
  perf && typeof perf.now === "function" ? () => perf.now() : () => Date.now();

if (typeof global !== "undefined") {
  // Define worklet flags for web environment to prevent errors
  global._WORKLET = false;
  global.SHOULD_BE_USE_WEB = true;
  if (typeof global._getAnimationTimestamp !== "function") {
    global._getAnimationTimestamp = now;
  }
}

if (typeof window !== "undefined") {
  // Also define for browser window context
  window._WORKLET = false;
  window.SHOULD_BE_USE_WEB = true;
  if (typeof window._getAnimationTimestamp !== "function") {
    window._getAnimationTimestamp = now;
  }
}
