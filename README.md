# Tudo bem?

A mobile check-in app that requires user confirmation every 48 hours. If no check-in occurs, it automatically notifies an emergency contact via email and push notification.

[**Download on Google Play**](https://play.google.com/store/apps/details?id=com.yabcompany.tudobem)

## How it works

1. On first launch, the user registers their name and an emergency contact (name + email).
2. The app expects a check-in every 48 hours — the user simply opens the app and taps the "I'm fine" button.
3. If no check-in is received within 48 hours, the emergency contact receives an email alert automatically.
4. The user can also manually trigger an emergency alert at any time by tapping "I'm not well".
5. Push notification reminders are sent as the 48-hour window approaches (24h, 12h, 4h, 2h, 1h, 30m, 10m before deadline).

## Development

This app was totally developed using the free model SWE-1.5 from Windsurf.

## Tech stack

- **Frontend:** React Native (Expo) with file-based routing via Expo Router
- **Backend:** Firebase Cloud Functions (Node.js / TypeScript)
- **Database:** Firestore
- **Email:** Resend
- **Push notifications:** Expo Notifications + Firebase Cloud Messaging

## Local development

### Prerequisites

- Node.js 18+
- Expo CLI
- Firebase CLI (for backend)

### Frontend

```bash
npm install
npx expo start
```

### Backend (Firebase Functions)

```bash
cd functions
npm install
firebase emulators:start
```

### Environment secrets

The backend uses Firebase secret manager. To configure locally, set:

```bash
firebase functions:secrets:set RESEND_API_KEY
```

## Building & deploying

Builds are managed via EAS (Expo Application Services):

```bash
# Development build
eas build --profile development

# Production build
eas build --profile production

# Deploy Firebase functions
firebase deploy --only functions
```
