<template>
  <div class="workout-card" :class="`difficulty-${workout.difficulty}`">
    <div class="workout-header">
      <div class="workout-title-row">
        <h3 class="workout-title">{{ workout.title }}</h3>
        <div class="workout-badges">
          <span v-if="workout.completed" class="badge completed">✅</span>
          <span v-if="workout.favorite" class="badge favorite">❤️</span>
        </div>
      </div>
      
      <div class="workout-meta">
        <span class="meta-item duration">⏱️ {{ workout.duration }} мин</span>
        <span class="meta-item calories">🔥 {{ workout.calories || 0 }} ккал</span>
        <span class="meta-item difficulty" :class="`difficulty-${workout.difficulty}`">
          {{ getDifficultyLabel(workout.difficulty) }}
        </span>
      </div>
    </div>
    
    <div class="workout-description" v-if="workout.description">
      <p>{{ truncateDescription(workout.description) }}</p>
    </div>
    
    <div class="workout-stats">
      <div class="stat">
        <span class="stat-label">Упражнений:</span>
        <span class="stat-value">{{ getExercisesCount() }}</span>
      </div>
      <div class="stat">
        <span class="stat-label">Тип:</span>
        <span class="stat-value">{{ getTypeLabel(workout.type) }}</span>
      </div>
    </div>
    
    <div class="workout-actions">
      <button 
        @click="$emit('start-workout', workout.id)" 
        class="action-button start"
      >
        🏃‍♂️ Начать
      </button>
      
      <button 
        @click="$emit('toggle-favorite', workout.id)" 
        class="action-button favorite"
        :class="{ 'active': workout.favorite }"
      >
        {{ workout.favorite ? '❤️' : '🤍' }}
      </button>
      
      <router-link 
        :to="`/workouts/${workout.id}`" 
        class="action-button details"
      >
        📖 Подробнее
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  workout: {
    type: Object,
    required: true,
    default: () => ({
      id: 0,
      title: 'Тренировка',
      duration: 30,
      difficulty: 'beginner',
      type: 'cardio',
      calories: 0,
      exercises: [],
      completed: false,
      favorite: false,
      description: ''
    })
  }
})

defineEmits(['start-workout', 'toggle-favorite'])

// Helper functions
const getDifficultyLabel = (difficulty) => {
  const labels = {
    'beginner': 'Начинающий',
    'intermediate': 'Средний',
    'advanced': 'Продвинутый'
  }
  return labels[difficulty] || difficulty
}

const getTypeLabel = (type) => {
  const types = {
    'strength': 'Силовая',
    'cardio': 'Кардио',
    'hiit': 'HIIT',
    'yoga': 'Йога',
    'stretching': 'Растяжка'
  }
  return types[type] || type
}

const getExercisesCount = () => {
  if (!props.workout.exercises) return 0
  if (Array.isArray(props.workout.exercises)) {
    return props.workout.exercises.length
  }
  return 0
}

const truncateDescription = (text) => {
  if (text.length > 100) {
    return text.substring(0, 100) + '...'
  }
  return text
}
</script>

<style scoped>
.workout-card {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
  transition: all 0.3s ease;
  border-left: 4px solid #667eea;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.workout-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 32px rgba(0,0,0,0.12);
}

/* Difficulty colors */
.difficulty-beginner {
  border-left-color: #48bb78;
}

.difficulty-intermediate {
  border-left-color: #ed8936;
}

.difficulty-advanced {
  border-left-color: #e53e3e;
}

.workout-header {
  margin-bottom: 16px;
}

.workout-title-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
}

.workout-title {
  margin: 0;
  font-size: 1.4rem;
  color: #2d3748;
  flex: 1;
  line-height: 1.3;
}

.workout-badges {
  display: flex;
  gap: 8px;
}

.badge {
  font-size: 1.2rem;
}

.badge.completed {
  color: #48bb78;
}

.badge.favorite {
  color: #e53e3e;
}

.workout-meta {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.meta-item {
  padding: 4px 12px;
  background: #f7fafc;
  border-radius: 20px;
  font-size: 0.9rem;
  color: #4a5568;
  font-weight: 500;
}

.meta-item.difficulty {
  font-weight: 600;
}

.meta-item.difficulty-beginner {
  background: #c6f6d5;
  color: #276749;
}

.meta-item.difficulty-intermediate {
  background: #fed7d7;
  color: #c53030;
}

.meta-item.difficulty-advanced {
  background: #fed7d7;
  color: #c53030;
}

.workout-description {
  margin-bottom: 20px;
  flex: 1;
}

.workout-description p {
  margin: 0;
  color: #718096;
  line-height: 1.5;
  font-size: 0.95rem;
}

.workout-stats {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-bottom: 24px;
  padding: 16px;
  background: #f7fafc;
  border-radius: 12px;
}

.stat {
  display: flex;
  flex-direction: column;
}

.stat-label {
  font-size: 0.8rem;
  color: #718096;
  margin-bottom: 4px;
}

.stat-value {
  font-size: 1.1rem;
  font-weight: 600;
  color: #2d3748;
}

.workout-actions {
  display: grid;
  grid-template-columns: 1fr auto auto;
  gap: 8px;
  margin-top: auto;
}

.action-button {
  padding: 10px 16px;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;
  text-align: center;
  font-size: 0.9rem;
}

.action-button.start {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.action-button.start:hover {
  background: #5a67d8;
  transform: translateY(-2px);
}

.action-button.favorite {
  background: #e2e8f0;
  color: #4a5568;
  width: 50px;
  padding: 10px;
}

.action-button.favorite:hover,
.action-button.favorite.active {
  background: #fed7d7;
  color: #e53e3e;
}

.action-button.details {
  background: white;
  color: #667eea;
  border: 2px solid #667eea;
}

.action-button.details:hover {
  background: #f7fafc;
}

@media (max-width: 768px) {
  .workout-actions {
    grid-template-columns: 1fr;
  }
  
  .action-button.favorite {
    width: 100%;
  }
}
</style>