import { ConvexReactClient } from "convex/react";
import Constants from "expo-constants";
import { Platform } from "react-native";

const convexUrl =
  (Constants.expoConfig?.extra?.convexDeployment as string) ||
  (process.env.EXPO_PUBLIC_CONVEX_DEPLOYMENT as string);

console.log("[Convex] URL available:", convexUrl ? "Yes" : "No");
console.log(
  "[Convex] URL:",
  convexUrl ? convexUrl.substring(0, 30) + "..." : "N/A"
);

if (!convexUrl) {
  console.warn("[Convex] Missing Deployment URL, using dev mode");
}

export const convex = new ConvexReactClient(
  convexUrl || "http://localhost:3310",
  {
    ...(Platform.OS === "web" &&
    (typeof (globalThis as any)?.addEventListener === "function" ||
      typeof (globalThis as any)?.window?.addEventListener === "function")
      ? { unsavedChangesWarning: true }
      : {}),
  }
);
