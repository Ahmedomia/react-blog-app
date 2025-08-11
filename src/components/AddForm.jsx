import { useState, useEffect, useRef } from "react";
import { FaImage } from "react-icons/fa";
import { useUserStore } from "../store/userStore";

export default function AddForm({ isOpen, onClose, onAdd }) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const { user } = useUserStore();
  

  const formRef = useRef(null);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return alert("No user logged in!");
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
      };

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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[rgba(0,0,0,0.5)] flex justify-center items-center z-50 px-4">
      <div
        ref={formRef}
        className="bg-white border rounded-lg p-6 sm:p-8 shadow-lg w-[600px] max-w-full h-auto"
      >
        <h2 className="text-xl font-bold mb-4 text-center text-black cursor-default">
          New Post
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Post title"
            maxLength={24}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-[#6e6cdf]/40"
          />

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-[#6e6cdf]/40"
          >
            <option value="">Select Category</option>
            <option value="Technology">Technology</option>
            <option value="Health">Health</option>
            <option value="Education">Education</option>
            <option value="Lifestyle">Lifestyle</option>
            <option value="Travel">Travel</option>
            <option value="Other">Other</option>
          </select>

          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What do you think?"
            rows={6}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-[#6e6cdf]/40 resize-none"
          />

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Upload image
            </label>

            <div className="flex items-center space-x-3">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                id="imageInput"
                className="hidden"
              />

              <label
                htmlFor="imageInput"
                className="cursor-pointer text-[#1877F2] hover:text-[#145db2] flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 transition"
                title="Choose a photo"
              >
                <FaImage className="text-2xl" />
              </label>

              {image && (
                <img
                  src={image}
                  alt="Preview"
                  className="w-10 h-10 rounded object-cover border"
                />
              )}
            </div>
          </div>

          <div className="flex justify-center mt-6">
            <button
              type="submit"
              className="w-full flex items-center justify-center bg-[#6e6cdf] text-white py-2 rounded-xl cursor-pointer text-center hover:bg-[#5b59d1] transition"
            >
              Post
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
