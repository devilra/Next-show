import React, { useEffect, useRef } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";
// YouTube support plugin
import "videojs-youtube";

const VideoPlayer = ({ videoOptions, onVideoEnd }) => {
  const videoRef = useRef(null);
  const playerRef = useRef(null);

  useEffect(() => {
    // Player-a initialize pannalam
    if (videoRef.current && !playerRef.current) {
      const player = videojs(
        videoRef.current,
        {
          ...videoOptions,
          techOrder: ["youtube", "html5"], // YouTube-ku priority tharuvom
        },
        () => {
          console.log("Video.js Player Ready (YouTube Support Active)");
          player.play().catch(() => {});
        }
      );

      playerRef.current = player;

      // Video mudiya pothu next pogura logic
      player.on("ended", () => {
        if (onVideoEnd) onVideoEnd();
      });
    }

    // Source maarum pothu player-a update panna
    if (playerRef.current && videoOptions.sources) {
      playerRef.current.src(videoOptions.sources);
    }

    return () => {
      if (playerRef.current) {
        playerRef.current.dispose();
        playerRef.current = null;
      }
    };
  }, [videoOptions, onVideoEnd]);

  return (
    <div data-vjs-player className="w-full h-full overflow-hidden rounded-xl">
      <video
        ref={videoRef}
        className="video-js vjs-big-play-centered vjs-theme-city w-full h-full"
      />
    </div>
  );
};

export default VideoPlayer;
