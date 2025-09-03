import { FiLogOut } from "react-icons/fi";
import { useLogOutButton } from "../Hooks/useLogOutButton";

export default function LogOutButton() {
  const { handleLogout } = useLogOutButton();

  return (
    <button onClick={handleLogout}>
      <FiLogOut size={20} />
    </button>
  );
}
