// Import offline interceptor first
import { isFirebaseOfflineMode } from "./firebase-interceptor";

// 🚫 FIREBASE INITIALIZATION GUARD - Prevents unauthorized Firebase initialization
if (typeof window !== "undefined" && isFirebaseOfflineMode()) {
  console.warn(
    "🔒 FIREBASE BLOCKED: Offline mode detected - preventing all Firebase imports"
  );

  // Set offline flags
  (window as any).__FIREBASE_OFFLINE_MODE__ = true;
  (window as any).__FIREBASE_DISABLED__ = true;
}

import { initializeApp, getApps, getApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {
  getFirestore,
  connectFirestoreEmulator,
  doc,
  collection,
  writeBatch,
  serverTimestamp as firestoreServerTimestamp,
} from "firebase/firestore";
import {
  getAuth,
  connectAuthEmulator,
  signInAnonymously as firebaseSignInAnonymously,
  onAuthStateChanged as firebaseOnAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  PhoneAuthProvider,
  signInWithCredential,
  signOut,
} from "firebase/auth";

// Firebase configuration with environment variable support
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Check if Firebase config is complete and not using demo values
const hasValidFirebaseConfig = Object.values(firebaseConfig).every(
  (value) => value && value !== "" && value !== "undefined"
);

const isDemoConfig =
  firebaseConfig.apiKey === "demo-key" ||
  firebaseConfig.apiKey === "offline-mode" ||
  firebaseConfig.projectId === "demo-project" ||
  firebaseConfig.projectId === "offline-project" ||
  firebaseConfig.apiKey?.startsWith("demo-") ||
  firebaseConfig.apiKey?.startsWith("offline-");

const appId = process.env.NEXT_PUBLIC_APP_ID || "conductores-app-v2";

// Initialize Firebase only if configuration is valid AND not using demo values
let app: any = null;
let db: any = null;
let auth: any = null;
let analytics: any = null;
let isFirebaseEnabled = false;

// FORCE OFFLINE MODE - Prevent any Firebase initialization attempts
const isOfflineModeForced =
  isDemoConfig ||
  isFirebaseOfflineMode() ||
  (typeof window !== "undefined" && (window as any).__FIREBASE_DISABLED__);

if (isOfflineModeForced) {
  console.log("🚫 FIREBASE INITIALIZATION COMPLETELY BLOCKED");
  console.log("🔒 OFFLINE MODE ENFORCED - Firebase completely disabled");
  console.log(
    "💡 To enable Firebase: Update .env.local with real Firebase credentials"
  );
  isFirebaseEnabled = false;
  app = null;
  db = null;
  auth = null;
  analytics = null;

  // Prevent any accidental Firebase calls
  if (typeof window !== "undefined") {
    (window as any).__FIREBASE_APPS__ = [];
  }
} else {
  try {
    if (hasValidFirebaseConfig) {
      app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
      db = getFirestore(app);
      auth = getAuth(app);
      isFirebaseEnabled = true;

      // Initialize Analytics (only in browser)
      if (typeof window !== "undefined") {
        try {
          analytics = getAnalytics(app);
          console.log("✅ Firebase initialized successfully");
        } catch (error) {
          console.warn("⚠️ Analytics not available:", error);
        }
      }
    } else {
      console.warn(
        "⚠️ Firebase configuration incomplete - running in offline mode"
      );
      console.warn(
        "📝 Create .env.local with valid Firebase credentials to enable Firebase features"
      );
      isFirebaseEnabled = false;
    }
  } catch (error) {
    console.error("❌ Firebase initialization failed:", error);
    console.warn("📝 App will continue in offline mode");
    isFirebaseEnabled = false;
  }
}

// Enable offline persistence for better offline support
if (typeof window !== "undefined" && db) {
  try {
    // Enable Firebase offline persistence
    import("firebase/firestore").then(
      ({ enableMultiTabIndexedDbPersistence }) => {
        enableMultiTabIndexedDbPersistence(db)
          .then(() => {
            console.log("🔄 Firebase offline persistence enabled");
          })
          .catch((err) => {
            if (err.code === "failed-precondition") {
              console.log(
                "Multiple tabs open, persistence can only be enabled in one tab at a time."
              );
            } else if (err.code === "unimplemented") {
              console.log(
                "The current browser does not support all of the features required to enable persistence"
              );
            }
          });
      }
    );
  } catch (error) {
    console.log("Firebase offline configuration info:", error);
  }
}

// Development emulator setup (only if Firebase is properly initialized)
if (
  process.env.NODE_ENV === "development" &&
  isFirebaseEnabled &&
  db &&
  auth &&
  hasValidFirebaseConfig
) {
  try {
    console.log(
      "🔧 Firebase emulator connection available but skipped for stability"
    );
    // Emulator connection temporarily disabled to prevent errors
    // connectFirestoreEmulator(db, "localhost", 8080);
    // connectAuthEmulator(auth, "http://localhost:9099");
  } catch (error) {
    console.log(
      "🔧 Firebase emulator connection skipped:",
      error instanceof Error
        ? error.message
        : "Already connected or not available"
    );
  }
}

// Helper functions for Firestore references (only if Firebase is enabled)
export const getCollectionRef = (collectionName: string) => {
  if (!isFirebaseEnabled || !db) {
    throw new Error("Firebase not available - running in offline mode");
  }
  return collection(db, "artifacts", appId, "public", "data", collectionName);
};

export const getDocRef = (collectionName: string, docId: string) => {
  if (!isFirebaseEnabled || !db) {
    throw new Error("Firebase not available - running in offline mode");
  }
  return doc(db, "artifacts", appId, "public", "data", collectionName, docId);
};

// Specific collection references
export const conductoresRef = () => getCollectionRef("conductores");
export const publicadoresRef = () => getCollectionRef("publicadores");
export const territoriosRef = () => getCollectionRef("territorios");
export const programaRef = () => getCollectionRef("programa");
export const lugaresRef = () => getCollectionRef("lugares");
export const facetasRef = () => getCollectionRef("facetas");
export const telefonosRef = () => getCollectionRef("telefonos");

// Batch operations helper
export const createBatch = () => {
  if (!isFirebaseEnabled || !db) {
    throw new Error("Firebase not available - running in offline mode");
  }
  return writeBatch(db);
};

// Server timestamp
export const serverTimestamp = firestoreServerTimestamp;

// Auth helpers with fallback
export const signInAnonymously = async () => {
  if (!isFirebaseEnabled || !auth) {
    console.warn("⚠️ Firebase auth not available - creating mock user");
    return {
      user: {
        uid: "offline-user",
        displayName: "Usuario Offline",
        email: "offline@territorios.app",
        isAnonymous: true,
      },
    };
  }
  return firebaseSignInAnonymously(auth);
};

// Safe auth state changed function with null checks
export function safeOnAuthStateChanged(callback: (user: any) => void) {
  if (
    !isFirebaseEnabled ||
    !auth ||
    typeof firebaseOnAuthStateChanged !== "function"
  ) {
    console.warn(
      "🔒 Firebase auth not available - skipping auth state listener"
    );
    // Call callback with null user to set offline mode
    callback(null);
    return () => {}; // Return empty unsubscribe function
  }

  try {
    return firebaseOnAuthStateChanged(auth, callback);
  } catch (error) {
    console.error("❌ Error setting up auth listener:", error);
    callback(null);
    return () => {};
  }
}

// Export the original auth state changed function directly (for backward compatibility)
export const onAuthStateChanged = firebaseOnAuthStateChanged;

// Google Auth disabled

// Email/Password Auth
export const signInWithEmail = async (email: string, password: string) => {
  if (!isFirebaseEnabled || !auth) {
    console.warn("⚠️ Firebase auth not available");
    throw new Error("Firebase auth not configured");
  }

  return signInWithEmailAndPassword(auth, email, password);
};

export const createUserWithEmail = async (email: string, password: string) => {
  if (!isFirebaseEnabled || !auth) {
    console.warn("⚠️ Firebase auth not available");
    throw new Error("Firebase auth not configured");
  }

  return createUserWithEmailAndPassword(auth, email, password);
};

// Phone Auth
export const setupRecaptcha = (containerId: string) => {
  if (!isFirebaseEnabled || !auth) {
    console.warn("⚠️ Firebase auth not available");
    throw new Error("Firebase auth not configured");
  }

  return new RecaptchaVerifier(auth, containerId, {
    size: "invisible",
    callback: () => {
      // reCAPTCHA solved
    },
  });
};

export const signInWithPhone = async (
  phoneNumber: string,
  recaptchaVerifier: RecaptchaVerifier
) => {
  if (!isFirebaseEnabled || !auth) {
    console.warn("⚠️ Firebase auth not available");
    throw new Error("Firebase auth not configured");
  }

  return signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier);
};

export const verifyPhoneCode = async (
  confirmationResult: any,
  code: string
) => {
  return confirmationResult.confirm(code);
};

// Sign out
export const firebaseSignOut = async () => {
  if (!isFirebaseEnabled || !auth) {
    console.warn("⚠️ Firebase auth not available");
    return;
  }

  return signOut(auth);
};

// Safe wrappers for Firebase Auth functions used in UnifiedAppContext
export const safeSignInWithPhoneNumber = async (
  phoneNumber: string,
  recaptchaVerifier: any
) => {
  if (!isFirebaseEnabled || !auth) {
    console.warn("⚠️ Firebase auth not available - phone sign-in disabled");
    throw new Error("Phone authentication not available in offline mode");
  }
  return signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier);
};

export const safeSignInWithEmailAndPassword = async (
  email: string,
  password: string
) => {
  if (!isFirebaseEnabled || !auth) {
    console.warn("⚠️ Firebase auth not available - email sign-in disabled");
    throw new Error("Email authentication not available in offline mode");
  }
  return signInWithEmailAndPassword(auth, email, password);
};

export const safeSignOut = async () => {
  if (!isFirebaseEnabled || !auth) {
    console.warn("⚠️ Firebase auth not available - mock sign out");
    return Promise.resolve();
  }
  return signOut(auth);
};

export const safeRecaptchaVerifier = (containerId: string, options?: any) => {
  if (!isFirebaseEnabled || !auth) {
    console.warn("⚠️ Firebase auth not available - RecaptchaVerifier disabled");
    return null;
  }
  return new RecaptchaVerifier(
    auth,
    containerId,
    options || {
      size: "invisible",
      callback: () => {
        // reCAPTCHA solved
      },
    }
  );
};

// Export Firebase Auth types safely
export type { User as FirebaseUser } from "firebase/auth";

// Exports
export { app, db, auth, appId, isFirebaseEnabled };
export default app;
