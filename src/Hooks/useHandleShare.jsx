import { useState } from "react";
import api from "../api"; // Use your custom Axios instance

export function useHandleShare(id) {
  const [notification, setNotification] = useState("");

  const handleShare = async () => {
    try {
      const res = await api.post(`/blogs/${id}/share`);
      const rawShareLink = res.data.shareLink || "";

      if (!rawShareLink) {
        console.error("No share link returned from backend");
        return;
      }

      const shareId = rawShareLink.split("/").pop();
      const localShareUrl = `${window.location.origin}/share/${shareId}`;

      await navigator.clipboard.writeText(localShareUrl);
      setNotification("Share link copied!");
      setTimeout(() => setNotification(""), 3000);
    } catch (err) {
      console.error("Error generating or copying share link:", err);
    }
  };

  return { notification, handleShare };
}
