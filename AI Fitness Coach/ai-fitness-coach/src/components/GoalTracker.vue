<template>
  <div class="goal-tracker">
    <div class="tracker-header">
      <h3>🎯 Отслеживание целей</h3>
      <button @click="showAddModal = true" class="add-goal-button">
        + Новая цель
      </button>
    </div>
    
    <div v-if="goals.length === 0" class="empty-goals">
      <p>У вас пока нет целей. Добавьте первую!</p>
    </div>
    
    <div v-else class="goals-list">
      <div 
        v-for="goal in goals" 
        :key="goal.id"
        class="goal-card"
        :class="`goal--${goal.priority}`"
      >
        <div class="goal-main">
          <div class="goal-title-row">
            <h4 class="goal-title">{{ goal.title }}</h4>
            <div class="goal-actions">
              <button @click="editGoal(goal)" class="action-button edit">✏️</button>
              <button @click="deleteGoal(goal.id)" class="action-button delete">🗑️</button>
            </div>
          </div>
          
          <p class="goal-description">{{ goal.description }}</p>
          
          <div class="goal-details">
            <span class="goal-date">📅 {{ formatDate(goal.deadline) }}</span>
            <span class="goal-category" :style="{ backgroundColor: categoryColors[goal.category] }">
              {{ goal.category }}
            </span>
          </div>
        </div>
        
        <div class="goal-progress-section">
          <div class="progress-info">
            <span class="progress-label">Прогресс</span>
            <span class="progress-value">{{ goal.progress }}%</span>
          </div>
          
          <div class="progress-bar">
            <div 
              class="progress-fill" 
              :style="{ width: goal.progress + '%' }"
            ></div>
          </div>
          
          <div class="progress-actions">
            <button 
              @click="updateProgress(goal.id, 10)" 
              class="progress-button"
              :disabled="goal.progress >= 100"
            >
              +10%
            </button>
            <button 
              @click="updateProgress(goal.id, -10)" 
              class="progress-button"
              :disabled="goal.progress <= 0"
            >
              -10%
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Модальное окно добавления цели -->
    <div v-if="showAddModal" class="modal-overlay" @click.self="showAddModal = false">
      <div class="modal-content">
        <h3>{{ editingGoal ? 'Редактировать цель' : 'Новая цель' }}</h3>
        
        <form @submit.prevent="saveGoal" class="goal-form">
          <div class="form-group">
            <label>Название цели *</label>
            <input 
              v-model="goalForm.title" 
              type="text" 
              placeholder="Например: Похудеть на 5кг"
              required
            >
          </div>
          
          <div class="form-group">
            <label>Описание</label>
            <textarea 
              v-model="goalForm.description" 
              placeholder="Детали вашей цели..."
              rows="3"
            ></textarea>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label>Категория</label>
              <select v-model="goalForm.category">
                <option v-for="category in categories" :key="category">
                  {{ category }}
                </option>
              </select>
            </div>
            
            <div class="form-group">
              <label>Приоритет</label>
              <select v-model="goalForm.priority">
                <option value="low">Низкий</option>
                <option value="medium">Средний</option>
                <option value="high">Высокий</option>
              </select>
            </div>
          </div>
          
          <div class="form-group">
            <label>Дедлайн</label>
            <input v-model="goalForm.deadline" type="date">
          </div>
          
          <div class="form-actions">
            <button type="submit" class="save-button">
              {{ editingGoal ? 'Обновить' : 'Сохранить' }}
            </button>
            <button type="button" @click="cancelEdit" class="cancel-button">
              Отмена
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue'

const props = defineProps({
  initialGoals: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['goal-added', 'goal-updated', 'goal-deleted', 'progress-changed'])

// Состояние целей
const goals = ref(props.initialGoals.length > 0 ? props.initialGoals : [
  {
    id: 1,
    title: 'Пробежать 5км без остановки',
    description: 'Увеличить выносливость для бега на длинные дистанции',
    category: 'Кардио',
    priority: 'high',
    deadline: '2024-12-31',
    progress: 40,
    createdAt: new Date().toISOString()
  },
  {
    id: 2,
    title: 'Сделать 50 отжиманий за подход',
    description: 'Улучшить силу верхней части тела',
    category: 'Силовые',
    priority: 'medium',
    deadline: '2024-11-15',
    progress: 65,
    createdAt: new Date().toISOString()
  },
  {
    id: 3,
    title: 'Пить 2 литра воды ежедневно',
    description: 'Улучшить гидратацию и общее самочувствие',
    category: 'Здоровье',
    priority: 'low',
    deadline: '2024-10-30',
    progress: 80,
    createdAt: new Date().toISOString()
  }
])

// Модальное окно и форма
const showAddModal = ref(false)
const editingGoal = ref(null)
const goalForm = reactive({
  title: '',
  description: '',
  category: 'Фитнес',
  priority: 'medium',
  deadline: '',
  progress: 0
})

// Константы
const categories = ['Фитнес', 'Питание', 'Здоровье', 'Кардио', 'Силовые', 'Гибкость']
const categoryColors = {
  'Фитнес': '#4299e1',
  'Питание': '#48bb78',
  'Здоровье': '#667eea',
  'Кардио': '#ed8936',
  'Силовые': '#e53e3e',
  'Гибкость': '#9f7aea'
}

// Computed свойства
const completedGoals = computed(() => {
  return goals.value.filter(goal => goal.progress >= 100).length
})

const totalGoals = computed(() => goals.value.length)

const completionRate = computed(() => {
  if (totalGoals.value === 0) return 0
  return Math.round((completedGoals.value / totalGoals.value) * 100)
})

// Методы
const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  })
}

const addGoal = () => {
  showAddModal.value = true
  editingGoal.value = null
  resetForm()
}

const editGoal = (goal) => {
  editingGoal.value = goal
  Object.assign(goalForm, goal)
  showAddModal.value = true
}

const saveGoal = () => {
  if (!goalForm.title.trim()) {
    alert('Название цели обязательно!')
    return
  }
  
  if (editingGoal.value) {
    // Обновление существующей цели
    const index = goals.value.findIndex(g => g.id === editingGoal.value.id)
    if (index !== -1) {
      goals.value[index] = { ...editingGoal.value, ...goalForm }
      emit('goal-updated', goals.value[index])
    }
  } else {
    // Добавление новой цели
    const newGoal = {
      id: Date.now(),
      ...goalForm,
      createdAt: new Date().toISOString()
    }
    goals.value.push(newGoal)
    emit('goal-added', newGoal)
  }
  
  showAddModal.value = false
  resetForm()
}

const deleteGoal = (goalId) => {
  if (confirm('Удалить эту цель?')) {
    goals.value = goals.value.filter(goal => goal.id !== goalId)
    emit('goal-deleted', goalId)
  }
}

const updateProgress = (goalId, change) => {
  const goal = goals.value.find(g => g.id === goalId)
  if (goal) {
    const newProgress = Math.max(0, Math.min(100, goal.progress + change))
    goal.progress = newProgress
    emit('progress-changed', { goalId, progress: newProgress })
  }
}

const resetForm = () => {
  Object.assign(goalForm, {
    title: '',
    description: '',
    category: 'Фитнес',
    priority: 'medium',
    deadline: '',
    progress: 0
  })
  editingGoal.value = null
}

const cancelEdit = () => {
  showAddModal.value = false
  resetForm()
}

// Watch для отслеживания изменений целей
watch(goals, (newGoals) => {
  localStorage.setItem('fitnessGoals', JSON.stringify(newGoals))
}, { deep: true })

// Инициализация из localStorage
const loadGoalsFromStorage = () => {
  const saved = localStorage.getItem('fitnessGoals')
  if (saved) {
    goals.value = JSON.parse(saved)
  }
}

loadGoalsFromStorage()
</script>

<style scoped>
.goal-tracker {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
}

.tracker-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.tracker-header h3 {
  margin: 0;
  color: #2d3748;
  font-size: 1.5rem;
}

.add-goal-button {
  padding: 8px 16px;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.add-goal-button:hover {
  background: #5a67d8;
  transform: translateY(-2px);
}

.empty-goals {
  text-align: center;
  padding: 40px 20px;
  color: #718096;
  background: #f7fafc;
  border-radius: 8px;
}

.empty-goals p {
  margin: 0;
  font-size: 1.1rem;
}

.goals-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.goal-card {
  border-radius: 12px;
  padding: 20px;
  transition: all 0.3s ease;
  border-left: 4px solid #4299e1;
}

.goal--high {
  border-left-color: #e53e3e;
  background: linear-gradient(to right, #fff5f5, white);
}

.goal--medium {
  border-left-color: #ed8936;
  background: linear-gradient(to right, #fefcbf, white);
}

.goal--low {
  border-left-color: #48bb78;
  background: linear-gradient(to right, #f0fff4, white);
}

.goal-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(0,0,0,0.1);
}

.goal-main {
  margin-bottom: 16px;
}

.goal-title-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 8px;
  gap: 12px;
}

.goal-title {
  margin: 0;
  font-size: 1.25rem;
  color: #2d3748;
  flex: 1;
}

.goal-actions {
  display: flex;
  gap: 8px;
}

.action-button {
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.action-button.edit {
  background: #4299e1;
  color: white;
}

.action-button.delete {
  background: #fed7d7;
  color: #c53030;
}

.action-button:hover {
  transform: scale(1.1);
}

.goal-description {
  margin: 0 0 12px 0;
  color: #718096;
  line-height: 1.5;
}

.goal-details {
  display: flex;
  gap: 12px;
  font-size: 0.875rem;
}

.goal-date {
  color: #718096;
}

.goal-category {
  padding: 2px 8px;
  border-radius: 12px;
  color: white;
  font-size: 0.75rem;
  font-weight: 500;
}

.goal-progress-section {
  background: #f7fafc;
  padding: 16px;
  border-radius: 8px;
}

.progress-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  font-size: 0.875rem;
}

.progress-label {
  color: #718096;
}

.progress-value {
  font-weight: bold;
  color: #48bb78;
}

.progress-bar {
  height: 8px;
  background: #e2e8f0;
  border-radius: 4px;
  margin-bottom: 12px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #48bb78, #38a169);
  transition: width 0.5s ease;
}

.progress-actions {
  display: flex;
  gap: 8px;
}

.progress-button {
  flex: 1;
  padding: 6px 12px;
  border: 1px solid #cbd5e0;
  background: white;
  color: #4a5568;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.875rem;
  transition: all 0.2s ease;
}

.progress-button:hover:not(:disabled) {
  background: #f7fafc;
  border-color: #a0aec0;
}

.progress-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Модальное окно */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.modal-content {
  background: white;
  border-radius: 16px;
  padding: 24px;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  animation: slideUp 0.3s ease;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.modal-content h3 {
  margin: 0 0 20px 0;
  color: #2d3748;
}

.goal-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-group label {
  display: block;
  margin-bottom: 6px;
  color: #4a5568;
  font-weight: 500;
}

.form-group input,
.form-group textarea,
.form-group select {
  width: 100%;
  padding: 10px;
  border: 2px solid #e2e8f0;
  border-radius: 6px;
  font-size: 1rem;
  transition: border-color 0.2s ease;
}

.form-group input:focus,
.form-group textarea:focus,
.form-group select:focus {
  outline: none;
  border-color: #667eea;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.form-actions {
  display: flex;
  gap: 12px;
  margin-top: 8px;
}

.save-button {
  flex: 1;
  padding: 12px;
  background: #48bb78;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
}

.cancel-button {
  flex: 1;
  padding: 12px;
  background: #e2e8f0;
  color: #4a5568;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
}
</style>