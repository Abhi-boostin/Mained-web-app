import axios from 'axios';

const YOUTUBE_API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;
const GENIUS_API_KEY = process.env.NEXT_PUBLIC_GENIUS_API_KEY;

interface YouTubeSearchResult {
  id: { videoId: string };
  snippet: {
    title: string;
    thumbnails: { high: { url: string } };
    channelTitle: string;
  };
}

export async function searchYouTube(query: string) {
  try {
    const response = await axios.get(
      `https://www.googleapis.com/youtube/v3/search`,
      {
        params: {
          part: 'snippet',
          q: query + ' official audio',
          type: 'video',
          videoCategoryId: '10', // Music category
          maxResults: 12,
          key: YOUTUBE_API_KEY,
        },
      }
    );

    return response.data.items.map((item: YouTubeSearchResult) => ({
      id: item.id.videoId,
      title: item.snippet.title,
      thumbnail: item.snippet.thumbnails.high.url,
      artist: item.snippet.channelTitle,
    }));
  } catch (error) {
    console.error('YouTube search error:', error);
    return [];
  }
}

export async function getLyrics(artist: string, title: string) {
  try {
    // Search for song on Genius
    const searchResponse = await axios.get(
      `https://api.genius.com/search`,
      {
        params: { q: `${artist} ${title}` },
        headers: { Authorization: `Bearer ${GENIUS_API_KEY}` },
      }
    );

    const hits = searchResponse.data.response.hits;
    if (hits.length === 0) {
      return 'Lyrics not found';
    }

    const songUrl = hits[0].result.url;
    
    // Fetch lyrics from the song page
    const lyricsResponse = await axios.get(`/api/lyrics?url=${encodeURIComponent(songUrl)}`);
    return lyricsResponse.data.lyrics || 'Lyrics not found';
  } catch (error) {
    console.error('Lyrics fetch error:', error);
    return 'Lyrics not found';
  }
}
