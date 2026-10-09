import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDocFromServer,
  getDoc,
  setDoc,
  collection,
  onSnapshot
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// CRITICAL: Initialize Firestore with explicit firestoreDatabaseId as required
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Standard Error Handling for Firestore
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null
): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo:
        auth.currentUser?.providerData?.map((p) => ({
          providerId: p.providerId,
          email: p.email,
        })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Test connection on boot
export async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firebase connection: Offline mode or initial connection pending.');
    }
  }
}
testConnection();

export interface LocalTravelerProfile {
  name: string;
  email: string;
  signedInAt: string;
}

export function getLocalTravelerProfile(): LocalTravelerProfile | null {
  try {
    const raw = localStorage.getItem('ochena_traveler_profile');
    if (raw) return JSON.parse(raw);
  } catch (_) {}
  return null;
}

// Sign In with Google popup
export async function signInWithGoogle(): Promise<FirebaseUser | null> {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    if (result.user) {
      localStorage.setItem(
        'ochena_traveler_profile',
        JSON.stringify({
          name: result.user.displayName || 'ভ্রমণকারী',
          email: result.user.email || '',
          signedInAt: new Date().toISOString(),
        })
      );
      window.dispatchEvent(new Event('traveler_profile_updated'));
    }
    return result.user;
  } catch (error: any) {
    // If the user closed the popup window voluntarily, treat it as a gentle cancellation
    if (
      error?.code === 'auth/popup-closed-by-user' ||
      error?.code === 'auth/cancelled-popup-request'
    ) {
      return null;
    }
    console.warn('Google Sign In cancelled or interrupted:', error?.code || error?.message);
    return null;
  }
}

// Sign In with Name & Email without restricted anonymous auth dependency
export async function signInWithNameAndEmail(
  name: string,
  email: string
): Promise<LocalTravelerProfile> {
  const profile: LocalTravelerProfile = {
    name: name.trim(),
    email: email.trim().toLowerCase(),
    signedInAt: new Date().toISOString(),
  };

  localStorage.setItem('ochena_traveler_profile', JSON.stringify(profile));

  // If already authenticated with Firebase, sync to Firestore
  if (auth.currentUser) {
    saveUserTravelProfile({
      travelerName: profile.name,
      email: profile.email,
      visitedDistricts: [],
      themeId: 'emerald',
    }).catch(() => {});
  }

  // Trigger state updates
  window.dispatchEvent(new Event('traveler_profile_updated'));

  return profile;
}

// Sign Out
export async function logOut(): Promise<void> {
  try {
    localStorage.removeItem('ochena_traveler_profile');
    window.dispatchEvent(new Event('traveler_profile_updated'));
    if (auth.currentUser) {
      await signOut(auth);
    }
  } catch (error) {
    console.error('Sign Out Error:', error);
  }
}

// User Profile Data Interface for Firestore
export interface UserTravelProfile {
  userId: string;
  travelerName: string;
  email?: string;
  photoUrl?: string;
  visitedDistricts: string[];
  themeId: string;
  updatedAt: string;
}

// Save User Profile & Visited Districts to Firestore
export async function saveUserTravelProfile(
  profile: Omit<UserTravelProfile, 'userId' | 'updatedAt'>
): Promise<void> {
  const currentUser = auth.currentUser;
  if (!currentUser) return;

  const path = `users/${currentUser.uid}`;
  try {
    let userEmail = profile.email || currentUser.email;
    if (!userEmail) {
      const local = getLocalTravelerProfile();
      if (local?.email) userEmail = local.email;
    }

    const data: UserTravelProfile = {
      userId: currentUser.uid,
      travelerName: profile.travelerName || currentUser.displayName || 'ভ্রমণকারী',
      email: userEmail || undefined,
      photoUrl: profile.photoUrl || currentUser.photoURL || undefined,
      visitedDistricts: profile.visitedDistricts,
      themeId: profile.themeId,
      updatedAt: new Date().toISOString(),
    };
    await setDoc(doc(db, 'users', currentUser.uid), data, { merge: true });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
  }
}

// Load User Profile from Firestore
export async function loadUserTravelProfile(): Promise<UserTravelProfile | null> {
  const currentUser = auth.currentUser;
  if (!currentUser) return null;

  const path = `users/${currentUser.uid}`;
  try {
    const snap = await getDoc(doc(db, 'users', currentUser.uid));
    if (snap.exists()) {
      return snap.data() as UserTravelProfile;
    }
    return null;
  } catch (err) {
    handleFirestoreError(err, OperationType.GET, path);
  }
}
