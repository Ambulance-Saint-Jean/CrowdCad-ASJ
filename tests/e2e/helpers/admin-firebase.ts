import { initializeApp, getApps, getApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';
import { getConfig } from './read-firebase-emulator-config';

// Must be set before initializeApp
process.env.FIRESTORE_EMULATOR_HOST = getConfig("firestore").full
process.env.FIREBASE_AUTH_EMULATOR_HOST = getConfig("auth").full
process.env.FIREBASE_STORAGE_EMULATOR_HOST = getConfig("storage").full

const app = getApps().length ? getApp() : initializeApp({ projectId: 'demo-crowdcad' });

export const db = getFirestore(app);
export const auth = getAuth(app);