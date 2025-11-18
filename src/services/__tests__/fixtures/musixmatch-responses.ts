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
						album_coverart_100x100: "https://example.com/cover1.jpg",
					},
				},
				{
					track: {
						track_id: 234567,
						track_name: "Blinding Lights",
						artist_id: 890,
						artist_name: "The Weeknd",
						album_coverart_100x100: "https://example.com/cover2.jpg",
					},
				},
				{
					track: {
						track_id: 345678,
						track_name: "Watermelon Sugar",
						artist_id: 901,
						artist_name: "Harry Styles",
						album_coverart_100x100: "https://example.com/cover3.jpg",
					},
				},
				{
					track: {
						track_id: 456789,
						track_name: "Levitating",
						artist_id: 912,
						artist_name: "Dua Lipa",
						album_coverart_100x100: "https://example.com/cover4.jpg",
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
		albumCoverArt: "https://example.com/cover1.jpg",
	},
	{
		trackId: 234567,
		trackName: "Blinding Lights",
		artistId: 890,
		artistName: "The Weeknd",
		albumCoverArt: "https://example.com/cover2.jpg",
	},
	{
		trackId: 345678,
		trackName: "Watermelon Sugar",
		artistId: 901,
		artistName: "Harry Styles",
		albumCoverArt: "https://example.com/cover3.jpg",
	},
	{
		trackId: 456789,
		trackName: "Levitating",
		artistId: 912,
		artistName: "Dua Lipa",
		albumCoverArt: "https://example.com/cover4.jpg",
	},
];
