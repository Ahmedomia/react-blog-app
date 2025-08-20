import { useState, useEffect, useRef } from "react";
import { useUserStore } from "../store/userStore";

export function useAddForm({ isOpen, onClose, onAdd }) {
  const formRef = useRef(null);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const { user } = useUserStore();

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (formRef.current && !formRef.current.contains(e.target)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  const handleSubmit = async (e, isDraft = false) => {
    e.preventDefault();
    if (!user) return alert("No user logged in!");
    console.log(title);
    if (!title.trim() || !category.trim() || !content.trim()) return;

    try {
      const blogData = {
        title,
        category,
        content,
        image,
        authorName: user.name,
        authorEmail: user.email,
        authorpic: user.profilepic || "",
        isdraft: isDraft,
      };
      console.log(" blogData:", blogData);

      await onAdd(blogData);

      setTitle("");
      setCategory("");
      setContent("");
      setImage(null);

      onClose();
    } catch (error) {
      console.error("Failed to post blog:", error);
    }
  };
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  return {
    formRef,
    title,
    setTitle,
    category,
    setCategory,
    content,
    setContent,
    image,
    handleSubmit,
    handleImageChange,
  };
}
