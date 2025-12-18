<template>
  <div class="not-found">
    <div class="error-code">404</div>
    <h1 class="error-title">Страница не найдена</h1>
    <p class="error-message">
      Кажется, вы потерялись в мире фитнеса! Страница, которую вы ищете, не существует.
    </p>
    <div class="error-actions">
      <router-link to="/" class="action-button primary">
        🏠 На главную
      </router-link>
      <router-link to="/workouts" class="action-button secondary">
        💪 К тренировкам
      </router-link>
      <button @click="goBack" class="action-button">
        ↩️ Назад
      </button>
    </div>
    <div class="error-image">
      <div class="fitness-emoji">🏋️‍♂️🤸‍♀️🧘‍♂️🏃‍♂️</div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const goBack = () => {
  router.go(-1)
}
</script>

<style scoped>
.not-found {
  min-height: 80vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  text-align: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.error-code {
  font-size: 8rem;
  font-weight: bold;
  line-height: 1;
  margin-bottom: 20px;
  animation: bounce 2s infinite;
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-20px); }
}

.error-title {
  font-size: 2.5rem;
  margin: 0 0 20px 0;
}

.error-message {
  font-size: 1.2rem;
  max-width: 600px;
  margin: 0 auto 40px;
  line-height: 1.6;
  opacity: 0.9;
}

.error-actions {
  display: flex;
  gap: 16px;
  margin-bottom: 40px;
  flex-wrap: wrap;
  justify-content: center;
}

.action-button {
  padding: 12px 24px;
  border: 2px solid white;
  background: transparent;
  color: white;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  text-decoration: none;
  transition: all 0.3s ease;
}

.action-button:hover {
  background: white;
  color: #667eea;
  transform: translateY(-2px);
}

.action-button.primary {
  background: white;
  color: #667eea;
}

.action-button.primary:hover {
  background: rgba(255,255,255,0.9);
}

.action-button.secondary {
  border-color: rgba(255,255,255,0.5);
}

.error-image {
  margin-top: 40px;
}

.fitness-emoji {
  font-size: 3rem;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
}

@media (max-width: 768px) {
  .error-code {
    font-size: 6rem;
  }
  
  .error-title {
    font-size: 2rem;
  }
  
  .error-actions {
    flex-direction: column;
    width: 100%;
    max-width: 300px;
  }
  
  .action-button {
    width: 100%;
  }
}
</style>