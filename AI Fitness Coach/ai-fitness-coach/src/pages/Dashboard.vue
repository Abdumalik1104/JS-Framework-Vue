<template>
  <div class="dashboard">
    <div class="container">
      <!-- Приветствие -->
      <section class="welcome-section">
        <h2>Добро пожаловать, {{ user.name }}! 👋</h2>
        <p>Ваш ИИ-тренер готов помочь вам достичь целей</p>
      </section>

      <!-- Статистика -->
      <section class="stats-section">
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-icon">🔥</div>
            <div class="stat-info">
              <h3>{{ weeklyProgress }}</h3>
              <p>Ккал сожжено за неделю</p>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">💧</div>
            <div class="stat-info">
              <h3>{{ dailyNutrition.water }}L</h3>
              <p>Воды выпито сегодня</p>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">📊</div>
            <div class="stat-info">
              <h3>{{ userProgress.length }}</h3>
              <p>Завершено тренировок</p>
            </div>
          </div>
        </div>
      </section>

      <!-- AI Рекомендации -->
      <section class="recommendations-section">
        <h3>🤖 Рекомендации ИИ-тренера</h3>
        <div class="recommendations-list">
          <div 
            v-for="(rec, index) in aiRecommendations" 
            :key="index"
            class="recommendation-item"
          >
            {{ rec }}
          </div>
        </div>
      </section>

      <!-- Быстрый старт тренировок -->
      <section class="quick-workouts">
        <div class="section-header">
          <h3>💪 Быстрый старт тренировок</h3>
          <router-link to="/workouts" class="see-all">Все тренировки →</router-link>
        </div>
        
        <div v-if="isLoading" class="loading">
          <div class="spinner"></div>
          <p>ИИ подбирает тренировки...</p>
        </div>
        
        <div v-else class="workouts-grid">
          <WorkoutCard
            v-for="workout in displayedWorkouts"
            :key="workout.id"
            :workout="workout"
            :is-loading="isLoading"
            @start-workout="handleStartWorkout"
          />
        </div>
      </section>

      <!-- Прогресс -->
      <section class="progress-section">
        <h3>📈 Ваш прогресс</h3>
        <ProgressChart :progress="userProgress" />
      </section>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useFitness } from '../composables/useFitness'
import WorkoutCard from '../components/WorkoutCard.vue'
import ProgressChart from '../components/ProgressChart.vue'

const {
  user,
  workouts,
  userProgress,
  dailyNutrition,
  isLoading,
  aiRecommendations,
  weeklyProgress
} = useFitness()

// Берем только первые 2 тренировки для главной страницы
const displayedWorkouts = computed(() => {
  return (workouts.value || []).slice(0, 2)
})

const handleStartWorkout = (workoutId) => {
  alert(`Тренировка ${workoutId} начата! 🏃‍♂️`)
}
</script>

<style scoped>
.dashboard {
  padding: 2rem 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.welcome-section {
  text-align: center;
  margin-bottom: 3rem;
}

.welcome-section h2 {
  color: #2d3748;
  margin-bottom: 0.5rem;
}

.welcome-section p {
  color: #718096;
  font-size: 1.1rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
}

.stat-card {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  display: flex;
  align-items: center;
  gap: 1rem;
}

.stat-icon {
  font-size: 2rem;
}

.stat-info h3 {
  margin: 0;
  font-size: 1.5rem;
  color: #2d3748;
}

.stat-info p {
  margin: 0;
  color: #718096;
  font-size: 0.9rem;
}

.recommendations-section {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 2rem;
  border-radius: 12px;
  margin-bottom: 3rem;
}

.recommendations-section h3 {
  margin-top: 0;
  margin-bottom: 1rem;
}

.recommendations-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.recommendation-item {
  background: rgba(255,255,255,0.1);
  padding: 1rem;
  border-radius: 8px;
  border-left: 4px solid rgba(255,255,255,0.3);
}

.quick-workouts {
  margin-bottom: 3rem;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.section-header h3 {
  margin: 0;
  color: #2d3748;
}

.see-all {
  color: #667eea;
  text-decoration: none;
  font-weight: 500;
}

.see-all:hover {
  text-decoration: underline;
}

.loading {
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

.workouts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.progress-section h3 {
  color: #2d3748;
  margin-bottom: 1.5rem;
}

@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
}
</style>