import {
	generateQuizQuestions,
	getPopularTracks,
	getTrackSnippet,
} from "../musixmatch";
import {
	mockApiErrorResponse,
	mockEmptySnippetResponse,
	mockGloballyRestrictedSnippetResponse,
	mockRestrictedSnippetResponse,
	mockSnippetResponse,
	mockSnippetWithAsterisks,
	mockTracksResponse,
	mockTransformedTracks,
} from "./fixtures/musixmatch-responses";
import {GAME_CONFIG} from "@/utils/constants.ts";

vi.stubGlobal("fetch", vi.fn());

// Mock environment
vi.mock("import.meta", () => ({
	env: {
		DEV: true,
	},
}));

describe("Musixmatch Service", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe("getPopularTracks", () => {
		it("should fetch and transform tracks data correctly", async () => {
			// Mock successful API response
			vi.mocked(fetch).mockResolvedValue({
				ok: true,
				json: () => Promise.resolve(mockTracksResponse),
			} as Response);

			const result = await getPopularTracks(4);

			expect(fetch).toHaveBeenCalledWith(
				expect.stringContaining("/chart.tracks.get"),
			);
			expect(result).toEqual(mockTransformedTracks);
			expect(result).toHaveLength(4);
		});

		it("should include correct query parameters", async () => {
			vi.mocked(fetch).mockResolvedValue({
				ok: true,
				json: () => Promise.resolve(mockTracksResponse),
			} as Response);

			await getPopularTracks(10);

			const fetchCall = vi.mocked(fetch).mock.calls[0][0] as string;
			expect(fetchCall).toContain("country=it");
			expect(fetchCall).toContain("page_size=10");
			expect(fetchCall).toContain("f_has_lyrics=1");
			expect(fetchCall).toContain("chart_name=mxmweekly");
		});

		it("should handle HTTP errors", async () => {
			vi.mocked(fetch).mockResolvedValue({
				ok: false,
				status: 500,
			} as Response);

			await expect(getPopularTracks()).rejects.toThrow(
				"HTTP error! status: 500",
			);
		});

		it("should handle API errors", async () => {
			vi.mocked(fetch).mockResolvedValue({
				ok: true,
				json: () => Promise.resolve(mockApiErrorResponse),
			} as Response);

			await expect(getPopularTracks()).rejects.toThrow(
				"Musixmatch API Error: Invalid API key",
			);
		});
	});

	describe("getTrackSnippet", () => {
		it("should fetch and return snippet correctly", async () => {
			vi.mocked(fetch).mockResolvedValue({
				ok: true,
				json: () => Promise.resolve(mockSnippetResponse),
			} as Response);

			const result = await getTrackSnippet(123456);

			expect(fetch).toHaveBeenCalledWith(
				expect.stringContaining("/track.snippet.get"),
			);
			expect(fetch).toHaveBeenCalledWith(
				expect.stringContaining("track_id=123456"),
			);
			expect(result).toBe(
				"I'm in love with the shape of you\nWe push and pull like a magnet do\nAlthough my heart is falling too\nI'm in love with your body",
			);
		});

		it("should return empty string for missing snippet", async () => {
			vi.mocked(fetch).mockResolvedValue({
				ok: true,
				json: () => Promise.resolve(mockEmptySnippetResponse),
			} as Response);

			const result = await getTrackSnippet(123456);

			expect(result).toBe("");
		});

		it("should return null for IT-restricted tracks", async () => {
			vi.mocked(fetch).mockResolvedValue({
				ok: true,
				json: () => Promise.resolve(mockRestrictedSnippetResponse),
			} as Response);

			const result = await getTrackSnippet(123456);

			expect(result).toBe(null);
		});

		it("should return null for globally restricted tracks", async () => {
			vi.mocked(fetch).mockResolvedValue({
				ok: true,
				json: () => Promise.resolve(mockGloballyRestrictedSnippetResponse),
			} as Response);

			const result = await getTrackSnippet(123456);

			expect(result).toBe(null);
		});

		it("should handle malformed response", async () => {
			vi.mocked(fetch).mockResolvedValue({
				ok: true,
				json: () =>
					Promise.resolve({
						message: {
							header: { status_code: 200 },
							body: {},
						},
					}),
			} as Response);

			const result = await getTrackSnippet(123456);

			expect(result).toBe(null);
		});
	});

	describe("generateQuizQuestions", () => {
		it("should generate quiz questions with correct structure", async () => {
			// Mock tracks response
			vi.mocked(fetch)
				.mockResolvedValueOnce({
					ok: true,
					json: () => Promise.resolve(mockTracksResponse),
				} as Response)
				// Mock snippet responses for each track
				.mockResolvedValue({
					ok: true,
					json: () => Promise.resolve(mockSnippetResponse),
				} as Response);

			const result = await generateQuizQuestions(1);

			expect(result).toHaveLength(1);
			expect(result[0]).toMatchObject({
				id: expect.stringMatching(/^q-\d+$/),
				lyrics: expect.any(String),
				correctArtist: expect.any(String),
				options: expect.arrayContaining([expect.any(String)]),
				track: {
					trackId: expect.any(Number),
					trackName: expect.any(String),
					artistId: expect.any(Number),
					artistName: expect.any(String),
				},
			});

			// Each question should have right amount of options
			expect(result[0].options).toHaveLength(GAME_CONFIG.ANSWER_OPTIONS_COUNT);

			// Options should include the correct artist
			expect(result[0].options).toContain(result[0].correctArtist);
		});

		it("should clean snippet content", async () => {
			// Mock tracks response
			vi.mocked(fetch)
				.mockResolvedValueOnce({
					ok: true,
					json: () => Promise.resolve(mockTracksResponse),
				} as Response)
				// Mock snippet with asterisks
				.mockResolvedValue({
					ok: true,
					json: () => Promise.resolve(mockSnippetWithAsterisks),
				} as Response);

			const result = await generateQuizQuestions(1);

			expect(result[0].lyrics).toBe("I'm in love with the shape of you");
			expect(result[0].lyrics).not.toContain("***");
		});

		it("should skip tracks with empty or restricted snippets", async () => {
			// Mock tracks response with multiple tracks
			vi.mocked(fetch)
				.mockResolvedValueOnce({
					ok: true,
					json: () => Promise.resolve(mockTracksResponse),
				} as Response)
				// First snippet is empty, second is restricted, third is valid
				.mockResolvedValueOnce({
					ok: true,
					json: () => Promise.resolve(mockEmptySnippetResponse),
				} as Response)
				.mockResolvedValueOnce({
					ok: true,
					json: () => Promise.resolve(mockRestrictedSnippetResponse),
				} as Response)
				.mockResolvedValue({
					ok: true,
					json: () => Promise.resolve(mockSnippetResponse),
				} as Response);

			const result = await generateQuizQuestions(1);

			expect(result).toHaveLength(1);
			expect(result[0].lyrics).toBeTruthy();
		});

		it("should not repeat artists", async () => {
			vi.mocked(fetch)
				.mockResolvedValueOnce({
					ok: true,
					json: () => Promise.resolve(mockTracksResponse),
				} as Response)
				.mockResolvedValue({
					ok: true,
					json: () => Promise.resolve(mockSnippetResponse),
				} as Response);

			const result = await generateQuizQuestions(1);

			// With 1 question, there should be no duplicates by definition
			expect(result).toHaveLength(1);
			expect(result[0].correctArtist).toBeTruthy();
		});

		it("should throw error when no tracks available", async () => {
			vi.mocked(fetch).mockResolvedValue({
				ok: true,
				json: () =>
					Promise.resolve({
						message: {
							header: { status_code: 200 },
							body: { track_list: [] },
						},
					}),
			} as Response);

			await expect(generateQuizQuestions(1)).rejects.toThrow(
				"Not enough tracks available",
			);
		});

		it("should throw error when no valid questions generated", async () => {
			vi.mocked(fetch)
				.mockResolvedValueOnce({
					ok: true,
					json: () => Promise.resolve(mockTracksResponse),
				} as Response)
				// All snippets are restricted
				.mockResolvedValue({
					ok: true,
					json: () => Promise.resolve(mockRestrictedSnippetResponse),
				} as Response);

			await expect(generateQuizQuestions(1)).rejects.toThrow(
				"Could not generate any quiz questions",
			);
		});

		it("should handle rate limiting delay", async () => {
			vi.mocked(fetch)
				.mockResolvedValueOnce({
					ok: true,
					json: () => Promise.resolve(mockTracksResponse),
				} as Response)
				.mockResolvedValue({
					ok: true,
					json: () => Promise.resolve(mockSnippetResponse),
				} as Response);

			const startTime = Date.now();
			await generateQuizQuestions(1);
			const endTime = Date.now();

			// Should complete quickly for single question (no delay between calls)
			expect(endTime - startTime).toBeLessThan(100);
		});
	});

	describe("URL handling", () => {
		it("should use development URL in DEV mode", async () => {
			vi.mocked(fetch).mockResolvedValue({
				ok: true,
				json: () => Promise.resolve(mockTracksResponse),
			} as Response);

			await getPopularTracks();

			const fetchCall = vi.mocked(fetch).mock.calls[0][0] as string;
			expect(fetchCall).toContain("/api/chart.tracks.get");
		});

		it("should use production URL in production mode", async () => {
			// Mock production environment
			vi.mocked(import.meta).env.DEV = false;

			vi.mocked(fetch).mockResolvedValue({
				ok: true,
				json: () => Promise.resolve(mockTracksResponse),
			} as Response);

			await getPopularTracks();

			const fetchCall = vi.mocked(fetch).mock.calls[0][0] as string;
			expect(fetchCall).toContain("/api/tracks");
			expect(fetchCall).not.toContain("chart.tracks.get");
		});
	});
});
