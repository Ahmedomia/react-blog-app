import { FaHeart, FaThumbsUp } from "react-icons/fa";
import { useReactionButton } from "../Hooks/useReactionButton";

export default function ReactionButton(props) {
  const { commentId, currentUser, currentReaction, onReactSuccess } = props;
  const { showPopup, handleReaction, handleMouseEnter, handleMouseLeave } =
  useReactionButton({
    commentId,
    currentUser,
    currentReaction,
    onReactSuccess,
  });

  if (!currentUser) return null;
  
  return (
    <div
      className="relative inline-block"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        className="flex items-center gap-1 px-2 py-1 rounded hover:bg-gray-100 text-gray-600"
        aria-label="React to comment"
      >
        {currentReaction === "like" && <FaThumbsUp className="text-blue-500" />}
        {currentReaction === "love" && <FaHeart className="text-red-500" />}
        {!currentReaction && <FaThumbsUp />}
        <span className="text-xs">
          {currentReaction
            ? currentReaction.charAt(0).toUpperCase() + currentReaction.slice(1)
            : "React"}
        </span>
      </button>

      {showPopup && (
        <div className="absolute bottom-full left-0 mb-2 bg-white border rounded-lg shadow-lg flex space-x-2 p-2 z-50">
          <button
            onClick={() => handleReaction("like")}
            className="flex flex-col items-center p-2 hover:bg-gray-100 rounded"
          >
            <FaThumbsUp className="text-blue-500 text-lg" />
          </button>
          <button
            onClick={() => handleReaction("love")}
            className="flex flex-col items-center p-2 hover:bg-gray-100 rounded"
          >
            <FaHeart className="text-red-500 text-lg" />
          </button>
        </div>
      )}
    </div>
  );
}
