// MovieDetailPage.jsx — Example integration

import ReviewsCarousel from "./ReviewsCarousel";

// ─── Mock data matching your exact API response shape ───────────────────────

const reviewsApiResponse = {
  success: true,
  averageRating: "7.7",
  totalReviews: 3,
  data: [
    {
      id: "700971af-d5ed-4fff-918e-49a1d4cb75ed",
      userId: "e4ea529c-cbcd-4eaa-8c5c-c364e380f6c3",
      movieId: 75,
      rating: "10.0",
      review: "All time BlockBuster",
      containsSpoiler: false,
      reviewStatus: "PUBLISHED",
      totalLikes: 0,
      totalReplies: 0,
      createdAt: "2026-06-01T06:33:45.000Z",
      updatedAt: "2026-06-01T06:33:45.000Z",
      reviewUser: {
        id: "e4ea529c-cbcd-4eaa-8c5c-c364e380f6c3",
        fullName: "Help Desk",
        username: null,
        profileImage:
          "https://lh3.googleusercontent.com/a/ACg8ocJotrDrbH1I6HCGcZ0YGBVoG2uIWLZRWr_jkSjIJm9zsx3uvA=s96-c",
      },
    },
    {
      id: "26cd720c-cf89-46b1-a0cb-5f85720e7b47",
      userId: "e2f8b41a-4323-4fd7-8201-8fb528d02ea5",
      movieId: 75,
      rating: "8.0",
      review: "Movie is awesome",
      containsSpoiler: false,
      reviewStatus: "PUBLISHED",
      totalLikes: 1,
      totalReplies: 0,
      createdAt: "2026-06-01T06:00:22.000Z",
      updatedAt: "2026-06-01T06:13:15.000Z",
      reviewUser: {
        id: "e2f8b41a-4323-4fd7-8201-8fb528d02ea5",
        fullName: "Jk Raja",
        username: "rockstarraj",
        profileImage: null,
      },
    },
    {
      id: "40fabe5b-f2b4-4367-add6-5b873d5d3dbf",
      userId: "74fb0e29-ce8f-4f0d-9334-37e1ce38b1f1",
      movieId: 75,
      rating: "5.0",
      review: "Updated Super Review",
      containsSpoiler: false,
      reviewStatus: "PUBLISHED",
      totalLikes: 1,
      totalReplies: 2,
      createdAt: "2026-05-21T12:55:49.000Z",
      updatedAt: "2026-06-01T07:23:05.000Z",
      reviewUser: {
        id: "74fb0e29-ce8f-4f0d-9334-37e1ce38b1f1",
        fullName: "Kali",
        username: "rockstar",
        profileImage: null,
      },
    },
  ],
};

// Replies keyed by reviewId (from your replies API)
const repliesMap = {
  "40fabe5b-f2b4-4367-add6-5b873d5d3dbf": [
    {
      id: "ff122043-b5cb-48fd-9bd1-cffa3d42ffb1",
      reply: "Yes this movie super",
      createdAt: "2026-06-01T06:17:08.000Z",
      user: {
        id: "74fb0e29",
        name: "Kali",
        username: "rockstar",
        profileImage: null,
      },
    },
    {
      id: "c1b97284-e803-4a78-b41b-190711ead03d",
      reply: "Yes this movie super",
      createdAt: "2026-06-01T06:17:41.000Z",
      user: {
        id: "74fb0e29",
        name: "Kali",
        username: "rockstar",
        profileImage: null,
      },
    },
  ],
};

// ─── Example Page ────────────────────────────────────────────────────────────

export default function MovieDetailPage() {
  // Replace with your actual auth context / hook
  const currentUserId = "74fb0e29-ce8f-4f0d-9334-37e1ce38b1f1";

  // ── API handlers — replace with your real API calls ─────────────────────
  const handleRate = async ({ rating, review, spoiler }) => {
    // POST /api/reviews
    console.log("Submit review →", { rating, review, spoiler });
  };

  const handleEdit = async (reviewId, { rating, review, spoiler }) => {
    // PUT /api/reviews/:id
    console.log("Edit review →", reviewId, { rating, review, spoiler });
  };

  const handleDelete = async (reviewId) => {
    // DELETE /api/reviews/:id
    console.log("Delete review →", reviewId);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* ... rest of your movie detail page ... */}

      {/* Drop this anywhere in your page */}
      <ReviewsCarousel
        reviews={reviewsApiResponse}
        repliesMap={repliesMap}
        currentUserId={currentUserId}
        onRate={handleRate}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}
