<template>
  <div class="stats-widget">
    <div class="stats-header">
      <h3>📊 Статистика</h3>
      <select v-model="selectedPeriod" @change="updateStats" class="period-select">
        <option value="week">За неделю</option>
        <option value="month">За месяц</option>
        <option value="year">За год</option>
      </select>
    </div>
    
    <div class="stats-grid">
      <div class="stat-card" v-for="stat in stats" :key="stat.id">
        <div class="stat-icon" :style="{ color: stat.color }">
          {{ stat.icon }}
        </div>
        <div class="stat-info">
          <div class="stat-value">{{ stat.value }}</div>
          <div class="stat-label">{{ stat.label }}</div>
          <div 
            class="stat-change" 
            :class="{ 'positive': stat.change >= 0, 'negative': stat.change < 0 }"
          >
            {{ formatChange(stat.change) }}
          </div>
        </div>
      </div>
    </div>
    
    <div class="chart-container" v-if="showChart">
      <canvas ref="chartCanvas"></canvas>
    </div>
    
    <div class="stats-actions">
      <button @click="toggleChart" class="chart-button">
        {{ showChart ? 'Скрыть график' : 'Показать график' }}
      </button>
      <button @click="exportStats" class="export-button">
        📥 Экспорт
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onUnmounted, watch } from 'vue'
import Chart from 'chart.js/auto'

const props = defineProps({
  initialData: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['period-change', 'export'])

// Состояние
const selectedPeriod = ref('week')
const showChart = ref(false)
const chartCanvas = ref(null)
let chartInstance = null

// Статистические данные
const statsData = reactive({
  week: [
    { id: 1, icon: '🔥', label: 'Сожжено ккал', value: '2,840', change: 12, color: '#e53e3e' },
    { id: 2, icon: '💪', label: 'Тренировок', value: '7', change: 5, color: '#ed8936' },
    { id: 3, icon: '⏱️', label: 'Активных минут', value: '285', change: -3, color: '#4299e1' },
    { id: 4, icon: '🎯', label: 'Целей выполнено', value: '3', change: 25, color: '#48bb78' },
    { id: 5, icon: '💧', label: 'Литр воды', value: '14', change: 8, color: '#38b2ac' },
    { id: 6, icon: '😴', label: 'Средний сон', value: '7.2ч', change: 2, color: '#9f7aea' }
  ],
  month: [
    { id: 1, icon: '🔥', label: 'Сожжено ккал', value: '12,500', change: 15, color: '#e53e3e' },
    { id: 2, icon: '💪', label: 'Тренировок', value: '28', change: 10, color: '#ed8936' },
    { id: 3, icon: '⏱️', label: 'Активных минут', value: '1,250', change: 5, color: '#4299e1' },
    { id: 4, icon: '🎯', label: 'Целей выполнено', value: '12', change: 30, color: '#48bb78' },
    { id: 5, icon: '💧', label: 'Литр воды', value: '62', change: 12, color: '#38b2ac' },
    { id: 6, icon: '😴', label: 'Средний сон', value: '7.5ч', change: 5, color: '#9f7aea' }
  ],
  year: [
    { id: 1, icon: '🔥', label: 'Сожжено ккал', value: '148,000', change: 22, color: '#e53e3e' },
    { id: 2, icon: '💪', label: 'Тренировок', value: '320', change: 18, color: '#ed8936' },
    { id: 3, icon: '⏱️', label: 'Активных минут', value: '15,800', change: 15, color: '#4299e1' },
    { id: 4, icon: '🎯', label: 'Целей выполнено', value: '145', change: 35, color: '#48bb78' },
    { id: 5, icon: '💧', label: 'Литр воды', value: '730', change: 20, color: '#38b2ac' },
    { id: 6, icon: '😴', label: 'Средний сон', value: '7.8ч', change: 8, color: '#9f7aea' }
  ]
})

// Computed
const stats = computed(() => {
  return statsData[selectedPeriod.value] || statsData.week
})

// Методы
const formatChange = (change) => {
  const sign = change >= 0 ? '+' : ''
  return `${sign}${change}%`
}

const updateStats = () => {
  emit('period-change', selectedPeriod.value)
  
  // Обновляем график если он открыт
  if (showChart.value && chartCanvas.value) {
    renderChart()
  }
}

const toggleChart = () => {
  showChart.value = !showChart.value
  
  if (showChart.value && chartCanvas.value) {
    renderChart()
  } else if (chartInstance) {
    chartInstance.destroy()
    chartInstance = null
  }
}

const renderChart = () => {
  if (!chartCanvas.value) return
  
  // Уничтожаем старый график
  if (chartInstance) {
    chartInstance.destroy()
  }
  
  const ctx = chartCanvas.value.getContext('2d')
  
  // Подготовка данных для графика
  const labels = stats.value.map(stat => stat.label)
  const data = stats.value.map(stat => 
    typeof stat.change === 'number' ? stat.change : 0
  )
  const colors = stats.value.map(stat => stat.color)
  
  chartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'Изменение (%)',
        data: data,
        backgroundColor: colors,
        borderColor: colors.map(color => color.replace('0.8', '1')),
        borderWidth: 1,
        borderRadius: 4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          callbacks: {
            label: (context) => {
              const value = context.raw
              const sign = value >= 0 ? '+' : ''
              return `Изменение: ${sign}${value}%`
            }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            color: 'rgba(0,0,0,0.05)'
          },
          ticks: {
            callback: (value) => `${value}%`
          }
        },
        x: {
          grid: {
            display: false
          }
        }
      }
    }
  })
}

const exportStats = () => {
  const data = {
    period: selectedPeriod.value,
    stats: stats.value,
    exportedAt: new Date().toISOString()
  }
  
  const blob = new Blob([JSON.stringify(data, null, 2)], { 
    type: 'application/json' 
  })
  
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `fitness-stats-${selectedPeriod.value}.json`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
  
  emit('export', data)
}

// Lifecycle hooks
onMounted(() => {
  console.log('StatsWidget mounted')
  
  // Загрузка сохраненных настроек
  const savedPeriod = localStorage.getItem('statsPeriod')
  if (savedPeriod) {
    selectedPeriod.value = savedPeriod
  }
  
  // Инициализация данных если переданы пропсы
  if (props.initialData && Object.keys(props.initialData).length > 0) {
    Object.assign(statsData, props.initialData)
  }
})

onUnmounted(() => {
  console.log('StatsWidget unmounted')
  
  // Сохранение настроек
  localStorage.setItem('statsPeriod', selectedPeriod.value)
  
  // Очистка графика
  if (chartInstance) {
    chartInstance.destroy()
  }
})

// Watch для отслеживания изменений
watch(selectedPeriod, (newPeriod) => {
  console.log('Period changed to:', newPeriod)
  
  // Автоматическое обновление графика при смене периода
  if (showChart.value) {
    setTimeout(renderChart, 100)
  }
})
</script>

<style scoped>
.stats-widget {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
}

.stats-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.stats-header h3 {
  margin: 0;
  color: #2d3748;
  font-size: 1.5rem;
}

.period-select {
  padding: 8px 12px;
  border: 2px solid #e2e8f0;
  border-radius: 6px;
  background: white;
  color: #4a5568;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.period-select:focus {
  outline: none;
  border-color: #667eea;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
}

.stat-card {
  background: #f7fafc;
  border-radius: 12px;
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 16px;
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.stat-icon {
  font-size: 2rem;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255,255,255,0.9);
  border-radius: 12px;
}

.stat-info {
  flex: 1;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: bold;
  color: #2d3748;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 0.875rem;
  color: #718096;
  margin-bottom: 4px;
}

.stat-change {
  font-size: 0.75rem;
  font-weight: 600;
  padding: 2px 6px;
  border-radius: 10px;
  display: inline-block;
}

.stat-change.positive {
  background: #c6f6d5;
  color: #276749;
}

.stat-change.negative {
  background: #fed7d7;
  color: #c53030;
}

.chart-container {
  height: 300px;
  margin-bottom: 24px;
  background: #f7fafc;
  border-radius: 12px;
  padding: 16px;
}

.stats-actions {
  display: flex;
  gap: 12px;
}

.chart-button,
.export-button {
  flex: 1;
  padding: 12px;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.chart-button {
  background: #667eea;
  color: white;
}

.chart-button:hover {
  background: #5a67d8;
}

.export-button {
  background: #e2e8f0;
  color: #4a5568;
}

.export-button:hover {
  background: #cbd5e0;
}
</style>