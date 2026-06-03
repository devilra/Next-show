import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import {
  useQuery,
  useMutation,
  useQueryClient,
  useQueries,
} from "@tanstack/react-query";
import api from "../api";
import { Heart, MessageCircle, Reply } from "lucide-react";

dayjs.extend(relativeTime);

const ME_ID = "74fb0e29-ce8f-4f0d-9334-37e1ce38b1f1";

// ── helpers ──────────────────────────────────────────────
const getInitials = (name) =>
  name
    ? name
        .split(" ")
        .map((w) => w[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "?";
const timeAgo = (date) => {
  const now = dayjs();
  const created = dayjs(date);

  const seconds = now.diff(created, "second");
  const minutes = now.diff(created, "minute");
  const hours = now.diff(created, "hour");
  const days = now.diff(created, "day");
  const months = now.diff(created, "month");
  const years = now.diff(created, "year");

  if (seconds < 60) {
    return `${seconds} sec`;
  }

  if (minutes < 60) {
    return `${minutes} min`;
  }

  if (hours < 24) {
    return `${hours} hour`;
  }

  if (days < 30) {
    return `${days} day`;
  }

  if (months < 12) {
    return `${months} month`;
  }

  return `${years} year`;
};
const isExternal = (src) =>
  src?.startsWith("http://") || src?.startsWith("https://");

// ── Avatar ────────────────────────────────────────────────
const Avatar = ({ user, size = "md" }) => {
  const [err, setErr] = useState(false);
  const src = user?.profileImage;
  const sz = size === "sm" ? "w-6 h-6 text-[10px]" : "w-9 h-9 text-sm";
  const border = size === "sm" ? "border" : "border-2";
  if (src && isExternal(src) && !err) {
    return (
      <img
        src={src}
        alt={user?.fullName || user?.name}
        onError={() => setErr(true)}
        className={`${sz} rounded-full object-cover ${border} border-orange-500/30 flex-shrink-0`}
      />
    );
  }
  return (
    <div
      className={`${sz} rounded-full flex-shrink-0 flex items-center justify-center font-bold text-white ${border} border-orange-500/30`}
      style={{ background: "linear-gradient(135deg,#ff8c00,#b35e00)" }}
    >
      {getInitials(user?.fullName || user?.name)}
    </div>
  );
};

// ── StarRating ────────────────────────────────────────────
const StarRating = ({ rating }) => {
  const val = parseFloat(rating);
  const filled = Math.round(val / 2);
  return (
    <div className="flex items-center gap-1 mt-0.5">
      <div className="flex gap-px">
        {[1, 2, 3, 4, 5].map((i) => (
          <span
            key={i}
            className={`text-[11px] ${i <= filled ? "text-orange-500" : "text-zinc-700"}`}
          >
            ★
          </span>
        ))}
      </div>
      <span className="text-[11px] font-bold text-orange-500 bg-orange-500/10 rounded px-1.5 py-px">
        {val.toFixed(1)}
      </span>
      <span className="text-[11px] text-zinc-600">/ 10</span>
    </div>
  );
};

// ── DotsMenu ──────────────────────────────────────────────
import { useRef, useEffect } from "react";
import { Info, MessageCircleOff } from "lucide-react";
import { useSnackbar } from "../../context/SnackbarContext";

const DotsMenu = ({ isOwn, onEdit, onDelete, onReport }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef();
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);
  return (
    <div className="relative flex-shrink-0" ref={ref}>
      <button
        onClick={(e) => {
          e.stopPropagation();
          setOpen((p) => !p);
        }}
        className="text-zinc-600 hover:text-zinc-300 px-1.5 py-0.5 rounded-md hover:bg-white/5 transition-colors text-lg leading-none"
      >
        ⋯
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: -4 }}
            transition={{ duration: 0.13 }}
            className="absolute right-0 top-full z-50 mt-1 bg-zinc-900 border border-white/10 rounded-xl p-1 min-w-[120px] shadow-xl"
          >
            {isOwn ? (
              <>
                <button
                  onClick={() => {
                    setOpen(false);
                    onEdit();
                  }}
                  className="flex items-center gap-2 w-full px-3 py-1.5 text-xs text-zinc-300 hover:bg-white/7 rounded-lg transition-colors"
                >
                  ✎ Edit
                </button>
                <button
                  onClick={() => {
                    setOpen(false);
                    onDelete();
                  }}
                  className="flex items-center gap-2 w-full px-3 py-1.5 text-xs text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                >
                  🗑 Delete
                </button>
              </>
            ) : (
              <button
                onClick={() => {
                  setOpen(false);
                  onReport?.();
                }}
                className="flex items-center gap-2 w-full px-3 py-1.5 text-xs text-zinc-300 hover:bg-white/7 rounded-lg transition-colors"
              >
                ⚑ Report
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ── ReplyInput ────────────────────────────────────────────
const ReplyInput = ({ onSend, onCancel }) => {
  const [text, setText] = useState("");
  const taRef = useRef();
  useEffect(() => {
    taRef.current?.focus();
  }, []);
  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.22 }}
      className="overflow-hidden mt-2 ml-[46px] pl-3 border-l-2 border-orange-500/10"
    >
      <div className="flex gap-2 items-end">
        <textarea
          ref={taRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              if (text.trim()) onSend(text.trim());
            }
          }}
          placeholder="Write a reply..."
          rows={1}
          className="flex-1 bg-white/[0.04] border border-white/[0.09] focus:border-orange-500/40 rounded-xl px-3 py-2 text-xs text-zinc-200 placeholder-zinc-600 outline-none resize-none min-h-[34px] max-h-[80px] transition-colors font-inherit"
        />
        <button
          onClick={() => {
            if (text.trim()) onSend(text.trim());
          }}
          className="bg-orange-500 hover:bg-orange-600 text-white text-[11px] font-semibold rounded-lg px-3 py-2 transition-colors flex-shrink-0"
        >
          Send
        </button>
        <button
          onClick={onCancel}
          className="text-zinc-600 hover:text-zinc-400 text-[11px] px-2 py-2 transition-colors"
        >
          ✕
        </button>
      </div>
    </motion.div>
  );
};

// ── EditInput ─────────────────────────────────────────────
const EditInput = ({ defaultValue, onSave, onCancel }) => {
  const [text, setText] = useState(defaultValue);
  return (
    <div className="mt-2">
      <textarea
        autoFocus
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={2}
        className="w-full bg-white/[0.04] border border-orange-500/35 rounded-xl px-3 py-2 text-xs text-zinc-200 outline-none resize-none font-inherit transition-colors"
      />
      <div className="flex gap-2 mt-1.5">
        <button
          onClick={() => {
            if (text.trim()) onSave(text.trim());
          }}
          className="bg-orange-500 hover:bg-orange-600 text-white text-[11px] font-semibold rounded-lg px-3 py-1.5 transition-colors"
        >
          Save
        </button>
        <button
          onClick={onCancel}
          className="text-zinc-600 hover:text-zinc-400 text-[11px] px-2 py-1.5 transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

// ── Skeleton ──────────────────────────────────────────────
const ReviewSkeleton = () => (
  <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-4 animate-pulse">
    <div className="flex items-start gap-3">
      <div className="w-9 h-9 rounded-full bg-white/10 flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-3 w-24 bg-white/10 rounded" />
        <div className="h-2.5 w-16 bg-white/10 rounded" />
      </div>
      <div className="h-2.5 w-10 bg-white/10 rounded" />
    </div>
    <div className="pl-[48px] mt-3 space-y-2">
      <div className="h-3 w-full bg-white/10 rounded" />
      <div className="h-3 w-3/4 bg-white/10 rounded" />
    </div>
  </div>
);

// ── ReplyItem ─────────────────────────────────────────────
const ReplyItem = ({ reply, reviewId, onDelete, onEdit }) => {
  const [editMode, setEditMode] = useState(false);
  const isOwn = reply.user?.id === ME_ID;
  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -8 }}
      className="flex items-start gap-2"
    >
      <Avatar user={reply.user} size="sm" />
      <div className="flex-1 bg-white/[0.02] border border-white/5 rounded-xl px-3 py-2 relative">
        <div className="flex items-center justify-between gap-2">
          <div>
            <span className="text-[11px] font-semibold text-zinc-300">
              {reply.user?.name}
            </span>
            {reply.user?.username && (
              <span className="text-[10px] text-zinc-600 ml-1">
                @{reply.user.username}
              </span>
            )}
          </div>
          <DotsMenu
            isOwn={isOwn}
            onEdit={() => setEditMode(true)}
            onDelete={() => onDelete(reply.id)}
          />
        </div>
        {editMode ? (
          <EditInput
            defaultValue={reply.reply}
            onSave={(txt) => {
              onEdit(reply.id, txt);
              setEditMode(false);
            }}
            onCancel={() => setEditMode(false)}
          />
        ) : (
          <p className="text-xs text-zinc-500 mt-0.5 leading-relaxed">
            {reply.reply}
          </p>
        )}
        <p className="text-[10px] text-zinc-700 mt-1">
          {timeAgo(reply.createdAt)}
        </p>
      </div>
    </motion.div>
  );
};

// ── ReviewCard ────────────────────────────────────────────
const ReviewCard = ({
  review,
  index,
  onDelete,
  onEdit,
  onAddReply,
  onDeleteReply,
  onEditReply,
  onLike,
}) => {
  const [showReplies, setShowReplies] = useState(false);
  const [showInput, setShowInput] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const isOwn = review.userId === ME_ID;
  const hasReplies = review.replies?.length > 0;

  const handleReply = (text) => {
    onAddReply(review.id, text);
    setShowInput(false);
    setShowReplies(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ delay: index * 0.06, duration: 0.32, ease: "easeOut" }}
      whileHover={{ y: -2, transition: { duration: 0.18 } }}
      className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-4 hover:bg-white/[0.05] hover:border-orange-500/20 transition-colors duration-200"
    >
      <div className="flex items-start gap-3">
        <Avatar user={review.reviewUser} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-semibold text-zinc-200">
              {review.reviewUser?.fullName}
            </span>
            {review.reviewUser?.username && (
              <span className="text-xs text-zinc-600">
                {review.reviewUser.username}
              </span>
            )}
            {review.isVerifiedViewer && (
              <span className="text-[10px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded px-1.5 py-px">
                ✓ Verified
              </span>
            )}
          </div>
          <StarRating rating={review.rating} />
        </div>
        <span className="text-[11px] text-zinc-600 whitespace-nowrap flex-shrink-0">
          {timeAgo(review.createdAt)}
        </span>
        <DotsMenu
          isOwn={isOwn}
          onEdit={() => setEditMode(true)}
          onDelete={() => onDelete(review.id)}
        />
      </div>

      <div className="pl-[48px] mt-2">
        {editMode ? (
          <EditInput
            defaultValue={review.review}
            onSave={(txt) => {
              onEdit(review.id, txt);
              setEditMode(false);
            }}
            onCancel={() => setEditMode(false)}
          />
        ) : (
          <p className="text-sm text-zinc-400 leading-relaxed">
            {review.review}
          </p>
        )}
        <div className="flex items-center gap-3 mt-2">
          <motion.button
            whileTap={{ scale: 0.8 }}
            whileHover={{ scale: 1.08 }}
            onClick={() => {
              onLike(review.id);
            }}
            className="
    relative
    flex items-center gap-1.5
    text-[12px]
    transition-all
  "
          >
            <AnimatePresence>
              {review.isLiked && (
                <motion.span
                  initial={{ scale: 0, opacity: 1 }}
                  animate={{
                    scale: 2.5,
                    opacity: 0,
                  }}
                  exit={{ opacity: 0 }}
                  transition={{
                    duration: 0.6,
                  }}
                  className="
          absolute
          inset-0
          rounded-full
          bg-red-500/40
          blur-md
        "
                />
              )}
            </AnimatePresence>

            <motion.div
              animate={
                review.isLiked
                  ? {
                      scale: [1, 1.4, 1],
                    }
                  : {}
              }
              transition={{
                duration: 0.4,
              }}
            >
              <Heart
                size={16}
                className={
                  review.isLiked ? "fill-red-500 text-red-500" : "text-zinc-400"
                }
              />
            </motion.div>

            <span className={review.isLiked ? "text-red-400" : "text-zinc-500"}>
              {review.totalLikes}
            </span>
          </motion.button>
          <div
            className="
    flex items-center gap-1.5
    text-zinc-500
    text-[12px]
  "
          >
            <MessageCircle size={15} className="text-zinc-400" />

            <span>{review.totalReplies}</span>
          </div>
          {review.containsSpoiler && (
            <span className="text-[10px] text-red-400 bg-red-500/10 border border-red-500/20 rounded px-2 py-px">
              Spoiler
            </span>
          )}

          <motion.button
            whileHover={{
              scale: 1.05,
            }}
            whileTap={{
              scale: 0.95,
            }}
            onClick={() => {
              setShowInput((p) => !p);

              if (!showReplies && hasReplies) {
                setShowReplies(true);
              }
            }}
            className="
    flex items-center gap-1.5
    text-[12px]
    text-zinc-500
    hover:text-orange-500
    transition-all
  "
          >
            <Reply size={15} />

            <span>Reply</span>
          </motion.button>
        </div>

        {hasReplies && (
          <button
            onClick={() => setShowReplies((p) => !p)}
            className="flex items-center gap-1 text-[11px] text-orange-500/70 hover:text-orange-500 mt-2 transition-colors bg-transparent border-none cursor-pointer"
          >
            ↳ {showReplies ? "Hide" : "View"} {review.replies.length}{" "}
            {review.replies.length === 1 ? "reply" : "replies"}
          </button>
        )}
      </div>

      <AnimatePresence>
        {showReplies && hasReplies && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22 }}
            className="overflow-hidden mt-3 ml-[48px] pl-3 border-l-2 border-orange-500/10 flex flex-col gap-2"
          >
            <AnimatePresence>
              {review.replies.map((rp) => (
                <ReplyItem
                  key={rp.id}
                  reply={rp}
                  reviewId={review.id}
                  onDelete={(rpId) => onDeleteReply(review.id, rpId)}
                  onEdit={(rpId, txt) => onEditReply(review.id, rpId, txt)}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showInput && (
          <ReplyInput
            onSend={handleReply}
            onCancel={() => setShowInput(false)}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// ── ReviewsCarousel (main export) ─────────────────────────
const ReviewsCarousel = ({ movieId }) => {
  const queryClient = useQueryClient();
  const { showSnackbar } = useSnackbar();

  // ✅ Fetch reviews (replies nested inside each review)

  const results = useQueries({
    queries: [
      {
        queryKey: ["movie-reviews", movieId],
        queryFn: async () => {
          const response = await api.get(`/auth/user/movie-reviews/${movieId}`);
          console.log("ALL MOVIE REVIEWS", response.data);
          return response.data;
        },
        enabled: !!movieId,
        staleTime: 1000 * 60 * 5,
        refetchOnWindowFocus: false,
        retry: false,
      },
      {
        queryKey: ["user-movie-review", movieId],
        queryFn: async () => {
          const response = await api.get(`/auth/user/movie-reviews/${movieId}`);
          console.log("CURRENT USER REVIEW", response.data);

          return response.data;
        },
        enabled: !!movieId,
        refetchOnWindowFocus: false,
        staleTime: 1000 * 60 * 2,
        retry: false,
      },
    ],
  });

  const toggleReviewLikeMutation = useMutation({
    mutationFn: async (reviewId) => {
      const response = await api.post("/auth/user/toggle-review-like", {
        reviewId,
      });
      console.log(response.data);
      return response.data;
    },
    // ==================================================
    // ✅ OPTIMISTIC UPDATE
    // ==================================================
    onMutate: async (reviewId) => {
      await queryClient.cancelQueries({
        queryKey: ["movie-reviews", movieId],
      });

      const previousReviews = queryClient.getQueryData([
        "movie-reviews",
        movieId,
      ]);

      queryClient.setQueryData(["movie-reviews", movieId], (oldData) => {
        if (!oldData?.data) {
          return oldData;
        }

        return {
          ...oldData,

          data: oldData.data.map((review) => {
            if (review.id !== reviewId) {
              return review;
            }

            const currentlyLiked = review.isLiked === true;

            return {
              ...review,

              isLiked: !currentlyLiked,

              totalLikes: currentlyLiked
                ? Math.max(0, Number(review.totalLikes || 0) - 1)
                : Number(review.totalLikes || 0) + 1,
            };
          }),
        };
      });

      return {
        previousReviews,
      };
    },
    // ==================================================
    // ✅ SUCCESS
    // ==================================================
    onSuccess: async (response, reviewId) => {
      queryClient.setQueryData(["movie-reviews", movieId], (oldData) => {
        if (!oldData?.data) {
          return oldData;
        }

        return {
          ...oldData,

          data: oldData.data.map((review) => {
            if (review.id !== reviewId) {
              return review;
            }

            return {
              ...review,

              isLiked: response.liked,

              totalLikes: response.totalLikes,
            };
          }),
        };
      });

      await queryClient.invalidateQueries({
        queryKey: ["movie-reviews", movieId],
      });
    },
    // ==================================================
    // ✅ ROLLBACK
    // ==================================================
    onError: (error, reviewId, context) => {
      queryClient.setQueryData(
        ["movie-reviews", movieId],
        context.previousReviews,
      );

      showSnackbar(
        error?.response?.data?.message || "Failed to update like",
        "error",
      );
    },
  });

  const allReviewsResponse = results[0];
  const userReviewResponse = results[1];
  const isLoading = allReviewsResponse.isLoading;
  const isError = allReviewsResponse.isError;
  const data = allReviewsResponse.data;
  const reviews = data?.data ?? [];
  const noReviews = !isLoading && !isError && reviews.length === 0;
  const averageRating = data?.averageRating;
  const totalReviews = data?.totalReviews ?? reviews.length;

  // -------------Current User Review-------------
  const currentUserReview = userReviewResponse?.data?.data || null;
  const hasReviewed = userReviewResponse?.data?.rated || false;

  const avg =
    averageRating ||
    (reviews.length
      ? (
          reviews.reduce((s, r) => s + parseFloat(r.rating), 0) / reviews.length
        ).toFixed(1)
      : "—");

  // ── local optimistic helpers (same logic as before) ──────
  const updateReviews = (updater) => {
    queryClient.setQueryData(["movie-reviews", movieId], (old) => {
      if (!old) return old;
      return { ...old, data: updater(old.data ?? []) };
    });
  };

  const handleDelete = (id) =>
    updateReviews((prev) => prev.filter((r) => r.id !== id));

  const handleEdit = (id, txt) =>
    updateReviews((prev) =>
      prev.map((r) => (r.id === id ? { ...r, review: txt } : r)),
    );

  const handleAddReply = (reviewId, text) =>
    updateReviews((prev) =>
      prev.map((r) =>
        r.id === reviewId
          ? {
              ...r,
              totalReplies: (r.replies?.length ?? 0) + 1,
              replies: [
                ...(r.replies ?? []),
                {
                  id: "rp-" + Date.now(),
                  reply: text,
                  createdAt: new Date().toISOString(),
                  user: {
                    id: ME_ID,
                    name: "Kali",
                    username: "rockstar",
                    profileImage: null,
                  },
                },
              ],
            }
          : r,
      ),
    );

  const handleDeleteReply = (reviewId, replyId) =>
    updateReviews((prev) =>
      prev.map((r) =>
        r.id === reviewId
          ? {
              ...r,
              replies: r.replies.filter((rp) => rp.id !== replyId),
              totalReplies: r.replies.length - 1,
            }
          : r,
      ),
    );

  const handleEditReply = (reviewId, replyId, txt) =>
    updateReviews((prev) =>
      prev.map((r) =>
        r.id === reviewId
          ? {
              ...r,
              replies: r.replies.map((rp) =>
                rp.id === replyId ? { ...rp, reply: txt } : rp,
              ),
            }
          : r,
      ),
    );

  if (noReviews) {
    return (
      <section className="w-full mb-10">
        <div className="flex items-center gap-4 mb-6 px-2">
          {/* Left Orange Bar */}
          <div
            className="
      w-1 md:w-1.5
      h-10 md:h-12

      bg-gradient-to-b
      from-orange-500
      to-yellow-500

      rounded-full

      shadow-[0_0_15px_rgba(249,115,22,0.4)]
    "
          />

          {/* Title */}
          <h2
            className="
      text-xl md:text-2xl
      uppercase
      tracking-wider
      text-white
    "
          >
            Reviews
          </h2>
        </div>
        <div className="mx-4 flex flex-col items-center justify-center min-h-[320px] px-4 rounded-2xl border-2 border-dotted border-white/5 bg-zinc-900/30">
          <MessageCircleOff size={48} className="text-zinc-700 mb-3" />

          <h3 className="text-xl font-bold text-zinc-500 uppercase tracking-widest">
            No Reviews Yet
          </h3>

          <p className="text-sm text-zinc-600 text-center mt-1">
            Ratings and reviews will appear here once users submit them.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full mb-10">
      <div className="flex items-center gap-4 mb-6 px-2">
        {/* Left Orange Bar */}
        <div
          className="
      w-1 md:w-1.5
      h-10 md:h-12

      bg-gradient-to-b
      from-orange-500
      to-yellow-500

      rounded-full

      shadow-[0_0_15px_rgba(249,115,22,0.4)]
    "
        />

        {/* Title */}
        <h2
          className="
      text-xl md:text-2xl
      uppercase
      tracking-wider
      text-white
    "
        >
          Reviews
        </h2>
      </div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h3 className="text-base font-semibold text-zinc-200 tracking-tight">
            Reviews
          </h3>
          <span className="text-xs font-semibold text-orange-500 bg-orange-500/15 border border-orange-500/25 rounded-full px-2.5 py-px">
            {isLoading ? "—" : totalReviews}
          </span>
        </div>
        <div className="flex items-center gap-1.5 bg-orange-500/8 border border-orange-500/15 rounded-full px-3 py-1">
          <span className="text-sm font-bold text-orange-500">
            {isLoading ? "—" : avg}
          </span>
          <span className="text-xs text-zinc-500">avg / 10</span>
        </div>
      </div>

      <div
        className="flex flex-col gap-3 overflow-y-auto pr-1"
        style={{
          maxHeight: "520px",
          scrollbarWidth: "thin",
          scrollbarColor: "rgba(255,140,0,0.2) transparent",
        }}
      >
        {/* Skeleton */}
        {isLoading && [1, 2, 3].map((i) => <ReviewSkeleton key={i} />)}

        {/* Error */}
        {isError && (
          <div className="text-center py-12 text-zinc-600 text-sm">
            Failed to load reviews
          </div>
        )}

        {/* Empty */}
        {!isLoading && !isError && reviews.length === 0 && (
          <div className="text-center py-12 text-zinc-600 text-sm">
            No reviews yet
          </div>
        )}

        {/* Reviews */}
        {!isLoading && !isError && (
          <AnimatePresence>
            {reviews.map((r, i) => (
              <ReviewCard
                key={r.id}
                review={r}
                index={i}
                onDelete={handleDelete}
                onEdit={handleEdit}
                onAddReply={handleAddReply}
                onDeleteReply={handleDeleteReply}
                onEditReply={handleEditReply}
                onLike={(reviewId) => toggleReviewLikeMutation.mutate(reviewId)}
              />
            ))}
          </AnimatePresence>
        )}
      </div>
    </section>
  );
};

export default ReviewsCarousel;
