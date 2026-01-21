export function isAuthBypassEnabled() {
  return __DEV__ && process.env.EXPO_PUBLIC_AUTH_BYPASS === "true";
}
