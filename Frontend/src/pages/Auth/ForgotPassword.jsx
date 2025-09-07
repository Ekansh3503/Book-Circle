import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import loginAsset from "../../assets/LoginScreenAsset.png";
import { IoArrowBackOutline } from "react-icons/io5";
import { EmailEnter } from "../../services/authService";
import { Alert } from "@mui/material";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [emailSuccess, setEmailSuccess] = useState("");
  const [isValidEmail, setIsValid] = useState(false);
  const [debouncedEmail, setDebouncedEmail] = useState("");
  const navigate = useNavigate();

  const validateEmail = useCallback(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValidEmail = emailRegex.test(debouncedEmail);
    setIsValid(isValidEmail);

    if (!debouncedEmail) {
      setEmailError("");
    } else if (!isValidEmail) {
      setEmailError("Invalid email format");
    } else {
      setEmailError("");
    }
  }, [debouncedEmail]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedEmail(email);
    }, 500);

    return () => clearTimeout(timer);
  }, [email]);

  useEffect(() => {
    validateEmail();
  }, [debouncedEmail, validateEmail]);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setEmailError("");
  };

  const handleSubmit = async () => {
    if (!email) {
      setEmailError("Please Enter your Registered Email Id");
      setEmailSuccess("");
      return;
    }

    if (!isValidEmail) {
      setEmailError("Invalid email format");
      setEmailSuccess("");
      return;
    }

    try {
      const response = await EmailEnter(email);
      setEmailError("");
      setEmailSuccess("");
      console.log(response);

      if (response.success === true) {
        setEmailSuccess(
          "Reset password link sent successfully. Please check your email."
        );
        setEmail("");
      } else {
        setEmailError(response.message);
      }

      setTimeout(() => {
        setEmailError("");
        setEmailSuccess("");
      }, 5000);
    } catch (error) {
      console.error("Error requesting password reset:", error);
      setEmailError(error.response?.data?.message || "An error occurred");
      setEmailSuccess("");

      setTimeout(() => {
        setEmailError("");
      }, 3000);
    }
  };

  return (
    <div className="flex items-center justify-center w-full h-screen p-4">
      <div className="w-full h-screen flex flex-col items-center lg:w-1/2 bg-br-white py-4 px-2">
        <div
          className="bg-br-blue-light items-center w-full py-6 px-4 text-2xl font-bold text-navyblue rounded-2xl"
          style={{ height: "auto" }}
        >
          BookCircle
        </div>

        <div className="flex flex-col h-full justify-center px-28 w-full rounded-2xl bg-br-blue-light mt-4">
          <p className="font-medium text-2xl text-br-blue-medium mt-4">
            Reset Password
          </p>
          <p className="font-medium text-md text-br-blue-medium pe-5">
            Enter your email to reset your password.
          </p>

          {emailError && (
            <Alert variant="outlined" severity="error">
              <b>{emailError}</b>
            </Alert>
          )}
          {emailSuccess && (
            <Alert variant="outlined" severity="success">
              {emailSuccess}
            </Alert>
          )}
          <div className="mt-4">
            <div>
              <label className="text-md font-medium text-br-blue-medium">
                Email
              </label>
              <input
                className="email w-full bg-white text-br-blue-medium rounded-xl px-4 py-3 mt-1"
                placeholder="Enter your email"
                type="email"
                value={email}
                onChange={handleEmailChange}
              />
            </div>

            <div className="mt-4 flex flex-col gap-y-4">
              <button
                className="py-3 rounded-xl cursor-pointer bg-br-blue-medium text-white text-md font-bold"
                onClick={handleSubmit}
              >
                Send Reset Link
              </button>
            </div>
            <button
              className="text-md flex items-center text-br-blue-medium font-semibold mt-4 mb-4 cursor-pointer"
              onClick={() => navigate("/signin")}
            >
              <IoArrowBackOutline className="text-xl mr-2" />
              Back to Sign In
            </button>
          </div>
        </div>
      </div>

      <div className="hidden lg:flex w-1/2 h-screen items-center justify-center bg-white py-4 px-2">
        <div className="bg-br-blue-light flex items-center justify-center w-full h-full py-4 px-4 rounded-2xl">
          <img
            src={loginAsset}
            alt="Login illustration"
            style={{ height: "auto", maxHeight: "500px" }}
          />
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
