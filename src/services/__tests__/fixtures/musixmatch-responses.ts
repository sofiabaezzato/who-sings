// Mock data fixtures for Musixmatch API responses

export const mockTracksResponse = {
	message: {
		header: {
			status_code: 200,
			execute_time: 0.123,
		},
		body: {
			track_list: [
				{
					track: {
						track_id: 123456,
						track_name: "Shape of You",
						artist_id: 789,
						artist_name: "Ed Sheeran",
						has_lyrics: 1,
						restricted: 0,
					},
				},
				{
					track: {
						track_id: 234567,
						track_name: "Blinding Lights",
						artist_id: 890,
						artist_name: "The Weeknd",
						has_lyrics: 1,
						restricted: 0,
					},
				},
				{
					track: {
						track_id: 345678,
						track_name: "Watermelon Sugar",
						artist_id: 901,
						artist_name: "Harry Styles",
						has_lyrics: 1,
						restricted: 0,
					},
				},
				{
					track: {
						track_id: 456789,
						track_name: "Levitating",
						artist_id: 912,
						artist_name: "Dua Lipa",
						has_lyrics: 1,
						restricted: 0,
					},
				},
			],
		},
	},
};

export const mockSnippetResponse = {
	message: {
		header: {
			status_code: 200,
			execute_time: 0.089,
		},
		body: {
			snippet: {
				snippet_body:
					"I'm in love with the shape of you\nWe push and pull like a magnet do\nAlthough my heart is falling too\nI'm in love with your body",
				region_restriction: {
					allowed: ["IT", "US", "UK"],
					blocked: []
				},
				restricted: 0
			},
		},
	},
};

export const mockSnippetWithAsterisks = {
	message: {
		header: {
			status_code: 200,
			execute_time: 0.089,
		},
		body: {
			snippet: {
				snippet_body:
					"***This is copyrighted content*** I'm in love with the shape of you ***End copyright***",
				region_restriction: {
					allowed: ["IT", "XW"],
					blocked: []
				},
				restricted: 0
			},
		},
	},
};

export const mockEmptySnippetResponse = {
	message: {
		header: {
			status_code: 200,
			execute_time: 0.089,
		},
		body: {
			snippet: {
				snippet_body: "",
				region_restriction: {
					allowed: ["IT"],
					blocked: []
				},
				restricted: 0
			},
		},
	},
};

export const mockRestrictedSnippetResponse = {
	message: {
		header: {
			status_code: 200,
			execute_time: 0.089,
		},
		body: {
			snippet: {
				snippet_body: "Restricted content that should not be returned",
				region_restriction: {
					allowed: ["US"],
					blocked: ["IT"]
				},
				restricted: 0
			},
		},
	},
};

export const mockGloballyRestrictedSnippetResponse = {
	message: {
		header: {
			status_code: 200,
			execute_time: 0.089,
		},
		body: {
			snippet: {
				snippet_body: "",
				region_restriction: {
					allowed: [],
					blocked: ["XW"]
				},
				restricted: 1
			},
		},
	},
};

export const mockApiErrorResponse = {
	message: {
		header: {
			status_code: 401,
			hint: "Invalid API key",
		},
		body: {},
	},
};

export const mockTransformedTracks = [
	{
		trackId: 123456,
		trackName: "Shape of You",
		artistId: 789,
		artistName: "Ed Sheeran",
	},
	{
		trackId: 234567,
		trackName: "Blinding Lights",
		artistId: 890,
		artistName: "The Weeknd",
	},
	{
		trackId: 345678,
		trackName: "Watermelon Sugar",
		artistId: 901,
		artistName: "Harry Styles",
	},
	{
		trackId: 456789,
		trackName: "Levitating",
		artistId: 912,
		artistName: "Dua Lipa",
	},
];
