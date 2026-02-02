# EAS Configuration Guide

This document explains the EAS (Expo Application Services) configuration and how to set up production credentials when you're ready.

## Current Configuration

The `eas.json` file has three build profiles:

### 1. Development Profile

- **Purpose:** Local development with hot reload
- **Distribution:** Internal (side-loading)
- **iOS:** Simulator builds
- **Android:** APK builds
- **Usage:** `eas build --profile development`

### 2. Preview Profile

- **Purpose:** Testing before production
- **Distribution:** Internal (TestFlight/Internal Testing)
- **iOS:** Simulator builds
- **Android:** APK builds
- **Usage:** `eas build --profile preview`

### 3. Production Profile

- **Purpose:** App Store / Google Play releases
- **iOS:** App Store bundle
- **Android:** App Bundle (AAB) for Play Store
- **Usage:** `eas build --profile production`

---

## Required Credentials for Production

### iOS (Apple App Store)

You need an **Apple Developer Account** ($99/year):

1. **Apple ID:** Your Apple Developer account email
2. **ascAppId:** App ID from App Store Connect
3. **appleTeamId:** Team ID from Apple Developer Portal

#### How to Get These:

**Apple ID:**

- Use your Apple Developer account email

**App ID (ascAppId):**

1. Go to https://appstoreconnect.apple.com
2. Click "My Apps"
3. Create new app or select existing
4. The App ID is in the URL or app details

**Team ID:**

1. Go to https://developer.apple.com/account
2. Click "Membership" in left sidebar
3. Copy the "Team ID" value

### Android (Google Play Store)

You need a **Google Play Developer Account** ($25 one-time):

1. **Service Account Key:** JSON file for automated uploads

#### How to Create Service Account:

1. Go to https://play.google.com/console
2. Select your app
3. Go to "Setup" → "API access"
4. Click "Create new service account"
5. Follow Google Cloud Console link
6. Create key (JSON format)
7. Download and save as `google-service-account.json`
8. Place in project root directory

---

## Configuration Template

### Option A: Direct Configuration (Less Secure)

Edit `eas.json` directly:

```json
{
  "submit": {
    "production": {
      "ios": {
        "appleId": "your-email@example.com",
        "ascAppId": "1234567890",
        "appleTeamId": "ABCD123456"
      },
      "android": {
        "serviceAccountKeyPath": "./google-service-account.json",
        "track": "production"
      }
    }
  }
}
```

### Option B: Environment Variables (Recommended)

Use environment variables for better security:

```bash
# Add to your .env file (DO NOT COMMIT)
EAS_APPLE_ID=your-email@example.com
EAS_APP_ID=1234567890
EAS_TEAM_ID=ABCD123456
```

Then update `eas.json`:

```json
{
  "submit": {
    "production": {
      "ios": {
        "appleId": "${EAS_APPLE_ID}",
        "ascAppId": "${EAS_APP_ID}",
        "appleTeamId": "${EAS_TEAM_ID}"
      }
    }
  }
}
```

---

## Build Commands

### Development Build

```bash
eas build --profile development --platform ios
eas build --profile development --platform android
```

### Preview Build (for testing)

```bash
eas build --profile preview --platform ios
eas build --profile preview --platform android
```

### Production Build

```bash
eas build --profile production --platform ios
eas build --profile production --platform android
```

### Submit to Stores

```bash
eas submit --platform ios
neas submit --platform android
```

Or build and submit together:

```bash
eas build --profile production --platform ios --auto-submit
eas build --profile production --platform android --auto-submit
```

---

## Next Steps When Ready

### For iOS:

1. ✅ Enroll in Apple Developer Program ($99/year)
2. ✅ Create App ID in App Store Connect
3. ✅ Configure app name, bundle ID, and privacy policy
4. ✅ Get Team ID from Developer Portal
5. ✅ Update eas.json with credentials
6. ✅ Run production build

### For Android:

1. ✅ Create Google Play Developer account ($25)
2. ✅ Create app in Play Console
3. ✅ Generate service account key
4. ✅ Download JSON key file
5. ✅ Place in project root
6. ✅ Update eas.json path
7. ✅ Run production build

---

## Security Best Practices

### ✅ DO:

- Store credentials in environment variables
- Use `.env` file (already in .gitignore)
- Keep service account JSON secure
- Rotate credentials periodically
- Use separate accounts for dev/prod

### ❌ DON'T:

- Commit credentials to git
- Share service account files
- Use personal Apple ID for production
- Store credentials in code

---

## Current Status

**Development:** ✅ Ready - No credentials needed  
**Preview:** ✅ Ready - No credentials needed  
**Production:** ⚠️ Waiting for credentials

When you're ready to go to production, update the placeholders in `eas.json` following the guide above.

---

## Additional Resources

- [EAS Build Documentation](https://docs.expo.dev/build/introduction/)
- [iOS App Store Guidelines](https://developer.apple.com/app-store/review/guidelines/)
- [Google Play Policy Center](https://support.google.com/googleplay/android-developer/topic/9858054)
- [Expo iOS Credentials](https://docs.expo.dev/app-signing/app-credentials-ios/)
- [Expo Android Credentials](https://docs.expo.dev/app-signing/app-credentials-android/)
