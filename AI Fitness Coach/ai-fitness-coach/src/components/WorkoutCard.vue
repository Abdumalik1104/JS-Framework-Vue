<template>
  <div class="workout-card" :class="`difficulty-${workout.difficulty}`">
    <div class="workout-header">
      <h3 class="workout-title">{{ workout.title }}</h3>
      <span class="workout-duration">{{ workout.duration }} мин</span>
    </div>
    
    <div class="workout-info">
      <span class="workout-type">{{ getTypeLabel(workout.type) }}</span>
      <span class="workout-calories">🔥 {{ workout.calories }} ккал</span>
    </div>
    
    <div class="exercises-preview">
      <div 
        v-for="(exercise, index) in workout.exercises.slice(0, 2)" 
        :key="index"
        class="exercise-item"
      >
        {{ exercise.name }}
      </div>
      <div v-if="workout.exercises.length > 2" class="exercise-more">
        +{{ workout.exercises.length - 2 }} упражнений
      </div>
    </div>
    
    <button 
      @click="$emit('startWorkout', workout.id)" 
      class="start-button"
      :disabled="isLoading"
    >
      {{ isLoading ? 'Загрузка...' : 'Начать тренировку' }}
    </button>
  </div>
</template>

<script setup>
defineProps({
  workout: {
    type: Object,
    required: true
  },
  isLoading: {
    type: Boolean,
    default: false
  }
})

defineEmits(['startWorkout'])

const getTypeLabel = (type) => {
  const types = {
    cardio: 'Кардио',
    strength: 'Силовая',
    hiit: 'HIIT',
    yoga: 'Йога'
  }
  return types[type] || type
}
</script>

<style scoped>
.workout-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  border-left: 4px solid #667eea;
  transition: transform 0.3s ease;
}

.workout-card:hover {
  transform: translateY(-2px);
}

.workout-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.workout-title {
  margin: 0;
  font-size: 1.1rem;
  color: #2d3748;
  flex: 1;
}

.workout-duration {
  background: #667eea;
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
}

.workout-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
  font-size: 0.9rem;
}

.workout-type {
  color: #4a5568;
  font-weight: 500;
}

.workout-calories {
  color: #e53e3e;
  font-weight: 600;
}

.exercises-preview {
  margin-bottom: 1.5rem;
}

.exercise-item {
  padding: 0.5rem;
  background: #f7fafc;
  margin-bottom: 0.5rem;
  border-radius: 6px;
  font-size: 0.9rem;
}

.exercise-more {
  text-align: center;
  color: #718096;
  font-size: 0.8rem;
}

.start-button {
  width: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 0.75rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.3s ease;
}

.start-button:hover:not(:disabled) {
  opacity: 0.9;
}

.start-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.difficulty-beginner {
  border-left-color: #48bb78;
}

.difficulty-intermediate {
  border-left-color: #ed8936;
}

.difficulty-advanced {
  border-left-color: #e53e3e;
}
</style>