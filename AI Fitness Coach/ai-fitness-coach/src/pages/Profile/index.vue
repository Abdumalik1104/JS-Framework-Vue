<template>
  <div class="profile-page">
    <div class="profile-container">
      <!-- User Profile Card -->
      <div class="profile-card">
        <div class="profile-header">
          <img 
            :src="userStore.user.avatar || 'https://i.pravatar.cc/150?img=1'" 
            alt="Avatar"
            class="profile-avatar"
          />
          <div class="profile-info">
            <h1>{{ userStore.user.name }}</h1>
            <p class="profile-email">{{ userStore.user.email }}</p>
            <div class="profile-stats">
              <div class="stat">
                <span class="stat-value">{{ userStore.user.weight }}</span>
                <span class="stat-label">кг</span>
              </div>
              <div class="stat">
                <span class="stat-value">{{ userStore.user.height }}</span>
                <span class="stat-label">см</span>
              </div>
              <div class="stat">
                <span class="stat-value">{{ userStore.bmi }}</span>
                <span class="stat-label">ИМТ</span>
              </div>
            </div>
          </div>
        </div>
        
        <div class="profile-details">
          <div class="detail-item">
            <span class="detail-label">Уровень:</span>
            <span class="detail-value">{{ getLevelLabel(userStore.user.fitnessLevel) }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Цели:</span>
            <div class="goals-list">
              <span 
                v-for="goal in userStore.user.goals" 
                :key="goal"
                class="goal-tag"
              >
                {{ getGoalLabel(goal) }}
              </span>
            </div>
          </div>
          <div class="detail-item">
            <span class="detail-label">Член с:</span>
            <span class="detail-value">{{ formatDate(userStore.user.createdAt) }}</span>
          </div>
        </div>
        
        <div class="profile-actions">
          <router-link to="/profile/settings" class="action-button">
            ✏️ Редактировать профиль
          </router-link>
          <button @click="logout" class="action-button logout">
            🚪 Выйти
          </button>
        </div>
      </div>
      
      <!-- User Stats -->
      <div class="stats-section">
        <h2>📊 Ваша статистика</h2>
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-icon">🏋️‍♂️</div>
            <div class="stat-content">
              <h3>{{ workoutStore.completedWorkouts }}</h3>
              <p>Завершено тренировок</p>
            </div>
          </div>
          
          <div class="stat-card">
            <div class="stat-icon">🔥</div>
            <div class="stat-content">
              <h3>{{ workoutStore.totalCalories }}</h3>
              <p>Ккал сожжено</p>
            </div>
          </div>
          
          <div class="stat-card">
            <div class="stat-icon">⏱️</div>
            <div class="stat-content">
              <h3>{{ workoutStore.totalDuration }}</h3>
              <p>Минут тренировок</p>
            </div>
          </div>
          
          <div class="stat-card">
            <div class="stat-icon">📅</div>
            <div class="stat-content">
              <h3>{{ workoutStore.activeDays }}</h3>
              <p>Активных дней</p>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Recent Activity -->
      <div class="activity-section">
        <h2>📅 Недавняя активность</h2>
        <div v-if="workoutStore.history.length === 0" class="empty-activity">
          <p>Пока нет завершенных тренировок</p>
          <router-link to="/workouts" class="start-link">
            Начать первую тренировку
          </router-link>
        </div>
        
        <div v-else class="activity-list">
          <div 
            v-for="activity in recentActivity" 
            :key="activity.id"
            class="activity-item"
          >
            <div class="activity-icon">
              <span v-if="activity.type === 'workout'">💪</span>
              <span v-if="activity.type === 'meal'">🥗</span>
              <span v-if="activity.type === 'goal'">🎯</span>
            </div>
            
            <div class="activity-info">
              <h4>{{ activity.title }}</h4>
              <p class="activity-time">{{ formatTime(activity.time) }}</p>
            </div>
            
            <div class="activity-details">
              <span v-if="activity.calories" class="calories">
                🔥 {{ activity.calories }} ккал
              </span>
              <span v-if="activity.duration" class="duration">
                ⏱️ {{ activity.duration }} мин
              </span>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Goals Progress -->
      <div class="goals-section">
        <h2>🎯 Прогресс целей</h2>
        <GoalTracker :initial-goals="userStore.goalStatus" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/useUserStore'
import { useWorkoutStore } from '@/stores/useWorkoutStore'
import GoalTracker from '@/components/GoalTracker.vue'

const router = useRouter()
const userStore = useUserStore()
const workoutStore = useWorkoutStore()

// Computed
const recentActivity = computed(() => {
  const activities = []
  
  // Add workout history
  workoutStore.history.slice(0, 5).forEach(item => {
    const workout = workoutStore.workouts.find(w => w.id === item.workoutId)
    if (workout) {
      activities.push({
        id: item.workoutId,
        type: 'workout',
        title: workout.title,
        time: item.completedAt,
        calories: workout.calories,
        duration: workout.duration
      })
    }
  })
  
  // Sort by time
  return activities.sort((a, b) => new Date(b.time) - new Date(a.time))
})

// Methods
const getLevelLabel = (level) => {
  const levels = {
    beginner: 'Начинающий',
    intermediate: 'Средний',
    advanced: 'Продвинутый'
  }
  return levels[level] || level
}

const getGoalLabel = (goal) => {
  const goals = {
    weight_loss: 'Похудение',
    muscle_gain: 'Набор массы',
    endurance: 'Выносливость',
    flexibility: 'Гибкость'
  }
  return goals[goal] || goal
}

const formatDate = (dateString) => {
  if (!dateString) return 'Сегодня'
  const date = new Date(dateString)
  return date.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}

const formatTime = (timeString) => {
  const date = new Date(timeString)
  const now = new Date()
  const diff = now - date
  
  // Less than 24 hours
  if (diff < 24 * 60 * 60 * 1000) {
    const hours = Math.floor(diff / (60 * 60 * 1000))
    if (hours === 0) {
      const minutes = Math.floor(diff / (60 * 1000))
      return `${minutes} минут назад`
    }
    return `${hours} часов назад`
  }
  
  // More than 24 hours
  return date.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'short'
  })
}

const logout = () => {
  if (confirm('Выйти из аккаунта?')) {
    userStore.isAuthenticated = false
    localStorage.removeItem('isAuthenticated')
    router.push('/login')
  }
}

// Lifecycle
onMounted(async () => {
  await workoutStore.fetchWorkouts()
})
</script>

<style scoped>
.profile-page {
  max-width: 1000px;
  margin: 0 auto;
  padding: 24px;
}

.profile-container {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.profile-card {
  background: white;
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
}

.profile-header {
  display: flex;
  align-items: center;
  gap: 24px;
  margin-bottom: 24px;
}

.profile-avatar {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  border: 4px solid #667eea;
  object-fit: cover;
}

.profile-info h1 {
  margin: 0 0 8px 0;
  font-size: 2rem;
  color: #2d3748;
}

.profile-email {
  margin: 0 0 16px 0;
  color: #718096;
  font-size: 1.1rem;
}

.profile-stats {
  display: flex;
  gap: 24px;
}

.stat {
  text-align: center;
}

.stat-value {
  display: block;
  font-size: 1.5rem;
  font-weight: bold;
  color: #667eea;
}

.stat-label {
  font-size: 0.9rem;
  color: #718096;
}

.profile-details {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 24px;
  padding: 24px;
  background: #f7fafc;
  border-radius: 12px;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 16px;
}

.detail-label {
  min-width: 80px;
  font-weight: 500;
  color: #4a5568;
}

.detail-value {
  color: #2d3748;
  font-weight: 500;
}

.goals-list {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.goal-tag {
  padding: 4px 12px;
  background: #e2e8f0;
  color: #4a5568;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 500;
}

.profile-actions {
  display: flex;
  gap: 16px;
}

.action-button {
  flex: 1;
  padding: 12px 24px;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  text-decoration: none;
  text-align: center;
  transition: all 0.2s ease;
}

.action-button:hover {
  background: #5a67d8;
  transform: translateY(-2px);
}

.action-button.logout {
  background: #e53e3e;
}

.action-button.logout:hover {
  background: #c53030;
}

.stats-section h2,
.activity-section h2,
.goals-section h2 {
  margin: 0 0 24px 0;
  color: #2d3748;
  font-size: 1.75rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 24px;
}

.stat-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 20px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0,0,0,0.12);
}

.stat-icon {
  font-size: 2.5rem;
}

.stat-content h3 {
  margin: 0;
  font-size: 2rem;
  color: #2d3748;
}

.stat-content p {
  margin: 4px 0 0 0;
  color: #718096;
  font-size: 0.9rem;
}

.activity-section,
.goals-section {
  background: white;
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
}

.empty-activity {
  text-align: center;
  padding: 40px 20px;
  color: #718096;
}

.empty-activity p {
  margin: 0 0 16px 0;
  font-size: 1.2rem;
}

.start-link {
  display: inline-block;
  padding: 12px 24px;
  background: #48bb78;
  color: white;
  text-decoration: none;
  border-radius: 8px;
  font-weight: 600;
}

.activity-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.activity-item {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 20px;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  transition: all 0.3s ease;
}

.activity-item:hover {
  border-color: #cbd5e0;
  transform: translateX(4px);
}

.activity-icon {
  font-size: 2rem;
}

.activity-info {
  flex: 1;
}

.activity-info h4 {
  margin: 0 0 4px 0;
  color: #2d3748;
  font-size: 1.1rem;
}

.activity-time {
  margin: 0;
  color: #718096;
  font-size: 0.9rem;
}

.activity-details {
  display: flex;
  gap: 12px;
}

.calories,
.duration {
  padding: 4px 12px;
  background: #f7fafc;
  color: #4a5568;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 500;
}

@media (max-width: 768px) {
  .profile-page {
    padding: 16px;
  }
  
  .profile-header {
    flex-direction: column;
    text-align: center;
  }
  
  .profile-stats {
    justify-content: center;
  }
  
  .profile-actions {
    flex-direction: column;
  }
  
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .activity-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
  
  .activity-details {
    align-self: stretch;
    justify-content: space-between;
  }
}

@media (max-width: 480px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .activity-details {
    flex-direction: column;
    gap: 8px;
  }
}
</style>