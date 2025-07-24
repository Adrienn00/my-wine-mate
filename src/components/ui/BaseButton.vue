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

const baseClasses = 'rounded px-4 py-2 transition'

const variantMap = {
  primary: 'bg-gray-600 hover:bg-gray-500 rounded text-white',
  secondary: 'bg-red-900 hover:bg-red-800 text-white',
  login:
    'hover:bg-red-800 text-yellow-100 border-2 border-red-900 bg-red-900 rounded-xl p-2 px-6 rounded',
  simple: 'hover:underline text-yellow-100',
  simpleRose: 'text-left w-full hover:text-red-200',
  adminFunctions:
    'w-full text-center font-bold italic border-2 text-yellow-100 bg-gray-900 rounded-xl shadow-md p-4',
}

const variantClass = computed(() => `${baseClasses} ${variantMap[props.variant] || ''}`)
</script>
