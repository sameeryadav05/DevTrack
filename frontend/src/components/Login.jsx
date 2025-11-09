// src/components/Login.jsx
import React, { useRef, useState, useEffect } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useFormik } from "formik";
import { LoginSchema } from "../utils/LoginValidation";
import AuthStore from "../store/AuthStore";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import API from "../api/Axios";

const Login = () => {
  const setAuthInfo = AuthStore((state) => state.setAuthInfo);
  const isAuthenticated = AuthStore((state) => state.isAuthenticated);
  const [showPassword, setShowPassword] = useState(false);
    const [loading,setLoading] = useState(false);
  const navigate = useNavigate();

  const emailRef = useRef();
  const passwordRef = useRef();

  const Focus = (ref) => ref.current && ref.current.classList.add("focus");
  const Blur = (ref) => ref.current && ref.current.classList.remove("focus");

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const initialValues = { email: "", password: "" };
  const { values, touched, errors, handleSubmit, handleBlur, handleChange } = useFormik({
    initialValues,
    validationSchema: LoginSchema,
    onSubmit: (values) => handleLogin(values),
  });

  const handleLogin = async (formData) => {
    setLoading(true)
    try {
      const res = await API.post("/login", formData, { withCredentials: true });
      const { token, userData } = res.data;

      if(res.data.message == 'verification code is sent to your email')
      {
        return navigate(`/auth/otp-verification/${values.email}`)
      }

      if (token && userData) {
        setAuthInfo(token, userData);
        localStorage.setItem("token",token);
          localStorage.setItem("userData", JSON.stringify(userData));
          API.defaults.headers.common["Authorization"] = `Bearer ${res.data.token}`;
        API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      }

      toast.success(res.data.message || "Login successful!");
      navigate("/", { replace: true });
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid email or password");
      AuthStore.getState().clearAuth();
    }
    finally{
      setLoading(false);
    }
  };

  return (
    <div className="login">
      <form onSubmit={handleSubmit}>
        <div className="Input-Box" ref={emailRef}>
          <div>
            <label htmlFor="email">Email</label>
            {errors.email && touched.email ? <p>{errors.email}</p> : null}
          </div>
          <input
            onFocus={() => Focus(emailRef)}
            onBlur={(e) => {
              Blur(emailRef);
              handleBlur(e);
            }}
            type="text"
            id="email"
            name="email"
            autoFocus
            placeholder="Enter your Email"
            value={values.email}
            onChange={handleChange}
          />
        </div>

        <div className="Input-Box" ref={passwordRef}>
          <div>
            <label htmlFor="password">Password</label>
            {errors.password && touched.password ? <p>{errors.password}</p> : null}
          </div>

          <div className="password-wrapper">
            <input
              onFocus={() => Focus(passwordRef)}
              onBlur={(e) => {
                Blur(passwordRef);
                handleBlur(e);
              }}
              autoComplete="off"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              id="password"
              name="password"
              value={values.password}
              onChange={handleChange}
            />
            <span onClick={() => setShowPassword((prev) => !prev)}>
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
        </div>

        <button type="submit" disabled={loading}>{loading?"please wait ...":"Login"}</button>
      </form>
    </div>
  );
};

export default Login;
