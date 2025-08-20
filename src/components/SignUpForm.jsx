import { Link } from "react-router-dom";
import GoogleLoginButton from "./GoogleLoginButton";
import { useSignupForm } from "../Hooks/useSignupForm";

export default function SignupForm() {
  const {
    email,
    password,
    name,
    code,
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
  } = useSignupForm();

  return (
    <div className="max-w-md w-full">
      {step === "form" && (
        <>
          <h2 className="text-4xl font-bold mb-1 text-black/80">
            Join us Now!!
          </h2>
          <p className="text-gray-400 mb-10">Let's create your account</p>
          <form onSubmit={handleInitialSubmit} className="space-y-4">
            <div>
              <label className="block mb-2 font-bold text-black/80">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setFullName(e.target.value)}
                className={`w-full border rounded-xl px-4 py-2 ${
                  errors.name ? "border-red-500" : "border-gray-400"
                }`}
                placeholder="Enter your name"
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name}</p>
              )}
            </div>

            <div>
              <label className="block mb-2 font-bold text-black/80">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full border rounded-xl px-4 py-2 ${
                  errors.email ? "border-red-500" : "border-gray-400"
                }`}
                placeholder="admin@gmail.com"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <label className="block mb-2 font-bold text-black/80">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full border rounded-xl px-4 py-2 ${
                    errors.password ? "border-red-500" : "border-gray-400"
                  }`}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3"
                >
                  <img
                    src="/assets/view.svg"
                    alt="toggle"
                    className="w-5 h-5"
                  />
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-[#6e6cdf] text-white py-2 rounded-xl mt-8 hover:bg-[#5b59d1] transition"
            >
              Send Verification Code
            </button>
          </form>
        </>
      )}

      {step === "verify" && (
        <>
          <h2 className="text-2xl font-bold mb-4 text-black/80">
            Verify your email
          </h2>
          <p className="text-gray-500 mb-4">
            A verification code was sent to <strong>{email}</strong>
          </p>
          <form onSubmit={handleVerifyCode} className="space-y-4">
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full border rounded-xl px-4 py-2 border-gray-400"
              placeholder="Enter verification code"
            />
            {errors.code && (
              <p className="text-red-500 text-sm mt-1">{errors.code}</p>
            )}
            <button
              type="submit"
              className="w-full bg-[#6e6cdf] text-white py-2 rounded-xl mt-4 hover:bg-[#5b59d1] transition"
            >
              Verify & Create Account
            </button>
          </form>
        </>
      )}

      {step === "form" && (
        <>
          <div className="text-black/20 text-[16px] text-center my-6">
            ──── OR ────
          </div>
          <GoogleLoginButton />
          <div className="text-center text-gray-400 mt-4">
            Already have an account?
            <Link to="/" className="ml-2 text-[#6e6cdf] font-bold">
              Sign in
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
