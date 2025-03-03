import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import MovieDetails from '@/views/MovieDetails.vue'
import Watchlist from '@/views/Watchlist.vue'

const routes = [
  { path: '/', component: Home },
  { path: '/movie/:id', component: MovieDetails, props: true },
  { path: '/watchlist', component: Watchlist },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
