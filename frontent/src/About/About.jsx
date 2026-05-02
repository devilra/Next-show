import React from "react";
import { Film, Star, Users, TrendingUp, Tv, Award } from "lucide-react";
import HeroSection from "./HeroSection";

const About = () => {
  return (
    <div className="bg-[#0f1115] text-white min-h-screen font-sans selection:bg-red-600">
      {/* 1. HERO SECTION: Cinematic Entrance */}
      <section>
        <HeroSection />
      </section>

      {/* 2. STATS SECTION: Social Proof */}
      {/* <section className="py-12 border-y border-white/5 bg-white/5 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            {
              label: "Movies Reviewed",
              value: "5K+",
              icon: <Film size={20} />,
            },
            { label: "Active Critics", value: "25+", icon: <Star size={20} /> },
            {
              label: "Monthly Readers",
              value: "1M+",
              icon: <Users size={20} />,
            },
            { label: "Awards Won", value: "12", icon: <Award size={20} /> },
          ].map((stat, i) => (
            <div key={i} className="text-center group cursor-default">
              <div className="flex justify-center text-red-600 mb-2 group-hover:scale-125 transition-transform">
                {stat.icon}
              </div>
              <h3 className="text-3xl font-bold">{stat.value}</h3>
              <p className="text-gray-500 text-sm uppercase tracking-widest">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section> */}

      {/* 3. CORE MISSION: Why We Are Different */}
      <section className="py-24 max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <h2 className="text-4xl font-bold leading-tight">
              Honest Reviews for <br />
              <span className="text-red-600 underline decoration-2 underline-offset-8">
                Every Cinema Lover
              </span>
            </h2>
            <p className="text-gray-400 leading-relaxed">
              Cinema-nu vandhuta inga discrimination illa. Blockbuster
              Action-naalum sari, underrated Indie film-naalum sari, namma team
              ovvoru frame-aiyum rasichu, analysed panni ungalukku honest-ah
              reviews tharuvaanga.
            </p>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-red-600/10 rounded-lg text-red-500">
                  <TrendingUp size={24} />
                </div>
                <div>
                  <h4 className="font-bold">No Spoilers Policy</h4>
                  <p className="text-sm text-gray-500">
                    Ungaloda movie experience-ah spoil panna maatom.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="p-2 bg-red-600/10 rounded-lg text-red-500">
                  <Tv size={24} />
                </div>
                <div>
                  <h4 className="font-bold">Multi-Language Support</h4>
                  <p className="text-sm text-gray-500">
                    Tamil, Telugu, Malayalam nu ellamae cover pannuvom.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative group">
            <div className="absolute -inset-4 bg-red-600/20 rounded-2xl blur-2xl opacity-0 group-hover:opacity-100 transition duration-1000"></div>
            <img
              src="https://images.unsplash.com/photo-1517604401157-538a968a6009?auto=format&fit=crop&q=80&w=1000"
              className="relative rounded-2xl border border-white/10 shadow-2xl transition-transform duration-500 group-hover:scale-[1.02]"
              alt="Team Watching Movie"
            />
          </div>
        </div>
      </section>

      {/* 4. CONTENT CATEGORIES: The "Different Related Content" part */}
      <section className="py-20 bg-[#15181e]">
        <div className="max-w-7xl mx-auto px-6 text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight mb-2 uppercase">
            Beyond the Review
          </h2>
          <p className="text-gray-500">
            Namma site-la review mattum illa, innum niraiya irukku.
          </p>
        </div>

        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-8">
          {[
            {
              title: "Exclusive Interviews",
              desc: "Star-oda real talk, behind the camera stories.",
            },
            {
              title: "Box Office Analysis",
              desc: "Calculated prediction matrum weekly collection reports.",
            },
            {
              title: "Trivia & Hidden Details",
              desc: "Neenga miss panna details-ah nanga note panni tharuvom.",
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="p-8 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/5 hover:border-red-600/30 transition-all cursor-pointer group"
            >
              <div className="h-1 w-12 bg-red-600 mb-6 group-hover:w-full transition-all duration-500"></div>
              <h3 className="text-xl font-bold mb-3">{item.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 5. CALL TO ACTION */}
      <section className="py-24 text-center">
        <div className="max-w-2xl mx-auto px-4 bg-gradient-to-r from-red-600/10 to-transparent p-12 rounded-3xl border border-red-600/20">
          <h2 className="text-3xl font-bold mb-6 italic">
            Ready to dive into the Cinema world?
          </h2>
          <button className="px-10 py-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-full transition-all transform hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(220,38,38,0.4)]">
            BROWSE LATEST REVIEWS
          </button>
        </div>
      </section>
    </div>
  );
};

export default About;
