export function useHandleChange(setEditedBlog) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedBlog((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return { handleChange };
}
