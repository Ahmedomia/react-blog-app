import { useState } from "react";
import { useUserStore } from "../store/userStore";
import GoogleLoginButton from "./GoogleLoginButton";
import { Link, useNavigate } from "react-router-dom";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
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
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrors({ password: data.message || "Email or Password is invalid" });
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


  return (
    <div className="max-w-md w-full">
      <h2 className="inline md:hidden text-4xl font-bold text-center mb-1 text-black/80 cursor-default">
        Hey,
      </h2>
      <h2 className="text-4xl font-bold mb-1 text-black/80 cursor-default text-left md:text-center">
        Welcome Back
      </h2>
      <p className="text-left md:text-center text-gray-400 mb-14 cursor-default">
        Please login your account
      </p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-2 font-bold text-black/80">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`w-full border rounded-xl px-4 py-2 focus:outline-[#6C63FF]/80 ${
              errors.email ? "border-red-500" : "border-gray-400"
            }`}
            placeholder="admin@gmail.com"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
          )}
        </div>

        <div>
          <label className="block mb-2 font-bold text-black/80">Password</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full border rounded-xl px-4 py-2 focus:outline-[#6C63FF]/80 ${
                errors.password ? "border-red-500" : "border-gray-400"
              }`}
              placeholder="Enter your password"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute inset-y-0 right-0 flex items-center pr-3 bg-transparent cursor-pointer"
            >
              <img
                src="/assets/view.svg"
                alt="toggle visibility"
                className="w-5 h-5"
              />
            </button>
          </div>
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">{errors.password}</p>
          )}

          <Link
            to="/forgot-password"
            className="block text-right text-sm text-[#6e6cdf] mt-2 cursor-pointer hover:underline font-bold"
          >
            Forgot Password
          </Link>
        </div>

        <button
          type="submit"
          className="w-full flex items-center justify-center bg-[#6e6cdf] text-white py-2 rounded-xl mt-8 cursor-pointer text-center hover:bg-[#5b59d1] transition"
        >
          Sign in
        </button>

        <div className="text-black/20 text-[16px] text-center cursor-default">
          ──── OR ────
        </div>
        <GoogleLoginButton />
        <div className="text-center text-gray-400 cursor-default">
          Didn't have an account ?
          <Link to="/signup" className="ml-2 text-[#6e6cdf] font-bold">
            Sign-up
          </Link>
        </div>
      </form>
    </div>
  );
}
