import { Navigate } from "react-router-dom";
import { useUserStore } from "../store/userStore";

export function ProtectedRoute({ children }) {
  const { user } = useUserStore();

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return children;
}
