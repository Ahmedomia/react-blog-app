import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function useBackButton() {
  const [isEditing, setIsEditing] = useState(false);
    const navigate = useNavigate();


  const handleBack = () => {
    if (isEditing) {
      setIsEditing(false);
    } else {
      navigate(-1);
    }
  };

  return { handleBack };
}
