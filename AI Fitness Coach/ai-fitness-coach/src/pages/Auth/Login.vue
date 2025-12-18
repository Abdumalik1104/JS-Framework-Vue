<template>
  <div class="login-page">
    <div class="login-container">
      <!-- Left: Branding -->
      <div class="brand-section">
        <div class="brand-content">
          <h1 class="brand-title">🤖 AI Fitness Coach</h1>
          <p class="brand-subtitle">Персональный ИИ-тренер онлайн</p>
          <div class="brand-features">
            <div class="feature">
              <span class="feature-icon">💪</span>
              <span class="feature-text">Персонализированные тренировки</span>
            </div>
            <div class="feature">
              <span class="feature-icon">🥗</span>
              <span class="feature-text">Планы питания от ИИ</span>
            </div>
            <div class="feature">
              <span class="feature-icon">📊</span>
              <span class="feature-text">Детальная аналитика прогресса</span>
            </div>
            <div class="feature">
              <span class="feature-icon">🎯</span>
              <span class="feature-text">Достижение целей с мотивацией</span>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Right: Login Form -->
      <div class="form-section">
        <div class="form-container">
          <h2 class="form-title">Вход в аккаунт</h2>
          <p class="form-subtitle">Введите ваши данные для входа</p>
          
          <form @submit.prevent="handleLogin" class="login-form" autocomplete="on">
            <!-- Email -->
            <div class="form-group">
              <label for="email" class="required">Email адрес</label>
              <input
                id="email"
                v-model="form.email"
                type="email"
                name="email"
                autocomplete="email"
                placeholder="your@email.com"
                :class="{ 'error': errors.email }"
                @blur="validateField('email')"
                required
              >
              <span v-if="errors.email" class="error-message">{{ errors.email }}</span>
            </div>
            
            <!-- Password -->
            <div class="form-group">
              <label for="password" class="required">Пароль</label>
              <div class="password-input">
                <input
                  id="password"
                  v-model="form.password"
                  :type="showPassword ? 'text' : 'password'"
                  name="password"
                  autocomplete="current-password"
                  placeholder="Введите пароль"
                  :class="{ 'error': errors.password }"
                  @blur="validateField('password')"
                  required
                >
                <button
                  type="button"
                  @click="togglePassword"
                  class="password-toggle"
                  aria-label="Показать/скрыть пароль"
                >
                  {{ showPassword ? '🙈' : '👁️' }}
                </button>
              </div>
              <span v-if="errors.password" class="error-message">{{ errors.password }}</span>
            </div>
            
            <!-- Remember Me -->
            <div class="remember-me">
              <input
                id="remember"
                v-model="form.remember"
                type="checkbox"
                name="remember"
              >
              <label for="remember">Запомнить меня</label>
            </div>
            
            <!-- Submit Button -->
            <button 
              type="submit" 
              class="submit-button"
              :disabled="isLoading"
              aria-label="Войти в систему"
            >
              <span v-if="isLoading" class="button-loading">
                <div class="spinner"></div>
                Вход...
              </span>
              <span v-else>Войти</span>
            </button>
            
            <!-- Divider -->
            <div class="divider">
              <span>или</span>
            </div>
            
            <!-- Demo Login -->
            <button 
              type="button" 
              @click="useDemoAccount"
              class="demo-button"
              aria-label="Войти с демо-аккаунтом"
            >
              🔮 Войти как демо-пользователь
            </button>
            
            <!-- Links -->
            <div class="form-links">
              <router-link to="/register" class="link">
                Нет аккаунта? Зарегистрироваться
              </router-link>
              <router-link to="/forgot-password" class="link">
                Забыли пароль?
              </router-link>
            </div>
          </form>
          
          <!-- Error Message -->
          <div v-if="error" class="error-message-global">
            <p>{{ error }}</p>
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

// Form state
const form = reactive({
  email: '',
  password: '',
  remember: false
})

// UI state
const showPassword = ref(false)
const isLoading = ref(false)
const error = ref('')

// Validation errors
const errors = reactive({})

// Validation rules
const rules = {
  email: { required: true, email: true },
  password: { required: true, minLength: 6 }
}

// Methods
const validateField = (fieldName) => {
  const fieldRules = rules[fieldName]
  if (!fieldRules) return true
  
  const value = form[fieldName]
  
  // Required
  if (fieldRules.required && !value.trim()) {
    errors[fieldName] = 'Это поле обязательно'
    return false
  }
  
  // Email validation
  if (fieldRules.email && !isValidEmail(value)) {
    errors[fieldName] = 'Введите корректный email'
    return false
  }
  
  // Min length
  if (fieldRules.minLength && value.length < fieldRules.minLength) {
    errors[fieldName] = `Минимальная длина: ${fieldRules.minLength} символов`
    return false
  }
  
  delete errors[fieldName]
  return true
}

const validateForm = () => {
  let isValid = true
  
  Object.keys(rules).forEach(field => {
    if (!validateField(field)) {
      isValid = false
    }
  })
  
  return isValid
}

const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

const togglePassword = () => {
  showPassword.value = !showPassword.value
}

const handleLogin = async () => {
  if (!validateForm()) return
  
  isLoading.value = true
  error.value = ''
  
  try {
    const result = await userStore.login({
      email: form.email,
      password: form.password
    })
    
    if (result.success) {
      // Save remember me
      if (form.remember) {
        localStorage.setItem('rememberedEmail', form.email)
      }
      
      // Сохраняем токен аутентификации
      localStorage.setItem('isAuthenticated', 'true')
      
      // Navigate to dashboard
      router.push('/')
    } else {
      error.value = result.error || 'Ошибка входа. Проверьте email и пароль.'
    }
  } catch (err) {
    error.value = 'Произошла ошибка при входе'
    console.error(err)
  } finally {
    isLoading.value = false
  }
}

const useDemoAccount = () => {
  form.email = 'demo@fitnessai.com'
  form.password = 'demopassword123'
  form.remember = true
  
  // Clear errors
  Object.keys(errors).forEach(key => delete errors[key])
}

// Load remembered email
onMounted(() => {
  const rememberedEmail = localStorage.getItem('rememberedEmail')
  if (rememberedEmail) {
    form.email = rememberedEmail
    form.remember = true
  }
})
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.login-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  max-width: 1200px;
  width: 100%;
  background: white;
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0,0,0,0.3);
}

@media (max-width: 1024px) {
  .login-container {
    grid-template-columns: 1fr;
    max-width: 500px;
  }
}

.brand-section {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 60px 40px;
  display: flex;
  align-items: center;
}

.brand-content {
  width: 100%;
}

.brand-title {
  font-size: 2.5rem;
  margin: 0 0 16px 0;
  font-weight: 700;
}

.brand-subtitle {
  font-size: 1.2rem;
  margin: 0 0 40px 0;
  opacity: 0.9;
}

.brand-features {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.feature {
  display: flex;
  align-items: center;
  gap: 16px;
}

.feature-icon {
  font-size: 1.5rem;
  width: 40px;
  height: 40px;
  background: rgba(255,255,255,0.1);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.feature-text {
  font-size: 1rem;
  font-weight: 500;
}

.form-section {
  padding: 60px 40px;
  display: flex;
  align-items: center;
}

.form-container {
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
}

.form-title {
  font-size: 2rem;
  color: #2d3748;
  margin: 0 0 8px 0;
  font-weight: 700;
}

.form-subtitle {
  color: #718096;
  margin: 0 0 40px 0;
  font-size: 1rem;
}

.login-form {
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

.form-group input {
  padding: 14px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.2s ease;
}

.form-group input:focus {
  outline: none;
  border-color: #667eea;
}

.form-group input.error {
  border-color: #e53e3e;
}

.error-message {
  color: #e53e3e;
  font-size: 0.875rem;
  margin-top: 4px;
}

.password-input {
  position: relative;
}

.password-input input {
  width: 100%;
  padding-right: 50px;
}

.password-toggle {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #718096;
  background: transparent;
  border-radius: 50%;
}

.password-toggle:hover {
  background: rgba(0,0,0,0.05);
}

.remember-me {
  display: flex;
  align-items: center;
  gap: 8px;
}

.remember-me input {
  width: 18px;
  height: 18px;
  cursor: pointer;
}

.remember-me label {
  color: #4a5568;
  cursor: pointer;
  font-size: 0.95rem;
}

.submit-button {
  padding: 16px;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.submit-button:hover:not(:disabled) {
  background: #5a67d8;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.3);
}

.submit-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.button-loading {
  display: flex;
  align-items: center;
  gap: 10px;
}

.spinner {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255,255,255,0.3);
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.divider {
  display: flex;
  align-items: center;
  text-align: center;
  color: #718096;
  font-size: 0.9rem;
}

.divider::before,
.divider::after {
  content: '';
  flex: 1;
  border-bottom: 1px solid #e2e8f0;
}

.divider span {
  padding: 0 16px;
}

.demo-button {
  padding: 14px;
  background: #9f7aea;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.demo-button:hover {
  background: #805ad5;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(159, 122, 234, 0.3);
}

.form-links {
  display: flex;
  flex-direction: column;
  gap: 12px;
  text-align: center;
  margin-top: 8px;
}

.link {
  color: #667eea;
  text-decoration: none;
  font-size: 0.95rem;
  transition: color 0.2s ease;
}

.link:hover {
  color: #5a67d8;
  text-decoration: underline;
}

.error-message-global {
  margin-top: 20px;
  padding: 16px;
  background: #fed7d7;
  color: #c53030;
  border-radius: 8px;
  text-align: center;
  font-size: 0.95rem;
}

@media (max-width: 768px) {
  .login-page {
    padding: 10px;
  }
  
  .brand-section,
  .form-section {
    padding: 40px 24px;
  }
  
  .brand-title {
    font-size: 2rem;
  }
  
  .form-title {
    font-size: 1.75rem;
  }
}
</style>