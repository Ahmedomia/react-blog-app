import { useState } from "react";
import axios from "axios";

export function useForgetPassword() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const API = import.meta.env.VITE_API_URL;
  const sendCode = async () => {
    try {
      const res = await axios.post(`${API}/api/auth/forgot-password`, {
        email,
      });
      setMessage(res.data.message);
      setStep(2);
    } catch (err) {
      setMessage(err.response?.data?.message || "Something went wrong.");
    }
  };
  const verifyCode = async () => {
    try {
      const res = await axios.post(`${API}/api/auth/verify-code`, {
        email,
        code,
      });
      setMessage(res.data.message);
      setStep(3);
    } catch (err) {
      setMessage(err.response?.data?.message || "Invalid code.");
    }
  };
  const resetPassword = async () => {
    try {
      const res = await axios.put(`${API}/api/auth/reset-password`, {
        email,
        code,
        newPassword,
      });
      setMessage(res.data.message);
      setStep(4);
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to reset password.");
    }
  };

  return {
    step,
    email,
    setEmail,
    code,
    setCode,
    newPassword,
    setNewPassword,
    message,
    setMessage,
    sendCode,
    verifyCode,
    resetPassword,
  };
}
