# Modern Music Player

A sleek web-based music player featuring lyrics integration and a modern UI design.

## Features

- 🎵 Play music through YouTube integration
- 📝 View song lyrics with a dedicated lyrics button
- 🎨 Modern, responsive user interface
- 🔍 Search for songs using Last.fm's database
- ⏯️ Full playback controls (play, pause, seek)
- 🖼️ Dynamic background based on album artwork
- ⏱️ Interactive progress bar with time display

## Tech Stack

- Next.js
- TypeScript
- Mantine UI Components
- CSS for styling
- YouTube API for playback
- Last.fm API for music data

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/your-username/mained.git
cd mained
```

2. Install dependencies:
```bash
pnpm install
```

3. Create a `.env.local` file with your API keys:
```env
YOUTUBE_API_KEY=your_youtube_api_key
LASTFM_API_KEY=your_lastfm_api_key
```

4. Run the development server:
```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Project Structure

```
src/
├── app/                 # Next.js app directory
├── components/         # React components
│   ├── ModernMusicPlayer.tsx
│   ├── SearchBar.tsx
│   └── ColoredGrid.tsx
├── styles/            # CSS styles
└── utils/             # Utility functions
    ├── youtube.ts
    └── lastfm.ts
```

## Key Components

### ModernMusicPlayer
The main player component with YouTube integration and playback controls.

### SearchBar
Handles music search functionality using Last.fm's API.

## Deployment

The project is configured for GitHub Pages deployment using GitHub Actions. Each push to the main branch triggers automatic deployment.

Live demo: [https://abhi-boostin.github.io/mained](https://abhi-boostin.github.io/mained)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Last.fm for their comprehensive music database
- YouTube for video playback capabilities
- Next.js team for the amazing framework
```

This README provides a comprehensive overview of your project, including:
- Features
- Tech stack
- Setup instructions
- Project structure
- Key components
- Deployment information
- Contributing guidelines

Feel free to modify any sections to better match your project's specific needs!
