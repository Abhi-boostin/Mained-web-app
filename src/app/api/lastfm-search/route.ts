import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

const LASTFM_API_KEY = process.env.NEXT_PUBLIC_LASTFM_API_KEY;
const LASTFM_BASE_URL = "https://ws.audioscrobbler.com/2.0/";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('q');

  if (!query) {
    return NextResponse.json({ error: 'Search query is required' }, { status: 400 });
  }

  if (!LASTFM_API_KEY) {
    return NextResponse.json({ error: "Last.fm API key not configured" }, { status: 500 });
  }

  try {
    const response = await axios.get(LASTFM_BASE_URL, {
      params: {
        method: "track.search",
        track: query,
        api_key: LASTFM_API_KEY,
        format: "json",
        limit: 10
      }
    });

    const data = response.data;
    
    if (!data.results?.trackmatches?.track) {
      return NextResponse.json({ tracks: [] });
    }

    const tracks = data.results.trackmatches.track.map((track: any) => ({
      name: track.name,
      artist: track.artist,
      image: track.image?.[2]?.["#text"] || track.image?.[1]?.["#text"] || track.image?.[0]?.["#text"]
    }));

    return NextResponse.json({ tracks });
  } catch (error) {
    console.error("Error searching tracks:", error);
    return NextResponse.json({ error: "Failed to search tracks" }, { status: 500 });
  }
}
