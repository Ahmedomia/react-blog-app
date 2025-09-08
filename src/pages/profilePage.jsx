import { format, parseISO, isValid } from "date-fns";
import { useEffect, useState, useRef } from "react";
import { useUserStore } from "../store/userStore";
import BackButton from "../components/BackButton";
import { FaCog, FaPen } from "react-icons/fa";
import LogOutButton from "../components/LogOutButton";
import { useBlogStore } from "../store/blogStore";
import { SyncLoader } from "react-spinners";
import api from "../api";

export default function ProfilePage({ onClose }) {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user: globalUser, setUser } = useUserStore();
  const { updateUserInUsers } = useBlogStore();

  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState(globalUser?.name || "");
  const [email, setEmail] = useState(globalUser?.email || "");
  const [password, setPassword] = useState("");
  const [profilepic, setprofilepic] = useState(globalUser?.profilepic || "");
  const [backgroundpic, setbackgroundpic] = useState(
    globalUser?.backgroundpic || ""
  );
  const [bio, setBio] = useState(globalUser?.bio || "");
  const [isEditingBio, setIsEditingBio] = useState(false);

  const fileInputRef = useRef(null);
  const backgroundFileRef = useRef(null);

  const formRef = useRef(null);

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      const newPic = reader.result;
      setprofilepic(newPic);

      try {
        const updatedUser = {
          name,
          email,
          profilepic: newPic,
          bio,
          backgroundpic,
        };

        const res = await api.put(`/auth/users/${globalUser.id}`, updatedUser);
        setUser(res.data);
        updateUserInUsers(res.data);
      } catch (err) {
        console.error("Auto-save error:", err.message);
      }
    };

    reader.readAsDataURL(file);
    e.target.value = null;
  };

  const handleBackGroundChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      const newBPic = reader.result;
      setbackgroundpic(newBPic);

      try {
        const updatedUser = {
          name,
          email,
          profilepic,
          bio,
          backgroundpic: newBPic,
        };

        const res = await api.put(`/users/${globalUser.id}`, updatedUser);
        setUser(res.data);
        updateUserInUsers(res.data);
      } catch (err) {
        console.error("Auto-save error:", err.message);
      }
    };

    reader.readAsDataURL(file);
    e.target.value = null;
  };

  const handleSave = async () => {
    if (!globalUser?.id) {
      console.error("User ID is missing. Cannot update.");
      return;
    }

    try {
      const updatedUser = {
        name,
        email,
        profilepic,
        backgroundpic,
        bio,
        ...(password && { password }),
      };

      const res = await api.put(`/auth/users/${globalUser.id}`, updatedUser);
      setUser(res.data);
      updateUserInUsers(res.data);
      setIsOpen(false);
      setPassword("");
    } catch (err) {
      console.error("Update error:", err.message);
    }
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (formRef.current && !formRef.current.contains(e.target)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e) => {
      if (formRef.current && !formRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  useEffect(() => {
    if (globalUser) {
      setName(globalUser.name || "");
      setEmail(globalUser.email || "");
      setprofilepic(globalUser.profilepic || "");
      setbackgroundpic(globalUser.backgroundpic || "");
      setBio(globalUser.bio || "");
    }
  }, [globalUser]);

  const handleSaveBio = async () => {
    if (!globalUser?.id) {
      console.error("User ID is missing. Cannot update bio.");
      return;
    }

    try {
      const updatedUser = {
        name,
        email,
        profilepic,
        backgroundpic,
        bio,
      };

      const res = await api.put(`/auth/users/${globalUser.id}`, updatedUser);
      setUser(res.data);
      updateUserInUsers(res.data);
      setIsEditingBio(false);
    } catch (err) {
      console.error("Bio update error:", err.message);
    }
  };

  useEffect(() => {
    async function fetchProfile() {
      if (!globalUser?.id) return;

      try {
        const userRes = await api.get(`/users/${globalUser.id}`);
        setUser(userRes.data);

        const blogsRes = await api.get(`/blogs/user/${globalUser.id}`);
        const blogsData = blogsRes.data;

        const normalized = Array.isArray(blogsData)
          ? blogsData
          : Array.isArray(blogsData.blogs)
          ? blogsData.blogs
          : blogsData.blog
          ? [blogsData.blog]
          : [];

        setBlogs(normalized);
      } catch (err) {
        console.error("Fetch error:", err);
        setBlogs([]);
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, [globalUser?.id, setUser]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#f8f6ff]">
        <SyncLoader color="#6840c6" size={12} />
        <p className="text-lg text-[#6840c6] mt-4">Loading profile...</p>
      </div>
    );
  }
  if (!globalUser) return <div>User not found</div>;

  return (
    <div className="min-h-screen bg-gray-100">
      <BackButton />
      <button
        onClick={() => setIsOpen(true)}
        className="fixed top-4 right-16 z-50 cursor-pointer
    bg-[#422f7d] p-2 rounded-full shadow-lg
    hover:bg-[#6840c6] transition-all transform hover:scale-110 active:scale-95
    flex items-center justify-center text-white"
      >
        <FaCog size={20} />
      </button>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div
            className="bg-white rounded-2xl shadow-xl w-[550px] h-[430px] p-6 relative"
            ref={formRef}
          >
            <h2 className="text-xl font-semibold mb-4 text-center">
              User Settings
            </h2>

            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>

            <div className="space-y-4">
              <label>Name</label>
              <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border p-2 rounded-lg focus:outline-none"
              />
              <label>Email</label>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border p-2 rounded-lg focus:outline-none"
              />
              <label>New Password</label>
              <input
                type="password"
                placeholder="New Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border p-2 rounded-lg"
              />

              <button
                onClick={handleSave}
                className="w-full mt-12 flex items-center justify-center bg-[#422f7d] text-white py-2 rounded-xl cursor-pointer text-center hover:bg-[#6840c6] transition"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
      <div
        className="fixed top-4 right-4 z-50
    bg-[#422f7d] p-2 rounded-full shadow-lg
    hover:bg-[#6840c6] transition-all transform hover:scale-110 active:scale-95
    flex items-center justify-center text-white"
      >
        <LogOutButton />
      </div>

      <div className="relative h-48">
        {backgroundpic ? (
          <img
            src={backgroundpic || "/default-background.png"}
            alt="Background"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="relative h-48 bg-gradient-to-r from-indigo-500 to-purple-600"></div>
        )}
        <div
          onClick={() => backgroundFileRef.current.click()}
          className="absolute top-40 right-2 bg-white rounded-full p-1 shadow-md cursor-pointer hover:bg-gray-100 transition"
        >
          <FaPen className="text-gray-700 w-4 h-4" />
        </div>
        <input
          ref={backgroundFileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleBackGroundChange}
        />
        <div className="absolute left-1/2 -bottom-16 transform -translate-x-1/2">
          {profilepic ? (
            <img
              src={
                profilepic || globalUser?.profilepic || "/default-profile.png"
              }
              alt="Profile"
              className="w-32 h-32 rounded-full shadow-lg object-cover"
            />
          ) : (
            <div className="w-32 h-32 rounded-full bg-gray-300 flex items-center justify-center">
              <p className="text-gray-500 text-4xl font-bold cursor-default">
                {name.charAt(0) || "?"}
              </p>
            </div>
          )}
          <div
            onClick={() => fileInputRef.current.click()}
            className="absolute bottom-1 right-1 bg-white rounded-full p-1 shadow-md cursor-pointer hover:bg-gray-100 transition"
          >
            <FaPen className="text-gray-700 w-4 h-4" />
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageChange}
          />
        </div>
      </div>

      <div className="mt-20 text-center px-4">
        <h1 className="text-2xl font-bold">
          {globalUser?.name || "User Name"}
        </h1>
        <div className="flex items-center justify-center mt-2 gap-2">
          {isEditingBio ? (
            <div className="flex flex-col items-center">
              <input
                type="text"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="border p-2 rounded-lg w-64 focus:outline-none"
                placeholder="Enter your bio"
                maxLength={50}
              />
              <button
                onClick={handleSaveBio}
                className="mt-2 bg-[#422f7d] text-white px-4 py-1 rounded-lg hover:bg-[#6840c6] transition"
              >
                Save
              </button>
            </div>
          ) : (
            <>
              <p className="text-gray-600">
                {globalUser?.bio || "No bio yet..."}
              </p>
              <FaPen
                className="text-gray-500 w-4 h-4 cursor-pointer hover:text-gray-700"
                onClick={() => setIsEditingBio(true)}
              />
            </>
          )}
        </div>
      </div>

      <div className="mt-12 max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogs.length === 0 ? (
          <div className="col-span-full text-center py-6">
            <p className="text-gray-500 text-lg mb-4 cursor-default">
              No blogs yet
            </p>
            <img
              src="/assets/NoPosts.png"
              alt="no posts"
              className="w-60 h-60 mx-auto"
            />
          </div>
        ) : (
          blogs.map((blog) => {
            const isdraft = blog.isdraft;
            return (
              <div
                key={blog.id}
                className={`relative m-4 w-[350px] h-[550px] bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all transform hover:scale-105 active:scale-95 cursor-pointer ${
                  isdraft
                    ? "border-2 border-dashed border-[#aaa7e6] bg-[#f2f0fc]"
                    : ""
                }`}
              >
                <img
                  src={blog.image || "/assets/NoPic.jpg"}
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
                  {isdraft && (
                    <span className="absolute top-2 right-2 px-2 py-1 text-xs font-bold bg-[#aaa7e6] text-white rounded">
                      Draft
                    </span>
                  )}

                  <p
                    className="text-gray-500 text-sm mt-4 line-clamp-3 overflow-hidden break-words break-all"
                    title={blog.content}
                  >
                    {blog.content}
                  </p>

                  <div className="flex items-center mt-8 pt-3">
                    {profilepic ? (
                      <img
                        src={profilepic}
                        alt={name}
                        className="w-8 h-8 rounded-full object-cover mr-2"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center mr-2">
                        <p className="text-gray-500 font-bold cursor-default">
                          {name?.charAt(0) || "?"}
                        </p>
                      </div>
                    )}

                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-gray-700">
                        {globalUser?.name}
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
    </div>
  );
}
