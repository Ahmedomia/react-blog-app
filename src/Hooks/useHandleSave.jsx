import { useBlogStore } from "../store/blogStore";
import api from "../api";

export function useHandlesave() {
  const setBlogs = useBlogStore((state) => state.setBlogs);

  const handleSave = async (blog, editedBlog, setBlog, setIsEditing) => {
    try {
      const updated = {
        ...blog,
        ...editedBlog,
        updatedat: new Date().toISOString(),
      };

      const response = await api.put(`/blogs/${updated.id}`, updated);
      const updatedBlog = response.data;

      setBlogs((prevBlogs) =>
        prevBlogs.map((b) => (b.id === updatedBlog.id ? updatedBlog : b))
      );
      setBlog(updatedBlog);
      setIsEditing(false);
    } catch (err) {
      console.error("Error updating blog:", err);
    }
  };

  return { handleSave };
}
