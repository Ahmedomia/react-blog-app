import { useState } from "react";
import axios from "axios";

export default function ForgotPassword() {
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

  return (
    <div className="max-w-md mx-auto mt-10 p-6 shadow-lg rounded-xl bg-white space-y-6">
      <h2 className="text-2xl font-bold text-center text-[#422f7d]">
        Forgot Password
      </h2>

      {message && (
        <p className="text-center text-sm text-gray-600">{message}</p>
      )}

      {step === 1 && (
        <>
          <input
            type="email"
            className="w-full border p-2 rounded"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button
            onClick={sendCode}
            className="w-full bg-[#422f7d] text-white py-2 rounded hover:bg-purple-700"
          >
            Send Code
          </button>
        </>
      )}

      {step === 2 && (
        <>
          <input
            type="text"
            className="w-full border p-2 rounded"
            placeholder="Enter confirmation code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
          <button
            onClick={verifyCode}
            className="w-full bg-[#422f7d] text-white py-2 rounded hover:bg-purple-700"
          >
            Verify Code
          </button>
        </>
      )}

      {step === 3 && (
        <>
          <input
            type="password"
            className="w-full border p-2 rounded"
            placeholder="Enter new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <button
            onClick={resetPassword}
            className="w-full bg-[#422f7d] text-white py-2 rounded hover:bg-purple-700"
          >
            Reset Password
          </button>
        </>
      )}

      {step === 4 && (
        <p className="text-green-600 text-center font-medium">
          🎉 Your password has been reset. You can now log in.
        </p>
      )}
    </div>
  );
}
