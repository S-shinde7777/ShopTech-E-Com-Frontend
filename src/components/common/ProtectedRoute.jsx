import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { user, loading, isAuthenticated, isAdmin } = useContext(AuthContext);

  // Show a loading screen while auth state is resolving
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0F1117] text-white flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#5FE3CF] border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-400">Loading your profile...</p>
      </div>
    );
  }

  // Not authenticated? Redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Admin access required but user is not admin? Redirect to home storefront
  if (requireAdmin && !isAdmin) {
    return <Navigate to="/home" replace />;
  }

  return children;
};

export default ProtectedRoute;
