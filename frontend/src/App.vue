<script setup>
import { RouterLink, RouterView } from 'vue-router';
</script>

<template>
  <header>
    <nav>
      <div class="nav-container">
        <RouterLink to="/" class="logo">🎬 MovieReco</RouterLink>
        <div class="nav-links">
          <RouterLink to="/">Home</RouterLink>
          <RouterLink to="/watchlist">Watchlist</RouterLink>
        </div>
      </div>
    </nav>
  </header>

  <main>
    <RouterView />
  </main>

  <footer>
    <p>&copy; 2023 MovieReco.</p>
  </footer>

  <!-- Back to Top Button -->
  <button v-if="showBackToTop" @click="scrollToTop" class="back-to-top">⬆️</button>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue';

export default {
  setup() {
    const showBackToTop = ref(false);

    const handleScroll = () => {
      showBackToTop.value = window.scrollY > 200;
    };

    const scrollToTop = () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    onMounted(() => {
      window.addEventListener('scroll', handleScroll);
    });

    onUnmounted(() => {
      window.removeEventListener('scroll', handleScroll);
    });

    return {
      showBackToTop,
      scrollToTop,
    };
  },
};
</script>

<style scoped>
/* Global Styles */
body {
  margin: 0;
  font-family: 'Arial', sans-serif;
  background-color: #f8f9fa;
  color: #333;
}

header {
  background-color: #2c3e50;
  padding: 1rem 0;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

nav {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.nav-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  font-size: 1.5rem;
  font-weight: bold;
  color: #fff;
  text-decoration: none;
}

.nav-links {
  display: flex;
  gap: 1.5rem;
}

.nav-links a {
  color: #fff;
  text-decoration: none;
  font-size: 1rem;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: background-color 0.3s ease;
}

.nav-links a:hover {
  background-color: #34495e;
}

.nav-links a.router-link-exact-active {
  background-color: #1abc9c;
}

main {
  max-width: 1200px;
  margin: 2rem auto;
  padding: 0 1rem;
}

footer {
  background-color: #2c3e50;
  color: #fff;
  text-align: center;
  padding: 1rem 0;
  margin-top: 2rem;
}

footer p {
  margin: 0;
}

.back-to-top {
  position: fixed;
  bottom: 20px;
  right: 20px;
  background-color: #1abc9c;
  color: #fff;
  border: none;
  padding: 0.75rem;
  border-radius: 50%;
  cursor: pointer;
  font-size: 1rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  transition: opacity 0.3s ease;
}

.back-to-top:hover {
  background-color: #16a085;
}
</style>