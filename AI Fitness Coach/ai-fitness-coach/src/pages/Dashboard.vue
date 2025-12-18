<template>
  <div class="dashboard">
    <!-- Заголовок -->
    <header class="dashboard-header">
      <h1>Добро пожаловать, {{ userStore.user.name }}! 👋</h1>
      <p>{{ getGreeting() }}, готовы к тренировке?</p>
    </header>
    
    <!-- Быстрая статистика -->
    <section class="quick-stats">
      <div class="stats-grid">
        <StatsWidget :initial-data="statsData" />
      </div>
    </section>
    
    <!-- Основные секции -->
    <div class="dashboard-grid">
      <!-- Текущие цели -->
      <section class="dashboard-section">
        <div class="section-header">
          <h2>🎯 Мои цели</h2>
          <router-link to="/goals" class="section-link">Все цели →</router-link>
        </div>
        <GoalTracker />
      </section>
      
      <!-- Сегодняшняя тренировка -->
      <section class="dashboard-section">
        <div class="section-header">
          <h2>💪 Сегодняшняя тренировка</h2>
          <router-link to="/workouts" class="section-link">Все тренировки →</router-link>
        </div>
        
        <div v-if="workoutStore.isLoading" class="loading">
          <div class="spinner"></div>
          <p>Загрузка тренировок...</p>
        </div>
        
        <div v-else-if="workoutStore.error" class="error">
          <p>{{ workoutStore.error }}</p>
          <button @click="workoutStore.fetchWorkouts()" class="retry-button">
            Повторить
          </button>
        </div>
        
        <div v-else class="workouts-preview">
          <WorkoutCard
            v-for="workout in todaysWorkouts"
            :key="workout.id"
            :workout="workout"
            @start-workout="startWorkout"
          />
          
          <div v-if="todaysWorkouts.length === 0" class="empty-workouts">
            <p>Нет запланированных тренировок</p>
            <router-link to="/workouts/create" class="add-button">
              + Добавить тренировку
            </router-link>
          </div>
        </div>
      </section>
      
      <!-- Питание сегодня -->
      <section class="dashboard-section">
        <div class="section-header">
          <h2>🥗 Питание сегодня</h2>
          <router-link to="/nutrition" class="section-link">Подробнее →</router-link>
        </div>
        
        <div class="nutrition-summary">
          <div class="nutrition-stats">
            <div class="nutrition-stat">
              <span class="stat-value">{{ nutritionStore.todaysNutrition.calories }}</span>
              <span class="stat-label">ккал</span>
            </div>
            <div class="nutrition-stat">
              <span class="stat-value">{{ nutritionStore.todaysNutrition.protein }}g</span>
              <span class="stat-label">белок</span>
            </div>
            <div class="nutrition-stat">
              <span class="stat-value">{{ nutritionStore.waterIntake.toFixed(1) }}L</span>
              <span class="stat-label">вода</span>
            </div>
          </div>
          
          <div class="water-tracker">
            <h3>💧 Вода</h3>
            <div class="water-progress">
              <div 
                class="water-fill" 
                :style="{ width: nutritionStore.nutritionProgress.water + '%' }"
              ></div>
            </div>
            <div class="water-controls">
              <button 
                @click="addWater(0.25)" 
                class="water-button"
                :disabled="nutritionStore.waterIntake >= 5"
              >
                +0.25L
              </button>
              <button 
                @click="addWater(0.5)" 
                class="water-button"
                :disabled="nutritionStore.waterIntake >= 5"
              >
                +0.5L
              </button>
            </div>
          </div>
        </div>
      </section>
      
      <!-- Профиль пользователя -->
      <section class="dashboard-section">
        <div class="section-header">
          <h2>👤 Мой профиль</h2>
          <router-link to="/profile" class="section-link">Настройки →</router-link>
        </div>
        <UserProfile 
          :user="userStore.user"
          :user-goals="userStore.goalStatus"
          @edit-profile="editProfile"
        />
      </section>
    </div>
    
    <!-- Таймер тренировки -->
    <section v-if="currentTimer" class="timer-section">
      <h3>⏱️ Таймер тренировки</h3>
      <WorkoutTimer 
        ref="timer"
        :initial-time="currentTimer.duration * 60"
        @timer-complete="handleTimerComplete"
      />
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useUserStore } from '@/stores/useUserStore'
import { useWorkoutStore } from '@/stores/useWorkoutStore'
import { useNutritionStore } from '@/stores/useNutritionStore'
import UserProfile from '@/components/UserProfile.vue'
import WorkoutCard from '@/components/WorkoutCard.vue'
import GoalTracker from '@/components/GoalTracker.vue'
import WorkoutTimer from '@/components/WorkoutTimer.vue'
import StatsWidget from '@/components/StatsWidget.vue'

// Stores
const userStore = useUserStore()
const workoutStore = useWorkoutStore()
const nutritionStore = useNutritionStore()

// State
const currentTimer = ref(null)

// Computed
const todaysWorkouts = computed(() => {
  return workoutStore.workouts.slice(0, 2) // Показываем первые 2
})

const statsData = computed(() => ({
  week: [
    { id: 1, icon: '🔥', label: 'Сожжено ккал', value: workoutStore.totalCalories, change: 12, color: '#e53e3e' },
    { id: 2, icon: '💪', label: 'Тренировок', value: workoutStore.completedWorkouts, change: 5, color: '#ed8936' },
    { id: 3, icon: '⏱️', label: 'Активных минут', value: workoutStore.totalDuration, change: -3, color: '#4299e1' },
    { id: 4, icon: '🎯', label: 'Целей выполнено', value: 3, change: 25, color: '#48bb78' },
    { id: 5, icon: '💧', label: 'Литр воды', value: nutritionStore.waterIntake.toFixed(0), change: 8, color: '#38b2ac' },
    { id: 6, icon: '😴', label: 'Средний сон', value: '7.2ч', change: 2, color: '#9f7aea' }
  ]
}))

// Methods
const getGreeting = () => {
  const hour = new Date().getHours()
  if (hour < 12) return 'Доброе утро'
  if (hour < 18) return 'Добрый день'
  return 'Добрый вечер'
}

const startWorkout = (workoutId) => {
  const workout = workoutStore.workouts.find(w => w.id === workoutId)
  if (workout) {
    currentTimer.value = {
      ...workout,
      startTime: new Date().toISOString()
    }
    
    // Показываем уведомление
    alert(`Тренировка "${workout.title}" начата!`)
  }
}

const handleTimerComplete = () => {
  if (currentTimer.value) {
    workoutStore.completeWorkout(currentTimer.value.id)
    currentTimer.value = null
  }
}

const addWater = async (amount) => {
  await nutritionStore.addWater(amount)
}

const editProfile = () => {
  router.push('/profile/settings')
}

// Lifecycle
onMounted(async () => {
  // Загружаем данные
  await Promise.all([
    workoutStore.fetchWorkouts(),
    nutritionStore.fetchMeals()
  ])
})

// Watch для отслеживания ошибок
watch(() => workoutStore.error, (newError) => {
  if (newError) {
    console.error('Ошибка тренировок:', newError)
  }
})

watch(() => nutritionStore.error, (newError) => {
  if (newError) {
    console.error('Ошибка питания:', newError)
  }
})
</script>

<style scoped>
.dashboard {
  padding: 24px;
  max-width: 1400px;
  margin: 0 auto;
}

.dashboard-header {
  text-align: center;
  margin-bottom: 32px;
}

.dashboard-header h1 {
  font-size: 2.5rem;
  color: #2d3748;
  margin-bottom: 8px;
}

.dashboard-header p {
  font-size: 1.2rem;
  color: #718096;
}

.quick-stats {
  margin-bottom: 32px;
}

.stats-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 24px;
  margin-bottom: 32px;
}

.dashboard-section {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.section-header h2 {
  margin: 0;
  color: #2d3748;
  font-size: 1.5rem;
}

.section-link {
  color: #667eea;
  text-decoration: none;
  font-weight: 500;
  font-size: 0.9rem;
}

.section-link:hover {
  text-decoration: underline;
}

.loading, .error {
  text-align: center;
  padding: 40px 20px;
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

.error p {
  color: #e53e3e;
  margin-bottom: 16px;
}

.retry-button {
  padding: 8px 16px;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

.workouts-preview {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.empty-workouts {
  text-align: center;
  padding: 40px 20px;
  color: #718096;
  background: #f7fafc;
  border-radius: 12px;
}

.add-button {
  display: inline-block;
  margin-top: 12px;
  padding: 8px 16px;
  background: #48bb78;
  color: white;
  text-decoration: none;
  border-radius: 6px;
  font-weight: 500;
}

.nutrition-summary {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.nutrition-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  text-align: center;
}

.nutrition-stat {
  background: #f7fafc;
  padding: 16px;
  border-radius: 12px;
}

.stat-value {
  display: block;
  font-size: 1.5rem;
  font-weight: bold;
  color: #2d3748;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 0.9rem;
  color: #718096;
}

.water-tracker h3 {
  margin: 0 0 12px 0;
  color: #2d3748;
}

.water-progress {
  height: 8px;
  background: #e2e8f0;
  border-radius: 4px;
  margin-bottom: 16px;
  overflow: hidden;
}

.water-fill {
  height: 100%;
  background: #4299e1;
  transition: width 0.5s ease;
}

.water-controls {
  display: flex;
  gap: 8px;
}

.water-button {
  flex: 1;
  padding: 8px 12px;
  background: #4299e1;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
}

.water-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.timer-section {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 16px;
  padding: 24px;
}

.timer-section h3 {
  margin: 0 0 16px 0;
  font-size: 1.5rem;
}

@media (max-width: 768px) {
  .dashboard {
    padding: 16px;
  }
  
  .dashboard-header h1 {
    font-size: 2rem;
  }
  
  .dashboard-grid {
    grid-template-columns: 1fr;
  }
  
  .nutrition-stats {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>