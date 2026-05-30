import { Star, Clapperboard, Trash2 } from "lucide-react";
import {
  useClearAllWatchlist,
  useRemoveWatchlist,
} from "../hooks/useWatchlist";
import { useState } from "react";
import ReusableConfirmDialog from "../Components/ReusableConfirmDialog";

const MovieCard = ({ movie, watchlistId }) => {
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  // ======================================================
  // ✅ DELETE WATCHLIST
  // ======================================================
  const removeWatchlistMutation = useRemoveWatchlist();

  // ======================================================
  // ✅ HANDLE DELETE
  // ======================================================
  const handleDelete = () => {
    removeWatchlistMutation.mutate(
      {
        watchlistId,
        movieId: movie?.id,
      },
      {
        onSuccess: () => {
          setOpenDeleteDialog(false);
        },
      },
    );
  };
  // ======================================================
  // ✅ HANDLE CLEAR
  // ======================================================

  const handleClearWatchlist = () => {
    clearWatchlistMutation.mutate(undefined, {
      onSuccess: () => {
        setOpenClearDialog(false);
      },
    });
  };

  return (
    <>
      <div
        className="
        group

        flex gap-2.5

        p-2.5

        rounded-[20px]

        bg-[#0f1014]

        border border-white/[0.05]

        hover:border-orange-500/20

        transition-all duration-300
      "
      >
        {/* ================================================== */}
        {/* ✅ THUMBNAIL */}
        {/* ================================================== */}

        <div
          className="
          relative

          w-[105px]
          h-[120px]

          rounded-[14px]

          overflow-hidden

          shrink-0
        "
        >
          {/* ============================================== */}
          {/* ✅ IMAGE */}
          {/* ============================================== */}

          <img
            src={movie?.trailerThumbnail}
            alt={movie?.title}
            className="
            w-full
            h-full

            object-cover
          "
          />

          {/* ============================================== */}
          {/* ✅ OVERLAY */}
          {/* ============================================== */}

          <div
            className="
            absolute inset-0

            bg-gradient-to-t
            from-black/90
            via-black/10
            to-transparent
          "
          />

          {/* ============================================== */}
          {/* ✅ RELEASE DATE / TBA */}
          {/* ============================================== */}

          <div
            className="
            absolute bottom-0 left-0 right-0

            h-[28px]

            flex items-center justify-center

            bg-black/90
            backdrop-blur-md

            text-white
            text-[11px]
            font-black
            tracking-wide
          "
          >
            {movie?.releaseDate || "TBA"}
          </div>
        </div>

        {/* ================================================== */}
        {/* ✅ CONTENT */}
        {/* ================================================== */}

        <div className="flex-1 min-w-0">
          {/* ============================================== */}
          {/* ✅ TOP */}
          {/* ============================================== */}

          <div className="flex items-start justify-between gap-2">
            {/* ============================================ */}
            {/* ✅ TITLE */}
            {/* ============================================ */}

            <div className="min-w-0">
              <h2
                className="
                text-[15px]
                font-black
                text-white

                truncate
              "
              >
                {movie?.title}
              </h2>
            </div>

            {/* ============================================ */}
            {/* ✅ IMDB */}
            {/* ============================================ */}

            <div
              className="
              flex items-center gap-1

              px-2 py-1

              rounded-[10px]

              border border-orange-500/20

              bg-[#111318]

              shrink-0
            "
            >
              <Star
                className="
                w-3 h-3

                fill-orange-400
                text-orange-400
              "
              />

              <span
                className="
                text-[12px]
                font-bold

                text-white
              "
              >
                {movie?.imdbRating || "0"}
              </span>
            </div>
          </div>

          {/* ============================================== */}
          {/* ✅ DETAILS */}
          {/* ============================================== */}

          <div className="mt-2 space-y-1">
            {/* ============================================ */}
            {/* ✅ DIRECTOR */}
            {/* ============================================ */}

            <p
              className="
              text-[11px]

              text-zinc-300

              truncate
            "
            >
              <span className="font-semibold text-zinc-400">Director :</span>{" "}
              {movie?.director || "Unknown"}
            </p>

            {/* ============================================ */}
            {/* ✅ CAST */}
            {/* ============================================ */}

            <p
              className="
              text-[11px]

              text-zinc-300

              truncate
            "
            >
              <span className="font-semibold text-zinc-400">Cast :</span>{" "}
              {movie?.cast || "N/A"}
            </p>

            {/* ============================================ */}
            {/* ✅ GENRES */}
            {/* ============================================ */}

            <p
              className="
              text-[11px]

              text-zinc-300

              truncate
            "
            >
              <span className="font-semibold text-zinc-400">Genres :</span>{" "}
              {movie?.genres || "N/A"}
            </p>
          </div>

          {/* ============================================== */}
          {/* ✅ BOTTOM */}
          {/* ============================================== */}

          <div className="flex items-end justify-end mt-3">
            {/* ============================================ */}
            {/* ✅ DELETE BUTTON */}
            {/* ============================================ */}

            <button
              onClick={() => setOpenDeleteDialog(true)}
              disabled={removeWatchlistMutation.isPending}
              className="
                w-8 h-8
                cursor-pointer
                rounded-[10px]

                flex items-center justify-center

                border border-red-500/20

                bg-[#111318]

                hover:bg-red-500/10

                transition-all duration-300
              "
            >
              {removeWatchlistMutation.isPending ? (
                <div
                  className="
                    w-3.5 h-3.5

                    rounded-full

                    border-[2px]
                    border-white/10
                    border-t-red-500
                    border-r-red-400

                    animate-spin
                  "
                />
              ) : (
                <Trash2
                  className="
                    w-4 h-4

                    text-red-400
                  "
                />
              )}
            </button>
          </div>
        </div>
      </div>
      {/* ================================================== */}
      {/* ✅ CONFIRM DELETE DIALOG */}
      {/* ================================================== */}
      <ReusableConfirmDialog
        open={openDeleteDialog}
        title="Remove Watchlist"
        description={`Are you sure you want to remove "${movie?.title}" from your watchlist?`}
        confirmText="Remove"
        cancelText="Cancel"
        confirmColor="red"
        loading={removeWatchlistMutation.isPending}
        onClose={() => setOpenDeleteDialog(false)}
        onConfirm={handleDelete}
      />
    </>
  );
};

export default MovieCard;
