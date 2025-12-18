<template>
  <div class="nutrition-page">
    <!-- Header -->
    <div class="page-header">
      <h1>🥗 Питание</h1>
      <p>Отслеживайте ваше питание и воду</p>
    </div>
    
    <!-- Quick Stats -->
    <div class="quick-stats">
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon">🔥</div>
          <div class="stat-info">
            <h3>{{ nutritionStore.todaysNutrition.calories }}</h3>
            <p>Ккал сегодня</p>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon">💪</div>
          <div class="stat-info">
            <h3>{{ nutritionStore.todaysNutrition.protein }}g</h3>
            <p>Белок</p>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon">💧</div>
          <div class="stat-info">
            <h3>{{ nutritionStore.waterIntake.toFixed(1) }}L</h3>
            <p>Вода</p>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon">🎯</div>
          <div class="stat-info">
            <h3>{{ Math.round(averageProgress) }}%</h3>
            <p>Прогресс</p>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Main Content -->
    <div class="nutrition-content">
      <!-- Left Column: Form & Water -->
      <div class="left-column">
        <!-- Add Meal Form -->
        <div class="form-section">
          <h3>📝 Добавить прием пищи</h3>
          <NutritionForm @nutrition-added="handleMealAdded" />
        </div>
        
        <!-- Water Tracker -->
        <div class="water-section">
          <h3>💧 Трекер воды</h3>
          <div class="water-tracker">
            <div class="water-display">
              <div class="water-amount">
                <span class="amount">{{ nutritionStore.waterIntake.toFixed(1) }}</span>
                <span class="unit">литров</span>
              </div>
              <div class="water-goal">
                <span class="goal-label">Цель:</span>
                <span class="goal-value">{{ nutritionStore.dailyGoals.water }}L</span>
              </div>
            </div>
            
            <div class="water-progress">
              <div 
                class="progress-fill" 
                :style="{ width: nutritionStore.nutritionProgress.water + '%' }"
              ></div>
            </div>
            
            <div class="water-controls">
              <button 
                v-for="amount in [0.25, 0.5, 1]" 
                :key="amount"
                @click="addWater(amount)"
                class="water-button"
                :disabled="nutritionStore.waterIntake + amount > 5"
              >
                +{{ amount }}L
              </button>
              <button @click="resetWater" class="water-button reset">
                Сбросить
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Right Column: Meals & Progress -->
      <div class="right-column">
        <!-- Today's Meals -->
        <div class="meals-section">
          <div class="section-header">
            <h3>🍽️ Сегодняшние приемы пищи</h3>
            <button 
              v-if="nutritionStore.todayMeals.length > 0"
              @click="clearTodayMeals"
              class="clear-button"
            >
              Очистить все
            </button>
          </div>
          
          <div v-if="nutritionStore.isLoading" class="loading">
            <div class="spinner"></div>
            <p>Загрузка...</p>
          </div>
          
          <div v-else-if="nutritionStore.error" class="error">
            <p>{{ nutritionStore.error }}</p>
            <button @click="nutritionStore.fetchMeals()" class="retry-button">
              Повторить
            </button>
          </div>
          
          <div v-else-if="nutritionStore.todayMeals.length === 0" class="empty-meals">
            <p>Пока нет приемов пищи сегодня</p>
            <p>Добавьте первый прием пищи выше</p>
          </div>
          
          <div v-else class="meals-list">
            <div 
              v-for="meal in nutritionStore.todayMeals" 
              :key="meal.id"
              class="meal-card"
            >
              <div class="meal-header">
                <div class="meal-title">
                  <h4>{{ meal.name }}</h4>
                  <span class="meal-time">{{ meal.time }}</span>
                </div>
                <button 
                  @click="deleteMeal(meal.id)"
                  class="delete-meal-button"
                >
                  ×
                </button>
              </div>
              
              <div class="meal-nutrition">
                <div class="nutrition-item">
                  <span class="label">Калории:</span>
                  <span class="value">{{ meal.calories }} ккал</span>
                </div>
                <div class="nutrition-item">
                  <span class="label">Белок:</span>
                  <span class="value">{{ meal.protein }}g</span>
                </div>
                <div class="nutrition-item">
                  <span class="label">Углеводы:</span>
                  <span class="value">{{ meal.carbs }}g</span>
                </div>
                <div class="nutrition-item">
                  <span class="label">Жиры:</span>
                  <span class="value">{{ meal.fat }}g</span>
                </div>
              </div>
              
              <div v-if="meal.type" class="meal-type">
                <span class="type-badge">{{ getMealTypeLabel(meal.type) }}</span>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Nutrition Progress -->
        <div class="progress-section">
          <h3>📊 Прогресс питания</h3>
          <div class="progress-grid">
            <div 
              v-for="item in progressItems" 
              :key="item.id"
              class="progress-item"
            >
              <div class="progress-header">
                <span class="progress-label">{{ item.label }}</span>
                <span class="progress-value">{{ item.value }}/{{ item.goal }}{{ item.unit }}</span>
              </div>
              
              <div class="progress-bar">
                <div 
                  class="bar-fill" 
                  :style="{ 
                    width: item.percentage + '%',
                    backgroundColor: item.color 
                  }"
                ></div>
              </div>
              
              <div class="progress-info">
                <span class="remaining">
                  Осталось: {{ item.remaining }}{{ item.unit }}
                </span>
                <span class="percentage">{{ Math.round(item.percentage) }}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Daily Goals -->
    <div class="goals-section">
      <div class="section-header">
        <h3>🎯 Дневные цели</h3>
        <button @click="showGoalsModal = true" class="edit-goals-button">
          Редактировать цели
        </button>
      </div>
      
      <div class="goals-grid">
        <div class="goal-card">
          <div class="goal-header">
            <span class="goal-icon">🔥</span>
            <span class="goal-title">Калории</span>
          </div>
          <div class="goal-value">{{ nutritionStore.dailyGoals.calories }} ккал</div>
        </div>
        
        <div class="goal-card">
          <div class="goal-header">
            <span class="goal-icon">💪</span>
            <span class="goal-title">Белок</span>
          </div>
          <div class="goal-value">{{ nutritionStore.dailyGoals.protein }}g</div>
        </div>
        
        <div class="goal-card">
          <div class="goal-header">
            <span class="goal-icon">🍞</span>
            <span class="goal-title">Углеводы</span>
          </div>
          <div class="goal-value">{{ nutritionStore.dailyGoals.carbs }}g</div>
        </div>
        
        <div class="goal-card">
          <div class="goal-header">
            <span class="goal-icon">🥑</span>
            <span class="goal-title">Жиры</span>
          </div>
          <div class="goal-value">{{ nutritionStore.dailyGoals.fat }}g</div>
        </div>
      </div>
    </div>
    
    <!-- Goals Modal -->
    <div v-if="showGoalsModal" class="modal-overlay" @click.self="showGoalsModal = false">
      <div class="modal-content">
        <h3>Редактировать дневные цели</h3>
        
        <form @submit.prevent="updateGoals" class="goals-form">
          <div class="form-group">
            <label for="calories">Калории (ккал)</label>
            <input
              id="calories"
              v-model.number="goalsForm.calories"
              type="number"
              min="0"
              max="5000"
              required
            >
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label for="protein">Белок (г)</label>
              <input
                id="protein"
                v-model.number="goalsForm.protein"
                type="number"
                min="0"
                max="300"
                required
              >
            </div>
            
            <div class="form-group">
              <label for="carbs">Углеводы (г)</label>
              <input
                id="carbs"
                v-model.number="goalsForm.carbs"
                type="number"
                min="0"
                max="500"
                required
              >
            </div>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label for="fat">Жиры (г)</label>
              <input
                id="fat"
                v-model.number="goalsForm.fat"
                type="number"
                min="0"
                max="150"
                required
              >
            </div>
            
            <div class="form-group">
              <label for="water">Вода (литры)</label>
              <input
                id="water"
                v-model.number="goalsForm.water"
                type="number"
                min="0"
                max="5"
                step="0.25"
                required
              >
            </div>
          </div>
          
          <div class="form-actions">
            <button type="submit" class="save-button">Сохранить</button>
            <button type="button" @click="showGoalsModal = false" class="cancel-button">
              Отмена
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useNutritionStore } from '@/stores/useNutritionStore'
import NutritionForm from '@/components/NutritionForm.vue'

const nutritionStore = useNutritionStore()

// State
const showGoalsModal = ref(false)
const goalsForm = ref({
  calories: 2000,
  protein: 150,
  carbs: 250,
  fat: 60,
  water: 2.0
})

// Computed
const averageProgress = computed(() => {
  const progress = nutritionStore.nutritionProgress
  const values = Object.values(progress)
  return values.reduce((sum, val) => sum + val, 0) / values.length
})

const progressItems = computed(() => [
  {
    id: 1,
    label: 'Калории',
    value: nutritionStore.todaysNutrition.calories,
    goal: nutritionStore.dailyGoals.calories,
    unit: 'ккал',
    remaining: nutritionStore.remainingNutrition.calories,
    percentage: nutritionStore.nutritionProgress.calories,
    color: '#e53e3e'
  },
  {
    id: 2,
    label: 'Белок',
    value: nutritionStore.todaysNutrition.protein,
    goal: nutritionStore.dailyGoals.protein,
    unit: 'g',
    remaining: nutritionStore.remainingNutrition.protein,
    percentage: nutritionStore.nutritionProgress.protein,
    color: '#ed8936'
  },
  {
    id: 3,
    label: 'Углеводы',
    value: nutritionStore.todaysNutrition.carbs,
    goal: nutritionStore.dailyGoals.carbs,
    unit: 'g',
    remaining: nutritionStore.remainingNutrition.carbs,
    percentage: nutritionStore.nutritionProgress.carbs,
    color: '#4299e1'
  },
  {
    id: 4,
    label: 'Жиры',
    value: nutritionStore.todaysNutrition.fat,
    goal: nutritionStore.dailyGoals.fat,
    unit: 'g',
    remaining: nutritionStore.remainingNutrition.fat,
    percentage: nutritionStore.nutritionProgress.fat,
    color: '#48bb78'
  },
  {
    id: 5,
    label: 'Вода',
    value: nutritionStore.waterIntake,
    goal: nutritionStore.dailyGoals.water,
    unit: 'L',
    remaining: nutritionStore.remainingNutrition.water,
    percentage: nutritionStore.nutritionProgress.water,
    color: '#38b2ac'
  }
])

// Methods
const getMealTypeLabel = (type) => {
  const types = {
    breakfast: 'Завтрак',
    lunch: 'Обед',
    dinner: 'Ужин',
    snack: 'Перекус'
  }
  return types[type] || type
}

const handleMealAdded = async (mealData) => {
  await nutritionStore.addMeal(mealData)
}

const addWater = async (amount) => {
  await nutritionStore.addWater(amount)
}

const resetWater = async () => {
  await nutritionStore.resetWater()
}

const deleteMeal = async (id) => {
  if (confirm('Удалить этот прием пищи?')) {
    await nutritionStore.deleteMeal(id)
  }
}

const clearTodayMeals = async () => {
  if (confirm('Очистить все сегодняшние приемы пищи?')) {
    await nutritionStore.clearTodaysMeals()
  }
}

const updateGoals = async () => {
  await nutritionStore.updateDailyGoals(goalsForm.value)
  showGoalsModal.value = false
}

// Lifecycle
onMounted(async () => {
  await nutritionStore.fetchMeals()
  
  // Инициализация формы целей
  goalsForm.value = { ...nutritionStore.dailyGoals }
})
</script>

<style scoped>
.nutrition-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
}

.page-header {
  text-align: center;
  margin-bottom: 32px;
}

.page-header h1 {
  font-size: 2.5rem;
  color: #2d3748;
  margin-bottom: 8px;
}

.page-header p {
  font-size: 1.2rem;
  color: #718096;
}

.quick-stats {
  margin-bottom: 32px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 24px;
}

.stat-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
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

.nutrition-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px;
  margin-bottom: 32px;
}

@media (max-width: 1024px) {
  .nutrition-content {
    grid-template-columns: 1fr;
  }
}

.left-column,
.right-column {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.form-section,
.water-section,
.meals-section,
.progress-section {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
}

.form-section h3,
.water-section h3,
.meals-section h3,
.progress-section h3 {
  margin: 0 0 20px 0;
  color: #2d3748;
  font-size: 1.5rem;
}

.water-tracker {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.water-display {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.water-amount {
  text-align: center;
}

.amount {
  font-size: 2.5rem;
  font-weight: bold;
  color: #4299e1;
  display: block;
}

.unit {
  font-size: 1rem;
  color: #718096;
}

.water-goal {
  text-align: center;
}

.goal-label {
  display: block;
  color: #718096;
  font-size: 0.9rem;
  margin-bottom: 4px;
}

.goal-value {
  font-size: 1.5rem;
  font-weight: bold;
  color: #2d3748;
}

.water-progress {
  height: 12px;
  background: #e2e8f0;
  border-radius: 6px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #4299e1, #38b2ac);
  transition: width 0.5s ease;
}

.water-controls {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
}

.water-button {
  padding: 10px;
  background: #4299e1;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.water-button:hover:not(:disabled) {
  background: #3182ce;
  transform: translateY(-2px);
}

.water-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.water-button.reset {
  background: #e53e3e;
}

.water-button.reset:hover {
  background: #c53030;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.clear-button {
  padding: 6px 12px;
  background: #fed7d7;
  color: #c53030;
  border: none;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.clear-button:hover {
  background: #feb2b2;
}

.loading,
.error,
.empty-meals {
  text-align: center;
  padding: 40px 20px;
  color: #718096;
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

.empty-meals p:first-child {
  font-size: 1.2rem;
  margin-bottom: 8px;
}

.meals-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.meal-card {
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  padding: 20px;
  transition: all 0.3s ease;
}

.meal-card:hover {
  border-color: #cbd5e0;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
}

.meal-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
}

.meal-title h4 {
  margin: 0 0 4px 0;
  color: #2d3748;
  font-size: 1.2rem;
}

.meal-time {
  color: #718096;
  font-size: 0.9rem;
}

.delete-meal-button {
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

.delete-meal-button:hover {
  background: #feb2b2;
}

.meal-nutrition {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin-bottom: 16px;
}

.nutrition-item {
  display: flex;
  justify-content: space-between;
  padding: 8px 12px;
  background: #f7fafc;
  border-radius: 8px;
}

.label {
  color: #718096;
  font-size: 0.9rem;
}

.value {
  font-weight: 600;
  color: #2d3748;
}

.meal-type {
  margin-top: 12px;
}

.type-badge {
  display: inline-block;
  padding: 4px 12px;
  background: #e2e8f0;
  color: #4a5568;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
}

.progress-grid {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.progress-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.progress-header {
  display: flex;
  justify-content: space-between;
  font-size: 0.95rem;
}

.progress-label {
  font-weight: 500;
  color: #4a5568;
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

.bar-fill {
  height: 100%;
  transition: width 0.5s ease;
}

.progress-info {
  display: flex;
  justify-content: space-between;
  font-size: 0.85rem;
}

.remaining {
  color: #718096;
}

.percentage {
  font-weight: 600;
  color: #2d3748;
}

.goals-section {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
}

.edit-goals-button {
  padding: 8px 16px;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.edit-goals-button:hover {
  background: #5a67d8;
  transform: translateY(-2px);
}

.goals-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-top: 20px;
}

.goal-card {
  background: #f7fafc;
  border-radius: 12px;
  padding: 20px;
  text-align: center;
  transition: all 0.3s ease;
}

.goal-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.goal-header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-bottom: 12px;
}

.goal-icon {
  font-size: 1.5rem;
}

.goal-title {
  font-weight: 500;
  color: #4a5568;
}

.goal-value {
  font-size: 1.5rem;
  font-weight: bold;
  color: #2d3748;
}

/* Modal */
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
  padding: 32px;
  width: 90%;
  max-width: 500px;
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
  margin: 0 0 24px 0;
  color: #2d3748;
  font-size: 1.5rem;
  text-align: center;
}

.goals-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  color: #4a5568;
  font-weight: 500;
}

.form-group input {
  width: 100%;
  padding: 12px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.2s ease;
}

.form-group input:focus {
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

.save-button,
.cancel-button {
  flex: 1;
  padding: 12px;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
}

.save-button {
  background: #48bb78;
  color: white;
}

.save-button:hover {
  background: #38a169;
}

.cancel-button {
  background: #e2e8f0;
  color: #4a5568;
}

.cancel-button:hover {
  background: #cbd5e0;
}

@media (max-width: 768px) {
  .nutrition-page {
    padding: 16px;
  }
  
  .stats-grid,
  .goals-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .meal-nutrition {
    grid-template-columns: 1fr;
  }
  
  .water-controls {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .form-row {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .stats-grid,
  .goals-grid {
    grid-template-columns: 1fr;
  }
}
</style>