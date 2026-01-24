/**
 * Shim for React Native Reanimated on web
 * Prevents "_WORKLET is not defined" errors by defining it globally
 */

if (typeof global !== "undefined") {
  // Define _WORKLET for web environment to prevent errors
  global._WORKLET = false;
  global.SHOULD_BE_USE_WEB = true;
}

if (typeof window !== "undefined") {
  // Also define for browser window context
  window._WORKLET = false;
  window.SHOULD_BE_USE_WEB = true;
}
