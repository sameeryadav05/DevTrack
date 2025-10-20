import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import API from "../api/Axios";
import { toast } from "react-toastify";
import AuthStore from "../store/AuthStore";

const OtpVerify = () => {
  const { email } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  const setAuthInfo = AuthStore((state) => state.setAuthInfo);

  const validationSchema = Yup.object({
    verificationCode: Yup.string()
      .required("Verification code is required")
      .matches(/^\d{5}$/, "Code must be exactly 5 digits"),
  });

  const formik = useFormik({
    initialValues: {
      email: email || "",
      verificationCode: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      try {
        const res = await API.post("/verify-email", values);
        toast.success(res.data.message || "Verification successful!");
        if (res.data.token && res.data.userData) {
          setAuthInfo(res.data.token, res.data.userData);
          localStorage.setItem("token", res.data.token);
          localStorage.setItem("userData", JSON.stringify(res.data.userData));
          API.defaults.headers.common["Authorization"] = `Bearer ${res.data.token}`;
        }
        navigate("/", { replace: true });
      } catch (error) {
        toast.error(
          error.response?.data?.message || "Verification failed, try again!"
        );
      } finally {
        setLoading(false);
      }
    },
  });

  // Resend verification code handler
  const handleResendCode = async () => {
    if (!email) {
      toast.error("Email not found for resending code");
      return;
    }
    setResendLoading(true);
    try {
      const res = await API.post("/resend-code", { email });
      toast.success(res.data.message || "New verification code sent!");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to resend verification code"
      );
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="otp">
      <div className="otp-verify-container">
        <h2>OTP Verification</h2>
        <p>
          Enter the 5-digit verification code sent to your email
        </p>
        <form onSubmit={formik.handleSubmit} className="otp-form">
          <input
            type="text"
            id="verificationCode"
            name="verificationCode"
            placeholder="Enter verification code"
            maxLength={5}
            value={formik.values.verificationCode}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            autoComplete="off"
            className={
              formik.touched.verificationCode && formik.errors.verificationCode
                ? "input-error"
                : ""
            }
          />
          {formik.touched.verificationCode && formik.errors.verificationCode ? (
            <div className="error">{formik.errors.verificationCode}</div>
          ) : (
            null
          )}
          <button type="submit" disabled={loading}>
            {loading ? "Verifying..." : "Verify"}
          </button>
        </form>
        <button
          className="resend-button"
          onClick={handleResendCode}
          disabled={resendLoading}
        >
          {resendLoading ? "Resending..." : "Resend Verification Code"}
        </button>
      </div>
    </div>
  );
};

export default OtpVerify;
