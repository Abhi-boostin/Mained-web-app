import { NextResponse } from 'next/server';
import * as cheerio from 'cheerio';

export async function POST(request: Request) {
  try {
    const { url } = await request.json();
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch page');
    }

    const html = await response.text();
    const $ = cheerio.load(html);
    
    // Remove script tags and unwanted elements
    $('script').remove();
    $('style').remove();
    
    // Try multiple selectors to find lyrics
    const selectors = [
      '[class*="Lyrics__Container"]',
      '.lyrics',
      '[class*="SongPage__LyricsContainer"]',
      '[class*="lyrics"]',
      '[data-lyrics-container="true"]',
      '#lyrics-root',
      '.lyrics__content'
    ];

    let lyrics = '';
    
    // Try each selector until we find lyrics
    for (const selector of selectors) {
      const container = $(selector);
      if (container.length) {
        container.each((_, elem) => {
          const text = $(elem)
            .html()
            ?.replace(/<br\/?>/g, '\n')
            .replace(/<(?!\/?br)[^>]+>/g, '')
            || '';
          lyrics += text + '\n';
        });
        if (lyrics.trim()) break;
      }
    }

    // If no lyrics found, try getting all text content
    if (!lyrics.trim()) {
      lyrics = $('body')
        .text()
        .replace(/\s+/g, ' ')
        .trim();
    }
    
    // Clean up the lyrics
    lyrics = lyrics
      .replace(/\[/g, '\n[')
      .replace(/\]/g, ']\n')
      .replace(/\n{3,}/g, '\n\n')
      .replace(/&amp;/g, '&')
      .replace(/&quot;/g, '"')
      .replace(/&#x27;/g, "'")
      .replace(/\s+/g, ' ')
      .trim();
    
    if (!lyrics) {
      return NextResponse.json(
        { error: 'No lyrics found on page' },
        { status: 404 }
      );
    }

    return NextResponse.json({ lyrics });
  } catch (error) {
    console.error('Error fetching lyrics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch lyrics' },
      { status: 500 }
    );
  }
} 