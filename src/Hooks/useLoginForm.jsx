import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "../store/userStore";

export function useLoginform() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const setUser = useUserStore((state) => state.setUser);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    if (email.trim() === "") newErrors.email = "Email is required";
    if (password.trim() === "") newErrors.password = "Password is required";
    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrors({
          password: data.message || "Email or Password is invalid",
        });
        return;
      }
      localStorage.setItem("token", data.token);
      setUser(data.user);
      navigate("/mainpage");
    } catch (err) {
      console.error("Login error:", err);
      setErrors({ password: "Something went wrong. Try again later." });
    }
  };
  return {
    email,
    password,
    setEmail,
    setPassword,
    showPassword,
    setShowPassword,
    errors,
    handleSubmit,
  };
}
