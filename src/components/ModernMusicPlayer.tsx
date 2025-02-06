'use client';

import { useState, useEffect } from 'react';
import { IconPlayerPlay, IconPlayerPause, IconPlayerSkipForward, IconPlayerSkipBack, IconHeart } from '@tabler/icons-react';
import '@/styles/ModernMusicPlayer.css';

interface Track {
  name: string;
  artist: string;
  cover: string;
  youtubeId: string;
}

const ModernMusicPlayer = () => {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [youtubePlayer, setYoutubePlayer] = useState<any>(null);
  const [isFavorited, setIsFavorited] = useState(false);

  useEffect(() => {
    const savedTrack = localStorage.getItem('currentTrack');
    if (savedTrack) {
      const track = JSON.parse(savedTrack);
      setCurrentTrack(track);
      
      // Load YouTube IFrame API
      if (!window.YT) {
        const tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';
        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

        window.onYouTubeIframeAPIReady = () => {
          initializeYoutubePlayer(track.youtubeId);
        };
      } else {
        initializeYoutubePlayer(track.youtubeId);
      }
    }
  }, []);

  const initializeYoutubePlayer = (videoId: string) => {
    if (!videoId) return;

    const player = new window.YT.Player('youtube-player', {
      videoId,
      events: {
        onStateChange: (event: any) => {
          setIsPlaying(event.data === window.YT.PlayerState.PLAYING);
          if (event.data === window.YT.PlayerState.PLAYING) {
            startProgressUpdate();
          }
        },
        onReady: (event: any) => {
          setYoutubePlayer(event.target);
          setDuration(event.target.getDuration());
          setIsPlaying(true);
          event.target.playVideo(); // Auto play when ready
        }
      }
    });
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!youtubePlayer) return;
    
    const progressBar = e.currentTarget;
    const bounds = progressBar.getBoundingClientRect();
    const x = e.clientX - bounds.left;
    const width = bounds.width;
    const percentage = x / width;
    
    const newTime = percentage * duration;
    youtubePlayer.seekTo(newTime);
    setProgress(percentage * 100);
  };

  const startProgressUpdate = () => {
    const interval = setInterval(() => {
      if (youtubePlayer && youtubePlayer.getCurrentTime) {
        const currentTime = youtubePlayer.getCurrentTime();
        const duration = youtubePlayer.getDuration();
        setProgress((currentTime / duration) * 100);
      }
    }, 1000);

    return () => clearInterval(interval);
  };

  const handlePlayPause = () => {
    if (youtubePlayer) {
      if (isPlaying) {
        youtubePlayer.pauseVideo();
        setIsPlaying(false);
      } else {
        youtubePlayer.playVideo();
        setIsPlaying(true);
      }
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="modern-player">
      <div className="modern-player__artwork" style={{ backgroundImage: `url(${currentTrack?.cover})` }}>
        <div className="modern-player__backdrop" />
      </div>
      
      <div className="modern-player__controls">
        <div className="modern-player__info">
          <h2>{currentTrack?.name}</h2>
          <h3>{currentTrack?.artist}</h3>
        </div>

        <div className="modern-player__progress">
          <div 
            className="progress-bar" 
            onClick={handleProgressClick}
            style={{ cursor: 'pointer' }}
          >
            <div 
              className="progress-bar__fill" 
              style={{ width: `${progress}%` }} 
            />
          </div>
          <div className="progress-time">
            {youtubePlayer && (
              <>
                <span>{formatTime(youtubePlayer.getCurrentTime() || 0)}</span>
                <span>{formatTime(duration)}</span>
              </>
            )}
          </div>
        </div>

        <div className="modern-player__buttons">
          <button className="control-button" onClick={() => setIsFavorited(!isFavorited)}>
            <IconHeart className={isFavorited ? 'favorited' : ''} />
          </button>
          <button className="control-button">
            <IconPlayerSkipBack />
          </button>
          <button className="control-button main" onClick={handlePlayPause}>
            {isPlaying ? <IconPlayerPause /> : <IconPlayerPlay />}
          </button>
          <button className="control-button">
            <IconPlayerSkipForward />
          </button>
        </div>
      </div>
      
      <div id="youtube-player" className="hidden-player" />
    </div>
  );
};

export default ModernMusicPlayer; 