<template>
  <div :class="['section-intro', align === 'center' && 'text-center items-center']">
    <p v-if="kicker" :class="kickerClass">{{ kicker }}</p>
    <component :is="titleTag" :class="titleClass">{{ title }}</component>
    <p v-if="description" :class="descClass">{{ description }}</p>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  kicker: { type: String, default: '' },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  titleTag: { type: String, default: 'h1' },
  variant: { type: String, default: 'page' }, // 'page' | 'card'
  align: { type: String, default: 'left' },   // 'left' | 'center'
})

const kickerClass = computed(() =>
  props.variant === 'card'
    ? 'text-xs uppercase tracking-[0.22em] text-[var(--text-muted)]'
    : 'section-kicker'
)

const titleClass = computed(() =>
  props.variant === 'card' ? 'mt-1 text-2xl font-semibold' : 'section-title'
)

const descClass = computed(() => {
  if (props.variant === 'card') return 'mt-1 text-sm text-[var(--text-muted)]'
  return props.align === 'center' ? 'section-summary mx-auto' : 'section-summary'
})
</script>
