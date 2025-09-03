import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "../store/userStore";
import { useBlogStore } from "../store/blogStore";
import api from "../api";

export function useMainPage() {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [savedScroll, setSavedScroll] = useState(null);
  const [loadingMore, setLoadingMore] = useState(false);

  const navigate = useNavigate();

  const { user: loggedInUser, setUser, accessToken } = useUserStore();
  const {
    blogs,
    setBlogs,
    page,
    setPage,
    hasMore,
    setHasMore,
    loading,
    setLoading,
  } = useBlogStore();

  const [categoryFilter, setCategoryFilter] = useState("all");
  const BLOGS_PER_PAGE = 3;

  const handleBlogClick = (id) => {
    sessionStorage.setItem("scrollPosition", window.scrollY);
    navigate(`/blog/${id}`);
  };

  useEffect(() => {
    const savedPos = sessionStorage.getItem("scrollPosition");
    if (savedPos !== null && blogs.length > 0) {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setTimeout(() => {
            window.scrollTo({
              top: parseInt(savedPos, 10),
              behavior: "smooth",
            });
            sessionStorage.removeItem("scrollPosition");
          }, 100);
        });
      });
    }
  });

  useEffect(() => {
    const fetchBlogs = async () => {
      if (page === 0) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      try {
        let myDrafts = [];

        if (page === 0 && loggedInUser) {
          const myRes = await api.get("/blogs/mine");
          myDrafts = myRes.data.filter((blog) => blog.isdraft);
        }

        const publishedRes = await api.get("/blogs", {
          params: {
            limit: BLOGS_PER_PAGE,
            offset: page * BLOGS_PER_PAGE,
          },
        });

        const publishedBlogs = publishedRes.data.filter(
          (b) => !(loggedInUser && b.authorid === loggedInUser.id && b.isdraft)
        );

        let merged;
        if (page === 0) {
          merged = [...myDrafts, ...publishedBlogs];
        } else {
          const currentDrafts = blogs.filter(
            (blog) =>
              blog.isdraft && loggedInUser && blog.authorid === loggedInUser.id
          );
          const newPublished = publishedBlogs.filter(
            (newBlog) => !blogs.some((b) => b.id === newBlog.id)
          );
          merged = [
            ...currentDrafts,
            ...blogs.filter((b) => !b.isdraft),
            ...newPublished,
          ];
        }

        const uniqueBlogs = Array.from(
          new Map(merged.map((b) => [b.id, b])).values()
        );

        setBlogs(uniqueBlogs);
        setHasMore(publishedRes.data.length >= BLOGS_PER_PAGE);
      } catch (err) {
        console.error("Fetch blogs error:", err);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    };

    fetchBlogs();
  }, [page, accessToken, loggedInUser]);

  const handleLoadMore = () => {
    setPage((prev) => prev + 1);
  };

  useEffect(() => {
    if (savedScroll !== null) {
      window.scrollTo(0, savedScroll);
      setSavedScroll(null);
    }
  }, [blogs, savedScroll]);

  const categories = Array.from(
    new Set(
      (Array.isArray(blogs) ? blogs : [])
        .map((blog) => blog.category)
        .filter(Boolean)
    )
  );

  const handleAddBlog = async (newBlog) => {
    try {
      const res = await api.post(`/blogs`, newBlog);
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

    const canSeeDraft =
      !blog.isdraft || (loggedInUser && blog.authorid === loggedInUser.id);

    return matchesSearch && matchesCategory && canSeeDraft;
  });

  const sortedBlogs = [
    ...filteredBlogs
      .filter(
        (blog) =>
          blog.isdraft && loggedInUser && blog.authorid === loggedInUser.id
      )
      .sort((a, b) => new Date(b.createdat) - new Date(a.createdat)),
    ...filteredBlogs
      .filter(
        (blog) =>
          !blog.isdraft || !(loggedInUser && blog.authorid === loggedInUser.id)
      )
      .sort((a, b) => new Date(b.createdat) - new Date(a.createdat)),
  ];

  const handleProfileSave = async (updatedUser) => {
    try {
      setUser(updatedUser);
      setBlogs((prevBlogs) =>
        prevBlogs.map((blog) =>
          blog.author === updatedUser.username
            ? { ...blog, authorpic: updatedUser.profilepic }
            : blog
        )
      );
      setIsProfileOpen(false);
    } catch (err) {
      console.error("Update profile error:", err);
    }
  };

  return {
    isAddOpen,
    setIsAddOpen,
    isProfileOpen,
    setIsProfileOpen,
    searchTerm,
    setSearchTerm,
    loadingMore,
    hasMore,
    loading,
    handleBlogClick,
    handleProfileSave,
    sortedBlogs,
    handleAddBlog,
    categories,
    handleLoadMore,
    setCategoryFilter,
    categoryFilter,
    loggedInUser,
  };
}
