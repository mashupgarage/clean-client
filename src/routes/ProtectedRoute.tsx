// ProtectedRoute.tsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const ProtectedRoute: React.FC<{ children: JSX.Element }> = ({ children }) => {
  const { isAuthenticated } = useAuth();

  // console.log(`isAuthenticated: ${isAuthenticated}`);

  if (!isAuthenticated) {
    // User is not authenticated; redirect them to the login page
    return <Navigate to="/login" replace />;
  }
  // User is authenticated; render the requested route
  return children;
};

export default ProtectedRoute;
