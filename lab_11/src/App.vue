<template>
  <div id="app">
    <h1>🎓 Student Dashboard</h1>
    
    <button v-if="!showForm" @click="showForm = true" class="add-student-btn">
      Add Student
    </button>
    
    <AddStudentForm 
      v-else
      @add-student="addStudent"
      @close-form="showForm = false"
    />
    
    <StudentList 
      :students="students" 
      @remove-student="removeStudent" 
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import AddStudentForm from './components/AddStudentForm.vue'
import StudentList from './components/StudentList.vue'

const students = ref([
  { id: 1, name: 'Alice Johnson', age: 21 },
  { id: 2, name: 'Michael Smith', age: 22 }
])

const showForm = ref(false)

const addStudent = (newStudent) => {
  const student = {
    id: Date.now(),
    ...newStudent
  }
  students.value.push(student)
  showForm.value = false
}

const removeStudent = (id) => {
  students.value = students.value.filter(student => student.id !== id)
}
</script>

<style>
#app {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}

.add-student-btn {
  background: #10b981;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 12px 20px;
  cursor: pointer;
  font-weight: 600;
  font-size: 16px;
  transition: background 0.3s;
  margin-bottom: 20px;
}

.add-student-btn:hover {
  background: #059669;
}
</style>