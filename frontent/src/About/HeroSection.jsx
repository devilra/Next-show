import {
  Play,
  Star,
  Zap,
  ChevronRight,
  TrendingUp,
  Tv,
  Users,
  Database,
  Film,
} from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative mt-20 min-h-screen w-full flex items-center justify-center overflow-hidden bg-[#0a0a0b] py-20">
      {/* 1. BACKGROUND LAYER */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80&w=2000"
          className="w-full h-full object-cover opacity-20"
          alt="Cinema Background"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0b] via-transparent to-[#0a0a0b]" />
      </div>

      {/* 2. CONTENT LAYER */}
      <div className="relative z-10 container mx-auto px-6">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl lg:text-[80px]   tracking-tight text-white mb-6 ">
            World's Largest Movie <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-orange-200 to-orange-600">
              Ecosystem
            </span>
          </h1>
          <p className="max-w-2xl mx-auto text-gray-400 text-lg md:text-xl pt-5 leading-relaxed tracking-wide font-serif italic">
            The{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-600 font-bold">
              definitive source
            </span>{" "}
            for movie, TV, and celebrity information.
            <br className="hidden md:block" />
            Designed for{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-600 font-bold">
              fans
            </span>
            , built by experts.
          </p>
        </div>

        {/* 3. FEATURE CARDS (Right Aligned Icons & Black/80) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto mb-16 px-4">
          {/* Card 1: Top Rated */}
          <div className="group relative p-8 rounded-[2rem] bg-[#0f1115] border border-white/5 hover:border-yellow-500/30 transition-all duration-700  overflow-hidden shadow-2xl">
            {/* Hover Gradient Glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

            <div className="relative z-10">
              {/* Top Tag */}
              <div className="flex items-center gap-2 mb-6">
                <span className="px-3 py-1 rounded-full bg-yellow-500/10 text-yellow-500 text-[12px]  uppercase   tracking-wider border border-yellow-500/20">
                  Rankings
                </span>
                <span className="h-[1px] w-8 bg-white/10" />
              </div>

              <h3 className="text-2xl tracking-[0.5px] text-white mb-3  group-hover:text-yellow-400 transition-colors">
                Top 250 Titles
              </h3>

              <p className="text-gray-400 text-sm mb-8 leading-relaxed">
                Access the <span className="text-white">gold standard</span> of
                cinema. Every masterpiece, rated by millions, ranked for you.
              </p>

              {/* Mini Stats inside card */}
              <div className="grid grid-cols-2 gap-3 mb-8">
                {/* Left Mini Card: Community Score */}
                <div className="p-3 rounded-2xl bg-gradient-to-br from-white/[0.05] to-transparent border border-white/5 group/mini hover:border-yellow-500/30 transition-all duration-500">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="p-1 rounded bg-yellow-500/10 text-yellow-500">
                      <Star size={10} fill="currentColor" />
                    </div>
                    <p className="text-[9px] text-gray-500 uppercase font-black tracking-[0.15em]">
                      Fan Rating
                    </p>
                  </div>
                  <div className="flex pl-6 items-center gap-1.5">
                    <p className="text-xs font-bold text-white group-hover/mini:text-yellow-400 transition-colors">
                      9.8 / 10
                    </p>
                    <span className="text-[8px] px-1.5 py-0.5 rounded bg-yellow-500/10 text-yellow-500 font-bold uppercase">
                      Global
                    </span>
                  </div>
                </div>

                {/* Right Mini Card: Weekly Trend (Updated Content) */}
                <div className="p-3 rounded-2xl bg-gradient-to-br from-white/[0.05] to-transparent border border-white/5 group/mini hover:border-yellow-500/30 transition-all duration-500">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="p-1 rounded bg-yellow-500/10 text-yellow-500">
                      <Zap size={10} />
                    </div>
                    <p className="text-[9px] text-gray-500 uppercase font-black tracking-[0.15em]">
                      Weekly Trend
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {/* Upward Arrow Icon to show growth */}
                    <div className="flex items-center text-green-500">
                      <TrendingUp size={12} strokeWidth={3} />
                    </div>
                    <p className="text-xs font-bold text-white group-hover/mini:text-yellow-400 transition-colors">
                      +12.4%{" "}
                      <span className="text-[8px] px-1.5 py-0.5 rounded bg-yellow-500/10 text-yellow-500 font-bold uppercase">
                        Growth
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              {/* <button className="flex items-center gap-2 text-yellow-500 font-black text-[11px] uppercase tracking-[0.25em] group-hover:translate-x-2 transition-transform duration-500">
                Launch Chart <ChevronRight size={14} strokeWidth={3} />
              </button> */}
            </div>

            {/* Abstract Decorative Icon */}
            <Star
              size={140}
              strokeWidth={1}
              className="absolute -right-8 -bottom-8 text-yellow-500/5 group-hover:text-yellow-500/10 group-hover:-translate-y-4 group-hover:-rotate-12 transition-all duration-1000 ease-out"
            />
          </div>

          {/* Card 2: Trending News */}
          <div className="group relative p-8 rounded-[2rem] bg-[#0f1115] border border-white/5 hover:border-orange-500/30 transition-all duration-700  overflow-hidden shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-6">
                <span className="px-3 py-1 rounded-full bg-orange-500/10 text-orange-500 text-[12px]  uppercase   tracking-wider border border-orange-500/20">
                  Breaking
                </span>
                <span className="h-[1px] w-8 bg-white/10" />
              </div>

              <h3 className="text-2xl  text-white mb-3 tracking-[0.5px]  group-hover:text-orange-400 transition-colors">
                Industry Scoop
              </h3>

              <p className="text-gray-400 text-sm mb-8 leading-relaxed">
                Stay ahead of the curve with{" "}
                <span className="text-white">exclusive reports</span> from
                Hollywood and beyond.
              </p>

              <div className="grid grid-cols-2 gap-3 mb-8">
                {/* Left Mini Card: Daily Posts */}
                <div className="p-3 rounded-2xl bg-gradient-to-br from-white/[0.05] to-transparent border border-white/5 group/mini hover:border-red-500/30 transition-all duration-500">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="p-1 rounded bg-red-500/10 text-red-500">
                      <TrendingUp size={10} />
                    </div>
                    <p className="text-[9px] text-gray-500 uppercase font-black tracking-[0.15em]">
                      Daily Volume
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <p className="text-xs font-bold pl-6 text-white group-hover/mini:text-red-400 transition-colors">
                      150+ Scoops
                    </p>
                    {/* Tiny live indicator for news */}
                    <span className="flex h-1 w-1 rounded-full bg-red-500 animate-ping" />
                  </div>
                </div>

                {/* Right Mini Card: Priority/Verified */}
                <div className="p-3 rounded-2xl bg-gradient-to-br from-white/[0.05] to-transparent border border-white/5 group/mini hover:border-red-500/30 transition-all duration-500">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="p-1 rounded bg-red-500/10 text-red-500">
                      <Zap size={10} />
                    </div>
                    <p className="text-[9px] text-gray-500 uppercase font-black tracking-[0.15em]">
                      Auth Level
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <p className="text-xs pl-7 font-bold text-white group-hover/mini:text-red-400 transition-colors">
                      Verified
                    </p>
                    {/* Checkmark style icon or dot */}
                    <div className="h-2 w-2 rounded-full border border-red-500/50 flex items-center justify-center">
                      <div className="h-1 w-1 rounded-full bg-red-500" />
                    </div>
                  </div>
                </div>
              </div>

              {/* <button className="flex items-center gap-2 text-orange-500 font-black text-[11px] uppercase tracking-[0.25em] group-hover:translate-x-2 transition-transform duration-500">
                Read Feed <ChevronRight size={14} strokeWidth={3} />
              </button> */}
            </div>

            <TrendingUp
              size={140}
              strokeWidth={1}
              className="absolute -right-8 -bottom-8 text-orange-500/5 group-hover:text-orange-500/10 group-hover:-translate-y-4 group-hover:-rotate-12 transition-all duration-1000 ease-out"
            />
          </div>

          {/* Card 3: Streaming Guide */}
          <div className="group relative p-8 rounded-[2rem] bg-[#0f1115] border border-white/5 hover:border-blue-500/30 transition-all duration-700  overflow-hidden shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-6">
                <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-[12px]  uppercase  tracking-wider border border-blue-500/20">
                  Navigator
                </span>
                <span className="h-[1px] w-8 bg-white/10" />
              </div>

              <h3 className="text-2xl  text-white mb-3 tracking-[0.5px] group-hover:text-blue-400 transition-colors">
                Watch Guide
              </h3>

              <p className="text-gray-400 text-sm mb-8 leading-relaxed">
                End the scrolling struggle. Find exactly{" "}
                <span className="text-white">where to stream</span> your next
                favorite.
              </p>

              <div className="grid grid-cols-2 gap-3 mb-8">
                {/* Left Mini Card */}
                <div className="p-3 rounded-2xl bg-gradient-to-br from-white/[0.05] to-transparent border border-white/5 group/mini hover:border-blue-500/30 transition-colors">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="p-1 rounded bg-blue-500/10 text-blue-400">
                      <Tv size={10} />
                    </div>
                    <p className="text-[9px] text-gray-500 uppercase font-black tracking-[0.15em]">
                      Coverage
                    </p>
                  </div>
                  <p className="text-xs font-semibold pl-6 text-white group-hover/mini:text-blue-400 transition-colors">
                    Global OTTs
                  </p>
                </div>

                {/* Right Mini Card */}
                <div className="p-3 rounded-2xl bg-gradient-to-br from-white/[0.05] to-transparent border border-white/5 group/mini hover:border-blue-500/30 transition-colors">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="p-1 rounded bg-blue-500/10 text-blue-400">
                      <Zap size={10} />
                    </div>
                    <p className="text-[9px] text-gray-500 uppercase font-black tracking-[0.15em]">
                      Engine
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <p className="text-xs pl-6 font-bold text-white group-hover/mini:text-blue-400 transition-colors">
                      Smart AI
                    </p>
                    {/* <span className="flex h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse" /> */}
                  </div>
                </div>
              </div>

              {/* <button className="flex items-center gap-2 text-blue-400 font-black text-[11px] uppercase tracking-[0.25em] group-hover:translate-x-2 transition-transform duration-500">
                Start Browsing <ChevronRight size={14} strokeWidth={3} />
              </button> */}
            </div>

            <Tv
              size={140}
              strokeWidth={1}
              className="absolute -right-8 -bottom-8 text-blue-500/5 group-hover:text-blue-500/10 group-hover:-translate-y-4 group-hover:-rotate-12 transition-all duration-1000 ease-out"
            />
          </div>
        </div>

        {/* 4. METRICS IN CARDS (Awesome Look) */}
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Total Titles", value: "10M+", icon: <Film size={16} /> },
            {
              label: "Data Points",
              value: "85M+",
              icon: <Database size={16} />,
            },
            { label: "Global Fans", value: "12M+", icon: <Users size={16} /> },
            { label: "Reviews", value: "500K+", icon: <Star size={16} /> },
          ].map((metric, i) => (
            <div
              key={i}
              className="bg-black/60 backdrop-blur-md border border-white/5 p-5 rounded-xl hover:bg-white/[0.02] transition-colors group"
            >
              <div className="flex items-center gap-3 mb-1">
                <span className="text-yellow-500 opacity-50 group-hover:opacity-100 transition-opacity">
                  {metric.icon}
                </span>
                <p className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-bold">
                  {metric.label}
                </p>
              </div>
              <p className="text-2xl font-black text-white tracking-tighter">
                {metric.value}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
