<template>
  <div class="community-page">
    <div class="community-header">
      <h1>👥 Сообщество</h1>
      <p>Раздел в разработке...</p>
    </div>
    
    <div class="community-content">
      <div class="placeholder-card">
        <div class="placeholder-icon">🚧</div>
        <h3>Скоро здесь будет сообщество!</h3>
        <p>В этом разделе вы сможете:</p>
        <ul>
          <li>Делиться своими достижениями</li>
          <li>Общаться с другими пользователями</li>
          <li>Участвовать в челленджах</li>
          <li>Получать мотивацию от единомышленников</li>
        </ul>
        <router-link to="/" class="back-link">
          ← Вернуться на главную
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
// Simple community page
</script>

<style scoped>
.community-page {
  max-width: 800px;
  margin: 0 auto;
  padding: 24px;
}

.community-header {
  text-align: center;
  margin-bottom: 40px;
}

.community-header h1 {
  font-size: 2.5rem;
  color: #2d3748;
  margin-bottom: 8px;
}

.community-header p {
  font-size: 1.2rem;
  color: #718096;
}

.community-content {
  display: flex;
  justify-content: center;
}

.placeholder-card {
  background: white;
  border-radius: 16px;
  padding: 40px;
  text-align: center;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
  max-width: 500px;
  width: 100%;
}

.placeholder-icon {
  font-size: 4rem;
  margin-bottom: 24px;
}

.placeholder-card h3 {
  font-size: 1.8rem;
  color: #2d3748;
  margin-bottom: 16px;
}

.placeholder-card p {
  color: #4a5568;
  margin-bottom: 16px;
}

.placeholder-card ul {
  text-align: left;
  margin: 24px 0;
  padding-left: 20px;
  color: #718096;
}

.placeholder-card li {
  margin-bottom: 8px;
  line-height: 1.5;
}

.back-link {
  display: inline-block;
  margin-top: 24px;
  padding: 12px 24px;
  background: #667eea;
  color: white;
  text-decoration: none;
  border-radius: 8px;
  font-weight: 600;
  transition: all 0.2s ease;
}

.back-link:hover {
  background: #5a67d8;
  transform: translateY(-2px);
}

@media (max-width: 768px) {
  .community-page {
    padding: 16px;
  }
  
  .placeholder-card {
    padding: 24px;
  }
}
</style>