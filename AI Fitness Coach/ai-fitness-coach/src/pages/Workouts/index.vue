<template>
  <div class="workouts-page">
    <!-- Header -->
    <div class="page-header">
      <h1>💪 Тренировки</h1>
      <p>Выберите или создайте свою тренировку</p>
    </div>
    
    <!-- Actions -->
    <div class="page-actions">
      <router-link to="/workouts/create" class="create-button">
        + Новая тренировка
      </router-link>
      
      <div class="view-controls">
        <button 
          @click="viewMode = 'grid'" 
          class="view-button"
          :class="{ active: viewMode === 'grid' }"
        >
          📊 Сетка
        </button>
        <button 
          @click="viewMode = 'list'" 
          class="view-button"
          :class="{ active: viewMode === 'list' }"
        >
          📝 Список
        </button>
      </div>
    </div>
    
    <!-- Filters -->
    <div class="filters-section">
      <div class="filters-grid">
        <select v-model="selectedType" class="filter-select">
          <option value="">Все типы</option>
          <option value="strength">Силовые</option>
          <option value="cardio">Кардио</option>
          <option value="hiit">HIIT</option>
          <option value="yoga">Йога</option>
        </select>
        
        <select v-model="selectedDifficulty" class="filter-select">
          <option value="">Все уровни</option>
          <option value="beginner">Начинающий</option>
          <option value="intermediate">Средний</option>
          <option value="advanced">Продвинутый</option>
        </select>
        
        <select v-model="selectedStatus" class="filter-select">
          <option value="">Все статусы</option>
          <option value="completed">Завершенные</option>
          <option value="active">Активные</option>
          <option value="favorite">Избранные</option>
        </select>
        
        <input 
          v-model="searchQuery" 
          type="text" 
          placeholder="Поиск тренировок..."
          class="search-input"
        >
      </div>
    </div>
    
    <!-- Loading State -->
    <div v-if="workoutStore.isLoading" class="loading">
      <div class="spinner"></div>
      <p>Загрузка тренировок...</p>
    </div>
    
    <!-- Error State -->
    <div v-else-if="workoutStore.error" class="error">
      <p>😔 {{ workoutStore.error }}</p>
      <button @click="workoutStore.fetchWorkouts()" class="retry-button">
        Попробовать снова
      </button>
    </div>
    
    <!-- Empty State -->
    <div v-else-if="filteredWorkouts.length === 0" class="empty">
      <p>🎯 Тренировки не найдены</p>
      <p>Попробуйте изменить фильтры или создать новую тренировку</p>
      <router-link to="/workouts/create" class="create-empty-button">
        + Создать первую тренировку
      </router-link>
    </div>
    
    <!-- Workouts Grid/List -->
    <div v-else class="workouts-container">
      <div 
        class="workouts-display" 
        :class="{ 'grid-view': viewMode === 'grid', 'list-view': viewMode === 'list' }"
      >
        <WorkoutCard
          v-for="workout in paginatedWorkouts"
          :key="workout.id"
          :workout="workout"
          :view-mode="viewMode"
          @start-workout="startWorkout"
          @toggle-favorite="toggleFavorite"
          @delete-workout="deleteWorkout"
        />
      </div>
      
      <!-- Pagination -->
      <div v-if="totalPages > 1" class="pagination">
        <button 
          @click="prevPage" 
          :disabled="currentPage === 1"
          class="page-button"
        >
          ← Назад
        </button>
        
        <div class="page-numbers">
          <button 
            v-for="page in visiblePages" 
            :key="page"
            @click="goToPage(page)"
            class="page-number"
            :class="{ active: page === currentPage }"
          >
            {{ page }}
          </button>
          
          <span v-if="showEllipsis" class="ellipsis">...</span>
        </div>
        
        <button 
          @click="nextPage" 
          :disabled="currentPage === totalPages"
          class="page-button"
        >
          Вперед →
        </button>
      </div>
    </div>
    
    <!-- Stats -->
    <div class="workout-stats">
      <div class="stat-card">
        <div class="stat-icon">📊</div>
        <div class="stat-info">
          <h3>{{ workoutStore.totalWorkouts }}</h3>
          <p>Всего тренировок</p>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon">✅</div>
        <div class="stat-info">
          <h3>{{ workoutStore.completedWorkouts }}</h3>
          <p>Завершено</p>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon">⏱️</div>
        <div class="stat-info">
          <h3>{{ workoutStore.totalDuration }}</h3>
          <p>Минут тренировок</p>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon">🔥</div>
        <div class="stat-info">
          <h3>{{ workoutStore.totalCalories }}</h3>
          <p>Ккал сожжено</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useWorkoutStore } from '@/stores/useWorkoutStore'
import WorkoutCard from '@/components/WorkoutCard.vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const workoutStore = useWorkoutStore()

// Filters
const viewMode = ref('grid')
const selectedType = ref('')
const selectedDifficulty = ref('')
const selectedStatus = ref('')
const searchQuery = ref('')

// Pagination
const currentPage = ref(1)
const itemsPerPage = ref(viewMode.value === 'grid' ? 6 : 10)

// Computed
const filteredWorkouts = computed(() => {
  return workoutStore.workouts.filter(workout => {
    // Filter by type
    if (selectedType.value && workout.type !== selectedType.value) {
      return false
    }
    
    // Filter by difficulty
    if (selectedDifficulty.value && workout.difficulty !== selectedDifficulty.value) {
      return false
    }
    
    // Filter by status
    if (selectedStatus.value === 'completed' && !workout.completed) {
      return false
    }
    if (selectedStatus.value === 'active' && workout.completed) {
      return false
    }
    if (selectedStatus.value === 'favorite' && !workout.favorite) {
      return false
    }
    
    // Filter by search query
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase()
      return workout.title.toLowerCase().includes(query) || 
             workout.description.toLowerCase().includes(query)
    }
    
    return true
  })
})

const paginatedWorkouts = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredWorkouts.value.slice(start, end)
})

const totalPages = computed(() => {
  return Math.ceil(filteredWorkouts.value.length / itemsPerPage.value)
})

const visiblePages = computed(() => {
  const pages = []
  const maxVisible = 5
  
  if (totalPages.value <= maxVisible) {
    for (let i = 1; i <= totalPages.value; i++) {
      pages.push(i)
    }
  } else {
    let start = Math.max(1, currentPage.value - 2)
    let end = Math.min(totalPages.value, start + maxVisible - 1)
    
    if (end - start < maxVisible - 1) {
      start = Math.max(1, end - maxVisible + 1)
    }
    
    for (let i = start; i <= end; i++) {
      pages.push(i)
    }
  }
  
  return pages
})

const showEllipsis = computed(() => {
  return totalPages.value > 5 && 
         (currentPage.value < totalPages.value - 2 || currentPage.value > 3)
})

// Methods
const startWorkout = (workoutId) => {
  const workout = workoutStore.workouts.find(w => w.id === workoutId)
  if (workout) {
    // Navigate to workout detail
    router.push(`/workouts/${workoutId}`)
  }
}

const toggleFavorite = async (workoutId) => {
  await workoutStore.toggleFavorite(workoutId)
}

const deleteWorkout = async (workoutId) => {
  if (confirm('Удалить эту тренировку?')) {
    await workoutStore.deleteWorkout(workoutId)
  }
}

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
    scrollToTop()
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
    scrollToTop()
  }
}

const goToPage = (page) => {
  currentPage.value = page
  scrollToTop()
}

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// Lifecycle
onMounted(async () => {
  await workoutStore.fetchWorkouts()
})

// Watchers
watch(viewMode, (newMode) => {
  itemsPerPage.value = newMode === 'grid' ? 6 : 10
  currentPage.value = 1
})

watch([selectedType, selectedDifficulty, selectedStatus, searchQuery], () => {
  currentPage.value = 1
})

// Добавьте этот метод в методы компонента
const loadWorkouts = async () => {
  if (!workoutStore.workouts || workoutStore.workouts.length === 0) {
    await workoutStore.fetchWorkouts()
  }
}

// Вызовите в onMounted
onMounted(async () => {
  await loadWorkouts()
})

</script>

<style scoped>
.workouts-page {
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

.page-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 16px;
}

.create-button {
  padding: 12px 24px;
  background: #667eea;
  color: white;
  text-decoration: none;
  border-radius: 8px;
  font-weight: 600;
  transition: all 0.2s ease;
}

.create-button:hover {
  background: #5a67d8;
  transform: translateY(-2px);
}

.view-controls {
  display: flex;
  gap: 8px;
  background: #f7fafc;
  padding: 4px;
  border-radius: 8px;
}

.view-button {
  padding: 8px 16px;
  border: none;
  background: transparent;
  color: #718096;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;
}

.view-button.active {
  background: white;
  color: #667eea;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.filters-section {
  margin-bottom: 32px;
}

.filters-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.filter-select,
.search-input {
  padding: 12px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  background: white;
}

.search-input {
  grid-column: span 2;
}

.filter-select:focus,
.search-input:focus {
  outline: none;
  border-color: #667eea;
}

.loading, .error, .empty {
  text-align: center;
  padding: 60px 20px;
  color: #718096;
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

.empty p:first-child {
  font-size: 1.5rem;
  margin-bottom: 8px;
}

.create-empty-button {
  display: inline-block;
  margin-top: 20px;
  padding: 12px 24px;
  background: #48bb78;
  color: white;
  text-decoration: none;
  border-radius: 8px;
  font-weight: 600;
}

.workouts-container {
  margin-bottom: 40px;
}

.workouts-display.grid-view {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 24px;
}

.workouts-display.list-view {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 32px;
  padding: 20px 0;
  border-top: 2px solid #e2e8f0;
}

.page-button {
  padding: 8px 16px;
  border: 2px solid #e2e8f0;
  background: white;
  color: #4a5568;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;
}

.page-button:hover:not(:disabled) {
  border-color: #667eea;
  color: #667eea;
}

.page-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-numbers {
  display: flex;
  gap: 8px;
  align-items: center;
}

.page-number {
  width: 40px;
  height: 40px;
  border: 2px solid #e2e8f0;
  background: white;
  color: #4a5568;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;
}

.page-number:hover {
  border-color: #667eea;
}

.page-number.active {
  background: #667eea;
  color: white;
  border-color: #667eea;
}

.ellipsis {
  color: #718096;
  padding: 0 8px;
}

.workout-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 24px;
  margin-top: 40px;
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

@media (max-width: 768px) {
  .workouts-page {
    padding: 16px;
  }
  
  .page-actions {
    flex-direction: column;
    align-items: stretch;
  }
  
  .filters-grid {
    grid-template-columns: 1fr;
  }
  
  .search-input {
    grid-column: 1;
  }
  
  .workouts-display.grid-view {
    grid-template-columns: 1fr;
  }
  
  .pagination {
    flex-direction: column;
    gap: 16px;
  }
  
  .workout-stats {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .workout-stats {
    grid-template-columns: 1fr;
  }
}
</style>