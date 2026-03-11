<template>
  <div>
    <table class="w-full table-auto border-collapse text-left">
      <thead>
        <tr class="border-b border-gray-600 text-yellow-100">
          <th class="pb-2">Név</th>
          <th>Típus</th>
          <th>Stílus</th>
          <th>Ár</th>
          <th>Ízjegyek</th>
          <th>Műveletek</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="wine in paginatedWines" :key="wine._id" class="border-b border-gray-700">
          <td class="py-2">{{ wine.name }}</td>
          <td>{{ wine.type }}</td>
          <td>{{ wine.style }}</td>
          <td>{{ wine.priceRange }}</td>
          <td>{{ wine.flavorProfiles?.join(', ') }}</td>
          <td class="space-x-2">
            <BaseButton variant="secondary" @click="$emit('edit', wine)">Szerkesztés</BaseButton>
            <BaseButton variant="secondary" @click="$emit('delete', wine._id)">Törlés</BaseButton>
          </td>
        </tr>
      </tbody>
    </table>

    <div class="flex justify-center items-center gap-4 mt-6">
      <button
        @click="currentPage--"
        :disabled="currentPage === 1"
        class="px-3 py-1 bg-gray-800 border border-gray-700 rounded"
      >
        ←
      </button>
      <span class="text-sm text-gray-300"> {{ currentPage }} / {{ totalPages }} </span>
      <button
        @click="currentPage++"
        :disabled="currentPage === totalPages || totalPages === 0"
        class="px-3 py-1 bg-gray-800 border border-gray-700 rounded"
      >
        →
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import BaseButton from '../ui/BaseButton.vue'

const props = defineProps({
  wines: {
    type: Array,
    required: true,
  },
})

defineEmits(['edit', 'delete'])

const currentPage = ref(1)
const itemsPerPage = 20

const paginatedWines = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return props.wines.slice(start, start + itemsPerPage)
})

const totalPages = computed(() => {
  return Math.ceil(props.wines.length / itemsPerPage)
})
</script>
