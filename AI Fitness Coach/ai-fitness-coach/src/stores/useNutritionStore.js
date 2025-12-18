import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useNutritionStore = defineStore('nutrition', () => {
  // State
  const meals = ref([])
  const dailyGoals = ref({
    calories: 2000,
    protein: 150,
    carbs: 250,
    fat: 60,
    water: 2.0
  })
  const waterIntake = ref(0)
  const isLoading = ref(false)
  const error = ref(null)
  
  // Getters
  const todayMeals = computed(() => {
    const today = new Date().toDateString()
    return meals.value.filter(meal => 
      new Date(meal.date).toDateString() === today
    )
  })
  
  const todaysNutrition = computed(() => {
    return todayMeals.value.reduce((total, meal) => ({
      calories: total.calories + meal.calories,
      protein: total.protein + meal.protein,
      carbs: total.carbs + meal.carbs,
      fat: total.fat + meal.fat
    }), { calories: 0, protein: 0, carbs: 0, fat: 0 })
  })
  
  const nutritionProgress = computed(() => ({
    calories: Math.min((todaysNutrition.value.calories / dailyGoals.value.calories) * 100, 100),
    protein: Math.min((todaysNutrition.value.protein / dailyGoals.value.protein) * 100, 100),
    carbs: Math.min((todaysNutrition.value.carbs / dailyGoals.value.carbs) * 100, 100),
    fat: Math.min((todaysNutrition.value.fat / dailyGoals.value.fat) * 100, 100),
    water: Math.min((waterIntake.value / dailyGoals.value.water) * 100, 100)
  }))
  
  const remainingNutrition = computed(() => ({
    calories: Math.max(0, dailyGoals.value.calories - todaysNutrition.value.calories),
    protein: Math.max(0, dailyGoals.value.protein - todaysNutrition.value.protein),
    carbs: Math.max(0, dailyGoals.value.carbs - todaysNutrition.value.carbs),
    fat: Math.max(0, dailyGoals.value.fat - todaysNutrition.value.fat),
    water: Math.max(0, dailyGoals.value.water - waterIntake.value)
  }))
  
  const weeklyWaterAverage = computed(() => {
    const lastWeek = meals.value
      .filter(meal => {
        const mealDate = new Date(meal.date)
        const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        return mealDate >= weekAgo
      })
      .reduce((sum, meal) => sum + (meal.water || 0), 0)
    
    return (lastWeek / 7).toFixed(1)
  })
  
  // Actions
  const fetchMeals = async () => {
    isLoading.value = true
    
    try {
      await new Promise(resolve => setTimeout(resolve, 600))
      
      // Mock данные
      meals.value = [
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
        }
      ]
    } catch (err) {
      error.value = 'Не удалось загрузить данные питания'
    } finally {
      isLoading.value = false
    }
  }
  
  const addMeal = async (mealData) => {
    try {
      const newMeal = {
        id: Date.now(),
        ...mealData,
        date: new Date().toISOString(),
        time: new Date().toLocaleTimeString('ru-RU', { 
          hour: '2-digit', 
          minute: '2-digit' 
        })
      }
      
      meals.value.unshift(newMeal)
      return { success: true, data: newMeal }
    } catch (err) {
      error.value = 'Не удалось добавить прием пищи'
      return { success: false, error: err.message }
    }
  }
  
  const updateMeal = async (id, updates) => {
    const index = meals.value.findIndex(m => m.id === id)
    if (index !== -1) {
      meals.value[index] = { ...meals.value[index], ...updates }
      return { success: true }
    }
    return { success: false, error: 'Прием пищи не найден' }
  }
  
  const deleteMeal = async (id) => {
    meals.value = meals.value.filter(m => m.id !== id)
    return { success: true }
  }
  
  const addWater = async (amount) => {
    waterIntake.value = Math.min(waterIntake.value + amount, 5) // Макс 5 литров
    return { success: true, water: waterIntake.value }
  }
  
  const resetWater = async () => {
    waterIntake.value = 0
    return { success: true }
  }
  
  const updateDailyGoals = async (newGoals) => {
    dailyGoals.value = { ...dailyGoals.value, ...newGoals }
    return { success: true }
  }
  
  const clearTodaysMeals = async () => {
    const today = new Date().toDateString()
    meals.value = meals.value.filter(meal => 
      new Date(meal.date).toDateString() !== today
    )
    waterIntake.value = 0
    return { success: true }
  }
  
  const clearError = () => {
    error.value = null
  }
  
  return {
    // State
    meals,
    dailyGoals,
    waterIntake,
    isLoading,
    error,
    
    // Getters
    todayMeals,
    todaysNutrition,
    nutritionProgress,
    remainingNutrition,
    weeklyWaterAverage,
    
    // Actions
    fetchMeals,
    addMeal,
    updateMeal,
    deleteMeal,
    addWater,
    resetWater,
    updateDailyGoals,
    clearTodaysMeals,
    clearError
  }
})