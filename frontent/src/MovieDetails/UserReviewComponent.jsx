import { useState } from "react";

const commentsData = [
  {
    id: 1,
    name: "Veronica",
    time: "2h ago",
    text: "This was an absolutely incredible film. The cinematography and storyline kept me hooked till the very end.",
    subtext: "Highly recommend to anyone who loves Tamil cinema.",
    likes: 255,
    avatar: "https://i.pravatar.cc/40?img=47",
    replies: [
      {
        id: 11,
        name: "Andrew",
        time: "2h ago",
        text: "Totally agree with you! The background score by D. Imman was phenomenal.",
        likes: 18,
        avatar: "https://i.pravatar.cc/40?img=12",
      },
    ],
  },
  {
    id: 2,
    name: "Halina B.",
    time: "3h ago",
    text: "Natty's performance was outstanding. He really carried the film with great intensity.",
    subtext: "",
    likes: 142,
    avatar: "https://i.pravatar.cc/40?img=45",
    replies: [],
  },
  {
    id: 3,
    name: "Ravi K.",
    time: "5h ago",
    text: "Kenthiran V has proven himself as a versatile director. Looking forward to his next project.",
    subtext: "",
    likes: 89,
    avatar: "https://i.pravatar.cc/40?img=33",
    replies: [],
  },
];

function ThumbsUpIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-4 h-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21H5a2 2 0 01-2-2v-7a2 2 0 012-2h2.924L10 4.382A1 1 0 0111 4h0a3 3 0 013 3v3z"
      />
    </svg>
  );
}

function ReplyThread({ replies, expanded }) {
  if (!expanded || replies.length === 0) return null;
  return (
    <div className="mt-3 space-y-4">
      {replies.map((reply) => (
        <div key={reply.id} className="flex gap-3 items-start">
          <img
            src={reply.avatar}
            alt={reply.name}
            className="w-9 h-9 rounded-full object-cover flex-shrink-0 border-2"
            style={{ borderColor: "#2a9d5c" }}
          />
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-semibold text-white text-sm">
                {reply.name}
              </span>
              <span className="text-xs" style={{ color: "#6b7280" }}>
                {reply.time}
              </span>
            </div>
            <p className="text-sm mb-2" style={{ color: "#9ca3af" }}>
              {reply.text}
            </p>
            <div className="flex items-center gap-4">
              <button
                className="flex items-center gap-1.5 text-xs transition-colors"
                style={{ color: "#6b7280" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#f59e0b")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#6b7280")}
              >
                <ThumbsUpIcon />
                <span>{reply.likes}</span>
              </button>
              <button
                className="text-xs font-medium transition-colors"
                style={{ color: "#6b7280" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#f59e0b")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#6b7280")}
              >
                Reply
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function CommentCard({ comment }) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(comment.likes);
  const [showReplies, setShowReplies] = useState(false);

  const handleLike = () => {
    setLiked(!liked);
    setLikeCount((prev) => (liked ? prev - 1 : prev + 1));
  };

  return (
    <div
      className="rounded-xl p-4 mb-4 transition-all duration-200"
      style={{ backgroundColor: "#141414", border: "1px solid #1f1f1f" }}
      onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#2a9d5c33")}
      onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#1f1f1f")}
    >
      <div className="flex gap-3 items-start">
        {/* Avatar with connector line */}
        <div className="flex flex-col items-center flex-shrink-0">
          <img
            src={comment.avatar}
            alt={comment.name}
            className="w-10 h-10 rounded-full object-cover border-2"
            style={{ borderColor: "#f59e0b" }}
          />
          {comment.replies.length > 0 && (
            <div
              className="w-0.5 mt-1 flex-1 min-h-8 rounded-full"
              style={{ backgroundColor: "#2a2a2a" }}
            />
          )}
        </div>

        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center gap-2 mb-2">
            <span className="font-bold text-white text-sm">{comment.name}</span>
            <span className="text-xs" style={{ color: "#4b5563" }}>
              {comment.time}
            </span>
          </div>

          {/* Comment text */}
          <p
            className="text-sm leading-relaxed mb-1"
            style={{ color: "#9ca3af" }}
          >
            {comment.text}
          </p>
          {comment.subtext && (
            <p
              className="text-sm leading-relaxed mb-2"
              style={{ color: "#6b7280" }}
            >
              {comment.subtext}
            </p>
          )}

          {/* Actions */}
          <div className="flex items-center gap-4 mt-3">
            <button
              onClick={handleLike}
              className="flex items-center gap-1.5 text-sm font-medium transition-all duration-150"
              style={{ color: liked ? "#f59e0b" : "#6b7280" }}
              onMouseEnter={(e) => {
                if (!liked) e.currentTarget.style.color = "#d1d5db";
              }}
              onMouseLeave={(e) => {
                if (!liked) e.currentTarget.style.color = "#6b7280";
              }}
            >
              <ThumbsUpIcon />
              <span>{likeCount}</span>
            </button>
            <button
              className="text-sm font-semibold transition-colors"
              style={{ color: "#6b7280" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#f59e0b")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#6b7280")}
            >
              Reply
            </button>
          </div>

          {/* Nested reply */}
          {comment.replies.length > 0 && (
            <>
              <ReplyThread replies={comment.replies} expanded={showReplies} />
              <button
                onClick={() => setShowReplies(!showReplies)}
                className="flex items-center gap-1.5 text-xs font-semibold mt-3 transition-colors"
                style={{ color: "#9ca3af" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#f59e0b")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#9ca3af")}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`w-3 h-3 transition-transform ${showReplies ? "rotate-180" : ""}`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
                {showReplies
                  ? "Hide replies"
                  : `View all ${comment.replies.length + 6} replies`}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Comments() {
  const [newComment, setNewComment] = useState("");

  return (
    <div className="flex h-screen" style={{ backgroundColor: "#0a0a0a" }}>
      {/* Left side — your existing page content goes here */}
      <div className="flex-1" />

      {/* Right side — fixed comments panel with internal scroll */}
      <div
        className="flex flex-col w-full max-w-md flex-shrink-0 h-screen"
        style={{
          backgroundColor: "#111111",
          borderLeft: "1px solid #1f1f1f",
        }}
      >
        {/* Panel top — static, does not scroll */}
        <div
          className="flex-shrink-0 px-5 pt-5 pb-3"
          style={{ borderBottom: "1px solid #1f1f1f" }}
        >
          {/* <div className="flex items-center justify-between mb-6">
            <h2 className="text-white text-xl font-bold tracking-wide">Comments</h2>
            <span
              className="text-xs font-semibold px-3 py-1 rounded-full"
              style={{ backgroundColor: "#1a1a1a", color: "#9ca3af", border: "1px solid #2a2a2a" }}
            >
              {commentsData.length} comments
            </span>
          </div> */}

          {/* Divider */}
          <div className="mb-3" style={{ borderTop: "1px solid #1f1f1f" }} />

          {/* Comment Input */}
          {/* <div className="flex gap-3 mb-6"> */}
          {/* <img
              src="https://i.pravatar.cc/40?img=68"
              alt="You"
              className="w-10 h-10 rounded-full object-cover flex-shrink-0 border-2"
              style={{ borderColor: "#2a9d5c" }}
            /> */}
          {/* <div className="flex-1 relative"> */}
          {/* <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                className="w-full text-sm rounded-xl px-4 py-2.5 outline-none transition-all"
                style={{
                  backgroundColor: "#1a1a1a",
                  color: "#e5e7eb",
                  border: "1px solid #2a2a2a",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#f59e0b")}
                onBlur={(e) => (e.target.style.borderColor = "#2a2a2a")}
              /> */}
          {/* {newComment && (
                <button
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold px-3 py-1 rounded-lg transition-colors"
                  style={{ backgroundColor: "#f59e0b", color: "#000" }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#d97706")}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#f59e0b")}
                >
                  Post
                </button>
              )} */}
          {/* </div> */}
          {/* </div> */}
        </div>

        {/* Scrollable comments list */}
        <div
          className="flex-1 overflow-y-auto px-4 py-4"
          style={{ scrollbarWidth: "thin", scrollbarColor: "#2a2a2a #111111" }}
        >
          {commentsData.map((comment) => (
            <CommentCard key={comment.id} comment={comment} />
          ))}
        </div>
      </div>
    </div>
  );
}
