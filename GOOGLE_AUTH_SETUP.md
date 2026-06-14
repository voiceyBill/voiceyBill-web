# Google Authentication Setup

This guide explains how contributors should run Google authentication locally in the VoiceyBill web app, and what maintainers must configure before production deployment.

## What This Web App Uses

- `@react-oauth/google`
- Existing backend endpoint: `POST /api/auth/google`
- Existing auth state/session flow

The web app receives a Google ID token and sends it to the backend. The backend verifies the token and returns the normal VoiceyBill access and refresh tokens.

## Contributor Local Setup

### 1. Install dependencies

```bash
npm install
```

If Google auth dependencies are missing:

```bash
npm install @react-oauth/google
```

### 2. Create `.env`

Copy `.env.example` to `.env`, then set:

```env
VITE_API_URL=http://localhost:8000/api
VITE_GOOGLE_CLIENT_ID=your-web-client-id.apps.googleusercontent.com
```

`VITE_GOOGLE_CLIENT_ID` must be the Google Web OAuth client ID.

Restart the Vite dev server after changing `.env`.

### 3. Start backend and web

Backend:

```bash
cd ../voiceyBill-server
npm run dev
```

Web:

```bash
cd ../voiceyBill-web
npm run dev
```

Open:

```text
http://localhost:5173
```

### 4. Test the flow

1. Go to Sign In.
2. Click `Continue with Google`.
3. Complete Google sign-in.
4. Confirm you are redirected to the dashboard.
5. Repeat from Sign Up with a new Google account.
6. Confirm email/password login still works.

## Google Cloud Requirements

The web OAuth client must be configured in Google Cloud Console.

### OAuth Consent Screen

- Configure the OAuth consent screen for `VoiceyBill`.
- In testing mode, add contributor Google accounts as test users.
- Before production release, publish/verify the consent screen as required by Google.

### Web OAuth Client

- Application type: Web application
- Authorized JavaScript origins:
  - `http://localhost:5173`
  - production web URL
- Authorized redirect URIs:
  - any redirect URIs required by the deployed web app

Use this web client ID in:

```env
VITE_GOOGLE_CLIENT_ID=your-web-client-id.apps.googleusercontent.com
```

Use the same value on the backend:

```env
GOOGLE_CLIENT_ID=your-web-client-id.apps.googleusercontent.com
```

## Backend Requirements

The backend must include the web client ID in its allowed Google audiences:

```env
GOOGLE_CLIENT_ID=your-web-client-id.apps.googleusercontent.com
```

If mobile auth is also enabled, backend production env must also include:

```env
GOOGLE_ANDROID_CLIENT_ID=your-android-client-id.apps.googleusercontent.com
GOOGLE_IOS_CLIENT_ID=your-ios-client-id.apps.googleusercontent.com
```

## Maintainer Production Checklist

- `VITE_GOOGLE_CLIENT_ID` is set in the production web environment.
- `VITE_API_URL` points to the production backend API.
- Google Cloud contains the production web origin.
- OAuth consent screen is published or production users are allowed.
- Backend production env includes `GOOGLE_CLIENT_ID`.
- Backend production env also includes Android/iOS client IDs if mobile auth is live.
- Sign In and Sign Up work with Google.
- Existing email/password auth still works.

## Troubleshooting

### Button does not appear or throws provider error

Check `VITE_GOOGLE_CLIENT_ID` and restart the Vite dev server.

### Google popup opens but backend rejects token

Confirm the backend `GOOGLE_CLIENT_ID` matches the web client ID used by `VITE_GOOGLE_CLIENT_ID`.

### CORS error

Confirm backend `FRONTEND_ORIGIN` matches the web origin, for example:

```env
FRONTEND_ORIGIN=http://localhost:5173
```

### Invalid or expired Google token

Check the backend clock, client IDs, and whether the token is being sent immediately after Google sign-in.
