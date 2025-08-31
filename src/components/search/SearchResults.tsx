"use client";

import SongList from "../SongList";

interface TrackItem {
  name: string;
  artist: string;
  image?: string;
  playcount?: number;
}

interface SearchResultsProps {
  tracks: TrackItem[];
  onSelect: (track: TrackItem) => void;
}

export default function SearchResults({ tracks, onSelect }: SearchResultsProps) {
  if (!tracks.length) return null;

  return (
    <div className="w-full max-w-2xl mx-auto">
      <h3 className="text-xl font-semibold text-white mb-4">Search Results</h3>
      <SongList tracks={tracks} onSelect={onSelect} />
    </div>
  );
} 