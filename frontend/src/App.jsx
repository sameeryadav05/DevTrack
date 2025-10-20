// src/App.jsx
import React, { useEffect } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
} from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import Home from "./pages/Home.jsx";
import Auth from "./pages/Auth.jsx";
import OtpVerify from "./pages/OtpVerify.jsx";
import NotFound from "./pages/NotFound.jsx";
import ProtectedRoute from "./layout/ProtectedRoute.jsx";
import PublicRoute from "./layout/PublicRoute.jsx";
import { applyTokenToAxios } from "./api/ApplyToken.js";
import AuthStore from "./store/AuthStore";

const Layout = () => (
  <>
    <Navbar />
    <Outlet />
    <Footer />
  </>
);

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: (
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    path: "/auth",
    element: (
      <PublicRoute>
        <Auth />
      </PublicRoute>
    ),
  },
  {
    path: "/auth/otp-verification/:email",
    element: (
      <PublicRoute>
        <OtpVerify />
      </PublicRoute>
    ),
  },
  { path: "*", element: <NotFound /> },
]);

function App() {
  const isAuthenticated = AuthStore((state) => state.isAuthenticated);

  useEffect(() => {
    applyTokenToAxios();
  }, [isAuthenticated]);

  return (
    <>
      <RouterProvider router={router} />
      <ToastContainer position="top-right" autoClose={3000} theme="colored" />
    </>
  );
}

export default App;
