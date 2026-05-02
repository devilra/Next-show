import React from "react";

const NewsHeroSection = ({ blogs }) => {
  // Expecting blogs as a prop from parent component (NewsHome)
  if (!blogs || blogs.length === 0)
    return (
      <div className="text-white p-10 text-center">
        No news updates available.
      </div>
    );

  const featured = blogs[0];
  const sideBlogs = blogs.slice(1, 5);

  return (
    <section className=" py-10 font-sans">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        {/* <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-black uppercase tracking-tighter text-gray-900 border-l-4 border-blue-600 pl-3">
            Latest <span className="text-blue-600">Updates</span>
          </h2>
          <div className="h-[1px] flex-1 bg-gray-200 ml-4 hidden md:block"></div>
        </div> */}

        <div className="grid grid-cols-12 gap-6">
          {/* 🏆 LEFT BIG FEATURED CARD */}
          <div className="col-span-12 lg:col-span-7 relative group overflow-hidden rounded-3xl cursor-pointer shadow-2xl bg-black">
            <img
              src={featured.bannerImage}
              alt={featured.title}
              className="w-full h-[550px] object-cover transition-transform duration-1000 group-hover:scale-110 opacity-80 group-hover:opacity-70"
            />

            {/* Premium Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-20"></div>

            <div className="absolute bottom-0 left-0 w-full p-10 z-30">
              {/* <span className="inline-block bg-blue-600 text-white text-[11px] font-bold px-4 py-1.5 rounded-full uppercase mb-5 shadow-lg">
                {featured.category}
              </span> */}

              <h2 className="text-4xl md:text-5xl  text-white leading-tight mb-4 group-hover:text-neutral-300 transition-colors">
                {featured.title}
              </h2>

              <p className="text-gray-300 text-sm md:text-base line-clamp-2 mb-6 max-w-2xl font-light">
                {featured.shortDescription}
              </p>

              <div className="flex flex-wrap items-center gap-4 text-xs font-semibold uppercase tracking-widest text-white">
                <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-lg border border-white/10">
                  🎬 Dir: {featured.directedBy}
                </div>
                <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-lg border border-white/10">
                  ⭐ {featured.starCast.split(",")[0]} {/* Showing main star */}
                </div>
                <div className="text-gray-400">📅 {featured.newsDate}</div>
              </div>
            </div>
          </div>

          {/* ⚡ RIGHT SIDE GRID */}
          <div className="col-span-12 lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-5">
            {sideBlogs.map((item) => (
              <div
                key={item.id}
                className="relative group overflow-hidden rounded-3xl cursor-pointer h-[265px] shadow-lg border-2 border-gray-100/30 flex flex-col justify-end"
              >
                <img
                  src={item.bannerImage}
                  alt={item.title}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent z-10"></div>

                <div className="relative p-5 z-20">
                  <span className="text-[12px] font-bold text-blue-400 uppercase mb-2 block">
                    {item.directedBy}
                  </span>
                  <h3 className="text-white  text-lg leading-tight line-clamp-2 group-hover:text-blue-200 transition-colors">
                    {item.title}
                  </h3>
                  <div className="mt-3 flex items-center justify-between text-[10px] text-gray-400 font-bold uppercase tracking-tighter">
                    <span>{item.newsDate}</span>
                    <span className="text-white bg-blue-600/20 px-2 py-0.5 rounded">
                      View News
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewsHeroSection;
