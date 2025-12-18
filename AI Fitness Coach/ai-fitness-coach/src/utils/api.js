/**
 * Конфигурация API
 */

import axios from 'axios'

// Базовый URL API
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

// Создание экземпляра axios с настройками
const api = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
})

// Интерцептор для добавления токена
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Интерцептор для обработки ошибок
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Сервер ответил с ошибкой
      switch (error.response.status) {
        case 401:
          // Не авторизован
          localStorage.removeItem('auth_token')
          window.location.href = '/login'
          break
        case 403:
          // Доступ запрещен
          console.error('Доступ запрещен')
          break
        case 404:
          // Ресурс не найден
          console.error('Ресурс не найден')
          break
        case 500:
          // Ошибка сервера
          console.error('Ошибка сервера')
          break
        default:
          console.error('Ошибка API:', error.response.status)
      }
    } else if (error.request) {
      // Запрос был сделан, но ответа нет
      console.error('Нет ответа от сервера')
    } else {
      // Ошибка при настройке запроса
      console.error('Ошибка при настройке запроса:', error.message)
    }
    
    return Promise.reject(error)
  }
)

// API endpoints
export const endpoints = {
  // Аутентификация
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    logout: '/auth/logout',
    refresh: '/auth/refresh'
  },
  
  // Пользователи
  users: {
    profile: '/users/profile',
    update: '/users/update',
    goals: '/users/goals'
  },
  
  // Тренировки
  workouts: {
    list: '/workouts',
    detail: (id) => `/workouts/${id}`,
    create: '/workouts',
    update: (id) => `/workouts/${id}`,
    delete: (id) => `/workouts/${id}`,
    complete: (id) => `/workouts/${id}/complete`,
    history: '/workouts/history'
  },
  
  // Питание
  nutrition: {
    meals: '/nutrition/meals',
    meal: (id) => `/nutrition/meals/${id}`,
    today: '/nutrition/meals/today',
    goals: '/nutrition/goals',
    water: '/nutrition/water'
  },
  
  // Цели
  goals: {
    list: '/goals',
    detail: (id) => `/goals/${id}`,
    create: '/goals',
    update: (id) => `/goals/${id}`,
    delete: (id) => `/goals/${id}`,
    progress: (id) => `/goals/${id}/progress`
  },
  
  // Статистика
  stats: {
    overview: '/stats/overview',
    weekly: '/stats/weekly',
    monthly: '/stats/monthly'
  }
}

// Вспомогательные функции API
export const apiHelpers = {
  // GET запрос
  async get(endpoint, params = {}) {
    try {
      const response = await api.get(endpoint, { params })
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  },
  
  // POST запрос
  async post(endpoint, data = {}) {
    try {
      const response = await api.post(endpoint, data)
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  },
  
  // PUT запрос
  async put(endpoint, data = {}) {
    try {
      const response = await api.put(endpoint, data)
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  },
  
  // PATCH запрос
  async patch(endpoint, data = {}) {
    try {
      const response = await api.patch(endpoint, data)
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  },
  
  // DELETE запрос
  async delete(endpoint) {
    try {
      const response = await api.delete(endpoint)
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  },
  
  // Загрузка файла
  async upload(endpoint, file, onProgress = null) {
    const formData = new FormData()
    formData.append('file', file)
    
    try {
      const response = await api.post(endpoint, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: onProgress
      })
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  },
  
  // Обработка ошибок
  handleError(error) {
    if (error.response) {
      // Сервер ответил с ошибкой
      const { status, data } = error.response
      return {
        status,
        message: data.message || 'Ошибка сервера',
        errors: data.errors || {}
      }
    } else if (error.request) {
      // Запрос был сделан, но ответа нет
      return {
        status: 0,
        message: 'Нет ответа от сервера. Проверьте подключение к интернету.'
      }
    } else {
      // Ошибка при настройке запроса
      return {
        status: -1,
        message: error.message || 'Ошибка при отправке запроса'
      }
    }
  },
  
  // Проверка статуса ответа
  isSuccess(response) {
    return response && (response.status >= 200 && response.status < 300)
  },
  
  // Создание URL с параметрами
  buildUrl(baseUrl, params = {}) {
    const url = new URL(baseUrl, API_BASE)
    Object.keys(params).forEach(key => {
      if (params[key] !== undefined && params[key] !== null) {
        url.searchParams.append(key, params[key])
      }
    })
    return url.toString()
  }
}

// Mock данные для разработки (если API недоступен)
export const mockData = {
  workouts: [
    {
      id: 1,
      title: 'Утренняя зарядка',
      description: 'Легкая разминка для начала дня',
      duration: 15,
      difficulty: 'beginner',
      type: 'cardio',
      calories: 120,
      exercises: [
        { name: 'Бег на месте', sets: 1, reps: '30 сек', rest: 15 },
        { name: 'Прыжки джек', sets: 1, reps: '30 сек', rest: 15 },
        { name: 'Приседания', sets: 3, reps: 15, rest: 30 },
        { name: 'Отжимания', sets: 3, reps: 10, rest: 30 },
        { name: 'Планка', sets: 1, reps: '60 сек', rest: 60 }
      ],
      completed: false,
      favorite: true,
      createdAt: '2024-01-15T08:30:00Z'
    },
    {
      id: 2,
      title: 'Силовая тренировка',
      description: 'Проработка всех групп мышц',
      duration: 45,
      difficulty: 'intermediate',
      type: 'strength',
      calories: 280,
      exercises: [
        { name: 'Приседания со штангой', sets: 4, reps: 12, rest: 60 },
        { name: 'Жим лежа', sets: 4, reps: 10, rest: 60 },
        { name: 'Тяга штанги', sets: 3, reps: 12, rest: 60 },
        { name: 'Жим гантелей', sets: 3, reps: 12, rest: 45 },
        { name: 'Подъем на бицепс', sets: 3, reps: 15, rest: 45 },
        { name: 'Разгибания на трицепс', sets: 3, reps: 15, rest: 45 },
        { name: 'Скручивания', sets: 3, reps: 20, rest: 30 },
        { name: 'Подъем ног', sets: 3, reps: 15, rest: 30 }
      ],
      completed: true,
      favorite: false,
      createdAt: '2024-01-14T18:00:00Z'
    }
  ],
  
  meals: [
    {
      id: 1,
      name: 'Овсянка с фруктами',
      type: 'breakfast',
      calories: 350,
      protein: 12,
      carbs: 60,
      fat: 8,
      date: new Date().toISOString(),
      time: '08:30'
    },
    {
      id: 2,
      name: 'Куриная грудка с овощами',
      type: 'lunch',
      calories: 450,
      protein: 40,
      carbs: 30,
      fat: 15,
      date: new Date().toISOString(),
      time: '13:00'
    },
    {
      id: 3,
      name: 'Протеиновый коктейль',
      type: 'snack',
      calories: 200,
      protein: 25,
      carbs: 15,
      fat: 5,
      date: new Date().toISOString(),
      time: '16:30'
    }
  ],
  
  user: {
    id: 1,
    name: 'Алишер',
    email: 'alisher@example.com',
    weight: 75,
    height: 180,
    age: 28,
    fitnessLevel: 'intermediate',
    goals: ['weight_loss', 'muscle_gain'],
    createdAt: '2024-01-01T00:00:00Z'
  }
}

// Функция для задержки (имитация API)
export const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

// Экспорт по умолчанию
export default {
  api,
  endpoints,
  apiHelpers,
  mockData,
  delay
}