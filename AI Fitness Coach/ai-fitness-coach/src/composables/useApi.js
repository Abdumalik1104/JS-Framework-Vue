import { ref } from 'vue'
import axios from 'axios'

// Конфиг API (можно использовать реальный или моковый)
const API_BASE = import.meta.env.VITE_API_URL || 'https://api.fitnessai.com/v1'

export function useApi() {
  const loading = ref(false)
  const error = ref(null)
  const data = ref(null)
  
  const fetchWorkouts = async (params = {}) => {
    loading.value = true
    error.value = null
    
    try {
      // Реальный API запрос
      const response = await axios.get(`${API_BASE}/workouts`, { params })
      data.value = response.data
      
      // Или моковые данные для разработки
      if (!import.meta.env.VITE_API_URL) {
        data.value = await mockApiWorkouts()
      }
      
      return { success: true, data: data.value }
    } catch (err) {
      error.value = err.message || 'Ошибка загрузки данных'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }
  
  const createWorkout = async (workoutData) => {
    loading.value = true
    
    try {
      const response = await axios.post(`${API_BASE}/workouts`, workoutData)
      return { success: true, data: response.data }
    } catch (err) {
      error.value = err.response?.data?.message || 'Ошибка создания тренировки'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }
  
  // Моковая функция для разработки
  const mockApiWorkouts = async () => {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({
          workouts: [
            {
              id: 1,
              title: 'Full Body Strength',
              duration: 45,
              difficulty: 'intermediate',
              exercises: 8,
              calories: 320,
              completed: false
            },
            // ... больше данных
          ],
          total: 12,
          page: 1
        })
      }, 800)
    })
  }
  
  return {
    loading,
    error,
    data,
    fetchWorkouts,
    createWorkout
  }
}