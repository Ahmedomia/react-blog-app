import { useBlogStore } from "../store/blogStore";
import api from "../api";

export function usePublish() {
  const { updateBlogInStore } = useBlogStore();

  const handlePublish = async (blogToPublish) => {
    if (!blogToPublish?.id) {
      console.error("No valid blog provided for publishing");
      return;
    }

    try {
      const updated = { ...blogToPublish, isdraft: false };

      // Use Axios instance for PUT request
      const response = await api.put(`/blogs/${blogToPublish.id}`, updated);
      const updatedBlog = response.data;
      updateBlogInStore(updatedBlog);
      return updatedBlog;
    } catch (err) {
      console.error("Publish error:", err);
    }
  };

  return { handlePublish };
}
