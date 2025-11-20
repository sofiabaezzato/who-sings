import type { Question } from "@/stores/gameStore";
import type { MusixmatchApiResponse, MusixmatchTrack } from "@/types";
import { API_CONFIG, GAME_CONFIG } from "@/utils/constants";

const BASE_URL = API_CONFIG.BASE_URL;

async function apiCall<T>(
	endpoint: string,
	params: Record<string, string> = {},
): Promise<T> {
	// Map endpoints to serverless function paths for production
	const endpointMap: Record<string, string> = {
		"chart.tracks.get": "tracks",
		"track.snippet.get": "snippet",
	};

	let url: URL;

	if (import.meta.env.DEV) {
		// Development: Vite proxy
		url = new URL(`${window.location.origin}${BASE_URL}/${endpoint}`);
		// API key injected by Vite proxy
	} else {
		// Production: serverless functions
		const functionPath = endpointMap[endpoint];
		if (!functionPath) {
			throw new Error(`Unsupported endpoint: ${endpoint}`);
		}
		url = new URL(`${window.location.origin}${BASE_URL}/${functionPath}`);
	}

	Object.entries(params).forEach(([key, value]) => {
		url.searchParams.append(key, value);
	});

	try {
		const response = await fetch(url.toString());

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}

		const data: MusixmatchApiResponse<T> = await response.json();

		// Check Musixmatch API status
		if (data.message.header.status_code !== 200) {
			throw new Error(
				`Musixmatch API Error: ${data.message.header.hint || "Unknown error"}`,
			);
		}

		return data.message.body;
	} catch (error) {
		console.error("API call failed:", error);
		throw error;
	}
}

// Get popular tracks with lyrics
export async function getPopularTracks(limit = 50): Promise<
	Array<{
		trackId: number;
		trackName: string;
		artistId: number;
		artistName: string;
	}>
> {
	const data = await apiCall<{ track_list: MusixmatchTrack[] }>(
		"chart.tracks.get",
		{
			country: API_CONFIG.DEFAULT_COUNTRY,
			page_size: limit.toString(),
			f_has_lyrics: "1",
			chart_name: "mxmweekly",
		},
	);

	const tracks = data.track_list.map((item) => ({
		trackId: item.track.track_id,
		trackName: item.track.track_name,
		artistId: item.track.artist_id,
		artistName: item.track.artist_name,
	}));

	return tracks.slice(0, limit);
}

// Get lyrics snippet for a specific track
export async function getTrackSnippet(trackId: number) {
	const data = await apiCall<{
		snippet: {
			snippet_body: string;
			region_restriction?: {
				allowed?: string[];
				blocked?: string[];
			};
			restricted?: number;
		};
	}>("track.snippet.get", { track_id: trackId.toString() });

	const snippet = data.snippet;
	if (!snippet) return null;

	// Check if track is restricted in current country
	const regionRestriction = snippet.region_restriction;
	if (regionRestriction) {
		// If allowed list exists and current country or worldwide are in it, add snippet
		if (
			regionRestriction.allowed?.includes(
				API_CONFIG.DEFAULT_COUNTRY_COPYRIGHT,
			) ||
			regionRestriction.allowed?.includes("XW")
		) {
			return snippet.snippet_body || "";
		}
		// If blocked list exists and current country or worldwide are in it, skip
		if (
			regionRestriction.blocked?.includes(
				API_CONFIG.DEFAULT_COUNTRY_COPYRIGHT,
			) ||
			regionRestriction.blocked?.includes("XW")
		) {
			return null;
		}
	}

	return snippet.snippet_body || "";
}

// Generate quiz questions using lyric snippets
export async function generateQuizQuestions(
	questionCount: number = GAME_CONFIG.QUESTIONS_PER_GAME,
): Promise<Question[]> {
	// Start with more tracks to account for filtering
	const tracks = await getPopularTracks(API_CONFIG.DEFAULT_PAGE_SIZE);

	if (tracks.length < questionCount) {
		throw new Error("Not enough tracks available from Musixmatch API");
	}

	const questions: Question[] = [];
	const usedArtists = new Set<string>();
	const allArtists = [...new Set(tracks.map((t) => t.artistName))];

	// Shuffle tracks to get random order each time
	tracks.sort(() => Math.random() - 0.5);

	for (let i = 0; i < questionCount && tracks.length > 0; i++) {
		const availableTrack = tracks.find(
			(track) => !usedArtists.has(track.artistName),
		);
		if (!availableTrack) break;

		const snippet = await getTrackSnippet(availableTrack.trackId);

		if (!snippet || snippet.length < 10) {
			tracks.splice(tracks.indexOf(availableTrack), 1);
			i--;
			continue;
		}

		const cleanSnippet = snippet
			.replace(/\*{3,}.*?\*{3,}/g, "")
			.replace(/\.\.\./g, "")
			.trim();

		if (!cleanSnippet) {
			tracks.splice(tracks.indexOf(availableTrack), 1);
			i--;
			continue;
		}

		const wrongArtists = allArtists
			.filter(
				(artist) =>
					artist !== availableTrack.artistName && !usedArtists.has(artist),
			)
			.sort(() => Math.random() - 0.5)
			.slice(0, GAME_CONFIG.ANSWER_OPTIONS_COUNT - 1);

		if (wrongArtists.length < GAME_CONFIG.ANSWER_OPTIONS_COUNT - 1) {
			tracks.splice(tracks.indexOf(availableTrack), 1);
			i--;
			continue;
		}

		const options = [availableTrack.artistName, ...wrongArtists].sort(
			() => Math.random() - 0.5,
		);

		questions.push({
			id: `q-${i}`,
			lyrics: cleanSnippet,
			correctArtist: availableTrack.artistName,
			options,
			track: {
				trackId: availableTrack.trackId,
				trackName: availableTrack.trackName,
				artistId: availableTrack.artistId,
				artistName: availableTrack.artistName,
			},
		});

		usedArtists.add(availableTrack.artistName);

		if (i < questionCount - 1) {
			await new Promise((resolve) =>
				setTimeout(resolve, API_CONFIG.RATE_LIMIT_DELAY_MS),
			);
		}
	}

	if (questions.length === 0) {
		throw new Error(
			"Could not generate any quiz questions from available tracks",
		);
	}

	if (questions.length < questionCount) {
		throw new Error(`Only ${questions.length} questions available.`);
	}

	return questions;
}
