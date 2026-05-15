import React from "react";
import NewsDetailsHero from "./NewsDetailsHero";
import { useParams } from "react-router-dom";
import { useQueries } from "@tanstack/react-query";
import api from "../../api";
import LoadingComponents from "../../Components/LoadingComponents";

const NewsDetails = () => {
  // ======================================================
  // ✅ GET SLUG
  // ======================================================
  const { slug } = useParams();
  // ======================================================
  // ✅ PARALLEL API CALLS
  // ======================================================
  const results = useQueries({
    queries: [
      {
        queryKey: ["news-details", slug],
        queryFn: async () => {
          const response = await api.get(`/admin/get-news-details/${slug}`);
          // console.log("NEWS DETAILS", response.data.data);
          return response.data.data;
        },
        enabled: !!slug,

        staleTime: 1000 * 60 * 5,

        refetchOnWindowFocus: false,

        retry: false,
      },
      // ======================================================
      // ✅ RELATED NEWS
      // ======================================================
      {
        queryKey: ["related-news", slug],

        queryFn: async () => {
          const response = await api.get(`/admin/related-news/${slug}`);

          console.log("RELATED NEWS", response.data.data);

          return response.data.data;
        },

        enabled: !!slug,

        staleTime: 1000 * 60 * 5,

        refetchOnWindowFocus: false,

        retry: false,
      },
      // ======================================================
      // ✅ TRENDING NEWS
      // ======================================================
      //    {
      //   queryKey: ["details-trending-news"],

      //   queryFn: async () => {
      //     const response = await api.get(
      //       `/admin/trending-news`,
      //     );

      //     console.log("TRENDING NEWS", response.data.data);

      //     return response.data.data;
      //   },

      //   staleTime: 1000 * 60 * 5,

      //   refetchOnWindowFocus: false,

      //   retry: false,
      // },
    ],
  });

  // ======================================================
  // ✅ RESPONSES
  // ======================================================

  const newsDetailsResponse = results[0];

  const relatedNewsResponse = results[1];

  // const trendingNewsResponse = results[2];

  // ======================================================
  // ✅ FIRST PAGE LOADING
  // ======================================================

  const allLoading = results.every((query) => query.isLoading);

  if (allLoading) {
    return <LoadingComponents />;
  }

  return (
    <div>
      <NewsDetailsHero
        newsDetails={newsDetailsResponse?.data || {}}
        relatedNews={relatedNewsResponse?.data || []}
        // trendingNews={trendingNewsResponse?.data || []}
        isError={newsDetailsResponse?.isError}
        error={newsDetailsResponse?.error}
        isLoading={newsDetailsResponse?.isLoading}
        refetch={newsDetailsResponse?.refetch}
        // ============================================
        // ✅ RELATED API
        // ============================================

        relatedLoading={relatedNewsResponse?.isLoading}
        relatedError={relatedNewsResponse?.isError}
        relatedErrorData={relatedNewsResponse?.error}
        relatedRefetch={relatedNewsResponse?.refetch}
      />

      {/* ====================================================== */}
      {/* ✅ NEXT COMPONENTS */}
      {/* ====================================================== */}

      {/* <RelatedNews /> */}
      {/* <Comments /> */}
      {/* <RecommendedNews /> */}
      {/* <NewsTags /> */}
    </div>
  );
};

export default NewsDetails;
