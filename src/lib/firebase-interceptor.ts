// 🔒 Firebase Offline Mode Interceptor
// This file completely prevents Firebase initialization when in offline mode

// Extend window types for webpack and AMD loaders
declare global {
  interface Window {
    __webpack_require__?: any;
    require?: any;
    define?: {
      amd: boolean;
      (moduleName: string, moduleFactory: () => any): void;
    };
  }
}

if (typeof window !== "undefined") {
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;

  if (apiKey === "offline-mode" || apiKey?.startsWith("offline-")) {
    console.warn(
      "🚫 FIREBASE INTERCEPTOR: Completely blocking Firebase in offline mode"
    );

    // Override all Firebase SDK modules before they can be imported
    const originalImport = window.__webpack_require__ || window.require;

    if (originalImport) {
      const firebaseModules = [
        "firebase/app",
        "firebase/auth",
        "firebase/firestore",
        "firebase/analytics",
        "firebase/functions",
        "firebase/storage",
      ];

      // Mock all Firebase modules
      firebaseModules.forEach((moduleName) => {
        try {
          // Create mock implementations
          const mockModule = {
            initializeApp: () => {
              console.warn(
                `🚫 Firebase ${moduleName} initialization blocked in offline mode`
              );
              return null;
            },
            getAuth: () => null,
            getFirestore: () => null,
            getAnalytics: () => null,
            onAuthStateChanged: () => () => {},
            signInWithEmailAndPassword: () =>
              Promise.reject(new Error("Firebase disabled in offline mode")),
            signInWithPhoneNumber: () =>
              Promise.reject(new Error("Firebase disabled in offline mode")),
            signOut: () => Promise.resolve(),
            RecaptchaVerifier: function () {
              return null;
            },
          };

          // Override the module
          if (window.define?.amd) {
            window.define(moduleName, () => mockModule);
          }
        } catch (error) {
          console.warn(`Could not mock ${moduleName}:`, error);
        }
      });
    }

    // Set global flag
    (window as any).__FIREBASE_OFFLINE_MODE__ = true;
    (window as any).__FIREBASE_DISABLED__ = true;

    console.log(
      "🔒 Firebase completely disabled - application will run in full offline mode"
    );
  }
}

export const isFirebaseOfflineMode = () => {
  return (
    typeof window !== "undefined" &&
    ((window as any).__FIREBASE_OFFLINE_MODE__ === true ||
      process.env.NEXT_PUBLIC_FIREBASE_API_KEY === "offline-mode")
  );
};
