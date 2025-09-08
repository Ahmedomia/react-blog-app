import { FiLogOut } from "react-icons/fi";
import { useLogOutButton } from "../Hooks/useLogOutButton";

export default function LogOutButton({ className = "", size = 20, children }) {
  const { handleLogout } = useLogOutButton();

  return (
    <button className={`cursor-pointer ${className}`} onClick={handleLogout}>
      <FiLogOut size={size} />
      {children && <span>{children}</span>}
    </button>
  );
}
