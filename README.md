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
