<template>
  <component
    :is="as"
    :class="['dashboard-panel text-[var(--text-main)]', rounded, padding]"
  >
    <slot />
  </component>
</template>

<script setup>
defineProps({
  as: { type: String, default: 'div' },
  padding: { type: String, default: 'p-6' },
  rounded: { type: String, default: 'rounded-xl' },
})
</script>
