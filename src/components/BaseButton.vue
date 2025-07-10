<template>
  <button :class="['px-6 py-2 rounded', variantClass]" v-bind="$attrs">
    <slot />
  </button>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  variant: {
    type: String,
    default: 'primary',
  },
})

const baseClasses = 'rounded px-4 py-2 transition'

const variantMap = {
  primary: 'bg-red-900 hover:bg-red-800 text-white',
  secondary: 'bg-red-900 hover:bg-red-800 text-white',
  simple: 'hover:underline text-yellow-100',
}

const variantClass = computed(() => `${baseClasses} ${variantMap[props.variant] || ''}`)
</script>
