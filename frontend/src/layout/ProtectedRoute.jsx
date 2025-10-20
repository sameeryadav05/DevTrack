// src/layout/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import AuthStore from "../store/AuthStore";

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = AuthStore((state) => state.isAuthenticated);
  if (!isAuthenticated) return <Navigate to="/auth" replace />;
  return children;
};

export default ProtectedRoute;
