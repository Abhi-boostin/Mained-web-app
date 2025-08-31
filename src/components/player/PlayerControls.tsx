"use client";

interface PlayerControlsProps {
  isPlaying: boolean;
  onPlayPause: () => void;
  onNext: () => void;
  onPrevious: () => void;
}

export default function PlayerControls({ isPlaying, onPlayPause, onNext, onPrevious }: PlayerControlsProps) {
  return (
    <div className="flex items-center justify-center gap-6">
      <ControlButton onClick={onPrevious} icon="⏮️" />
      <PlayPauseButton isPlaying={isPlaying} onClick={onPlayPause} />
      <ControlButton onClick={onNext} icon="⏭️" />
    </div>
  );
}

function ControlButton({ onClick, icon }: { onClick: () => void; icon: string }) {
  return (
    <button
      onClick={onClick}
      className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white text-xl hover:bg-white/30 transition-all duration-200"
    >
      {icon}
    </button>
  );
}

function PlayPauseButton({ isPlaying, onClick }: { isPlaying: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-2xl hover:scale-110 transition-all duration-200 shadow-lg"
    >
      {isPlaying ? '⏸️' : '▶️'}
    </button>
  );
} 