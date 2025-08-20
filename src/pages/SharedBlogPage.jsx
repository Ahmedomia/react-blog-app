import { format, parseISO, isValid } from "date-fns";
import { useSharedBlogPage } from "../Hooks/useSharedBlogPage";
import CommentsSection from "../components/CommentsSection";
import { useComments } from "../Hooks/useComments";
import { useParams } from "react-router-dom";
import { useUsers } from "../Hooks/useUsers";

export default function SharedBlogPage() {
  const { blog, loading, error } = useSharedBlogPage();
  const { userMap } = useUsers();
  const { shareid } = useParams();
  const { comments, toggleComment, expandedComments } = useComments(
    null,
    shareid
  );

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (error) return <p className="text-center mt-10">{error}</p>;

  return (
    <div
      className="min-h-screen bg-[#f8f6ff] bg-no-repeat bg-cover bg-center"
      style={{ backgroundImage: "url('/assets/Background pattern.svg')" }}
    >
      <div className="relative max-w-2xl mx-auto px-4 py-8 space-y-4">
        <h1 className="text-3xl font-bold mt-4 text-center cursor-default">
          {blog.title}
        </h1>

        <div className="flex items-center gap-x-4">
          {blog.authorpic ? (
            <img
              src={blog.authorpic}
              alt={blog.author}
              className="w-16 h-16 rounded-full object-cover"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-gray-300 flex items-center justify-center">
              <p className="text-gray-500 text-2xl font-bold cursor-default">
                {blog.author?.charAt(0) || "?"}
              </p>
            </div>
          )}

          <h1 className="text-lg font-semibold cursor-default">
            {blog.author}
          </h1>
          <div className="h-4 border-l border-gray-300" />
          <span className="text-xs text-gray-400 cursor-default">
            {blog.createdat && isValid(parseISO(blog.createdat))
              ? format(parseISO(blog.createdat), "dd MMM yyyy")
              : "Unknown date"}
          </span>
        </div>

        {blog.image && (
          <img
            src={blog.image}
            alt="Blog"
            className="w-full h-auto max-h-[400px] object-cover"
          />
        )}

        <p className="text-lg break-words leading-relaxed whitespace-pre-wrap text-center cursor-default">
          {blog.content}
        </p>

        <CommentsSection
          comments={comments}
          userMap={userMap}
          expandedComments={expandedComments}
          toggleComment={toggleComment}
        />
      </div>
    </div>
  );
}
