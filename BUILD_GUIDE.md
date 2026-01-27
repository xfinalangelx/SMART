# 📱 Build APK Guide for SMART App

## Prerequisites

Before building, ensure you have:
- ✅ Node.js installed (v18 or higher)
- ✅ Expo CLI installed
- ✅ EAS CLI installed
- ✅ Expo account (free)

---

## 🚀 Quick Build Guide

### Method 1: EAS Build (Recommended - Cloud Build)

This method builds your APK in the cloud and is the easiest way to create a production-ready APK.

#### Step 1: Install EAS CLI
```bash
npm install -g eas-cli
```

#### Step 2: Login to Expo
```bash
eas login
```
Enter your Expo account credentials. If you don't have an account, create one at https://expo.dev

#### Step 3: Configure the Project
```bash
eas build:configure
```
This will use the `eas.json` file that's already been created.

#### Step 4: Build APK
Choose one of these build profiles:

**Development Build (Debug APK):**
```bash
eas build --platform android --profile development
```

**Preview Build (Production-like APK for testing):**
```bash
eas build --platform android --profile preview
```

**Production Build (Final APK for distribution):**
```bash
eas build --platform android --profile production
```

#### Step 5: Download APK
After the build completes (10-20 minutes), you'll get a download link in the terminal and on your Expo dashboard at https://expo.dev

---

### Method 2: Local Build (Advanced)

This method requires Android Studio and Android SDK installed.

#### Step 1: Install EAS CLI (if not already)
```bash
npm install -g eas-cli
```

#### Step 2: Build Locally
```bash
eas build --platform android --profile development --local
```

**Note:** Local builds require:
- Android Studio installed
- Android SDK configured
- Java Development Kit (JDK 17 or higher)
- More than 10GB free disk space

---

## 📋 Build Profiles Explained

### Development Profile
- **Purpose:** Testing and debugging
- **Size:** Larger (~60-80MB)
- **Features:** Includes dev tools, faster builds
- **Use case:** Internal testing
- **Command:** `eas build --platform android --profile development`

### Preview Profile
- **Purpose:** Pre-production testing
- **Size:** Medium (~40-60MB)
- **Features:** Production optimizations, no dev tools
- **Use case:** Beta testing, stakeholder demos
- **Command:** `eas build --platform android --profile preview`

### Production Profile
- **Purpose:** Final release
- **Size:** Optimized (~30-50MB)
- **Features:** Fully optimized, minified, proguarded
- **Use case:** Google Play Store, final distribution
- **Command:** `eas build --platform android --profile production`

---

## 🔧 Configuration Files

### eas.json (Already Created ✅)
```json
{
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal",
      "android": {
        "gradleCommand": ":app:assembleDebug",
        "buildType": "apk"
      }
    },
    "preview": {
      "distribution": "internal",
      "android": {
        "buildType": "apk"
      }
    },
    "production": {
      "android": {
        "buildType": "apk"
      }
    }
  }
}
```

### app.json (Updated ✅)
- Package name: `com.smart.app`
- Version: `1.0.0`
- Version code: `1`

---

## 📦 APK Output

After a successful build, you'll receive:
- **Download link** in terminal
- **Email notification** with download link
- **Dashboard access** at https://expo.dev/accounts/[your-account]/projects/smart/builds

The APK can be:
- ✅ Installed directly on Android devices
- ✅ Shared via link
- ✅ Uploaded to Google Play Console
- ✅ Distributed internally

---

## 🐛 Common Issues & Solutions

### Issue 1: "Not logged in"
**Solution:**
```bash
eas login
```

### Issue 2: "No android configuration found"
**Solution:** The `eas.json` has been created. Run:
```bash
eas build:configure
```

### Issue 3: Build fails due to memory
**Solution:** EAS cloud builds have sufficient resources. If local build fails, use cloud build:
```bash
eas build --platform android --profile preview
```

### Issue 4: "Package name already exists"
**Solution:** Change the package name in `app.json`:
```json
"android": {
  "package": "com.yourcompany.smart"
}
```

---

## 📱 Installing APK on Device

### Option 1: Direct Link
1. Open the download link on your Android device
2. Download the APK
3. Allow installation from unknown sources (if prompted)
4. Install

### Option 2: ADB Install
```bash
adb install path/to/your-app.apk
```

### Option 3: Google Drive/Email
1. Download APK from EAS dashboard
2. Upload to Google Drive or email to yourself
3. Open on Android device
4. Install

---

## 🚀 Recommended First Build

For your first build, I recommend using the **preview** profile:

```bash
# 1. Login
eas login

# 2. Build preview APK
eas build --platform android --profile preview

# 3. Wait 10-20 minutes
# 4. Download from link provided
# 5. Install on your device
```

---

## 📊 Build Time Estimates

- **Cloud Build:** 10-20 minutes
- **Local Build:** 15-30 minutes (first time can be longer)

---

## 🔐 Environment Variables

If your app uses Supabase or other API keys, add them to EAS:

```bash
eas secret:create --name SUPABASE_URL --value your_supabase_url
eas secret:create --name SUPABASE_ANON_KEY --value your_supabase_key
```

Then update your `app.json`:
```json
"extra": {
  "supabaseUrl": process.env.SUPABASE_URL,
  "supabaseAnonKey": process.env.SUPABASE_ANON_KEY
}
```

---

## ✅ Ready to Build!

All configuration files have been created. You can now run:

```bash
eas build --platform android --profile preview
```

Good luck with your build! 🎉
