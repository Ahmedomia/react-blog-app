import { useState, useRef } from "react";

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
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/comments/${commentId}/react`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: currentUser.id, reaction }),
        }
      );

      if (!res.ok) throw new Error("Failed to react");

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
