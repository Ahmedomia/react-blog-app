import { useEffect } from "react";
import api from "../api";

export function useAutoRefreshToken() {
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await api.post(
          "/auth/refresh",
          {},
          { withCredentials: true }
        );
        if (res.data.accessToken) {
          localStorage.setItem("accessToken", res.data.accessToken);
        }
      } catch (err) {
        console.error("Failed to refresh token:", err);
      }
    }, 10 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);
}
