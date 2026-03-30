<template>
  <component :is="to ? 'router-link' : 'button'" :to="to" v-bind="$attrs" :class="variantClass">
    <slot />
  </component>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  variant: {
    type: String,
    default: 'primary',
  },
  to: {
    type: String,
    default: null,
  },
})

const baseClasses =
  'inline-flex items-center justify-center rounded-xl px-4 py-2 transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--gold)] focus-visible:ring-offset-transparent'

const variantMap = {
  primary:
    'bg-[linear-gradient(135deg,var(--wine),var(--wine-soft))] text-[#fff7ef] font-semibold shadow-[0_10px_28px_rgba(122,32,56,0.28)] hover:brightness-110',
  secondary:
    'border border-[var(--line)] bg-[rgba(255,249,242,0.84)] text-[var(--text-main)] hover:bg-[rgba(243,232,220,0.9)]',
  login:
    'rounded-lg bg-[var(--wine)] px-3 py-1.5 text-sm font-semibold text-[#fff7ef] shadow-[0_6px_16px_rgba(122,32,56,0.25)] hover:bg-[var(--wine-soft)]',
  simple: 'px-2 py-1 rounded-md text-[var(--text-main)] hover:text-[var(--wine)]',
  simpleRose:
    'w-full justify-start rounded-lg border border-transparent px-3 py-2 text-left text-[var(--text-main)] hover:border-[var(--line)] hover:bg-[var(--rose)] hover:text-[var(--wine)]',
  adminFunctions:
    'w-full border border-[var(--line)] bg-[rgba(255,248,237,0.9)] p-4 text-center font-semibold italic text-[var(--text-main)] shadow-sm hover:bg-[rgba(243,232,220,0.9)]',
  homepage:
    'px-2 py-1 text-2xl font-semibold tracking-wide text-[var(--text-main)] hover:text-[var(--wine)]',
}

const variantClass = computed(() => `${baseClasses} ${variantMap[props.variant] || ''}`)
</script>
