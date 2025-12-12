import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '../pages/Dashboard.vue'
import Workouts from '../pages/Workouts.vue'
import Nutrition from '../pages/Nutrition.vue'

const routes = [
  {
    path: '/',
    name: 'Dashboard',
    component: Dashboard
  },
  {
    path: '/workouts',
    name: 'Workouts', 
    component: Workouts
  },
  {
    path: '/nutrition',
    name: 'Nutrition',
    component: Nutrition
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router