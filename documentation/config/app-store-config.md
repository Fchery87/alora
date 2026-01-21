# Alora Baby Tracking App Store Configuration

## iOS App Store Connect Setup

### Prerequisites

- Apple Developer Program membership ($99/year)
- Xcode installed on macOS
- App Store Connect account

### Setup Steps

1. **Create App in App Store Connect**

   - Visit https://appstoreconnect.apple.com
   - Go to "My Apps" → Click "+" → "New App"
   - Select iOS app type
   - Fill in:
     - Name: "Alora Baby Tracker"
     - Primary Language: English
     - Bundle ID: com.alora.babytracker
     - SKU: alora-baby-tracker-001
     - User Access: Full Access

2. **Configure App Information**

   - **Category**: Health & Fitness (primary), Lifestyle (secondary)
   - **Age Rating**: 4+ (no content restrictions needed)
   - **Pricing**: Free with optional premium features

3. **App Privacy**
   - Navigate to "App Privacy" section
   - Select "Yes, we collect data from users"
   - Mark as "Data Not Linked to User's Identity"
   - Required data types:
     - Contact Info (optional, for account)
     - User Content (photos for baby profiles)
     - Usage Data (app interactions)
     - Diagnostics (crash logs)

### Required Metadata

| Field              | Value                                                                                                                                                                                                                              |
| ------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| App Name           | Alora Baby Tracker                                                                                                                                                                                                                 |
| Subtitle           | Track your baby's precious moments                                                                                                                                                                                                 |
| Promotional Text   | The complete baby tracking companion                                                                                                                                                                                               |
| Description        | Alora helps parents track feeding, sleep, diapers, growth, and milestones for their baby. Features include easy logging, reminders, growth charts, and milestone tracking. Join families who trust Alora for their baby's journey. |
| Keywords           | baby tracker, infant care, parenting, sleep tracking, feeding log, diaper tracker, baby growth, milestones, new parent, baby activities                                                                                            |
| Support URL        | https://alora.app/support                                                                                                                                                                                                          |
| Privacy Policy URL | https://alora.app/privacy                                                                                                                                                                                                          |
| Marketing URL      | https://alora.app                                                                                                                                                                                                                  |

### Screenshots (iPhone 6.5" Display)

Required sizes: 1284 x 2778 pixels (portrait)

**Create the following screenshot files:**

- `assets/screenshots/iphone-portrait.png` - Main dashboard/landing screenshot

### App Review Information

- **Demo Account**: Provide test credentials if app requires login
- **Notes**: Include any special instructions for reviewers
- **Contact**: reviewer-support@alora.app

---

## Google Play Console Setup

### Prerequisites

- Google Play Developer account ($25 one-time fee)
- Keystore file for signing

### Setup Steps

1. **Create Application**

   - Visit https://play.google.com/console
   - Click "Create App"
   - Fill in:
     - Name: "Alora Baby Tracker"
     - Default Language: English (US)
     - App Type: App
     - Declare if app is a game: No

2. **Configure Store Listing**

   - **Short Description**: Your trusted baby tracking companion
   - **Full Description**: Alora helps parents track feeding, sleep, diapers, growth, and milestones for their baby. Easy-to-use interface, smart reminders, growth charts, and milestone tracking all in one place.
   - **App Category**: Parenting
   - **Content Rating**: All ages
   - **Tagline**: Track baby's precious moments

3. **Graphics Assets**
   - **Feature Graphic**: 1024 x 500 pixels
   - **Phone Screenshots**: 1440 x 3120 pixels (portrait)
   - **App Icon**: 512 x 512 pixels (32-bit PNG)
   - **Promotional Video**: Optional (YouTube link)

### Required Screenshots

**Create the following screenshot file:**

- `assets/screenshots/android-portrait.png` - Main dashboard screenshot (1440 x 3120)

### Content Rating Questionnaire

- **Category**: Parenting & Family
- **Does app contain ads?**: No
- **Does app have in-app purchases?**: Yes (optional premium)
- **Target audience**: Parents of infants/toddlers

### Privacy Policy

- URL: https://alora.app/privacy
- Must be accessible and clearly stated

---

## App Icon Specifications

| Platform           | Size                 | Format | Location                   |
| ------------------ | -------------------- | ------ | -------------------------- |
| iOS App Store      | 1024 x 1024          | PNG    | assets/images/app-icon.png |
| iOS App Icon       | 180 x 180            | PNG    | auto-generated by Expo     |
| Android Play Store | 512 x 512            | PNG    | assets/images/app-icon.png |
| Android Adaptive   | 192 x 192, 512 x 512 | PNG    | auto-generated by Expo     |

## Splash Screen Specifications

| Platform       | Size        | Format | Location                 |
| -------------- | ----------- | ------ | ------------------------ |
| iOS Splash     | 1284 x 2778 | PNG    | assets/images/splash.png |
| Android Splash | 1440 x 3120 | PNG    | assets/images/splash.png |

---

## Next Steps After Submission

1. **iOS Review Process**: Typically 24-48 hours
2. **Android Review Process**: Typically 1-3 days
3. **Monitor for Rejection**: Check email for issues
4. **App Analytics**: Monitor downloads and engagement post-launch

---

## Support Resources

- Apple Developer Support: https://developer.apple.com/contact/
- Google Play Developer Support: https://support.google.com/googleplay/android-developer
