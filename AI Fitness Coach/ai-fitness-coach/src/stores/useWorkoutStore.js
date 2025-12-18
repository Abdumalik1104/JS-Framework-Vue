import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useWorkoutStore = defineStore('workout', () => {
  // State
  const workouts = ref([])
  const currentWorkout = ref(null)
  const history = ref([])
  const isLoading = ref(false)
  const error = ref(null)
  
  // Getters
  const totalWorkouts = computed(() => workouts.value.length)
  const totalDuration = computed(() => 
    workouts.value.reduce((sum, workout) => sum + workout.duration, 0)
  )
  const totalCalories = computed(() => 
    workouts.value.reduce((sum, workout) => sum + workout.calories, 0)
  )
  const completedWorkouts = computed(() => 
    workouts.value.filter(w => w.completed).length
  )
  
  // Дни активности
  const activeDays = computed(() => {
    const days = new Set()
    history.value.forEach(item => {
      const date = new Date(item.completedAt).toDateString()
      days.add(date)
    })
    return days.size
  })
  
  // Actions
  const fetchWorkouts = async () => {
    isLoading.value = true
    error.value = null
    
    try {
      // Имитация API запроса
      await new Promise(resolve => setTimeout(resolve, 800))
      
      // Mock данные
      workouts.value = [
        {
          id: 1,
          title: 'Утренняя зарядка',
          description: 'Легкая разминка для начала дня',
          duration: 15,
          difficulty: 'beginner',
          type: 'cardio',
          calories: 120,
          exercises: 5,
          completed: false,
          favorite: true
        },
        {
          id: 2,
          title: 'Силовая тренировка',
          description: 'Проработка всех групп мышц',
          duration: 45,
          difficulty: 'intermediate',
          type: 'strength',
          calories: 280,
          exercises: 8,
          completed: true,
          favorite: false
        },
        {
          id: 3,
          title: 'Интервальные тренировки',
          description: 'HIIT для сжигания жира',
          duration: 25,
          difficulty: 'advanced',
          type: 'hiit',
          calories: 220,
          exercises: 6,
          completed: false,
          favorite: true
        }
      ]
    } catch (err) {
      error.value = 'Не удалось загрузить тренировки'
      console.error(err)
    } finally {
      isLoading.value = false
    }
  }
  
  const createWorkout = async (workoutData) => {
    try {
      const newWorkout = {
        id: Date.now(),
        ...workoutData,
        completed: false,
        favorite: false,
        createdAt: new Date().toISOString()
      }
      
      workouts.value.push(newWorkout)
      return { success: true, data: newWorkout }
    } catch (err) {
      error.value = 'Не удалось создать тренировку'
      return { success: false, error: err.message }
    }
  }
  
  const updateWorkout = async (id, updates) => {
    const index = workouts.value.findIndex(w => w.id === id)
    if (index !== -1) {
      workouts.value[index] = { ...workouts.value[index], ...updates }
      return { success: true }
    }
    return { success: false, error: 'Тренировка не найдена' }
  }
  
  const deleteWorkout = async (id) => {
    workouts.value = workouts.value.filter(w => w.id !== id)
    return { success: true }
  }
  
  const completeWorkout = async (id) => {
    const workout = workouts.value.find(w => w.id === id)
    if (workout) {
      workout.completed = true
      workout.completedAt = new Date().toISOString()
      
      history.value.push({
        workoutId: id,
        completedAt: workout.completedAt,
        duration: workout.duration,
        calories: workout.calories
      })
      
      return { success: true }
    }
    return { success: false, error: 'Тренировка не найдена' }
  }
  
  const toggleFavorite = async (id) => {
    const workout = workouts.value.find(w => w.id === id)
    if (workout) {
      workout.favorite = !workout.favorite
      return { success: true }
    }
    return { success: false }
  }
  
  const getWorkoutById = (id) => {
    return workouts.value.find(w => w.id === Number(id))
  }
  
  // Сброс ошибки
  const clearError = () => {
    error.value = null
  }
  
  return {
    // State
    workouts,
    currentWorkout,
    history,
    isLoading,
    error,
    
    // Getters
    totalWorkouts,
    totalDuration,
    totalCalories,
    completedWorkouts,
    activeDays,
    
    // Actions
    fetchWorkouts,
    createWorkout,
    updateWorkout,
    deleteWorkout,
    completeWorkout,
    toggleFavorite,
    getWorkoutById,
    clearError
  }
})