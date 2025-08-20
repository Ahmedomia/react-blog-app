import ProfileForm from "./ProfileForm";
import { useProfileButton } from "../Hooks/useprofileButton";

export default function ProfileButton() {
  const { user, setIsOpen, isOpen, profilepic, formKey, handleSave } =
    useProfileButton();

  return (
    <>
      <button
        onClick={() => {
          setIsOpen(true);
        }}
        aria-label="Profile"
        className="fixed top-4 right-4 sm:top-2 sm:right-4 lg:right-4
                   rounded-full shadow-lg
                   cursor-pointer
                   transition-all transform hover:scale-110 active:scale-95
                   flex items-center justify-center"
      >
        {profilepic ? (
          <img
            src={profilepic}
            alt="User profile"
            className="w-10 h-10 rounded-full object-cover"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
            <p className="text-gray-500 text-2xl font-bold cursor-default">
              {user.name.charAt(0) || "?"}
            </p>
          </div>
        )}
      </button>

      {isOpen && (
        <ProfileForm
          key={formKey}
          user={user}
          onClose={() => setIsOpen(false)}
          onSave={handleSave}
        />
      )}
    </>
  );
}
