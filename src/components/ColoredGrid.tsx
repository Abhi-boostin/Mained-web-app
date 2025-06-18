'use client';

import { Container, Grid, Paper } from '@mantine/core';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
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
}

const ImageBox = ({ src, alt, isPlaying: isPlayingProp, onPlayingChange }: ImageBoxProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isPlayingState, setIsPlayingState] = useState(false);
  const [isLocked, setIsLocked] = useState(false);

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
          <div className="absolute bottom-2 right-2 text-white">
            {isLocked ? '🔒 Playing' : isPlayingState ? '▶ Playing' : '▶ Play'}
          </div>
        </>
      ) : null}
    </Paper>
  );
};

interface Track {
  name: string;
  artist: string | { name: string };
  image: Array<{ '#text': string }>;
  url: string;
  mbid?: string;
  youtubeId?: string;
}

interface FormattedTrack {
  name: string;
  artist: string;
  image: string;
  url: string;
  mbid?: string;
  youtubeId?: string;
}

const ColoredGrid = () => {
  const [isPageLoaded, setIsPageLoaded] = useState(false);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [gridItems] = useState([
    {
      span: { base: 12, xs: 14 },
      image: 'https://cdn.oneesports.gg/cdn-data/2024/02/Jujutsu_Kaisen_Toji_Zenin-1.jpg',
      link: 'https://github.com/Abhi-boostin'
    }
  ]);
  const [topTracks, setTopTracks] = useState<FormattedTrack[]>([]);
  const [selectedYoutubeId, setSelectedYoutubeId] = useState<string | null>(null);
  const [isYoutubePlayerVisible, setIsYoutubePlayerVisible] = useState(false);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsPageLoaded(true);
    setIsLoading(true);
    
    // Check if API key exists
    const lastfmKey = process.env.NEXT_PUBLIC_LASTFM_API_KEY;
    if (!lastfmKey) {
      setError('LastFM API key not configured');
      setIsLoading(false);
      return;
    }

    getWeeklyTopTracks()
      .then((tracks: Track[]) => {
        if (!tracks || tracks.length === 0) {
          setError('No tracks available');
          return;
        }
        const formattedTracks: FormattedTrack[] = tracks.map((track: Track) => ({
          name: track.name,
          artist: typeof track.artist === 'string' ? track.artist : track.artist.name,
          image: Array.isArray(track.image) && track.image.length > 0 ? track.image[0]['#text'] : '',
          url: track.url,
          mbid: track.mbid
        }));
        setTopTracks(formattedTracks);
      })
      .catch((err) => {
        console.error('Error fetching tracks:', err);
        setError('Failed to load tracks. Please check your internet connection.');
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const handleTrackClick = async (track: FormattedTrack) => {
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

        localStorage.setItem('currentTrack', JSON.stringify(playerTrack));
        router.push('/player');
        router.refresh();
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
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      width: '100%',
      height: '100%',
      overflowY: 'auto',
      margin: 0,
      padding: 0
    }}>
      <SearchBar />
      {error && (
        <div style={{ 
          color: 'white', 
          textAlign: 'center', 
          padding: '20px',
          background: 'rgba(255, 0, 0, 0.1)',
          margin: '20px',
          borderRadius: '8px',
          fontSize: '16px',
          zIndex: 1
        }}>
          {error}
          <div style={{ marginTop: '10px', fontSize: '14px', opacity: 0.8 }}>
            Please make sure all environment variables are configured properly.
          </div>
        </div>
      )}
      {isLoading && (
        <div style={{ 
          color: 'white', 
          textAlign: 'center', 
          padding: '20px' 
        }}>
          Loading...
        </div>
      )}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: 'clamp(1rem, 5vw, 5rem) clamp(1rem, 3vw, 2rem)',
        overflowY: 'auto',
        width: '100%',
        height: '100%',
        position: 'relative',
        zIndex: 1,
        marginTop: '5rem'
      }}>
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
                <div onClick={() => window.open(item.link, '_blank')} style={{ cursor: 'pointer', width: '100%', height: '100%' }}>
                  <ImageBox 
                    src={item.image}
                    alt={item.image}
                    isPlaying={isMusicPlaying}
                    onPlayingChange={index === 0 ? setIsMusicPlaying : undefined}
                  />
                </div>
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