import { Suspense } from "react";
import PlayerWrapper from "@/components/PlayerWrapper";

async function PlayerContent({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center p-6">
      <PlayerWrapper videoId={id} />
    </main>
  );
}

export default function PlayerPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center text-white">Loading...</div>}>
      <PlayerContent params={params} />
    </Suspense>
  );
} 