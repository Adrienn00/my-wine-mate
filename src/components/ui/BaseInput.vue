<template>
  <div class="w-full">
    <label v-if="label" :for="id" class="mb-1.5 block text-sm font-medium text-[var(--text-muted)]">
      {{ label }}
    </label>
    <textarea
      v-if="textarea"
      :id="id"
      v-model="model"
      :class="[inputClasses, 'min-h-28 resize-y']"
      :placeholder="placeholder"
    />
    <input
      v-else
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
    <p v-if="error" class="mt-1 text-xs text-[var(--danger)]">{{ error }}</p>
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
  textarea: {
    type: Boolean,
    default: false,
  },
  type: {
    type: String,
    default: 'text',
  },
  error: String,
  datalistId: String,
})

const inputClasses = computed(() => {
  const base =
    'mb-4 w-full rounded-xl border bg-[rgba(255,250,243,0.92)] px-4 py-2.5 text-[var(--text-main)] outline-none transition placeholder:text-[rgba(122,100,91,0.65)] focus:border-[var(--wine)] focus:ring-2 focus:ring-[rgba(122,32,56,0.2)]'
  return `${base} ${props.error ? 'border-[var(--danger)]' : 'border-[var(--line)]'}`
})
</script>
