import React from "react";

const responseData = [
  {
    id: 1,
    category: "Action Thriller",
    title: "Jana Nayagan Official Update",
    bannerImage:
      "https://res.cloudinary.com/dcock9gai/image/upload/v1766850721/ott_platform/images/q47zixgfiimrnylwokzn.jpg",
    shortDescription:
      "Jana Nayagan ('People's Hero') is an upcoming Indian Tamil-language action thriller starring Vijay. The film promises high-octane stunts and a gripping political narrative...",
    author: "Admin",
    newsDate: "Jan 15, 2026",
    comments: 5,
    tag: "Trending",
    related_stories: [
      {
        id: 101,
        title: "Vijay's Intense Workout for Jana Nayagan",
        date: "Jan 14, 2026",
        thumb:
          "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=200",
      },
      {
        id: 102,
        title: "H Vinoth's Scripting Secrets Revealed",
        date: "Jan 12, 2026",
        thumb:
          "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=200",
      },
      {
        id: 103,
        title: "Pooja Hegde Joins the Final Schedule",
        date: "Jan 10, 2026",
        thumb:
          "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200",
      },
    ],
    sidebarContent: {
      title: "Top 10 Action Sequences in Tamil Cinema",
      thumb:
        "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400",
      author: "Cine Critic",
      date: "Jan 20, 2026",
      comments: 12,
    },
  },
  {
    id: 2,
    category: "Sci-Fi Drama",
    title: "Project K: Global Release Date Confirmed",
    bannerImage:
      "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800",
    shortDescription:
      "The much-awaited sci-fi epic featuring pan-Indian stars is set to redefine Indian cinema aesthetics with futuristic world-building...",
    author: "News Desk",
    newsDate: "Jan 18, 2026",
    comments: 24,
    tag: "Must Watch",
    related_stories: [
      {
        id: 201,
        title: "VFX Breakdown: Creating the Future",
        date: "Jan 17, 2026",
        thumb:
          "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=200",
      },
      {
        id: 202,
        title: "Prabhas on his Challenging Role",
        date: "Jan 16, 2026",
        thumb:
          "https://images.unsplash.com/photo-1505533321630-975218a5f66f?w=200",
      },
    ],
    sidebarContent: {
      title: "Evolution of Sci-Fi in Indian Movies",
      thumb:
        "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=400",
      author: "Tech Guru",
      date: "Jan 19, 2026",
      comments: 8,
    },
  },
  // {
  //   id: 3,
  //   category: "Comedy",
  //   title: "Laughter Riot: Sequel to the Blockbuster",
  //   bannerImage:
  //     "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=800",
  //   shortDescription:
  //     "The original cast returns for a chaotic adventure that promises more jokes and fun than the first installment...",
  //   author: "Fun Times",
  //   newsDate: "Jan 10, 2026",
  //   comments: 45,
  //   tag: "Exclusive",
  //   related_stories: [
  //     {
  //       id: 301,
  //       title: "Behind the Scenes: Bloopers Galore",
  //       date: "Jan 09, 2026",
  //       thumb:
  //         "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=200",
  //     },
  //     {
  //       id: 302,
  //       title: "Interviews with the Star Comedians",
  //       date: "Jan 08, 2026",
  //       thumb:
  //         "https://images.unsplash.com/photo-1527224857830-43a7acc85260?w=200",
  //     },
  //   ],
  //   sidebarContent: {
  //     title: "Why Comedy Movies Perform Best on OTT",
  //     thumb:
  //       "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?w=400",
  //     author: "Analyst",
  //     date: "Jan 21, 2026",
  //     comments: 31,
  //   },
  // },
  // {
  //   id: 4,
  //   category: "Horror",
  //   title: "Midnight Manor: Trailer Review",
  //   bannerImage:
  //     "https://images.unsplash.com/photo-1505628346881-b72b27e84530?w=800",
  //   shortDescription:
  //     "The haunting background score and eerie visuals make this upcoming horror flick the most anticipated of the year...",
  //   author: "Horror Fan",
  //   newsDate: "Jan 05, 2026",
  //   comments: 89,
  //   tag: "Spooky",
  //   related_stories: [
  //     {
  //       id: 401,
  //       title: "Haunted Locations Used in Filming",
  //       date: "Jan 04, 2026",
  //       thumb:
  //         "https://images.unsplash.com/photo-1509248961158-e54f6934749c?w=200",
  //     },
  //     {
  //       id: 402,
  //       title: "Sound Design of Midnight Manor",
  //       date: "Jan 03, 2026",
  //       thumb:
  //         "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=200",
  //     },
  //   ],
  //   sidebarContent: {
  //     title: "Top 5 Scariest Indian Movies of all Time",
  //     thumb:
  //       "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400",
  //     author: "Reviewer",
  //     date: "Jan 18, 2026",
  //     comments: 102,
  //   },
  // },
  // {
  //   id: 5,
  //   category: "Biopic",
  //   title: "Legend of the Field: Sports Biopic",
  //   bannerImage:
  //     "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=800",
  //   shortDescription:
  //     "A gripping journey of a small-town athlete overcoming all odds to win the gold for the nation on a global stage...",
  //   author: "Sports Desk",
  //   newsDate: "Jan 20, 2026",
  //   comments: 15,
  //   tag: "Inspiring",
  //   related_stories: [
  //     {
  //       id: 501,
  //       title: "The Real Hero Behind the Story",
  //       date: "Jan 19, 2026",
  //       thumb:
  //         "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=200",
  //     },
  //     {
  //       id: 502,
  //       title: "Actor's Training Routine for the Role",
  //       date: "Jan 18, 2026",
  //       thumb:
  //         "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=200",
  //     },
  //   ],
  //   sidebarContent: {
  //     title: "Rising Popularity of Sports Biopics",
  //     thumb:
  //       "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=400",
  //     author: "Journalist",
  //     date: "Jan 21, 2026",
  //     comments: 21,
  //   },
  // },
];

const LatestNewsList = () => {
  return (
    <section className="py-12 font-sans">
      <div className="max-w-[1400px] mx-auto px-4">
        {responseData.map((mainItem) => (
          <div
            key={mainItem.id}
            className="grid grid-cols-12 gap-8 mb-20 border-b border-gray-50/10 pb-16 last:border-0"
          >
            {/* --- Column 1: Main Story (5/12) --- */}
            <div className="col-span-12 lg:col-span-5 group cursor-pointer">
              {/* <div className="mb-4">
                <span className="bg-[#EAB308] text-white px-4 py-1.5 font-black text-[10px] uppercase tracking-widest">
                  {mainItem.category}
                </span>
              </div> */}
              <div className="relative overflow-hidden mb-6 rounded-lg shadow-sm">
                <img
                  src={mainItem.bannerImage}
                  className="w-full h-[350px] object-cover transition-transform duration-700 group-hover:scale-105"
                  alt=""
                />
                {/* <div className="absolute bottom-0 left-0 bg-black text-white text-[9px] px-2 py-1 font-bold uppercase">
                  {mainItem.tag}
                </div> */}
              </div>
              <h2 className="text-3xl font-bold text-white mb-3 leading-tight group-hover:text-neutral-300 transition-colors">
                {mainItem.title}
              </h2>
              {/* <div className="flex items-center gap-2 text-[10px] text-gray-400 font-bold uppercase mb-4">
                <span className="text-black">{mainItem.author}</span>{" "}
                <span>-</span> <span>{mainItem.newsDate}</span>
                <span className="ml-auto flex items-center gap-1 bg-gray-100 px-2 py-0.5 rounded-sm">
                  {mainItem.comments} <small className="text-[8px]">💬</small>
                </span>
              </div> */}
              <p className="text-gray-400 text-sm leading-relaxed line-clamp-3">
                {mainItem.shortDescription}
              </p>
            </div>

            {/* --- Column 2: Related Small Stories (3/12) --- */}
            <div className="col-span-12 md:col-span-6 lg:col-span-3 space-y-6 lg:border-x border-gray-50/10 px-4">
              <div className="flex justify-between items-center  pb-2 mb-4">
                <span className="text-[15px]  text-gray-400 tracking-[1px]">
                  Related Stories
                </span>
                {/* <div className="flex gap-1">
                  <button className="border p-1 text-[8px] hover:bg-black hover:text-white">
                    {"<"}
                  </button>
                  <button className="border p-1 text-[8px] hover:bg-black hover:text-white">
                    {">"}
                  </button>
                </div> */}
              </div>
              {mainItem.related_stories.map((related) => (
                <div
                  key={related.id}
                  className="flex gap-3 group cursor-pointer"
                >
                  <div className="w-20 h-16 flex-shrink-0 overflow-hidden">
                    <img
                      src={related.thumb}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      alt=""
                    />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold leading-tight group-hover:text-neutral-300 line-clamp-2 transition-colors">
                      {related.title}
                    </h4>
                    <p className="text-[9px] text-gray-400 mt-1 uppercase font-bold tracking-wider">
                      {related.date}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* --- Column 3: Sidebar Section (4/12) --- */}
            <div className="col-span-12 md:col-span-6 lg:col-span-4 space-y-8">
              <div className="group cursor-pointer  p-4 rounded-sm ">
                <div className="flex items-center gap-2 mb-4">
                  <span className="bg-orange-400 text-white px-3 py-1 rounded-md text-[10px] font-black uppercase tracking-tighter">
                    Popular Content
                  </span>
                  <div className="h-[1px] flex-1 bg-gray-50/10"></div>
                </div>
                <div className="relative mb-4 overflow-hidden">
                  <img
                    src={mainItem.sidebarContent.thumb}
                    className="w-full h-[200px] object-cover group-hover:scale-105 transition-transform duration-700"
                    alt=""
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                    <div className="w-10 h-10 bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center border border-white/50">
                      <div className="w-0 h-0 border-t-[6px] border-t-transparent border-l-[10px] border-l-white border-b-[6px] border-b-transparent ml-1"></div>
                    </div>
                  </div>
                </div>
                <h3 className="text-lg font-bold leading-tight group-hover:text-neutral-300 mb-2 transition-colors">
                  {mainItem.sidebarContent.title}
                </h3>
                <div className="flex items-center gap-2 text-[9px] text-gray-400 font-bold uppercase tracking-widest">
                  <span className="text-black">
                    {mainItem.sidebarContent.author}
                  </span>{" "}
                  <span>-</span> <span>{mainItem.sidebarContent.date}</span>
                  {/* <div className="ml-auto flex items-center gap-1 text-[#f05123]">
                    {mainItem.sidebarContent.comments}{" "}
                    <span className="text-[10px]">💬</span>
                  </div> */}
                </div>
              </div>
              {/* <div className="bg-gray-100/50 border border-gray-200 h-[100px] flex items-center justify-center text-gray-400 font-bold uppercase text-[10px] tracking-[0.2em]">
                Advertisement
              </div> */}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default LatestNewsList;
