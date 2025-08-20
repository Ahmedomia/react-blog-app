import { useState, useRef, useEffect } from "react";
import { useUserStore } from "../store/userStore";
import { useBlogStore } from "../store/blogStore";

export function useProfileForm({ onClose, onSave }) {
  const { user: globalUser, setUser } = useUserStore();
  const { updateUserInUsers } = useBlogStore();

  const [name, setName] = useState(globalUser?.name || "");
  const [email, setEmail] = useState(globalUser?.email || "");
  const [password, setPassword] = useState("");
  const [profilepic, setprofilepic] = useState(globalUser?.profilepic || "");
  const [isEditing, setIsEditing] = useState(false);

  const fileInputRef = useRef(null);
  const formRef = useRef(null);

  useEffect(() => {
    if (globalUser) {
      setName(globalUser.name || "");
      setEmail(globalUser.email || "");
      setprofilepic(globalUser.profilepic || "");
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (formRef.current && !formRef.current.contains(e.target)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setprofilepic(reader.result);
      reader.readAsDataURL(file);
    }
    e.target.value = null;
  };

  const handleSaveClick = async () => {
    if (!globalUser?.id) {
      console.error("User ID is missing. Cannot update.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const updatedUser = {
        name,
        email,
        profilepic,
        ...(password && { password }),
      };

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/auth/users/${globalUser.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updatedUser),
        }
      );

      if (!res.ok) {
        throw new Error("Failed to update profile");
      }

      const data = await res.json();
      const oldEmail = globalUser.email;
      setUser(data);
      updateUserInUsers(data);
      setIsEditing(false);
      onSave(data, oldEmail);
      onClose();
    } catch (err) {
      console.error("Update error:", err.message);
    }
  };
  return {
    formRef,
    setPassword,
    isEditing,
    fileInputRef,
    handleImageChange,
    handleSaveClick,
    profilepic,
    email,
    name,
    setIsEditing,
    setName,
    setEmail,
    password,
  };
}
