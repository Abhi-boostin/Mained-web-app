const LASTFM_API_KEY = process.env.NEXT_PUBLIC_LASTFM_API_KEY;
const LASTFM_API_URL = 'https://ws.audioscrobbler.com/2.0/';

export interface LastFmTrack {
  name: string;
  artist: string;
  image: { size: string; '#text': string }[];
  url: string;
  mbid?: string;
}

export interface LastFmApiResponse {
  results: {
    trackmatches: {
      track: LastFmTrack[];
    };
  };
}

export const searchLastFmTracks = async (query: string): Promise<LastFmTrack[]> => {
  try {
    const response = await fetch(
      `${LASTFM_API_URL}?method=track.search&track=${encodeURIComponent(
        query
      )}&api_key=${LASTFM_API_KEY}&format=json`
    );

    const data = (await response.json()) as LastFmApiResponse;
    return data.results.trackmatches.track.map((track) => ({
      name: track.name,
      artist: track.artist,
      url: track.url,
      image: track.image,
      mbid: track.mbid
    }));
  } catch (error) {
    console.error('LastFM search error:', error);
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