# STB FF Guild Community Website

This is a React + Vite application for the STB Free Fire Guild, featuring Bengali localization, Role-Based Access Control (RBAC), and Firebase integration.

## Features

- **Bengali Interface**: Full translation for Dashboard, Admin Panel, and Menus.
- **Role-Based Access Control**:
  - **Super Admin**: Full control.
  - **Sub Admin**: Team & Tournament management.
  - **Editor**: Content management.
  - **Team Admin**: Manage specific team.
  - **Member**: View access.
- **Firebase Integration**: Authentication (Google) and Firestore Database.
- **AI Player Stats**: Analyze player stats using Google Gemini.

## Setup Instructions

### 1. Firebase Setup
1. Go to [Firebase Console](https://console.firebase.google.com/).
2. Create a new project.
3. Enable **Authentication** (Google Sign-In).
4. Enable **Firestore Database**.
5. Copy your Firebase Config keys.

### 2. Environment Variables
Create a `.env` file in the root directory (or use the AI Studio Secrets panel) with the following keys:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
GEMINI_API_KEY=your_gemini_api_key
```

### 3. Security Rules
Copy the contents of `firestore.rules` to your Firestore Rules tab in the Firebase Console to secure the database.

## Development

- `npm run dev`: Start the development server.
- `npm run build`: Build for production.

## Deployment

This app is ready to be deployed to Firebase Hosting, Vercel, or Netlify.
