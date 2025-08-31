"use client";

import { TrackItem } from "@/types/track";

interface SongListProps {
  tracks: TrackItem[];
  onSelect: (track: TrackItem) => void;
}

export default function SongList({ tracks, onSelect }: SongListProps) {
  if (!tracks?.length) return null;
  
  return (
    <div className="space-y-2">
      {tracks.map((track, i) => (
        <TrackItemRow key={`${track.name}-${track.artist}-${i}`} track={track} onSelect={onSelect} />
      ))}
    </div>
  );
}

function TrackItemRow({ track, onSelect }: { track: TrackItem; onSelect: (track: TrackItem) => void }) {
  return (
    <button
      className="w-full flex items-center gap-3 p-3 bg-white/10 backdrop-blur-sm rounded-lg hover:bg-white/20 transition-all duration-200 cursor-pointer"
      onClick={() => onSelect(track)}
    >
      <TrackImage image={track.image} name={track.name} />
      <TrackInfo track={track} />
      <PlayButton />
    </button>
  );
}

function TrackImage({ image, name }: { image?: string; name: string }) {
  return (
    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-md flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
      {image ? (
        <img src={image} alt={name} className="w-full h-full object-cover rounded-md" />
      ) : (
        '🎵'
      )}
    </div>
  );
}

function TrackInfo({ track }: { track: TrackItem }) {
  return (
    <div className="flex-1 text-left">
      <div className="text-white font-semibold truncate">{track.name}</div>
      <div className="text-white/70 text-sm truncate">{track.artist}</div>
      {track.playcount && (
        <div className="text-white/50 text-xs mt-1">{track.playcount} plays</div>
      )}
    </div>
  );
}

function PlayButton() {
  return (
    <div className="text-white/60 text-lg">▶️</div>
  );
} 