# Modern Music Discovery Platform

A sleek and modern music discovery platform that combines LastFM's extensive music database with YouTube's playback capabilities. The application features a dynamic grid layout, real-time track search, and an immersive music player experience.

## Features

- 🎵 Dynamic grid layout with interactive music tiles
- 🔍 Real-time music search functionality
- 📊 Weekly top tracks from LastFM
- ▶️ Integrated YouTube player
- 🎨 Modern UI with smooth animations
- 📱 Responsive design for all devices

## Tech Stack

- **Frontend Framework**: Next.js (React)
- **UI Components**: Mantine UI
- **Styling**: CSS-in-JS
- **Icons**: Tabler Icons
- **APIs**: 
  - LastFM API
  - YouTube API
- **Image Optimization**: Next.js Image Component
- **State Management**: React Hooks
- **TypeScript** for type safety
- **ESLint** for code quality

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/yourusername/Mained-web-app.git
cd Mained-web-app
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file in the root directory and add your API keys:
```env
NEXT_PUBLIC_LASTFM_API_KEY=your_lastfm_api_key
NEXT_PUBLIC_YOUTUBE_API_KEY=your_youtube_api_key
```

⚠️ **Important**: You must obtain your own API keys from:
- [LastFM API](https://www.last.fm/api)
- [YouTube Data API](https://developers.google.com/youtube/v3)

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Environment Variables

The following environment variables are required:

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_LASTFM_API_KEY` | Your LastFM API key |
| `NEXT_PUBLIC_YOUTUBE_API_KEY` | Your YouTube Data API key |

## Deployment

This project is configured for deployment on GitHub Pages. To deploy:

1. Update the `basePath` in `next.config.js` with your repository name
2. Configure your environment variables in your deployment platform
3. Run the build command:
```bash
npm run build
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.