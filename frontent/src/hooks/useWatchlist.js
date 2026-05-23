// ======================================================
// ✅ CHECK WATCHLIST STATUS

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../api";
import { useSnackbar } from "../../context/SnackbarContext";

// ======================================================
export const useWatchlistStatus = ({ movieId, enabled = true }) => {
  return useQuery({
    queryKey: ["watchlist-status", movieId],
    queryFn: async () => {
      const response = await api.get(`/auth/user/check-watchlist/${movieId}`);
      //   console.log("UseWatchStatus", response.data);
      return response.data;
    },
    enabled: !!movieId && enabled,
    refetchOnWindowFocus: false,
    retry: false,
  });
};

// ======================================================
// ✅ TOGGLE WATCHLIST
// ======================================================
export const useToggleWatchlist = ({ movieId }) => {
  const queryClient = useQueryClient();
  const { showSnackbar } = useSnackbar();
  return useMutation({
    mutationFn: async () => {
      const response = await api.post("/auth/user/toggle-watchlist", {
        movieId,
      });
      return response.data;
    },
    // ====================================================
    // ✅ OPTIMISTIC UPDATE
    // ====================================================
    onMutate: async () => {
      await queryClient.cancelQueries({
        queryKey: ["watchlist-status", movieId],
      });
      const previousWatchlist = queryClient.getQueryData([
        "watchlist-status",
        movieId,
      ]);
      queryClient.setQueryData(
        ["watchlist-status", movieId],

        (oldData) => {
          return {
            ...oldData,

            inWatchlist: !oldData?.inWatchlist,
          };
        },
      );
      return {
        previousWatchlist,
      };
    },
    // ====================================================
    // ✅ ERROR ROLLBACK
    // ====================================================
    onError: (error, variables, context) => {
      queryClient.setQueryData(
        ["watchlist-status", movieId],
        context?.previousWatchlist,
      );

      showSnackbar(
        error?.response?.data?.message || "Watchlist update failed",

        "error",
      );
    },
    // ====================================================
    // ✅ SUCCESS
    // ====================================================

    onSuccess: (data) => {
      showSnackbar(
        data?.message || "Watchlist updated",

        "success",
      );
    },

    // ====================================================
    // ✅ REFETCH
    // ====================================================

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["watchlist-status", movieId],
      });

      queryClient.invalidateQueries({
        queryKey: ["user-watchlist"],
      });
    },
  });
};
