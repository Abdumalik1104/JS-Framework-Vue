import { ref, reactive, computed, watch, onMounted } from 'vue'

export function useVideos() {
  // Состояние приложения
  const videos = ref([])
  const totalLikes = ref(0)
  const searchQuery = ref('')
  const isLoading = ref(false)
  const isDarkTheme = ref(false)
  const sortByViews = ref(false)

  // Моковые данные видео
  const mockVideos = [
    {
      id: 1,
      title: 'Vue 3 Tutorial for Beginners',
      channel: 'Vue Master',
      views: 150000,
      thumbnail: 'https://picsum.photos/300/169?random=1',
      likes: 1200
    },
    {
      id: 2,
      title: 'JavaScript Framework Comparison',
      channel: 'Web Dev Simplified',
      views: 89000,
      thumbnail: 'https://picsum.photos/300/169?random=2',
      likes: 850
    },
    {
      id: 3,
      title: 'Building Modern Web Apps',
      channel: 'Tech With Tim',
      views: 210000,
      thumbnail: 'https://picsum.photos/300/169?random=3',
      likes: 2100
    },
    {
      id: 4,
      title: 'CSS Grid vs Flexbox',
      channel: 'Web Dev Simplified',
      views: 75000,
      thumbnail: 'https://picsum.photos/300/169?random=4',
      likes: 600
    },
    {
      id: 5,
      title: 'TypeScript for Vue Developers',
      channel: 'Vue Master',
      views: 95000,
      thumbnail: 'https://picsum.photos/300/169?random=5',
      likes: 1100
    }
  ]

  // Вычисляемое свойство для фильтрации видео
  const filteredVideos = computed(() => {
    let filtered = videos.value.filter(video => 
      video.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      video.channel.toLowerCase().includes(searchQuery.value.toLowerCase())
    )

    // Сортировка по просмотрам (опционально)
    if (sortByViews.value) {
      filtered = filtered.sort((a, b) => b.views - a.views)
    }

    return filtered
  })

  // Счетчик найденных видео
  const videosCount = computed(() => filteredVideos.value.length)

  // Watcher для отслеживания изменений поискового запроса
  watch(searchQuery, (newQuery) => {
    console.log(`Search query changed to: "${newQuery}"`)
  })

  // Обработчик лайков
  const handleVideoLiked = (videoId) => {
    totalLikes.value += 1
    const video = videos.value.find(v => v.id === videoId)
    if (video) {
      video.likes += 1
    }
  }

  // Переключение темы
  const toggleTheme = () => {
    isDarkTheme.value = !isDarkTheme.value
    document.documentElement.setAttribute('data-theme', isDarkTheme.value ? 'dark' : 'light')
  }

  // Переключение сортировки
  const toggleSort = () => {
    sortByViews.value = !sortByViews.value
  }

  // Загрузка данных (симуляция API)
  const fetchVideos = () => {
    isLoading.value = true
    setTimeout(() => {
      videos.value = mockVideos
      isLoading.value = false
    }, 1500)
  }

  // Жизненный цикл
  onMounted(() => {
    fetchVideos()
  })

  return {
    videos: filteredVideos,
    totalLikes,
    searchQuery,
    isLoading,
    isDarkTheme,
    sortByViews,
    videosCount,
    handleVideoLiked,
    toggleTheme,
    toggleSort
  }
}