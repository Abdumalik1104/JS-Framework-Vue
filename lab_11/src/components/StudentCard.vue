<template>
  <div class="card">
    <div class="info">
      <h3>{{ student.name }}</h3>
      <p>Age: {{ student.age }}</p>
    </div>
    <button @click="$emit('remove')" class="remove-btn">✖</button>
  </div>
</template>

<script setup>
defineProps({
  student: Object
})
</script>

<style scoped>
.card {
  background: white;
  border-radius: 12px;
  padding: 14px 20px;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.05);
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: transform 0.2s;
}
.card:hover {
  transform: scale(1.02);
}

.info h3 {
  margin: 0 0 5px 0;
  font-size: 18px;
  font-weight: 600;
}

.info p {
  margin: 0;
  color: #666;
}

.remove-btn {
  background: none;
  border: none;
  color: #ef4444;
  font-size: 20px;
  cursor: pointer;
  transition: color 0.2s;
}
.remove-btn:hover {
  color: #b91c1c;
}
</style>