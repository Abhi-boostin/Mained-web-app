'use client';

import { Container, Grid, Paper, TextInput } from '@mantine/core';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import FloatingLyrics from './FloatingLyrics';
import { IconSearch } from '@tabler/icons-react';

const ImageBox = ({ 
  imageId, 
  isHovered, 
  onHover, 
  onLeave,
  delay,
  anyHovered,
  isMusicBox = false,
  onPlayingChange
}: { 
  imageId: number;
  isHovered: boolean;
  onHover: () => void;
  onLeave: () => void;
  delay: number;
  anyHovered: boolean;
  isMusicBox?: boolean;
  onPlayingChange?: (isPlaying: boolean) => void;
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

  useEffect(() => {
    setIsPageLoaded(true);
  }, []);

  const gridItems = [
    { span: { base: 12, xs: 4 }, isMusicBox: true },  // First item is music box
    { span: { base: 12, xs: 8 } },
    { span: { base: 12, xs: 8 } },
    { span: { base: 12, xs: 4 } },
    { span: { base: 12, xs: 3 } },
    { span: { base: 12, xs: 3 } },
    { span: { base: 12, xs: 6 } },
  ];

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      background: '#141414',
      overflow: 'hidden',
    }}>
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        padding: '1rem',
        background: '#000000',
        backdropFilter: 'blur(10px)',
        zIndex: 100,
      }}>
        <Container size="sm" style={{ maxWidth: '800px' }}>
          <TextInput
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.currentTarget.value)}
            leftSection={<IconSearch size={16} />}
            styles={{
              root: {
                width: '100%',
              },
              input: {
                backgroundColor: '#000000',
                color: '#ffffff',
                border: '1px solid #333',
                height: '45px',
                fontSize: '16px',
                '&:focus': {
                  borderColor: '#666',
                },
              },
              section: {
                color: '#666',
              },
            }}
          />
        </Container>
      </div>
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '5rem 2rem 2rem 2rem',
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
                  imageId={index + 1}
                  isHovered={hoveredIndex === index}
                  onHover={() => setHoveredIndex(index)}
                  onLeave={() => setHoveredIndex(null)}
                  delay={100 + index * 100}
                  anyHovered={hoveredIndex !== null}
                  isMusicBox={item.isMusicBox}
                  onPlayingChange={index === 0 ? setIsMusicPlaying : undefined}
                />
              </Grid.Col>
            ))}
          </Grid>
        </Container>
      </div>
    </div>
  );
};

export default ColoredGrid;