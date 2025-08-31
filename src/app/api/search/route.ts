import { NextResponse } from 'next/server';
import axios from 'axios';

const LASTFM_API_KEY = process.env.LASTFM_API_KEY || process.env.NEXT_PUBLIC_LASTFM_API_KEY;
const LASTFM_API_URL = 'https://ws.audioscrobbler.com/2.0';

interface LastFMTrack {
  name: string;
  artist: { name: string } | string;
  image?: Array<{ '#text': string }>;
  playcount?: number;
}

interface LastFMSearchResult {
  results?: {
    trackmatches?: {
      track?: LastFMTrack[];
    };
  };
  tracks?: {
    track?: LastFMTrack[];
  };
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q') || '';
    const type = searchParams.get('type') || 'search';
    
    if (!LASTFM_API_KEY) {
      return NextResponse.json({ error: 'Missing LASTFM_API_KEY' }, { status: 500 });
    }

    let url: string;
    if (type === 'weekly') {
      // Get weekly top tracks
      url = `${LASTFM_API_URL}?method=chart.gettoptracks&api_key=${LASTFM_API_KEY}&format=json&limit=10`;
    } else {
      // Search for tracks
      if (!q.trim()) return NextResponse.json({ tracks: [] });
      url = `${LASTFM_API_URL}?method=track.search&track=${encodeURIComponent(q)}&api_key=${LASTFM_API_KEY}&format=json&limit=20`;
    }

    const response = await axios.get<LastFMSearchResult>(url);
    const data = response.data;

    if (type === 'weekly') {
      const tracks = data.tracks?.track?.map((t: LastFMTrack) => ({
        name: t.name,
        artist: typeof t.artist === 'string' ? t.artist : t.artist.name,
        image: t.image?.[2]?.['#text'] || '',
        playcount: t.playcount
      })) || [];
      return NextResponse.json({ tracks });
    } else {
      const tracks = data.results?.trackmatches?.track?.map((t: LastFMTrack) => ({
        name: t.name,
        artist: typeof t.artist === 'string' ? t.artist : t.artist.name,
        image: t.image?.[2]?.['#text'] || ''
      })) || [];
      return NextResponse.json({ tracks });
    }
  } catch (error) {
    console.error('Last.fm API error:', error);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
} 