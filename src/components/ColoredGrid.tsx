'use client';

import { Container, Grid, Paper } from '@mantine/core';
import { useState, useEffect } from 'react';

const ImageBox = ({ 
  imageId, 
  isHovered, 
  onHover, 
  onLeave,
  delay 
}: { 
  imageId: number;
  isHovered: boolean;
  onHover: () => void;
  onLeave: () => void;
  delay: number;
}) => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <Paper
      shadow="sm"
      style={{
        position: 'relative',
        height: '140px',
        overflow: 'hidden',
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        transform: isHovered 
          ? 'scale(1.15) translateY(-0.5em)'
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
      onMouseLeave={onLeave}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url(https://picsum.photos/800/450?random=${imageId})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          filter: isHovered ? 'brightness(1)' : 'brightness(0.8)',
        }}
      />
    </Paper>
  );
};

const ColoredGrid = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [isPageLoaded, setIsPageLoaded] = useState(false);

  useEffect(() => {
    setIsPageLoaded(true);
  }, []);

  const gridItems = [
    { span: { base: 12, xs: 4 } },
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
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--background)',
      padding: '2rem',
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
              <ImageBox 
                imageId={index + 1}
                isHovered={hoveredIndex === index}
                onHover={() => setHoveredIndex(index)}
                onLeave={() => setHoveredIndex(null)}
                delay={100 + index * 100}
              />
            </Grid.Col>
          ))}
        </Grid>
      </Container>
    </div>
  );
};

export default ColoredGrid; 