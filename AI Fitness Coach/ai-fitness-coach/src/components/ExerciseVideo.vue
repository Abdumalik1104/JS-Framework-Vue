<template>
  <div class="exercise-video">
    <div class="video-container" :class="{ 'loading': isLoading }">
      <video
        v-if="videoUrl && !isLoading"
        ref="videoPlayer"
        :src="videoUrl"
        :poster="thumbnail"
        controls
        @loadeddata="handleVideoLoaded"
        @error="handleVideoError"
        class="video-player"
      ></video>
      
      <div v-if="isLoading" class="video-loading">
        <div class="spinner"></div>
        <p>Загрузка видео...</p>
      </div>
      
      <div v-if="error" class="video-error">
        <p>😔 {{ error }}</p>
        <button @click="retryLoading" class="retry-button">
          Повторить
        </button>
      </div>
    </div>
    
    <div class="video-info">
      <h3 class="video-title">{{ title }}</h3>
      <p class="video-description">{{ description }}</p>
      
      <div class="video-stats">
        <span class="stat" v-if="duration">
          ⏱️ {{ formatDuration(duration) }}
        </span>
        <span class="stat" v-if="difficulty">
          💪 {{ difficulty }}
        </span>
        <span class="stat" v-if="calories">
          🔥 {{ calories }} ккал
        </span>
      </div>
      
      <div class="video-controls">
        <button 
          @click="togglePlay" 
          class="control-button"
          :disabled="isLoading || error"
        >
          {{ isPlaying ? '⏸️ Пауза' : '▶️ Воспроизвести' }}
        </button>
        <button 
          @click="$emit('favorite')" 
          class="control-button favorite"
          :class="{ 'favorited': isFavorited }"
        >
          {{ isFavorited ? '❤️ В избранном' : '🤍 В избранное' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'

const props = defineProps({
  videoUrl: {
    type: String,
    required: true
  },
  thumbnail: {
    type: String,
    default: ''
  },
  title: {
    type: String,
    default: 'Упражнение'
  },
  description: {
    type: String,
    default: ''
  },
  duration: {
    type: Number,
    default: 0
  },
  difficulty: {
    type: String,
    default: 'Средний'
  },
  calories: {
    type: Number,
    default: 0
  },
  autoplay: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['favorite', 'play', 'pause', 'ended'])

const videoPlayer = ref(null)
const isLoading = ref(true)
const error = ref('')
const isPlaying = ref(false)
const isFavorited = ref(false)

const handleVideoLoaded = () => {
  isLoading.value = false
  if (props.autoplay) {
    videoPlayer.value.play()
  }
}

const handleVideoError = () => {
  isLoading.value = false
  error.value = 'Не удалось загрузить видео'
}

const togglePlay = () => {
  if (!videoPlayer.value) return
  
  if (isPlaying.value) {
    videoPlayer.value.pause()
  } else {
    videoPlayer.value.play()
  }
}

const retryLoading = () => {
  error.value = ''
  isLoading.value = true
  if (videoPlayer.value) {
    videoPlayer.value.load()
  }
}

const formatDuration = (seconds) => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

// Отслеживание состояния воспроизведения
watch(isPlaying, (newValue) => {
  if (newValue) {
    emit('play')
  } else {
    emit('pause')
  }
})

// Навешиваем обработчики событий видео
onMounted(() => {
  if (videoPlayer.value) {
    videoPlayer.value.addEventListener('play', () => isPlaying.value = true)
    videoPlayer.value.addEventListener('pause', () => isPlaying.value = false)
    videoPlayer.value.addEventListener('ended', () => {
      isPlaying.value = false
      emit('ended')
    })
  }
})

onUnmounted(() => {
  if (videoPlayer.value) {
    videoPlayer.value.pause()
  }
})
</script>

<style scoped>
.exercise-video {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 16px rgba(0,0,0,0.1);
}

.video-container {
  position: relative;
  background: #000;
  aspect-ratio: 16/9;
}

.video-player {
  width: 100%;
  height: 100%;
  display: block;
}

.video-loading, .video-error {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
  background: rgba(0,0,0,0.7);
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.video-error p {
  margin-bottom: 16px;
  font-size: 1.1rem;
}

.retry-button {
  padding: 8px 16px;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

.video-info {
  padding: 20px;
}

.video-title {
  margin: 0 0 8px 0;
  font-size: 1.25rem;
  color: #2d3748;
}

.video-description {
  margin: 0 0 16px 0;
  color: #718096;
  line-height: 1.5;
}

.video-stats {
  display: flex;
  gap: 16px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.stat {
  background: #f7fafc;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.875rem;
  color: #4a5568;
}

.video-controls {
  display: flex;
  gap: 12px;
}

.control-button {
  flex: 1;
  padding: 12px;
  border: 2px solid #667eea;
  background: white;
  color: #667eea;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.control-button:hover:not(:disabled) {
  background: #667eea;
  color: white;
}

.control-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.control-button.favorite {
  border-color: #e53e3e;
  color: #e53e3e;
}

.control-button.favorite:hover {
  background: #e53e3e;
  color: white;
}

.control-button.favorited {
  background: #e53e3e;
  color: white;
}
</style>