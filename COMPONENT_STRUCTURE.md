# Mained - Component Structure

## Overview
The app has been refactored into smaller, focused components for better maintainability and readability. Each component has a single responsibility and can be easily understood and modified.

## Component Hierarchy

### 1. Layout Components
```
src/components/layout/
├── AppHeader.tsx          # Main app title and description
```

### 2. Search Components
```
src/components/search/
├── SearchInput.tsx        # Search bar with form handling
├── SearchResults.tsx      # Search results display
└── WeeklyTopTracks.tsx    # Weekly top tracks grid
```

### 3. Player Components
```
src/components/player/
├── YouTubePlayer.tsx      # Hidden YouTube iframe
├── PlayerInfo.tsx         # Album art, song details, progress bar
├── PlayerControls.tsx     # Play/pause, next/previous buttons
├── ActionButtons.tsx      # Lyrics, queue, info toggle buttons
└── PlayerPanels.tsx       # Lyrics, queue, info display panels
```

### 4. Core Components
```
src/components/
├── SearchBar.tsx          # Main search orchestrator
├── SongList.tsx           # Track list with individual track items
└── Player.tsx             # Main player orchestrator
```

### 5. Types
```
src/types/
└── track.ts               # Shared interfaces (TrackItem, YouTubeEvent)
```

## Component Responsibilities

### SearchBar (Main Orchestrator)
- Manages search state and API calls
- Coordinates between search input, results, and weekly tracks
- Handles navigation to player

### SearchInput
- Handles search form submission
- Manages input state and loading states
- Pure UI component with props

### SearchResults
- Displays search results
- Uses SongList for consistent track display
- Only renders when there are results

### WeeklyTopTracks
- Fetches and displays weekly top tracks
- Grid layout with individual track cards
- Each track card is clickable

### SongList
- Renders a list of tracks
- Breaks down into TrackItemRow, TrackImage, TrackInfo, PlayButton
- Reusable across search results and other lists

### Player (Main Orchestrator)
- Manages player state (playing, lyrics, queue, info)
- Coordinates between YouTube player and UI components
- Handles player controls and state changes

### YouTubePlayer
- Hidden YouTube iframe
- Handles player events (ready, state change)
- Configures player options

### PlayerInfo
- Album art placeholder
- Song title and artist
- Progress bar (visual only)

### PlayerControls
- Play/pause button (main control)
- Next/previous buttons
- Consistent button styling

### ActionButtons
- Lyrics, queue, info toggle buttons
- Active state management
- Consistent button behavior

### PlayerPanels
- Conditional rendering of lyrics, queue, info
- Each panel is a separate component
- Clean separation of concerns

## Benefits of This Structure

1. **Single Responsibility**: Each component has one clear purpose
2. **Reusability**: Components can be reused across different parts of the app
3. **Maintainability**: Easy to find and modify specific functionality
4. **Testing**: Each component can be tested independently
5. **Readability**: Code is easier to understand and explain
6. **Type Safety**: Shared interfaces ensure consistency

## Data Flow

1. **Search Flow**: SearchInput → SearchBar → API → SearchResults
2. **Weekly Tracks**: WeeklyTopTracks → SearchBar → API → Display
3. **Player Flow**: Track selection → Player → YouTubePlayer + UI components
4. **State Management**: Each component manages its own local state

## Key Design Patterns

- **Props Down, Events Up**: Parent components pass data down, children emit events up
- **Composition**: Complex components are built from simple, focused components
- **Separation of Concerns**: UI, logic, and data fetching are separated
- **Type Safety**: Shared interfaces ensure consistency across components 