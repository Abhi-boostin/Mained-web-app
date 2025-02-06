'use client';

import { useState, useEffect } from 'react';
import { IconX } from '@tabler/icons-react';
import { searchSong, getLyrics } from '@/utils/genius';

interface LyricsProps {
  isOpen: boolean;
  onClose: () => void;
  trackName: string;
  artistName: string;
}

const Lyrics = ({ isOpen, onClose, trackName, artistName }: LyricsProps) => {
  const [lyrics, setLyrics] = useState<string>('Loading lyrics...');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLyrics = async () => {
      try {
        setLyrics('Searching for lyrics...');
        setError(null);

        // First, search for the song on Genius
        const songData = await searchSong(trackName, artistName);
        console.log('Song search result:', songData); // Debug log
        
        if (!songData || !songData.url) {
          console.error('No song data or URL found:', songData);
          setError('Could not find lyrics for this song');
          return;
        }

        // Then fetch the actual lyrics
        const fetchedLyrics = await getLyrics(songData.url);
        console.log('Fetched lyrics result:', fetchedLyrics); // More detailed debug log
        
        if (!fetchedLyrics) {
          console.error('No lyrics returned from API');
          setError('Could not load lyrics');
          return;
        }

        setLyrics(fetchedLyrics);
      } catch (error) {
        console.error('Error in fetchLyrics:', error);
        setError('Failed to load lyrics. Please try again.');
      }
    };

    if (isOpen && trackName && artistName) {
      console.log('Attempting to fetch lyrics for:', trackName, 'by', artistName);
      fetchLyrics();
    }
  }, [isOpen, trackName, artistName]);

  if (!isOpen) return null;

  return (
    <div className="lyrics-overlay">
      <div className="lyrics-container">
        <div className="lyrics-header">
          <h3>Lyrics</h3>
          <button className="close-button" onClick={onClose}>
            <IconX size={24} />
          </button>
        </div>
        <div className="lyrics-content">
          {error ? (
            <div className="lyrics-error">{error}</div>
          ) : (
            <pre>{lyrics}</pre>
          )}
        </div>
      </div>
    </div>
  );
};

export default Lyrics; 