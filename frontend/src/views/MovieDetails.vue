<template>
  <div class="movie-details">
    <div class="movie-header">
      <h1>{{ movie.title }}</h1>
      <button @click="goBack" class="back-button">⬅ Back to Home</button>
    </div>
    <div class="movie-content">
      <img :src="`https://image.tmdb.org/t/p/w500${movie.poster_path}`" :alt="movie.title" />
      <div class="movie-info">
        <p><strong>⭐ Rating:</strong> {{ movie.vote_average }}</p>
        <p><strong>📅 Release Date:</strong> {{ movie.release_date }}</p>
        <p><strong>📖 Overview:</strong> {{ movie.overview }}</p>
        <button @click="addToWatchlist" class="watchlist-button">➕ Add to Watchlist</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';

const route = useRoute();
const router = useRouter();
const movie = ref({});

onMounted(async () => {
  const response = await axios.get(`http://localhost:5000/api/movie/${route.params.id}`);
  movie.value = response.data;
});

const addToWatchlist = () => {
  const watchlist = JSON.parse(localStorage.getItem('watchlist')) || [];
  
  // Include genre_ids when adding to watchlist
  const movieData = {
    id: movie.value.id,
    title: movie.value.title,
    poster_path: movie.value.poster_path,
    vote_average: movie.value.vote_average,
    genre_ids: movie.value.genres.map(genre => genre.id), // Store genre IDs
  };

  watchlist.push(movieData);
  localStorage.setItem('watchlist', JSON.stringify(watchlist));
  alert('Added to watchlist!');
};

const goBack = () => {
  router.push('/');
};
</script>

<style scoped>
.movie-details {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.movie-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

h1 {
  font-size: 2rem;
  color: #2c3e50;
}

.back-button {
  background-color: #1abc9c;
  color: #fff;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
}

.movie-content {
  display: flex;
  gap: 2rem;
}

.movie-content img {
  width: 300px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.movie-info {
  flex: 1;
}

.movie-info p {
  font-size: 1.1rem;
  color: #333;
  margin-bottom: 1rem;
}

.watchlist-button {
  background-color: #2c3e50;
  color: #fff;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  margin-top: 1rem;
}
</style>