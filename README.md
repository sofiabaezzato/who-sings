# Who Sings

A modern React quiz application that challenges users to identify artists from song lyrics. Built for Musixmatch to increase user engagement and showcase their extensive music database.

## Overview

Who Sings is a production-grade quiz game featuring Instagram Stories-style cards where players identify artists from lyric excerpts. The application includes comprehensive scoring, leaderboards, and social sharing capabilities, designed to attract both casual music fans and artists to the Musixmatch platform.

## Features

### Core Gameplay
- **Interactive Quiz Cards**: Instagram Stories-style mobile-first interface
- **Progressive Timer**: Auto-advancing questions with timeout handling
- **Scoring System**: Points awarded for correct answers with streak bonuses
- **10-Question Sessions**: Complete quiz sessions with comprehensive scoring

### User Management
- **Player Registration**: Name-based authentication with persistence
- **Score Tracking**: Individual performance history and statistics
- **Session Management**: Login/logout functionality with data retention

### Social Features
- **Global Leaderboard**: Community rankings with score persistence
- **Social Sharing**: Strava-inspired share cards with Musixmatch branding
- **Performance Analytics**: Detailed statistics and achievement tracking

### Enhanced Experience
- **Hint System**: Optional clues for challenging questions
- **Responsive Design**: Mobile-first with desktop optimization
- **Error Recovery**: Comprehensive error boundaries and fallback states
- **Loading States**: Smooth transitions and user feedback

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
- **Vercel** - Production hosting with serverless functions
- **Vercel Functions** - API proxy for Musixmatch integration
- **Environment Variables** - Secure configuration management

## Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn package manager

### Setup
```bash
# Clone repository
git clone [repository-url]
cd who-sings

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Add your Musixmatch API key to .env

# Start development server
npm run dev
```

### Environment Configuration
Create a `.env` file with:
```env
VITE_MUSIXMATCH_API_KEY=your_api_key_here
```

## Development

### Available Scripts
```bash
npm run dev       # Development server (http://localhost:5173)
npm run build     # Production build
npm run preview   # Preview production build
npm run lint      # Run Biome linting
npm run format    # Format code with Biome
npm run typecheck # TypeScript type checking
```

### Code Quality
- **TypeScript**: Strict mode enabled for type safety
- **Biome**: Automated linting and formatting
- **Husky**: Pre-commit hooks for code quality
- **Component Architecture**: Reusable, testable components

### State Management
- **Zustand Stores**: Lightweight state management
- **Custom Hooks**: Encapsulated business logic
- **Performance**: React.memo for optimization
- **Persistence**: localStorage integration

## Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── ui/              # Base UI components (Radix)
│   ├── Navigation.tsx   # App navigation
│   ├── QuizCard.tsx     # Quiz interface
│   └── ShareCard.tsx    # Social sharing
├── pages/               # Route components
│   ├── Home.tsx         # Landing/quiz page
│   ├── Quiz.tsx         # Quiz gameplay
│   └── Leaderboard.tsx  # Rankings display
├── stores/              # Zustand state stores
│   ├── authStore.ts     # Authentication
│   ├── gameStore.ts     # Game state
│   └── leaderboardStore.ts # Scores
├── hooks/               # Custom React hooks
├── utils/               # Utility functions
├── types/               # TypeScript definitions
└── lib/                 # External integrations
    └── musixmatch.ts    # API client
```

## API Integration

### Musixmatch API
- **Lyrics Search**: Artist and track discovery
- **Rate Limiting**: Respectful API usage
- **Error Handling**: Graceful degradation
- **Caching**: Performance optimization

### Serverless Functions
Located in `api/` directory for Vercel deployment:
- **CORS Handling**: Cross-origin request management
- **API Proxying**: Secure key management
- **Error Responses**: Consistent error handling

## Deployment

### Vercel (Recommended)
1. Connect repository to Vercel
2. Configure environment variables
3. Deploy automatically on push

### Environment Variables
```env
VITE_MUSIXMATCH_API_KEY=your_production_api_key
```

### Build Optimization
- **Code Splitting**: Automatic route-based splitting
- **Tree Shaking**: Unused code elimination
- **Asset Optimization**: Image and resource compression

## Contributing

### Development Workflow
1. Create feature branch from `main`
2. Make changes following code standards
3. Run type checking and linting
4. Test functionality thoroughly
5. Submit pull request

### Code Standards
- TypeScript strict mode required
- Biome configuration enforced
- Component-based architecture
- Custom hooks for state logic
- Comprehensive error handling

### Testing
- Unit tests for utility functions
- Integration tests for user flows
- Manual testing on mobile devices
- Performance monitoring

## License

This project is part of the Musixmatch React Engineering Test. All rights reserved.

## Support

For technical issues or feature requests, please contact the development team or refer to the project documentation.