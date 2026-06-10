<template>
  <div class="w-full">
    <label v-if="label" :for="id" class="mb-1.5 block text-sm font-semibold text-[var(--text-main)]">
      {{ label }}
    </label>
    <textarea
      v-if="textarea"
      :id="id"
      v-model="model"
      rows="4"
      :class="[inputClasses, 'min-h-[8rem] resize-y']"
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
    'mb-4 w-full border bg-[var(--surface)] px-4 py-3 text-sm text-[var(--text-main)] outline-none transition-all shadow-[inset_0_1px_0_rgba(255,255,255,0.7)] placeholder:text-[var(--text-muted)]/60 focus:border-[var(--wine)] focus:ring-2 focus:ring-[rgba(107,45,62,0.14)]'
  const shape = props.textarea ? 'rounded-xl' : 'rounded-full'
  const borderColor = props.error ? 'border-[var(--danger)]' : 'border-[var(--line)]'
  return `${base} ${shape} ${borderColor}`
})
</script>
