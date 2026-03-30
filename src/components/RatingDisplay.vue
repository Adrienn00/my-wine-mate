<template>
  <div
    class="rounded-lg border border-[var(--line)] bg-[rgba(255,248,239,0.86)] p-4 text-[var(--text-main)]"
  >
    <p class="mb-2 text-lg font-semibold">Értékelés: {{ rating }}/5</p>

    <div class="mb-3 flex gap-1 text-[var(--gold)]">
      <span v-for="i in 5" :key="i">
        <i :class="i <= Math.round(rating) ? 'fas fa-star' : 'far fa-star'"></i>
      </span>
    </div>

    <div v-if="notes?.length">
      <p class="mb-1 text-sm font-medium text-[var(--text-muted)]">Megjegyzések:</p>
      <ul class="ml-5 list-disc space-y-1 text-sm text-[var(--text-muted)]">
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
