import React, { useRef, useState } from "react";
import { useFormik } from "formik";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { RegisterSchema } from "../utils/RegisterValidation"; // Your Yup schema
import API from "../api/Axios"; // Your axios instance
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading,setLoading] = useState(false);
  const emailRef = useRef();
  const usernameref = useRef();
  const passwordRef = useRef();
  const navigate = useNavigate();

  const Focus = (ref) => {
    if (ref.current) ref.current.classList.add("focus");
  };

  const Blur = (ref) => {
    if (ref.current) ref.current.classList.remove("focus");
  };

  const initialValues = {
    username: "",
    email: "",
    password: "",
  };

  const { values, touched, errors, handleSubmit, handleBlur, handleChange } =
    useFormik({
      initialValues,
      validationSchema: RegisterSchema,
      onSubmit: async (values) => {
        setLoading(true);
        try {
          const res = await API.post("/signup", values);
          toast.success(res.data.message || "Verification code sent!");
          // Redirect to OTP verification page with email param
          navigate(`/auth/otp-verification/${encodeURIComponent(values.email)}`);
        } catch (error) {
          toast.error(
            error.response?.data?.message || "Signup failed, try again!"
          );
        }
        finally{
          setLoading(false);
        }
      },
    });

  return (
    <div className="Register">
      <form onSubmit={handleSubmit}>
        <div className="Input-Box" ref={usernameref}>
          <div>
            <label htmlFor="username">Username</label>
            {touched.username && errors.username ? (
              <p>{errors.username}</p>
            ) : null}
          </div>
          <input
            onFocus={() => Focus(usernameref)}
            onBlur={(e) => {
              Blur(usernameref);
              handleBlur(e);
            }}
            id="username"
            placeholder="Enter your username"
            value={values.username}
            name="username"
            autoFocus
            onChange={handleChange}
          />
        </div>
        <div className="Input-Box" ref={emailRef}>
          <div>
            <label htmlFor="email">Email</label>
            {touched.email && errors.email ? <p>{errors.email}</p> : null}
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
            onChange={handleChange}
            placeholder="Enter your Email"
            value={values.email}
          />
        </div>

        <div className="Input-Box" ref={passwordRef}>
          <div>
            <label htmlFor="password">Password</label>
            {touched.password && errors.password ? (
              <p>{errors.password}</p>
            ) : null}
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
              onChange={handleChange}
              value={values.password}
              name="password"
            />
            <span onClick={() => setShowPassword((prev) => !prev)}>
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
        </div>
        <button type="submit" disabled={loading}>{loading ? "please Wait .." : "Get Verification Code"}</button>
      </form>
    </div>
  );
};

export default Register;
