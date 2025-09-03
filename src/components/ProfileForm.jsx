import { useState, useRef, useEffect } from "react";
import LogOutButton from "../components/LogOutButton";
import { useUserStore } from "../store/userStore";
import { useNavigate } from "react-router-dom";

export default function ProfileForm({ onClose }) {
  const { user: globalUser } = useUserStore();

  const [name, setName] = useState(globalUser?.name || "");
  const [email, setEmail] = useState(globalUser?.email || "");
  const [profilepic, setprofilepic] = useState(globalUser?.profilepic || "");
  const navigate = useNavigate();

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
            className={`relative w-20 h-20 rounded-full overflow-hidden bg-gray-200 flex-shrink-0`}
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
          </div>

          <div className="flex flex-col justify-center">
            <label className="block mb-1 font-semibold">{name}</label>
            <label className="block text-black/50">{email}</label>
          </div>
        </div>

        <div className="flex flex-col justify-center mt-6 gap-3">
          <>
            <button
              type="button"
              onClick={() => navigate("/profilepage")}
              className="w-full flex items-center justify-center text-black border border-gray-400 py-2 rounded-xl cursor-pointer text-center hover:bg-gray-400 transition"
            >
              Go to Profile Page
            </button>
            <div className="w-full flex items-center justify-center text-red-600 border border-gray-400 py-2 rounded-xl cursor-pointer text-center hover:bg-gray-400 transition gap-2">
              <LogOutButton />
              Log Out
            </div>
          </>
        </div>
      </div>
    </div>
  );
}
