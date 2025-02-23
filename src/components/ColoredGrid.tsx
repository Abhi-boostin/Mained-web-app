'use client';

import { Container, Grid, Paper, TextInput } from '@mantine/core';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import FloatingLyrics from './FloatingLyrics';
import { IconSearch } from '@tabler/icons-react';
import SearchBar from './SearchBar';
import { getWeeklyTopTracks } from '@/utils/lastfm';
import { LastFmTrack } from '@/utils/lastfm';
import { getYoutubeVideoId } from '@/utils/youtube';
import { useRouter } from 'next/navigation';

interface ImageBoxProps {
  src?: string;
  alt?: string;
  isPlaying?: boolean;
  onPlayingChange?: (isPlaying: boolean) => void;
  track?: LastFmTrack;
}

const ImageBox = ({ src, alt, isPlaying: isPlayingProp, onPlayingChange, track }: ImageBoxProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isPlayingState, setIsPlayingState] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isPlayingProp) {
      setIsPlayingState(true);
    }
  }, [isPlayingProp]);

  useEffect(() => {
    if (onPlayingChange) {
      onPlayingChange(isPlayingState);
    }
  }, [isPlayingState, onPlayingChange]);

  const handleClick = () => {
    if (isPlayingState) {
      if (isLocked) {
        setIsLocked(false);
        setIsPlayingState(false);
      } else {
        setIsLocked(true);
        setIsPlayingState(true);
      }
    }
  };

  const handleMouseLeave = () => {
    if (!isLocked) {
      setIsPlayingState(false);
    }
  };

  return (
    <Paper
      className="card"
      style={{
        position: 'relative',
        height: '160px',
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        transform: isPlayingState 
          ? 'scale(1.2) translateY(-1em)'
          : isLoaded 
            ? 'scale(1)' 
            : 'scale(0.95)',
        opacity: isLoaded ? 1 : 0,
        boxShadow: isPlayingState 
          ? '0 25px 30px -12px rgba(0, 0, 0, 0.3)'
          : '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        zIndex: isPlayingState ? 2 : 1,
      }}
      onClick={handleClick}
      onMouseLeave={handleMouseLeave}
    >
      {src ? (
        <>
          <div style={{ position: 'relative', width: '100%', height: '100%' }}>
            <Image
              src={src}
              alt={alt || 'Music cover'}
              fill
              style={{
                objectFit: 'cover',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
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
            src={isPlayingState ? 
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
            {isLocked ? '🔒 Playing' : isPlayingState ? '▶ Playing' : '▶ Play'}
          </div>
        </>
      ) : (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url(${track?.image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
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
  const [gridItems] = useState([
    { 
      span: { base: 12, xs: 4 }, 
      isMusicBox: true,
      image: 'https://picsum.photos/800/600?random=1'
    },
    { 
      span: { base: 12, xs: 8 },
      image: 'https://picsum.photos/800/600?random=2'
    },
    { 
      span: { base: 12, xs: 8 },
      image: 'https://picsum.photos/800/600?random=3'
    },
    { 
      span: { base: 12, xs: 4 },
      image: 'https://picsum.photos/800/600?random=4'
    },
    { 
      span: { base: 12, xs: 3 },
      image: 'https://picsum.photos/800/600?random=5'
    },
    { 
      span: { base: 12, xs: 3 },
      image: 'https://picsum.photos/800/600?random=6'
    },
    { 
      span: { base: 12, xs: 6 },
      image: 'https://picsum.photos/800/600?random=7'
    }
  ]);
  const [topTracks, setTopTracks] = useState<LastFmTrack[]>([]);
  const [selectedYoutubeId, setSelectedYoutubeId] = useState<string | null>(null);
  const [isYoutubePlayerVisible, setIsYoutubePlayerVisible] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsPageLoaded(true);
    // Fetch top tracks when component mounts
    getWeeklyTopTracks().then(tracks => {
      // Ensure tracks have the correct structure
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

  const handleSearch = async (track: LastFmTrack & { youtubeId?: string }) => {
    try {
      if (track.youtubeId) {
        setSelectedYoutubeId(track.youtubeId);
        setIsYoutubePlayerVisible(true);
      }
    } catch (error) {
      console.error('Error handling search:', error);
    }
  };

  const handleTrackClick = async (track: LastFmTrack) => {
    try {
      const videoId = await getYoutubeVideoId(track.name, track.artist);
      if (videoId) {
        const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
        
        const playerTrack = {
          name: track.name,
          artist: track.artist,
          cover: thumbnailUrl,
          youtubeId: videoId,
          favorited: false,
          url: `https://youtube.com/watch?v=${videoId}`
        };

        // Store track data in localStorage
        localStorage.setItem('currentTrack', JSON.stringify(playerTrack));
        
        // Use router.push with a complete URL
        router.push('/player');
        router.refresh(); // Force a refresh to ensure the player loads new data
      }
    } catch (error) {
      console.error('Error getting YouTube video:', error);
    }
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
      <SearchBar />
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: 'clamp(1rem, 5vw, 5rem) clamp(1rem, 3vw, 2rem)',
        overflowY: 'auto',
      }}>
        <FloatingLyrics isVisible={hoveredIndex === 0 || isMusicPlaying} />
        <Container 
          size="sm"
          style={{
            maxWidth: '800px',
            width: '100%',
            margin: '0 auto',
            transform: isPageLoaded ? 'translateY(0)' : 'translateY(20px)',
            opacity: isPageLoaded ? 1 : 0,
            transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        >
          <Grid gutter="md">
            {gridItems.map((item, index) => (
              <Grid.Col key={index} span={item.span}>
                <ImageBox 
                  src={item.image}
                  alt={item.image}
                  isPlaying={isMusicPlaying}
                  onPlayingChange={index === 0 ? setIsMusicPlaying : undefined}
                />
              </Grid.Col>
            ))}
          </Grid>
        </Container>

        <div
          style={{
            marginTop: '4rem',
            marginBottom: '4rem',
            textAlign: 'center',
            opacity: isPageLoaded ? 1 : 0,
            transform: isPageLoaded ? 'translateY(0)' : 'translateY(20px)',
            transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        >
          <h2 
            style={{ 
              fontSize: '32px', 
              fontWeight: 'bold',
              background: 'linear-gradient(45deg, #ff6b6b, #ff0000)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              marginBottom: '1.5rem',
              fontFamily: 'BenguiatBold',
              textTransform: 'uppercase',
              letterSpacing: '2px',
              textShadow: '2px 2px 4px rgba(255, 0, 0, 0.2)'
            }}
          >
            Weekly Top Tracks
          </h2>
          <div style={{ color: '#fff' }}>
            {topTracks.map((track, index) => (
              <div 
                key={index}
                onClick={() => handleTrackClick(track)}
                style={{
                  fontSize: '16px',
                  fontWeight: 'bold',
                  margin: '0.8rem 0',
                  opacity: 0.8,
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  fontFamily: 'BenguiatBold',
                  padding: '0.5rem',
                  borderRadius: '4px',
                  background: 'transparent',
                  '&:hover': {
                    opacity: 1,
                    background: 'rgba(255, 0, 0, 0.1)',
                    transform: 'translateX(10px)'
                  }
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.opacity = '1';
                  e.currentTarget.style.transform = 'translateX(10px)';
                  e.currentTarget.style.background = 'rgba(255, 0, 0, 0.1)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.opacity = '0.8';
                  e.currentTarget.style.transform = 'translateX(0)';
                  e.currentTarget.style.background = 'transparent';
                }}
              >
                {index + 1}. {track.name} - {track.artist}
              </div>
            ))}
          </div>
        </div>  
        {isYoutubePlayerVisible && selectedYoutubeId && (
          <div style={{
            width: '100%',
            maxWidth: '800px',
            margin: '2rem auto',
            aspectRatio: '16/9',
            borderRadius: '8px',
            overflow: 'hidden',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          }}>
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${selectedYoutubeId}?autoplay=1`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{
                border: 'none',
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ColoredGrid;