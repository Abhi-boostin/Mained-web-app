const YOUTUBE_API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;

export const getYoutubeVideoId = async (trackName: string, artistName: string) => {
  const cache: { [key: string]: string } = {};
  const cacheKey = `${trackName}-${artistName}`;
  
  // Check cache first
  if (cache[cacheKey]) {
    return cache[cacheKey];
  }

  try {
    const query = `${trackName} ${artistName} official audio`;
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(
      query
    )}&key=${YOUTUBE_API_KEY}&type=video&maxResults=1&videoCategoryId=10`;

    console.log('Making YouTube API request with new key to:', url); // Debug log

    const response = await fetch(url);
    const data = await response.json();

    console.log('YouTube API Response:', data); // Debug log

    if (!response.ok) {
      throw new Error(
        `YouTube API request failed: ${data.error?.message || JSON.stringify(data)}`
      );
    }

    if (!data.items?.length) {
      console.warn('No YouTube results found for:', query);
      // Try again with just the track name
      const fallbackUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(
        trackName
      )}&key=${YOUTUBE_API_KEY}&type=video&maxResults=1&videoCategoryId=10`;
      
      const fallbackResponse = await fetch(fallbackUrl);
      const fallbackData = await fallbackResponse.json();
      
      if (!fallbackResponse.ok || !fallbackData.items?.length) {
        return null;
      }
      
      const videoId = fallbackData.items[0].id.videoId;
      
      // Save to cache
      if (videoId) {
        cache[cacheKey] = videoId;
      }

      return videoId;
    }

    const videoId = data.items[0].id.videoId;
    
    // Save to cache
    if (videoId) {
      cache[cacheKey] = videoId;
    }

    return videoId;
  } catch (error) {
    console.error('Error in getYoutubeVideoId:', error);
    // Return null to handle the error in the UI
    return null;
  }
}; 