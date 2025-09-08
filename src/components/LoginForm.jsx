import { useState } from "react";
import GoogleLoginButton from "./GoogleLoginButton";
import { Link } from "react-router-dom";
import { useLoginform } from "../Hooks/useLoginForm";

export default function LoginForm() {
  const {
    email,
    password,
    setEmail,
    setPassword,
    showPassword,
    setShowPassword,
    errors,
    handleSubmit,
  } = useLoginform();

  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await handleSubmit(e);
    } finally {
      setLoading(false);
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
      <form onSubmit={onSubmit} className="space-y-4">
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
          disabled={loading}
          className={`w-full flex items-center justify-center gap-2 bg-[#6e6cdf] text-white py-2 rounded-xl mt-8 text-center transition ${
            loading
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-[#5b59d1] cursor-pointer"
          }`}
        >
          {loading && (
            <svg
              className="animate-spin h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              ></path>
            </svg>
          )}
          {loading ? "Signing in..." : "Sign in"}
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
