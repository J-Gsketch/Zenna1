import { initializeApp } from 'firebase/app';
import { getAnalytics, isSupported } from 'firebase/analytics';
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, User, Auth } from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);

// Initialize Analytics safely
export let analytics: any = null;
isSupported().then((supported) => {
  if (supported) {
    analytics = getAnalytics(app);
  }
});

export const auth: Auth = getAuth(app);

// Provider for basic login (No scary scopes)
const baseProvider = new GoogleAuthProvider();

// Provider for Drive/Calendar connection (Scary scopes)
const driveProvider = new GoogleAuthProvider();
driveProvider.addScope('https://www.googleapis.com/auth/drive');
driveProvider.addScope('https://www.googleapis.com/auth/drive.file');
driveProvider.addScope('https://www.googleapis.com/auth/calendar');
driveProvider.addScope('https://www.googleapis.com/auth/calendar.events');

let isSigningIn = false;
let cachedAccessToken: string | null = null; // Drive token

export const initAuth = (
  onAuthSuccess?: (user: User) => void,
  onAuthFailure?: () => void
) => {
  return onAuthStateChanged(auth, (user: User | null) => {
    if (user && !isSigningIn) {
      if (onAuthSuccess) onAuthSuccess(user);
    } else if (!user && !isSigningIn) {
      if (onAuthFailure) onAuthFailure();
    }
  });
};

// 1-Click Basic Login
export const login = async (): Promise<User | null> => {
  try {
    isSigningIn = true;
    const result = await signInWithPopup(auth, baseProvider);
    return result.user;
  } catch (error: any) {
    console.error('Zenna Login error:', error);
    throw error;
  } finally {
    isSigningIn = false;
  }
};

// Elevate privileges to connect Drive/Calendar
export const connectDrive = async (): Promise<{ user: User; accessToken: string } | null> => {
  try {
    isSigningIn = true;
    const result = await signInWithPopup(auth, driveProvider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (!credential?.accessToken) {
      throw new Error('Failed to obtain Google OAuth Access Token.');
    }
    cachedAccessToken = credential.accessToken;
    return { user: result.user, accessToken: cachedAccessToken };
  } catch (error: any) {
    console.error('Zenna Drive Connect error:', error);
    throw error;
  } finally {
    isSigningIn = false;
  }
};

export const getAccessToken = (): string | null => cachedAccessToken;

export const logout = async () => {
  await auth.signOut();
  cachedAccessToken = null;
};
