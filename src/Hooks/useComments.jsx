import { useState, useEffect } from "react";
import { useUserStore } from "../store/userStore";
import api from "../api";

export function useComments(id, shareid) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const { user: loggedInUser } = useUserStore();
  const [expandedComments, setExpandedComments] = useState([]);
  const { user: currentUser } = useUserStore();

  const toggleComment = (index) => {
    setExpandedComments((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  useEffect(() => {
    const fetchComments = async () => {
      try {
        let url = null;
        if (id) {
          url = `${import.meta.env.VITE_API_URL}/comments/${id}`;
        } else if (shareid) {
          url = `${import.meta.env.VITE_API_URL}/comments/share/${shareid}`;
        } else {
          return;
        }

        const res = await api.get(url);
        const data = res.data;

        if (!Array.isArray(data)) {
          console.error("Invalid response for comments:", data);
          setComments([]);
          return;
        }

        setComments(data);
      } catch (err) {
        console.error("Error fetching comments:", err);
        setComments([]);
      }
    };

    fetchComments();
  }, [id, shareid]);

  const PostComment = async () => {
    if (newComment.trim() === "") return;

    try {
      await api.post(`/comments/${id}`, {
        text: newComment.trim(),
        userId: loggedInUser?.id,
      });

      setNewComment("");
      const res = await api.get(`/comments/${id}`);
      const updated = res.data;
      setComments(updated);
    } catch (err) {
      console.error("Failed to post comment:", err);
    }
  };

  const handleReactSuccess = (commentId, userId, username, reaction) => {
    setComments((prev) =>
      prev.map((c) =>
        c.id === commentId
          ? {
              ...c,
              reactions: (() => {
                const existing = c.reactions.find((r) => r.user_id === userId);
                if (existing) {
                  if (existing.reaction === reaction) {
                    return c.reactions.filter((r) => r.user_id !== userId);
                  } else {
                    return [
                      ...c.reactions.filter((r) => r.user_id !== userId),
                      { user_id: userId, username, reaction },
                    ];
                  }
                } else {
                  return [
                    ...c.reactions,
                    { user_id: userId, username, reaction },
                  ];
                }
              })(),
            }
          : c
      )
    );
  };

  return {
    comments,
    setNewComment,
    currentUser,
    newComment,
    PostComment,
    loggedInUser,
    toggleComment,
    expandedComments,
    handleReactSuccess,
  };
}
