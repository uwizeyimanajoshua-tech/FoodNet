import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { initializeFirestore, persistentLocalCache, persistentMultipleTabManager, setLogLevel } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);

// Set Firebase Firestore SDK log level to only log fatal errors, suppressing iframe-induced connection warnings
setLogLevel('error');

// Using initializeFirestore with specialized settings to ensure connectivity in all environments
// and offline support via persistent local cache
export const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
  localCache: persistentLocalCache({
    tabManager: persistentMultipleTabManager(),
  }),
}, firebaseConfig.firestoreDatabaseId || '(default)');

export const auth = getAuth(app);
