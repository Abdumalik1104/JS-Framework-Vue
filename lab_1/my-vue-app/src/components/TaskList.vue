<template>
  <ul>
    <li v-for="(task, index) in tasks" :key="index" :class="{ done: task.completed }">
      {{ task.text }} - ({{ task.category }})
      <button @click="$emit('complete-task', index)">Complete</button>
      <button @click="$emit('delete-task', index)">Delete</button>
    </li>
  </ul>
</template>

<script setup>
defineProps({
  tasks: Array
});
</script>

<style scoped>
.done {
  text-decoration: line-through;
  color: gray;
}
</style>
