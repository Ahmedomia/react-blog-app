import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useBlogStore } from "../store/blogStore";
import { useUserStore } from "../store/userStore";

export function useBlogDetails(id) {
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const { updateBlogInStore } = useBlogStore();
  const [isEditing, setIsEditing] = useState(false);
  const blogs = useBlogStore((state) => state.blogs);
  const setBlogs = useBlogStore((state) => state.setBlogs);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [notification, setNotification] = useState("");
  const { user: currentUser } = useUserStore();

  const [editedBlog, setEditedBlog] = useState({
    title: "",
    content: "",
    image: "",
  });

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/blogs/${id}`
        );
        if (!response.ok) throw new Error("Failed to fetch blog");

        const data = await response.json();


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
        console.error("Error fetching blog:", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id]);

  const handlePublish = async () => {
    try {
      const token = localStorage.getItem("token");
      const updated = { ...blog, isdraft: false };
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/blogs/${blog.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updated),
        }
      );
      if (!response.ok) throw new Error("Failed to publish blog");
      const updatedBlog = await response.json();
      updateBlogInStore(updatedBlog);
      setBlog(updatedBlog);
    } catch (err) {
      console.error("Publish error:", err);
    }
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedBlog((prev) => ({ ...prev, [name]: value }));
  };
  const handleEditClick = () => setIsEditing(true);

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");

      const updated = {
        ...blog,
        ...editedBlog,
        updatedAt: new Date().toISOString(),
      };

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/blogs/${updated.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updated),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update blog");
      }

      const updatedBlog = await response.json();

      const updatedBlogs = blogs.map((b) =>
        b.id === updatedBlog.id ? updatedBlog : b
      );
      setBlogs(updatedBlogs);
      setBlog(updatedBlog);
      setIsEditing(false);
    } catch (err) {
      console.error("Error updating blog:", err);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/blogs/${blog.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete blog");
      }

      setBlogs(blogs.filter((b) => b.id !== blog.id));

      navigate("/mainpage");
    } catch (err) {
      console.error("Error deleting blog:", err);
    }
  };

  const handleBack = () => {
    if (isEditing) {
      setIsEditing(false);
    } else {
      navigate(-1);
    }
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleShare = () => {
    const token = localStorage.getItem("token");

    fetch(`${import.meta.env.VITE_API_URL}/blogs/${id}/share`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        let rawShareLink = data.shareLink || "";
        rawShareLink = rawShareLink.replace(/^"|"$/g, "");

        if (!rawShareLink) {
          console.error("No share link returned from backend");
          return;
        }

        const shareId = rawShareLink.split("/").pop();
        const localShareUrl = `${window.location.origin}/share/${shareId}`;

        navigator.clipboard
          .writeText(localShareUrl)
          .then(() => {
            setNotification("Share link copied!");
            setTimeout(() => setNotification(""), 3000);
          })
          .catch((err) => console.error("Clipboard write failed:", err));
      })
      .catch((err) => console.error("Error generating share link:", err));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setEditedBlog((prev) => ({ ...prev, image: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const isAuthor =
    blog &&
    currentUser &&
    (blog.authorid === currentUser.id ||
      blog.authoremail === currentUser.email);

  return {
    blog,
    loading,
    editedBlog,
    isEditing,
    fileInputRef,
    notification,
    isAuthor,
    handlePublish,
    handleChange,
    handleEditClick,
    handleSave,
    handleDelete,
    handleBack,
    handleImageClick,
    handleShare,
    handleImageChange,
  };
}
