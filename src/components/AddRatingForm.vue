<template>
  <form
    @submit.prevent="submit"
    class="rounded-lg border border-[var(--line)] bg-[var(--surface)] p-4 text-[var(--text-main)]"
  >
    <p class="mb-2 text-lg font-semibold">Rate this item 🍇</p>
    <div class="mb-4 flex gap-1">
      <button
        v-for="i in 5"
        :key="i"
        type="button"
        @click="selectedRating = i"
        class="touch-manipulation p-1 text-2xl leading-none transition-transform active:scale-90"
        :class="selectedRating >= i ? 'text-[var(--gold)]' : 'text-[rgba(122,100,91,0.3)]'"
      >★</button>
    </div>
    <textarea
      v-model="comment"
      placeholder="Write your comment here..."
      class="mb-6 w-full rounded-lg border border-[var(--line)] bg-white px-4 py-2.5 text-[var(--text-main)] outline-none transition focus:border-[var(--wine)] focus:ring-2 focus:ring-[rgba(93,31,50,0.12)]"
      rows="3"
    ></textarea>
    <BaseButton type="submit" variant="secondary"> Submit </BaseButton>
  </form>
</template>

<script setup>
import { ref } from 'vue'
import BaseButton from './ui/BaseButton.vue'

const emit = defineEmits(['submit'])
const selectedRating = ref(0)
const comment = ref('')

function submit() {
  if (selectedRating.value === 0) return alert('Please select a rating.')
  emit('submit', {
    rating: selectedRating.value,
    comment: comment.value.trim(),
  })
  selectedRating.value = 0
  comment.value = ''
}
</script>
