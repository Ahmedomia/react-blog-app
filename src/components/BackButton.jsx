import { useBackButton } from "../Hooks/useBackButton";
import { FaArrowLeft } from "react-icons/fa";

export default function BackButton() {

    const { handleBack } = useBackButton();
  return (
    <button
      onClick={handleBack}
      className="fixed top-4 left-4 z-50
    bg-[#422f7d] p-2 rounded-full shadow-lg
    hover:bg-[#6840c6] transition-all transform hover:scale-110 active:scale-95
    flex items-center justify-center text-white"
    >
      <FaArrowLeft className="text-lg" />
    </button>
  );
}
