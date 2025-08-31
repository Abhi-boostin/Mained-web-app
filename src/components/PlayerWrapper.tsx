"use client";

import { useSearchParams } from "next/navigation";
import Player from "./Player";

export default function PlayerWrapper({ videoId }: { videoId: string }) {
  const searchParams = useSearchParams();
  const name = searchParams.get("name") || "";
  const artist = searchParams.get("artist") || "";

  return <Player videoId={videoId} name={name} artist={artist} />;
} 