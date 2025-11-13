<template>
  <div class="list">
    <transition-group name="fade" tag="div" class="cards">
      <StudentCard 
        v-for="student in students" 
        :key="student.id"
        :student="student"
        @remove="$emit('remove-student', student.id)"
      />
    </transition-group>
  </div>
</template>

<script setup>
import StudentCard from './StudentCard.vue'

defineProps({
  students: Array
})

const emit = defineEmits(['remove-student'])
</script>

<style scoped>
.list {
  margin-top: 30px;
}
.cards {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.fade-enter-active,
.fade-leave-active {
  transition: all 0.4s ease;
}
.fade-enter-from {
  opacity: 0;
  transform: translateY(10px);
}
.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>