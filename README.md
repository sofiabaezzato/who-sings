# Who Sings

A modern React quiz application that challenges users to identify artists from song lyrics. Built for Musixmatch to increase user engagement and showcase their extensive music database.

## Overview

Who Sings is a quiz game where players identify artists from lyric excerpts. The application includes comprehensive scoring, leaderboards, and social sharing capabilities, designed to attract both casual music fans and artists to the Musixmatch platform.

## Technology Stack

### Frontend
- **React 19.2.0** - Component framework with latest features
- **TypeScript 5.9.3** - Type-safe development with strict mode
- **Zustand 5.0.2** - Lightweight state management
- **React Router 7.9.6** - Client-side routing and navigation

### Styling & UI
- **Tailwind CSS 4.1.17** - Utility-first styling framework
- **Radix UI** - Accessible component primitives
- **Lucide React** - Modern icon library
- **CSS Variables** - Custom theming and orange accent colors

### Development Tools
- **Vite 7.2.2** - Fast build tool and development server
- **Biome 2.3.5** - Unified linting and formatting
- **Husky** - Git hooks for code quality
- **TypeScript** - Strict type checking

### Deployment
- **Vercel** - Production hosting with serverless functions (API proxy for Musixmatch integration)

## Installation

### Prerequisites
- Node.js >=20.0.0
- npm package manager

### Setup
```bash
# Clone repository
git clone [repository-url]
cd who-sings

# Install dependencies
npm install

# Configure environment
cp .env.local
# Add your Musixmatch API key to .env

# Start development server
npm run dev
```

### Environment Configuration
Create a `.env.local` file with:
```env
VITE_API_KEY=your_api_key_here
```

## Development

### Code Quality
- **TypeScript**: Strict mode enabled for type safety
- **Biome**: Automated linting and formatting
- **Husky**: Pre-commit hooks for code quality
- **Component Architecture**: Reusable, testable components

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/              # Base UI components (Radix)
│   ├── Navigation.tsx   # App navigation
│   ├── QuizCard.tsx     # Quiz interface
│   └── ShareCard.tsx    # Social sharing
├── pages/               # Route components
│   ├── Home.tsx         # Landing/quiz page
│   ├── Quiz.tsx         # Quiz gameplay
│   ├── Profile.tsx      # User profile
│   └── Leaderboard.tsx  # Rankings display
├── stores/              # Zustand state stores
│   ├── authStore.ts     # Authentication
│   ├── gameStore.ts     # Game state
│   └── leaderboardStore.ts # Scores
├── hooks/               # Custom React hooks
├── services/            # API services
│   └── musixmatch.ts    # API client
├── utils/               # Utility functions
└── types/               # TypeScript definitions
```

## API Integration

### Serverless Functions
Located in `api/` directory for Vercel deployment:
- **CORS Handling**: Cross-origin request management
- **API Proxying**: Secure key management
- **Error Responses**: Consistent error handling

## Deployment

### Environment Variables (Vercel)
```env
VITE_MUSIXMATCH_API_KEY=your_production_api_key
```