const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

// Search movies
app.get('/api/search', async (req, res) => {
  const { query } = req.query;
  try {
    const response = await axios.get(`${TMDB_BASE_URL}/search/movie`, {
      params: {
        api_key: TMDB_API_KEY,
        query,
      },
    });
    res.json(response.data.results);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch movies' });
  }
});

// Get movie details
app.get('/api/movie/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const response = await axios.get(`${TMDB_BASE_URL}/movie/${id}`, {
      params: {
        api_key: TMDB_API_KEY,
      },
    });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch movie details' });
  }
});

// Get recommendations based on watchlist genres
app.get('/api/recommendations', async (req, res) => {
  const { genreIds } = req.query; // Expect comma-separated genre IDs (e.g., "28,12")

  try {
    // Fetch movies based on the genres of the watchlist
    const response = await axios.get(`${TMDB_BASE_URL}/discover/movie`, {
      params: {
        api_key: TMDB_API_KEY,
        with_genres: genreIds, // Filter by genres
        sort_by: 'popularity.desc', // Show popular movies first
      },
    });
    res.json(response.data.results);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch recommendations' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});