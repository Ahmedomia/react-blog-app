import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import AddButton from "../components/AddButton";
import AddForm from "../components/AddForm";
import ProfileButton from "../components/ProfileButton";
import ProfileForm from "../components/ProfileForm";
import { useUserStore } from "../store/userStore";
import { useBlogStore } from "../store/blogStore";
import { format } from "date-fns";

export default function MainPage() {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const { user: loggedInUser, setUser } = useUserStore();
  const updateBlogs = useBlogStore((state) => state.setBlogs);
  const { blogs, setBlogs } = useBlogStore();

  useEffect(() => {
    const stored = localStorage.getItem("blogs");
    if (stored) {
      try {
        updateBlogs(JSON.parse(stored));
      } catch {
        console.warn("Invalid blogs format");
      }
    }
  }, [updateBlogs]);

  useEffect(() => {
    if (blogs.length > 0) {
      localStorage.setItem("blogs", JSON.stringify(blogs));
    }
  }, [blogs]);

  useEffect(() => {
    if (!loggedInUser) return;

    const allBlogs = JSON.parse(localStorage.getItem("blogs")) || [];
    let updated = false;

    const updatedBlogs = allBlogs.map((blog) => {
      if (blog.authorEmail === loggedInUser.email) {
        updated = true;
        return {
          ...blog,
          author: loggedInUser.name,
          authorPic: loggedInUser.profilePic,
        };
      }
      return blog;
    });

    if (updated) {
      localStorage.setItem("blogs", JSON.stringify(updatedBlogs));
      setBlogs(updatedBlogs);
    }
  }, [loggedInUser, setBlogs]);

  const getNextId = () => {
    const ids = blogs.map((b) => b.id);
    return ids.length === 0 ? 1 : Math.max(...ids) + 1;
  };

  const handleAddBlog = (newBlog) => {
    const currentUser = loggedInUser || {};

    const blogWithMeta = {
      ...newBlog,
      id: getNextId(),
      author: currentUser.fullName || currentUser.name || "Anonymous",
      authorPic: currentUser.profilePic || "",
      authorEmail: currentUser.email || "",
      date: new Date().toLocaleDateString(),
    };

    updateBlogs([...blogs, blogWithMeta]);
  };

  const filteredBlogs = blogs.filter((blog) => {
    const cat = blog.category || "";
    return (
      blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cat.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

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

        <div className="mt-8 w-full flex justify-center pb-12">
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
        </div>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {filteredBlogs.length === 0 ? (
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
          filteredBlogs.map((blog) => (
            <Link key={blog.id} to={`/blog/${blog.id}`}>
              <div className="m-2 mt-8 w-[350px] h-[550px] bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all transform hover:scale-110 active:scale-95">
                <img
                  src={blog.image ? blog.image : "/assets/NoPic.jpg"}
                  alt={blog.title}
                  className="object-cover mx-auto m-4 w-[320px] h-[240px]"
                />
                <div className="p-4">
                  <p className="text-xs text-[#6e6cdf] font-semibold">
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
                    className="text-gray-500 text-sm mt-4 line-clamp-3 overflow-hidden"
                    title={blog.content}
                  >
                    {blog.content}
                  </p>
                  <div className="flex items-center mt-8 pt-3">
                    {blog.authorPic ? (
                      <img
                        src={blog.authorPic}
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
                        {format(new Date(blog.date), "dd MMM yyyy")}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>

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
          onSave={(updatedUser, oldEmail) => {
            setUser(updatedUser);

            const updatedBlogs = blogs.map((b) =>
              b.authorEmail === oldEmail
                ? {
                    ...b,
                    author: updatedUser.fullName,
                    authorPic: updatedUser.profilePic,
                    authorEmail: updatedUser.email,
                  }
                : b
            );

            updateBlogs(updatedBlogs);
            setIsProfileOpen(false);
          }}
        />
      )}
    </div>
  );
}
