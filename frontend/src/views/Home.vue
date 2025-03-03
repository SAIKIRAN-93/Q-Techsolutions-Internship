<template>
  <div class="home">
    <h1>🍿 Find Your Next Favorite Movie</h1>
    <input
      v-model="searchQuery"
      @input="searchMovies"
      placeholder="Search for movies..."
      class="search-input"
    />
    <div v-if="loading" class="loading-spinner">Loading...</div>
    <div v-if="movies.length" class="movie-grid">
      <div v-for="movie in movies" :key="movie.id" @click="viewMovieDetails(movie.id)" class="movie-card">
        <img :src="`https://image.tmdb.org/t/p/w300${movie.poster_path}`" :alt="movie.title" />
        <h3>{{ movie.title }}</h3>
        <p>⭐ {{ movie.vote_average }}</p>
      </div>
    </div>
    <p v-else-if="!loading" class="no-results">No movies found. Try searching for something!</p>

    <!-- Recommended Movies Section -->
    <h2>🎬 Recommended Movies</h2>
    <div v-if="recommendations.length" class="movie-grid">
      <div v-for="movie in recommendations" :key="movie.id" @click="viewMovieDetails(movie.id)" class="movie-card">
        <img :src="`https://image.tmdb.org/t/p/w300${movie.poster_path}`" :alt="movie.title" />
        <h3>{{ movie.title }}</h3>
        <p>⭐ {{ movie.vote_average }}</p>
      </div>
    </div>
    <p v-else class="no-results">Loading recommendations...</p>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

const searchQuery = ref('');
const movies = ref([]);
const recommendations = ref([]);
const loading = ref(false);
const router = useRouter();

// Get genres from the user's watchlist
const getWatchlistGenres = () => {
  const watchlist = JSON.parse(localStorage.getItem('watchlist')) || [];
  const allGenres = watchlist.flatMap(movie => movie.genre_ids || []);
  const uniqueGenres = [...new Set(allGenres)]; // Remove duplicates
  return uniqueGenres.join(','); // Convert to comma-separated string
};

// Fetch recommendations based on watchlist genres
const fetchRecommendations = async () => {
  const genreIds = getWatchlistGenres();
  if (genreIds) {
    try {
      const response = await axios.get('http://localhost:5000/api/recommendations', {
        params: { genreIds },
      });
      recommendations.value = response.data;
    } catch (error) {
      console.error('Failed to fetch recommendations:', error);
    }
  } else {
    // Fallback: Show popular movies if watchlist is empty
    const response = await axios.get('http://localhost:5000/api/recommendations');
    recommendations.value = response.data;
  }
};

// Fetch recommendations on page load
onMounted(fetchRecommendations);

// Watch for changes in the watchlist
watch(() => JSON.parse(localStorage.getItem('watchlist')), () => {
  fetchRecommendations();
});

// Search movies
const searchMovies = async () => {
  if (searchQuery.value) {
    loading.value = true;
    try {
      const response = await axios.get('http://localhost:5000/api/search', {
        params: { query: searchQuery.value },
      });
      movies.value = response.data;
    } catch (error) {
      console.error('Error fetching movies:', error);
    } finally {
      loading.value = false;
    }
  }
};

// View movie details
const viewMovieDetails = (id) => {
  router.push(`/movie/${id}`);
};
</script>

<style scoped>
.home {
  text-align: center;
  padding: 2rem;
}

h1 {
  font-size: 2rem;
  color: #2c3e50;
  margin-bottom: 1.5rem;
}

h2 {
  font-size: 1.5rem;
  color: #2c3e50;
  margin-top: 2rem;
  margin-bottom: 1rem;
}

.search-input {
  width: 100%;
  max-width: 400px;
  padding: 0.75rem;
  border: 2px solid #1abc9c;
  border-radius: 8px;
  font-size: 1rem;
  margin-bottom: 2rem;
}

.movie-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1.5rem;
}

.movie-card {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.3s ease;
  cursor: pointer;
}

.movie-card:hover {
  transform: translateY(-5px);
}

.movie-card img {
  width: 100%;
  height: auto;
}

.movie-card h3 {
  font-size: 1.1rem;
  margin: 0.5rem 0;
  color: #2c3e50;
}

.movie-card p {
  font-size: 0.9rem;
  color: #1abc9c;
  margin: 0.5rem 0;
}

.no-results {
  font-size: 1.2rem;
  color: #666;
}

.loading-spinner {
  font-size: 1.2rem;
  color: #1abc9c;
  margin-top: 1rem;
}
</style>