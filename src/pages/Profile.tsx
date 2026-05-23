import React from "react";
import { useAuth } from "../components/AuthContext";
import { motion } from "motion/react";
import { User, Mail, Calendar, Shield, MapPin, Camera } from "lucide-react";

export function Profile() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen pt-32 pb-24 bg-[#fdfaf6]">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-[3rem] overflow-hidden shadow-2xl shadow-orange-900/5 border border-gray-100"
          >
            {/* Header / Cover */}
            <div className="h-48 bg-orange-600 relative">
                <div className="absolute -bottom-16 left-12">
                    <div className="relative">
                        {user?.photoURL ? (
                            <img src={user.photoURL} alt="User" className="w-32 h-32 rounded-[2.5rem] border-4 border-white shadow-xl object-cover" />
                        ) : (
                            <div className="w-32 h-32 rounded-[2.5rem] bg-gray-100 border-4 border-white shadow-xl flex items-center justify-center text-orange-600">
                                <User size={48} />
                            </div>
                        )}
                        <button className="absolute bottom-2 right-2 p-2 bg-white text-gray-600 rounded-xl shadow-lg hover:text-orange-600 transition-colors">
                            <Camera size={18} />
                        </button>
                    </div>
                </div>
            </div>

            <div className="pt-20 pb-12 px-12">
                <div className="flex justify-between items-start mb-12">
                    <div>
                        <h1 className="text-4xl font-black text-gray-950 tracking-tight mb-2">{user?.displayName || "Food Enthusiast"}</h1>
                        <p className="text-gray-500 font-medium">@foodnet_member</p>
                    </div>
                    <button className="px-8 py-3 bg-gray-900 text-white rounded-2xl font-bold hover:bg-orange-600 transition-all shadow-xl shadow-gray-900/20">
                        Edit Profile
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                        <div className="p-6 bg-gray-50 rounded-3xl border border-gray-100">
                            <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-6 px-2">Account Details</h3>
                            <div className="space-y-4">
                                <div className="flex items-center gap-4 text-gray-700">
                                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-orange-600 shadow-sm">
                                        <Mail size={18} />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-gray-400 uppercase">Email</p>
                                        <p className="font-bold">{user?.email}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 text-gray-700">
                                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-orange-600 shadow-sm">
                                        <Calendar size={18} />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-gray-400 uppercase">Joined</p>
                                        <p className="font-bold">May 2024</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 bg-orange-50 rounded-3xl border border-orange-100">
                            <h3 className="text-xs font-black uppercase tracking-widest text-orange-600 mb-6 px-2">Kirehe Delivery Info</h3>
                            <div className="flex items-start gap-4 text-orange-900">
                                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-orange-600 shadow-sm shrink-0">
                                    <MapPin size={18} />
                                </div>
                                <p className="font-medium leading-relaxed">
                                    Main Street, Kirehe District,<br />
                                    Near the Market Center
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="p-6 bg-gray-50 rounded-3xl border border-gray-100">
                            <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-6 px-2">Security</h3>
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <Shield size={20} className="text-green-600" />
                                    <span className="font-bold text-gray-700">Two-Factor Auth</span>
                                </div>
                                <div className="w-12 h-6 bg-gray-200 rounded-full relative">
                                    <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full" />
                                </div>
                            </div>
                            <p className="text-sm text-gray-500 mb-6">Enhance your account security by enabling 2FA.</p>
                            <button className="w-full py-4 border-2 border-gray-200 rounded-2xl font-bold text-gray-600 hover:border-orange-600 hover:text-orange-600 transition-all">
                                Change Password
                            </button>
                        </div>
                    </div>
                </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
