import { useNavigate } from "react-router-dom";
import { useUserStore } from "../store/userStore";

export function useLogOutButton() {
  const navigate = useNavigate();
  const clearUser = useUserStore((state) => state.clearUser);

  const handleLogout = () => {
    clearUser();
    navigate("/");
  };
  return { handleLogout };
}
