import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "../../context/SnackbarContext";
import api from "../api";

// ======================================================
// ✅ CHECK WATCH LATER STATUS
// ======================================================

export const useWatchLaterStatus = ({ newsId, enabled = true }) => {
  return useQuery({
    queryKey: ["watch-later-status", newsId],

    queryFn: async () => {
      const response = await api.get(`/auth/user/check-watch-later/${newsId}`);

      return response.data;
    },

    enabled: !!newsId && enabled,

    refetchOnWindowFocus: false,

    retry: false,
  });
};

// ======================================================
// ✅ TOGGLE WATCH LATER
// ======================================================

export const useToggleWatchLater = ({ newsId }) => {
  const queryClient = useQueryClient();

  const { showSnackbar } = useSnackbar();

  return useMutation({
    mutationFn: async () => {
      const response = await api.post("/auth/user/toggle-watch-later", {
        newsId,
      });

      return response.data;
    },

    // ==================================================
    // ✅ OPTIMISTIC UPDATE
    // ==================================================

    onMutate: async () => {
      await queryClient.cancelQueries({
        queryKey: ["watch-later-status", newsId],
      });

      const previousWatchLater = queryClient.getQueryData([
        "watch-later-status",
        newsId,
      ]);
      const previousHeroNews = queryClient.getQueryData(["hero-trending-news"]);

      const previousLatestNews = queryClient.getQueryData(["latest-news"]);

      const previousTrendingNews = queryClient.getQueryData(["trending-news"]);

      // ================================================
      // ✅ STATUS CACHE UPDATE
      // ================================================

      queryClient.setQueryData(["watch-later-status", newsId], (oldData) => ({
        ...(oldData || {}),
        inWatchLater: !oldData?.inWatchLater,
      }));

      // ================================================
      // ✅ HERO NEWS CACHE UPDATE
      // ================================================

      queryClient.setQueryData(["hero-trending-news"], (oldData) => {
        if (!oldData) {
          return oldData;
        }

        return oldData.map((item) =>
          item.id === newsId
            ? {
                ...item,
                isWatchLater: !item.isWatchLater,
              }
            : item,
        );
      });

      // ================================================
      // ✅ LATEST NEWS CACHE UPDATE
      // ================================================

      queryClient.setQueryData(["latest-news"], (oldData) => {
        if (!oldData) {
          return oldData;
        }

        return oldData.map((item) =>
          item.id === newsId
            ? {
                ...item,
                isWatchLater: !item.isWatchLater,
              }
            : item,
        );
      });

      // ================================================
      // ✅ TRENDING NEWS CACHE UPDATE
      // ================================================

      queryClient.setQueryData(["trending-news"], (oldData) => {
        if (!oldData) {
          return oldData;
        }

        return oldData.map((item) =>
          item.id === newsId
            ? {
                ...item,
                isWatchLater: !item.isWatchLater,
              }
            : item,
        );
      });

      return {
        previousWatchLater,
        previousHeroNews,
        previousLatestNews,
        previousTrendingNews,
      };
    },

    // ==================================================
    // ✅ ERROR ROLLBACK
    // ==================================================

    onError: (error, variables, context) => {
      queryClient.setQueryData(
        ["watch-later-status", newsId],
        context?.previousWatchLater,
      );

      queryClient.setQueryData(
        ["hero-trending-news"],
        context?.previousHeroNews,
      );

      queryClient.setQueryData(["latest-news"], context?.previousLatestNews);

      queryClient.setQueryData(
        ["trending-news"],
        context?.previousTrendingNews,
      );

      showSnackbar(
        error?.response?.data?.message || "Watch later update failed",
        "error",
      );
    },

    // ==================================================
    // ✅ SUCCESS
    // ==================================================

    onSuccess: (data) => {
      showSnackbar(data?.message || "Watch later updated", "success");
    },

    // ==================================================
    // ✅ FINAL REFRESH
    // ==================================================

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["watch-later-status", newsId],
      });

      queryClient.invalidateQueries({
        queryKey: ["user-watch-later"],
      });
    },
  });
};
