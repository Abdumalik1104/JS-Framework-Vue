import { createRouter, createWebHistory } from 'vue-router'

// Navigation guard
const authGuard = (to, from, next) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated')
  
  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login')
  } else {
    next()
  }
}

const routes = [
  {
  path: '/register',
  name: 'Register',
  component: () => import('@/pages/Auth/Register.vue')
},
  {
    path: '/',
    name: 'Dashboard',
    component: () => import('@/pages/Dashboard.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/workouts',
    component: () => import('@/pages/Workouts/index.vue'),
    children: [
      {
        path: '',
        name: 'Workouts',
        component: () => import('@/pages/Workouts/index.vue')
      },
      {
        path: 'create',
        name: 'CreateWorkout',
        component: () => import('@/pages/Workouts/create.vue')
      },
      {
        path: ':id',
        name: 'WorkoutDetail',
        component: () => import('@/pages/Workouts/WorkoutDetail.vue'),
        props: true
      }
    ]
  },
  {
    path: '/nutrition',
    component: () => import('@/pages/Nutrition/index.vue'),
    children: [
      {
        path: '',
        name: 'Nutrition',
        component: () => import('@/pages/Nutrition/index.vue')
      },
      {
        path: 'meal-plan',
        name: 'MealPlan',
        component: () => import('@/pages/Nutrition/meal-plan.vue')
      }
    ]
  },
  {
    path: '/profile',
    component: () => import('@/pages/Profile/index.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'Profile',
        component: () => import('@/pages/Profile/index.vue')
      },
      {
        path: 'settings',
        name: 'Settings',
        component: () => import('@/pages/Profile/settings.vue')
      }
    ]
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/pages/Auth/Login.vue')
  },
  {
    path: '/community',
    name: 'Community',
    component: () => import('@/pages/Community.vue')
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/pages/NotFound.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

router.beforeEach(authGuard)

export default router