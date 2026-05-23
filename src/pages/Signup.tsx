import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../components/AuthContext";
import { motion } from "motion/react";
import { toast } from "react-hot-toast";
import { User, Mail, Lock, UserPlus, Chrome, ArrowRight, AlertCircle, Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function Signup() {
  const { t } = useTranslation();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { signUp, signIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      await signUp(email, password, username);
      toast.success(t("common.success"));
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.message || t("common.error"));
      toast.error(err.message || t("common.error"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError("");
    setIsLoading(true);
    try {
      await signIn();
      toast.success(t("common.success"));
      navigate("/dashboard");
    } catch (err: any) {
      if (err.code === "auth/popup-closed-by-user") {
        setIsLoading(false);
        return;
      }
      setError(err.message || "Google sign-in failed. Please try again.");
      toast.error("Google signup failed.");
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
              <h1 className="text-4xl font-black tracking-tighter text-gray-950 mb-2 uppercase">{t("auth.signup.title")}</h1>
              <p className="text-gray-500 font-medium">{t("auth.signup.subtitle")}</p>
            </div>

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

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-4">{t("auth.signup.fullNameLabel")}</label>
                <div className="relative">
                  <User className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input 
                    type="text" 
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Joshua Uwizeyimana"
                    className="w-full bg-gray-50 border border-gray-100 rounded-[2rem] px-14 py-5 outline-none focus:ring-4 ring-orange-100 transition-all font-bold text-gray-900" 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-4">{t("auth.login.emailLabel")}</label>
                <div className="relative">
                  <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input 
                    type="email" 
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full bg-gray-50 border border-gray-100 rounded-[2rem] px-14 py-5 outline-none focus:ring-4 ring-orange-100 transition-all font-bold text-gray-900" 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-4">{t("auth.login.passwordLabel")}</label>
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
                className="w-full bg-orange-600 text-white py-5 rounded-[2.5rem] font-bold text-lg shadow-xl shadow-orange-600/20 hover:bg-orange-700 transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50 mt-4 uppercase"
              >
                {isLoading ? (
                  <Loader2 className="animate-spin" size={22} />
                ) : (
                  <>
                    {t("auth.signup.createAccount")}
                    <UserPlus size={20} />
                  </>
                )}
              </button>
            </form>

            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-100"></div>
              </div>
              <div className="relative flex justify-center text-xs font-black uppercase tracking-widest bg-white px-4 text-gray-400">
                {t("auth.login.orContinueWith")}
              </div>
            </div>

            <button 
              onClick={handleGoogleSignIn}
              className="w-full flex items-center justify-center gap-3 py-4 border-2 border-gray-100 rounded-[2rem] font-bold text-gray-600 hover:bg-gray-50 transition-all uppercase"
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

            <div className="mt-8 text-center text-sm font-medium text-gray-400 px-4">
              By joining, you agree to FoodNet Rwanda's terms of service and privacy policy.
            </div>

            <div className="mt-10 text-center">
              <p className="text-gray-500 font-medium tracking-tight">
                {t("auth.signup.alreadyHaveAccount")} {" "}
                <Link to="/login" className="text-orange-600 font-black hover:underline uppercase">{t("auth.login.signIn")}</Link>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
