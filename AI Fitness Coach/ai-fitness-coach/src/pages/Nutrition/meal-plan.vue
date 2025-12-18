<template>
  <div class="meal-plan-page">
    <h1>🍽️ План питания</h1>
    <p>Раздел в разработке...</p>
    <router-link to="/nutrition" class="back-link">
      ← Назад к питанию
    </router-link>
  </div>
</template>

<script setup>
// Простая заглушка
</script>

<style scoped>
.meal-plan-page {
  padding: 40px;
  text-align: center;
}

.meal-plan-page h1 {
  font-size: 2.5rem;
  color: #2d3748;
  margin-bottom: 16px;
}

.meal-plan-page p {
  font-size: 1.2rem;
  color: #718096;
  margin-bottom: 24px;
}

.back-link {
  color: #667eea;
  text-decoration: none;
  font-weight: 500;
}

.back-link:hover {
  text-decoration: underline;
}
</style>