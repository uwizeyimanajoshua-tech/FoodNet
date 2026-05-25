import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../components/AuthContext";
import { db } from "../lib/firebase";
import { collection, query, where, getDocs, limit } from "firebase/firestore";
import { motion } from "motion/react";
import { toast } from "react-hot-toast";
import { Mail, Lock, LogIn, Github, Chrome, ArrowRight, AlertCircle, Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function Login() {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showSetupNudge, setShowSetupNudge] = useState(false);
  const { signInWithEmail, signIn } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    const checkAdmin = async () => {
      try {
        const q = query(collection(db, "users"), where("role", "==", "admin"), limit(1));
        const snapshot = await getDocs(q);
        if (snapshot.empty) {
          setShowSetupNudge(true);
        }
      } catch (err) {
        console.error("Error checking admin existence:", err);
      }
    };
    checkAdmin();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      await signInWithEmail(email, password);
      toast.success(t("auth.login.welcomeBackToast"));
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.message || t("auth.login.loginFailed"));
      toast.error(err.message || t("auth.login.loginFailed"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError("");
    setIsLoading(true);
    try {
      await signIn();
      toast.success(t("auth.login.welcomeBackToast"));
      navigate("/dashboard");
    } catch (err: any) {
      if (err.code === "auth/popup-closed-by-user") {
        setIsLoading(false);
        return;
      }
      setError(err.message || "Google sign-in failed. Please try again.");
      toast.error(err.message || "Google sign-in failed. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

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
              <Link to="/" className="inline-block mb-8">
                <img src="/foodnet.png" alt="FoodNet Logo" className="h-32 w-auto mx-auto" referrerPolicy="no-referrer" />
              </Link>
              <h1 className="text-4xl font-black tracking-tighter text-gray-950 mb-2">{t("auth.login.title")}</h1>
              <p className="text-gray-500 font-medium">{t("auth.login.subtitle")}</p>
            </div>

            {showSetupNudge && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mb-8 p-6 bg-orange-50 border-2 border-orange-100 rounded-[2rem] text-center"
              >
                <h3 className="text-lg font-black text-orange-950 mb-2">{t("auth.login.firstTimeAdmin")}</h3>
                <p className="text-sm font-medium text-orange-700 mb-4 px-2">
                  {t("auth.login.noAdminSet")}
                </p>
                <Link 
                  to="/setup-admin"
                  className="inline-flex items-center gap-2 bg-orange-600 text-white px-6 py-3 rounded-full font-bold text-sm shadow-lg shadow-orange-600/20 hover:bg-orange-700 transition-all"
                >
                  {t("auth.login.setupAdmin")}
                  <ArrowRight size={16} />
                </Link>
              </motion.div>
            )}

            {error && (
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 text-sm font-bold"
              >
                <AlertCircle size={18} />
                {error}
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-4">{t("auth.login.emailLabel")}</label>
                <div className="relative">
                  <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input 
                    type="text" 
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t("auth.login.emailLabel")}
                    className="w-full bg-gray-50 border border-gray-100 rounded-[2rem] px-14 py-5 outline-none focus:ring-4 ring-orange-100 transition-all font-bold text-gray-900" 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center px-4">
                  <label className="text-xs font-black uppercase tracking-widest text-gray-400">{t("auth.login.passwordLabel")}</label>
                  <Link to="/forgot-password" size="text-xs font-black text-orange-600 hover:underline">{t("auth.login.forgotPassword")}</Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input 
                    type="password" 
                    required
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
                className="w-full bg-orange-600 text-white py-5 rounded-[2.5rem] font-bold text-lg shadow-xl shadow-orange-600/20 hover:bg-orange-700 transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50 uppercase"
              >
                {isLoading ? (
                  <Loader2 className="animate-spin" size={22} />
                ) : (
                  <>
                    {t("auth.login.signIn")}
                    <LogIn size={20} />
                  </>
                )}
              </button>
            </form>

            <div className="relative my-10">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-100"></div>
              </div>
              <div className="relative flex justify-center text-xs font-black uppercase tracking-widest bg-white px-4 text-gray-400">
                {t("auth.login.orContinueWith")}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <button 
                onClick={handleGoogleSignIn}
                className="flex items-center justify-center gap-3 py-4 border-2 border-gray-100 rounded-[2rem] font-bold text-gray-600 hover:bg-gray-50 transition-all uppercase"
              >
                <svg width="20" height="20" viewBox="0 0 48 48">
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                  <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24s.92 7.54 2.56 10.78l7.97-6.19z"/>
                  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                  <path fill="none" d="M0 0h48v48H0z"/>
                </svg>
                {t("auth.login.google")}
              </button>
            </div>

            <div className="mt-10 text-center">
              <p className="text-gray-500 font-medium tracking-tight">
                {t("auth.login.newToFoodNet")} {" "}
                <Link to="/signup" className="text-orange-600 font-black hover:underline uppercase">{t("auth.login.createAccount")}</Link>
              </p>
            </div>
          </div>

          <div className="mt-8 flex justify-center gap-6">
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-green-600 bg-green-50 px-4 py-2 rounded-full border border-green-100">
              <div className="w-2 h-2 bg-green-600 rounded-full animate-pulse" />
              {t("common.secureAuth")}
            </div>
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-blue-600 bg-blue-50 px-4 py-2 rounded-full border border-blue-100">
              {t("common.rwandaGateway")}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
