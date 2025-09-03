import { useState } from "react";
import { useUserStore } from "../store/userStore";
import api from "../api"; // Import your custom Axios instance

export function useProfileButton() {
  const [isOpen, setIsOpen] = useState(false);
  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);
  const profilepic = user?.profilepic || null;
  const [formKey, setFormKey] = useState(0);

  const handleSave = async (updatedFields) => {
    try {
      const updatedUser = { ...user, ...updatedFields };

      // Use Axios instance with auto headers
      const response = await api.put(`/users/${user.id}`, updatedUser);

      const updatedUserData = response.data;
      setUser(updatedUserData);
      setFormKey((prev) => prev + 1);
      setIsOpen(false);
    } catch (error) {
      console.error(
        "Profile update failed:",
        error.response?.data || error.message
      );
      alert("Failed to update profile. Please try again.");
    }
  };

  return { user, setIsOpen, isOpen, profilepic, formKey, handleSave };
}
