import { useState } from "react";
import GoogleLoginButton from "./GoogleLoginButton";
import { Link, useNavigate } from "react-router-dom";
import { useUserStore } from "../store/userStore";

export default function SignupForm() {
  const [name, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const setUser = useUserStore((state) => state.setUser);

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = {};
    if (name.trim() === "") newErrors.fullName = "Full name is required";
    if (email.trim() === "") newErrors.email = "Email is required";
    if (password.trim() === "") {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      const storedUsers = JSON.parse(localStorage.getItem("users")) || [];

      const emailExists = storedUsers.some((user) => user.email === email);
      if (emailExists) {
        setErrors({ email: "Email is already registered" });
        return;
      }

      const newUser = {
        id: Date.now(),
        name,
        email,
        password,
        profilePic: "",
      };

      storedUsers.push(newUser);
      localStorage.setItem("users", JSON.stringify(storedUsers));
      localStorage.setItem("loggedInUser", JSON.stringify(newUser));

      setUser(newUser);
      console.log("User registered:", newUser);
      navigate("/mainpage");
    }
  };

  return (
    <div className="max-w-md w-full">
      <h2 className="flex flex-col md:flex-row md:justify-center md:items-center text-4xl font-bold mb-1 text-black/80 cursor-default text-left md:text-center">
        <span className="md:mr-2">Join us</span>
        <span>Now!!</span>
      </h2>
      <p className="md:text-center text-left text-gray-400 mb-10 cursor-default">
        Let's create your account
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-2 font-bold text-black/80">
            Full Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setFullName(e.target.value)}
            className={`w-full border rounded-xl px-4 py-2 focus:outline-[#6C63FF]/80 ${
              errors.fullName ? "border-red-500" : "border-gray-400"
            }`}
            placeholder="Enter your name"
          />
          {errors.fullName && (
            <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>
          )}
        </div>

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
        </div>

        <button
          type="submit"
          className="w-full flex items-center justify-center bg-[#6e6cdf] text-white py-2 rounded-xl mt-8 cursor-pointer text-center hover:bg-[#5b59d1] transition"
        >
          Sign up
        </button>

        <div className="text-black/20 text-[16px] text-center cursor-default">
          ──── OR ────
        </div>

        <GoogleLoginButton />

        <div className="text-center text-gray-400 cursor-default">
          Already have an account?
          <Link to="/" className="ml-2 text-[#6e6cdf] font-bold">
            Sign in
          </Link>
        </div>
      </form>
    </div>
  );
}
