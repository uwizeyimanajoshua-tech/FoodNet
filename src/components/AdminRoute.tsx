import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { Loader2, ShieldAlert } from "lucide-react";

export function AdminRoute({ children }: { children: React.ReactNode }) {
  const { user, loading, isAdmin } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fdfaf6]">
        <Loader2 className="animate-spin text-orange-600" size={40} />
      </div>
    );
  }

  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
        <div className="max-w-md w-full bg-white rounded-[3rem] p-12 text-center shadow-xl border border-gray-100">
          <div className="w-20 h-20 bg-red-100 text-red-600 rounded-[2rem] flex items-center justify-center mx-auto mb-8">
            <ShieldAlert size={40} />
          </div>
          <h1 className="text-3xl font-black text-gray-900 mb-4">Unauthorized</h1>
          <p className="text-gray-500 font-medium mb-8">
            You do not have the administrator privileges required to access this page.
          </p>
          <Navigate to="/login" replace />
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
