// Remove unused constants since we're not using the Genius API directly
// const GENIUS_API_KEY = '...';
// const GENIUS_API_BASE = '...';

export const searchSong = async (title: string, artist: string) => {
  try {
    const response = await fetch('/api/genius/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title, artist }),
    });

    if (!response.ok) {
      throw new Error('Search request failed');
    }

    return await response.json();
  } catch (error) {
    console.error('Error searching song:', error);
    return null;
  }
};

export const getLyrics = async (geniusUrl: string) => {
  try {
    const response = await fetch('/api/lyrics', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url: geniusUrl }),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch lyrics');
    }

    const data = await response.json();
    return data.lyrics;
  } catch (error) {
    console.error('Error fetching lyrics:', error);
    return null;
  }
}; 