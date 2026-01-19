import { ConvexReactClient } from "convex/react";
import Constants from "expo-constants";

const convexUrl = Constants.expoConfig?.extra?.convexDeployment as string;

if (!convexUrl) {
  throw new Error("Missing Convex Deployment URL");
}

export const convex = new ConvexReactClient(convexUrl, {
  unsavedChangesWarning: true,
});
