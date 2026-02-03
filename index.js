/* eslint-disable import/no-unresolved, import/namespace, import/named */
import { registerRootComponent } from "expo";
import { ExpoRoot } from "expo-router";

// Must be exported or Fast Refresh won't update the context
export function App() {
  // Use require.context with specific regex to avoid conflicts
  // The regex excludes API routes and matches .tsx/.ts/.jsx/.js files
  const ctx = require.context(
    "./app",
    true,
    /^(?:\.\/)(?!.*\+api)(?!.*\+html)(?!.*\+native-intent).*\.(tsx?|jsx?)$/,
    "sync"
  );
  return <ExpoRoot context={ctx} />;
}

registerRootComponent(App);
