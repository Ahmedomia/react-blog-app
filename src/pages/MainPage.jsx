import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import AddButton from "../components/AddButton";
import AddForm from "../components/AddForm";
import ProfileButton from "../components/ProfileButton";
import ProfileForm from "../components/ProfileForm";
import { useUserStore } from "../store/userStore";
import { useBlogStore } from "../store/blogStore";
import { format, parseISO, isValid } from "date-fns";
import { SyncLoader } from "react-spinners";

import axios from "axios";

const API_BASE = "http://localhost:5000/api";

export default function MainPage() {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [savedScroll, setSavedScroll] = useState(null);
  const navigate = useNavigate();

  const { user: loggedInUser, setUser } = useUserStore();
  const {
    blogs,
    setBlogs,
    appendBlogs,
    page,
    setPage,
    hasMore,
    setHasMore,
    loading,
    setLoading,
  } = useBlogStore();

  const token = localStorage.getItem("token");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const BLOGS_PER_PAGE = 3;

  const handleBlogClick = (id) => {
    sessionStorage.setItem("scrollPosition", window.scrollY);
    navigate(`/blog/${id}`);
  };

  useEffect(() => {
    const savedPos = sessionStorage.getItem("scrollPosition");
    if (savedPos) {
      window.scrollTo(0, parseInt(savedPos, 10));
      sessionStorage.removeItem("scrollPosition");
    }
  }, []);

  useEffect(() => {
    const fetchBlogs = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${API_BASE}/blogs`, {
          headers: { Authorization: `Bearer ${token}` },
          params: {
            limit: BLOGS_PER_PAGE,
            offset: page * BLOGS_PER_PAGE,
          },
        });
        console.log("Fetching blogs:", {
          page: page,
          limit: BLOGS_PER_PAGE,
          offset: page * BLOGS_PER_PAGE,
        });

        const newBlogs = res.data;

        if (page === 0) {
          setBlogs(res.data);
        } else {
          appendBlogs(res.data);
        }

        setHasMore(newBlogs.length === BLOGS_PER_PAGE);
      } catch (err) {
        console.error("Fetch blogs error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, [page, token, setBlogs, appendBlogs, setHasMore, setLoading]);

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      setSavedScroll(window.scrollY);
      setPage((prev) => prev + 1);
    }
  };

  useEffect(() => {
    if (savedScroll !== null) {
      window.scrollTo(0, savedScroll);
      setSavedScroll(null);
    }
  }, [blogs]);

  const categories = Array.from(
    new Set(
      (Array.isArray(blogs) ? blogs : [])
        .map((blog) => blog.category)
        .filter(Boolean)
    )
  );

  const handleAddBlog = async (newBlog) => {
    try {
      const res = await axios.post(`${API_BASE}/blogs`, newBlog, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("New blog added:", res.data);
      setBlogs([res.data, ...blogs]);
      setSearchTerm("");
      setCategoryFilter("all");
    } catch (err) {
      console.error("Add blog error:", err);
    }
  };

  const filteredBlogs = (Array.isArray(blogs) ? blogs : []).filter((blog) => {
    const cat = blog.category || "";
    const matchesSearch =
      blog.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.content?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cat.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      !categoryFilter || categoryFilter === "all" || cat === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  const handleProfileSave = async (updatedUser) => {
    try {
      console.log("Profile save triggered with:", updatedUser);
      setUser(updatedUser);
      setBlogs((prevBlogs) =>
        prevBlogs.map((blog) =>
          blog.author === updatedUser.username
            ? { ...blog, authorpic: updatedUser.profilePic }
            : blog
        )
      );
      setIsProfileOpen(false);
    } catch (err) {
      console.error("Update profile error:", err);
    }
  };

  return (
    <div
      className="min-h-screen bg-[#f8f6ff] bg-no-repeat bg-cover bg-center"
      style={{ backgroundImage: "url('/assets/Background pattern.svg')" }}
    >
      <div className="max-w-3xl mx-auto flex flex-col items-center pt-[96px]">
        <p className="text-sm text-[#6840c6] font-semibold bg-gray-200 rounded-xl px-4 py-2 text-center h-[28px] pt-1 cursor-default">
          Our Blog
        </p>

        <h1 className="text-3xl md:text-4xl font-bold text-[#422f7d] mt-2 text-center cursor-default flex flex-col md:flex-row md:justify-center md:items-center">
          <span className="md:mr-2">Resources and</span>
          <span>insights</span>
        </h1>
        <p className="text-[#6840c6] mt-6 text-center cursor-default flex flex-col md:flex-row md:justify-center md:items-center">
          <span className="md:mr-2">The latest industry news, interviews,</span>
          <span>technologies, and resources.</span>
        </p>

        <div className="mt-8 w-full flex justify-center pb-12 gap-2">
          <div className="relative w-64 md:w-72">
            <img
              src="/assets/search.svg"
              alt="search-icon"
              className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 pointer-events-none"
            />
            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full border border-gray-300 rounded-lg pl-10 py-2 focus:outline-none focus:ring focus:ring-[#6e6cdf]/40"
            />
          </div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="border border-gray-300 rounded-lg py-2 px-3 focus:outline-none focus:ring focus:ring-[#6e6cdf]/40"
          >
            <option
              value="all"
              style={{
                color: "#6e6cdf",
                backgroundColor: "#f8f6ff",
                fontWeight: "600",
              }}
            >
              All Categories
            </option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {loading ? (
          <div className="col-span-full flex flex-col items-center py-12">
            <SyncLoader color="#6e6cdf" size={12} loading={loading} />
            <p className="text-lg text-[#6840c6] mt-4">Loading blogs...</p>
          </div>
        ) : filteredBlogs.length === 0 ? (
          <div className="col-span-full text-center py-6">
            <p className="text-gray-500 text-lg mb-4 cursor-default">
              No matching blogs found
            </p>
            <img
              src="/assets/NoPosts.png"
              alt="no posts"
              className="w-60 h-60 mx-auto"
            />
          </div>
        ) : (
          filteredBlogs.map((blog) => {
            return (
              <div
                key={blog.id}
                onClick={() => handleBlogClick(blog.id)}
                className="m-8 mt-8 w-[350px] h-[550px] bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all transform hover:scale-110 active:scale-95"
              >
                <img
                  src={blog.image ? blog.image : "/assets/NoPic.jpg"}
                  alt={blog.title}
                  className="object-cover mx-auto m-4 w-[320px] h-[240px]"
                />
                <div className="p-4">
                  <p className="text-xs text-[#6e6cdf] font-bold">
                    {blog.category}
                  </p>
                  <div className="relative mt-4">
                    <h2 className="text-lg font-bold text-black/80 pr-8">
                      {blog.title}
                    </h2>
                    <img
                      src="/assets/Icon wrap.svg"
                      alt="Icon wrap"
                      className="w-[24px] h-[28px] absolute top-0 right-2"
                    />
                  </div>

                  <p
                    className="text-gray-500 text-sm mt-4 line-clamp-3 overflow-hidden break-words break-all"
                    title={blog.content}
                  >
                    {blog.content}
                  </p>
                  <div className="flex items-center mt-8 pt-3">
                    {blog.authorpic ? (
                      <img
                        src={blog.authorpic}
                        alt={blog.author}
                        className="w-8 h-8 rounded-full object-cover mr-2"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center mr-2">
                        <FaUserCircle className="text-gray-500 w-6 h-6" />
                      </div>
                    )}

                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-gray-700">
                        {blog.author}
                      </span>

                      <span className="text-xs text-gray-400">
                        {blog.createdat && isValid(parseISO(blog.createdat))
                          ? format(parseISO(blog.createdat), "dd MMM yyyy")
                          : "Unknown date"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
      {hasMore && (
        <div className="flex justify-center mt-6 mb-12">
          <button
            type="button"
            onClick={handleLoadMore}
            disabled={loading}
            className="px-6 py-2 font-bold bg-[#f9f5ff] text-[#6840c6] hover:bg-gray-200 rounded-lg transition cursor-pointer flex items-center gap-2"
          >
            <img src="/assets/Icon.svg" alt="icon" className="w-3 h-3" />
            {loading ? "Loading..." : "Load More"}
          </button>
        </div>
      )}
      <AddButton onClick={() => setIsAddOpen(true)} />
      <AddForm
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onAdd={handleAddBlog}
      />

      <ProfileButton onClick={() => setIsProfileOpen(true)} />
      {isProfileOpen && (
        <ProfileForm
          user={loggedInUser}
          onClose={() => setIsProfileOpen(false)}
          onSave={handleProfileSave}
        />
      )}
    </div>
  );
}
