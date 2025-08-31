"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { TrackItem } from "@/types/track";
import SearchInput from "./search/SearchInput";
import SearchResults from "./search/SearchResults";
import WeeklyTopTracks from "./search/WeeklyTopTracks";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchTracks, setSearchTracks] = useState<TrackItem[]>([]);
  const [weeklyTracks, setWeeklyTracks] = useState<TrackItem[]>([]);
  const router = useRouter();

  useEffect(() => {
    fetchWeeklyTracks();
  }, []);

  const fetchWeeklyTracks = async () => {
    try {
      const response = await axios.get('/api/search?type=weekly');
      setWeeklyTracks(response.data.tracks || []);
    } catch (error) {
      console.error('Failed to fetch weekly tracks:', error);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    setLoading(true);
    try {
      const response = await axios.get(`/api/search?q=${encodeURIComponent(query)}`);
      setSearchTracks(response.data.tracks || []);
    } catch (error) {
      console.error('Search failed:', error);
      setSearchTracks([]);
    } finally {
      setLoading(false);
    }
  };

  const handleTrackSelect = async (track: TrackItem) => {
    try {
      const response = await axios.get(`/api/youtube?q=${encodeURIComponent(`${track.name} ${track.artist}`)}`);
      const videoId = response.data.videoId;
      if (videoId) {
        router.push(`/player/${videoId}?name=${encodeURIComponent(track.name)}&artist=${encodeURIComponent(track.artist)}`);
      }
    } catch (error) {
      console.error('Failed to get YouTube video:', error);
    }
  };

  return (
    <div className="w-full max-w-4xl space-y-8">
      <SearchInput
        query={query}
        onQueryChange={setQuery}
        onSubmit={handleSearch}
        loading={loading}
      />
      
      <SearchResults 
        tracks={searchTracks} 
        onSelect={handleTrackSelect} 
      />
      
      <WeeklyTopTracks 
        tracks={weeklyTracks} 
        onSelect={handleTrackSelect} 
      />
    </div>
  );
} 