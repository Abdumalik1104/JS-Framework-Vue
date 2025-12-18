import { createPinia } from 'pinia'

export const pinia = createPinia()

// Можно добавить плагины здесь
pinia.use(({ store }) => {
  // Сохранение состояния в localStorage
  const saveToStorage = () => {
    localStorage.setItem(`store_${store.$id}`, JSON.stringify(store.$state))
  }
  
  // Загрузка состояния из localStorage
  const saved = localStorage.getItem(`store_${store.$id}`)
  if (saved) {
    store.$patch(JSON.parse(saved))
  }
  
  // Автосохранение при изменениях
  store.$subscribe(saveToStorage, { deep: true })
})

export { pinia }