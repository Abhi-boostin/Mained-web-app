export interface TrackItem {
  name: string;
  artist: string;
  image?: string;
  playcount?: number;
}

export interface YouTubeEvent {
  target: {
    playVideo: () => void;
    pauseVideo: () => void;
    seekTo: (seconds: number) => void;
  };
  data: number;
} 