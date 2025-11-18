import type { VercelRequest, VercelResponse } from "@vercel/node";

const MUSIXMATCH_BASE_URL = "https://api.musixmatch.com/ws/1.1";

export default async function handler(req: VercelRequest, res: VercelResponse) {
	res.setHeader(
		"Access-Control-Allow-Origin",
		"https://who-sings-sofs-projects.vercel.app",
	);
	res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
	res.setHeader("Access-Control-Allow-Headers", "Content-Type");

	if (req.method === "OPTIONS") {
		res.status(200).end();
		return;
	}

	if (req.method !== "GET") {
		res.status(405).json({ error: "Method not allowed" });
		return;
	}

	const API_KEY = process.env.MUSIXMATCH_API_KEY;
	if (!API_KEY) {
		res.status(500).json({ error: "API key not configured" });
		return;
	}

	const {
		country = "it",
		page_size = "50",
		f_has_lyrics = "1",
		chart_name = "mxmweekly",
	} = req.query;

	try {
		const url = new URL(`${MUSIXMATCH_BASE_URL}/chart.tracks.get`);
		url.searchParams.set("apikey", API_KEY);
		url.searchParams.set("country", country as string);
		url.searchParams.set("page_size", page_size as string);
		url.searchParams.set("f_has_lyrics", f_has_lyrics as string);
		url.searchParams.set("chart_name", chart_name as string);

		const response = await fetch(url.toString());

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}

		const data = await response.json();
		res.status(200).json(data);
	} catch (error) {
		console.error("Musixmatch tracks API Error:", error);
		res.status(500).json({
			error: "Failed to fetch tracks from Musixmatch API",
			details: error instanceof Error ? error.message : "Unknown error",
		});
	}
}
