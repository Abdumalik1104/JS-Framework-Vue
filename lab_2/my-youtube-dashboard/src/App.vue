<template>
  <div id="app" :class="{ 'dark-theme': isDarkTheme }">
    <header class="app-header">
      <div class="container">
        <h1 class="app-title">🎬 Mini YouTube Dashboard</h1>
        
        <div class="controls">
          <div class="search-container">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Поиск видео или канала..."
              class="search-input"
            />
            <span class="search-count">Найдено: {{ videosCount }}</span>
          </div>

          <div class="buttons-container">
            <button @click="toggleSort" class="control-button" :class="{ active: sortByViews }">
              {{ sortByViews ? '🔼 Сортировка по просмотрам' : '🔽 Обычная сортировка' }}
            </button>
            
            <button @click="toggleTheme" class="control-button theme-toggle">
              {{ isDarkTheme ? '☀️ Светлая тема' : '🌙 Тёмная тема' }}
            </button>
          </div>
        </div>

        <div class="stats">
          <span class="total-likes">❤ Всего лайков: {{ totalLikes }}</span>
        </div>
      </div>
    </header>

    <main class="main-content">
      <div class="container">
        <!-- Состояние загрузки -->
        <div v-if="isLoading" class="loading-state">
          <div class="spinner"></div>
          <p>Загрузка видео...</p>
        </div>

        <!-- Сообщение если видео не найдены -->
        <div v-else-if="videosCount === 0" class="empty-state">
          <p>📺 No videos found.</p>
          <p v-if="searchQuery" class="empty-hint">
            Попробуйте изменить поисковый запрос
          </p>
        </div>

        <!-- Список видео -->
        <div v-else class="videos-grid">
          <VideoCard
            v-for="video in videos"
            :key="video.id"
            :id="video.id"
            :title="video.title"
            :channel="video.channel"
            :views="video.views"
            :thumbnail="video.thumbnail"
            :likes="video.likes"
            :is-dark="isDarkTheme"
            @liked="handleVideoLiked"
          />
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { useVideos } from './composables/useVideos'
import VideoCard from './components/VideoCard.vue'

// Используем композицию
const {
  videos,
  totalLikes,
  searchQuery,
  isLoading,
  isDarkTheme,
  sortByViews,
  videosCount,
  handleVideoLiked,
  toggleTheme,
  toggleSort
} = useVideos()
</script>

<style>
/* CSS переменные для тем */
:root {
  --bg-color: #ffffff;
  --text-color: #1a1a1a;
  --border-color: #e0e0e0;
  --header-bg: #f8f9fa;
  --card-bg: #ffffff;
}

[data-theme="dark"] {
  --bg-color: #1a1a1a;
  --text-color: #ffffff;
  --border-color: #333333;
  --header-bg: #2d3748;
  --card-bg: #2d3748;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background-color: var(--bg-color);
  color: var(--text-color);
  transition: all 0.3s ease;
}

#app {
  min-height: 100vh;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

/* Header */
.app-header {
  background: var(--header-bg);
  border-bottom: 1px solid var(--border-color);
  padding: 20px 0;
  position: sticky;
  top: 0;
  z-index: 100;
  backdrop-filter: blur(10px);
}

.app-title {
  text-align: center;
  margin-bottom: 24px;
  font-size: 2rem;
  color: #ff0000;
}

.controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 16px;
}

.search-container {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
  max-width: 400px;
}

.search-input {
  flex: 1;
  padding: 10px 16px;
  border: 2px solid #ddd;
  border-radius: 24px;
  font-size: 14px;
  transition: all 0.3s ease;
  background: var(--card-bg);
  color: var(--text-color);
}

.search-input:focus {
  outline: none;
  border-color: #ff0000;
  box-shadow: 0 0 0 3px rgba(255, 0, 0, 0.1);
}

.search-count {
  font-size: 14px;
  color: #666;
  white-space: nowrap;
}

.buttons-container {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.control-button {
  padding: 8px 16px;
  border: 2px solid #ddd;
  border-radius: 20px;
  background: var(--card-bg);
  color: var(--text-color);
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s ease;
}

.control-button:hover {
  border-color: #ff0000;
  transform: translateY(-1px);
}

.control-button.active {
  background: #ff0000;
  color: white;
  border-color: #ff0000;
}

.stats {
  text-align: center;
}

.total-likes {
  font-size: 16px;
  font-weight: 600;
  color: #ff4444;
}

/* Main content */
.main-content {
  padding: 32px 0;
}

/* Loading state */
.loading-state {
  text-align: center;
  padding: 60px 20px;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #ff0000;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 16px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Empty state */
.empty-state {
  text-align: center;
  padding: 60px 20px;
  font-size: 18px;
  color: #666;
}

.empty-hint {
  font-size: 14px;
  margin-top: 8px;
  color: #999;
}

/* Videos grid */
.videos-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
  padding: 20px 0;
}

/* Адаптивность */
@media (max-width: 768px) {
  .controls {
    flex-direction: column;
    align-items: stretch;
  }
  
  .search-container {
    max-width: none;
  }
  
  .buttons-container {
    justify-content: center;
  }
  
  .videos-grid {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 16px;
  }
  
  .app-title {
    font-size: 1.5rem;
  }
}

@media (max-width: 480px) {
  .videos-grid {
    grid-template-columns: 1fr;
  }
  
  .container {
    padding: 0 12px;
  }
}
</style>