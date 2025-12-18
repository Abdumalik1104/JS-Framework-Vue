import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useUserStore = defineStore('user', () => {
  // State
  const user = ref({
    id: null,
    name: '',
    email: '',
    weight: 0,
    height: 0,
    goals: [],
    fitnessLevel: 'beginner'
  })
  
  const isAuthenticated = ref(false)
  
  // Getters
  const bmi = computed(() => {
    if (!user.value.height) return 0
    return (user.value.weight / ((user.value.height / 100) ** 2)).toFixed(1)
  })
  
  const goalStatus = computed(() => {
    return user.value.goals.map(goal => ({
      ...goal,
      progress: calculateProgress(goal)
    }))
  })
  
  // Actions
  const updateProfile = async (profileData) => {
    try {
      // Валидация
      if (!profileData.name.trim()) throw new Error('Имя обязательно')
      if (profileData.weight <= 0) throw new Error('Вес должен быть положительным')
      
      Object.assign(user.value, profileData)
      
      // Сохранение в localStorage или API
      localStorage.setItem('userProfile', JSON.stringify(user.value))
      
      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }
  
  // В методе login добавьте сохранение состояния
const login = async (credentials) => {
  try {
    // Имитация API запроса
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Простая проверка (в реальном приложении будет API)
    if (credentials.email && credentials.password) {
      // Устанавливаем флаг аутентификации
      isAuthenticated.value = true
      
      // Обновляем пользователя
      user.value = {
        ...user.value,
        email: credentials.email,
        name: credentials.email.split('@')[0] // Имя из email
      }
      
      // Сохраняем в localStorage
      localStorage.setItem('isAuthenticated', 'true')
      localStorage.setItem('userEmail', credentials.email)
      
      return { success: true }
    }
    
    return { 
      success: false, 
      error: 'Неверный email или пароль' 
    }
  } catch (err) {
    return { 
      success: false, 
      error: 'Ошибка сервера. Попробуйте позже.' 
    }
  }
}
  
  // Private helper
  const calculateProgress = (goal) => {
    // Логика расчета прогресса
    return Math.min(Math.random() * 100, 100)
  }
  
  return {
    user,
    isAuthenticated,
    bmi,
    goalStatus,
    updateProfile,
    login
  }
})