import { useNavigate } from "react-router-dom";
import { useBlogStore } from "../store/blogStore";
import api from "../api";

export function useHandleDelete() {
  const setBlogs = useBlogStore((state) => state.setBlogs);
  const navigate = useNavigate();

  const handleDelete = async (blog) => {
    try {
      await api.delete(`/blogs/${blog.id}`);
      setBlogs((prevBlogs) => prevBlogs.filter((b) => b.id !== blog.id));
      navigate("/mainpage");
    } catch (err) {
      console.error("Error deleting blog:", err);
    }
  };

  return { handleDelete };
}
