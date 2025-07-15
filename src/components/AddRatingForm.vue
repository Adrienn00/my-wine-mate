<template>
  <form @submit.prevent="submit" class="bg-gray-800 text-white p-4 rounded-lg">
    <p class="text-lg font-semibold mb-2">Adj értékelést</p>
    <div class="flex gap-2 text-yellow-400 text-xl mb-4">
      <BaseButton
        v-for="i in 5"
        :key="i"
        type="button"
        @click="selectedRating = i"
        :class="{ 'text-yellow-500': selectedRating >= i, 'text-gray-500': selectedRating < i }"
      >
        ★
      </BaseButton>
    </div>
    <textarea
      v-model="comment"
      placeholder="Írd ide a megjegyzésed..."
      class="w-full px-4 py-2 border rounded bg-gray-900 text-white border-gray-700 focus:outline-none focus:ring focus:border-yellow-300 mb-6"
      rows="3"
    ></textarea>
    <BaseButton type="submit" variant="secondary"> Küldés </BaseButton>
  </form>
</template>

<script setup>
import { ref } from 'vue'
import BaseButton from './BaseButton.vue'

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
