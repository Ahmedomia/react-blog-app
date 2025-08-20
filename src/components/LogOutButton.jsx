import { FiLogOut } from "react-icons/fi";
import { useLogOutButton } from "../Hooks/useLogOutButton";

export default function LogOutButton() {
  const { handleLogout } = useLogOutButton();

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
