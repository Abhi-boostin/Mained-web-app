import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const GENIUS_ACCESS_TOKEN = process.env.GENIUS_ACCESS_TOKEN || process.env.NEXT_PUBLIC_GENIUS_ACCESS_TOKEN || process.env.NEXT_PUBLIC_GENIUS_API_KEY;

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const artist = searchParams.get('artist');
  const track = searchParams.get('track');

  if (!artist || !track) {
    return NextResponse.json({ error: 'Artist and track are required' }, { status: 400 });
  }

  if (!GENIUS_ACCESS_TOKEN) {
    return NextResponse.json({ error: 'Missing GENIUS_ACCESS_TOKEN' }, { status: 500 });
  }

  try {
    const searchQuery = `${artist} ${track}`;
    const response = await axios.get('https://api.genius.com/search', {
      params: { q: searchQuery },
      headers: {
        'Authorization': `Bearer ${GENIUS_ACCESS_TOKEN}`
      }
    });

    const hits = response.data.response.hits;
    if (hits && hits.length > 0) {
      const song = hits[0].result;
      return NextResponse.json({
        url: song.url,
        title: song.title,
        artist: song.primary_artist.name,
        thumbnail: song.song_art_image_thumbnail_url
      });
    }

    return NextResponse.json({ error: 'No lyrics found' }, { status: 404 });
  } catch (error) {
    console.error('Error searching Genius:', error);
    return NextResponse.json({ error: 'Failed to search Genius' }, { status: 500 });
  }
}
