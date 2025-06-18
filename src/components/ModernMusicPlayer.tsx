'use client';

import { useState, useEffect, useRef } from 'react';
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
  const [currentTime, setCurrentTime] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [isPlayerReady, setIsPlayerReady] = useState(false);
  const [playerError, setPlayerError] = useState(false);

  const isMobile = () => {
    if (typeof navigator === 'undefined') return false;
    return /Mobi|Android|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i.test(navigator.userAgent);
  };

  useEffect(() => {
    const loadYouTubeAPI = () => {
      return new Promise<void>((resolve) => {
        if (window.YT) {
          resolve();
          return;
        }
        const tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';
        document.body.appendChild(tag);
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

      if (isMobile()) {
        // On mobile, open in new tab and show a message
        window.open(`https://m.youtube.com/watch?v=${track.youtubeId}`, '_blank');
        setTimeout(() => {
          setCurrentTrack(null);
        }, 1000);
        return;
      }

      try {
        await loadYouTubeAPI();
        const player = new window.YT.Player('youtube-player', {
          width: '200',
          height: '200',
          videoId: track.youtubeId,
          playerVars: {
            autoplay: 1,
            controls: 1,
            rel: 0,
            modestbranding: 1,
            playsinline: 1,
            origin: window.location.origin,
            enablejsapi: 1,
            host: 'https://www.youtube.com',
            mute: 0,
            showinfo: 0,
            iv_load_policy: 3
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
                setCurrentTime(0);
              }
            },
            onError: (event: any) => {
              setPlayerError(true);
              stopProgressUpdate();
            }
          }
        });
      } catch (error) {
        setPlayerError(true);
      }
    };

    initializePlayer();

    return () => {
      stopProgressUpdate();
      if (youtubePlayer && typeof youtubePlayer.destroy === 'function') {
        try {
          // Only destroy if the iframe is still in the DOM
          const iframe = youtubePlayer.getIframe && youtubePlayer.getIframe();
          if (iframe && iframe.parentNode) {
            youtubePlayer.destroy();
          }
        } catch (e) {
          // Ignore errors if already destroyed or node is missing
        }
      }
    };
  }, []);

  const startProgressUpdate = () => {
    console.log('Starting progress updates');
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    const interval = setInterval(() => {
      if (youtubePlayer?.getCurrentTime && isPlayerReady) {
        try {
          const current = youtubePlayer.getCurrentTime();
          const total = youtubePlayer.getDuration();
          
          if (!isNaN(current) && !isNaN(total) && total > 0) {
            setCurrentTime(current);
            setProgress((current / total) * 100);
            
            if (total !== duration) {
              setDuration(total);
            }
          }
        } catch (error) {
          console.error('Error in progress update:', error);
        }
      }
    }, 100); // Update 10 times per second for smoother updates
    
    intervalRef.current = interval;
  };

  const stopProgressUpdate = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
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

  // Add touch event handling for progress bar
  const handleProgressInteraction = (e: React.MouseEvent | React.TouchEvent) => {
    if (!youtubePlayer || !duration || !isPlayerReady) return;
    
    try {
      const progressBar = e.currentTarget;
      const rect = progressBar.getBoundingClientRect();
      const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
      const clickPosition = clientX - rect.left;
      const progressBarWidth = rect.width;
      const percentage = (clickPosition / progressBarWidth) * 100;
      const seekTime = (duration * percentage) / 100;
      
      youtubePlayer.seekTo(seekTime, true);
      setProgress(percentage);
    } catch (error) {
      console.error('Error in progress interaction:', error);
    }
  };

  const formatTime = (time: number) => {
    if (!time || isNaN(time)) return '0:00';
    
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (playerError) {
    return (
      <div className="modern-player-error">
        <p>Playback is not supported on this device or browser. Please open the song in the YouTube app or try on desktop.</p>
      </div>
    );
  }
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
            onClick={handleProgressInteraction}
            onTouchStart={handleProgressInteraction}
            role="slider"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={progress}
          >
            <div 
              className="progress-bar__fill" 
              style={{ width: `${progress}%` }} 
            />
          </div>
          <div className="progress-time">
            {youtubePlayer && isPlayerReady && (
              <>
                <span>{formatTime(currentTime)}</span>
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