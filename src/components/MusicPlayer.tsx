'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { IconHeart, IconLink, IconPlayerPause, IconPlayerPlay, IconPlayerSkipBack, IconPlayerSkipForward } from '@tabler/icons-react';

interface MusicPlayerProps {
  track: {
    name: string;
    artist: string;
    cover: string;
    source: string;
    url: string;
    favorited: boolean;
    youtubeId: string;
  };
}

const MusicPlayer = ({ track }: MusicPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState('00:00');
  const [currentTime, setCurrentTime] = useState('00:00');
  const [barWidth, setBarWidth] = useState('0%');

  const audioRef = useRef<HTMLAudioElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const width = (100 / audioRef.current.duration) * audioRef.current.currentTime;
      setBarWidth(`${width}%`);
      setCurrentTime(formatTime(audioRef.current.currentTime));
      setDuration(formatTime(audioRef.current.duration));
    }
  };

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (progressRef.current && audioRef.current) {
      const rect = progressRef.current.getBoundingClientRect();
      const position = e.clientX - rect.left;
      const percentage = (position / rect.width) * 100;
      const time = (audioRef.current.duration * percentage) / 100;
      audioRef.current.currentTime = time;
    }
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.src = track.source;
      if (isPlaying) {
        audioRef.current.play();
      }
    }
  }, [track.source]);

  return (
    <div className="wrapper">
      <div className="player">
        <div className="player__top">
          <div className="player-cover">
            <div className="player-cover__item">
              <Image
                src={track.cover}
                alt={track.name}
                fill
                style={{ objectFit: 'cover' }}
              />
            </div>
          </div>
          <div className="player-controls">
            <button className="player-controls__item" onClick={() => {}}>
              <IconHeart />
            </button>
            <a href={track.url} target="_blank" className="player-controls__item">
              <IconLink />
            </a>
            <button className="player-controls__item" onClick={() => {}}>
              <IconPlayerSkipBack />
            </button>
            <button className="player-controls__item" onClick={() => {}}>
              <IconPlayerSkipForward />
            </button>
            <button className="player-controls__item -xl" onClick={handlePlayPause}>
              {isPlaying ? <IconPlayerPause /> : <IconPlayerPlay />}
            </button>
          </div>
        </div>
        <div className="progress" ref={progressRef} onClick={handleProgressClick}>
          <div className="progress__top">
            <div className="album-info">
              <div className="album-info__name">{track.artist}</div>
              <div className="album-info__track">{track.name}</div>
            </div>
            <div className="progress__duration">{duration}</div>
          </div>
          <div className="progress__bar">
            <div className="progress__current" style={{ width: barWidth }}></div>
          </div>
          <div className="progress__time">{currentTime}</div>
        </div>
        <audio
          ref={audioRef}
          onTimeUpdate={handleTimeUpdate}
        />
      </div>
    </div>
  );
};

export default MusicPlayer; 