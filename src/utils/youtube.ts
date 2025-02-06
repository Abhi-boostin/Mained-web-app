const YOUTUBE_API_KEY = 'AIzaSyD8t7ziPXCP4__YQhQhIXfnuubOHLO2G_8';

export const getYoutubeVideoId = async (trackName: string, artistName: string) => {
  try {
    const query = `${trackName} ${artistName} official audio`;
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(
        query
      )}&key=${YOUTUBE_API_KEY}&type=video&maxResults=1`
    );
    
    if (!response.ok) {
      throw new Error('YouTube API request failed');
    }
    
    const data = await response.json();
    return data.items?.[0]?.id?.videoId;
  } catch (error) {
    console.error('Error fetching YouTube video:', error);
    return null;
  }
}; 