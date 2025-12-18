<template>
  <div class="user-profile" :class="{ 'profile--dark': isDark }">
    <div class="profile-header">
      <img :src="user.avatar" :alt="user.name" class="profile-avatar" />
      <div class="profile-info">
        <h2 class="profile-name">{{ user.name }}</h2>
        <div class="profile-stats">
          <div class="stat">
            <span class="stat-value">{{ userProgress.workouts }}</span>
            <span class="stat-label">Тренировок</span>
          </div>
          <div class="stat">
            <span class="stat-value">{{ userProgress.streak }}</span>
            <span class="stat-label">Дней подряд</span>
          </div>
          <div class="stat">
            <span class="stat-value">{{ userProgress.level }}</span>
            <span class="stat-label">Уровень</span>
          </div>
        </div>
      </div>
    </div>
    
    <div class="profile-details">
      <h3>Мои цели</h3>
      <div class="goals-list">
        <div 
          v-for="(goal, index) in userGoals" 
          :key="index"
          class="goal-item"
          :style="{ '--progress': goal.progress + '%' }"
        >
          <div class="goal-info">
            <span class="goal-title">{{ goal.title }}</span>
            <span class="goal-progress">{{ goal.progress }}%</span>
          </div>
          <div class="progress-bar">
            <div class="progress-fill"></div>
          </div>
        </div>
      </div>
    </div>
    
    <button @click="$emit('edit-profile')" class="edit-button">
      ✏️ Редактировать профиль
    </button>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  user: {
    type: Object,
    required: true,
    default: () => ({
      name: 'Алишер',
      avatar: 'https://i.pravatar.cc/150?img=1',
      weight: 75,
      height: 180,
      age: 28
    })
  },
  userGoals: {
    type: Array,
    default: () => [
      { title: 'Похудеть на 5кг', progress: 60 },
      { title: 'Пробежать 5км', progress: 40 },
      { title: '100 отжиманий', progress: 75 }
    ]
  },
  isDark: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['edit-profile'])

const userProgress = computed(() => ({
  workouts: 24,
  streak: 7,
  level: 'Новичок'
}))
</script>

<style scoped>
.user-profile {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
  transition: all 0.3s ease;
}

.profile--dark {
  background: #2d3748;
  color: white;
}

.profile-header {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 24px;
}

.profile-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  border: 3px solid #667eea;
  object-fit: cover;
}

.profile-name {
  margin: 0 0 8px 0;
  font-size: 1.5rem;
  color: #2d3748;
}

.profile--dark .profile-name {
  color: white;
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
  font-size: 0.875rem;
  color: #718096;
}

.profile--dark .stat-label {
  color: #a0aec0;
}

.profile-details h3 {
  margin: 0 0 16px 0;
  color: #2d3748;
}

.profile--dark .profile-details h3 {
  color: white;
}

.goals-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 24px;
}

.goal-item {
  background: #f7fafc;
  padding: 12px;
  border-radius: 8px;
}

.profile--dark .goal-item {
  background: #4a5568;
}

.goal-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}

.goal-title {
  font-weight: 500;
}

.goal-progress {
  font-weight: bold;
  color: #48bb78;
}

.progress-bar {
  height: 6px;
  background: #e2e8f0;
  border-radius: 3px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #48bb78, #38a169);
  width: var(--progress);
  transition: width 0.5s ease;
}

.edit-button {
  width: 100%;
  padding: 12px;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.edit-button:hover {
  background: #5a67d8;
  transform: translateY(-2px);
}
</style>