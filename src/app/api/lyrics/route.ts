import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import * as cheerio from 'cheerio';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const url = searchParams.get('url');

  if (!url) {
    return NextResponse.json({ error: 'URL is required' }, { status: 400 });
  }

  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);
    
    // Genius lyrics are in div with data-lyrics-container attribute
    let lyrics = '';
    $('div[data-lyrics-container="true"]').each((i, elem) => {
      // Remove unwanted elements like annotations, ads, etc.
      $(elem).find('a, script, style').remove();
      lyrics += $(elem).text() + '\n\n';
    });

    if (!lyrics) {
      // Fallback to old Genius format
      const oldLyrics = $('.lyrics');
      oldLyrics.find('a, script, style').remove();
      lyrics = oldLyrics.text() || 'Lyrics not found';
    }

    // Clean up the lyrics
    lyrics = lyrics
      .replace(/\[.*?\]/g, '') // Remove [Verse 1], [Chorus], etc.
      .replace(/\d+\s*Contributors?/gi, '') // Remove "94 Contributors"
      .replace(/Translations?.*/gi, '') // Remove "Translations..."
      .replace(/Read More.*/gi, '') // Remove "Read More..."
      .replace(/Embed$/gm, '') // Remove "Embed" at end of lines
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0)
      .join('\n')
      .trim();

    if (!lyrics || lyrics === 'Lyrics not found') {
      return NextResponse.json({ error: 'Lyrics not found' }, { status: 404 });
    }

    return NextResponse.json({ lyrics });
  } catch (error) {
    console.error('Error fetching lyrics:', error);
    return NextResponse.json({ error: 'Failed to fetch lyrics' }, { status: 500 });
  }
}
