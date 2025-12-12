<template>
  <header class="app-header">
    <div class="container">
      <div class="logo">
        <h1>🤖 AI FITNESS COACH</h1>
        <p>Персональный ИИ-тренер онлайн</p>
      </div>
      <nav class="nav">
        <router-link to="/" class="nav-link">Главная</router-link>
        <router-link to="/workouts" class="nav-link">Тренировки</router-link>
        <router-link to="/nutrition" class="nav-link">Питание</router-link>
      </nav>
    </div>
  </header>
</template>

<script setup>
// Компонент не требует логики
</script>

<style scoped>
.app-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1rem 0;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo h1 {
  margin: 0;
  font-size: 1.5rem;
}

.logo p {
  margin: 0;
  opacity: 0.9;
  font-size: 0.9rem;
}

.nav {
  display: flex;
  gap: 2rem;
}

.nav-link {
  color: white;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  transition: background 0.3s ease;
  font-weight: 500;
}

.nav-link:hover,
.nav-link.router-link-active {
  background: rgba(255,255,255,0.2);
}

@media (max-width: 768px) {
  .container {
    flex-direction: column;
    gap: 1rem;
  }
  
  .nav {
    gap: 1rem;
  }
}
</style>