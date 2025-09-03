import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api";

export function useSharedBlogPage() {
  const { shareid } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBlog = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await api.get(`/blogs/share/${shareid}`);
        setBlog(res.data);
      } catch (err) {
        if (err.response?.status === 404) {
          setError("Blog not found.");
        } else {
          setError("Failed to fetch blog.");
        }
        setBlog(null);
      } finally {
        setLoading(false);
      }
    };

    if (shareid) fetchBlog();
  }, [shareid]);

  return { blog, loading, error };
}
