<template>
  <div class="workout-detail">
    <div class="container">
      <!-- Кнопка назад -->
      <button @click="$router.back()" class="back-button">
        ← Назад к тренировкам
      </button>

      <!-- Загрузка -->
      <div v-if="!workout && !error" class="loading">
        <div class="spinner"></div>
        <p>Загрузка тренировки...</p>
      </div>

      <!-- Ошибка -->
      <div v-else-if="error" class="error-state">
        <h2>😔 Тренировка не найдена</h2>
        <p>{{ error }}</p>
        <router-link to="/workouts" class="btn btn-primary">
          Вернуться к тренировкам
        </router-link>
      </div>

      <!-- Детали тренировки -->
      <div v-else-if="workout" class="workout-content">
        <!-- Заголовок -->
        <header class="workout-header">
          <h1>{{ workout.title }}</h1>
          <div class="workout-meta">
            <span class="duration">⏱️ {{ workout.duration }} минут</span>
            <span class="calories">🔥 {{ workout.calories }} ккал</span>
            <span class="difficulty" :class="`difficulty-${workout.difficulty}`">
              {{ getDifficultyLabel(workout.difficulty) }}
            </span>
          </div>
        </header>

        <!-- Упражнения -->
        <section class="exercises-section">
          <h2>💪 Упражнения</h2>
          <div class="exercises-list">
            <div 
              v-for="(exercise, index) in workout.exercises" 
              :key="index"
              class="exercise-item"
              :class="{ completed: exercise.completed }"
            >
              <div class="exercise-info">
                <h3>{{ exercise.name }}</h3>
                <p class="exercise-sets">
                  {{ exercise.sets }} × {{ exercise.reps }}
                </p>
              </div>
              <button 
                @click="toggleExercise(index)"
                class="complete-button"
                :class="{ completed: exercise.completed }"
              >
                {{ exercise.completed ? '✓ Выполнено' : 'Отметить' }}
              </button>
            </div>
          </div>
        </section>

        <!-- Прогресс -->
        <section class="progress-section">
          <h2>📊 Прогресс</h2>
          <div class="progress-stats">
            <div class="progress-item">
              <span class="progress-label">Выполнено упражнений:</span>
              <span class="progress-value">{{ completedExercises }}/{{ totalExercises }}</span>
            </div>
            <div class="progress-bar">
              <div 
                class="progress-fill" 
                :style="{ width: progressPercentage + '%' }"
              ></div>
            </div>
          </div>
        </section>

        <!-- Кнопки действий -->
        <section class="actions-section">
          <button 
            @click="startWorkout" 
            class="btn btn-start"
            :disabled="isWorkoutCompleted"
          >
            🏃‍♂️ Начать тренировку
          </button>
          <button 
            @click="completeWorkout" 
            class="btn btn-complete"
            :disabled="!isWorkoutCompleted"
          >
            ✅ Завершить тренировку
          </button>
        </section>

        <!-- Таймер (опционально) -->
        <section v-if="isActive" class="timer-section">
          <h3>⏰ Таймер тренировки</h3>
          <div class="timer">
            {{ formatTime(elapsedTime) }}
          </div>
          <div class="timer-controls">
            <button @click="pauseTimer" class="btn btn-secondary">
              ⏸️ Пауза
            </button>
            <button @click="resetTimer" class="btn btn-secondary">
              🔄 Сбросить
            </button>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useFitness } from '../composables/useFitness'

const route = useRoute()
const router = useRouter()
const { workouts, completeWorkout: completeWorkoutInStore } = useFitness()

const workout = ref(null)
const error = ref('')
const isActive = ref(false)
const elapsedTime = ref(0)
let timerInterval = null

// Получаем ID тренировки из URL
const workoutId = parseInt(route.params.id)

// Вычисляемые свойства
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

// Методы
const getDifficultyLabel = (difficulty) => {
  const labels = {
    beginner: 'Начинающий',
    intermediate: 'Средний',
    advanced: 'Продвинутый'
  }
  return labels[difficulty] || difficulty
}

const toggleExercise = (index) => {
  if (workout.value) {
    workout.value.exercises[index].completed = !workout.value.exercises[index].completed
  }
}

const startWorkout = () => {
  isActive.value = true
  startTimer()
}

const completeWorkout = () => {
  if (workout.value) {
    completeWorkoutInStore(workout.value.id)
    router.push('/')
  }
}

// Таймер
const startTimer = () => {
  timerInterval = setInterval(() => {
    elapsedTime.value += 1
  }, 1000)
}

const pauseTimer = () => {
  if (timerInterval) {
    clearInterval(timerInterval)
    timerInterval = null
  }
}

const resetTimer = () => {
  pauseTimer()
  elapsedTime.value = 0
}

const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

// Загрузка данных
onMounted(() => {
  const foundWorkout = workouts.value.find(w => w.id === workoutId)
  if (foundWorkout) {
    workout.value = JSON.parse(JSON.stringify(foundWorkout)) // Deep copy
  } else {
    error.value = 'Тренировка с таким ID не найдена'
  }
})

// Очистка
onUnmounted(() => {
  if (timerInterval) {
    clearInterval(timerInterval)
  }
})
</script>

<style scoped>
.workout-detail {
  padding: 2rem 0;
}

.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 1rem;
}

.back-button {
  background: none;
  border: none;
  color: #667eea;
  font-size: 1rem;
  cursor: pointer;
  padding: 0.5rem 0;
  margin-bottom: 2rem;
}

.back-button:hover {
  text-decoration: underline;
}

.loading, .error-state {
  text-align: center;
  padding: 3rem;
  color: #718096;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #e2e8f0;
  border-top: 4px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-state h2 {
  color: #e53e3e;
  margin-bottom: 1rem;
}

.workout-header {
  text-align: center;
  margin-bottom: 3rem;
  padding-bottom: 2rem;
  border-bottom: 2px solid #e2e8f0;
}

.workout-header h1 {
  color: #2d3748;
  margin-bottom: 1rem;
  font-size: 2rem;
}

.workout-meta {
  display: flex;
  justify-content: center;
  gap: 2rem;
  flex-wrap: wrap;
}

.workout-meta span {
  padding: 0.5rem 1rem;
  background: #f7fafc;
  border-radius: 20px;
  font-weight: 500;
}

.difficulty-beginner {
  background: #c6f6d5 !important;
  color: #276749;
}

.difficulty-intermediate {
  background: #fed7d7 !important;
  color: #c53030;
}

.difficulty-advanced {
  background: #fed7d7 !important;
  color: #c53030;
}

.exercises-section {
  margin-bottom: 3rem;
}

.exercises-section h2 {
  color: #2d3748;
  margin-bottom: 1.5rem;
}

.exercises-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.exercise-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  border-left: 4px solid #667eea;
  transition: all 0.3s ease;
}

.exercise-item.completed {
  border-left-color: #48bb78;
  background: #f0fff4;
}

.exercise-info h3 {
  margin: 0 0 0.5rem 0;
  color: #2d3748;
}

.exercise-sets {
  margin: 0;
  color: #718096;
  font-size: 0.9rem;
}

.complete-button {
  padding: 0.5rem 1rem;
  border: 2px solid #48bb78;
  background: white;
  color: #48bb78;
  border-radius: 20px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
}

.complete-button.completed {
  background: #48bb78;
  color: white;
}

.complete-button:hover:not(.completed) {
  background: #48bb78;
  color: white;
}

.progress-section {
  margin-bottom: 3rem;
}

.progress-section h2 {
  color: #2d3748;
  margin-bottom: 1rem;
}

.progress-stats {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.progress-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.progress-label {
  color: #718096;
}

.progress-value {
  font-weight: 600;
  color: #2d3748;
}

.progress-bar {
  height: 8px;
  background: #e2e8f0;
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  transition: width 0.3s ease;
}

.actions-section {
  display: flex;
  gap: 1rem;
  margin-bottom: 3rem;
  flex-wrap: wrap;
}

.btn {
  padding: 1rem 2rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  flex: 1;
  min-width: 200px;
  font-size: 1rem;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-start {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-complete {
  background: #48bb78;
  color: white;
}

.btn-secondary {
  background: #e2e8f0;
  color: #4a5568;
}

.timer-section {
  text-align: center;
  padding: 2rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.timer-section h3 {
  margin-bottom: 1rem;
  color: #2d3748;
}

.timer {
  font-size: 3rem;
  font-weight: bold;
  color: #667eea;
  margin-bottom: 1.5rem;
  font-family: 'Courier New', monospace;
}

.timer-controls {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

@media (max-width: 768px) {
  .workout-meta {
    flex-direction: column;
    align-items: center;
    gap: 1rem;
  }
  
  .exercise-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .complete-button {
    align-self: stretch;
    text-align: center;
  }
  
  .actions-section {
    flex-direction: column;
  }
  
  .btn {
    min-width: auto;
  }
  
  .timer-controls {
    flex-direction: column;
  }
  
  .timer {
    font-size: 2rem;
  }
}
</style>