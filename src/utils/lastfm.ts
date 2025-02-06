const LASTFM_API_KEY = "3221066b9842ad9d48222f6a9f1d27bc";
const LASTFM_API_URL = 'https://ws.audioscrobbler.com/2.0/';

export interface LastFmTrack {
  name: string;
  artist: string;
  image: { size: string; '#text': string }[];
  url: string;
  mbid?: string;
}

export const searchLastFmTracks = async (query: string): Promise<LastFmTrack[]> => {
  try {
    const response = await fetch(
      `${LASTFM_API_URL}?method=track.search&track=${encodeURIComponent(query)}&api_key=${LASTFM_API_KEY}&format=json&limit=10`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch from Last.fm');
    }

    const data = await response.json();
    return data.results?.trackmatches?.track || [];
  } catch (error) {
    console.error('Last.fm search error:', error);
    return [];
  }
};

export const getTrackInfo = async (track: string, artist: string): Promise<any> => {
  try {
    const response = await fetch(
      `${LASTFM_API_URL}?method=track.getInfo&track=${encodeURIComponent(track)}&artist=${encodeURIComponent(artist)}&api_key=${LASTFM_API_KEY}&format=json`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch track info');
    }

    const data = await response.json();
    return data.track;
  } catch (error) {
    console.error('Track info error:', error);
    return null;
  }
};

export const getWeeklyTopTracks = async (limit: number = 7): Promise<LastFmTrack[]> => {
  try {
    const response = await fetch(
      `${LASTFM_API_URL}?method=chart.getTopTracks&api_key=${LASTFM_API_KEY}&format=json&limit=${limit}`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch top tracks');
    }

    const data = await response.json();
    return data.tracks?.track || [];
  } catch (error) {
    console.error('Top tracks error:', error);
    return [];
  }
}; 