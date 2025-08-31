import { NextResponse } from 'next/server';
import axios from 'axios';

const YT_KEY = process.env.YOUTUBE_API_KEY || process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q') || '';
    if (!q.trim()) return NextResponse.json({ videoId: null });
    if (!YT_KEY) return NextResponse.json({ error: 'Missing YOUTUBE_API_KEY' }, { status: 500 });

    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(q)}&key=${YT_KEY}&type=video&maxResults=1&videoCategoryId=10`;
    const response = await axios.get(url);
    const data = response.data;
    
    if (data?.error) {
      return NextResponse.json({ error: data.error.message || 'YouTube error' }, { status: 400 });
    }

    const videoId = data.items?.[0]?.id?.videoId || null;
    return NextResponse.json({ videoId });
  } catch (error) {
    console.error('YouTube API error:', error);
    return NextResponse.json({ error: 'Failed to fetch YouTube data' }, { status: 500 });
  }
} 