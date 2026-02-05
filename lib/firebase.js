import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// 1. Construct the config object
const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// 2. validate config (Client-side safety)
// We only run this check in the browser or when strictly necessary
Object.entries(firebaseConfig).forEach(([key, value]) => {
    if (!value) {
        console.warn(
            `[Firebase Config] Missing environment variable for ${key}. ` +
            `Ensure NEXT_PUBLIC_FIREBASE_${key.replace(/[A-Z]/g, letter => `_${letter}`).toUpperCase()} is set in .env.local`
        );
    }
});

// 3. Initialize Firebase (Singleton Pattern)
// Prevents "Firebase App named '[DEFAULT]' already exists" error
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// 4. Initialize Services
const auth = getAuth(app);
const db = getFirestore(app);

// 5. Export
export { app, auth, db };
