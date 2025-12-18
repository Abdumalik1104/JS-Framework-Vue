<template>
  <div class="workout-timer" :class="{ 'timer--active': isActive, 'timer--paused': isPaused }">
    <div class="timer-display">
      <div class="time">{{ formattedTime }}</div>
      <div class="timer-status">{{ statusText }}</div>
    </div>
    
    <div class="timer-progress">
      <div 
        class="progress-bar" 
        :style="{ width: progressPercentage + '%' }"
      ></div>
    </div>
    
    <div class="timer-controls">
      <button 
        v-if="!isActive" 
        @click="startTimer" 
        class="timer-button start"
      >
        ▶️ Старт
      </button>
      
      <button 
        v-if="isActive && !isPaused" 
        @click="pauseTimer" 
        class="timer-button pause"
      >
        ⏸️ Пауза
      </button>
      
      <button 
        v-if="isActive && isPaused" 
        @click="resumeTimer" 
        class="timer-button resume"
      >
        ▶️ Продолжить
      </button>
      
      <button 
        v-if="isActive" 
        @click="stopTimer" 
        class="timer-button stop"
      >
        ⏹️ Стоп
      </button>
      
      <button 
        @click="resetTimer" 
        class="timer-button reset"
      >
        🔄 Сброс
      </button>
    </div>
    
    <div class="timer-presets">
      <button 
        v-for="preset in timePresets" 
        :key="preset"
        @click="setTime(preset)"
        class="preset-button"
      >
        {{ preset }} сек
      </button>
    </div>
    
    <div class="timer-stats">
      <div class="stat">
        <span class="stat-label">Таймеров завершено:</span>
        <span class="stat-value">{{ completedTimers }}</span>
      </div>
      <div class="stat">
        <span class="stat-label">Общее время:</span>
        <span class="stat-value">{{ formatDuration(totalTime) }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted, onUpdated } from 'vue'

export default {
  name: 'WorkoutTimer',
  
  props: {
    initialTime: {
      type: Number,
      default: 60
    },
    autoStart: {
      type: Boolean,
      default: false
    }
  },
  
  emits: ['timer-start', 'timer-pause', 'timer-stop', 'timer-complete', 'timer-tick'],
  
  setup(props, { emit }) {
    // Состояние таймера
    const timeLeft = ref(props.initialTime)
    const isActive = ref(false)
    const isPaused = ref(false)
    const timerId = ref(null)
    const completedTimers = ref(0)
    const totalTime = ref(0)
    
    // Предустановки времени
    const timePresets = [30, 60, 90, 120, 180, 300]
    
    // Computed свойства
    const formattedTime = computed(() => {
      const minutes = Math.floor(timeLeft.value / 60)
      const seconds = timeLeft.value % 60
      return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
    })
    
    const progressPercentage = computed(() => {
      return ((props.initialTime - timeLeft.value) / props.initialTime) * 100
    })
    
    const statusText = computed(() => {
      if (!isActive.value) return 'Готов к старту'
      if (isPaused.value) return 'На паузе'
      return 'Идет тренировка'
    })
    
    // Методы таймера
    const startTimer = () => {
      if (timeLeft.value <= 0) {
        resetTimer()
      }
      
      isActive.value = true
      isPaused.value = false
      emit('timer-start', timeLeft.value)
      
      timerId.value = setInterval(() => {
        if (timeLeft.value > 0) {
          timeLeft.value--
          emit('timer-tick', timeLeft.value)
          
          if (timeLeft.value === 0) {
            completeTimer()
          }
        }
      }, 1000)
    }
    
    const pauseTimer = () => {
      isPaused.value = true
      clearInterval(timerId.value)
      emit('timer-pause', timeLeft.value)
    }
    
    const resumeTimer = () => {
      isPaused.value = false
      startTimer()
    }
    
    const stopTimer = () => {
      clearInterval(timerId.value)
      isActive.value = false
      isPaused.value = false
      emit('timer-stop', timeLeft.value)
    }
    
    const resetTimer = () => {
      stopTimer()
      timeLeft.value = props.initialTime
    }
    
    const setTime = (seconds) => {
      stopTimer()
      timeLeft.value = seconds
    }
    
    const completeTimer = () => {
      clearInterval(timerId.value)
      isActive.value = false
      completedTimers.value++
      totalTime.value += props.initialTime
      emit('timer-complete')
    }
    
    const formatDuration = (seconds) => {
      const hours = Math.floor(seconds / 3600)
      const minutes = Math.floor((seconds % 3600) / 60)
      const secs = seconds % 60
      
      if (hours > 0) {
        return `${hours}ч ${minutes}м`
      }
      return `${minutes}м ${secs}с`
    }
    
    // Lifecycle hooks
    onMounted(() => {
      console.log('Таймер смонтирован')
      
      // Восстановление состояния из localStorage
      const savedTimers = localStorage.getItem('completedTimers')
      if (savedTimers) {
        completedTimers.value = parseInt(savedTimers)
      }
      
      // Автостарт если указан
      if (props.autoStart) {
        setTimeout(startTimer, 1000)
      }
    })
    
    onUpdated(() => {
      console.log('Таймер обновлен, время:', timeLeft.value)
    })
    
    onUnmounted(() => {
      console.log('Таймер размонтирован')
      clearInterval(timerId.value)
      
      // Сохранение статистики
      localStorage.setItem('completedTimers', completedTimers.value.toString())
    })
    
    return {
      timeLeft,
      isActive,
      isPaused,
      formattedTime,
      progressPercentage,
      statusText,
      timePresets,
      completedTimers,
      totalTime,
      startTimer,
      pauseTimer,
      resumeTimer,
      stopTimer,
      resetTimer,
      setTime,
      formatDuration
    }
  }
}
</script>

<style scoped>
.workout-timer {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 16px;
  padding: 24px;
  transition: all 0.3s ease;
}

.timer--active {
  background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);
  animation: pulse 2s infinite;
}

.timer--paused {
  background: linear-gradient(135deg, #ed8936 0%, #dd6b20 100%);
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.02); }
  100% { transform: scale(1); }
}

.timer-display {
  text-align: center;
  margin-bottom: 20px;
}

.time {
  font-size: 3.5rem;
  font-weight: bold;
  font-family: 'Courier New', monospace;
  margin-bottom: 8px;
}

.timer-status {
  font-size: 1.1rem;
  opacity: 0.9;
}

.timer-progress {
  height: 6px;
  background: rgba(255,255,255,0.2);
  border-radius: 3px;
  margin-bottom: 24px;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  background: white;
  transition: width 1s linear;
}

.timer-controls {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.timer-button {
  flex: 1;
  min-width: 120px;
  padding: 12px;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.timer-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.2);
}

.start { background: #48bb78; color: white; }
.pause { background: #ed8936; color: white; }
.resume { background: #4299e1; color: white; }
.stop { background: #e53e3e; color: white; }
.reset { background: #a0aec0; color: white; }

.timer-presets {
  display: flex;
  gap: 8px;
  margin-bottom: 24px;
  flex-wrap: wrap;
}

.preset-button {
  padding: 8px 16px;
  background: rgba(255,255,255,0.1);
  border: 1px solid rgba(255,255,255,0.3);
  color: white;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.preset-button:hover {
  background: rgba(255,255,255,0.2);
}

.timer-stats {
  display: flex;
  justify-content: space-between;
  font-size: 0.9rem;
  opacity: 0.9;
}

.stat {
  display: flex;
  flex-direction: column;
}

.stat-label {
  margin-bottom: 4px;
}

.stat-value {
  font-weight: bold;
  font-size: 1.1rem;
}
</style>