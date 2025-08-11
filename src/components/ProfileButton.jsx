import { useState, useEffect } from "react";
import { FaUserCircle } from "react-icons/fa";
import ProfileForm from "./ProfileForm";
import { useUserStore } from "../store/userStore";
import axios from "axios";

export default function ProfileButton() {
  const [isOpen, setIsOpen] = useState(false);

  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);

  const profilepic = user?.profilepic || null;

  useEffect(() => {
    if (!user) {
      const storedUser = localStorage.getItem("loggedInUser");
      if (storedUser && storedUser !== "undefined") {
        setUser(JSON.parse(storedUser));
      }
    }
  }, [user, setUser]);

  const [formKey, setFormKey] = useState(0);

  const handleSave = async (updatedFields) => {
    try {
      const token = localStorage.getItem("token");

      // Merge original user with updatedFields
      const updatedUser = { ...user, ...updatedFields };

      const response = await axios.put(
        `http://localhost:5000/api/users/${user.id}`,
        updatedUser,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const updatedUserData = response.data;
      setUser(updatedUserData);
      setFormKey((prev) => prev + 1);
      localStorage.setItem("loggedInUser", JSON.stringify(updatedUserData));
      setIsOpen(false);
    } catch (error) {
      console.error(
        "Profile update failed:",
        error.response?.data || error.message
      );
      alert("Failed to update profile. Please try again.");
    }
  };

  return (
    <>
      <button
        onClick={() => {
          setIsOpen(true);
        }}
        aria-label="Profile"
        className="fixed top-4 right-4 sm:top-2 sm:right-4 lg:right-4
                   rounded-full shadow-lg
                   cursor-pointer
                   transition-all transform hover:scale-110 active:scale-95
                   flex items-center justify-center"
      >
        {profilepic ? (
          <img
            src={profilepic}
            alt="User profile"
            className="w-10 h-10 rounded-full object-cover"
          />
        ) : (
          <FaUserCircle className="text-gray-500 w-10 h-10" />
        )}
      </button>

      {isOpen && (
        <ProfileForm
          key={formKey}
          user={user}
          onClose={() => setIsOpen(false)}
          onSave={handleSave}
        />
      )}
    </>
  );
}
