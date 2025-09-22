<template>
  <div>
    <h1>Task Manager</h1>
    <TaskForm @add-task="addTask" />
    <TaskList 
      :tasks="tasks" 
      @complete-task="completeTask" 
      @delete-task="deleteTask" 
    />
    <p v-if="tasks.length === 0">No tasks</p>
    <p>Incomplete tasks: {{ incompleteCount }}</p>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import TaskForm from "./components/TaskForm.vue";
import TaskList from "./components/TaskList.vue";

const tasks = ref([]);

function addTask(task) {
  tasks.value.push(task);
}

function completeTask(index) {
  tasks.value[index].completed = true;
}

function deleteTask(index) {
  tasks.value.splice(index, 1);
}

const incompleteCount = computed(() => 
  tasks.value.filter((t) => !t.completed).length
);
</script>
