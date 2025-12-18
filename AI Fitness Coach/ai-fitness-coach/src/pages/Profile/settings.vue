<template>
  <div class="settings-page">
    <div class="settings-header">
      <router-link to="/profile" class="back-link">
        ← Назад к профилю
      </router-link>
      <h1>⚙️ Настройки</h1>
      <p>Управление вашими настройками и аккаунтом</p>
    </div>
    
    <div class="settings-container">
      <!-- Настройки профиля -->
      <div class="settings-section">
        <h2>👤 Настройки профиля</h2>
        
        <form @submit.prevent="updateProfile" class="settings-form">
          <div class="form-row">
            <div class="form-group">
              <label for="name">Имя</label>
              <input
                id="name"
                v-model="profileForm.name"
                type="text"
                placeholder="Ваше имя"
              >
            </div>
            
            <div class="form-group">
              <label for="email">Email</label>
              <input
                id="email"
                v-model="profileForm.email"
                type="email"
                placeholder="your@email.com"
              >
            </div>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label for="weight">Вес (кг)</label>
              <input
                id="weight"
                v-model.number="profileForm.weight"
                type="number"
                min="30"
                max="200"
              >
            </div>
            
            <div class="form-group">
              <label for="height">Рост (см)</label>
              <input
                id="height"
                v-model.number="profileForm.height"
                type="number"
                min="100"
                max="250"
              >
            </div>
            
            <div class="form-group">
              <label for="age">Возраст</label>
              <input
                id="age"
                v-model.number="profileForm.age"
                type="number"
                min="12"
                max="100"
              >
            </div>
          </div>
          
          <div class="form-group">
            <label>Уровень подготовки</label>
            <div class="radio-group">
              <label>
                <input 
                  type="radio" 
                  value="beginner" 
                  v-model="profileForm.fitnessLevel"
                >
                Начинающий
              </label>
              <label>
                <input 
                  type="radio" 
                  value="intermediate" 
                  v-model="profileForm.fitnessLevel"
                >
                Средний
              </label>
              <label>
                <input 
                  type="radio" 
                  value="advanced" 
                  v-model="profileForm.fitnessLevel"
                >
                Продвинутый
              </label>
            </div>
          </div>
          
          <div class="form-group">
            <label>Цели</label>
            <div class="checkbox-group">
              <label>
                <input 
                  type="checkbox" 
                  value="weight_loss" 
                  v-model="profileForm.goals"
                >
                Похудение
              </label>
              <label>
                <input 
                  type="checkbox" 
                  value="muscle_gain" 
                  v-model="profileForm.goals"
                >
                Набор массы
              </label>
              <label>
                <input 
                  type="checkbox" 
                  value="endurance" 
                  v-model="profileForm.goals"
                >
                Выносливость
              </label>
              <label>
                <input 
                  type="checkbox" 
                  value="flexibility" 
                  v-model="profileForm.goals"
                >
                Гибкость
              </label>
            </div>
          </div>
          
          <button type="submit" class="save-button">
            💾 Сохранить изменения
          </button>
        </form>
      </div>
      
      <!-- Настройки приложения -->
      <div class="settings-section">
        <h2>🎨 Настройки приложения</h2>
        
        <div class="app-settings">
          <div class="setting-item">
            <div class="setting-info">
              <h3>🌙 Тёмная тема</h3>
              <p>Включить тёмный режим</p>
            </div>
            <div class="setting-control">
              <label class="toggle-switch">
                <input 
                  type="checkbox" 
                  v-model="appSettings.darkMode"
                  @change="toggleDarkMode"
                >
                <span class="slider"></span>
              </label>
            </div>
          </div>
          
          <div class="setting-item">
            <div class="setting-info">
              <h3>🔔 Уведомления</h3>
              <p>Получать напоминания о тренировках</p>
            </div>
            <div class="setting-control">
              <label class="toggle-switch">
                <input type="checkbox" v-model="appSettings.notifications">
                <span class="slider"></span>
              </label>
            </div>
          </div>
          
          <div class="setting-item">
            <div class="setting-info">
              <h3>📊 Аналитика</h3>
              <p>Отправлять анонимные данные для улучшения приложения</p>
            </div>
            <div class="setting-control">
              <label class="toggle-switch">
                <input type="checkbox" v-model="appSettings.analytics">
                <span class="slider"></span>
              </label>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Опасная зона -->
      <div class="settings-section danger-zone">
        <h2>⚠️ Опасная зона</h2>
        
        <div class="danger-actions">
          <div class="danger-item">
            <div class="danger-info">
              <h3>🗑️ Удалить все данные</h3>
              <p>Безвозвратно удалит все ваши тренировки и данные</p>
            </div>
            <button @click="confirmDeleteData" class="danger-button">
              Удалить данные
            </button>
          </div>
          
          <div class="danger-item">
            <div class="danger-info">
              <h3>🚪 Выйти из аккаунта</h3>
              <p>Завершит текущую сессию</p>
            </div>
            <button @click="logout" class="danger-button logout">
              Выйти
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/useUserStore'

const router = useRouter()
const userStore = useUserStore()

// Форма профиля
const profileForm = reactive({
  name: '',
  email: '',
  weight: 0,
  height: 0,
  age: 0,
  fitnessLevel: 'beginner',
  goals: []
})

// Настройки приложения
const appSettings = reactive({
  darkMode: false,
  notifications: true,
  analytics: true
})

// Методы
const updateProfile = async () => {
  try {
    const result = await userStore.updateProfile(profileForm)
    
    if (result.success) {
      alert('✅ Профиль успешно обновлен!')
    } else {
      alert(`❌ Ошибка: ${result.error}`)
    }
  } catch (error) {
    alert('Произошла ошибка при обновлении профиля')
    console.error(error)
  }
}

const toggleDarkMode = () => {
  if (appSettings.darkMode) {
    document.documentElement.classList.add('dark-mode')
    localStorage.setItem('theme', 'dark')
  } else {
    document.documentElement.classList.remove('dark-mode')
    localStorage.setItem('theme', 'light')
  }
}

const confirmDeleteData = () => {
  if (confirm('Вы уверены? Это действие нельзя отменить!')) {
    // Очистка данных
    localStorage.clear()
    alert('Все данные удалены')
    router.push('/')
  }
}

const logout = () => {
  if (confirm('Выйти из аккаунта?')) {
    userStore.isAuthenticated = false
    localStorage.removeItem('isAuthenticated')
    router.push('/login')
  }
}

// Инициализация
onMounted(() => {
  // Загрузка данных пользователя
  Object.assign(profileForm, userStore.user)
  
  // Загрузка настроек
  const savedSettings = localStorage.getItem('appSettings')
  if (savedSettings) {
    Object.assign(appSettings, JSON.parse(savedSettings))
  }
  
  // Загрузка темы
  const theme = localStorage.getItem('theme')
  if (theme === 'dark') {
    appSettings.darkMode = true
    document.documentElement.classList.add('dark-mode')
  }
  
  // Автосохранение настроек
  setInterval(() => {
    localStorage.setItem('appSettings', JSON.stringify(appSettings))
  }, 5000)
})
</script>

<style scoped>
.settings-page {
  max-width: 800px;
  margin: 0 auto;
  padding: 24px;
}

.settings-header {
  margin-bottom: 40px;
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

.settings-header h1 {
  font-size: 2.5rem;
  color: #2d3748;
  margin: 0 0 8px 0;
}

.settings-header p {
  font-size: 1.2rem;
  color: #718096;
  margin: 0;
}

.settings-container {
  display: flex;
  flex-direction: column;
  gap: 40px;
}

.settings-section {
  background: white;
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
}

.settings-section h2 {
  margin: 0 0 24px 0;
  color: #2d3748;
  font-size: 1.75rem;
}

.settings-form {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.form-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
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

.form-group input {
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

.radio-group,
.checkbox-group {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

.radio-group label,
.checkbox-group label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-weight: normal;
}

.save-button {
  align-self: flex-start;
  padding: 14px 28px;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.save-button:hover {
  background: #5a67d8;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.3);
}

.app-settings {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.setting-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  transition: all 0.3s ease;
}

.setting-item:hover {
  border-color: #cbd5e0;
}

.setting-info h3 {
  margin: 0 0 4px 0;
  color: #2d3748;
  font-size: 1.1rem;
}

.setting-info p {
  margin: 0;
  color: #718096;
  font-size: 0.9rem;
}

/* Toggle Switch */
.toggle-switch {
  position: relative;
  display: inline-block;
  width: 60px;
  height: 34px;
}

.toggle-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #e2e8f0;
  transition: .4s;
  border-radius: 34px;
}

.slider:before {
  position: absolute;
  content: "";
  height: 26px;
  width: 26px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  transition: .4s;
  border-radius: 50%;
}

input:checked + .slider {
  background-color: #667eea;
}

input:checked + .slider:before {
  transform: translateX(26px);
}

/* Danger Zone */
.danger-zone {
  border: 2px solid #fed7d7;
  background: #fff5f5;
}

.danger-zone h2 {
  color: #c53030;
}

.danger-actions {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.danger-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background: white;
  border: 2px solid #fed7d7;
  border-radius: 12px;
}

.danger-info h3 {
  margin: 0 0 4px 0;
  color: #2d3748;
  font-size: 1.1rem;
}

.danger-info p {
  margin: 0;
  color: #718096;
  font-size: 0.9rem;
}

.danger-button {
  padding: 10px 20px;
  background: #fed7d7;
  color: #c53030;
  border: 2px solid #fed7d7;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.danger-button:hover {
  background: #feb2b2;
  border-color: #feb2b2;
}

.danger-button.logout {
  background: #667eea;
  color: white;
  border-color: #667eea;
}

.danger-button.logout:hover {
  background: #5a67d8;
  border-color: #5a67d8;
}

@media (max-width: 768px) {
  .settings-page {
    padding: 16px;
  }
  
  .settings-section {
    padding: 24px;
  }
  
  .form-row {
    grid-template-columns: 1fr;
  }
  
  .setting-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
  
  .danger-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
  
  .danger-button {
    align-self: stretch;
    text-align: center;
  }
}
</style>