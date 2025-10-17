<template>
  <div class="video-card" :class="{ 'video-card--dark': isDark }">
    <div class="video-thumbnail">
      <img :src="thumbnail" :alt="title" class="thumbnail-image" />
    </div>
    
    <div class="video-info">
      <h3 class="video-title">{{ title }}</h3>
      <p class="video-channel">{{ channel }}</p>
      <div class="video-stats">
        <span class="views">{{ formatViews(views) }} просмотров</span>
        <span class="likes">{{ formatViews(likes) }} лайков</span>
      </div>
      
      <button 
        @click="handleLike" 
        class="like-button"
        :class="{ 'liked': isLiked }"
      >
        ❤ {{ likeCount }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// Props
const props = defineProps({
  id: {
    type: Number,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  channel: {
    type: String,
    required: true
  },
  views: {
    type: Number,
    required: true
  },
  thumbnail: {
    type: String,
    required: true
  },
  likes: {
    type: Number,
    default: 0
  },
  isDark: {
    type: Boolean,
    default: false
  }
})

// Emits
const emit = defineEmits(['liked'])

// Локальное состояние
const likeCount = ref(props.likes)
const isLiked = ref(false)

// Обработчик лайка
const handleLike = () => {
  if (!isLiked.value) {
    likeCount.value += 1
    isLiked.value = true
    emit('liked', props.id)
  }
}

// Форматирование чисел
const formatViews = (num) => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M'
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K'
  }
  return num.toString()
}
</script>

<style scoped>
.video-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: all 0.3s ease;
  border: 1px solid #e0e0e0;
}

.video-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.video-card--dark {
  background: #2d3748;
  border-color: #4a5568;
  color: white;
}

.thumbnail-image {
  width: 100%;
  height: 160px;
  object-fit: cover;
  display: block;
}

.video-info {
  padding: 16px;
}

.video-title {
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 8px 0;
  line-height: 1.3;
  
  /* Multi-line truncation with vendor prefixes for better compatibility */
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  
  /* Standard property for future compatibility */
  line-clamp: 2;
  box-orient: vertical;
}

.video-channel {
  color: #606060;
  margin: 0 0 8px 0;
  font-size: 14px;
}

.video-card--dark .video-channel {
  color: #a0aec0;
}

.video-stats {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #909090;
  margin-bottom: 12px;
}

.video-card--dark .video-stats {
  color: #cbd5e0;
}

.like-button {
  background: #ff4444;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 20px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s ease;
  width: 100%;
}

.like-button:hover {
  background: #cc0000;
  transform: scale(1.05);
}

.like-button.liked {
  background: #dc2626;
  cursor: not-allowed;
}

.like-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>