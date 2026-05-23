import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { Loader2 } from "lucide-react";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fdfaf6]">
        <div className="text-center">
            <Loader2 className="animate-spin text-orange-600 mx-auto mb-4" size={40} />
            <p className="text-gray-500 font-bold uppercase tracking-widest text-xs animate-pulse">Authenticating...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    // Redirect to login but save the location they were trying to go to
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
