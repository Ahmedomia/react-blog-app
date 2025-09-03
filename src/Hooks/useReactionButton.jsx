import { useState, useRef } from "react";
import api from "../api";

export function useReactionButton({
  commentId,
  currentUser,
  currentReaction,
  onReactSuccess,
}) {
  const [showPopup, setShowPopup] = useState(false);
  const timerRef = useRef(null);

  const handleReaction = async (reaction) => {
    try {
      await api.post(`/comments/${commentId}/react`, {
        userId: currentUser.id,
        reaction,
      });
      onReactSuccess(commentId, currentUser.id, currentUser.name, reaction);
    } catch (err) {
      console.error("Reaction error:", err);
    }
  };

  const handleMouseEnter = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setShowPopup(true);
  };

  const handleMouseLeave = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setShowPopup(false), 200);
  };

  return {
    currentReaction,
    showPopup,
    handleReaction,
    handleMouseEnter,
    handleMouseLeave,
  };
}
