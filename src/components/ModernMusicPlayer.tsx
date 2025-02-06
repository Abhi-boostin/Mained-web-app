'use client';

import { useState, useEffect } from 'react';
import { IconPlayerPlay, IconPlayerPause, IconPlayerSkipForward, IconPlayerSkipBack, IconHeart, IconMicrophone } from '@tabler/icons-react';
import '@/styles/ModernMusicPlayer.css';
import Lyrics from './Lyrics';

interface Track {
  name: string;
  artist: string;
  cover: string;
  youtubeId: string;
}

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

const ModernMusicPlayer = () => {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [youtubePlayer, setYoutubePlayer] = useState<any>(null);
  const [isFavorited, setIsFavorited] = useState(false);
  const [showLyrics, setShowLyrics] = useState(false);
  const [progressInterval, setProgressInterval] = useState<NodeJS.Timer | null>(null);
  const [isPlayerReady, setIsPlayerReady] = useState(false);

  useEffect(() => {
    const loadYouTubeAPI = () => {
      return new Promise<void>((resolve) => {
        if (window.YT) {
          resolve();
          return;
        }

        const tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';
        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

        window.onYouTubeIframeAPIReady = () => {
          resolve();
        };
      });
    };

    const initializePlayer = async () => {
      const savedTrack = localStorage.getItem('currentTrack');
      if (!savedTrack) return;

      const track = JSON.parse(savedTrack);
      setCurrentTrack(track);

      try {
        await loadYouTubeAPI();

        const player = new window.YT.Player('youtube-player', {
          width: '200',
          height: '200',
          videoId: track.youtubeId,
          playerVars: {
            autoplay: 1,
            controls: 0,
            disablekb: 1,
            fs: 0,
            rel: 0,
            modestbranding: 1,
            playsinline: 1,
            origin: window.location.origin,
            enablejsapi: 1,
            host: 'https://www.youtube.com'
          },
          events: {
            onReady: (event: any) => {
              setYoutubePlayer(event.target);
              setDuration(event.target.getDuration());
              setIsPlayerReady(true);
              event.target.playVideo();
              startProgressUpdate();
            },
            onStateChange: (event: any) => {
              if (event.data === window.YT.PlayerState.PLAYING) {
                setIsPlaying(true);
                startProgressUpdate();
              } else if (event.data === window.YT.PlayerState.PAUSED) {
                setIsPlaying(false);
                stopProgressUpdate();
              } else if (event.data === window.YT.PlayerState.ENDED) {
                setIsPlaying(false);
                stopProgressUpdate();
                setProgress(0);
              }
            },
            onError: (event: any) => {
              console.error('YouTube player error:', event.data);
              if (event.data === 150) {
                window.open(`https://www.youtube.com/watch?v=${track.youtubeId}`, '_blank');
              }
              stopProgressUpdate();
            }
          }
        });
      } catch (error) {
        console.error('Error initializing player:', error);
      }
    };

    initializePlayer();

    return () => {
      stopProgressUpdate();
      if (youtubePlayer) {
        youtubePlayer.destroy();
      }
    };
  }, []);

  const startProgressUpdate = () => {
    console.log('Starting progress updates');
    if (progressInterval) {
      clearInterval(progressInterval);
    }
    
    const interval = setInterval(() => {
      if (youtubePlayer && typeof youtubePlayer.getCurrentTime === 'function') {
        try {
          const currentTime = youtubePlayer.getCurrentTime();
          const totalDuration = youtubePlayer.getDuration();
          
          console.log('Current time:', currentTime, 'Duration:', totalDuration);
          
          if (isNaN(currentTime) || isNaN(totalDuration)) {
            console.warn('Invalid time values:', { currentTime, totalDuration });
            return;
          }
          
          if (totalDuration !== duration) {
            setDuration(totalDuration);
          }
          
          const progressPercentage = (currentTime / totalDuration) * 100;
          setProgress(progressPercentage);
        } catch (error) {
          console.error('Error updating progress:', error);
          stopProgressUpdate();
        }
      }
    }, 100);
    
    setProgressInterval(interval);
  };

  const stopProgressUpdate = () => {
    if (progressInterval) {
      clearInterval(progressInterval);
      setProgressInterval(null);
    }
  };

  const handlePlayPause = () => {
    if (!youtubePlayer || !isPlayerReady) {
      console.error('YouTube player not initialized or not ready');
      return;
    }
    
    try {
      if (isPlaying) {
        youtubePlayer.pauseVideo();
        stopProgressUpdate();
      } else {
        youtubePlayer.playVideo();
        startProgressUpdate();
      }
    } catch (error) {
      console.error('Error in handlePlayPause:', error);
    }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!youtubePlayer || !duration || !isPlayerReady) return;
    
    try {
      const progressBar = e.currentTarget;
      const rect = progressBar.getBoundingClientRect();
      const clickPosition = e.clientX - rect.left;
      const progressBarWidth = rect.width;
      const percentage = (clickPosition / progressBarWidth) * 100;
      const seekTime = (duration * percentage) / 100;
      
      // Log for debugging
      console.log('Seeking to:', seekTime, 'seconds');
      
      youtubePlayer.seekTo(seekTime, true);
      setProgress(percentage);
    } catch (error) {
      console.error('Error in handleProgressClick:', error);
    }
  };

  const formatTime = (time: number) => {
    if (!time || isNaN(time)) return '0:00';
    
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (!currentTrack) return null;

  return (
    <div className="modern-player">
      <div 
        className="modern-player__artwork"
        style={{ backgroundImage: `url(${currentTrack.cover})` }}
      >
        <div className="modern-player__backdrop" />
      </div>
      
      <div className="modern-player__controls">
        <div className="modern-player__info">
          <h2>{currentTrack.name}</h2>
          <h3>{currentTrack.artist}</h3>
        </div>

        <div className="modern-player__progress">
          <div 
            className="progress-bar" 
            onClick={handleProgressClick}
          >
            <div 
              className="progress-bar__fill" 
              style={{ width: `${progress}%` }} 
            />
          </div>
          <div className="progress-time">
            {youtubePlayer && isPlayerReady && (
              <>
                <span>
                  {formatTime(youtubePlayer.getCurrentTime?.() || 0)}
                </span>
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
          <button className="control-button lyrics" onClick={() => setShowLyrics(true)}>
            <IconMicrophone />
          </button>
        </div>
      </div>
      
      <div id="youtube-player" className="hidden-player" />

      <Lyrics 
        isOpen={showLyrics}
        onClose={() => setShowLyrics(false)}
        trackName={currentTrack.name}
        artistName={currentTrack.artist}
      />
    </div>
  );
};

export default ModernMusicPlayer; 