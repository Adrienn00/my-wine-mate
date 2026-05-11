<template>
  <div class="glass-panel relative rounded-2xl border border-[var(--line)] p-4 text-[var(--text-main)]">
    <!-- Badge -->
    <div
      class="absolute top-3 right-3 rounded-full px-2.5 py-1 text-xs font-semibold"
      :class="badgeClass"
    >
      {{ badgeLabel }}
    </div>

    <!-- Image -->
    <img
      v-if="wine.imageUrl"
      :src="wine.imageUrl"
      :alt="wine.name"
      class="mb-3 h-32 w-full rounded-xl object-cover"
    />

    <BaseButton :to="`/wine/${wine._id}?from=recommended`" variant="simple" class="px-0 text-lg font-semibold">
      {{ wine.name }}
    </BaseButton>

    <div class="mt-2 space-y-1 text-sm text-[var(--text-muted)]">
      <div v-if="wine.matchPercent !== undefined">
        <span class="font-semibold">Match:</span> {{ wine.matchPercent }}%
      </div>
      <div v-if="wine.type">
        <span class="font-semibold">Type:</span> {{ wine.type }}
      </div>
      <div v-if="wine.style">
        <span class="font-semibold">Style:</span> {{ wine.style }}
      </div>
      <div v-if="wine.flavorProfiles?.length">
        <span class="font-semibold">Flavors:</span> {{ wine.flavorProfiles.slice(0, 3).join(', ') }}
      </div>
      <div v-if="wine.priceRange">
        <span class="font-semibold">Price:</span> {{ wine.priceRange }}
      </div>
    </div>

    <div v-if="wine.reasons?.length" class="mt-3 text-xs text-[var(--wine)]">
      {{ wine.reasons.slice(0, 2).join(' · ') }}
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import BaseButton from './ui/BaseButton.vue'

const props = defineProps({
  wine: { type: Object, required: true },
  badgeLabel: { type: String, default: 'Recommended' },
  badgeColor: { type: String, default: 'wine' },
})

const badgeClass = computed(() => {
  if (props.badgeColor === 'gold') {
    return 'bg-[var(--gold)] text-[#2d1f1c]'
  }
  return 'bg-[rgba(122,32,56,0.12)] text-[var(--wine)]'
})
</script>
