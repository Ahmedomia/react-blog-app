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
    const prevReaction = currentReaction;
    onReactSuccess(commentId, currentUser.id, currentUser.name, reaction);
    try {
      await api.post(`/comments/${commentId}/react`, {
        userId: currentUser.id,
        reaction,
      });
    } catch (err) {
      console.error("Reaction error:", err);
      onReactSuccess(commentId, currentUser.id, currentUser.name, prevReaction);
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
