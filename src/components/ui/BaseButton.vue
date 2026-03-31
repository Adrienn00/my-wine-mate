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
  'inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold tracking-[0.01em] transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--gold)] focus-visible:ring-offset-transparent disabled:pointer-events-none disabled:opacity-55'

const variantMap = {
  primary:
    'bg-[linear-gradient(135deg,var(--wine),var(--wine-soft))] text-[#fff7ef] shadow-[0_10px_28px_rgba(122,32,56,0.28)] hover:-translate-y-0.5 hover:brightness-110',
  secondary:
    'border border-[var(--line)] bg-[rgba(255,249,242,0.84)] text-[var(--text-main)] shadow-[0_8px_22px_rgba(80,42,23,0.08)] hover:-translate-y-0.5 hover:border-[rgba(122,32,56,0.28)] hover:bg-[rgba(243,232,220,0.9)]',
  danger:
    'border border-[rgba(192,76,93,0.24)] bg-[rgba(255,241,241,0.9)] text-[var(--danger)] shadow-[0_8px_20px_rgba(122,32,56,0.08)] hover:-translate-y-0.5 hover:bg-[rgba(255,229,229,0.95)]',
  login:
    'rounded-full bg-[var(--wine)] px-3.5 py-2 text-[#fff7ef] shadow-[0_6px_16px_rgba(122,32,56,0.25)] hover:-translate-y-0.5 hover:bg-[var(--wine-soft)]',
  simple:
    'rounded-lg px-2.5 py-1.5 text-[var(--text-main)] shadow-none hover:text-[var(--wine)] hover:bg-[rgba(237,215,212,0.3)]',
  navLink:
    'rounded-full border border-transparent px-4 py-2 text-[0.95rem] font-semibold text-[var(--text-main)] shadow-none hover:border-[rgba(122,32,56,0.16)] hover:bg-[rgba(237,215,212,0.32)] hover:text-[var(--wine)]',
  navAccent:
    'rounded-full border border-[rgba(122,32,56,0.16)] bg-[rgba(255,249,242,0.9)] px-4 py-2 text-[0.95rem] font-semibold text-[var(--text-main)] shadow-[0_8px_20px_rgba(80,42,23,0.08)] hover:-translate-y-0.5 hover:border-[rgba(122,32,56,0.28)] hover:bg-[rgba(243,232,220,0.92)]',
  navPrimary:
    'rounded-full bg-[var(--wine)] px-4 py-2 text-[0.95rem] font-semibold text-[#fff7ef] shadow-[0_10px_24px_rgba(122,32,56,0.24)] hover:-translate-y-0.5 hover:bg-[var(--wine-soft)]',
  simpleRose:
    'w-full justify-start rounded-xl border border-transparent px-3.5 py-2.5 text-left text-[var(--text-main)] hover:border-[var(--line)] hover:bg-[var(--rose)] hover:text-[var(--wine)]',
  adminFunctions:
    'w-full rounded-2xl border border-[var(--line)] bg-[rgba(255,248,237,0.9)] px-5 py-4 text-center italic text-[var(--text-main)] shadow-[0_14px_28px_rgba(80,42,23,0.1)] hover:-translate-y-0.5 hover:bg-[rgba(243,232,220,0.9)]',
  homepage:
    'px-2 py-1 font-["Cormorant_Garamond"] text-[2rem] font-semibold leading-none tracking-[0.02em] text-[var(--text-main)] hover:text-[var(--wine)] md:text-[2.45rem]',
}

const variantClass = computed(() => `${baseClasses} ${variantMap[props.variant] || ''}`)
</script>
