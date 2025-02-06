'use client';

import { Container, Grid, Paper, TextInput } from '@mantine/core';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import FloatingLyrics from './FloatingLyrics';
import { IconSearch } from '@tabler/icons-react';
import SearchBar from './SearchBar';
import { SoundCloudTrack } from '@/utils/soundcloud';
import { getWeeklyTopTracks } from '@/utils/lastfm';
import { LastFmTrack } from '@/utils/lastfm';

const ImageBox = ({ 
  imageId, 
  isHovered, 
  onHover, 
  onLeave,
  delay,
  anyHovered,
  isMusicBox = false,
  onPlayingChange,
  track
}: { 
  imageId: number;
  isHovered: boolean;
  onHover: () => void;
  onLeave: () => void;
  delay: number;
  anyHovered: boolean;
  isMusicBox?: boolean;
  onPlayingChange?: (isPlaying: boolean) => void;
  track?: SoundCloudTrack;
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, delay);
    return () => clearTimeout(timer);
  }, [delay]);

  useEffect(() => {
    if (isMusicBox && !isLocked) {
      setIsPlaying(isHovered);
    }
  }, [isHovered, isMusicBox, isLocked]);

  useEffect(() => {
    if (isMusicBox) {
      onPlayingChange?.(isPlaying);
    }
  }, [isPlaying, isMusicBox, onPlayingChange]);

  const handleClick = () => {
    if (isMusicBox) {
      if (isLocked) {
        setIsLocked(false);
        setIsPlaying(false);
      } else {
        setIsLocked(true);
        setIsPlaying(true);
      }
    }
  };

  const handleMouseLeave = () => {
    onLeave();
    if (isMusicBox && !isLocked) {
      setIsPlaying(false);
    }
  };

  return (
    <Paper
      className="card"
      style={{
        position: 'relative',
        height: '160px',
        overflow: 'hidden',
        cursor: isMusicBox ? 'pointer' : 'default',
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        transform: isHovered 
          ? 'scale(1.2) translateY(-1em)'
          : isLoaded 
            ? 'scale(1)' 
            : 'scale(0.95)',
        opacity: isLoaded ? 1 : 0,
        boxShadow: isHovered 
          ? '0 25px 30px -12px rgba(0, 0, 0, 0.3)'
          : '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        zIndex: isHovered ? 2 : 1,
      }}
      onMouseEnter={onHover}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      {isMusicBox ? (
        <>
          <div style={{ position: 'relative', width: '100%', height: '100%' }}>
            <Image
              src="/images/images.jpeg"
              alt="Album Cover"
              fill
              style={{
                objectFit: 'cover',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                filter: !anyHovered ? 'brightness(0.5)' : 
                        isHovered ? 'brightness(1)' : 
                        'brightness(0.25)',
              }}
            />
          </div>
          <iframe
            ref={iframeRef}
            width="100%"
            height="100%"
            scrolling="no"
            frameBorder="no"
            allow="autoplay"
            src={isPlaying ? 
              "https://w.soundcloud.com/player/?url=https%3A//soundcloud.com/suicidal-idol/ecstacy-slowed&auto_play=true" : 
              "about:blank"
            }
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              opacity: 0,
              pointerEvents: 'none',
            }}
          />
          <div className="absolute bottom-2 right-2 text-white">
            {isLocked ? '🔒 Playing' : isPlaying ? '▶ Playing' : '▶ Play'}
          </div>
        </>
      ) : (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url(https://picsum.photos/800/450?random=${imageId})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            filter: !anyHovered ? 'brightness(0.5)' : 
                    isHovered ? 'brightness(1)' : 
                    'brightness(0.25)',
          }}
        />
      )}
    </Paper>
  );
};

const ColoredGrid = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [isPageLoaded, setIsPageLoaded] = useState(false);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [gridItems, setGridItems] = useState<{ span: { base: number; xs: number }; isMusicBox: boolean; track?: SoundCloudTrack }[]>([
    { span: { base: 12, xs: 4 }, isMusicBox: true },  // First item is music box
    { span: { base: 12, xs: 8 } },
    { span: { base: 12, xs: 8 } },
    { span: { base: 12, xs: 4 } },
    { span: { base: 12, xs: 3 } },
    { span: { base: 12, xs: 3 } },
    { span: { base: 12, xs: 6 } },
  ]);
  const [topTracks, setTopTracks] = useState<LastFmTrack[]>([]);
  const [visibleTracks, setVisibleTracks] = useState<number>(0);
  const topTracksRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsPageLoaded(true);
    getWeeklyTopTracks().then(tracks => {
      const formattedTracks = tracks.map(track => ({
        name: track.name,
        artist: typeof track.artist === 'string' ? track.artist : track.artist.name,
        image: track.image,
        url: track.url,
        mbid: track.mbid
      }));
      setTopTracks(formattedTracks);
    });
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            // Gradually reveal tracks when section is visible
            const interval = setInterval(() => {
              setVisibleTracks(prev => {
                if (prev < topTracks.length) return prev + 1;
                clearInterval(interval);
                return prev;
              });
            }, 100);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.1 }
    );

    if (topTracksRef.current) {
      observer.observe(topTracksRef.current);
    }

    return () => observer.disconnect();
  }, [topTracks.length]);

  const handleSearch = async (tracks: SoundCloudTrack[]) => {
    // Update grid items with search results
    const newGridItems = tracks.map(track => ({
      span: { base: 12, xs: 4 },
      isMusicBox: true,
      track: track
    }));
    
    setGridItems(newGridItems);
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      background: '#141414',
      position: 'relative',
      overflowY: 'auto',
      height: '100vh',
    }}>
      <SearchBar onSearch={handleSearch} />
      <Container 
        size="sm"
        style={{
          maxWidth: '800px',
          width: '100%',
          margin: '6rem auto 2rem',
          paddingBottom: '4rem',
          transform: isPageLoaded ? 'translateY(0)' : 'translateY(20px)',
          opacity: isPageLoaded ? 1 : 0,
          transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        <Grid gutter="md">
          {gridItems.map((item, index) => (
            <Grid.Col key={index} span={item.span}>
              <ImageBox 
                imageId={index + 1}
                isHovered={hoveredIndex === index}
                onHover={() => setHoveredIndex(index)}
                onLeave={() => setHoveredIndex(null)}
                delay={100 + index * 100}
                anyHovered={hoveredIndex !== null}
                track={item.track}
                onPlayingChange={index === 0 ? setIsMusicPlaying : undefined}
              />
            </Grid.Col>
          ))}
        </Grid>
      </Container>

      {/* Top Tracks Section */}
      <div
        ref={topTracksRef}
        style={{
          padding: '2rem',
          marginTop: '2rem',
          marginBottom: '4rem',
          textAlign: 'center',
          opacity: isPageLoaded ? 1 : 0,
          transform: isPageLoaded ? 'translateY(0)' : 'translateY(20px)',
          transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        <h2 
          style={{ 
            fontSize: '36px',
            fontWeight: 'bold',
            fontFamily: 'BenguiatBold',
            background: 'linear-gradient(180deg, #ff0000 0%, #300000 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '1.5rem'
          }}
        >
          Weekly Top Tracks
        </h2>
        <div style={{ color: '#fff' }}>
          {topTracks.slice(0, visibleTracks).map((track, index) => (
            <div 
              key={index}
              style={{
                fontSize: '16px',
                fontWeight: 'bold',
                margin: '0.5rem 0',
                opacity: 0.8,
                transform: `translateY(${20 * (1 - Math.min(1, (index + 1) / visibleTracks))}px)`,
                transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                cursor: 'pointer',
              }}
              onMouseEnter={e => e.currentTarget.style.opacity = '1'}
              onMouseLeave={e => e.currentTarget.style.opacity = '0.8'}
            >
              {index + 1}. {track.name} - {track.artist}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ColoredGrid;