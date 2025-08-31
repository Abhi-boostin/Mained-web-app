"use client";

interface TrackItem {
  name: string;
  artist: string;
  image?: string;
  playcount?: number;
}

interface WeeklyTopTracksProps {
  tracks: TrackItem[];
  onSelect: (track: TrackItem) => void;
}

export default function WeeklyTopTracks({ tracks, onSelect }: WeeklyTopTracksProps) {
  if (!tracks.length) return null;

  return (
    <div className="w-full max-w-4xl mx-auto">
      <h3 className="text-2xl font-bold text-white mb-6">Top Tracks This Week</h3>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {tracks.map((track, index) => (
          <TrackCard key={`${track.name}-${track.artist}-${index}`} track={track} onSelect={onSelect} />
        ))}
      </div>
    </div>
  );
}

function TrackCard({ track, onSelect }: { track: TrackItem; onSelect: (track: TrackItem) => void }) {
  return (
    <div
      className="bg-white/10 backdrop-blur-sm rounded-lg p-3 cursor-pointer hover:bg-white/20 transition-all duration-200"
      onClick={() => onSelect(track)}
    >
      <div className="aspect-square bg-gradient-to-br from-purple-500 to-pink-500 rounded-md mb-3 flex items-center justify-center text-white font-bold text-lg">
        {track.image ? (
          <img src={track.image} alt={track.name} className="w-full h-full object-cover rounded-md" />
        ) : (
          '🎵'
        )}
      </div>
      <div className="text-white text-sm">
        <div className="font-semibold truncate">{track.name}</div>
        <div className="text-white/70 truncate">{track.artist}</div>
        {track.playcount && (
          <div className="text-white/50 text-xs mt-1">{track.playcount} plays</div>
        )}
      </div>
    </div>
  );
} 