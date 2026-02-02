export default {
  expo: {
    name: "Alora",
    slug: "alora",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/app-icon.png",
    scheme: "alora",
    userInterfaceStyle: "automatic",
    splash: {
      image: "./assets/images/splash.png",
      resizeMode: "contain",
      backgroundColor: "#7C3AED",
    },
    ios: {
      supportsTablet: false,
      bundleIdentifier: "com.alora.app",
      config: {
        usesNonExemptEncryption: false,
      },
      infoPlist: {
        NSCameraUsageDescription:
          "Alora needs camera access to capture photos of your baby's milestones and memories.",
        NSPhotoLibraryUsageDescription:
          "Alora needs photo library access to save and organize baby photos.",
        NSNotificationUsageDescription:
          "Alora uses notifications to send you reminders for feeding, sleep, and diaper changes.",
        NSFaceIDUsageDescription:
          "Alora uses Face ID to securely protect your baby's data.",
      },
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/images/app-icon.png",
        backgroundColor: "#7C3AED",
      },
      package: "com.alora.app",
      permissions: [
        "INTERNET",
        "ACCESS_NETWORK_STATE",
        "CAMERA",
        "READ_EXTERNAL_STORAGE",
        "WRITE_EXTERNAL_STORAGE",
        "READ_MEDIA_IMAGES",
        "VIBRATE",
        "RECEIVE_BOOT_COMPLETED",
      ],
      intentFilters: [
        {
          action: "VIEW",
          data: [
            {
              scheme: "https",
              host: "*.alora.app",
              pathPrefix: "/",
            },
          ],
          category: ["BROWSABLE", "DEFAULT"],
        },
      ],
    },
    web: {
      bundler: "metro",
      output: "single",
      favicon: "./assets/images/app-icon.png",
    },
    plugins: [
      [
        "expo-local-authentication",
        { faceIDPermission: "Allow $(PRODUCT_NAME) to use Face ID." },
      ],
      [
        "expo-notifications",
        {
          icon: "./assets/images/app-icon.png",
          color: "#7C3AED",
          defaultChannel: "default",
        },
      ],
    ],
    extra: {
      router: { origin: false },
      clerkPublishableKey: process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY,
      convexDeployment: process.env.EXPO_PUBLIC_CONVEX_DEPLOYMENT,
    },
    experiments: { typedRoutes: true },
    owner: "your-org",
    runtimeVersion: {
      policy: "appVersion",
    },
    updates: {
      url: "https://u.expo.dev/your-project-id",
      enabled: true,
      checkAutomatically: "ON_LOAD",
    },
    jsEngine: "hermes",
    bundle: {
      output: "production",
      sourcemaps: true,
    },
  },
};
