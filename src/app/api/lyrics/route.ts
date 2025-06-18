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
          let html = $(elem).html() || '';
          // Replace <br> and <br/> with newlines
          html = html.replace(/<br\s*\/?>/gi, '\n');
          // Remove all other HTML tags
          html = html.replace(/<[^>]+>/g, '');
          // Decode HTML entities
          html = html.replace(/&amp;/g, '&')
                     .replace(/&quot;/g, '"')
                     .replace(/&#x27;/g, "'")
                     .replace(/&lt;/g, '<')
                     .replace(/&gt;/g, '>');
          // Remove trailing spaces on each line
          html = html.split('\n').map(line => line.trimEnd()).join('\n');
          lyrics += html + '\n';
        });
        if (lyrics.trim()) break;
      }
    }

    // If no lyrics found, try getting all text content
    if (!lyrics.trim()) {
      lyrics = $('body')
        .text()
        .replace(/\r?\n/g, '\n')
        .replace(/\n{3,}/g, '\n\n')
        .trim();
    }

    // Clean up the lyrics: collapse 3+ newlines to 2, trim, and ensure spacing
    lyrics = lyrics
      .replace(/\n{3,}/g, '\n\n')
      .replace(/ +/g, ' ')
      .replace(/^\s+|\s+$/g, '')
      .replace(/\n{2,}/g, '\n\n');

    // Remove everything before the first section header (e.g., [Intro], [Verse], [Chorus], etc.)
    const sectionHeaderRegex = /\[(Intro|Verse|Chorus|Refrain|Bridge|Breakdown|Outro)[^\]]*\]/i;
    const match = lyrics.match(sectionHeaderRegex);
    if (match && match.index !== undefined) {
      lyrics = lyrics.slice(match.index).trim();
    }

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