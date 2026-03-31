<template>
  <div>
    <table class="w-full table-auto border-collapse text-left">
      <thead>
        <tr class="border-b border-[var(--line)] text-[var(--text-main)]">
          <th class="pb-2">Name</th>
          <th>Type</th>
          <th>Style</th>
          <th>Price</th>
          <th>Flavor notes</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="wine in paginatedWines"
          :key="wine._id"
          class="border-b border-[var(--line)] hover:bg-[rgba(237,215,212,0.28)]"
        >
          <td class="py-2">{{ wine.name }}</td>
          <td>{{ wine.type }}</td>
          <td>{{ wine.style }}</td>
          <td>{{ wine.priceRange }}</td>
          <td>{{ wine.flavorProfiles?.join(', ') }}</td>
          <td class="space-x-2">
            <BaseButton variant="secondary" @click="$emit('edit', wine)">Edit</BaseButton>
            <BaseButton variant="secondary" @click="$emit('delete', wine._id)">Delete</BaseButton>
          </td>
        </tr>
      </tbody>
    </table>

    <div class="mt-6 flex items-center justify-center gap-4">
      <button
        :disabled="currentPage === 1"
        class="rounded border border-[var(--line)] bg-[rgba(255,251,246,0.95)] px-3 py-1"
        @click="currentPage--"
      >
        ←
      </button>
      <span class="text-sm text-[var(--text-muted)]"> {{ currentPage }} / {{ totalPages }} </span>
      <button
        :disabled="currentPage === totalPages || totalPages === 0"
        class="rounded border border-[var(--line)] bg-[rgba(255,251,246,0.95)] px-3 py-1"
        @click="currentPage++"
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
