import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { db, auth } from "../lib/firebase";
import firebaseConfig from "../../firebase-applet-config.json";
import { collection, query, where, getDocs, doc, setDoc, serverTimestamp, limit } from "firebase/firestore";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { handleFirestoreError, OperationType } from "../lib/errorHandler";
import { motion } from "motion/react";
import { Shield, Lock, User, AlertCircle, CheckCircle2, Loader2 } from "lucide-react";

export default function SetupAdmin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [adminExists, setAdminExists] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const q = query(collection(db, "users"), where("role", "==", "admin"), limit(1));
        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
          setAdminExists(true);
        }
      } catch (err) {
        console.error("Check admin error:", err);
      } finally {
        setIsChecking(false);
      }
    };
    checkAdmin();
  }, []);

  const handleSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (adminExists) {
        setError("Admin already exists. Please login normally.");
        return;
    }
    
    setError("");
    setIsLoading(true);

    try {
      // Internal trick: use username-based local email for Firebase Auth
      const internalEmail = `${username.toLowerCase().replace(/\s+/g, "")}@foodnet.rw`;
      
      const userCredential = await createUserWithEmailAndPassword(auth, internalEmail, password);
      await updateProfile(userCredential.user, { displayName: username });
      
      // Create user doc in Firestore with admin role
      try {
        await setDoc(doc(db, "users", userCredential.user.uid), {
          uid: userCredential.user.uid,
          email: internalEmail,
          displayName: username,
          role: "admin",
          createdAt: serverTimestamp(),
        });
      } catch (dbErr) {
        handleFirestoreError(dbErr, OperationType.WRITE, "users/" + userCredential.user.uid, "Admin user document creation failed.");
      }

      setSuccess(true);
      setTimeout(() => navigate("/admin"), 2000);
    } catch (err: any) {
      if (err.code === "auth/operation-not-allowed") {
        console.error("Firebase Configuration Issue: Email/Password Authentication is not enabled.");
        setError("System Configuration Error: The 'Email/Password' authentication method is currently disabled. Please enable it here: https://console.firebase.google.com/project/" + firebaseConfig.projectId + "/authentication/providers (Authentication > Sign-in method > Email/Password > Enable) to complete the administrative account initialization.");
      } else {
        setError(err.message || "Setup failed. Please verify your details and try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="animate-spin text-orange-600" size={40} />
      </div>
    );
  }

  if (adminExists) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
        <div className="max-w-md w-full bg-white rounded-[3rem] p-12 text-center shadow-xl border border-gray-100">
          <div className="w-20 h-20 bg-orange-100 text-orange-600 rounded-[2rem] flex items-center justify-center mx-auto mb-8">
            <Lock size={40} />
          </div>
          <h1 className="text-3xl font-black text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-500 font-medium mb-8">
            The administrator account has already been initialized. Please use the standard login page.
          </p>
          <button 
            onClick={() => navigate("/login")}
            className="w-full py-4 bg-orange-600 text-white rounded-full font-bold hover:bg-orange-700 transition-all"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12 flex flex-col justify-center bg-[#fdfaf6]">
      <div className="container mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md mx-auto"
        >
          <div className="bg-white rounded-[3rem] p-10 shadow-2xl shadow-orange-900/5 border border-gray-100">
            <div className="text-center mb-10">
              <div className="w-16 h-16 bg-orange-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-orange-600/20">
                <Shield size={32} />
              </div>
              <h1 className="text-4xl font-black tracking-tighter text-gray-950 mb-2">Admin Setup</h1>
              <p className="text-gray-500 font-medium">Create the first administrator account</p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 text-sm font-bold">
                <AlertCircle size={18} />
                {error}
              </div>
            )}

            {success ? (
              <div className="p-8 bg-green-50 border border-green-100 rounded-[2rem] text-center">
                <CheckCircle2 size={48} className="text-green-600 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-green-900 mb-2">Setup Successful!</h3>
                <p className="text-green-700">Redirecting to dashboard...</p>
              </div>
            ) : (
              <form onSubmit={handleSetup} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-4">Username</label>
                  <div className="relative">
                    <User className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input 
                      type="text" 
                      required
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="e.g. Joshua"
                      className="w-full bg-gray-50 border border-gray-100 rounded-[2rem] px-14 py-5 outline-none focus:ring-4 ring-orange-100 transition-all font-bold text-gray-900" 
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-4">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input 
                      type="password" 
                      required
                      minLength={6}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-gray-50 border border-gray-100 rounded-[2rem] px-14 py-5 outline-none focus:ring-4 ring-orange-100 transition-all font-bold text-gray-900" 
                    />
                  </div>
                </div>

                <button 
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-orange-600 text-white py-5 rounded-[2.5rem] font-bold text-lg shadow-xl shadow-orange-600/20 hover:bg-orange-700 transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
                >
                  {isLoading ? (
                    <Loader2 className="animate-spin" size={22} />
                  ) : (
                    <>
                      Initialize Admin
                      <Shield size={20} />
                    </>
                  )}
                </button>
              </form>
            )}

            <div className="mt-8 text-center text-sm font-medium text-gray-400 px-4">
              This setup can only be performed once to ensure platform security.
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
