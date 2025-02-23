'use client';

import { TextInput, Container, Loader, Paper, Stack, Text } from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';
import { useState } from 'react';
import { searchLastFmTracks, LastFmTrack } from '@/utils/lastfm';
import { getYoutubeVideoId } from '@/utils/youtube';
import { useRouter } from 'next/navigation';

interface SearchBarProps {}

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<LastFmTrack[]>([]);
  const [showResults, setShowResults] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    try {
      const tracks = await searchLastFmTracks(query);
      setSearchResults(tracks);
      setShowResults(true);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTrackSelect = async (track: LastFmTrack) => {
    try {
      setIsLoading(true);
      const youtubeId = await getYoutubeVideoId(track.name, track.artist);
      
      if (!youtubeId) {
        alert('Could not find this song on YouTube');
        return;
      }

      // Get high quality thumbnail from YouTube
      const thumbnailUrl = `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`;
      
      // Fallback to medium quality if maxresdefault doesn't exist
      const fallbackUrl = `https://img.youtube.com/vi/${youtubeId}/mqdefault.jpg`;

      // Check if high quality thumbnail exists
      const checkImage = async (url: string) => {
        try {
          const res = await fetch(url);
          return res.ok;
        } catch {
          return false;
        }
      };

      const coverUrl = await checkImage(thumbnailUrl) ? thumbnailUrl : fallbackUrl;

      const trackData = {
        name: track.name,
        artist: track.artist,
        cover: coverUrl,
        youtubeId: youtubeId
      };

      localStorage.setItem('currentTrack', JSON.stringify(trackData));
      router.push('/player');
    } catch (error) {
      console.error('Error selecting track:', error);
      alert('An error occurred while loading the track. Please try again.');
    } finally {
      setIsLoading(false);
      setShowResults(false);
    }
  };

  return (
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
      <Container size="sm">
        <form onSubmit={handleSubmit}>
          <TextInput
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            leftSection={isLoading ? <Loader size="xs" /> : <IconSearch size="1.1rem" stroke={1.5} />}
            radius="xl"
            size="md"
            placeholder="Search for a song..."
            rightSectionWidth={42}
            styles={{ input: { background: '#141414', color: 'white' } }}
          />
        </form>

        {showResults && searchResults.length > 0 && (
          <Paper 
            style={{ 
              marginTop: '0.5rem',
              background: '#141414',
              border: '1px solid #2C2C2C'
            }}
          >
            <Stack gap="xs">
              {searchResults.map((track, index) => (
                <Paper
                  key={index}
                  p="xs"
                  style={{
                    cursor: 'pointer',
                    background: '#1A1A1A',
                    '&:hover': { background: '#2C2C2C' }
                  }}
                  onClick={() => handleTrackSelect(track)}
                >
                  <Text style={{ color: 'white' }}>
                    {track.name} - {track.artist}
                  </Text>
                </Paper>
              ))}
            </Stack>
          </Paper>
        )}
      </Container>
    </div>
  );
};

export default SearchBar; 