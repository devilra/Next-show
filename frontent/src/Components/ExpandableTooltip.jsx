import React, { useState } from "react";

const ExpandableTooltip = ({
  text = "",
  lines = 2,
  mobileLimit = 120,
  tooltipWidth = "max-w-[520px]",
  title = false,
  position = "left",
  textClassName = "",
  tooltipClassName = "",
  expandText = "Read More",
  collapseText = "Read Less",
}) => {
  const [expanded, setExpanded] = useState(false);

  const positionClasses = {
    left: "left-0",
    center: "left-1/2 -translate-x-1/2",
    right: "right-0",
  };

  return (
    <div className="relative group w-full">
      {/* Preview Text */}
      <p
        className={`
          transition-all duration-300

          ${expanded ? "" : `line-clamp-${lines}`}

          ${title ? "text-white font-semibold tracking-tight" : "text-zinc-200"}

          ${textClassName}
        `}
      >
        {text}
      </p>

      {/* Desktop Tooltip */}
      <div
        className={`
          hidden md:block

          absolute top-full mt-4

          ${positionClasses[position]}

          opacity-0 invisible
          translate-y-2

          group-hover:opacity-100
          group-hover:visible
          group-hover:translate-y-0

          transition-all duration-300

          z-50
          pointer-events-none

          ${tooltipWidth}
        `}
      >
        <div
          className={`
            relative overflow-hidden

            rounded-[26px]

            border border-white/[0.08]

            bg-gradient-to-br
            from-zinc-900/95
            via-neutral-900/92
            to-slate-950/95

            backdrop-blur-3xl

            px-6 py-5

            shadow-[0_10px_45px_rgba(0,0,0,0.45)]

            before:absolute
            before:inset-0
            before:bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.05),transparent_38%)]

            after:absolute
            after:inset-0
            after:bg-[linear-gradient(to_bottom_right,rgba(255,255,255,0.015),transparent)]

            before:pointer-events-none
            after:pointer-events-none

            ${tooltipClassName}
          `}
        >
          {/* Glow */}
          <div className="absolute -top-10 -right-10 w-24 h-24 bg-orange-500/10 blur-[65px] rounded-full" />

          <p
            className={`
              relative z-10

              break-words

              ${
                title
                  ? "text-[15px] leading-7 font-semibold text-zinc-100"
                  : "text-[14px] leading-8 text-zinc-200"
              }
            `}
          >
            {text}
          </p>
        </div>
      </div>

      {/* Mobile Expand */}
      {text?.length > mobileLimit && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="
            md:hidden

            mt-2

            text-orange-400
            text-[12px]
            font-medium

            active:scale-95
            transition-all
          "
        >
          {expanded ? collapseText : expandText}
        </button>
      )}
    </div>
  );
};

export default ExpandableTooltip;
