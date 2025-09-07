import { FaHeart, FaThumbsUp } from "react-icons/fa";
import { useState, useEffect, useRef } from "react";
import ReactionButton from "./ReactionButton";

export default function CommentsSection({
  comments,
  userMap,
  loggedInUser,
  newComment,
  setNewComment,
  PostComment,
  currentUser,
  expandedComments,
  toggleComment,
  handleReactSuccess,
}) {
  const [openPopup, setOpenPopup] = useState({
    commentId: null,
    filter: "all",
  });
  const [posting, setPosting] = useState(false);
  const popupRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (popupRef.current && !popupRef.current.contains(e.target)) {
        setOpenPopup({ commentId: null, filter: "all" });
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handlePost = async () => {
    if (!newComment.trim()) return;
    setPosting(true);
    try {
      await PostComment();
    } finally {
      setPosting(false);
    }
  };

  return (
    <div className="mt-10 border-t pt-6 text-gray-400">
      <h2 className="text-xl font-semibold mb-4 cursor-default">Comments</h2>

      {loggedInUser && (
        <div className="flex items-start gap-4 mb-4">
          {loggedInUser?.profilepic ? (
            <img
              src={loggedInUser.profilepic}
              alt={loggedInUser?.name || "User"}
              className="w-12 h-12 rounded-full object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.style.display = "none";
              }}
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center">
              <p className="text-gray-500 text-2xl font-bold cursor-default">
                {loggedInUser?.name?.charAt(0) || "?"}
              </p>
            </div>
          )}

          <div className="flex-1">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              rows={3}
              placeholder="Write your comment..."
              className="w-full px-3 py-2 rounded border focus:outline-none focus:ring-2 focus:ring-[#6840c6]"
            />
            <button
              onClick={handlePost}
              disabled={!newComment.trim() || posting}
              className={`mt-2 px-4 py-2 text-white rounded transition ${
                posting
                  ? "bg-[#6840c6]/50 cursor-not-allowed"
                  : "bg-[#6840c6] hover:bg-[#422f7d] cursor-pointer"
              }`}
            >
              {posting ? "Posting..." : "Post"}
            </button>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {Array.isArray(comments) &&
          comments.map((comment, index) => {
            const user = userMap[comment.userId];
            const profilepic = user?.profilepic;
            const authorName = user?.name || "Anonymous";
            const authorInitial = authorName.charAt(0).toUpperCase();

            return (
              <div
                key={index}
                className="flex gap-4 items-start cursor-default p-3 rounded"
              >
                {profilepic ? (
                  <img
                    src={profilepic}
                    alt={authorName}
                    className="w-10 h-10 rounded-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.style.display = "none";
                    }}
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
                    <p className="text-gray-500 text-xl font-bold">
                      {authorInitial}
                    </p>
                  </div>
                )}

                <div>
                  <p className="text-sm font-semibold">{authorName}</p>
                  <p
                    className={`text-sm mt-1 break-words break-all ${
                      expandedComments.includes(index)
                        ? ""
                        : "line-clamp-3 overflow-hidden"
                    }`}
                  >
                    {comment.text}
                  </p>

                  <div className="flex items-center mt-1 relative">
                    <ReactionButton
                      commentId={comment.id}
                      currentUser={currentUser}
                      currentReaction={
                        comment.reactions.find(
                          (r) => r.user_id === currentUser?.id
                        )?.reaction
                      }
                      initialCount={
                        comment.reactions.filter(
                          (r) =>
                            r.reaction ===
                            comment.reactions.find(
                              (r) => r.user_id === currentUser?.id
                            )?.reaction
                        ).length
                      }
                      onReactSuccess={handleReactSuccess}
                    />
                  </div>
                  {comment.reactions.length > 0 &&
                    (() => {
                      const reactionCounts = comment.reactions.reduce(
                        (acc, r) => {
                          acc[r.reaction] = (acc[r.reaction] || 0) + 1;
                          return acc;
                        },
                        {}
                      );
                      const totalReactions = comment.reactions.length;
                      const likeCount = reactionCounts.like || 0;
                      const loveCount = reactionCounts.love || 0;

                      const sortedReactions = Object.entries(
                        reactionCounts
                      ).sort((a, b) => b[1] - a[1]);

                      return (
                        <div className="relative flex items-center">
                          <div
                            className="flex items-center px-2 py-1 rounded-full cursor-pointer bg-gray-100 text-gray-700 text-sm"
                            onClick={() =>
                              setOpenPopup((prev) =>
                                prev.commentId === comment.id
                                  ? { commentId: null, filter: "all" }
                                  : { commentId: comment.id, filter: "all" }
                              )
                            }
                          >
                            {sortedReactions.map(([reaction]) => (
                              <span key={reaction} className="mr-1">
                                {reaction === "like" && (
                                  <FaThumbsUp className="text-blue-500" />
                                )}
                                {reaction === "love" && (
                                  <FaHeart className="text-red-500" />
                                )}
                              </span>
                            ))}
                            <span>{totalReactions}</span>
                          </div>
                          {openPopup.commentId === comment.id && (
                            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                              <div
                                ref={popupRef}
                                className="bg-white w-[400px] h-[400px] max-w-lg rounded-lg shadow-lg p-4"
                              >
                                <div className="flex justify-around mb-3 border-b pb-2">
                                  <button
                                    className={`px-3 py-1 text-sm rounded ${
                                      openPopup.filter === "all"
                                        ? "bg-gray-200 font-semibold"
                                        : "hover:bg-gray-100"
                                    }`}
                                    onClick={() =>
                                      setOpenPopup((prev) => ({
                                        ...prev,
                                        filter: "all",
                                      }))
                                    }
                                  >
                                    All ({totalReactions})
                                  </button>
                                  <button
                                    className={`px-3 py-1 text-sm rounded flex items-center gap-1 ${
                                      openPopup.filter === "like"
                                        ? "bg-gray-200 font-semibold"
                                        : "hover:bg-gray-100"
                                    }`}
                                    onClick={() =>
                                      setOpenPopup((prev) => ({
                                        ...prev,
                                        filter: "like",
                                      }))
                                    }
                                  >
                                    <FaThumbsUp className="text-blue-500" />{" "}
                                    {likeCount}
                                  </button>
                                  <button
                                    className={`px-3 py-1 text-sm rounded flex items-center gap-1 ${
                                      openPopup.filter === "love"
                                        ? "bg-gray-200 font-semibold"
                                        : "hover:bg-gray-100"
                                    }`}
                                    onClick={() =>
                                      setOpenPopup((prev) => ({
                                        ...prev,
                                        filter: "love",
                                      }))
                                    }
                                  >
                                    <FaHeart className="text-red-500" />{" "}
                                    {loveCount}
                                  </button>
                                </div>

                                <div className="max-h-64 overflow-y-auto">
                                  {comment.reactions
                                    .filter((r) =>
                                      openPopup.filter === "all"
                                        ? true
                                        : r.reaction === openPopup.filter
                                    )
                                    .map((r) => (
                                      <div
                                        key={r.user_id}
                                        className="flex items-center justify-between py-2 px-3 rounded"
                                      >
                                        <span className="text-sm">
                                          {r.username}
                                        </span>
                                        {r.reaction === "like" && (
                                          <FaThumbsUp className="text-blue-500 text-lg" />
                                        )}
                                        {r.reaction === "love" && (
                                          <FaHeart className="text-red-500 text-lg" />
                                        )}
                                      </div>
                                    ))}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })()}

                  {comment.text.length > 120 && (
                    <button
                      onClick={() => toggleComment(index)}
                      className="text-xs text-gray-500 mt-1 hover:underline"
                    >
                      {expandedComments.includes(index)
                        ? "Show less"
                        : "Read more"}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}
