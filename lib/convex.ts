import { ConvexReactClient } from "convex/react";
import Constants from "expo-constants";

const convexUrl =
  (Constants.expoConfig?.extra?.convexDeployment as string) ||
  (process.env.EXPO_PUBLIC_CONVEX_DEPLOYMENT as string);

if (!convexUrl) {
  console.warn("Missing Convex Deployment URL, using dev mode");
}

export const convex = new ConvexReactClient(
  convexUrl || "http://localhost:3310",
  {
    unsavedChangesWarning: true,
  }
);
