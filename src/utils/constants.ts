// Game configuration
export const GAME_CONFIG = {
	QUESTIONS_PER_GAME: 10,
	TIME_PER_QUESTION_S: 20,
	BASE_POINTS: 100,
	TIME_BONUS_MULTIPLIER: 0.5,
	MIN_LYRIC_LENGTH: 20,
	MAX_LYRIC_LENGTH: 100,
} as const;

// API configuration
export const API_CONFIG = {
	BASE_URL:
		import.meta.env.VITE_API_BASE_URL || "https://api.musixmatch.com/ws/1.1",
	RATE_LIMIT_DELAY_MS: 200,
	DEFAULT_COUNTRY: "it",
	DEFAULT_PAGE_SIZE: 50,
} as const;
