import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "../store/userStore";

export function useSignupForm() {
  const [name, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState("form");
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const setUser = useUserStore((state) => state.setUser);

  const handleInitialSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    if (name.trim() === "") newErrors.name = "Full name is required";
    if (email.trim() === "") newErrors.email = "Email is required";
    if (password.trim() === "") {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/auth/send-verification`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name, email, password, profilepic: "" }),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setStep("verify");
    } catch (err) {
      setErrors({
        email: err.message || "Failed to send verification email",
      });
    }
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/auth/verify-email`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name, email, password, code }),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      localStorage.setItem("token", data.token);
      setUser(data.user);
      navigate("/mainpage");
    } catch (err) {
      setErrors({ code: err.message || "Verification failed" });
    }
  };

  return {
    email,
    password,
    code,
    name,
    setShowPassword,
    showPassword,
    errors,
    step,
    setCode,
    setPassword,
    setEmail,
    setFullName,
    handleInitialSubmit,
    handleVerifyCode,
  };
}
