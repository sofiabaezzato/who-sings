// Musixmatch API response wrapper
export interface MusixmatchApiResponse<T> {
	message: {
		header: {
			status_code: number;
			hint?: string;
			execute_time?: number;
		};
		body: T;
	};
}

// Track object from Musixmatch
export interface MusixmatchTrack {
	track: {
		track_id: number;
		track_name: string;
		artist_id: number;
		artist_name: string;
		album_name?: string;
		album_coverart_100x100?: string;
		has_lyrics: number;
		track_rating?: number;
	};
}
