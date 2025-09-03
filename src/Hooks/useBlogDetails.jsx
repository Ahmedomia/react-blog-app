import { useState, useEffect, useRef } from "react";
import { useUserStore } from "../store/userStore";
import api from "../api";

export function useBlogDetails(id) {
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  const fileInputRef = useRef(null);
  const { user: currentUser } = useUserStore();

  const [editedBlog, setEditedBlog] = useState({
    title: "",
    content: "",
    image: "",
  });

  useEffect(() => {
    const fetchBlog = async () => {
      setLoading(true);
      try {
        const response = await api.get(`/blogs/${id}`);
        const data = response.data;

        const updatedBlog = {
          ...data,
          author: data.author || "Unknown",
          authorpic: data.authorpic || "",
        };

        setBlog(updatedBlog);
        setEditedBlog({
          title: updatedBlog.title,
          content: updatedBlog.content,
          image: updatedBlog.image || "",
        });
      } catch (err) {
        console.error("Error fetching blog:", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchBlog();
  }, [id]);

  const handleEditClick = () => setIsEditing(true);

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const isAuthor =
    blog &&
    currentUser &&
    (blog.authorid === currentUser.id ||
      blog.authoremail === currentUser.email);

  return {
    blog,
    setBlog,
    loading,
    editedBlog,
    setEditedBlog,
    setIsEditing,
    isEditing,
    fileInputRef,
    isAuthor,
    handleEditClick,
    handleImageClick,
  };
}
