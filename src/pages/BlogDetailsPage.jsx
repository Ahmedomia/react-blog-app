import { useParams } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { format, parseISO, isValid } from "date-fns";
import ProfileButton from "../components/ProfileButton";
import { SyncLoader } from "react-spinners";
import CommentsSection from "../components/CommentsSection";
import { useComments } from "../Hooks/useComments";
import { useBlogDetails } from "../Hooks/useBlogDetails";
import { useUsers } from "../Hooks/useUsers";

export default function BlogDetailsPage() {
  const { id } = useParams();
  const {
    comments,
    setNewComment,
    currentUser,
    newComment,
    PostComment,
    loggedInUser,
    toggleComment,
    expandedComments,
    handleReactSuccess,
  } = useComments(id);
  const {
    blog,
    loading,
    editedBlog,
    isEditing,
    fileInputRef,
    notification,
    isAuthor,
    handlePublish,
    handleChange,
    handleEditClick,
    handleSave,
    handleDelete,
    handleBack,
    handleImageClick,
    handleShare,
    handleImageChange,
  } = useBlogDetails(id);

  const { userMap } = useUsers();

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#f8f6ff]">
        <SyncLoader color="#6840c6" size={12} />
        <p className="text-lg text-[#6840c6] mt-4">Loading blog...</p>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-[#f8f6ff] bg-no-repeat bg-cover bg-center"
      style={{ backgroundImage: "url('/assets/Background pattern.svg')" }}
    >
      {notification && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded shadow-lg z-50 transition-opacity duration-300">
          {notification}
        </div>
      )}
      <div className="relative max-w-2xl mx-auto px-4 py-8">
        <button
          onClick={handleBack}
          className="fixed top-4 left-4 z-50
    bg-[#422f7d] p-2 rounded-full shadow-lg
    hover:bg-[#6840c6] transition-all transform hover:scale-110 active:scale-95
    flex items-center justify-center text-white"
        >
          <FaArrowLeft className="text-lg" />
        </button>
        <ProfileButton />

        <div className="space-y-4">
          {isEditing ? (
            <input
              type="text"
              name="title"
              value={editedBlog.title}
              onChange={handleChange}
              className="w-full border-none focus:border-none focus:outline-none focus:ring-0 rounded text-center text-3xl font-bold"
            />
          ) : (
            <h1 className="text-3xl font-bold mt-4 text-center cursor-default">
              {blog?.title}
            </h1>
          )}

          <div className="flex items-center gap-x-4">
            {blog?.authorpic ? (
              <img
                src={blog.authorpic}
                alt={blog.author}
                className="w-16 h-16 rounded-full object-cover "
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-gray-300 flex items-center justify-center">
                <p className="text-gray-500 text-2xl font-bold cursor-default">
                  {blog?.author?.charAt(0) || "?"}
                </p>
              </div>
            )}
            <h1 className="text-lg font-semibold cursor-default">
              {blog?.author}
            </h1>

            <div className="h-4 border-l border-gray-300" />
            <span className="text-xs text-gray-400 cursor-default">
              {blog?.createdat && isValid(parseISO(blog.createdat))
                ? format(parseISO(blog.createdat), "dd MMM yyyy")
                : "Unknown date"}
            </span>
            {isAuthor && !isEditing && (
              <div className="flex gap-2 ml-auto">
                <button
                  onClick={handleEditClick}
                  className="group relative w-[24px] h-[24px]"
                >
                  <img
                    src="/assets/Edit.svg"
                    alt="Edit"
                    className="absolute inset-0 w-full h-full group-hover:opacity-0 transition-opacity duration-200"
                  />
                  <img
                    src="/assets/editblue.svg"
                    alt="Edit colored"
                    className="absolute inset-0 w-full h-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  />
                </button>

                <button
                  onClick={handleDelete}
                  className="group relative w-[24px] h-[24px]"
                >
                  <img
                    src="/assets/trash-svgrepo-com.svg"
                    alt="Delete"
                    className="absolute inset-0 w-full h-full group-hover:opacity-0 transition-opacity duration-200"
                  />
                  <img
                    src="/assets/trashred-svgrepo-com.svg"
                    alt="Delete colored"
                    className="absolute inset-0 w-full h-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  />
                </button>
                {!blog.isdraft && (
                  <button
                    onClick={handleShare}
                    className="group relative w-[24px] h-[24px]"
                  >
                    <img
                      src="/assets/Share.svg"
                      alt="Share"
                      className="absolute inset-0 w-full h-full group-hover:opacity-0 transition-opacity duration-200"
                    />
                    <img
                      src="/assets/ShareGreen.svg"
                      alt="Share colored"
                      className="absolute inset-0 w-full h-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    />
                  </button>
                )}
              </div>
            )}
          </div>

          {editedBlog?.image ? (
            <img
              src={editedBlog.image}
              alt="Blog"
              className={`w-full h-auto max-h-[400px] object-cover ${
                isEditing ? "cursor-pointer" : "cursor-default"
              }`}
              onClick={isEditing ? handleImageClick : undefined}
            />
          ) : (
            isEditing && (
              <button
                onClick={handleImageClick}
                aria-label="Upload blog image"
                className="flex items-center justify-center w-20 h-20 mx-auto rounded border-2 border-dashed border-gray-400 text-gray-400 hover:border-purple-600 hover:text-purple-600 transition-colors"
                title="Click to upload image"
                type="button"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 4v16m8-8H4"
                  />
                </svg>
              </button>
            )
          )}

          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleImageChange}
            className="hidden"
          />

          {isEditing ? (
            <>
              <textarea
                name="content"
                value={editedBlog.content}
                onChange={handleChange}
                rows={10}
                className="w-full text-center border-none focus:border-none focus:outline-none focus:ring-0 rounded border text-lg leading-relaxed whitespace-pre-wrap"
              />
              <div className="flex gap-4">
                <button
                  onClick={handleSave}
                  className="w-50 flex items-center justify-center bg-[#422f7d] text-white py-2 px-4 rounded-xl mt-2 cursor-pointer text-center hover:bg-[#6840c6] transition"
                >
                  Save
                </button>
              </div>
            </>
          ) : (
            <>
              <p className="text-lg break-words break-all leading-relaxed whitespace-pre-wrap text-center cursor-default">
                {blog?.content}
              </p>
              <div className="flex justify-end">
                {blog?.isdraft && isAuthor && !isEditing && (
                  <button
                    onClick={handlePublish}
                    className="mt-2 px-4 py-2 bg-[#6840c6] text-white rounded hover:bg-[#422f7d]"
                  >
                    Publish
                  </button>
                )}
              </div>
            </>
          )}
          {!blog?.isdraft && (
            <CommentsSection
              comments={comments}
              userMap={userMap}
              loggedInUser={loggedInUser}
              newComment={newComment}
              setNewComment={setNewComment}
              PostComment={PostComment}
              currentUser={currentUser}
              expandedComments={expandedComments}
              toggleComment={toggleComment}
              handleReactSuccess={handleReactSuccess}
            />
          )}
        </div>
      </div>
    </div>
  );
}
