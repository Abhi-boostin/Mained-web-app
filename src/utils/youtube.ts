const getYoutubeSearchUrl = (trackName: string, artistName: string) => {
  const searchQuery = encodeURIComponent(`${trackName} ${artistName} official audio`);
  return `https://www.youtube.com/results?search_query=${searchQuery}`;
};

export default getYoutubeSearchUrl; 