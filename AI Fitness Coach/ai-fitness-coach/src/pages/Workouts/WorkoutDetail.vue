<template>
  <div class="workout-detail-page">
    <div v-if="loading" class="loading">
      <div class="spinner"></div>
      <p>Загрузка тренировки...</p>
    </div>
    
    <div v-else-if="error" class="error">
      <h2>😔 Ошибка загрузки</h2>
      <p>{{ error }}</p>
      <router-link to="/workouts" class="back-link">
        ← Вернуться к тренировкам
      </router-link>
    </div>
    
    <div v-else-if="workout" class="workout-content">
      <div class="workout-header">
        <router-link to="/workouts" class="back-button">
          ← Назад
        </router-link>
        
        <h1 class="workout-title">{{ workout.title }}</h1>
        
        <div class="workout-meta">
          <span class="meta-item">
            ⏱️ {{ workout.duration }} минут
          </span>
          <span class="meta-item">
            💪 {{ getDifficultyLabel(workout.difficulty) }}
          </span>
          <span class="meta-item">
            🔥 {{ workout.calories }} ккал
          </span>
          <span class="meta-item">
            🏷️ {{ workout.type }}
          </span>
        </div>
      </div>
      
      <div class="workout-body">
        <div class="workout-description">
          <h3>Описание</h3>
          <p>{{ workout.description }}</p>
        </div>
        
        <div class="workout-exercises">
          <h3>Упражнения ({{ workout.exercises.length }})</h3>
          <div class="exercises-list">
            <div 
              v-for="(exercise, index) in workout.exercises" 
              :key="index"
              class="exercise-item"
              :class="{ 'completed': exercise.completed }"
            >
              <div class="exercise-number">{{ index + 1 }}</div>
              
              <div class="exercise-info">
                <h4>{{ exercise.name }}</h4>
                <div class="exercise-details">
                  <span class="detail">Подходы: {{ exercise.sets }}</span>
                  <span class="detail">Повторения: {{ exercise.reps }}</span>
                  <span v-if="exercise.rest" class="detail">
                    Отдых: {{ exercise.rest }} сек
                  </span>
                </div>
                
                <div v-if="exercise.instructions" class="exercise-instructions">
                  {{ exercise.instructions }}
                </div>
              </div>
              
              <div class="exercise-actions">
                <button 
                  @click="toggleExercise(index)"
                  class="complete-button"
                  :class="{ 'completed': exercise.completed }"
                >
                  {{ exercise.completed ? '✓ Выполнено' : 'Отметить' }}
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div class="workout-timer-section">
          <WorkoutTimer 
            :initial-time="workout.duration * 60"
            @timer-complete="handleTimerComplete"
            ref="timer"
          />
        </div>
        
        <div class="workout-actions">
          <button 
            @click="startWorkout" 
            class="action-button start"
            :disabled="isWorkoutStarted"
          >
            🏃‍♂️ Начать тренировку
          </button>
          
          <button 
            @click="completeWorkout" 
            class="action-button complete"
            :disabled="!isWorkoutCompleted || workout.completed"
          >
            ✅ Завершить тренировку
          </button>
          
          <button 
            @click="shareWorkout" 
            class="action-button share"
          >
            📤 Поделиться
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import WorkoutTimer from '@/components/WorkoutTimer.vue'

const route = useRoute()
const router = useRouter()
const workoutId = route.params.id

const loading = ref(true)
const error = ref('')
const workout = ref(null)
const timer = ref(null)

// Mock данные для тренировок (в реальном приложении будет API)
const mockWorkouts = {
  '1': {
    id: 1,
    title: 'Полная силовая тренировка',
    description: 'Интенсивная тренировка для проработки всех основных групп мышц. Идеально подходит для набора мышечной массы и увеличения силы.',
    duration: 60,
    difficulty: 'intermediate',
    type: 'Силовая',
    calories: 320,
    equipment: ['Гантели', 'Скакалка', 'Коврик'],
    exercises: [
      {
        name: 'Приседания со штангой',
        sets: 4,
        reps: 12,
        rest: 60,
        instructions: 'Держите спину прямо, колени не выходят за носки',
        completed: false
      },
      {
        name: 'Жим лежа',
        sets: 4,
        reps: 10,
        rest: 60,
        instructions: 'Контролируйте движение вниз, не касайтесь груди штангой',
        completed: false
      },
      {
        name: 'Тяга штанги в наклоне',
        sets: 3,
        reps: 12,
        rest: 45,
        instructions: 'Держите спину ровно, тяните к поясу',
        completed: false
      },
      {
        name: 'Жим гантелей сидя',
        sets: 3,
        reps: 12,
        rest: 45,
        instructions: 'Не разгибайте полностью локти в верхней точке',
        completed: false
      },
      {
        name: 'Подъем на бицепс',
        sets: 3,
        reps: 15,
        rest: 45,
        instructions: 'Не раскачивайтесь, работайте только бицепсом',
        completed: false
      }
    ],
    completed: false,
    createdAt: '2024-01-15'
  },
  '2': {
    id: 2,
    title: 'Кардио интервалы',
    description: 'Высокоинтенсивная интервальная тренировка для сжигания жира и улучшения выносливости.',
    duration: 30,
    difficulty: 'advanced',
    type: 'HIIT',
    calories: 280,
    equipment: ['Скакалка', 'Коврик'],
    exercises: [
      {
        name: 'Бег на месте',
        sets: 1,
        reps: '30 сек',
        rest: 15,
        instructions: 'Высоко поднимайте колени',
        completed: false
      },
      {
        name: 'Берпи',
        sets: 1,
        reps: '45 сек',
        rest: 20,
        instructions: 'Полный цикл: присед → упор лежа → отжимание → прыжок',
        completed: false
      },
      {
        name: 'Альпинист',
        sets: 1,
        reps: '40 сек',
        rest: 20,
        instructions: 'Быстро подтягивайте колени к груди',
        completed: false
      },
      {
        name: 'Прыжки через скакалку',
        sets: 1,
        reps: '60 сек',
        rest: 30,
        instructions: 'Сохраняйте постоянный ритм',
        completed: false
      }
    ],
    completed: true,
    createdAt: '2024-01-10'
  }
}

// Computed свойства
const completedExercises = computed(() => {
  if (!workout.value) return 0
  return workout.value.exercises.filter(ex => ex.completed).length
})

const totalExercises = computed(() => {
  return workout.value ? workout.value.exercises.length : 0
})

const progressPercentage = computed(() => {
  return totalExercises.value > 0 
    ? Math.round((completedExercises.value / totalExercises.value) * 100)
    : 0
})

const isWorkoutCompleted = computed(() => {
  return completedExercises.value === totalExercises.value && totalExercises.value > 0
})

const isWorkoutStarted = computed(() => {
  return completedExercises.value > 0
})

// Методы
const getDifficultyLabel = (difficulty) => {
  const labels = {
    'beginner': 'Начинающий',
    'intermediate': 'Средний',
    'advanced': 'Продвинутый'
  }
  return labels[difficulty] || difficulty
}

const toggleExercise = (index) => {
  if (workout.value) {
    workout.value.exercises[index].completed = !workout.value.exercises[index].completed
    
    // Сохраняем прогресс в localStorage
    saveProgress()
  }
}

const startWorkout = () => {
  if (timer.value) {
    timer.value.startTimer()
  }
}

const completeWorkout = () => {
  if (workout.value) {
    workout.value.completed = true
    workout.value.completedAt = new Date().toISOString()
    
    // Сохраняем в истории
    const history = JSON.parse(localStorage.getItem('workoutHistory') || '[]')
    history.push({
      id: workout.value.id,
      title: workout.value.title,
      completedAt: workout.value.completedAt,
      duration: workout.value.duration,
      calories: workout.value.calories
    })
    localStorage.setItem('workoutHistory', JSON.stringify(history))
    
    alert('🎉 Тренировка завершена! Отличная работа!')
    router.push('/workouts')
  }
}

const handleTimerComplete = () => {
  alert('⏰ Время вышло! Отличная тренировка!')
}

const shareWorkout = () => {
  if (navigator.share) {
    navigator.share({
      title: workout.value.title,
      text: `Я только что завершил тренировку: ${workout.value.title}`,
      url: window.location.href
    })
  } else {
    navigator.clipboard.writeText(window.location.href)
    alert('Ссылка скопирована в буфер обмена!')
  }
}

const saveProgress = () => {
  if (workout.value) {
    const progress = {
      workoutId: workout.value.id,
      exercises: workout.value.exercises.map(ex => ex.completed),
      lastUpdated: new Date().toISOString()
    }
    localStorage.setItem(`workoutProgress_${workout.value.id}`, JSON.stringify(progress))
  }
}

const loadProgress = () => {
  if (workout.value) {
    const saved = localStorage.getItem(`workoutProgress_${workout.value.id}`)
    if (saved) {
      const progress = JSON.parse(saved)
      workout.value.exercises.forEach((exercise, index) => {
        if (progress.exercises[index] !== undefined) {
          exercise.completed = progress.exercises[index]
        }
      })
    }
  }
}

// Lifecycle
onMounted(() => {
  loading.value = true
  
  // Имитация загрузки данных
  setTimeout(() => {
    workout.value = mockWorkouts[workoutId]
    
    if (workout.value) {
      loadProgress()
      loading.value = false
    } else {
      error.value = 'Тренировка не найдена'
      loading.value = false
    }
  }, 800)
})
</script>

<style scoped>
.workout-detail-page {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
}

.loading, .error {
  text-align: center;
  padding: 60px 20px;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #e2e8f0;
  border-top: 4px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 16px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error h2 {
  color: #e53e3e;
  margin-bottom: 16px;
}

.back-link {
  display: inline-block;
  margin-top: 20px;
  color: #667eea;
  text-decoration: none;
  font-weight: 500;
}

.back-link:hover {
  text-decoration: underline;
}

.workout-header {
  margin-bottom: 40px;
}

.back-button {
  display: inline-block;
  margin-bottom: 20px;
  color: #667eea;
  text-decoration: none;
  font-weight: 500;
  padding: 8px 16px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.back-button:hover {
  background: #f7fafc;
  text-decoration: none;
}

.workout-title {
  font-size: 2.5rem;
  color: #2d3748;
  margin: 0 0 16px 0;
  line-height: 1.2;
}

.workout-meta {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

.meta-item {
  background: #f7fafc;
  padding: 8px 16px;
  border-radius: 20px;
  color: #4a5568;
  font-weight: 500;
}

.workout-body {
  display: flex;
  flex-direction: column;
  gap: 40px;
}

.workout-description h3,
.workout-exercises h3 {
  font-size: 1.5rem;
  color: #2d3748;
  margin: 0 0 16px 0;
}

.workout-description p {
  color: #4a5568;
  line-height: 1.6;
  font-size: 1.1rem;
}

.exercises-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.exercise-item {
  background: white;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  padding: 20px;
  display: flex;
  gap: 20px;
  align-items: flex-start;
  transition: all 0.3s ease;
}

.exercise-item:hover {
  border-color: #cbd5e0;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
}

.exercise-item.completed {
  border-color: #48bb78;
  background: #f0fff4;
}

.exercise-number {
  width: 40px;
  height: 40px;
  background: #667eea;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 1.2rem;
  flex-shrink: 0;
}

.exercise-item.completed .exercise-number {
  background: #48bb78;
}

.exercise-info {
  flex: 1;
}

.exercise-info h4 {
  margin: 0 0 8px 0;
  color: #2d3748;
  font-size: 1.25rem;
}

.exercise-details {
  display: flex;
  gap: 16px;
  margin-bottom: 12px;
  flex-wrap: wrap;
}

.detail {
  background: #f7fafc;
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 0.875rem;
  color: #4a5568;
}

.exercise-instructions {
  color: #718096;
  font-size: 0.95rem;
  line-height: 1.5;
  font-style: italic;
}

.exercise-actions {
  flex-shrink: 0;
}

.complete-button {
  padding: 8px 16px;
  border: 2px solid #48bb78;
  background: white;
  color: #48bb78;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.complete-button.completed {
  background: #48bb78;
  color: white;
}

.complete-button:hover:not(.completed) {
  background: #48bb78;
  color: white;
}

.workout-timer-section {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
}

.workout-actions {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.action-button {
  flex: 1;
  min-width: 200px;
  padding: 16px 24px;
  border: none;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.action-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0,0,0,0.15);
}

.action-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.action-button.start {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.action-button.complete {
  background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);
  color: white;
}

.action-button.share {
  background: #e2e8f0;
  color: #4a5568;
}

@media (max-width: 768px) {
  .workout-title {
    font-size: 2rem;
  }
  
  .exercise-item {
    flex-direction: column;
    gap: 16px;
  }
  
  .exercise-number {
    align-self: flex-start;
  }
  
  .exercise-actions {
    align-self: stretch;
  }
  
  .complete-button {
    width: 100%;
  }
  
  .action-button {
    min-width: auto;
  }
}
</style>