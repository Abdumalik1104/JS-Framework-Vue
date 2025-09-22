<template>
  <li :class="{ completed: task.completed }">
    <span>
      {{ task.text }} ({{ task.category }}, {{ task.priority }})
    </span>
    <button @click="$emit('toggle-task')">
      {{ task.completed ? "Undo" : "Complete" }}
    </button>
    <button @click="$emit('delete-task')">Delete</button>
  </li>
</template>

<script setup>
defineProps({ task: Object });
</script>

<style scoped>
.completed {
  text-decoration: line-through;
  color: gray;
}
</style>
