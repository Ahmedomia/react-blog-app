import { useNavigate } from "react-router-dom";
import { FiLogOut } from "react-icons/fi";
import { useUserStore } from "../store/userStore";

export default function LogOutButton() {
  const navigate = useNavigate();
  const clearUser = useUserStore((state) => state.clearUser);

  const handleLogout = () => {
    clearUser();
    navigate("/");
  };

  return (
    <button
      onClick={handleLogout}
      className="w-full flex items-center justify-center text-red-600 border border-gray-400 py-2 rounded-xl cursor-pointer text-center hover:bg-gray-100 transition gap-2"
    >
      <FiLogOut className="w-5 h-5" />
      Log Out
    </button>
  );
}
