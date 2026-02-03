// Reanimated Web Shim - Only loads on web platform
// This file must be loaded BEFORE any components that use Reanimated

const perf =
  typeof globalThis !== "undefined" ? globalThis.performance : undefined;
const now =
  perf && typeof perf.now === "function" ? () => perf.now() : () => Date.now();

// Check if we're in a web environment
const isWeb =
  typeof navigator !== "undefined" && navigator.product !== "ReactNative";

if (isWeb) {
  // Define worklet flags for web environment to prevent errors
  if (typeof global !== "undefined") {
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
} else {
  // On native platforms, try to import the actual reanimated module
  try {
    require("react-native-reanimated");
  } catch (e) {
    console.warn("Failed to load react-native-reanimated:", e);
  }
}
