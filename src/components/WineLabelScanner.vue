<template>
  <div>
    <input
      ref="fileInput"
      type="file"
      accept="image/*"
      capture="environment"
      class="hidden"
      @change="onFileSelected"
    />

    <BaseButton variant="secondary" :disabled="scanning" @click="fileInput.click()">
      {{ scanning ? 'Scanning…' : '📸 Scan Label' }}
    </BaseButton>

    <!-- Result panel -->
    <div
      v-if="result || error"
      class="mt-4 rounded-xl border border-[var(--line)] bg-[var(--surface)] p-4 text-sm text-[var(--text-main)]"
    >
      <div v-if="error" class="text-[var(--danger)]">{{ error }}</div>

      <template v-else-if="result">
        <p class="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--text-muted)]">
          Label detected
        </p>

        <div class="grid grid-cols-2 gap-x-4 gap-y-1">
          <template v-for="(value, key) in displayFields" :key="key">
            <span v-if="value" class="font-semibold capitalize">{{ key }}:</span>
            <span v-if="value">{{ value }}</span>
          </template>
        </div>

        <p v-if="result.rawText" class="mt-3 text-xs italic text-[var(--text-muted)]">
          Raw: {{ result.rawText }}
        </p>

        <div class="mt-4 flex flex-wrap gap-2">
          <BaseButton variant="primary" @click="emit('use', result)">
            {{ useLabel }}
          </BaseButton>
          <BaseButton variant="secondary" @click="reset">Rescan</BaseButton>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import BaseButton from './ui/BaseButton.vue'
import client from './httpService/client'

const props = defineProps({
  useLabel: { type: String, default: 'Use this result' },
})

const emit = defineEmits(['use'])

const fileInput = ref(null)
const scanning = ref(false)
const result = ref(null)
const error = ref('')

const displayFields = computed(() => {
  if (!result.value) return {}
  const { name, winery, year, type, region, country, grapeVarieties, alcohol } = result.value
  return {
    name,
    winery,
    year,
    type,
    region: [region, country].filter(Boolean).join(', ') || null,
    grapes: Array.isArray(grapeVarieties) ? grapeVarieties.join(', ') : grapeVarieties,
    alcohol: alcohol ? `${alcohol}%` : null,
  }
})

async function onFileSelected(event) {
  const file = event.target.files?.[0]
  if (!file) return

  reset()
  scanning.value = true

  try {
    const base64 = await toBase64(file)
    const mimeType = file.type || 'image/jpeg'
    result.value = await client.post('wines/ocr-scan', { image: base64, mimeType })
  } catch (err) {
    error.value = err.message || 'Could not read the label. Please try a clearer photo.'
  } finally {
    scanning.value = false
    fileInput.value.value = ''
  }
}

function reset() {
  result.value = null
  error.value = ''
}

function toBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => resolve(e.target.result.split(',')[1])
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}
</script>
