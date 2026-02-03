import { ConvexReactClient } from "convex/react";
import Constants from "expo-constants";

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
    unsavedChangesWarning: true,
  }
);
