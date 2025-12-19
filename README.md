# Christmas List

A React + TypeScript + Vite app for managing Christmas wish lists.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file from `.env.example` and add your Firebase config:
   ```bash
   cp .env.example .env
   ```

3. Run the dev server:
   ```bash
   npm run dev
   ```

## Firebase

Make sure your Firebase Realtime Database rules allow reads/writes to `/wishlists` and `/persons`.

### Firebase Security Rules

Your Firebase Realtime Database rules should include the following structure:

```json
{
  "rules": {
    "persons": {
      ".read": true,
      ".write": true
    },
    "wishlists": {
      ".read": true,
      ".write": true
    },
    "santaTracking": {
      "$santaUserId": {
        ".read": "$santaUserId === auth.uid",
        ".write": "$santaUserId === auth.uid",
        "$recipientUserId": {
          ".read": "$santaUserId === auth.uid",
          ".write": "$santaUserId === auth.uid"
        }
      }
    }
  }
}
```

**Note:** Since this app uses localStorage-based user IDs (not Firebase Auth), you may need to adjust the rules. For development/testing, you can use:

```json
{
  "rules": {
    "persons": {
      ".read": true,
      ".write": true
    },
    "wishlists": {
      ".read": true,
      ".write": true
    },
    "santaTracking": {
      ".read": true,
      ".write": true
    }
  }
}
```

**Important:** For production, implement proper authentication and adjust the `santaTracking` rules to ensure only the Santa user can read/write their own tracking data. Recipients should not be able to read tracking data about themselves.
