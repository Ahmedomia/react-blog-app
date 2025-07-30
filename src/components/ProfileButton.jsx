import { useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import ProfileForm from "./ProfileForm";
import { useUserStore } from "../store/userStore";
import { useBlogStore } from "../store/blogStore";

export default function ProfileButton() {
  const [isOpen, setIsOpen] = useState(false);

  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);
  const toggleRefresh = useBlogStore((state) => state.toggleRefresh);

  const profilePic = user?.profilePic || null;

  const handleSave = (updatedUser, oldEmail) => {
    const allUsers = JSON.parse(localStorage.getItem("users")) || [];

    const updatedUsers = allUsers.map((u) =>
      u.email === oldEmail ? updatedUser : u
    );
    localStorage.setItem("users", JSON.stringify(updatedUsers));

    localStorage.setItem("loggedInUser", JSON.stringify(updatedUser));
    setUser(updatedUser);
    setIsOpen(false);

    const allBlogs = JSON.parse(localStorage.getItem("blogs")) || [];
    const updatedBlogs = allBlogs.map((blog) =>
      blog.author === oldEmail || blog.author === user.name
        ? {
            ...blog,
            author: updatedUser.name,
            authorPic: updatedUser.profilePic,
          }
        : blog
    );
    localStorage.setItem("blogs", JSON.stringify(updatedBlogs));

    toggleRefresh();
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        aria-label="Profile"
        className="fixed top-4 right-4 sm:top-2 sm:right-4 lg:right-4
                   p-1 rounded-full shadow-lg
                   cursor-pointer
                   transition-all transform hover:scale-110 active:scale-95
                   flex items-center justify-center"
      >
        {profilePic ? (
          <img
            src={profilePic}
            alt="User profile"
            className="w-10 h-10 rounded-full object-cover"
          />
        ) : (
          <FaUserCircle className="text-gray-500 w-10 h-10" />
        )}
      </button>

      {isOpen && user && (
        <ProfileForm
          user={user}
          onClose={() => setIsOpen(false)}
          onSave={handleSave}
        />
      )}
    </>
  );
}
