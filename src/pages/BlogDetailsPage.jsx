import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { useUserStore } from "../store/userStore";
import { useBlogStore } from "../store/blogStore";
import { format, parseISO, isValid } from "date-fns";
import ProfileButton from "../components/ProfileButton";
import { SyncLoader } from "react-spinners";

import axios from "axios";

const API_BASE = "http://localhost:5000/api";

export default function BlogDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const blogs = useBlogStore((state) => state.blogs);
  const setBlogs = useBlogStore((state) => state.setBlogs);
  const [blog, setBlog] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const { user: currentUser } = useUserStore();
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState([]);
  const [expandedComments, setExpandedComments] = useState([]);
  const { user: loggedInUser } = useUserStore();
  const [userMap, setUserMap] = useState({});
  const [loading, setLoading] = useState(true);

  const toggleComment = (index) => {
    setExpandedComments((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const [editedBlog, setEditedBlog] = useState({
    title: "",
    content: "",
    image: "",
  });

  const fileInputRef = useRef(null);
  const isAuthor =
    blog &&
    currentUser &&
    (blog.authorid === currentUser.id ||
      blog.authoremail === currentUser.email);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/comments/${id}`);
        const data = await res.json();
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
  }, [id]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get(`${API_BASE}/users`);

        const users = Array.isArray(res.data) ? res.data : res.data.users;

        if (!Array.isArray(users)) {
          console.error("Users response is not an array:", users);
          return;
        }

        const newUserMap = {};
        users.forEach((user) => {
          newUserMap[user.id] = {
            name: user.name,
            profilepic: user.profilepic,
          };
        });

        setUserMap(newUserMap);
      } catch (err) {
        console.error("Failed to fetch users:", err);
      }
    };

    fetchUsers();
  }, []);

  const handlePostComment = async () => {
    if (newComment.trim() === "") return;

    try {
      await fetch(`http://localhost:5000/api/comments/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: newComment.trim(),
          userId: loggedInUser?.id,
        }),
      });

      setNewComment("");
      const res = await fetch(`http://localhost:5000/api/comments/${id}`);
      const updated = await res.json();
      setComments(updated);
    } catch (err) {
      console.error("Failed to post comment:", err);
    }
  };

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/blogs/${id}`);
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
        `http://localhost:5000/api/blogs/${updated.id}`,
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
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        `http://localhost:5000/api/blogs/${blog.id}`,
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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setEditedBlog((prev) => ({ ...prev, image: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#f8f6ff]">
        <SyncLoader color="#6840c6" size={12} />
        <p className="text-lg text-[#6840c6] mt-4">Loading blog...</p>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-[#f8f6ff] bg-no-repeat bg-cover bg-center"
      style={{ backgroundImage: "url('/assets/Background pattern.svg')" }}
    >
      <div className="relative max-w-2xl mx-auto px-4 py-8">
        <button
          onClick={handleBack}
          className="fixed top-4 left-4 z-50
    bg-[#422f7d] p-2 rounded-full shadow-lg
    hover:bg-[#6840c6] transition-all transform hover:scale-110 active:scale-95
    flex items-center justify-center text-white"
        >
          <FaArrowLeft className="text-lg" />
        </button>
        <ProfileButton />

        <div className="space-y-4">
          {isEditing ? (
            <input
              type="text"
              name="title"
              value={editedBlog.title}
              onChange={handleChange}
              className="w-full border-none focus:border-none focus:outline-none focus:ring-0 rounded text-center text-3xl font-bold"
            />
          ) : (
            <h1 className="text-3xl font-bold mt-4 text-center cursor-default">
              {blog.title}
            </h1>
          )}

          <div className="flex items-center gap-x-4">
            {blog.authorpic ? (
              <img
                src={blog.authorpic}
                alt={blog.author}
                className="w-16 h-16 rounded-full object-cover "
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-gray-300 flex items-center justify-center">
                <p className="text-gray-500 text-2xl font-bold cursor-default">
                  {blog.author?.charAt(0) || "?"}
                </p>
              </div>
            )}
            <h1 className="text-lg font-semibold cursor-default">
              {blog.author}
            </h1>

            <div className="h-4 border-l border-gray-300" />
            <span className="text-xs text-gray-400 cursor-default">
              {blog.createdat && isValid(parseISO(blog.createdat))
                ? format(parseISO(blog.createdat), "dd MMM yyyy")
                : "Unknown date"}
            </span>
            {isAuthor && !isEditing && (
              <div className="flex gap-2 ml-auto">
                <button
                  onClick={handleEditClick}
                  className="group relative w-[24px] h-[24px]"
                >
                  <img
                    src="/assets/Edit.svg"
                    alt="Edit"
                    className="absolute inset-0 w-full h-full group-hover:opacity-0 transition-opacity duration-200"
                  />
                  <img
                    src="/assets/editblue.svg"
                    alt="Edit colored"
                    className="absolute inset-0 w-full h-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  />
                </button>

                <button
                  onClick={handleDelete}
                  className="group relative w-[24px] h-[24px]"
                >
                  <img
                    src="/assets/trash-svgrepo-com.svg"
                    alt="Delete"
                    className="absolute inset-0 w-full h-full group-hover:opacity-0 transition-opacity duration-200"
                  />
                  <img
                    src="/assets/trashred-svgrepo-com.svg"
                    alt="Delete colored"
                    className="absolute inset-0 w-full h-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  />
                </button>
              </div>
            )}
          </div>

          {editedBlog.image && (
            <img
              src={editedBlog.image}
              alt="Blog"
              className={`w-full h-auto max-h-[400px] object-cover ${
                isEditing ? "cursor-pointer" : "cursor-default"
              }`}
              onClick={isEditing ? handleImageClick : undefined}
            />
          )}
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleImageChange}
            className="hidden"
          />

          {isEditing ? (
            <>
              <textarea
                name="content"
                value={editedBlog.content}
                onChange={handleChange}
                rows={10}
                className="w-full text-center border-none focus:border-none focus:outline-none focus:ring-0 rounded border text-lg leading-relaxed whitespace-pre-wrap"
              />
              <div className="flex gap-4">
                <button
                  onClick={handleSave}
                  className="w-50 flex items-center justify-center bg-[#422f7d] text-white py-2 px-4 rounded-xl mt-2 cursor-pointer text-center hover:bg-[#6840c6] transition"
                >
                  Save
                </button>
              </div>
            </>
          ) : (
            <p className="text-lg break-words break-all leading-relaxed whitespace-pre-wrap text-center cursor-default">
              {blog.content}
            </p>
          )}
          <div className="mt-10 border-t pt-6 text-gray-400">
            <h2 className="text-xl font-semibold mb-4 cursor-default">
              Comments
            </h2>

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
                  onClick={handlePostComment}
                  disabled={!newComment.trim()}
                  className="mt-2 px-4 py-2 bg-[#6840c6] text-white rounded hover:bg-[#422f7d] disabled:opacity-50"
                >
                  Post
                </button>
              </div>
            </div>

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
        </div>
      </div>
    </div>
  );
}
