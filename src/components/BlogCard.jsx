import { format, parseISO, isValid } from "date-fns";

export default function BlogCard({
  blog,
  onClick,
  authorPic,
  authorName,
  cardClassName = "",
}) {
  const isDraft = blog.isdraft;

  return (
    <div
      key={blog.id}
      onClick={onClick}
      className={`relative m-4 w-[350px] h-[550px] bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all transform hover:scale-105 active:scale-95 cursor-pointer ${
        isDraft ? "border-2 border-dashed border-[#aaa7e6] bg-[#f2f0fc]" : ""
      } ${cardClassName}`}
      title={blog.title}
    >
      <img
        src={blog.image || "/assets/NoPic.jpg"}
        alt={blog.title}
        className="object-cover mx-auto m-4 w-[320px] h-[240px]"
      />
      <div className="p-4">
        <p className="text-xs text-[#6e6cdf] font-bold">{blog.category}</p>
        <div className="relative mt-4">
          <h2 className="text-lg font-bold text-black/80 pr-8">{blog.title}</h2>
          <img
            src="/assets/Icon wrap.svg"
            alt="Icon wrap"
            className="w-[24px] h-[28px] absolute top-0 right-2"
          />
        </div>
        {isDraft && (
          <span className="absolute top-2 right-2 px-2 py-1 text-xs font-bold bg-[#aaa7e6] text-white rounded">
            Draft
          </span>
        )}
        <p
          className="text-gray-500 text-sm mt-4 line-clamp-3 overflow-hidden break-words break-all"
          title={blog.content}
        >
          {blog.content}
        </p>
        <div className="flex items-center mt-8 pt-3">
          {authorPic ? (
            <img
              src={authorPic}
              alt={authorName}
              className="w-8 h-8 rounded-full object-cover mr-2"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center mr-2">
              <p className="text-gray-500 font-bold cursor-default">
                {authorName?.charAt(0) || "?"}
              </p>
            </div>
          )}
          <div className="flex flex-col">
            <span className="text-sm font-medium text-gray-700">
              {authorName}
            </span>
            <span className="text-xs text-gray-400">
              {blog.createdat && isValid(parseISO(blog.createdat))
                ? format(parseISO(blog.createdat), "dd MMM yyyy")
                : "Unknown date"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
