import { useEffect } from "react";
import { useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import {
  useMutation,
  useQueries,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import api from "../api";

export const getVisitorId = () => {
  let visitorId = localStorage.getItem("movieDetailsVisitorId");
  if (!visitorId) {
    visitorId = uuidv4();
    localStorage.setItem("movieDetailsVisitorId", visitorId);
  }
  return visitorId;
};

export const createSessionId = () => {
  return uuidv4();
};

export const useMovieAnalytics = (movieId) => {
  const analyticsIdRef = useRef(null);
  const sessionIdRef = useRef(uuidv4());
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const queryClient = useQueryClient();

  const visitorIdRef = useRef(
    localStorage.getItem("movieDetailsVisitorId") || uuidv4(),
  );
  // ======================================
  // SAVE VISITOR ID
  // ======================================

  useEffect(() => {
    localStorage.setItem("movieDetailsVisitorId", visitorIdRef.current);
  }, []);

  // ======================================
  // START SESSION
  // ======================================
  const startSessionMutation = useMutation({
    mutationFn: async () => {
      const response = await api.post("/admin/movie-session/start", {
        movieId,
        sessionId: sessionIdRef.current,
        visitorId: visitorIdRef.current,
      });
      return response.data;
    },
    onSuccess: (data) => {
      analyticsIdRef.current = data.analyticsId;
      queryClient.invalidateQueries({
        queryKey: ["movieDetailsAnalytics", movieId],
      });
    },
    // onError: (error) => {
    //   console.log("OnError", error?.response?.data?.message);
    // },
  });

  // ======================================
  // END SESSION
  // ======================================
  const endSessionMutation = useMutation({
    mutationFn: async (analyticsId) => {
      if (!analyticsId) return;
      const response = await api.post("/admin/movie-session/end", {
        analyticsId,
      });
      return response.data;
    },
  });

  // ======================================
  // START ON PAGE OPEN
  // ======================================
  useEffect(() => {
    if (!movieId) return;
    startSessionMutation.mutate();
    return () => {
      if (analyticsIdRef.current) {
        endSessionMutation.mutate(analyticsIdRef.current);
      }
    };
  }, [movieId]);

  // ======================================
  // TAB CLOSE
  // ======================================
  useEffect(() => {
    const handleUnload = () => {
      if (!analyticsIdRef.current) return;

      const blob = new Blob(
        [
          JSON.stringify({
            analyticsId: analyticsIdRef.current,
          }),
        ],
        {
          type: "application/json",
        },
      );

      navigator.sendBeacon(`${API_BASE_URL}/admin/movie-session/end`, blob);
    };
    window.addEventListener("beforeunload", handleUnload);
    return () => {
      window.removeEventListener("beforeunload", handleUnload);
    };
  }, []);

  return {
    analyticsId: analyticsIdRef.current,
    isStarting: startSessionMutation.isPending,
    isEnding: endSessionMutation.isPending,
  };
};

export const useMovieDetailsAnalyticQuery = (movieId) => {
  return useQuery({
    queryKey: ["movieDetailsAnalytics", movieId],
    queryFn: async () => {
      const response = await api.get(`/admin/movie-analytics/${movieId}`);
      return response.data.data;
    },
    enabled: !!movieId,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    placeholderData: (previousData) => previousData,
  });
};

export const useMovieDetailsAvgRatingData = (movieId) => {
  const reviewsResponse = useQuery({
    queryKey: ["movie-reviews", movieId],
    queryFn: async () => {
      const response = await api.get(`/auth/user/movie-reviews/${movieId}`);
      return response.data;
    },
    enabled: !!movieId,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    retry: false,
  });
  const data = reviewsResponse?.data;
  const reviews = data?.data ?? [];

  const averageRating =
    data?.averageRating ||
    (reviews.length
      ? Number(
          (
            reviews.reduce(
              (sum, review) => sum + Number(review.rating || 0),
              0,
            ) / reviews.length
          ).toFixed(1),
        )
      : 0);
  return {
    reviews,
    averageRating,
    totalReviews: data?.totalReviews ?? reviews.length,
    currentUserReview: data?.currentUserReview || null,
    hasReviewed: data?.rated || false,
    isLoading: reviewsResponse.isLoading,
    isError: reviewsResponse.isError,
    reviewsResponse,
  };
};
