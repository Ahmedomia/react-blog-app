import { useGoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "../store/userStore";

export default function GoogleLoginButton() {
  const navigate = useNavigate();
  const setUser = useUserStore((state) => state.setUser);

  const login = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
        headers: {
          Authorization: `Bearer ${tokenResponse.access_token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          const userData = {
            fullName: data.name,
            email: data.email,
            profilePic: data.picture,
          };

          setUser(userData);

          const existingUsers = JSON.parse(localStorage.getItem("users")) || [];
          const alreadyExists = existingUsers.some(
            (user) => user.email === userData.email
          );

          if (!alreadyExists) {
            existingUsers.push(userData);
            localStorage.setItem("users", JSON.stringify(existingUsers));
          }

          navigate("/mainpage");
        })
        .catch((err) => {
          console.error("Google User Info fetch error:", err);
        });
    },
    onError: (error) => {
      console.error("Login Failed:", error);
    },
  });

  return (
    <button
      type="button"
      onClick={() => login()}
      className="w-full border border-gray-300 py-2 rounded-xl flex items-center justify-center gap-2 hover:bg-gray-100 transition cursor-pointer"
    >
      <img src="/assets/Social Icons.svg" alt="Google" className="w-5 h-5" />
      <span className="text-sm text-black/80">Continue with Google</span>
    </button>
  );
}
