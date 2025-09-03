export function useHandleImageChange(setEditedBlog) {
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setEditedBlog((prev) => ({ ...prev, image: reader.result }));
    };
    reader.readAsDataURL(file);
  };
  return { handleImageChange };
}