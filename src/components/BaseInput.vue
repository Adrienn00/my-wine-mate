<template>
  <div class="w-full">
    <label :for="id" class="block text-yellow-100 mb-1">{{ label }}</label>
    <input :id="id" :type="type" v-model="model" :class="inputClasses" />
    <p v-if="error" class="text-xs text-red-600 mt-1">{{ error }}</p>
  </div>
</template>

<script setup>
import { computed } from 'vue'
const model = defineModel()

const inputClasses = computed(() => [
  'w-full py-2 px-3 border rounded bg-gray-800 text-white focus:outline-none focus:ring focus:border-yellow-300',
  props.error ? 'border-red-600' : 'border-gray-600',
])
const props = defineProps({
  id: String,
  label: String,
  type: {
    type: String,
    default: 'text',
  },
  error: String,
})
</script>
