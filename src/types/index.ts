// Track and Music related types
export interface TrackItem {
  name: string;
  artist: string;
  image?: string;
  playcount?: number;
  listeners?: number;
  rank?: number;
  mbid?: string;
  url?: string;
}

export interface YouTubeEvent {
  target: unknown;
  data: number;
}

// API response types
export interface LastFMTrack {
  name: string;
  artist: {
    name: string;
    mbid: string;
    url: string;
  };
  image?: Array<{ '#text': string; size: string }>;
  playcount?: string;
  listeners?: string;
  mbid: string;
  url: string;
  '@attr'?: { rank: string };
}

export interface LastFMTopTracksResponse {
  tracks: {
    track: LastFMTrack[];
    '@attr': {
      page: string;
      perPage: string;
      totalPages: string;
      total: string;
    };
  };
}

export interface YouTubeSearchResponse {
  items?: Array<{
    id: {
      videoId: string;
    };
    snippet: {
      title: string;
      description: string;
    };
  }>;
  error?: {
    message: string;
  };
}

export interface GeniusSearchResponse {
  url?: string;
  title?: string;
  artist?: string;
  thumbnail?: string;
  error?: string;
}

export interface LyricsResponse {
  lyrics?: string;
  error?: string;
} 