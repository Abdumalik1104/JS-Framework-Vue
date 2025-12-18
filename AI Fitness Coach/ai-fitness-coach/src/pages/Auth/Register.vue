<template>
  <div class="register-page">
    <div class="register-container">
      <div class="form-section">
        <div class="form-container">
          <h2 class="form-title">Регистрация</h2>
          <p class="form-subtitle">Создайте новый аккаунт</p>
          
          <form @submit.prevent="handleRegister" class="register-form" autocomplete="on">
            <div class="form-group">
              <label for="register-name" class="required">Имя</label>
              <input
                id="register-name"
                v-model="form.name"
                type="text"
                name="name"
                autocomplete="name"
                placeholder="Ваше имя"
                required
              >
            </div>
            
            <div class="form-group">
              <label for="register-email" class="required">Email</label>
              <input
                id="register-email"
                v-model="form.email"
                type="email"
                name="email"
                autocomplete="email"
                placeholder="your@email.com"
                required
              >
            </div>
            
            <div class="form-group">
              <label for="register-password" class="required">Пароль</label>
              <div class="password-input">
                <input
                  id="register-password"
                  v-model="form.password"
                  :type="showPassword ? 'text' : 'password'"
                  name="password"
                  autocomplete="new-password"
                  placeholder="Не менее 6 символов"
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
            </div>
            
            <div class="form-group">
              <label for="register-confirm" class="required">Подтверждение пароля</label>
              <input
                id="register-confirm"
                v-model="form.confirmPassword"
                type="password"
                name="confirm-password"
                autocomplete="new-password"
                placeholder="Повторите пароль"
                required
              >
            </div>
            
            <button type="submit" class="submit-button" :disabled="isLoading">
              {{ isLoading ? 'Регистрация...' : 'Зарегистрироваться' }}
            </button>
            
            <div class="form-links">
              <router-link to="/login" class="link">
                ← Уже есть аккаунт? Войти
              </router-link>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const form = reactive({
  name: '',
  email: '',
  password: '',
  confirmPassword: ''
})

const showPassword = ref(false)
const isLoading = ref(false)

const togglePassword = () => {
  showPassword.value = !showPassword.value
}

const handleRegister = async () => {
  if (form.password !== form.confirmPassword) {
    alert('Пароли не совпадают')
    return
  }
  
  if (form.password.length < 6) {
    alert('Пароль должен быть не менее 6 символов')
    return
  }
  
  isLoading.value = true
  
  try {
    // Имитация регистрации
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // Сохраняем пользователя
    localStorage.setItem('isAuthenticated', 'true')
    localStorage.setItem('userName', form.name)
    localStorage.setItem('userEmail', form.email)
    
    alert('✅ Регистрация успешна!')
    router.push('/')
  } catch (error) {
    alert('Ошибка при регистрации')
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.register-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);
  padding: 20px;
}

.register-container {
  max-width: 500px;
  width: 100%;
  background: white;
  border-radius: 24px;
  box-shadow: 0 20px 60px rgba(0,0,0,0.3);
  overflow: hidden;
}

.form-section {
  padding: 60px 40px;
}

.form-container {
  width: 100%;
}

.form-title {
  font-size: 2rem;
  color: #2d3748;
  margin: 0 0 8px 0;
  font-weight: 700;
  text-align: center;
}

.form-subtitle {
  color: #718096;
  margin: 0 0 40px 0;
  font-size: 1rem;
  text-align: center;
}

.register-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
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
  border-color: #48bb78;
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

.submit-button {
  padding: 16px;
  background: #48bb78;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-top: 10px;
}

.submit-button:hover:not(:disabled) {
  background: #38a169;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(72, 187, 120, 0.3);
}

.submit-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.form-links {
  text-align: center;
  margin-top: 20px;
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

@media (max-width: 768px) {
  .register-page {
    padding: 10px;
  }
  
  .form-section {
    padding: 40px 24px;
  }
  
  .form-title {
    font-size: 1.75rem;
  }
}
</style>