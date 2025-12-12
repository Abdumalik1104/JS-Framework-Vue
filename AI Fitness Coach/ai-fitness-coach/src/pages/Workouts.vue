<template>
  <div class="workouts-page">
    <div class="container">
      <div class="page-header">
        <h1>💪 Тренировки</h1>
        <p>Персональные тренировки от ИИ-тренера</p>
      </div>

      <!-- Фильтры -->
      <div class="filters">
        <select v-model="selectedDifficulty" class="filter-select">
          <option value="all">Все уровни</option>
          <option value="beginner">Начинающий</option>
          <option value="intermediate">Средний</option>
          <option value="advanced">Продвинутый</option>
        </select>
        
        <select v-model="selectedType" class="filter-select">
          <option value="all">Все типы</option>
          <option value="cardio">Кардио</option>
          <option value="strength">Силовые</option>
          <option value="hiit">HIIT</option>
        </select>
      </div>

      <!-- Список тренировок -->
      <div v-if="isLoading" class="loading">
        <div class="spinner"></div>
        <p>Загрузка тренировок...</p>
      </div>

      <div v-else class="workouts-list">
        <WorkoutCard
          v-for="workout in filteredWorkouts"
          :key="workout.id"
          :workout="workout"
          :is-loading="isLoading"
          @start-workout="handleStartWorkout"
        />
        
        <div v-if="filteredWorkouts.length === 0" class="empty-state">
          <p>😔 Тренировки не найдены</p>
          <p>Попробуйте изменить фильтры</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useFitness } from '../composables/useFitness'
import WorkoutCard from '../components/WorkoutCard.vue'

const { workouts, isLoading } = useFitness()

const selectedDifficulty = ref('all')
const selectedType = ref('all')

// Правильно обрабатываем computed свойство
const filteredWorkouts = computed(() => {
  const workoutsList = workouts.value || [] // Берем значение computed свойства
  
  return workoutsList.filter(workout => {
    const difficultyMatch = selectedDifficulty.value === 'all' || 
                           workout.difficulty === selectedDifficulty.value
    const typeMatch = selectedType.value === 'all' || 
                      workout.type === selectedType.value
    return difficultyMatch && typeMatch
  })
})

const handleStartWorkout = (workoutId) => {
  // Временно показываем alert вместо перехода
  alert(`Тренировка ${workoutId} начата! 🏃‍♂️\n\nВ полной версии здесь будет детальная страница с таймером и отслеживанием прогресса.`)
}
</script>

<style scoped>
.workouts-page {
  padding: 2rem 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.page-header {
  text-align: center;
  margin-bottom: 2rem;
}

.page-header h1 {
  color: #2d3748;
  margin-bottom: 0.5rem;
}

.page-header p {
  color: #718096;
  font-size: 1.1rem;
}

.filters {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.filter-select {
  padding: 0.75rem 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  background: white;
  font-size: 1rem;
  min-width: 150px;
}

.filter-select:focus {
  outline: none;
  border-color: #667eea;
}

.workouts-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
}

.empty-state {
  grid-column: 1 / -1;
  text-align: center;
  padding: 3rem;
  color: #718096;
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

@media (max-width: 768px) {
  .filters {
    flex-direction: column;
  }
  
  .workouts-list {
    grid-template-columns: 1fr;
  }
}
</style>