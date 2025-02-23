'use client';

import { createContext, useContext, useState } from 'react';

interface Track {
  name: string;
  artist: string | { name: string };
  image: Array<{ '#text': string }>;
  url: string;
  mbid?: string;
  youtubeId?: string;
}

interface TrackContextType {
  selectedTrack: Track | null;
  setSelectedTrack: (track: Track | null) => void;
}

const TrackContext = createContext<TrackContextType | undefined>(undefined);

export function TrackProvider({ children }: { children: React.ReactNode }) {
  const [selectedTrack, setSelectedTrack] = useState<Track | null>(null);

  return (
    <TrackContext.Provider value={{ selectedTrack, setSelectedTrack }}>
      {children}
    </TrackContext.Provider>
  );
}

export const useTrack = () => {
  const context = useContext(TrackContext);
  if (context === undefined) {
    throw new Error('useTrack must be used within a TrackProvider');
  }
  return context;
}; 