"use client";

import YouTube from "react-youtube";
import { useMemo } from "react";
import { YouTubeEvent } from "@/types/track";

interface YouTubePlayerProps {
  videoId: string;
  onReady: (event: YouTubeEvent) => void;
  onStateChange: (event: YouTubeEvent) => void;
}

export default function YouTubePlayer({ videoId, onReady, onStateChange }: YouTubePlayerProps) {
  const opts = useMemo(
    () => ({
      height: "0",
      width: "0",
      playerVars: { 
        autoplay: 1, 
        controls: 0,
        disablekb: 1,
        fs: 0,
        iv_load_policy: 3,
        modestbranding: 1,
        rel: 0
      },
    }),
    []
  );

  return (
    <div className="hidden">
      <YouTube
        videoId={videoId}
        opts={opts}
        onReady={onReady}
        onStateChange={onStateChange}
      />
    </div>
  );
} 