import { useState, useEffect } from "react";
import { useUserStore } from "../store/userStore";
import axios from "axios";

export function useProfileButton(){
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
    return { user, setIsOpen, isOpen, profilepic, formKey, handleSave };
}