<template>
    <div class="watchlist">
      <h1>⭐ Your Watchlist</h1>
      <div v-if="watchlist.length" class="movie-grid">
        <div v-for="(movie, index) in watchlist" :key="movie.id" class="movie-card">
          <img :src="`https://image.tmdb.org/t/p/w300${movie.poster_path}`" :alt="movie.title" />
          <h3>{{ movie.title }}</h3>
          <p>⭐ {{ movie.vote_average }}</p>
          <button @click="deleteMovie(index)" class="delete-button">🗑️ Delete</button>
        </div>
      </div>
      <p v-else class="no-results">Your watchlist is empty. Add some movies!</p>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  
  // Load watchlist from localStorage
  const watchlist = ref(JSON.parse(localStorage.getItem('watchlist')) || []);
  
  // Function to delete a movie from the watchlist
  const deleteMovie = (index) => {
    watchlist.value.splice(index, 1); // Remove the movie from the array
    localStorage.setItem('watchlist', JSON.stringify(watchlist.value)); // Update localStorage
  };
  </script>
  
  <style scoped>
  .watchlist {
    padding: 2rem;
  }
  
  h1 {
    font-size: 2rem;
    color: #2c3e50;
    margin-bottom: 1.5rem;
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
    text-align: center;
    padding: 1rem;
  }
  
  .movie-card:hover {
    transform: translateY(-5px);
  }
  
  .movie-card img {
    width: 100%;
    height: auto;
    border-radius: 8px;
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
  
  .delete-button {
    background-color: #e74c3c;
    color: #fff;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.9rem;
    margin-top: 0.5rem;
    transition: background-color 0.3s ease;
  }
  
  .delete-button:hover {
    background-color: #c0392b;
  }
  
  .no-results {
    font-size: 1.2rem;
    color: #666;
  }
  </style>