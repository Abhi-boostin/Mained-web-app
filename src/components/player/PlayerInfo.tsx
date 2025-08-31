"use client";

interface PlayerInfoProps {
  name: string;
  artist: string;
}

export default function PlayerInfo({ name, artist }: PlayerInfoProps) {
  return (
    <div className="space-y-6">
      <AlbumArt />
      <SongDetails name={name} artist={artist} />
      <ProgressBar />
    </div>
  );
}

function AlbumArt() {
  return (
    <div className="w-64 h-64 mx-auto bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 rounded-2xl flex items-center justify-center text-white text-6xl font-bold shadow-2xl">
      🎵
    </div>
  );
}

function SongDetails({ name, artist }: { name: string; artist: string }) {
  return (
    <div className="space-y-2">
      <h1 className="text-3xl font-bold text-white">{name}</h1>
      <p className="text-xl text-white/70">{artist}</p>
    </div>
  );
}

function ProgressBar() {
  return (
    <div className="w-full bg-white/20 rounded-full h-2">
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full w-1/3"></div>
    </div>
  );
} 