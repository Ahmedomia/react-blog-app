import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export function useSharedBlogPage(){
    
  const { shareid } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/blogs/share/${shareid}`,
          {
            headers: { Accept: "application/json" },
          }
        );

        if (!res.ok) {
          if (res.status === 404) setError("Blog not found.");
          else setError("Failed to fetch blog.");
          setBlog(null);
          return;
        }

        const data = await res.json();
        console.log(data)
        setBlog(data);
      } catch (err) {
        console.error("Error fetching shared blog:", err);
        setError("Failed to fetch blog.");
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [shareid]);


  return { blog, loading, error }; 
}