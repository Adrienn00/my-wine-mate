<template>
  <form
    @submit.prevent="submit"
    class="rounded-lg border border-[var(--line)] bg-[rgba(255,248,239,0.86)] p-4 text-[var(--text-main)]"
  >
    <p class="mb-2 text-lg font-semibold">Adj értékelést 🍇</p>
    <div class="mb-4 flex gap-2 text-xl text-[var(--gold)]">
      <BaseButton
        v-for="i in 5"
        :key="i"
        type="button"
        @click="selectedRating = i"
        :class="{
          'text-[var(--gold)]': selectedRating >= i,
          'text-[rgba(122,100,91,0.5)]': selectedRating < i,
        }"
      >
        ★
      </BaseButton>
    </div>
    <textarea
      v-model="comment"
      placeholder="Írd ide a megjegyzésed..."
      class="mb-6 w-full rounded border border-[var(--line)] bg-[rgba(255,251,246,0.94)] px-4 py-2 text-[var(--text-main)] focus:border-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[rgba(202,163,103,0.22)]"
      rows="3"
    ></textarea>
    <BaseButton type="submit" variant="secondary"> Küldés </BaseButton>
  </form>
</template>

<script setup>
import { ref } from 'vue'
import BaseButton from './ui/BaseButton.vue'

const emit = defineEmits(['submit'])
const selectedRating = ref(0)
const comment = ref('')

function submit() {
  if (selectedRating.value === 0) return alert('Válassz értékelést!')
  emit('submit', {
    rating: selectedRating.value,
    comment: comment.value.trim(),
  })
  selectedRating.value = 0
  comment.value = ''
}
</script>
