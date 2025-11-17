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
		// Development: use Vite proxy
		url = new URL(`${window.location.origin}${BASE_URL}/${endpoint}`);
		// API key injected by Vite proxy
	} else {
		// Production: use serverless functions
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
export async function getPopularTracks(limit = 50) {
	const data = await apiCall<{ track_list: MusixmatchTrack[] }>(
		"chart.tracks.get",
		{
			country: API_CONFIG.DEFAULT_COUNTRY,
			page_size: limit.toString(),
			f_has_lyrics: "1",
			chart_name: "mxmweekly", // chart: most viewed lyrics in the last 7 days
		},
	);

	return data.track_list.map((item) => ({
		trackId: item.track.track_id,
		trackName: item.track.track_name,
		artistId: item.track.artist_id,
		artistName: item.track.artist_name,
		albumCoverArt: item.track.album_coverart_100x100,
	}));
}

// Get lyrics snippet for a specific track
export async function getTrackSnippet(trackId: number) {
	const data = await apiCall<{ snippet: { snippet_body: string } }>(
		"track.snippet.get",
		{ track_id: trackId.toString() },
	);

	return data.snippet?.snippet_body || "";
}

// Generate quiz questions using lyric snippets
export async function generateQuizQuestions(
	questionCount: number = GAME_CONFIG.QUESTIONS_PER_GAME,
): Promise<Question[]> {
	const tracks = await getPopularTracks(questionCount * 5);

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
			.slice(0, 3);

		if (wrongArtists.length < 3) {
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
		throw new Error(
			`Only ${questions.length} questions available. Need API key for full quiz experience.`,
		);
	}

	return questions;
}
