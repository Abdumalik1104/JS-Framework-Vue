<template>
  <div class="progress-chart">
    <div class="chart-container">
      <div 
        v-for="(day, index) in chartData" 
        :key="index"
        class="chart-bar"
        :style="{ height: barHeight(day.calories) }"
        :title="`${day.date}: ${day.calories} ккал`"
      >
        <div class="bar-fill"></div>
      </div>
    </div>
    <div class="chart-labels">
      <span v-for="(day, index) in chartData" :key="index" class="chart-label">
        {{ formatDate(day.date) }}
      </span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  progress: {
    type: Array,
    default: () => []
  }
})

const chartData = computed(() => {
  // Берем последние 7 дней прогресса
  const lastWeek = props.progress.slice(-7)
  
  // Если данных меньше 7 дней, добавляем пустые дни
  while (lastWeek.length < 7) {
    lastWeek.push({ calories: 0, date: new Date().toISOString() })
  }
  
  return lastWeek
})

const maxCalories = computed(() => {
  return Math.max(...chartData.value.map(day => day.calories), 300)
})

const barHeight = (calories) => {
  const percentage = (calories / maxCalories.value) * 100
  return `${Math.max(percentage, 10)}%`
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })
}
</script>

<style scoped>
.progress-chart {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.chart-container {
  display: flex;
  align-items: end;
  justify-content: space-between;
  height: 200px;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.chart-bar {
  flex: 1;
  display: flex;
  align-items: end;
  position: relative;
  min-height: 20px;
}

.bar-fill {
  width: 100%;
  background: linear-gradient(to top, #667eea, #764ba2);
  border-radius: 4px 4px 0 0;
  transition: height 0.3s ease;
}

.chart-labels {
  display: flex;
  justify-content: space-between;
}

.chart-label {
  font-size: 0.8rem;
  color: #718096;
  flex: 1;
  text-align: center;
}
</style>