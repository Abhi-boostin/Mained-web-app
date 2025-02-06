'use client';

import { TextInput, Container, Loader, Paper, Stack, Text } from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';
import { useState } from 'react';
import { searchLastFmTracks, LastFmTrack } from '@/utils/lastfm';

interface SearchBarProps {
  onSearch: (track: LastFmTrack, index: number) => void;
}

const SearchBar = ({ onSearch }: SearchBarProps) => {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<LastFmTrack[]>([]);
  const [showResults, setShowResults] = useState(false);

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

  const handleTrackSelect = (track: LastFmTrack) => {
    onSearch(track, 1);
    setShowResults(false);
    setQuery('');
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
      <Container size="sm" style={{ maxWidth: '800px' }}>
        <form onSubmit={handleSubmit}>
          <TextInput
            placeholder="Search for music..."
            value={query}
            onChange={(e) => setQuery(e.currentTarget.value)}
            leftSection={<IconSearch size={16} />}
            rightSection={isLoading && <Loader size="xs" color="gray" />}
            styles={{
              root: { width: '100%' },
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
              section: { color: '#666' },
            }}
          />
        </form>

        {showResults && searchResults.length > 0 && (
          <Paper 
            shadow="md" 
            style={{
              marginTop: '0.5rem',
              background: '#000000',
              border: '1px solid #333',
              maxHeight: '300px',
              overflowY: 'auto',
            }}
          >
            <Stack spacing="xs">
              {searchResults.map((track, index) => (
                <Paper
                  key={index}
                  p="xs"
                  style={{
                    cursor: 'pointer',
                    background: 'transparent',
                    '&:hover': {
                      background: '#1a1a1a',
                    },
                  }}
                  onClick={() => handleTrackSelect(track)}
                >
                  <Text size="sm" color="white">
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