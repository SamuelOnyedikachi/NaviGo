# NaviGo Rider App — Setup Guide

## 1. Copy these files into your project

Copy all files from this folder into your existing Expo project, replacing the existing ones.

## 2. Install required packages

Run these commands in your project folder:

```bash
npx expo install react-native-maps
npx expo install expo-location
```

## 3. Configure Google Maps (Android)

Open `app.json` and add your Maps API key inside the `android` section:

```json
{
  "expo": {
    "android": {
      "config": {
        "googleMaps": {
          "apiKey": "AIzaSyAX1lBsDG8vCXJQVSd9Eabzn3PUIgywj4c"
        }
      }
    },
    "ios": {
      "config": {
        "googleMapsApiKey": "AIzaSyAX1lBsDG8vCXJQVSd9Eabzn3PUIgywj4c"
      }
    }
  }
}
```

## 4. Run the app

```bash
npx expo start
```

Scan the QR code with Expo Go on your phone.

## 5. What you'll see

- **Login screen** — phone number input with Nigeria +234 prefix
- **Verify screen** — 6-digit OTP entry (auto-advances when complete)
- **Home screen** — full screen dark map with your live GPS location
- **Rides tab** — your ride history
- **Profile tab** — your profile and settings

## 6. Next steps (what to build next)

- [ ] Connect Firebase Authentication for real OTP login
- [ ] Add destination search using Google Places Autocomplete
- [ ] Add "Book Ride" flow — show fare estimate before confirming
- [ ] Build the Driver App

## Folder Structure

```
app/
├── _layout.tsx          ← Root layout + auth check
├── (auth)/
│   ├── login.tsx        ← Phone number screen
│   └── verify.tsx       ← OTP verification screen
└── (tabs)/
    ├── _layout.tsx      ← Tab bar config
    ├── index.tsx        ← Home + Map screen
    ├── rides.tsx        ← Ride history
    └── profile.tsx      ← User profile
constants/
└── index.ts             ← Colors, API keys, Aba coordinates
```
