<template>
  <div class="w-full">
    <label v-if="label" :for="id" class="block text-yellow-100 mb-1">{{ label }}</label>
    <input
      :id="id"
      :type="type"
      v-model="model"
      :class="inputClasses"
      :placeholder="placeholder"
      :list="datalistId"
    />
    <datalist v-if="datalist?.length > 0" :id="datalistId">
      <option v-for="(item, index) in datalist" :key="index" :value="item" />
    </datalist>
    <p v-if="error" class="text-xs text-red-600 mt-1">{{ error }}</p>
  </div>
</template>

<script setup>
import { computed } from 'vue'
const model = defineModel()

const props = defineProps({
  id: String,
  label: String,
  placeholder: String,
  datalist: Array,
  type: {
    type: String,
    default: 'text',
  },
  error: String,
  datalistId: String,
})

const inputClasses = computed(() => [
  'w-full py-2 px-4 border rounded bg-gray-800 text-white border-gray-700 focus:outline-none focus:ring focus:border-yellow-300 mb-6',
  props.error ? 'border-red-600' : 'border-gray-600',
])
</script>
