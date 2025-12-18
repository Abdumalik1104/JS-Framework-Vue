import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './styles/animations.css'

// Создаем приложение
const app = createApp(App)

// Подключаем Pinia
const pinia = createPinia()
app.use(pinia)

// Подключаем роутер
app.use(router)

// Глобальные компоненты (опционально)
// app.component('Icon', Icon)

// Глобальные директивы (опционально)
// app.directive('focus', {
//   mounted(el) {
//     el.focus()
//   }
// })

// Запуск приложения
app.mount('#app')

// Глобальные обработчики ошибок
app.config.errorHandler = (err, vm, info) => {
  console.error('Глобальная ошибка Vue:', err)
  console.log('Компонент:', vm)
  console.log('Информация:', info)
}