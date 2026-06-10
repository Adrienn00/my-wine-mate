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
  'inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-sm font-semibold tracking-[0.01em] transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--wine)] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50'

const variantMap = {
  primary:
    'border border-[rgba(93,31,50,0.22)] bg-[linear-gradient(180deg,#6f2941_0%,#5d1f32_100%)] text-[#ffffff] shadow-[0_10px_22px_rgba(93,31,50,0.24)] hover:-translate-y-px hover:brightness-105 active:translate-y-0',
  secondary:
    'border border-[var(--line)] bg-[rgba(255,250,243,0.96)] text-[var(--text-main)] shadow-[0_6px_18px_rgba(42,19,24,0.06)] hover:border-[rgba(93,31,50,0.4)] hover:bg-white hover:text-[var(--wine)] hover:-translate-y-px active:translate-y-0',
  danger:
    'border border-[rgba(176,48,64,0.22)] bg-[rgba(255,246,247,0.9)] text-[var(--danger)] hover:bg-[rgba(255,234,236,0.9)] hover:border-[rgba(176,48,64,0.38)] hover:-translate-y-px',
  login:
    'rounded-full bg-[var(--wine)] px-4 py-2 text-[#ffffff] shadow-[0_4px_16px_rgba(107,45,62,0.26)] hover:bg-[var(--wine-soft)] hover:-translate-y-px',
  simple:
    'rounded-lg px-2.5 py-1.5 text-[var(--text-main)] hover:text-[var(--wine)] hover:bg-[rgba(93,31,50,0.06)]',
  navLink:
    'rounded-full border border-transparent px-3.5 py-2 text-[0.9rem] font-medium text-[#f9ead7] hover:border-[rgba(255,255,255,0.16)] hover:bg-[rgba(255,247,239,0.12)] hover:text-[#ffffff]',
  navAccent:
    'rounded-full border border-[rgba(255,255,255,0.2)] bg-[rgba(255,247,239,0.08)] px-4 py-2 text-[0.9rem] font-semibold text-[#fff3e7] hover:bg-[rgba(255,247,239,0.18)] hover:-translate-y-px',
  navPrimary:
    'rounded-full border border-[rgba(255,255,255,0.18)] bg-[rgba(255,247,239,0.95)] px-4 py-2 text-[0.9rem] font-semibold text-[var(--wine)] shadow-[0_8px_18px_rgba(35,11,16,0.18)] hover:-translate-y-px hover:bg-white',
  simpleRose:
    'w-full justify-start rounded-xl border border-transparent px-3.5 py-2.5 text-left text-[var(--text-main)] hover:border-[var(--line)] hover:bg-[var(--rose)] hover:text-[var(--wine)]',
  adminFunctions:
    'w-full rounded-xl border border-[var(--line)] bg-white px-5 py-4 text-center text-[var(--text-main)] shadow-[0_2px_10px_rgba(28,15,19,0.05)] hover:-translate-y-px hover:border-[rgba(107,45,62,0.35)] hover:text-[var(--wine)]',
  homepage:
    'px-0 py-1 text-left font-["Cormorant_Garamond"] text-[1.8rem] font-semibold leading-none tracking-[0.03em] text-[var(--wine)] hover:opacity-75 md:text-[2.25rem]',
}

const variantClass = computed(() => `${baseClasses} ${variantMap[props.variant] || ''}`)
</script>
