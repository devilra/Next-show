import React, { useEffect, useRef } from "react";
import videojs from "video.js";
// Video.js-ன் அடிப்படை ஸ்டைல் தேவை
import "video.js/dist/video-js.css";

// Props:
// - videoOptions: Video.js-க்கான விருப்பங்கள் (source, controls, autoplay போன்றவை)
// - onVideoEnd: வீடியோ முடிவடைந்தவுடன் அழைக்கப்பட வேண்டிய செயல்பாடு (அடுத்த வீடியோவுக்குச் செல்ல)
const VideoPlayer = ({ videoOptions, onVideoEnd }) => {
  const videoRef = useRef(null);
  const playerRef = useRef(null);

  useEffect(() => {
    // 1. பிளேயரை உருவாக்கவும் (Initialize the Player)
    if (videoRef.current && !playerRef.current) {
      // videoOptions-ல் autoplay: true இருக்கிறதா என்பதை உறுதிப்படுத்தவும்
      const player = videojs(videoRef.current, videoOptions, () => {
        console.log("Video.js Player is Ready");
        // ப்ளே செய்ய முயற்சிக்கவும், பிரவுசர் ஆட்டோபிளே-ஐ தடுக்கும் பட்சத்தில்
        player.play().catch((error) => {
          console.log(
            "Autoplay was prevented. User must interact to play.",
            error
          );
        });
      });
      playerRef.current = player;

      // 2. வீடியோ முடிவடைந்ததைக் கண்டறிய (Listen for Video End)
      player.on("ended", () => {
        console.log("Video Ended. Moving to next.");
        // onVideoEnd செயல்பாட்டை அழைக்கவும் (அடுத்த வீடியோவுக்குச் செல்ல)
        if (onVideoEnd) {
          onVideoEnd();
        }
      });
    }

    // 3. காம்போனன்ட் அன்மௌன்ட் ஆகும் போது பிளேயரை அழித்து விடவும் (Cleanup on Unmount)
    return () => {
      if (playerRef.current) {
        playerRef.current.dispose();
        playerRef.current = null;
      }
    };
  }, [videoOptions, onVideoEnd]); // videoOptions அல்லது onVideoEnd மாறினால் useEffect மீண்டும் இயங்கும்

  return (
    <div data-vjs-player>
      {/* இந்த video டேக்-ஐ தான் Video.js பிளேயராக மாற்றும் */}
      <video ref={videoRef} className="video-js vjs-big-play-centered" />
    </div>
  );
};

export default VideoPlayer;
