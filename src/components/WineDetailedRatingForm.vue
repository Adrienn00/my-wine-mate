<template>
  <form
    @submit.prevent="submit"
    class="rounded-lg border border-[var(--line)] bg-[rgba(255,248,239,0.86)] p-4 text-[var(--text-main)]"
  >
    <p class="mb-3 text-lg font-semibold">Közösségi értékelés 🍷</p>

    <div class="space-y-3">
      <div
        v-for="criterion in WINE_RATING_CRITERIA"
        :key="criterion.key"
        class="rounded-lg border border-[var(--line)] bg-[rgba(255,251,246,0.92)] p-3"
      >
        <p class="mb-2 text-sm font-medium">{{ criterion.label }}</p>
        <div class="flex gap-2 text-xl text-[var(--gold)]">
          <BaseButton
            v-for="i in 5"
            :key="`${criterion.key}-${i}`"
            type="button"
            @click="setRating(criterion.key, i)"
            :class="{
              'text-[var(--gold)]': (criteriaRatings[criterion.key] || 0) >= i,
              'text-[rgba(122,100,91,0.45)]': (criteriaRatings[criterion.key] || 0) < i,
            }"
          >
            ★
          </BaseButton>
        </div>
      </div>
    </div>

    <textarea
      v-model="comment"
      placeholder="Írd ide a tapasztalatod..."
      class="mb-4 mt-4 w-full rounded border border-[var(--line)] bg-[rgba(255,251,246,0.94)] px-4 py-2 text-[var(--text-main)] focus:border-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[rgba(202,163,103,0.22)]"
      rows="3"
    ></textarea>

    <BaseButton type="submit" variant="secondary">Küldés</BaseButton>
  </form>
</template>

<script setup>
import { reactive, ref } from 'vue'
import BaseButton from './ui/BaseButton.vue'
import { WINE_RATING_CRITERIA } from '../services/wineRatingCriteria'

const emit = defineEmits(['submit'])

const criteriaRatings = reactive(
  WINE_RATING_CRITERIA.reduce((acc, criterion) => {
    acc[criterion.key] = 0
    return acc
  }, {})
)
const comment = ref('')

function setRating(key, value) {
  criteriaRatings[key] = value
}

function submit() {
  const hasEveryCriteria = WINE_RATING_CRITERIA.every((criterion) => criteriaRatings[criterion.key] > 0)
  if (!hasEveryCriteria) {
    alert('Kérlek értékeld az összes szempontot 1-5 között.')
    return
  }

  const payloadCriteria = WINE_RATING_CRITERIA.reduce((acc, criterion) => {
    acc[criterion.key] = criteriaRatings[criterion.key]
    return acc
  }, {})

  emit('submit', {
    criteria: payloadCriteria,
    comment: comment.value.trim(),
  })

  for (const criterion of WINE_RATING_CRITERIA) {
    criteriaRatings[criterion.key] = 0
  }
  comment.value = ''
}
</script>
