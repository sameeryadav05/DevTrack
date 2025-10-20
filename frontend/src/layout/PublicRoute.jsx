// src/layout/PublicRoute.jsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthStore from "../store/AuthStore";

const PublicRoute = ({ children }) => {
  const isAuthenticated = AuthStore((state) => state.isAuthenticated);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  return !isAuthenticated ? children : null;
};

export default PublicRoute;
