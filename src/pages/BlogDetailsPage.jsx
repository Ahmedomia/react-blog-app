import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { useUserStore } from "../store/userStore";
import { useBlogStore } from "../store/blogStore";
import { format } from "date-fns";
import ProfileButton from "../components/ProfileButton";

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
  const isAuthor = currentUser && blog?.authorEmail === currentUser.email;

  useEffect(() => {
    const storedComments = JSON.parse(localStorage.getItem("comments")) || {};
    const loaded = storedComments[id] || [];
    setComments(Array.isArray(loaded) ? loaded : []);
  }, [id]);

  const handlePostComment = () => {
    if (newComment.trim() === "") return;

    const newCommentObj = {
      text: newComment.trim(),
      author: loggedInUser?.name || "Anonymous",
      authorPic: loggedInUser?.profilePic || null,
    };

    const updatedComments = [...comments, newCommentObj];
    setComments(updatedComments);

    const storedComments = JSON.parse(localStorage.getItem("comments")) || {};
    storedComments[id] = updatedComments;
    localStorage.setItem("comments", JSON.stringify(storedComments));

    setNewComment("");
  };

  useEffect(() => {
    const allBlogs = JSON.parse(localStorage.getItem("blogs")) || [];
    const numericId = Number(id);
    const foundBlog = allBlogs.find((b) => b.id === numericId);

    if (foundBlog) {
      const isAuthor =
        foundBlog.authorEmail && loggedInUser?.email === foundBlog.authorEmail;

      const updatedBlog = {
        ...foundBlog,
        ...(isAuthor && {
          author: loggedInUser.name,
          authorPic: loggedInUser.profilePic,
        }),
      };

      setBlog(updatedBlog);
      setEditedBlog({
        title: updatedBlog.title,
        content: updatedBlog.content,
        image: updatedBlog.image || "",
      });
    } else {
      console.warn(`No blog found in localStorage for id: ${id}`);
    }
  }, [id, loggedInUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedBlog((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditClick = () => setIsEditing(true);

  const handleSave = () => {
    const updated = {
      ...blog,
      ...editedBlog,
      updatedAt: new Date().toISOString(),
    };

    const updatedBlogs = blogs.map((b) => (b.id === updated.id ? updated : b));

    setBlogs(updatedBlogs);
    localStorage.setItem("blogs", JSON.stringify(updatedBlogs));
    setBlog(updated);
    setIsEditing(false);
  };

  const handleDelete = () => {
    const allBlogs = JSON.parse(localStorage.getItem("blogs")) || [];
    const updatedBlogs = allBlogs.filter((b) => b.id !== blog.id);
    localStorage.setItem("blogs", JSON.stringify(updatedBlogs));
    setBlogs(updatedBlogs);
    navigate("/mainpage");
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

  if (!blog) {
    return (
      <div className="text-center mt-20 text-gray-500">Loading blog...</div>
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
            <h1 className="text-3xl font-bold mt-4 text-center">
              {blog.title}
            </h1>
          )}

          <div className="flex items-center gap-x-4">
            {blog.authorPic ? (
              <img
                src={blog.authorPic}
                alt={blog.author}
                className="w-16 h-16 rounded-full object-cover"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-gray-300 flex items-center justify-center">
                <p className="text-gray-500 text-2xl font-bold cursor-default">
                  {blog.author?.charAt(0) || "?"}
                </p>
              </div>
            )}
            <h1 className="text-lg font-semibold">{blog.author}</h1>

            <div className="h-4 border-l border-gray-300" />
            <p className="text-sm text-gray-500">
              {format(new Date(blog.date), "dd MMM yyyy")}
            </p>
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
              className="w-full h-auto max-h-[400px] object-cover cursor-pointer"
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
            <p className="text-lg leading-relaxed whitespace-pre-wrap text-center">
              {blog.content}
            </p>
          )}
          <div className="mt-10 border-t pt-6">
            <h2 className="text-xl font-semibold mb-4">Comments</h2>

            <div className="flex items-start gap-4 mb-4">
              {loggedInUser.profilePic ? (
                <img
                  src={loggedInUser.profilePic}
                  alt={loggedInUser.name || "User"}
                  className="w-12 h-12 rounded-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.style.display = "none";
                  }}
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center">
                  <p className="text-gray-500 text-2xl font-bold cursor-default">
                    {loggedInUser.name?.charAt(0) || "?"}
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
              {comments.map((comment, index) => (
                <div
                  key={index}
                  className="flex gap-4 items-start bg-gray-100 p-3 rounded"
                >
                  {loggedInUser.profilePic ? (
                    <img
                      src={loggedInUser.profilePic}
                      alt={loggedInUser.author || "User"}
                      className="w-10 h-10 rounded-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.style.display = "none";
                      }}
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
                      <p className="text-gray-500 text-2xl font-bold cursor-default">
                        {comment.author?.charAt(0) || "?"}
                      </p>
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-semibold">
                      {comment.author || "Anonymous"}
                    </p>
                    <p
                      className={`text-sm mt-1 ${
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
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
