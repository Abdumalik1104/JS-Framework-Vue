<template>
  <div>
    <input v-model="newTask" placeholder="Enter task" />
    <select v-model="newCategory">
      <option value="Work">Work</option>
      <option value="Study">Study</option>
      <option value="Personal">Personal</option>
    </select>
    <button @click="addTask">Add Task</button>
  </div>
</template>

<script setup>
import { ref } from "vue";

const emit = defineEmits(["add-task"]);
const newTask = ref("");
const newCategory = ref("Work");

function addTask() {
  if (newTask.value.trim() === "") return;
  emit("add-task", {
    text: newTask.value,
    category: newCategory.value,
    completed: false,
  });
  newTask.value = "";
}
</script>
