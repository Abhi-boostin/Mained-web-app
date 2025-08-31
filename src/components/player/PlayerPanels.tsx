"use client";

interface PlayerPanelsProps {
  showLyrics: boolean;
  showQueue: boolean;
  showInfo: boolean;
  lyrics: string;
  trackName: string;
  trackArtist: string;
  isPlaying: boolean;
}

export default function PlayerPanels({
  showLyrics,
  showQueue,
  showInfo,
  lyrics,
  trackName,
  trackArtist,
  isPlaying
}: PlayerPanelsProps) {
  return (
    <>
      {showLyrics && <LyricsPanel lyrics={lyrics} />}
      {showQueue && <QueuePanel />}
      {showInfo && <InfoPanel trackName={trackName} trackArtist={trackArtist} isPlaying={isPlaying} />}
    </>
  );
}

function LyricsPanel({ lyrics }: { lyrics: string }) {
  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 max-h-96 overflow-y-auto">
      <h3 className="text-xl font-semibold text-white mb-4">Lyrics</h3>
      <div className="text-white/90 whitespace-pre-line text-left">
        {lyrics}
      </div>
    </div>
  );
}

function QueuePanel() {
  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
      <h3 className="text-xl font-semibold text-white mb-4">Queue</h3>
      <div className="text-white/70 text-center">
        <p>No songs in queue</p>
      </div>
    </div>
  );
}

function InfoPanel({ trackName, trackArtist, isPlaying }: { trackName: string; trackArtist: string; isPlaying: boolean }) {
  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
      <h3 className="text-xl font-semibold text-white mb-4">Track Information</h3>
      <div className="text-white/90 text-left space-y-2">
        <p><span className="font-semibold">Title:</span> {trackName}</p>
        <p><span className="font-semibold">Artist:</span> {trackArtist}</p>
        <p><span className="font-semibold">Source:</span> YouTube</p>
        <p><span className="font-semibold">Status:</span> {isPlaying ? 'Playing' : 'Paused'}</p>
      </div>
    </div>
  );
} 