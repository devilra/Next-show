// ======================================================
// ✅ WATCHLIST PAGE
// ======================================================

import { useQuery } from "@tanstack/react-query";
import axios from "axios";

import { BookmarkX, Trash2 } from "lucide-react";

import MovieCard from "./MovieCard";
import api from "../api";
import { useState } from "react";
import { useClearAllWatchlist } from "../hooks/useWatchlist";
import ReusableConfirmDialog from "../Components/ReusableConfirmDialog";

// ======================================================
// ✅ GET USER WATCHLIST API
// ======================================================

const getUserWatchlist = async () => {
  const response = await api.get(`/auth/user/get-user-watchlist`, {
    withCredentials: true,
  });

  return response.data;
};

const WatchlistPage = () => {
  const [openClearDialog, setOpenClearDialog] = useState(false);

  // ======================================================
  // ✅ CLEAR WATCHLIST
  // ======================================================

  const clearWatchlistMutation = useClearAllWatchlist();

  // ======================================================
  // ✅ WATCHLIST QUERY
  // ======================================================

  const {
    data: watchlistData,

    isLoading,

    isError,
  } = useQuery({
    queryKey: ["user-watchlist"],

    queryFn: getUserWatchlist,

    staleTime: 1000 * 60 * 5,
  });

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

  // ======================================================
  // ✅ LOADING
  // ======================================================

  if (isLoading) {
    return (
      <div
        className="
          min-h-[60vh]

          flex items-center justify-center
        "
      >
        {/* ============================================ */}
        {/* ✅ JELLY SPINNER */}
        {/* ============================================ */}

        <div
          className="
            w-10 h-10

            rounded-full

            border-[2px]
            border-white/10
            border-t-red-500
            border-r-red-400

            animate-spin

            motion-safe:animate-[spin_0.7s_linear_infinite]

            shadow-[0_0_12px_rgba(239,68,68,0.45)]
          "
          style={{
            animation:
              "spin 0.7s linear infinite, jelly 1.2s ease-in-out infinite",
          }}
        />
      </div>
    );
  }

  // ======================================================
  // ✅ ERROR
  // ======================================================

  if (isError) {
    return (
      <div
        className="
          min-h-[60vh]

          flex items-center justify-center

          text-sm
          text-red-400
        "
      >
        Failed to load watchlist
      </div>
    );
  }

  // ======================================================
  // ✅ WATCHLIST DATA
  // ======================================================

  const watchlist = watchlistData?.data || [];

  return (
    <>
      <div className="space-y-6 animate-fade-in">
        {/* ================================================== */}
        {/* ✅ HEADER */}
        {/* ================================================== */}

        <div className="flex items-start justify-between gap-4">
          {/* ============================================== */}
          {/* ✅ LEFT */}
          {/* ============================================== */}

          <div>
            <h1 className="text-lg font-bold text-white">My Watchlist</h1>

            <p className="text-xs text-zinc-600 mt-0.5">
              {watchlist.length} films saved
            </p>
          </div>

          {/* ============================================== */}
          {/* ✅ CLEAR BUTTON */}
          {/* ============================================== */}

          {watchlist.length > 0 && (
            <button
              onClick={() => setOpenClearDialog(true)}
              disabled={clearWatchlistMutation.isPending}
              className="
        h-10
        cursor-pointer
        px-4

        rounded-xl

        flex items-center gap-2

        border border-red-500/20

        bg-red-500/10

        hover:bg-red-500/15

        transition-all duration-300
      "
            >
              {clearWatchlistMutation.isPending ? (
                <div
                  className="
            w-4 h-4

            rounded-full

            border-[2px]
            border-white/10
            border-t-red-500
            border-r-red-400

            animate-spin
          "
                />
              ) : (
                <>
                  <Trash2
                    className="
              w-4 h-4

              text-red-400
            "
                  />

                  <span
                    className="
              text-[13px]
              font-semibold

              text-red-400
            "
                  >
                    Clear Watchlist
                  </span>
                </>
              )}
            </button>
          )}
        </div>

        {/* ================================================== */}
        {/* ✅ EMPTY UI */}
        {/* ================================================== */}

        {watchlist.length === 0 ? (
          <div
            className="
            min-h-[55vh]

            flex flex-col
            items-center
            justify-center

            rounded-[28px]

            border border-white/[0.04]

            bg-white/[0.02]
          "
          >
            {/* ============================================ */}
            {/* ✅ ICON */}
            {/* ============================================ */}

            <div
              className="
              w-16 h-16

              rounded-full

              flex items-center justify-center

              bg-orange-500/10

              border border-orange-500/20
            "
            >
              <BookmarkX
                className="
                w-8 h-8

                text-orange-400
              "
              />
            </div>

            {/* ============================================ */}
            {/* ✅ TEXT */}
            {/* ============================================ */}

            <h2
              className="
              mt-5

              text-white
              text-lg
              font-bold
            "
            >
              No Watchlist
            </h2>

            <p
              className="
              mt-1

              text-sm
              text-zinc-500
            "
            >
              Your saved movies will appear here
            </p>
          </div>
        ) : (
          // ==================================================
          // ✅ WATCHLIST GRID
          // ==================================================

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {watchlist.map((item) => (
              <MovieCard
                key={item.id}
                movie={item.movie}
                watchlistId={item.id}
              />
            ))}
          </div>
        )}
      </div>
      {/* ================================================== */}
      {/* ✅ CLEAR WATCHLIST DIALOG */}
      {/* ================================================== */}

      <ReusableConfirmDialog
        open={openClearDialog}
        title="Clear Watchlist"
        description="Are you sure you want to remove all movies from your watchlist?"
        confirmText="Clear All"
        cancelText="Cancel"
        confirmColor="red"
        loading={clearWatchlistMutation.isPending}
        onClose={() => setOpenClearDialog(false)}
        onConfirm={handleClearWatchlist}
      />
    </>
  );
};

export default WatchlistPage;
