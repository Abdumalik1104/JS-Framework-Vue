<template>
  <div class="nutrition-page">
    <div class="container">
      <div class="page-header">
        <h1>🥗 Питание</h1>
        <p>Отслеживайте ваше питание и получайте ИИ-рекомендации</p>
      </div>

      <!-- Статистика питания -->
      <section class="nutrition-stats">
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-icon">🔥</div>
            <div class="stat-info">
              <h3>{{ dailyNutrition.calories }}</h3>
              <p>Калории</p>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">💪</div>
            <div class="stat-info">
              <h3>{{ dailyNutrition.protein }}g</h3>
              <p>Белок</p>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">🍞</div>
            <div class="stat-info">
              <h3>{{ dailyNutrition.carbs }}g</h3>
              <p>Углеводы</p>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">🥑</div>
            <div class="stat-info">
              <h3>{{ dailyNutrition.fat }}g</h3>
              <p>Жиры</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Форма добавления питания -->
      <section class="nutrition-form-section">
        <h2>📝 Добавить прием пищи</h2>
        <NutritionForm @nutrition-added="handleNutritionAdded" />
      </section>

      <!-- ИИ рекомендации по питанию -->
      <section class="ai-recommendations">
        <h2>🤖 ИИ-рекомендации по питанию</h2>
        <div class="recommendations-list">
          <div 
            v-for="(rec, index) in nutritionRecommendations" 
            :key="index"
            class="recommendation-item"
          >
            <span class="rec-icon">💡</span>
            <p>{{ rec }}</p>
          </div>
        </div>
      </section>

      <!-- Трекер воды -->
      <section class="water-tracker">
        <h2>💧 Трекер воды</h2>
        <div class="water-container">
          <div class="water-stats">
            <div class="water-amount">
              <span class="amount">{{ dailyNutrition.water }}</span>
              <span class="unit">литров</span>
            </div>
            <p>Выпито сегодня</p>
          </div>
          <div class="water-controls">
            <button 
              @click="addWater(0.25)" 
              class="water-btn"
              :disabled="dailyNutrition.water >= 4"
            >
              +0.25L
            </button>
            <button 
              @click="addWater(0.5)" 
              class="water-btn"
              :disabled="dailyNutrition.water >= 4"
            >
              +0.5L
            </button>
            <button 
              @click="resetWater" 
              class="water-btn reset"
            >
              Сбросить
            </button>
          </div>
        </div>
        <div class="water-goal">
          <div class="goal-text">Цель: 2.0 литров в день</div>
          <div class="goal-progress">
            <div 
              class="goal-fill" 
              :style="{ width: waterProgress + '%' }"
            ></div>
          </div>
          <div class="goal-percentage">{{ Math.min(waterProgress, 100) }}%</div>
        </div>
      </section>

      <!-- История питания -->
      <section class="nutrition-history">
        <h2>📊 Сегодняшние приемы пищи</h2>
        <div v-if="todayMeals.length === 0" class="empty-meals">
          <p>🍽️ Добавьте ваш первый прием пищи</p>
        </div>
        <div v-else class="meals-list">
          <div 
            v-for="meal in todayMeals" 
            :key="meal.id"
            class="meal-item"
          >
            <div class="meal-header">
              <h3>{{ meal.name }}</h3>
              <span class="meal-time">{{ meal.time }}</span>
            </div>
            <div class="meal-nutrition">
              <span class="nutrition-item">🔥 {{ meal.calories }} ккал</span>
              <span class="nutrition-item">💪 {{ meal.protein }}g белка</span>
              <span class="nutrition-item">🍞 {{ meal.carbs }}g углеводов</span>
              <span class="nutrition-item">🥑 {{ meal.fat }}g жиров</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useFitness } from '../composables/useFitness'
import NutritionForm from '../components/NutritionForm.vue'

const { dailyNutrition, updateNutrition } = useFitness()

// История приемов пищи
const mealsHistory = ref([])

// ИИ рекомендации по питанию
const nutritionRecommendations = computed(() => {
  const recommendations = []
  
  if (dailyNutrition.water < 1.5) {
    recommendations.push('Пейте больше воды! Старайтесь выпивать 2+ литра в день.')
  }
  
  if (dailyNutrition.protein < 100) {
    recommendations.push('Увеличьте потребление белка для лучшего восстановления мышц.')
  }
  
  if (dailyNutrition.calories < 1800) {
    recommendations.push('Убедитесь, что потребляете достаточно калорий для энергии.')
  } else if (dailyNutrition.calories > 2500) {
    recommendations.push('Следите за калориями, возможно стоит уменьшить порции.')
  }
  
  if (recommendations.length === 0) {
    recommendations.push('Отличный баланс! Продолжайте в том же духе. 💪')
  }
  
  return recommendations
})

// Прогресс по воде
const waterProgress = computed(() => {
  return (dailyNutrition.water / 2.0) * 100
})

// Сегодняшние приемы пищи
const todayMeals = computed(() => {
  const today = new Date().toDateString()
  return mealsHistory.value.filter(meal => 
    new Date(meal.date).toDateString() === today
  )
})

// Добавление воды
const addWater = (amount) => {
  const newWater = Math.min(dailyNutrition.water + amount, 4)
  updateNutrition({ water: newWater })
}

// Сброс воды
const resetWater = () => {
  updateNutrition({ water: 0 })
}

// Обработчик добавления питания
const handleNutritionAdded = (mealData) => {
  const newMeal = {
    id: Date.now(),
    date: new Date().toISOString(),
    time: new Date().toLocaleTimeString('ru-RU', { 
      hour: '2-digit', 
      minute: '2-digit' 
    }),
    ...mealData
  }
  
  mealsHistory.value.unshift(newMeal)
  
  // Обновляем общую статистику питания
  const newNutrition = {
    calories: dailyNutrition.calories + mealData.calories,
    protein: dailyNutrition.protein + mealData.protein,
    carbs: dailyNutrition.carbs + mealData.carbs,
    fat: dailyNutrition.fat + mealData.fat
  }
  
  updateNutrition(newNutrition)
  
  // Сохраняем в localStorage
  saveMealsToLocalStorage()
}

// Сохранение в localStorage
const saveMealsToLocalStorage = () => {
  localStorage.setItem('mealsHistory', JSON.stringify(mealsHistory.value))
}

// Загрузка из localStorage
const loadMealsFromLocalStorage = () => {
  const saved = localStorage.getItem('mealsHistory')
  if (saved) {
    mealsHistory.value = JSON.parse(saved)
  }
}

onMounted(() => {
  loadMealsFromLocalStorage()
})
</script>

<style scoped>
.nutrition-page {
  padding: 2rem 0;
}

.container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 1rem;
}

.page-header {
  text-align: center;
  margin-bottom: 3rem;
}

.page-header h1 {
  color: #2d3748;
  margin-bottom: 0.5rem;
  font-size: 2.5rem;
}

.page-header p {
  color: #718096;
  font-size: 1.2rem;
}

/* Статистика питания */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
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
  transition: transform 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
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

/* Форма питания */
.nutrition-form-section {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  margin-bottom: 3rem;
}

.nutrition-form-section h2 {
  color: #2d3748;
  margin-bottom: 1.5rem;
}

/* ИИ рекомендации */
.ai-recommendations {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 2rem;
  border-radius: 12px;
  margin-bottom: 3rem;
}

.ai-recommendations h2 {
  margin-top: 0;
  margin-bottom: 1.5rem;
}

.recommendations-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.recommendation-item {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  background: rgba(255,255,255,0.1);
  padding: 1rem;
  border-radius: 8px;
  border-left: 4px solid rgba(255,255,255,0.3);
}

.rec-icon {
  font-size: 1.2rem;
  flex-shrink: 0;
}

.recommendation-item p {
  margin: 0;
  line-height: 1.5;
}

/* Трекер воды */
.water-tracker {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  margin-bottom: 3rem;
}

.water-tracker h2 {
  color: #2d3748;
  margin-bottom: 1.5rem;
}

.water-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 2rem;
}

.water-stats {
  text-align: center;
}

.water-amount {
  margin-bottom: 0.5rem;
}

.amount {
  font-size: 3rem;
  font-weight: bold;
  color: #4299e1;
}

.unit {
  font-size: 1.2rem;
  color: #718096;
  margin-left: 0.5rem;
}

.water-stats p {
  margin: 0;
  color: #718096;
}

.water-controls {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.water-btn {
  padding: 0.75rem 1.5rem;
  border: 2px solid #4299e1;
  background: white;
  color: #4299e1;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
}

.water-btn:hover:not(:disabled) {
  background: #4299e1;
  color: white;
}

.water-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.water-btn.reset {
  border-color: #e53e3e;
  color: #e53e3e;
}

.water-btn.reset:hover {
  background: #e53e3e;
  color: white;
}

.water-goal {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.goal-text {
  color: #718096;
  font-weight: 500;
  min-width: 150px;
}

.goal-progress {
  flex: 1;
  height: 8px;
  background: #e2e8f0;
  border-radius: 4px;
  overflow: hidden;
  min-width: 200px;
}

.goal-fill {
  height: 100%;
  background: linear-gradient(135deg, #4299e1 0%, #667eea 100%);
  transition: width 0.3s ease;
}

.goal-percentage {
  color: #4299e1;
  font-weight: 600;
  min-width: 60px;
  text-align: right;
}

/* История питания */
.nutrition-history {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.nutrition-history h2 {
  color: #2d3748;
  margin-bottom: 1.5rem;
}

.empty-meals {
  text-align: center;
  padding: 3rem;
  color: #718096;
}

.empty-meals p {
  font-size: 1.1rem;
}

.meals-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.meal-item {
  padding: 1.5rem;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  transition: all 0.3s ease;
}

.meal-item:hover {
  border-color: #667eea;
  transform: translateX(4px);
}

.meal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.meal-header h3 {
  margin: 0;
  color: #2d3748;
}

.meal-time {
  color: #718096;
  font-size: 0.9rem;
  background: #f7fafc;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
}

.meal-nutrition {
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.nutrition-item {
  color: #4a5568;
  font-size: 0.9rem;
  font-weight: 500;
}

@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .water-container {
    flex-direction: column;
    align-items: stretch;
  }
  
  .water-controls {
    justify-content: center;
  }
  
  .water-goal {
    flex-direction: column;
    align-items: stretch;
  }
  
  .goal-progress {
    min-width: auto;
  }
  
  .meal-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .meal-nutrition {
    justify-content: space-between;
  }
  
  .nutrition-item {
    flex: 1;
    text-align: center;
  }
}

@media (max-width: 480px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .meal-nutrition {
    flex-direction: column;
    gap: 0.5rem;
  }
}
</style>