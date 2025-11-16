import type { VercelRequest, VercelResponse } from '@vercel/node';

const MUSIXMATCH_BASE_URL = 'https://api.musixmatch.com/ws/1.1';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const API_KEY = process.env.MUSIXMATCH_API_KEY;
  if (!API_KEY) {
    res.status(500).json({ error: 'API key not configured' });
    return;
  }

  const { track_id } = req.query;
  
  if (!track_id || typeof track_id !== 'string') {
    res.status(400).json({ error: 'Missing or invalid track_id parameter' });
    return;
  }

  try {
    const url = new URL(`${MUSIXMATCH_BASE_URL}/track.snippet.get`);
    url.searchParams.set('apikey', API_KEY);
    url.searchParams.set('track_id', track_id);

    const response = await fetch(url.toString());
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error('Musixmatch snippet API Error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch snippet from Musixmatch API',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}