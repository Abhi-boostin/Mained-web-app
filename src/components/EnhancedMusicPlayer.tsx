"use client";

import { useState, useEffect, useRef } from "react";
import YouTube from "react-youtube";
import { YouTubeEvent, GeniusSearchResponse, LyricsResponse } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  VolumeX,
  Music2,
  Loader2,
  Search,
  FileText
} from "lucide-react";

interface SearchTrack {
  name: string;
  artist: string;
  image?: string;
}

export default function EnhancedMusicPlayer() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchTrack[]>([]);
  const [selectedTrack, setSelectedTrack] = useState<SearchTrack | null>(null);
  const [videoId, setVideoId] = useState<string>("");
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState<string>("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(50);
  const [isMuted, setIsMuted] = useState(false);
  const [lyrics, setLyrics] = useState<string>("");
  const [loadingLyrics, setLoadingLyrics] = useState(false);
  const [showLyrics, setShowLyrics] = useState(false);
  
  const playerRef = useRef<any>(null);
  const progressInterval = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isPlaying && playerRef.current) {
      progressInterval.current = setInterval(() => {
        if (playerRef.current && playerRef.current.getCurrentTime) {
          setCurrentTime(playerRef.current.getCurrentTime());
        }
      }, 100);
    } else {
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
    }
    return () => {
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
    };
  }, [isPlaying]);

  const searchTracks = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      setSearching(true);
      setError("");
      
      const response = await fetch(`/api/lastfm-search?q=${encodeURIComponent(query)}`);
      const data = await response.json();
      
      if (data.error) {
        setError(data.error);
        setSearchResults([]);
      } else {
        setSearchResults(data.tracks || []);
      }
    } catch (err) {
      setError("Failed to search tracks");
      console.error("Error searching tracks:", err);
      setSearchResults([]);
    } finally {
      setSearching(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    searchTracks(searchQuery);
  };

  const fetchLyrics = async (track: SearchTrack) => {
    try {
      setLoadingLyrics(true);
      setLyrics("");
      
      const searchResponse = await fetch(
        `/api/genius-search?artist=${encodeURIComponent(track.artist)}&track=${encodeURIComponent(track.name)}`
      );
      const searchData: GeniusSearchResponse = await searchResponse.json();
      
      if (searchData.error || !searchData.url) {
        setLyrics("Lyrics not found");
        return;
      }
      
      const lyricsResponse = await fetch(
        `/api/lyrics?url=${encodeURIComponent(searchData.url)}`
      );
      const lyricsData: LyricsResponse = await lyricsResponse.json();
      
      if (lyricsData.error || !lyricsData.lyrics) {
        setLyrics("Lyrics not found");
      } else {
        setLyrics(lyricsData.lyrics);
      }
    } catch (err) {
      console.error("Error fetching lyrics:", err);
      setLyrics("Failed to load lyrics");
    } finally {
      setLoadingLyrics(false);
    }
  };

  const handleTrackSelect = async (track: SearchTrack) => {
    try {
      setSelectedTrack(track);
      setError("");
      setCurrentTime(0);
      setDuration(0);
      setSearchResults([]);
      setSearchQuery("");
      
      const searchQuery = `${track.artist} - ${track.name}`;
      const response = await fetch(`/api/youtube?q=${encodeURIComponent(searchQuery)}`);
      const data = await response.json();
      
      if (data.error) {
        setError(data.error);
        setVideoId("");
      } else if (data.videoId) {
        setVideoId(data.videoId);
        setIsPlaying(true);
        fetchLyrics(track);
      } else {
        setError("No YouTube video found for this track");
        setVideoId("");
      }
    } catch (err) {
      setError("Failed to search YouTube");
      console.error("Error searching YouTube:", err);
      setVideoId("");
    }
  };

  const handlePlayerReady = (event: YouTubeEvent) => {
    playerRef.current = event.target;
    const player = event.target as any;
    setDuration(player.getDuration());
    if (volume !== 50) {
      player.setVolume(volume);
    }
  };

  const handlePlayerStateChange = (event: YouTubeEvent) => {
    setIsPlaying(event.data === 1);
    
    if (event.data === 1 && playerRef.current) {
      const player = playerRef.current as any;
      setDuration(player.getDuration());
    }
  };

  const togglePlayPause = () => {
    if (playerRef.current) {
      const player = playerRef.current;
      if (isPlaying) {
        player.pauseVideo();
      } else {
        player.playVideo();
      }
    }
  };

  const handleSeek = (value: number[]) => {
    const newTime = value[0];
    if (playerRef.current) {
      playerRef.current.seekTo(newTime, true);
      setCurrentTime(newTime);
    }
  };

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume);
    if (playerRef.current) {
      playerRef.current.setVolume(newVolume);
    }
    if (newVolume > 0) {
      setIsMuted(false);
    }
  };

  const toggleMute = () => {
    if (playerRef.current) {
      if (isMuted) {
        playerRef.current.unMute();
        playerRef.current.setVolume(volume);
        setIsMuted(false);
      } else {
        playerRef.current.mute();
        setIsMuted(true);
      }
    }
  };

  const seekBackward = () => {
    if (playerRef.current) {
      const newTime = Math.max(0, currentTime - 10);
      playerRef.current.seekTo(newTime, true);
      setCurrentTime(newTime);
    }
  };

  const seekForward = () => {
    if (playerRef.current) {
      const newTime = Math.min(duration, currentTime + 10);
      playerRef.current.seekTo(newTime, true);
      setCurrentTime(newTime);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-slate-900 to-blue-900 p-4 md:p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-5xl md:text-7xl font-black bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
          Mained
        </h1>
        <p className="text-lg md:text-xl text-white/80">
          Search and play your favorite music
        </p>
      </div>

      <div className="max-w-4xl mx-auto space-y-6">
        {/* Search Bar */}
        <Card className="bg-black/60 backdrop-blur-xl border-white/10">
          <CardContent className="p-4 md:p-6">
            <form onSubmit={handleSearch} className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for songs, artists..."
                  className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-green-400/50"
                />
              </div>
              <Button
                type="submit"
                disabled={searching || !searchQuery.trim()}
                className="bg-gradient-to-r from-green-400 to-blue-500 text-black font-semibold hover:scale-105 px-6"
              >
                {searching ? <Loader2 className="w-5 h-5 animate-spin" /> : "Search"}
              </Button>
            </form>

            {/* Search Results */}
            {searchResults.length > 0 && (
              <div className="mt-4 space-y-2 max-h-64 overflow-y-auto">
                {searchResults.map((track, index) => (
                  <div
                    key={`${track.name}-${track.artist}-${index}`}
                    onClick={() => handleTrackSelect(track)}
                    className="flex items-center gap-3 p-3 bg-white/5 hover:bg-white/10 rounded-lg cursor-pointer transition-all group"
                  >
                    <div className="w-12 h-12 bg-gradient-to-br from-green-400 via-blue-500 to-purple-600 rounded-lg overflow-hidden flex-shrink-0">
                      {track.image ? (
                        <img src={track.image} alt={track.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Music2 className="w-6 h-6 text-white" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-white font-semibold truncate group-hover:text-green-400 transition-colors">
                        {track.name}
                      </h3>
                      <p className="text-white/60 text-sm truncate">{track.artist}</p>
                    </div>
                    <Play className="w-5 h-5 text-green-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Player */}
        {selectedTrack && videoId && (
          <Card className="bg-black/60 backdrop-blur-xl border-white/10">
            <CardContent className="p-4 md:p-6">
              {/* Track Info */}
              <div className="flex items-center gap-4 mb-6">
                <div className="w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-green-400 via-blue-500 to-purple-600 rounded-2xl flex items-center justify-center overflow-hidden flex-shrink-0 shadow-2xl">
                  {selectedTrack.image ? (
                    <img 
                      src={selectedTrack.image} 
                      alt={selectedTrack.name} 
                      className="w-full h-full object-cover" 
                    />
                  ) : (
                    <Music2 className="w-10 h-10 md:w-12 md:h-12 text-white" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-xl md:text-2xl font-bold text-white truncate">{selectedTrack.name}</h3>
                  <p className="text-white/70 text-base md:text-lg truncate">{selectedTrack.artist}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <div className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-green-400 animate-pulse' : 'bg-white/40'}`}></div>
                    <span className="text-white/60 text-sm">
                      {isPlaying ? 'Now Playing' : 'Paused'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-2 mb-6">
                <Slider
                  value={[currentTime]}
                  max={duration || 100}
                  step={0.1}
                  onValueChange={handleSeek}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-white/60">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleMute}
                    className="text-white hover:text-green-400"
                  >
                    {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                  </Button>
                  <Slider
                    value={[isMuted ? 0 : volume]}
                    max={100}
                    step={1}
                    onValueChange={handleVolumeChange}
                    className="w-20 md:w-24"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={seekBackward}
                    className="text-white hover:text-green-400"
                  >
                    <SkipBack className="w-5 h-5 md:w-6 md:h-6" />
                  </Button>
                  <Button
                    size="icon"
                    onClick={togglePlayPause}
                    className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-gradient-to-r from-green-400 to-blue-500 hover:scale-110 transition-transform"
                  >
                    {isPlaying ? (
                      <Pause className="w-5 h-5 md:w-6 md:h-6 text-black" />
                    ) : (
                      <Play className="w-5 h-5 md:w-6 md:h-6 text-black ml-1" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={seekForward}
                    className="text-white hover:text-green-400"
                  >
                    <SkipForward className="w-5 h-5 md:w-6 md:h-6" />
                  </Button>
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowLyrics(!showLyrics)}
                  className={`text-white ${showLyrics ? 'text-green-400' : 'hover:text-green-400'}`}
                >
                  <FileText className="w-5 h-5" />
                </Button>
              </div>

              {/* Hidden YouTube Player */}
              <div className="hidden">
                <YouTube
                  videoId={videoId}
                  opts={{
                    height: "0",
                    width: "0",
                    playerVars: { 
                      autoplay: 1, 
                      controls: 0,
                      disablekb: 1,
                      fs: 0,
                      iv_load_policy: 3,
                      modestbranding: 1,
                      rel: 0
                    },
                  }}
                  onReady={handlePlayerReady}
                  onStateChange={handlePlayerStateChange}
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Lyrics Section */}
        {selectedTrack && showLyrics && (
          <Card className="bg-black/60 backdrop-blur-xl border-white/10">
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl md:text-2xl font-bold text-white">Lyrics</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowLyrics(false)}
                  className="text-white/60 hover:text-white"
                >
                  Hide
                </Button>
              </div>
              {loadingLyrics ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 text-green-400 animate-spin mb-4" />
                  <p className="text-white/60">Loading lyrics...</p>
                </div>
              ) : lyrics ? (
                <div className="max-h-96 overflow-y-auto pr-2 custom-scrollbar">
                  <div className="text-white/90 whitespace-pre-line font-sans text-sm md:text-base leading-relaxed">
                    {lyrics.split('\n').map((line, index) => (
                      <p key={index} className="mb-3">
                        {line || '\u00A0'}
                      </p>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Music2 className="w-12 h-12 text-white/40 mb-4" />
                  <p className="text-white/60">Lyrics not available</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Empty State */}
        {!selectedTrack && (
          <Card className="bg-black/60 backdrop-blur-xl border-white/10">
            <CardContent className="p-12 text-center">
              <Music2 className="w-16 h-16 text-white/40 mx-auto mb-4" />
              <h3 className="text-xl text-white/80 mb-2">No track selected</h3>
              <p className="text-white/60">Search for a song to start playing</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Error Display */}
      {error && (
        <div className="fixed bottom-6 right-6 z-50">
          <Card className="bg-red-500/20 border-red-400/30 backdrop-blur-xl">
            <CardContent className="p-4 flex items-center gap-2">
              <div className="w-2 h-2 bg-red-400 rounded-full"></div>
              <span className="text-red-400 text-sm">{error}</span>
            </CardContent>
          </Card>
        </div>
      )}

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(74, 222, 128, 0.5);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(74, 222, 128, 0.7);
        }
      `}</style>
    </div>
  );
}
