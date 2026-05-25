import React, { createContext, useContext, useEffect, useState } from "react";
import { 
  User, 
  onAuthStateChanged, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile
} from "firebase/auth";
import { auth, db } from "../lib/firebase";
import firebaseConfig from "../../firebase-applet-config.json";
import { doc, getDoc, setDoc, serverTimestamp, collection, query, where, getDocs, limit } from "firebase/firestore";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  signIn: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, username: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (activeUser) => {
      if (activeUser) {
        setUser(activeUser);
        // Sync user to Firestore
        try {
          const userRef = doc(db, "users", activeUser.uid);
          const userSnap = await getDoc(userRef);
          
          if (!userSnap.exists()) {
            const isDefaultAdmin = activeUser.email === "maraphone14@gmail.com" || 
                                  activeUser.email === "joshua@foodnet.rw";
            const role = isDefaultAdmin ? "admin" : "user";
            
            await setDoc(userRef, {
              uid: activeUser.uid,
              email: activeUser.email,
              displayName: activeUser.displayName,
              photoURL: activeUser.photoURL,
              role: role,
              status: "active",
              createdAt: serverTimestamp(),
            }, { merge: true });
            setIsAdmin(isDefaultAdmin);
          } else {
            const userData = userSnap.data();
            setIsAdmin(userData?.role === "admin" || 
                       activeUser.email === "maraphone14@gmail.com" || 
                       activeUser.email === "joshua@foodnet.rw");
          }
        } catch (err) {
          console.error("Error syncing user data:", err);
          // If we can't check firestore, fallback to email check if possible
          setIsAdmin(activeUser.email === "maraphone14@gmail.com");
        }
      } else {
        setUser(null);
        setIsAdmin(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (err: any) {
      if (err.code === "auth/popup-blocked") {
        throw new Error("The Google authentication popup was blocked by your browser. Please allow popups for this site to continue.");
      } else if (err.code === "auth/operation-not-allowed") {
        console.error("Firebase Configuration Issue: Google Sign-in is not enabled.");
        throw new Error("System Configuration Error: Google Authentication is currently disabled. Please enable it here: https://console.firebase.google.com/project/" + firebaseConfig.projectId + "/authentication/providers (Authentication > Sign-in method > Google > Enable)");
      } else if (err.code === "auth/unauthorized-domain") {
        const hostname = window.location.hostname;
        console.error(`Firebase Configuration Issue: Domain ${hostname} is not authorized.`);
        throw new Error(`Domain Authorization Error: "${hostname}" is not authorized in your Firebase console. Please go to https://console.firebase.google.com/project/${firebaseConfig.projectId}/authentication/settings and add "${hostname}" to your "Authorized domains" list.`);
      }
      throw err;
    }
  };

  const signInWithEmail = async (emailOrUsername: string, password: string) => {
    const trimmedInput = emailOrUsername.trim();
    const normalizedInput = trimmedInput.toLowerCase();
    
    let email = trimmedInput;
    
    // Check if input is a username (no @)
    if (!trimmedInput.includes("@")) {
      // Special case for "joshua" to simplify initial admin login
      if (normalizedInput === "joshua") {
        email = "joshua@foodnet.rw";
      } else {
        try {
          const usersRef = collection(db, "users");
          const q = query(usersRef, where("displayName", "==", trimmedInput), limit(1));
          const querySnapshot = await getDocs(q);
          if (!querySnapshot.empty) {
            email = querySnapshot.docs[0].data().email;
          }
        } catch (err) {
          console.error("Error finding user by username:", err);
        }
      }
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err: any) {
      if (err.code === "auth/user-not-found" || err.code === "auth/wrong-password" || err.code === "auth/invalid-credential") {
        throw new Error("The email or password provided is incorrect.");
      } else if (err.code === "auth/operation-not-allowed") {
        console.error("Firebase Configuration Issue: Email/Password Authentication is not enabled.");
        throw new Error("System Configuration Error: The 'Email/Password' authentication method is currently disabled. Please enable it here: https://console.firebase.google.com/project/" + firebaseConfig.projectId + "/authentication/providers (Authentication > Sign-in method > Email/Password > Enable) to allow account access.");
      } else if (err.code === "auth/invalid-email") {
        throw new Error("The email address is badly formatted.");
      }
      throw err;
    }
  };

  const signUp = async (email: string, password: string, username: string) => {
    try {
      // Check if username is taken
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("displayName", "==", username), limit(1));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        throw new Error("Username is already taken. Please choose another.");
      }

      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName: username });
      
      // Create initial user doc with merge to avoid overwriting fields from parallel sync
      await setDoc(doc(db, "users", userCredential.user.uid), {
        uid: userCredential.user.uid,
        email,
        displayName: username,
        role: "user",
        status: "active",
        createdAt: serverTimestamp(),
      }, { merge: true });
    } catch (err: any) {
      if (err.code === "auth/email-already-in-use") {
        throw new Error("An account with this email already exists.");
      } else if (err.code === "auth/weak-password") {
        throw new Error("Password is too weak. Please use at least 6 characters.");
      } else if (err.code === "auth/operation-not-allowed") {
        console.error("Firebase Configuration Issue: Email/Password Authentication is not enabled.");
        throw new Error("System Configuration Error: The 'Email/Password' authentication method is currently disabled. Please enable it here: https://console.firebase.google.com/project/" + firebaseConfig.projectId + "/authentication/providers (Authentication > Sign-in method > Email/Password > Enable) to allow account creations.");
      }
      throw err;
    }
  };

  const resetPassword = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (err: any) {
      if (err.code === "auth/user-not-found") {
        throw new Error("No account found with this email address.");
      }
      throw err;
    }
  };

  const logout = () => signOut(auth);

  return (
    <AuthContext.Provider value={{ user, loading, isAdmin, signIn, signInWithEmail, signUp, resetPassword, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
