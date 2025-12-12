import { ref, reactive, computed, onMounted } from 'vue'

export function useFitness() {
  // Состояние пользователя
  const user = reactive({
    name: 'Айдос',
    weight: 80,
    height: 178,
    age: 20,
    fitnessLevel: 'beginner',
    goals: ['weight_loss', 'muscle_gain']
  })

  // Тренировки - теперь это обычный ref, а не computed
  const workouts = ref([])
  const userProgress = ref([])

  // Питание
  const dailyNutrition = reactive({
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    water: 0
  })

  // Загрузка состояния
  const isLoading = ref(false)

  // Mock данные тренировок
  const mockWorkouts = [
    {
      id: 1,
      title: 'Утренняя зарядка для начинающих',
      duration: 15,
      difficulty: 'beginner',
      type: 'cardio',
      exercises: [
        { name: 'Бег на месте', sets: 1, reps: '30 сек', completed: false },
        { name: 'Прыжки джек', sets: 1, reps: '30 сек', completed: false },
        { name: 'Приседания', sets: 3, reps: 15, completed: false }
      ],
      calories: 120
    },
    {
      id: 2,
      title: 'Силовая тренировка дома',
      duration: 30,
      difficulty: 'intermediate',
      type: 'strength',
      exercises: [
        { name: 'Отжимания', sets: 3, reps: 12, completed: false },
        { name: 'Приседания с весом', sets: 3, reps: 15, completed: false },
        { name: 'Планка', sets: 1, reps: '60 сек', completed: false }
      ],
      calories: 180
    },
    {
      id: 3,
      title: 'Интервальная тренировка',
      duration: 20,
      difficulty: 'advanced',
      type: 'hiit',
      exercises: [
        { name: 'Берпи', sets: 4, reps: '30 сек', completed: false },
        { name: 'Альпинист', sets: 4, reps: '30 сек', completed: false },
        { name: 'Прыжки через скакалку', sets: 4, reps: '45 сек', completed: false }
      ],
      calories: 250
    }
  ]

  // AI рекомендации
  const aiRecommendations = computed(() => {
    const level = user.fitnessLevel
    const userGoals = user.goals
    
    let recommendations = []
    
    if (level === 'beginner') {
      recommendations.push('Начните с коротких тренировок по 15-20 минут')
      recommendations.push('Фокус на технике выполнения упражнений')
    }
    
    if (userGoals.includes('weight_loss')) {
      recommendations.push('Рекомендуем кардио тренировки 3-4 раза в неделю')
      recommendations.push('Пейте 2+ литра воды в день')
    }
    
    if (userGoals.includes('muscle_gain')) {
      recommendations.push('Добавьте силовые упражнения 2-3 раза в неделю')
      recommendations.push('Увеличьте потребление белка до 1.5-2г на кг веса')
    }
    
    return recommendations
  })

  // Прогресс за неделю
  const weeklyProgress = computed(() => {
    const lastWeek = userProgress.value.slice(-7)
    return lastWeek.reduce((total, day) => total + (day.caloriesBurned || 0), 0)
  })

  // Загрузка тренировок
  const loadWorkouts = () => {
    isLoading.value = true
    setTimeout(() => {
      workouts.value = mockWorkouts
      isLoading.value = false
    }, 1000)
  }

  // Обновить данные питания
  const updateNutrition = (newData) => {
    Object.assign(dailyNutrition, newData)
    saveToLocalStorage()
  }

  // Сохранение в LocalStorage
  const saveToLocalStorage = () => {
    const data = {
      user,
      userProgress: userProgress.value,
      dailyNutrition
    }
    localStorage.setItem('fitnessData', JSON.stringify(data))
  }

  // Загрузка из LocalStorage
  const loadFromLocalStorage = () => {
    const saved = localStorage.getItem('fitnessData')
    if (saved) {
      const data = JSON.parse(saved)
      Object.assign(user, data.user)
      userProgress.value = data.userProgress || []
      Object.assign(dailyNutrition, data.dailyNutrition)
    }
  }

  onMounted(() => {
    loadFromLocalStorage()
    loadWorkouts()
  })

  return {
    user,
    workouts, // Теперь это обычный ref
    userProgress,
    dailyNutrition,
    isLoading,
    aiRecommendations,
    weeklyProgress,
    updateNutrition
  }
}