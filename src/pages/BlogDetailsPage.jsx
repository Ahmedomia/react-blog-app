import { useParams } from "react-router-dom";
import { useComments } from "../Hooks/useComments";
import { useBlogDetails } from "../Hooks/useBlogDetails";
import { useUsers } from "../Hooks/useUsers";
import { usePublish } from "../Hooks/usePublish";
import { useHandlesave } from "../Hooks/useHandleSave";
import { useHandleDelete } from "../Hooks/useHandleDelete";
import { useHandleShare } from "../Hooks/useHandleShare";
import { useHandleImageChange } from "../Hooks/useHandleImageChange";
import BlogDetails from "../components/BlogDetails";

export default function BlogDetailsPage() {
  const { id } = useParams();
  const comments = useComments(id);
  const blogDetails = useBlogDetails(id);
  const { handlePublish } = usePublish();
  const { handleDelete } = useHandleDelete();
  const { handleSave } = useHandlesave();
  const { notification, handleShare } = useHandleShare(id);
  const { handleImageChange } = useHandleImageChange(blogDetails.setEditedBlog);
  const { userMap } = useUsers();

  return (
    <BlogDetails
      blog={blogDetails.blog}
      editedBlog={blogDetails.editedBlog}
      isEditing={blogDetails.isEditing}
      setIsEditing={blogDetails.setIsEditing}
      setEditedBlog={blogDetails.setEditedBlog}
      handleEditClick={blogDetails.handleEditClick}
      handleSave={handleSave}
      handleDelete={handleDelete}
      handlePublish={handlePublish}
      handleShare={handleShare}
      handleImageClick={blogDetails.handleImageClick}
      handleImageChange={handleImageChange}
      fileInputRef={blogDetails.fileInputRef}
      notification={notification}
      isAuthor={blogDetails.isAuthor}
      loading={blogDetails.loading}
      commentsProps={{
        comments: comments.comments,
        setNewComment: comments.setNewComment,
        currentUser: comments.currentUser,
        newComment: comments.newComment,
        PostComment: comments.PostComment,
        loggedInUser: comments.loggedInUser,
        toggleComment: comments.toggleComment,
        expandedComments: comments.expandedComments,
        handleReactSuccess: comments.handleReactSuccess,
        userMap,
      }}
    />
  );
}
