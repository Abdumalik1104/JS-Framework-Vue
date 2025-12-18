<template>
  <div class="create-workout">
    <div class="page-header">
      <router-link to="/workouts" class="back-link">
        ← Назад к тренировкам
      </router-link>
      <h1>🏋️‍♂️ Создание тренировки</h1>
      <p>Создайте свою уникальную тренировку</p>
    </div>
    
    <div class="create-container">
      <!-- Form -->
      <div class="form-section">
        <form @submit.prevent="handleSubmit" class="workout-form">
          <!-- Basic Info -->
          <div class="form-group">
            <label for="title" class="required">Название тренировки</label>
            <input
              id="title"
              v-model="form.title"
              type="text"
              placeholder="Например: Утренняя зарядка"
              :class="{ 'error': errors.title }"
              @blur="validateField('title')"
            >
            <span v-if="errors.title" class="error-message">{{ errors.title }}</span>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label for="type" class="required">Тип тренировки</label>
              <select
                id="type"
                v-model="form.type"
                :class="{ 'error': errors.type }"
                @change="validateField('type')"
              >
                <option value="">Выберите тип</option>
                <option value="strength">Силовая</option>
                <option value="cardio">Кардио</option>
                <option value="hiit">HIIT</option>
                <option value="yoga">Йога</option>
                <option value="stretching">Растяжка</option>
                <option value="other">Другое</option>
              </select>
              <span v-if="errors.type" class="error-message">{{ errors.type }}</span>
            </div>
            
            <div class="form-group">
              <label for="difficulty" class="required">Уровень сложности</label>
              <select
                id="difficulty"
                v-model="form.difficulty"
                :class="{ 'error': errors.difficulty }"
                @change="validateField('difficulty')"
              >
                <option value="">Выберите уровень</option>
                <option value="beginner">Начинающий</option>
                <option value="intermediate">Средний</option>
                <option value="advanced">Продвинутый</option>
              </select>
              <span v-if="errors.difficulty" class="error-message">{{ errors.difficulty }}</span>
            </div>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label for="duration" class="required">Длительность (минут)</label>
              <input
                id="duration"
                v-model.number="form.duration"
                type="number"
                min="5"
                max="180"
                placeholder="30"
                :class="{ 'error': errors.duration }"
                @blur="validateField('duration')"
              >
              <span v-if="errors.duration" class="error-message">{{ errors.duration }}</span>
            </div>
            
            <div class="form-group">
              <label for="calories">Калории (примерно)</label>
              <input
                id="calories"
                v-model.number="form.calories"
                type="number"
                min="0"
                placeholder="200"
                :class="{ 'error': errors.calories }"
                @blur="validateField('calories')"
              >
              <span v-if="errors.calories" class="error-message">{{ errors.calories }}</span>
            </div>
          </div>
          
          <div class="form-group">
            <label for="description">Описание</label>
            <textarea
              id="description"
              v-model="form.description"
              placeholder="Опишите вашу тренировку..."
              rows="3"
              :class="{ 'error': errors.description }"
              @blur="validateField('description')"
            ></textarea>
            <span v-if="errors.description" class="error-message">{{ errors.description }}</span>
          </div>
          
          <!-- Exercises -->
          <div class="exercises-section">
            <div class="section-header">
              <h3>💪 Упражнения</h3>
              <button type="button" @click="addExercise" class="add-exercise-button">
                + Добавить упражнение
              </button>
            </div>
            
            <div v-if="form.exercises.length === 0" class="empty-exercises">
              <p>Добавьте первое упражнение</p>
            </div>
            
            <div v-else class="exercises-list">
              <div 
                v-for="(exercise, index) in form.exercises" 
                :key="index"
                class="exercise-form"
              >
                <div class="exercise-header">
                  <h4>Упражнение {{ index + 1 }}</h4>
                  <button 
                    type="button" 
                    @click="removeExercise(index)"
                    class="remove-exercise-button"
                    v-if="form.exercises.length > 1"
                  >
                    ×
                  </button>
                </div>
                
                <div class="exercise-fields">
                  <div class="form-group">
                    <label :for="`exercise-name-${index}`" class="required">Название</label>
                    <input
                      :id="`exercise-name-${index}`"
                      v-model="exercise.name"
                      type="text"
                      placeholder="Например: Приседания"
                      :class="{ 'error': exerciseErrors[index]?.name }"
                      @blur="validateExerciseField(index, 'name')"
                    >
                    <span v-if="exerciseErrors[index]?.name" class="error-message">
                      {{ exerciseErrors[index]?.name }}
                    </span>
                  </div>
                  
                  <div class="form-row">
                    <div class="form-group">
                      <label :for="`exercise-sets-${index}`">Подходы</label>
                      <input
                        :id="`exercise-sets-${index}`"
                        v-model.number="exercise.sets"
                        type="number"
                        min="1"
                        max="10"
                        placeholder="3"
                        :class="{ 'error': exerciseErrors[index]?.sets }"
                        @blur="validateExerciseField(index, 'sets')"
                      >
                    </div>
                    
                    <div class="form-group">
                      <label :for="`exercise-reps-${index}`">Повторения</label>
                      <input
                        :id="`exercise-reps-${index}`"
                        v-model="exercise.reps"
                        type="text"
                        placeholder="12 или 30 сек"
                        :class="{ 'error': exerciseErrors[index]?.reps }"
                        @blur="validateExerciseField(index, 'reps')"
                      >
                    </div>
                    
                    <div class="form-group">
                      <label :for="`exercise-rest-${index}`">Отдых (сек)</label>
                      <input
                        :id="`exercise-rest-${index}`"
                        v-model.number="exercise.rest"
                        type="number"
                        min="0"
                        max="300"
                        placeholder="60"
                      >
                    </div>
                  </div>
                  
                  <div class="form-group">
                    <label :for="`exercise-instructions-${index}`">Инструкции</label>
                    <textarea
                      :id="`exercise-instructions-${index}`"
                      v-model="exercise.instructions"
                      placeholder="Техника выполнения..."
                      rows="2"
                    ></textarea>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Form Actions -->
          <div class="form-actions">
            <button 
              type="submit" 
              class="submit-button"
              :disabled="isSubmitting"
            >
              {{ isSubmitting ? 'Создание...' : 'Создать тренировку' }}
            </button>
            
            <button 
              type="button" 
              @click="resetForm"
              class="reset-button"
            >
              Сбросить
            </button>
            
            <router-link to="/workouts" class="cancel-button">
              Отмена
            </router-link>
          </div>
        </form>
      </div>
      
      <!-- Preview -->
      <div class="preview-section">
        <h3>👁️ Предпросмотр</h3>
        <div class="preview-card">
          <div class="preview-header">
            <h4>{{ form.title || 'Название тренировки' }}</h4>
            <div class="preview-tags">
              <span v-if="form.type" class="tag">{{ form.type }}</span>
              <span v-if="form.difficulty" class="tag">{{ form.difficulty }}</span>
            </div>
          </div>
          
          <div class="preview-info">
            <div v-if="form.duration" class="info-item">
              <span class="label">⏱️ Длительность:</span>
              <span class="value">{{ form.duration }} мин</span>
            </div>
            <div v-if="form.calories" class="info-item">
              <span class="label">🔥 Калории:</span>
              <span class="value">{{ form.calories }} ккал</span>
            </div>
          </div>
          
          <div v-if="form.description" class="preview-description">
            <p>{{ form.description }}</p>
          </div>
          
          <div class="preview-exercises">
            <h5>Упражнения ({{ form.exercises.length }})</h5>
            <div class="exercises-preview">
              <div 
                v-for="(exercise, index) in form.exercises" 
                :key="index"
                class="exercise-preview"
              >
                <div class="exercise-name">{{ exercise.name || 'Упражнение' }}</div>
                <div class="exercise-details">
                  <span v-if="exercise.sets">{{ exercise.sets }}×</span>
                  <span v-if="exercise.reps">{{ exercise.reps }}</span>
                  <span v-if="exercise.rest">{{ exercise.rest }} сек отдых</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useWorkoutStore } from '@/stores/useWorkoutStore'

const router = useRouter()
const workoutStore = useWorkoutStore()

// Form state
const form = reactive({
  title: '',
  type: '',
  difficulty: '',
  duration: 30,
  calories: 200,
  description: '',
  exercises: [
    { name: '', sets: 3, reps: 12, rest: 60, instructions: '' }
  ]
})

// Validation
const errors = reactive({})
const exerciseErrors = reactive({})
const isSubmitting = ref(false)

// Validation rules
const rules = {
  title: { required: true, minLength: 3, maxLength: 100 },
  type: { required: true },
  difficulty: { required: true },
  duration: { required: true, min: 5, max: 180 },
  calories: { min: 0, max: 1000 },
  description: { maxLength: 500 }
}

const exerciseRules = {
  name: { required: true, minLength: 2, maxLength: 100 },
  sets: { min: 1, max: 10 },
  reps: { required: true }
}

// Methods
const validateField = (fieldName) => {
  const fieldRules = rules[fieldName]
  if (!fieldRules) return true
  
  const value = form[fieldName]
  
  // Required
  if (fieldRules.required && (!value && value !== 0)) {
    errors[fieldName] = 'Это поле обязательно'
    return false
  }
  
  // Min length
  if (fieldRules.minLength && value && value.length < fieldRules.minLength) {
    errors[fieldName] = `Минимальная длина: ${fieldRules.minLength} символов`
    return false
  }
  
  // Max length
  if (fieldRules.maxLength && value && value.length > fieldRules.maxLength) {
    errors[fieldName] = `Максимальная длина: ${fieldRules.maxLength} символов`
    return false
  }
  
  // Min value
  if (fieldRules.min !== undefined && value < fieldRules.min) {
    errors[fieldName] = `Минимальное значение: ${fieldRules.min}`
    return false
  }
  
  // Max value
  if (fieldRules.max !== undefined && value > fieldRules.max) {
    errors[fieldName] = `Максимальное значение: ${fieldRules.max}`
    return false
  }
  
  delete errors[fieldName]
  return true
}

const validateExerciseField = (index, fieldName) => {
  const exercise = form.exercises[index]
  const fieldRules = exerciseRules[fieldName]
  
  if (!fieldRules) return true
  
  const value = exercise[fieldName]
  
  // Required
  if (fieldRules.required && (!value && value !== 0)) {
    if (!exerciseErrors[index]) exerciseErrors[index] = {}
    exerciseErrors[index][fieldName] = 'Это поле обязательно'
    return false
  }
  
  // Min length
  if (fieldRules.minLength && value && value.length < fieldRules.minLength) {
    if (!exerciseErrors[index]) exerciseErrors[index] = {}
    exerciseErrors[index][fieldName] = `Минимальная длина: ${fieldRules.minLength} символов`
    return false
  }
  
  // Max length
  if (fieldRules.maxLength && value && value.length > fieldRules.maxLength) {
    if (!exerciseErrors[index]) exerciseErrors[index] = {}
    exerciseErrors[index][fieldName] = `Максимальная длина: ${fieldRules.maxLength} символов`
    return false
  }
  
  // Min value
  if (fieldRules.min !== undefined && value < fieldRules.min) {
    if (!exerciseErrors[index]) exerciseErrors[index] = {}
    exerciseErrors[index][fieldName] = `Минимальное значение: ${fieldRules.min}`
    return false
  }
  
  // Max value
  if (fieldRules.max !== undefined && value > fieldRules.max) {
    if (!exerciseErrors[index]) exerciseErrors[index] = {}
    exerciseErrors[index][fieldName] = `Максимальное значение: ${fieldRules.max}`
    return false
  }
  
  if (exerciseErrors[index]) {
    delete exerciseErrors[index][fieldName]
    if (Object.keys(exerciseErrors[index]).length === 0) {
      delete exerciseErrors[index]
    }
  }
  
  return true
}

const validateForm = () => {
  let isValid = true
  
  // Validate main form fields
  Object.keys(rules).forEach(field => {
    if (!validateField(field)) {
      isValid = false
    }
  })
  
  // Validate exercises
  form.exercises.forEach((exercise, index) => {
    Object.keys(exerciseRules).forEach(field => {
      if (!validateExerciseField(index, field)) {
        isValid = false
      }
    })
  })
  
  return isValid
}

const addExercise = () => {
  form.exercises.push({ 
    name: '', 
    sets: 3, 
    reps: 12, 
    rest: 60, 
    instructions: '' 
  })
}

const removeExercise = (index) => {
  form.exercises.splice(index, 1)
  delete exerciseErrors[index]
  
  // Reindex errors
  const newErrors = {}
  Object.keys(exerciseErrors).forEach(key => {
    const idx = parseInt(key)
    if (idx > index) {
      newErrors[idx - 1] = exerciseErrors[key]
    } else if (idx < index) {
      newErrors[idx] = exerciseErrors[key]
    }
  })
  Object.assign(exerciseErrors, newErrors)
}

const handleSubmit = async () => {
  if (!validateForm()) {
    alert('Пожалуйста, исправьте ошибки в форме')
    return
  }
  
  isSubmitting.value = true
  
  try {
    const result = await workoutStore.createWorkout({
      title: form.title,
      type: form.type,
      difficulty: form.difficulty,
      duration: form.duration,
      calories: form.calories,
      description: form.description,
      exercises: form.exercises.map(ex => ({
        ...ex,
        sets: ex.sets || 1,
        reps: ex.reps || '10'
      }))
    })
    
    if (result.success) {
      alert('✅ Тренировка успешно создана!')
      router.push('/workouts')
    } else {
      alert(`Ошибка: ${result.error}`)
    }
  } catch (error) {
    alert('Произошла ошибка при создании тренировки')
    console.error(error)
  } finally {
    isSubmitting.value = false
  }
}

const resetForm = () => {
  if (confirm('Сбросить форму? Все данные будут потеряны.')) {
    Object.assign(form, {
      title: '',
      type: '',
      difficulty: '',
      duration: 30,
      calories: 200,
      description: '',
      exercises: [{ name: '', sets: 3, reps: 12, rest: 60, instructions: '' }]
    })
    
    Object.keys(errors).forEach(key => delete errors[key])
    Object.keys(exerciseErrors).forEach(key => delete exerciseErrors[key])
  }
}
</script>

<style scoped>
.create-workout {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
}

.page-header {
  margin-bottom: 32px;
}

.back-link {
  display: inline-block;
  margin-bottom: 16px;
  color: #667eea;
  text-decoration: none;
  font-weight: 500;
}

.back-link:hover {
  text-decoration: underline;
}

.page-header h1 {
  font-size: 2.5rem;
  color: #2d3748;
  margin: 0 0 8px 0;
}

.page-header p {
  font-size: 1.2rem;
  color: #718096;
  margin: 0;
}

.create-container {
  display: grid;
  grid-template-columns: 1fr 350px;
  gap: 32px;
}

@media (max-width: 1024px) {
  .create-container {
    grid-template-columns: 1fr;
  }
}

.form-section,
.preview-section {
  background: white;
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
}

.preview-section h3 {
  margin: 0 0 24px 0;
  color: #2d3748;
  font-size: 1.5rem;
}

.workout-form {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group label {
  margin-bottom: 8px;
  color: #4a5568;
  font-weight: 500;
  font-size: 0.95rem;
}

.form-group label.required::after {
  content: ' *';
  color: #e53e3e;
}

.form-group input,
.form-group textarea,
.form-group select {
  padding: 12px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.2s ease;
}

.form-group input:focus,
.form-group textarea:focus,
.form-group select:focus {
  outline: none;
  border-color: #667eea;
}

.form-group input.error,
.form-group textarea.error,
.form-group select.error {
  border-color: #e53e3e;
}

.error-message {
  color: #e53e3e;
  font-size: 0.875rem;
  margin-top: 4px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

@media (max-width: 768px) {
  .form-row {
    grid-template-columns: 1fr;
  }
}

.exercises-section {
  border-top: 2px solid #e2e8f0;
  padding-top: 24px;
  margin-top: 8px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.section-header h3 {
  margin: 0;
  color: #2d3748;
  font-size: 1.5rem;
}

.add-exercise-button {
  padding: 8px 16px;
  background: #48bb78;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.add-exercise-button:hover {
  background: #38a169;
}

.empty-exercises {
  text-align: center;
  padding: 40px 20px;
  background: #f7fafc;
  border-radius: 12px;
  color: #718096;
}

.exercises-list {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.exercise-form {
  background: #f7fafc;
  border-radius: 12px;
  padding: 20px;
  border: 1px solid #e2e8f0;
}

.exercise-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.exercise-header h4 {
  margin: 0;
  color: #2d3748;
  font-size: 1.1rem;
}

.remove-exercise-button {
  width: 32px;
  height: 32px;
  background: #fed7d7;
  color: #c53030;
  border: none;
  border-radius: 6px;
  font-size: 1.2rem;
  font-weight: bold;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.remove-exercise-button:hover {
  background: #feb2b2;
}

.exercise-fields {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-actions {
  display: flex;
  gap: 12px;
  margin-top: 32px;
  flex-wrap: wrap;
}

.submit-button,
.reset-button,
.cancel-button {
  flex: 1;
  min-width: 140px;
  padding: 14px 24px;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  text-decoration: none;
  text-align: center;
  transition: all 0.2s ease;
}

.submit-button {
  background: #667eea;
  color: white;
}

.submit-button:hover:not(:disabled) {
  background: #5a67d8;
  transform: translateY(-2px);
}

.submit-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.reset-button {
  background: #e2e8f0;
  color: #4a5568;
}

.reset-button:hover {
  background: #cbd5e0;
}

.cancel-button {
  background: white;
  color: #718096;
  border: 2px solid #e2e8f0;
}

.cancel-button:hover {
  border-color: #cbd5e0;
}

/* Preview */
.preview-card {
  background: white;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  padding: 20px;
}

.preview-header {
  margin-bottom: 16px;
}

.preview-header h4 {
  margin: 0 0 12px 0;
  color: #2d3748;
  font-size: 1.25rem;
}

.preview-tags {
  display: flex;
  gap: 8px;
}

.tag {
  padding: 4px 12px;
  background: #f7fafc;
  color: #4a5568;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 500;
}

.preview-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 16px;
}

.info-item {
  display: flex;
  justify-content: space-between;
  color: #718096;
  font-size: 0.9rem;
}

.label {
  font-weight: 500;
}

.value {
  font-weight: 600;
}

.preview-description {
  margin-bottom: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid #e2e8f0;
}

.preview-description p {
  margin: 0;
  color: #4a5568;
  line-height: 1.5;
}

.preview-exercises h5 {
  margin: 0 0 12px 0;
  color: #2d3748;
  font-size: 1.1rem;
}

.exercises-preview {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.exercise-preview {
  padding: 12px;
  background: #f7fafc;
  border-radius: 8px;
}

.exercise-name {
  font-weight: 500;
  color: #2d3748;
  margin-bottom: 4px;
}

.exercise-details {
  font-size: 0.875rem;
  color: #718096;
  display: flex;
  gap: 8px;
}

@media (max-width: 768px) {
  .create-workout {
    padding: 16px;
  }
  
  .form-section,
  .preview-section {
    padding: 20px;
  }
  
  .form-actions {
    flex-direction: column;
  }
  
  .submit-button,
  .reset-button,
  .cancel-button {
    min-width: auto;
  }
}
</style>