import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../components/AuthContext";
import { motion } from "motion/react";
import { toast } from "react-hot-toast";
import { Mail, ArrowLeft, Send, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { resetPassword } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setIsLoading(true);
    try {
      await resetPassword(email);
      setMessage("Check your inbox for further instructions.");
      toast.success("Password reset email sent!");
    } catch (err: any) {
      setError(err.message || "Failed to reset password.");
      toast.error(err.message || "Reset failed.");
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
          className="max-w-md mx-auto text-center"
        >
          <div className="bg-white rounded-[3rem] p-10 shadow-2xl shadow-orange-900/5 border border-gray-100">
            <h1 className="text-4xl font-black tracking-tighter text-gray-950 mb-4">Reset Password</h1>
            <p className="text-gray-500 font-medium mb-10">We'll send a recovery link to your email</p>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 text-sm font-bold text-left">
                <AlertCircle size={18} />
                {error}
              </div>
            )}

            {message && (
              <div className="mb-6 p-6 bg-green-50 border border-green-100 rounded-3xl flex flex-col items-center gap-3 text-green-700 text-center">
                <CheckCircle2 size={40} className="mb-2" />
                <p className="font-bold">{message}</p>
                <Link to="/login" className="text-sm underline font-black uppercase tracking-widest mt-2">Back to Login</Link>
              </div>
            )}

            {!message && (
              <form onSubmit={handleSubmit} className="space-y-6 text-left">
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-4">Email Address</label>
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

                <button 
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-orange-600 text-white py-5 rounded-[2.5rem] font-bold text-lg shadow-xl shadow-orange-600/20 hover:bg-orange-700 transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
                >
                  {isLoading ? (
                    <Loader2 className="animate-spin" size={22} />
                  ) : (
                    <>
                      Send Reset Link
                      <Send size={20} />
                    </>
                  )}
                </button>
              </form>
            )}

            <div className="mt-10">
              <Link to="/login" className="inline-flex items-center gap-2 text-gray-500 font-bold hover:text-orange-600 transition-colors">
                <ArrowLeft size={18} />
                Back to Sign In
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
