<template>
  <form @submit.prevent="handleSubmit" class="workout-form">
    <div class="form-group">
      <label for="title">Название тренировки *</label>
      <input
        id="title"
        v-model="form.title"
        type="text"
        :class="{ 'error': errors.title }"
        @blur="validateField('title')"
      >
      <span v-if="errors.title" class="error-message">{{ errors.title }}</span>
    </div>
    
    <div class="form-row">
      <div class="form-group">
        <label>Тип тренировки</label>
        <select v-model="form.type" @change="validateField('type')">
          <option value="">Выберите тип</option>
          <option v-for="type in workoutTypes" :key="type" :value="type">
            {{ type }}
          </option>
        </select>
      </div>
      
      <div class="form-group">
        <label>Уровень сложности</label>
        <div class="radio-group">
          <label v-for="level in difficultyLevels" :key="level">
            <input
              type="radio"
              :value="level"
              v-model="form.difficulty"
              @change="validateField('difficulty')"
            >
            {{ level }}
          </label>
        </div>
      </div>
    </div>
    
    <div class="form-group">
      <label>Упражнения</label>
      <div v-for="(exercise, index) in form.exercises" :key="index" class="exercise-item">
        <input
          v-model="exercise.name"
          placeholder="Название упражнения"
          @blur="validateExercise(index)"
        >
        <div v-if="exerciseErrors[index]" class="error-message">
          {{ exerciseErrors[index] }}
        </div>
        <button type="button" @click="removeExercise(index)">×</button>
      </div>
      <button type="button" @click="addExercise">+ Добавить упражнение</button>
    </div>
    
    <div class="form-actions">
      <button type="submit" :disabled="isSubmitting">
        {{ isSubmitting ? 'Сохранение...' : 'Создать тренировку' }}
      </button>
      <button type="button" @click="resetForm">Сбросить</button>
    </div>
  </form>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useFormValidation } from '@/composables/useFormValidation'

const emit = defineEmits(['submit'])

const form = ref({
  title: '',
  type: '',
  difficulty: 'beginner',
  duration: 30,
  exercises: [{ name: '', sets: 3, reps: 12 }]
})

const { errors, validateField, validateForm, resetValidation } = useFormValidation(form, {
  title: { required: true, minLength: 3, maxLength: 100 },
  type: { required: true },
  difficulty: { required: true }
})

const exerciseErrors = ref({})
const isSubmitting = ref(false)

const workoutTypes = ['Strength', 'Cardio', 'HIIT', 'Yoga', 'Flexibility']
const difficultyLevels = ['beginner', 'intermediate', 'advanced']

const validateExercise = (index) => {
  if (!form.value.exercises[index].name.trim()) {
    exerciseErrors.value[index] = 'Название обязательно'
  } else {
    delete exerciseErrors.value[index]
  }
}

const addExercise = () => {
  form.value.exercises.push({ name: '', sets: 3, reps: 12 })
}

const removeExercise = (index) => {
  form.value.exercises.splice(index, 1)
  delete exerciseErrors.value[index]
}

const handleSubmit = async () => {
  // Валидация всех полей
  const isValid = validateForm()
  
  // Валидация упражнений
  form.value.exercises.forEach((_, index) => validateExercise(index))
  
  if (isValid && Object.keys(exerciseErrors.value).length === 0) {
    isSubmitting.value = true
    emit('submit', form.value)
    isSubmitting.value = false
  }
}

const resetForm = () => {
  form.value = {
    title: '',
    type: '',
    difficulty: 'beginner',
    duration: 30,
    exercises: [{ name: '', sets: 3, reps: 12 }]
  }
  resetValidation()
  exerciseErrors.value = {}
}
</script>

<style scoped>
.workout-form {
  max-width: 600px;
  margin: 0 auto;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

input.error, select.error {
  border-color: #e53e3e;
}

.error-message {
  color: #e53e3e;
  font-size: 0.875rem;
  margin-top: 0.25rem;
}

.exercise-item {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  align-items: center;
}

.radio-group {
  display: flex;
  gap: 1rem;
}

.form-actions {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
}

button[type="submit"] {
  background: #48bb78;
  color: white;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 0.375rem;
  cursor: pointer;
}

button[type="submit"]:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Анимация для формы */
.form-group {
  animation: slideIn 0.3s ease-out;
  animation-fill-mode: both;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>