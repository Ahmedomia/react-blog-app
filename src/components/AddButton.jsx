const AddButton = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="
        fixed
        bottom-6
        right-6
        sm:bottom-6
        sm:right-6
        lg:right-16
        bg-[#422f7d]
        p-4
        rounded-full
        shadow-lg
        cursor-pointer
        hover:bg-[#6840c6]
        transition-all transform hover:scale-110 active:scale-95
      "
    >
      <img src="/assets/plus.svg" alt="Add" className="w-6 h-6 sm:w-7 sm:h-7" />
    </button>
  );
};

export default AddButton;
