import React from "react";
import MovieReviewCard from "./MoviesReviewCard";

export const MOVIE_REVIEWS_DATA = [
  {
    id: 1,
    movie: "Jailer",
    director: "Nelson Dilipkumar",
    cast: "Rajinikanth, Mohanlal, Shiva Rajkumar",
    year: "2023-08-10",
    streamType: "NEW",
    source: "The Hindu",
    img: "https://content.tupaki.com/en/feeds/2023/08/10/142196-jail.jpg",
    rating: 4.0,
    summary:
      "A stylish comeback for Rajini! Nelson delivers a solid action comedy with great set pieces and mass moments.",
  },
  {
    id: 2,
    movie: "Vettaiyan",
    streamType: "TRENDING",
    source: "User_Aravind",
    img: "https://m.media-amazon.com/images/S/pv-target-images/d92ce2f6c69640edfde56eeba4bcb8868b7aabe5ba7313b721f8a5425c810716._SX1080_FMjpg_.jpg",
    rating: 4.5,
    summary:
      "Best performance from Rajini in years. A must-watch emotional action flick. Anirudh's BGM is superb!",
    director: "Nelson Dilipkumar",
    cast: "Rajinikanth, Mohanlal, Shiva Rajkumar",
    year: "2023-08-10",
  },
  {
    id: 3,
    movie: "Jana Nayagan",
    streamType: "UPCOMMING",
    source: "DT Next",
    img: "https://i.pinimg.com/736x/1c/09/6c/1c096c1b143ae5f4499e90081b15cf51.jpg",
    rating: 3.5,
    summary:
      "Vijay shines in this political thriller, though the screenplay loses pace in the second half. Overall, a powerful message.",
    director: "Nelson Dilipkumar",
    cast: "Rajinikanth, Mohanlal, Shiva Rajkumar",
    year: "2023-08-10",
  },
  {
    id: 4,
    movie: "Thangalaan",
    streamType: "TRENDING",
    source: "User_Priya",
    img: "https://images.hindustantimes.com/img/2024/08/15/1600x900/Thangalaan_1723709197073_1723709197226.jpg",
    rating: 5.0,
    summary:
      "Pure cinematic brilliance! Pa Ranjith's storytelling and Vikram's commitment are extraordinary. Highly recommended.",
    director: "Nelson Dilipkumar",
    cast: "Rajinikanth, Mohanlal, Shiva Rajkumar",
    year: "2023-08-10",
  },
  // **மேலும் 11 டேட்டா சேர்க்கப்பட்டுள்ளது (மொத்தம் 15)**
  {
    id: 5,
    movie: "Leo",
    streamType: "TRENDING",
    source: "Times",
    img: "https://resizing.flixster.com/-BOvYVtW6LKWOdfbFz12hVdYzGk=/ems.cHJkLWVtcy1hc3NldHMvbW92aWVzL2RlNzVkZjM0LWRiZmEtNGE0YS1hYTUyLTU1YzlhYjQwMzViZi5qcGc=",
    rating: 3.0,
    summary:
      "Lokesh Cinematic Universe expands but lacks LCU intensity. Still a decent watch.",
    director: "Nelson Dilipkumar",
    cast: "Rajinikanth, Mohanlal, Shiva Rajkumar",
    year: "2023-08-10",
  },
  {
    id: 6,
    movie: "Ayalaan",
    streamType: "TRENDING",
    img: "https://sund-images.sunnxt.com/183332/640x360_Ayalaan_183332_cb824cdc-d392-4342-9671-ed5993e24106.jpg",
    source: "User_Karthi",
    rating: 4.2,
    summary:
      "Great visual effects and fun family entertainer. Sci-fi works well for the kids.",
    director: "Nelson Dilipkumar",
    cast: "Rajinikanth, Mohanlal, Shiva Rajkumar",
    year: "2023-08-10",
  },
  {
    id: 7,
    movie: "Indian",

    streamType: "TRENDING",
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT3NKYr7e-aJ4nWHWHIne16exZqYhy3vNFS8w&s",
    source: "Behindwoods",
    rating: 4.5,
    summary:
      "Shankar delivers a masterpiece. Kamal Haasan is flawless. The stunts are breathtaking.",
    director: "Nelson Dilipkumar",
    cast: "Rajinikanth, Mohanlal, Shiva Rajkumar",
    year: "2023-08-10",
  },
  {
    id: 8,
    movie: "Captain Miller",
    streamType: "TRENDING",
    img: "https://m.media-amazon.com/images/M/MV5BNmMyNjlhY2UtN2QxNi00MWRiLWJjZDgtMzU1ZWM2NzZkNTQ1XkEyXkFqcGc@._V1_.jpg",
    source: "User_Deepa",
    rating: 4.0,
    summary:
      "Dhanush's best performance. Period war film feels raw and emotional.",
    director: "Nelson Dilipkumar",
    cast: "Rajinikanth, Mohanlal, Shiva Rajkumar",
    year: "2023-08-10",
  },
  {
    id: 9,
    movie: "Viduthalai P1",
    streamType: "TRENDING",
    img: "https://img.airtel.tv/unsafe/fit-in/500x0/filters:format(webp)/https://xstreamcp-assets-msp.streamready.in/assets/ZEEFIVE/MOVIE/66ff656c56c0c1016282c99a/images/720x108079149533392f461ba75a664d5a95aa13.jpg?o=production",
    source: "India Today",
    rating: 4.0,
    summary:
      "Vetrimaaran's raw and gritty take on police brutality is gripping. Soori is a revelation.",
    director: "Nelson Dilipkumar",
    cast: "Rajinikanth, Mohanlal, Shiva Rajkumar",
    year: "2023-08-10",
  },
  {
    id: 10,
    movie: "Thunivu",
    streamType: "NEW",
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR09Ipl53al9eH4VyxgdeXFwmaZEElbJvopgA&s",
    source: "User_Manoj",
    rating: 3.8,
    summary:
      "Stylish heist film. Ajith carries the entire movie with ease and swag.",
    director: "Nelson Dilipkumar",
    cast: "Rajinikanth, Mohanlal, Shiva Rajkumar",
    year: "2023-08-10",
  },
  {
    id: 11,
    movie: "Vaathi",
    streamType: "NEW",
    img: "https://m.media-amazon.com/images/M/MV5BODhmMTFmNjMtZjMwOS00MjNlLWJkNzQtYTI0MjhiZDMzNzZmXkEyXkFqcGc@._V1_.jpg",

    source: "Film Companion",
    rating: 3.0,
    summary:
      "An important social message packaged into an average entertainer. Still worth a watch.",
    director: "Nelson Dilipkumar",
    cast: "Rajinikanth, Mohanlal, Shiva Rajkumar",
    year: "2023-08-10",
  },
  {
    id: 12,
    movie: "Sardar-2",
    streamType: "UPCOMMING",
    img: "https://m.media-amazon.com/images/M/MV5BMmYxMmJkMDAtNzc4NC00MzliLWJiNmItMWIyNGI5OWIyM2Q4XkEyXkFqcGc@._V1_.jpg",
    source: "User_Shalini",
    rating: 4.1,
    summary:
      "Karthi's double role worked wonders. A solid spy thriller with engaging twists.",
    director: "Nelson Dilipkumar",
    cast: "Rajinikanth, Mohanlal, Shiva Rajkumar",
    year: "2023-08-10",
  },
  {
    id: 13,
    movie: "Pathu Thala",
    streamType: "UPCOMMING",
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSJDrSW9f_JTZ6CDpi4FPxA64l_NyEwTLpCWA&s",
    source: "Galatta",
    rating: 3.5,
    summary:
      "Simbu's screen presence elevates this action drama. Good mass appeal.",
    director: "Nelson Dilipkumar",
    cast: "Rajinikanth, Mohanlal, Shiva Rajkumar",
    year: "2023-08-10",
  },
  {
    id: 14,
    movie: "Maamannan",
    streamType: "UPCOMMING",
    img: "https://m.media-amazon.com/images/M/MV5BNjdhOTg4NzMtMTY2MC00YmY0LWJiMWMtMTJkYzIzMWFmNTJmXkEyXkFqcGc@._V1_.jpg",
    source: "User_Sanjay",
    rating: 4.8,
    summary:
      "Fahadh Faasil steals the show. Powerful political drama from Mari Selvaraj.",
    director: "Nelson Dilipkumar",
    cast: "Rajinikanth, Mohanlal, Shiva Rajkumar",
    year: "2023-08-10",
  },
  {
    id: 15,
    movie: "Ponniyin Selvan 2",
    streamType: "TRENDING",
    img: "https://resizing.flixster.com/bykwdBFKjGapfGZZ9cLdQjQsEoQ=/ems.cHJkLWVtcy1hc3NldHMvbW92aWVzLzFiYjc4OGQzLWM3NWMtNDY4ZS1iOTYxLWY3Y2RlMGFmNjM3OC5qcGc=",
    source: "Vikatan",
    rating: 4.0,
    summary:
      "Epic conclusion to a magnum opus. Grand visuals and solid performance from the cast.",
    director: "Nelson Dilipkumar",
    cast: "Rajinikanth, Mohanlal, Shiva Rajkumar",
    year: "2023-08-10",
  },
];

const MovieSection = ({ activeHomeMovies }) => {
  const upcomingMovies = activeHomeMovies.filter(
    (m) => m.streamType === "UPCOMING"
  );
  const newReleases = activeHomeMovies.filter((m) => m.streamType === "NEW");
  const trendingNow = activeHomeMovies.filter(
    (m) => m.streamType === "TRENDING"
  );

  return (
    <div className="bg-[#0f0f0f] py-2 px-4 md:px-8 ">
      <h2 className="text-white text-xl md:text-2xl font-black mb-6 uppercase tracking-wider">
        Movies
      </h2>

      {/* Main Container - 3 Vertical Columns Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 border border-yellow-500/20 p-5 rounded-xl bg-[#0a0a0a]">
        {/* Column 1: UPCOMING (With Scroll) */}
        <div className="flex flex-col">
          <h3 className="text-white font-bold mb-4 uppercase rounded-sm text-xs tracking-[0.2em] border-l-4 border-orange-400 pl-3">
            New movies
          </h3>
          {/* <div className="space-y-4 h-[520px] overflow-y-auto pr-2 custom-scrollbar">
            {upcomingMovies.map((movie) => (
              <div
                key={movie.id}
                className="relative group rounded-xl overflow-hidden border border-gray-800 bg-[#1a1a1a]"
              >
               
                <div className="h-72 w-full overflow-hidden">
                  <img
                    src={movie.img}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    alt={movie.movie}
                  />
                  <div className="absolute top-2 left-2 bg-gradient-to-r from-[#e3af05] via-[#e6cb35] to-[#727402] text-black text-[10px] font-bold px-2 py-0.5 rounded">
                    JAN 1, 2026
                  </div>
                </div>
              
                <div className="p-4 bg-gradient-to-b from-[#1a1a1a] to-black">
                  <h4 className="text-white text-lg font-black mb-2 uppercase">
                    {movie.movie}
                  </h4>
                  <div className="text-[11px] space-y-1">
                    <p className="text-gray-400">
                      <span className="text-gray-500 font-bold">Director:</span>{" "}
                      {movie.director}
                    </p>
                    <p className="text-gray-400 truncate">
                      <span className="text-gray-500 font-bold">Cast:</span>{" "}
                      {movie.cast}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div> */}
          <div className="space-y-4 max-h-[520px] overflow-y-auto pr-2 custom-scrollbar">
            {upcomingMovies.length > 0 ? (
              upcomingMovies.map((movie) => (
                <MovieReviewCard key={movie.id} review={movie} />
              ))
            ) : (
              <p className="text-gray-600 italic text-sm">No Upcoming found.</p>
            )}
          </div>
        </div>

        {/* Column 2: NEW RELEASES (With Scroll) */}
        <div className="flex flex-col">
          <h3 className="text-white font-bold mb-4 rounded-sm uppercase text-xs tracking-[0.2em] border-l-4 border-orange-400 pl-3">
            Upcoming
          </h3>
          <div className="space-y-4 max-h-[520px] overflow-y-auto pr-2 custom-scrollbar">
            {newReleases.length > 0 ? (
              newReleases.map((movie) => (
                <MovieReviewCard key={movie.id} review={movie} />
              ))
            ) : (
              <p className="text-gray-600 italic text-sm">
                No new releases found.
              </p>
            )}
          </div>
        </div>

        {/* Column 3: TRENDING NOW (With Scroll) */}
        <div className="flex flex-col">
          <h3 className="text-white font-bold mb-4 rounded-sm uppercase text-xs tracking-[0.2em] border-l-4 border-orange-400 pl-3">
            Trending Now
          </h3>
          <div className="space-y-4 max-h-[520px] overflow-y-auto pr-2 custom-scrollbar">
            {trendingNow.length > 0 ? (
              trendingNow.map((movie) => (
                <MovieReviewCard key={movie.id} review={movie} />
              ))
            ) : (
              <p className="text-gray-600 italic text-sm">
                Nothing trending right now.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Optional Custom Scrollbar Styling (Add to your global CSS or index.css) */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #1a1a1a;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #333;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #a084ff;
        }
      `}</style>
    </div>
  );
};

export default MovieSection;
