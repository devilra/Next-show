import React, { useState, useCallback } from "react";
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
import {
  Heart,
  MessageCircle,
  Reply,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

dayjs.extend(relativeTime);

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

  if (seconds < 60) return `${seconds} sec`;
  if (minutes < 60) return `${minutes} min`;
  if (hours < 24) return `${hours} hour`;
  if (days < 30) return `${days} day`;
  if (months < 12) return `${months} month`;
  return `${years} year`;
};
const isExternal = (src) =>
  src?.startsWith("http://") || src?.startsWith("https://");

// ── Avatar ────────────────────────────────────────────────
const Avatar = ({ user, size = "md" }) => {
  const [err, setErr] = useState(false);
  const src = user?.profileImage;
  const sz = size === "sm" ? "w-6 h-6 text-[10px]" : "w-11 h-11 text-sm";
  const border = size === "sm" ? "border" : "border-2";
  if (src && isExternal(src) && !err) {
    return (
      <img
        src={src}
        alt={user?.fullName || user?.name}
        onError={() => setErr(true)}
        className={`${sz} rounded-full object-cover ${border} border-orange-500/40 flex-shrink-0`}
      />
    );
  }
  return (
    <div
      className={`${sz} rounded-full flex-shrink-0 flex items-center justify-center font-bold text-white ${border} border-orange-500/40`}
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
    <div className="flex items-center gap-1 mt-1 flex-nowrap whitespace-nowrap">
      <div className="flex gap-px flex-shrink-0">
        {[1, 2, 3, 4, 5].map((i) => (
          <span
            key={i}
            className={`text-[13px] ${i <= filled ? "text-orange-500" : "text-zinc-700"}`}
          >
            ★
          </span>
        ))}
      </div>
      <span className="text-[11px] font-bold text-orange-500 bg-orange-500/10 rounded px-1.5 py-px ml-1 flex-shrink-0">
        {val.toFixed(1)}
      </span>
      <span className="text-[11px] text-zinc-600 flex-shrink-0">/ 10</span>
    </div>
  );
};

// ── DotsMenu ──────────────────────────────────────────────
import { useRef, useEffect } from "react";
import { MessageCircleOff } from "lucide-react";
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
      className="overflow-hidden mt-3 pl-3 border-l-2 border-orange-500/20"
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
  <div
    className="flex-shrink-0 bg-[#1a1a1f] border border-white/[0.08] rounded-2xl p-5 animate-pulse"
    style={{ width: "340px" }}
  >
    <div className="flex items-center gap-3 mb-4">
      <div className="w-11 h-11 rounded-full bg-white/10 flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-3 w-28 bg-white/10 rounded" />
        <div className="h-2.5 w-20 bg-white/10 rounded" />
      </div>
    </div>
    <div className="space-y-2 mt-3">
      <div className="h-3 w-full bg-white/10 rounded" />
      <div className="h-3 w-4/5 bg-white/10 rounded" />
      <div className="h-3 w-2/3 bg-white/10 rounded" />
    </div>
    <div className="flex gap-3 mt-4">
      <div className="h-2.5 w-8 bg-white/10 rounded" />
      <div className="h-2.5 w-8 bg-white/10 rounded" />
    </div>
  </div>
);

// ── ReplyItem ─────────────────────────────────────────────
const ReplyItem = ({
  reply,
  reviewId,
  onDelete,
  onEdit,
  onReplyLike,
  depth = 0,
}) => {
  const [editMode, setEditMode] = useState(false);
  const [showNestedInput, setShowNestedInput] = useState(false);
  const [showNestedReplies, setShowNestedReplies] = useState(false);
  const [nestedReplies, setNestedReplies] = useState(reply.replies ?? []);

  // ✅ FIX: Backend anupura dynamic 'isOwn' condition-a strict-ah dynamic key accurate validation-ku check pandroam
  const isOwn = reply.isOwn === true;
  const hasNested = nestedReplies.length > 0;

  const handleNestedSend = (text) => {
    const newReply = {
      id: "rp-" + Date.now(),
      reply: text,
      createdAt: new Date().toISOString(),
      isOwn: true, // Frontend optimistic reply entry strict check
      user: {
        fullName: "You",
        username: "you",
        profileImage: null,
      },
      replies: [],
      totalLikes: 0,
      isLiked: false,
    };
    setNestedReplies((prev) => [...prev, newReply]);
    setShowNestedInput(false);
    setShowNestedReplies(true);
  };

  const handleNestedDelete = (id) =>
    setNestedReplies((prev) => prev.filter((r) => r.id !== id));

  const handleNestedEdit = (id, txt) =>
    setNestedReplies((prev) =>
      prev.map((r) => (r.id === id ? { ...r, reply: txt } : r)),
    );

  // 🔵 ADD THIS CONSOLE: UI element text property dynamic verification trace
  // console.log(
  //   `3. RENDER REPLY - ID: ${reply.id} | isLiked: ${reply.isLiked} | Counts: ${reply.totalLikes}`,
  // );

  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -8 }}
      className="flex items-start gap-2"
    >
      <Avatar user={reply.user} size="sm" />
      <div className="flex-1 min-w-0">
        {/* Bubble */}
        <div className="bg-white/[0.03] border border-white/5 rounded-xl px-3 py-2 relative">
          {/* Name row */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1 min-w-0">
              <span className="text-[11px] font-semibold text-zinc-300 truncate">
                {reply.user?.fullName || reply.user?.name}
              </span>
              {reply.user?.username && (
                <span className="text-[10px] text-zinc-600 truncate">
                  @{reply.user.username}
                </span>
              )}
            </div>

            {/* ✅ SECURITY CHECK: Strictly own replies-ku mattum thaan 3dot Menu theriyum */}
            {isOwn && (
              <DotsMenu
                isOwn={isOwn}
                onEdit={() => setEditMode(true)}
                onDelete={() => onDelete(reply.id)}
              />
            )}
          </div>

          {/* Text */}
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

          {/* Time */}
          <p className="text-[10px] text-zinc-700 mt-1">
            {timeAgo(reply.createdAt)}
          </p>
        </div>

        {/* Action row: like · comment count · reply */}
        <div className="flex items-center gap-3 mt-1.5 px-1">
          {/* Like Button */}
          <motion.button
            whileTap={{ scale: 0.8 }}
            whileHover={{ scale: 1.1 }}
            onClick={() => onReplyLike(reply.id)} // ✅ பேரண்ட் கரூசல் மியூட்டேஷனை டைரக்டா ட்ரிகர் பண்ணும்
            className="relative flex items-center gap-1 text-[11px] transition-all"
          >
            <AnimatePresence>
              {reply.isLiked && ( // ✅ reply.isLiked செக் பண்ணுது
                <motion.span
                  initial={{ scale: 0, opacity: 1 }}
                  animate={{ scale: 2.2, opacity: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="absolute inset-0 rounded-full bg-red-500/40 blur-sm"
                />
              )}
            </AnimatePresence>
            <motion.div
              animate={reply.isLiked ? { scale: [1, 1.4, 1] } : {}}
              transition={{ duration: 0.35 }}
            >
              <Heart
                size={12}
                className={
                  reply.isLiked ? "fill-red-500 text-red-500" : "text-zinc-600"
                } // ✅ உன்னோட ப்ராப்ஸ் வேல்யூக்கு கலர் மாறும்
              />
            </motion.div>
            <span className={reply.isLiked ? "text-red-400" : "text-zinc-600"}>
              {reply.totalLikes || 0}{" "}
              {/* ✅ டேட்டாபேஸ் கவுண்ட் அப்படியே கரெக்டா காட்டும் */}
            </span>
          </motion.button>

          {/* Comment count */}
          <div className="flex items-center gap-1 text-zinc-600 text-[11px]">
            <MessageCircle size={12} />
            <span>{nestedReplies.length}</span>
          </div>

          {depth < 2 && !isOwn && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setShowNestedInput((p) => !p);
                if (!showNestedReplies && hasNested) setShowNestedReplies(true);
              }}
              className="flex items-center gap-1 text-[11px] text-zinc-600 hover:text-orange-500 transition-all"
            >
              <Reply size={12} />
              <span>Reply</span>
            </motion.button>
          )}
        </div>

        {/* View nested replies toggle */}
        {hasNested && (
          <button
            onClick={() => setShowNestedReplies((p) => !p)}
            className="flex items-center gap-1 text-[10px] text-orange-500/60 hover:text-orange-500 mt-1 px-1 transition-colors bg-transparent border-none cursor-pointer"
          >
            {showNestedReplies ? "Hide" : "View"} {nestedReplies.length}{" "}
            {nestedReplies.length === 1 ? "reply" : "replies"}
          </button>
        )}

        {/* Nested replies list */}
        <AnimatePresence>
          {showNestedReplies && hasNested && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden mt-2 pl-3 border-l-2 border-orange-500/10 flex flex-col gap-2"
            >
              <AnimatePresence>
                {nestedReplies.map((nr) => (
                  <ReplyItem
                    key={nr.id}
                    reply={nr}
                    reviewId={reviewId}
                    onDelete={handleNestedDelete}
                    onEdit={handleNestedEdit}
                    depth={depth + 1}
                  />
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Nested reply input */}
        <AnimatePresence>
          {showNestedInput && (
            <ReplyInput
              onSend={handleNestedSend}
              onCancel={() => setShowNestedInput(false)}
            />
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

// ── ReviewCard (horizontal carousel card) ─────────────────
const ReviewCard = ({
  review,
  index,
  onDelete,
  onEdit,
  onAddReply,
  onDeleteReply,
  onEditReply,
  onLike,
  movieId,
  onReplyLike,
}) => {
  // console.log("Review", review);
  const [showReplies, setShowReplies] = useState(false);
  const [showInput, setShowInput] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const cardRef = useRef(null); // Ref object inga இருக்கு
  const isOwn = review.isOwn;
  const replyList = review.reviewReplies ?? review.replies ?? [];
  const hasReplies = replyList.length > 0;
  const queryClient = useQueryClient();

  // Scroll card to bottom smoothly whenever replies or input open
  const scrollCardToBottom = useCallback(() => {
    setTimeout(() => {
      if (cardRef.current) {
        cardRef.current.scrollTo({
          top: cardRef.current.scrollHeight,
          behavior: "smooth",
        });
      }
    }, 100); // 50ms la irunthu 100ms ah mathirkken focus breakdown aagama iruka
  }, []);

  const addReviewReplyMutation = useMutation({
    mutationFn: async ({ reviewId, reply }) => {
      const response = await api.post("/auth/user/add-review-reply", {
        reviewId,
        reply,
      });
      return response.data; // Server la irunthu { success, message, data: { ... } } varum
    },

    onMutate: async ({ reviewId, reply }) => {
      await queryClient.cancelQueries({
        queryKey: ["movie-reviews", movieId],
      });

      const previousReviews = queryClient.getQueryData([
        "movie-reviews",
        "movie-reviews",
        movieId,
      ]);

      const tempId = `temp-${Date.now()}`;

      queryClient.setQueryData(["movie-reviews", movieId], (oldData) => {
        if (!oldData?.data) return oldData;

        return {
          ...oldData,
          data: oldData.data.map((r) => {
            if (r.id !== reviewId) return r;

            // Database la oru sela idathula reviewReplies illa na empty array handle pannikiriom
            const replies = r.reviewReplies ?? [];

            return {
              ...r,
              totalReplies: Number(r.totalReplies || 0) + 1,
              reviewReplies: [
                ...replies,
                {
                  id: tempId,
                  reply,
                  createdAt: new Date().toISOString(),
                  isOwn: true,
                  pending: true,
                  user: {
                    fullName: "Kali", // Direct ah 'You' nu podama Kali name setup pannuna matching crash aagadhu
                    username: "rockstar",
                  },
                },
              ],
            };
          }),
        };
      });

      return {
        previousReviews,
        tempId,
        reviewId,
      };
    },

    onSuccess: (response, variables, context) => {
      queryClient.setQueryData(["movie-reviews", movieId], (oldData) => {
        if (!oldData?.data) return oldData;

        return {
          ...oldData,
          data: oldData.data.map((r) => {
            if (r.id !== context.reviewId) return r;

            return {
              ...r,
              // Backend nested validation response object format correct ah trace panniyachu
              reviewReplies: (r.reviewReplies || []).map((reply) =>
                reply.id === context.tempId
                  ? {
                      ...reply,
                      id: response.data.id, // Axial layer nested mapping object -> response.data.data.id thaan correct format!
                      pending: false,
                      user: {
                        id: response.data.userId,
                        fullName:
                          response.data.user?.fullName || reply.user?.fullName,
                        username:
                          response.data.user?.username || reply.user?.username,
                        profileImage: response.data.user?.profileImage,
                      },
                    }
                  : reply,
              ),
            };
          }),
        };
      });

      // Cache auto invalidation setup - optional clean fresh sync kaga mathi vachirukaen
      queryClient.invalidateQueries({ queryKey: ["movie-reviews", movieId] });
    },

    onError: (error, variables, context) => {
      if (context?.previousReviews) {
        queryClient.setQueryData(
          ["movie-reviews", movieId],
          context.previousReviews,
        );
      }

      showSnackbar(
        error?.response?.data?.message || "Failed to add reply",
        "error",
      );
    },
  });

  const handleReply = (text) => {
    addReviewReplyMutation.mutate({
      reviewId: review.id,
      reply: text,
    });
    setShowInput(false);
    setShowReplies(true);
    scrollCardToBottom();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ delay: index * 0.06, duration: 0.32, ease: "easeOut" }}
      className="flex-shrink-0 relative h-[250px]" // Dynamic scale kaaga parent-ku height ethirkken
      style={{ width: "340px" }}
    >
      {/* Card Container */}
      <div
        ref={cardRef} // Comment out panni erunthatha un-comment panniyachu!
        className="
          flex flex-col
          bg-[#17171c]
          border border-white/[0.08]
          hover:border-orange-500/25
          rounded-2xl
          p-5
          transition-all duration-200
          hover:bg-[#1c1c22]
          group
          overflow-y-auto
          select-text
        "
        style={{
          boxShadow: "0 4px 24px rgba(0,0,0,0.35)",
          height: "100%", // Parent h-[320px] ah full ah edthukum
          scrollbarWidth: "thin",
          scrollbarColor: "rgba(255,140,0,0.35) transparent", // Visibility theriya alpha opacity-a ethirkken
        }}
      >
        {/* Header: avatar + name + dots */}
        <div className="flex items-start gap-3 mb-3 flex-shrink-0">
          <Avatar user={review.reviewUser} />
          <div className="flex-1 min-w-0 overflow-hidden">
            <div className="flex items-center gap-1.5 flex-nowrap min-w-0">
              <span className="text-sm font-semibold text-zinc-100 leading-tight truncate max-w-[140px]">
                {review.reviewUser?.fullName}
              </span>
              {review.reviewUser?.username && (
                <span className="text-[11px] text-zinc-600 truncate max-w-[90px] flex-shrink-0">
                  @{review.reviewUser.username}
                </span>
              )}
            </div>
            {review.isVerifiedViewer && (
              <span className="inline-block text-[10px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded px-1.5 py-px mt-0.5">
                ✓ Verified
              </span>
            )}
            <StarRating rating={review.rating} />
          </div>
          <div className="flex items-center gap-1 flex-shrink-0">
            <span className="text-[11px] text-zinc-600 whitespace-nowrap">
              {timeAgo(review.createdAt)}
            </span>
            {isOwn && (
              <DotsMenu
                isOwn={true}
                onEdit={() => setEditMode(true)}
                onDelete={() => onDelete(review.id)}
              />
            )}
          </div>
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-white/[0.05] mb-3 flex-shrink-0" />

        {/* Review text */}
        <div className="mb-1 flex-shrink-0">
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
        </div>

        {/* Footer: like / comment / reply / view-replies */}
        <div className="mt-auto pt-3 border-t border-white/[0.05] flex-shrink-0">
          <div className="flex items-center gap-4">
            {/* Like */}
            <motion.button
              whileTap={{ scale: 0.8 }}
              whileHover={{ scale: 1.08 }}
              onClick={() => onLike(review.id)}
              className="relative flex items-center gap-1.5 text-[12px] transition-all"
            >
              <AnimatePresence>
                {review.isLiked && (
                  <motion.span
                    initial={{ scale: 0, opacity: 1 }}
                    animate={{ scale: 2.5, opacity: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.6 }}
                    className="absolute inset-0 rounded-full bg-red-500/40 blur-md"
                  />
                )}
              </AnimatePresence>
              <motion.div
                animate={review.isLiked ? { scale: [1, 1.4, 1] } : {}}
                transition={{ duration: 0.4 }}
              >
                <Heart
                  size={15}
                  className={
                    review.isLiked
                      ? "fill-red-500 text-red-500"
                      : "text-zinc-500"
                  }
                />
              </motion.div>
              <span
                className={review.isLiked ? "text-red-400" : "text-zinc-500"}
              >
                {review.totalLikes}
              </span>
            </motion.button>

            {/* Comment count */}
            <div className="flex items-center gap-1.5 text-zinc-500 text-[12px]">
              <MessageCircle size={14} className="text-zinc-500" />
              <span>{review.totalReplies}</span>
            </div>

            {/* Spoiler badge */}
            {review.containsSpoiler && (
              <span className="text-[10px] text-red-400 bg-red-500/10 border border-red-500/20 rounded px-2 py-px">
                Spoiler
              </span>
            )}

            {/* ✅ CONDITION UPDATED DYNAMICALLY: Ennoda own review card ah irundha reply button inge show aagathu */}
            {!isOwn && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setShowInput((p) => {
                    if (!p) scrollCardToBottom();
                    return !p;
                  });
                  if (!showReplies && hasReplies) {
                    setShowReplies(true);
                    scrollCardToBottom();
                  }
                }}
                className="flex items-center gap-1.5 text-[12px] text-zinc-500 hover:text-orange-500 transition-all ml-auto"
              >
                <Reply size={14} />
                <span>Reply</span>
              </motion.button>
            )}
          </div>

          {/* View replies toggle */}
          {hasReplies && (
            <button
              onClick={() => {
                setShowReplies((p) => {
                  if (!p) scrollCardToBottom();
                  return !p;
                });
              }}
              className="flex items-center gap-1 text-[11px] text-orange-500/70 hover:text-orange-500 mt-2 transition-colors bg-transparent border-none cursor-pointer"
            >
              ↳ {showReplies ? "Hide" : "View"} {replyList.length}{" "}
              {replyList.length === 1 ? "reply" : "replies"}
            </button>
          )}
        </div>

        {/* Replies list container - overflow scroll ku ithan mukhiyam */}
        <div className="flex-grow">
          <AnimatePresence>
            {showReplies && hasReplies && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.22 }}
                className="mt-3 pl-3 border-l-2 border-orange-500/10 flex flex-col gap-2"
              >
                <AnimatePresence>
                  {replyList.map((rp) => (
                    <ReplyItem
                      key={rp.id}
                      reply={rp}
                      reviewId={review.id}
                      onDelete={(rpId) => onDeleteReply(review.id, rpId)}
                      onEdit={(rpId, txt) => onEditReply(review.id, rpId, txt)}
                      onReplyLike={(replyId) => onReplyLike(review.id, replyId)}
                    />
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Reply input */}
          <AnimatePresence>
            {showInput && (
              <ReplyInput
                onSend={handleReply}
                onCancel={() => setShowInput(false)}
              />
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

// ── ReviewsCarousel (main export) ─────────────────────────
const ReviewsCarousel = ({ movieId }) => {
  const queryClient = useQueryClient();
  const { showSnackbar } = useSnackbar();

  // Carousel refs & state
  const trackRef = useRef(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  // Mouse drag scroll
  const onMouseDown = useCallback((e) => {
    isDragging.current = true;
    startX.current = e.pageX - trackRef.current.offsetLeft;
    scrollLeft.current = trackRef.current.scrollLeft;
    trackRef.current.style.cursor = "grabbing";
  }, []);
  const onMouseLeave = useCallback(() => {
    isDragging.current = false;
    if (trackRef.current) trackRef.current.style.cursor = "grab";
  }, []);
  const onMouseUp = useCallback(() => {
    isDragging.current = false;
    if (trackRef.current) trackRef.current.style.cursor = "grab";
  }, []);
  const onMouseMove = useCallback((e) => {
    if (!isDragging.current) return;
    e.preventDefault();
    const x = e.pageX - trackRef.current.offsetLeft;
    const walk = (x - startX.current) * 1.2;
    trackRef.current.scrollLeft = scrollLeft.current - walk;
  }, []);

  const scrollByCard = (dir) => {
    if (!trackRef.current) return;
    trackRef.current.scrollBy({ left: dir * 356, behavior: "smooth" });
  };

  // ── Fetch reviews ──────────────────────────────────────
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

  // ── ReviewsCarousel Component kulla (Line 475 approx) ─────────────────
  const toggleReplyLikeMutation = useMutation({
    mutationFn: async ({ replyId }) => {
      const response = await api.post("/auth/user/toggle-reply-like", {
        replyId,
      });
      return response.data;
    },
    // ✅ FIX 1: Explicit object structure variable handling-a destructured payload structure-ku mathiyachu
    onMutate: async ({ reviewId, replyId }) => {
      // 🔵 ADD THIS CONSOLE: Click handle trigger trace
      // console.log(
      //   "1. MUTATION TRIGGERED - Parent Review ID:",
      //   reviewId,
      //   " | Targeting Reply ID:",
      //   replyId,
      // );
      await queryClient.cancelQueries({ queryKey: ["movie-reviews", movieId] });
      const previousReviews = queryClient.getQueryData([
        "movie-reviews",
        movieId,
      ]);

      queryClient.setQueryData(["movie-reviews", movieId], (oldData) => {
        if (!oldData?.data) return oldData;
        return {
          ...oldData,
          data: oldData.data.map((review) => {
            // ✅ Ippo reviewId perfect-ah track data sequence reference kooda single-hit sync aagum!
            if (review.id !== reviewId) return review;
            return {
              ...review,
              reviewReplies: (review.reviewReplies || []).map((reply) => {
                if (reply.id !== replyId) return reply;
                const currentLiked = reply.isLiked === true;
                // 🔵 ADD THIS CONSOLE: Optimistic loop variable update analytics
                // console.log(
                //   "2. CACHE SNAPSHOT BEFORE UPDATE -> isLiked:",
                //   reply.isLiked,
                //   " | totalLikes:",
                //   reply.totalLikes,
                // );
                return {
                  ...reply,
                  isLiked: !currentLiked,
                  totalLikes: currentLiked
                    ? Math.max(0, Number(reply.totalLikes || 0) - 1)
                    : Number(reply.totalLikes || 0) + 1,
                };
              }),
            };
          }),
        };
      });
      return { previousReviews };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["movie-reviews", movieId] });
    },
    onError: (error, variables, context) => {
      if (context?.previousReviews) {
        queryClient.setQueryData(
          ["movie-reviews", movieId],
          context.previousReviews,
        );
      }
      showSnackbar("Failed to update reply like", "error");
    },
  });

  const toggleReviewLikeMutation = useMutation({
    mutationFn: async (reviewId) => {
      const response = await api.post("/auth/user/toggle-review-like", {
        reviewId,
      });
      console.log(response.data);
      return response.data;
    },
    onMutate: async (reviewId) => {
      await queryClient.cancelQueries({ queryKey: ["movie-reviews", movieId] });
      const previousReviews = queryClient.getQueryData([
        "movie-reviews",
        movieId,
      ]);
      queryClient.setQueryData(["movie-reviews", movieId], (oldData) => {
        if (!oldData?.data) return oldData;
        return {
          ...oldData,
          data: oldData.data.map((review) => {
            if (review.id !== reviewId) return review;
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
      return { previousReviews };
    },
    onSuccess: async (response, reviewId) => {
      queryClient.setQueryData(["movie-reviews", movieId], (oldData) => {
        if (!oldData?.data) return oldData;
        return {
          ...oldData,
          data: oldData.data.map((review) => {
            if (review.id !== reviewId) return review;
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

  const currentUserReview = userReviewResponse?.data?.data || null;
  const hasReviewed = userReviewResponse?.data?.rated || false;

  const avg =
    averageRating ||
    (reviews.length
      ? (
          reviews.reduce((s, r) => s + parseFloat(r.rating), 0) / reviews.length
        ).toFixed(1)
      : "—");

  // ── local optimistic helpers ──────────────────────────
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
      prev.map((r) => {
        if (r.id !== reviewId) return r;
        const existing = r.reviewReplies ?? r.replies ?? [];
        return {
          ...r,
          totalReplies: existing.length + 1,
          reviewReplies: [
            ...existing,
            {
              id: "rp-" + Date.now(),
              reply: text,
              createdAt: new Date().toISOString(),
              user: {
                id: ME_ID,
                fullName: "Kali",
                username: "rockstar",
                profileImage: null,
              },
            },
          ],
        };
      }),
    );

  const handleDeleteReply = (reviewId, replyId) =>
    updateReviews((prev) =>
      prev.map((r) => {
        if (r.id !== reviewId) return r;
        const existing = r.reviewReplies ?? r.replies ?? [];
        const updated = existing.filter((rp) => rp.id !== replyId);
        return { ...r, reviewReplies: updated, totalReplies: updated.length };
      }),
    );

  const handleEditReply = (reviewId, replyId, txt) =>
    updateReviews((prev) =>
      prev.map((r) => {
        if (r.id !== reviewId) return r;
        const existing = r.reviewReplies ?? r.replies ?? [];
        return {
          ...r,
          reviewReplies: existing.map((rp) =>
            rp.id === replyId ? { ...rp, reply: txt } : rp,
          ),
        };
      }),
    );

  // ── Section header (shared) ────────────────────────────
  const SectionHeader = () => (
    <div className="flex items-center justify-between mb-5 px-1">
      {/* Left: accent bar + title + count badge */}
      <div className="flex items-center gap-4">
        <div
          className="w-1 md:w-1.5 h-10 md:h-12 rounded-full shadow-[0_0_15px_rgba(249,115,22,0.4)]"
          style={{ background: "linear-gradient(to bottom, #f97316, #eab308)" }}
        />
        <div className="flex items-center gap-2">
          <h2 className="text-xl md:text-2xl uppercase tracking-wider text-white">
            Reviews
          </h2>
          {!isLoading && totalReviews > 0 && (
            <span className="text-xs font-semibold text-orange-500 bg-orange-500/15 border border-orange-500/25 rounded-full px-2.5 py-px">
              {totalReviews}
            </span>
          )}
        </div>
      </div>

      {/* Right: avg rating pill (hidden while loading or no data) */}
      {!isLoading && reviews.length > 0 && avg !== "—" && (
        <div className="flex items-center gap-1 bg-orange-500/8 border border-orange-500/15 rounded-full px-3 py-1">
          <span className="text-sm font-bold text-orange-500">{avg}</span>
          <span className="text-xs text-zinc-500">avg / 10</span>
        </div>
      )}
    </div>
  );

  // ── No reviews state ───────────────────────────────────
  if (noReviews) {
    return (
      <section className="w-full mb-10">
        <SectionHeader />
        <div className="mx-2 flex flex-col items-center justify-center min-h-[220px] px-4 rounded-2xl border-2 border-dotted border-white/5 bg-zinc-900/30">
          <MessageCircleOff size={40} className="text-zinc-700 mb-3" />
          <h3 className="text-lg font-bold text-zinc-500 uppercase tracking-widest">
            No Reviews Yet
          </h3>
          <p className="text-sm text-zinc-600 text-center mt-1">
            Ratings and reviews will appear here once users submit them.
          </p>
        </div>
      </section>
    );
  }

  // ── Main carousel ──────────────────────────────────────
  return (
    <section className="w-full mb-10">
      <SectionHeader />

      {/* Track */}
      <div
        ref={trackRef}
        // onMouseDown={onMouseDown}
        // onMouseLeave={onMouseLeave}
        // onMouseUp={onMouseUp}
        // onMouseMove={onMouseMove}
        className="
          flex gap-4
          overflow-x-auto
          pb-4
          select-none
        "
        style={{
          scrollSnapType: "x mandatory",
          WebkitOverflowScrolling: "touch",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          // cursor: "grab",
          /* hide scrollbar in webkit */
        }}
      >
        <style>{`
          div[data-carousel-track]::-webkit-scrollbar { display: none; }
        `}</style>

        {/* Skeleton */}
        {isLoading &&
          [1, 2, 3].map((i) => (
            <div key={i} style={{ scrollSnapAlign: "start" }}>
              <ReviewSkeleton />
            </div>
          ))}

        {/* Error */}
        {isError && (
          <div className="text-center py-12 text-zinc-600 text-sm w-full">
            Failed to load reviews
          </div>
        )}

        {/* Cards */}
        {!isLoading && !isError && (
          <AnimatePresence>
            {reviews.map((r, i) => (
              <div
                key={r.id}
                style={{
                  scrollSnapAlign: "start",
                  /* first/last card padding so edges don't get clipped */
                  paddingLeft: i === 0 ? "2px" : 0,
                  paddingRight: i === reviews.length - 1 ? "2px" : 0,
                }}
              >
                <ReviewCard
                  review={r}
                  movieId={movieId}
                  index={i}
                  onDelete={handleDelete}
                  onEdit={handleEdit}
                  onAddReply={handleAddReply}
                  onDeleteReply={handleDeleteReply}
                  onEditReply={handleEditReply}
                  onLike={(reviewId) =>
                    toggleReviewLikeMutation.mutate(reviewId)
                  }
                  // ✅ FIX 2: Dynamic props function definition key parameters logic handler brackets locked inside unique object payload!
                  onReplyLike={(reviewId, replyId) =>
                    toggleReplyLikeMutation.mutate({ reviewId, replyId })
                  }
                />
              </div>
            ))}
          </AnimatePresence>
        )}
      </div>

      {/* Mobile swipe hint dots */}
      {!isLoading && !isError && reviews.length > 1 && (
        <div className="flex justify-center gap-1.5 mt-1 md:hidden">
          {reviews.slice(0, Math.min(reviews.length, 7)).map((_, i) => (
            <div key={i} className="w-1.5 h-1.5 rounded-full bg-zinc-700" />
          ))}
        </div>
      )}
    </section>
  );
};

export default ReviewsCarousel;
