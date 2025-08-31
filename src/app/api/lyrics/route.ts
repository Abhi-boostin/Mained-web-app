import { NextResponse } from 'next/server';
import axios from 'axios';
import * as cheerio from 'cheerio';

const GENIUS_KEY = process.env.GENIUS_API_KEY || process.env.NEXT_PUBLIC_GENIUS_API_KEY;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q') || '';
    if (!q.trim()) return NextResponse.json({ lyrics: '' });
    if (!GENIUS_KEY) return NextResponse.json({ error: 'Missing GENIUS_API_KEY' }, { status: 500 });

    const searchRes = await axios.get(`https://api.genius.com/search?q=${encodeURIComponent(q)}`, {
      headers: { Authorization: `Bearer ${GENIUS_KEY}` }
    });
    const searchData = searchRes.data;
    const url = searchData?.response?.hits?.[0]?.result?.url;
    
    if (!url) return NextResponse.json({ lyrics: 'No lyrics found' });

    const pageRes = await axios.get(url);
    const $ = cheerio.load(pageRes.data);
    const lyrics = $('[class*="lyrics"]').text().trim() || $('[class*="Lyrics"]').text().trim();
    
    return NextResponse.json({ lyrics: lyrics || 'Lyrics not available' });
  } catch (error) {
    console.error('Genius API error:', error);
    return NextResponse.json({ error: 'Failed to fetch lyrics' }, { status: 500 });
  }
} 