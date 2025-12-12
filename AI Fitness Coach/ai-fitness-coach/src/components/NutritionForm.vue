<template>
  <form @submit.prevent="handleSubmit" class="nutrition-form">
    <div class="form-group">
      <label for="mealName">Название приема пищи</label>
      <input
        id="mealName"
        v-model="form.mealName"
        type="text"
        placeholder="Завтрак, Обед, Ужин..."
        required
        class="form-input"
      >
    </div>

    <div class="form-row">
      <div class="form-group">
        <label for="calories">Калории</label>
        <input
          id="calories"
          v-model.number="form.calories"
          type="number"
          min="0"
          placeholder="0"
          required
          class="form-input"
        >
      </div>

      <div class="form-group">
        <label for="protein">Белок (г)</label>
        <input
          id="protein"
          v-model.number="form.protein"
          type="number"
          min="0"
          step="0.1"
          placeholder="0"
          required
          class="form-input"
        >
      </div>
    </div>

    <div class="form-row">
      <div class="form-group">
        <label for="carbs">Углеводы (г)</label>
        <input
          id="carbs"
          v-model.number="form.carbs"
          type="number"
          min="0"
          step="0.1"
          placeholder="0"
          required
          class="form-input"
        >
      </div>

      <div class="form-group">
        <label for="fat">Жиры (г)</label>
        <input
          id="fat"
          v-model.number="form.fat"
          type="number"
          min="0"
          step="0.1"
          placeholder="0"
          required
          class="form-input"
        >
      </div>
    </div>

    <button type="submit" class="submit-btn">
      ➕ Добавить прием пищи
    </button>
  </form>
</template>

<script setup>
import { ref } from 'vue'

const emit = defineEmits(['nutrition-added'])

const form = ref({
  mealName: '',
  calories: 0,
  protein: 0,
  carbs: 0,
  fat: 0
})

const handleSubmit = () => {
  emit('nutrition-added', {
    name: form.value.mealName,
    calories: form.value.calories,
    protein: form.value.protein,
    carbs: form.value.carbs,
    fat: form.value.fat
  })

  // Сброс формы
  form.value = {
    mealName: '',
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0
  }
}
</script>

<style scoped>
.nutrition-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group label {
  margin-bottom: 0.5rem;
  color: #4a5568;
  font-weight: 500;
}

.form-input {
  padding: 0.75rem 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

.form-input:focus {
  outline: none;
  border-color: #667eea;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.submit-btn {
  background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 1rem;
}

.submit-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(72, 187, 120, 0.3);
}

@media (max-width: 768px) {
  .form-row {
    grid-template-columns: 1fr;
  }
}
</style>