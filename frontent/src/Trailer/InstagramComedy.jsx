import React from "react";
import Slider from "react-slick";
import { InstagramEmbed } from "react-social-media-embed";

const instaData = [
  {
    id: 1,
    url: "https://www.instagram.com/reels/DNm0B5fzLBo/", // Embed link thevaillai, normal link pothum
  },
  {
    id: 2,
    url: "https://www.instagram.com/reels/DNavPx0yWaN/",
  },
  {
    id: 3,
    url: "https://www.instagram.com/reels/DM2Mpf3Ouju/",
  },
];

const InstagramComedy = () => {
  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    responsive: [
      { breakpoint: 1280, settings: { slidesToShow: 3 } },
      { breakpoint: 768, settings: { slidesToShow: 2 } },
      { breakpoint: 480, settings: { slidesToShow: 1 } },
    ],
  };

  return (
    <div className="mb-12 px-4 md:px-8">
      <h3 className="text-xl font-bold text-white mb-6 uppercase tracking-widest border-l-4 border-pink-500 pl-3">
        Instagram <span className="text-pink-500">Comedy</span>
      </h3>

      <Slider {...settings}>
        {instaData.map((item) => (
          <div key={item.id} className="px-2">
            <div className="bg-[#111] rounded-xl overflow-hidden border border-gray-800 flex justify-center py-4">
              {/* InstagramEmbed Library Usage */}
              <InstagramEmbed
                url={item.url}
                width="100%"
                style={{ maxWidth: "328px" }}
              />
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default InstagramComedy;
