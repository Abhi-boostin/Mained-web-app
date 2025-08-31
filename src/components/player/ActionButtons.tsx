"use client";

interface ActionButtonsProps {
  showLyrics: boolean;
  showQueue: boolean;
  showInfo: boolean;
  onToggleLyrics: () => void;
  onToggleQueue: () => void;
  onToggleInfo: () => void;
}

export default function ActionButtons({
  showLyrics,
  showQueue,
  showInfo,
  onToggleLyrics,
  onToggleQueue,
  onToggleInfo
}: ActionButtonsProps) {
  return (
    <div className="flex items-center justify-center gap-4">
      <ActionButton
        isActive={showLyrics}
        onClick={onToggleLyrics}
        label={showLyrics ? 'Hide Lyrics' : 'Lyrics'}
      />
      <ActionButton
        isActive={showQueue}
        onClick={onToggleQueue}
        label="Queue"
      />
      <ActionButton
        isActive={showInfo}
        onClick={onToggleInfo}
        label="Info"
      />
    </div>
  );
}

function ActionButton({ isActive, onClick, label }: { isActive: boolean; onClick: () => void; label: string }) {
  const baseClasses = "px-6 py-3 rounded-full font-semibold transition-all duration-200";
  const activeClasses = "bg-gradient-to-r from-purple-500 to-pink-500 text-white";
  const inactiveClasses = "bg-white/20 backdrop-blur-sm text-white hover:bg-white/30";
  
  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}
    >
      {label}
    </button>
  );
} 