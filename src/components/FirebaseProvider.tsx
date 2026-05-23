import React, { createContext, useContext, useEffect, useState } from 'react';
import { doc, getDocFromCache, getDocFromServer } from 'firebase/firestore';
import { db } from '../lib/firebase';

interface FirebaseContextType {
  isConnected: boolean;
  error: string | null;
}

const FirebaseContext = createContext<FirebaseContextType | undefined>(undefined);

export function FirebaseProvider({ children }: { children: React.ReactNode }) {
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function testConnection() {
      try {
        // Try to fetch a dummy document to verify connection
        // We use a path that likely doesn't exist but it still tests the connection
        await getDocFromServer(doc(db, '_internal_', 'connection_test'));
        setIsConnected(true);
      } catch (err: any) {
        if (err.message?.includes('client is offline')) {
          setError("Please check your Firebase configuration or internet connection.");
        }
        // If it's just a permission error, we are still "connected"
        if (err.code === 'permission-denied' || err.code === 'not-found') {
          setIsConnected(true);
        }
      }
    }
    testConnection();
  }, []);

  return (
    <FirebaseContext.Provider value={{ isConnected, error }}>
      {children}
    </FirebaseContext.Provider>
  );
}

export function useFirebase() {
  const context = useContext(FirebaseContext);
  if (context === undefined) {
    throw new Error('useFirebase must be used within a FirebaseProvider');
  }
  return context;
}
