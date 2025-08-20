import { useState, useRef, useEffect } from "react";
import { FaPen, FaArrowLeft } from "react-icons/fa";
import LogOutButton from "../components/LogOutButton";
import { useUserStore } from "../store/userStore";
import { useBlogStore } from "../store/blogStore";

export default function ProfileForm({ onClose, onSave }) {
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

  return (
    <div className="fixed inset-0 flex items-start justify-end z-50 pr-8 pt-16">
      <div
        ref={formRef}
        className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md relative pt-12"
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 text-2xl font-bold"
        >
          ×
        </button>

        <div className="flex items-center mb-4 gap-4">
          <div
            className={`relative w-20 h-20 rounded-full overflow-hidden bg-gray-200 flex-shrink-0 ${
              isEditing ? "cursor-pointer" : ""
            }`}
            onClick={() => isEditing && fileInputRef.current.click()}
          >
            {profilepic ? (
              <img
                src={profilepic}
                alt="profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full rounded-full bg-gray-300 flex items-center justify-center">
                <p className="text-gray-500 text-4xl font-bold cursor-default">
                  {name.charAt(0) || "?"}
                </p>
              </div>
            )}

            {isEditing && (
              <div className="absolute bottom-1 right-1 bg-white rounded-full p-1 shadow-md transition">
                <FaPen className="text-gray-700 w-4 h-4" />
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
          </div>

          <div className="flex flex-col justify-center">
            <label className="block mb-1 font-semibold">{name}</label>
            <label className="block text-black/50">{email}</label>
          </div>
        </div>

        <div className="flex flex-col justify-center mt-6 gap-3">
          {!isEditing ? (
            <>
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="w-full flex items-center justify-center text-black border border-gray-400 py-2 rounded-xl cursor-pointer text-center hover:bg-gray-400 transition"
              >
                Settings and Privacy
              </button>
              <LogOutButton />
            </>
          ) : (
            <>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full Name"
                className="w-full border rounded-lg px-4 py-2"
              />

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="w-full border rounded-lg px-4 py-2"
              />

              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full border rounded-lg px-4 py-2"
              />

              <button
                onClick={() => setIsEditing(false)}
                className="absolute top-4 left-4 sm:top-4 sm:left-4 lg:left-6
                  bg-[#422f7d] p-2 rounded-full shadow-lg
                  hover:bg-[#6840c6] transition-all transform hover:scale-110 active:scale-95
                  flex items-center justify-center text-white"
              >
                <FaArrowLeft className="text-lg" />
              </button>

              <button
                type="button"
                onClick={handleSaveClick}
                className="w-full flex items-center justify-center bg-[#422f7d] text-white py-2 rounded-xl cursor-pointer text-center hover:bg-[#6840c6] transition"
              >
                Save
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
