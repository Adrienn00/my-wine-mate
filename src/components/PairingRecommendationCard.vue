<template>
  <article :class="cardClass">
    <div
      v-if="showTopBadge"
      class="mb-3 inline-flex rounded-full bg-[var(--gold)] px-2.5 py-1 text-xs font-semibold text-[#2d1f1c]"
    >
      {{ isPreference ? 'Preference match' : 'Top Pairing' }}
    </div>

    <BaseButton :to="itemLink" variant="simple" class="block text-lg font-semibold">
      {{ itemName }}
    </BaseButton>

    <div
      class="mt-2 inline-flex rounded-full border border-[var(--line)] bg-white/60 px-2.5 py-1 text-xs font-semibold text-[var(--wine)]"
    >
      {{ item.recommendationLabel || 'Smart recommendation' }}
    </div>

    <div class="mt-3 space-y-1 text-sm text-[var(--text-muted)]">
      <div><span class="font-semibold">Match:</span> {{ toPercent(item.probability) }}%</div>
      <div v-if="isWineMode">
        <span class="font-semibold">Categories:</span>
        {{ item.categories?.join(', ') || '—' }}
      </div>
      <div v-else>
        <span class="font-semibold">Wine type:</span> {{ item.type || '—' }}
      </div>
      <div v-if="!isWineMode">
        <span class="font-semibold">Style:</span> {{ item.style || '—' }}
      </div>
    </div>

    <p v-if="isPreference && item.reason" class="mt-3 text-sm text-[var(--text-muted)]">
      {{ item.reason }}
    </p>

    <div class="mt-4 flex flex-wrap gap-3">
      <BaseButton variant="secondary" :disabled="feedbackLoading" @click="emit('feedback', { item, type: 'good' })">
        Good match
      </BaseButton>
      <BaseButton variant="danger" :disabled="feedbackLoading" @click="emit('feedback', { item, type: 'bad' })">
        Bad match
      </BaseButton>
    </div>

    <p v-if="feedbackStatus" class="mt-3 text-sm text-[var(--text-muted)]">
      {{ feedbackStatus }}
    </p>
  </article>
</template>

<script setup>
import { computed } from 'vue'
import BaseButton from './ui/BaseButton.vue'

const props = defineProps({
  item: { type: Object, required: true },
  isWineMode: { type: Boolean, required: true },
  isPreference: { type: Boolean, default: false },
  feedbackLoading: { type: Boolean, default: false },
  feedbackStatus: { type: String, default: '' },
})

const emit = defineEmits(['feedback'])

const cardClass = computed(() =>
  props.isPreference
    ? 'dashboard-panel rounded-xl border-2 border-[rgba(184,149,90,0.3)] p-4 text-[var(--text-main)]'
    : 'dashboard-panel rounded-xl p-4 text-[var(--text-main)]'
)

const showTopBadge = computed(
  () => props.isPreference || (!props.isPreference && props.item.probability >= 0.8)
)

const itemName = computed(
  () => props.item.wine_name || props.item.recipe_name || props.item.name || 'Open details'
)

const itemLink = computed(() =>
  props.isWineMode
    ? `/recipe/${props.item.recipe_id || props.item._id}`
    : `/wine/${props.item.wine_id || props.item._id}`
)

function toPercent(probability) {
  const numeric = Number(probability)
  if (!Number.isFinite(numeric)) return 0
  return Math.round(numeric * 100)
}
</script>
