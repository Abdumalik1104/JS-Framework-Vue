<template>
  <form class="form" @submit.prevent="submitForm">
    <div class="form-header">
      <h3>Add Student</h3>
      <button type="button" @click="closeForm" class="close-btn">Close Form</button>
    </div>
    
    <input 
      type="text" 
      placeholder="Student name" 
      v-model="name"
      required
    >
    <input 
      type="number" 
      placeholder="Age" 
      v-model.number="age"
      required
      min="1"
    >
    <button type="submit" class="submit-btn">Add</button>
  </form>
</template>

<script setup>
import { ref } from 'vue'

const name = ref('')
const age = ref(null)

const emit = defineEmits(['add-student', 'close-form'])

const submitForm = () => {
  if (name.value && age.value) {
    emit('add-student', { name: name.value, age: age.value })
    name.value = ''
    age.value = null
  }
}

const closeForm = () => {
  emit('close-form')
}
</script>

<style scoped>
.form {
  margin: 20px 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.07);
}

.form-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.form-header h3 {
  margin: 0;
  color: #374151;
}

.close-btn {
  background: #6b7280;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 6px 12px;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.3s;
}

.close-btn:hover {
  background: #4b5563;
}

input {
  border: 1px solid #d1d5db;
  border-radius: 8px;
  padding: 12px;
  font-size: 14px;
  transition: border-color 0.3s;
}

input:focus {
  outline: none;
  border-color: #10b981;
}

.submit-btn {
  background: #10b981;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 12px;
  cursor: pointer;
  font-weight: 600;
  font-size: 16px;
  transition: background 0.3s;
}

.submit-btn:hover {
  background: #059669;
}
</style>