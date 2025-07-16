<template>
  <div class="bg-gray-800 text-white p-4 rounded-lg">
    <p class="text-lg font-semibold mb-2">Értékelés: {{ rating }}/5</p>

    <div class="flex gap-1 text-yellow-400 mb-3">
      <span v-for="i in 5" :key="i">
        <i :class="i <= Math.round(rating) ? 'fas fa-star' : 'far fa-star'"></i>
      </span>
    </div>

    <div v-if="notes?.length">
      <p class="text-sm font-medium mb-1 text-gray-300">Megjegyzések:</p>
      <ul class="list-disc ml-5 text-sm text-gray-400 space-y-1">
        <li v-for="(note, index) in notes" :key="index">{{ note }}</li>
      </ul>
    </div>
  </div>
</template>

<script setup>
defineProps({
  rating: Number,
  notes: Array,
})
</script>
