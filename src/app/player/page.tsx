'use client';

import ModernMusicPlayer from '@/components/ModernMusicPlayer';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function PlayerPage() {
  const router = useRouter();

  useEffect(() => {
    const savedTrack = localStorage.getItem('currentTrack');
    if (!savedTrack) {
      router.push('/'); // Redirect to home if no track is selected
    }
  }, []);

  return <ModernMusicPlayer />;
} 