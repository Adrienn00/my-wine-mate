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

const variantClass = computed(() => {
  switch (props.variant) {
    case 'primary':
      return 'bg-red-900 hover:bg-red-800 text-white'
    case 'secondary':
      return 'bg-red-900 hover:bg-red-800 text-white'
    case 'simple':
      return 'w-full text-left'
    default:
      return ''
  }
})
</script>
