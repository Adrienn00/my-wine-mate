<template>
  <div
    class="rounded-lg border border-[var(--line)] bg-[rgba(255,248,239,0.86)] p-4 text-[var(--text-main)]"
  >
    <p class="mb-2 text-lg font-semibold">Rating: {{ formattedRating }}/5</p>

    <div class="mb-3 flex gap-1 text-[var(--gold)]">
      <span v-for="i in 5" :key="i">
        <i :class="i <= Math.round(formattedRating) ? 'fas fa-star' : 'far fa-star'"></i>
      </span>
    </div>

    <div v-if="criteriaItems.length" class="mb-3">
      <p class="mb-1 text-sm font-medium text-[var(--text-muted)]">Category scores:</p>
      <ul class="space-y-1 text-sm text-[var(--text-muted)]">
        <li v-for="item in criteriaItems" :key="item.key">
          {{ item.label }}: <span class="font-medium text-[var(--text-main)]">{{ item.value }}</span>
        </li>
      </ul>
    </div>

    <div v-if="commentEntries?.length">
      <p class="mb-1 text-sm font-medium text-[var(--text-muted)]">Reviews:</p>
      <ul class="space-y-2 text-sm text-[var(--text-muted)]">
        <li
          v-for="(entry, index) in commentEntries"
          :key="`${entry.id || entry.author}-${index}`"
          class="rounded-md border border-[var(--line)] bg-[rgba(255,251,246,0.88)] p-2"
        >
          <div class="flex items-center justify-between gap-2">
            <div>
              <span class="font-semibold text-[var(--text-main)]">{{ entry.author }}</span>
              <span class="mx-1">-</span>
              <span>{{ entry.text }}</span>
            </div>
            <button
              v-if="isAdmin && entry.id"
              type="button"
              class="rounded border border-[rgba(150,39,56,0.35)] px-2 py-1 text-xs text-[var(--wine)] transition hover:bg-[rgba(150,39,56,0.08)]"
              @click="emit('delete-comment', entry)"
            >
              Delete
            </button>
          </div>
        </li>
      </ul>
    </div>

    <div v-else-if="notes?.length">
      <p class="mb-1 text-sm font-medium text-[var(--text-muted)]">Comments:</p>
      <ul class="ml-5 list-disc space-y-1 text-sm text-[var(--text-muted)]">
        <li v-for="(note, index) in notes" :key="index">{{ note }}</li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  rating: Number,
  notes: Array,
  commentEntries: {
    type: Array,
    default: () => [],
  },
  criteriaAverages: {
    type: Object,
    default: null,
  },
  criteriaLabels: {
    type: Object,
    default: () => ({}),
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
})
const emit = defineEmits(['delete-comment'])

const formattedRating = computed(() => {
  const numeric = Number(props.rating)
  if (!Number.isFinite(numeric)) return 0
  return Number(numeric.toFixed(1))
})

const criteriaItems = computed(() => {
  const source = props.criteriaAverages || {}
  return Object.entries(source)
    .map(([key, value]) => ({
      key,
      label: props.criteriaLabels[key] || key,
      value: Number(value).toFixed(1),
    }))
    .filter((item) => Number.isFinite(Number(item.value)))
})
</script>
