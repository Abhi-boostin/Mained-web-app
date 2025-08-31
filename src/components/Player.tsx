"use client";

import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { YouTubeEvent } from "@/types/track";
import YouTubePlayer from "./player/YouTubePlayer";
import PlayerInfo from "./player/PlayerInfo";
import PlayerControls from "./player/PlayerControls";
import ActionButtons from "./player/ActionButtons";
import PlayerPanels from "./player/PlayerPanels";

interface PlayerProps {
  videoId: string;
  name: string;
  artist: string;
}

export default function Player({ videoId, name, artist }: PlayerProps) {
  const [showLyrics, setShowLyrics] = useState(false);
  const [lyrics, setLyrics] = useState<string>("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [current, setCurrent] = useState({ videoId, name, artist });
  const [showQueue, setShowQueue] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const playerRef = useRef<YouTubeEvent['target'] | null>(null);

  useEffect(() => {
    setCurrent({ videoId, name, artist });
  }, [videoId, name, artist]);

  const fetchLyrics = async () => {
    if (lyrics) {
      setShowLyrics(!showLyrics);
      return;
    }
    
    setShowLyrics(true);
    try {
      const response = await axios.get(`/api/lyrics?q=${encodeURIComponent(`${name} ${artist}`)}`);
      setLyrics(response.data.lyrics || 'Lyrics not available');
    } catch (error) {
      console.error('Failed to fetch lyrics:', error);
      setLyrics('Failed to load lyrics');
    }
  };

  const handlePlayerReady = (event: YouTubeEvent) => {
    playerRef.current = event.target;
    setIsPlaying(true);
  };

  const handleStateChange = (event: YouTubeEvent) => {
    // YouTube player states: -1 (unstarted), 0 (ended), 1 (playing), 2 (paused), 3 (buffering), 5 (video cued)
    if (event.data === 0) {
      // Song ended, play next
      handleNext();
    } else if (event.data === 1) {
      setIsPlaying(true);
    } else if (event.data === 2) {
      setIsPlaying(false);
    }
  };

  const togglePlayPause = () => {
    if (playerRef.current) {
      if (isPlaying) {
        playerRef.current.pauseVideo();
      } else {
        playerRef.current.playVideo();
      }
    }
  };

  const handleNext = () => {
    // For now, just restart current song
    if (playerRef.current) {
      playerRef.current.seekTo(0);
      playerRef.current.playVideo();
    }
  };

  const handlePrevious = () => {
    if (playerRef.current) {
      playerRef.current.seekTo(0);
      playerRef.current.playVideo();
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto text-center space-y-6">
      <YouTubePlayer
        videoId={videoId}
        onReady={handlePlayerReady}
        onStateChange={handleStateChange}
      />

      <PlayerInfo name={current.name} artist={current.artist} />
      
      <PlayerControls
        isPlaying={isPlaying}
        onPlayPause={togglePlayPause}
        onNext={handleNext}
        onPrevious={handlePrevious}
      />

      <ActionButtons
        showLyrics={showLyrics}
        showQueue={showQueue}
        showInfo={showInfo}
        onToggleLyrics={fetchLyrics}
        onToggleQueue={() => setShowQueue(!showQueue)}
        onToggleInfo={() => setShowInfo(!showInfo)}
      />

      <PlayerPanels
        showLyrics={showLyrics}
        showQueue={showQueue}
        showInfo={showInfo}
        lyrics={lyrics}
        trackName={current.name}
        trackArtist={current.artist}
        isPlaying={isPlaying}
      />
    </div>
  );
} 