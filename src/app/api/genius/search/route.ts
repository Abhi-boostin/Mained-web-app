import { NextResponse } from 'next/server';

const GENIUS_API_KEY = process.env.NEXT_PUBLIC_GENIUS_API_KEY;
const GENIUS_API_BASE = 'https://api.genius.com';

export async function POST(request: Request) {
  try {
    const { title, artist } = await request.json();

    // Try first with exact match
    let response = await fetch(
      `${GENIUS_API_BASE}/search?q=${encodeURIComponent(`${title} ${artist}`)}`,
      {
        headers: {
          'Authorization': `Bearer ${GENIUS_API_KEY}`
        }
      }
    );

    if (!response.ok) {
      throw new Error('Genius API request failed');
    }

    let data = await response.json();
    let result = data.response.hits[0]?.result;

    // If no result, try with just the title
    if (!result) {
      response = await fetch(
        `${GENIUS_API_BASE}/search?q=${encodeURIComponent(title)}`,
        {
          headers: {
            'Authorization': `Bearer ${GENIUS_API_KEY}`
          }
        }
      );
      
      data = await response.json();
      result = data.response.hits[0]?.result;
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error searching Genius:', error);
    return NextResponse.json(null, { status: 500 });
  }
} 