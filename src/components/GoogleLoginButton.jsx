import { useGoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "../store/userStore";

export default function GoogleLoginButton() {
  const navigate = useNavigate();
  const setUser = useUserStore((state) => state.setUser);

  const login = useGoogleLogin({
    flow: "auth-code",
    onSuccess: async (codeResponse) => {
      try {
        const res = await fetch("http://localhost:5000/api/auth/google-login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code: codeResponse.code }),
        });

        const result = await res.json();

        if (res.ok) {
          localStorage.setItem("token", result.token);
          setUser(result.user);
          navigate("/mainpage");
        } else {
          console.error("Backend Google login error:", result);
        }
      } catch (err) {
        console.error("Google login flow failed:", err);
      }
    },
    onError: () => {
      console.error("Google Login Failed");
    },
  });

  return (
    <div
      onClick={() => login()}
      className="w-full border border-gray-300 py-2 rounded-xl flex items-center justify-center gap-2 hover:bg-gray-100 transition cursor-pointer"
    >
      <img src="/assets/Social Icons.svg" alt="Google" className="w-5 h-5" />
      <span>Sign in using Google</span>
    </div>
  );
}
