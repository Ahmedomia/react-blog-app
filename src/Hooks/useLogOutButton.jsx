import { useNavigate } from "react-router-dom";
import { useUserStore } from "../store/userStore";

export function useLogOutButton() {
  const navigate = useNavigate();
  const clearUser = useUserStore((state) => state.clearUser);

  const handleLogout = async () => {
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (err) {
      console.error("Logout error:", err);
    }
    clearUser();
    navigate("/");
  };
  return { handleLogout };
}
