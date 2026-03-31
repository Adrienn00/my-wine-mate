<template>
  <div class="mx-auto mb-4 mt-2 max-w-xl text-left">
    <BaseButton to="/profile" variant="secondary">Back</BaseButton>
  </div>

  <div class="text-center text-4xl text-[var(--text-main)]">Wine Preferences</div>

  <div
    class="glass-panel my-6 mx-auto flex max-h-150 max-w-xl flex-col justify-start gap-6 overflow-auto rounded-2xl border border-[var(--line)] p-8 text-center text-[var(--text-main)]"
  >
    <!-- View mode -->
    <template v-if="!isEditing">
      <div class="text-2xl font-semibold">Saved Preferences</div>

      <div class="space-y-2 text-left font-normal not-italic text-[var(--text-muted)]">
        <div><span class="font-bold">Wine types:</span> {{ pretty(prefs.wineTypes) }}</div>
        <div><span class="font-bold">Style:</span> {{ pretty(prefs.style) }}</div>
        <div><span class="font-bold">Flavor profile:</span> {{ pretty(prefs.flavourProfile) }}</div>
        <div><span class="font-bold">Region:</span> {{ pretty(prefs.regions) }}</div>
        <div><span class="font-bold">Price range:</span> {{ pretty(prefs.priceRanges) }}</div>
        <div><span class="font-bold">Alcohol level:</span> {{ pretty(prefs.alcoholLevels) }}</div>
        <div>
          <span class="font-bold">Food preferences:</span> {{ pretty(prefs.foodPreferences) }}
        </div>
        <div><span class="font-bold">Wine year:</span> {{ prettyOne(prefs.wineYears) }}</div>
      </div>

      <BaseButton variant="primary" class="mx-auto mt-4" @click="startEdit">
        Edit
      </BaseButton>
    </template>

    <!-- Edit mode -->
    <template v-else>
      <div class="text-2xl font-semibold">Edit Preferences</div>

      <div>Wine type</div>

      <BaseMultiselect
        v-model="draft.wineTypes"
        :options="wineTypeOptions"
        :multiple="true"
        placeholder="Select your favorite wine types"
      />

      <BaseMultiselect
        v-model="draft.style"
        :options="wineStyleOptions"
        :multiple="true"
        placeholder="Select your preferred styles"
      />

      <BaseMultiselect
        v-model="draft.flavourProfile"
        :options="flavourProfileOptions"
        :multiple="true"
        placeholder="Select your preferred flavor profiles"
      />

      <BaseMultiselect
        v-model="draft.regions"
        :options="regionsOptions"
        :multiple="true"
        placeholder="Select region(s)"
      />

      <BaseMultiselect
        v-model="draft.priceRanges"
        :options="priceRangesOptions"
        :multiple="true"
        placeholder="Select price ranges"
      />

      <BaseMultiselect
        v-model="draft.alcoholLevels"
        :options="alcoholLevelsOptions"
        :multiple="true"
        placeholder="Select alcohol levels"
      />

      <BaseMultiselect
        v-model="draft.foodPreferences"
        :options="foodTypePreferences"
        :multiple="true"
        placeholder="Select your food preferences"
      />

      <BaseMultiselect
        v-model="draft.wineYears"
        :options="yearPreferences"
        :multiple="false"
        placeholder="Select wine year"
      />

      <div class="mt-2 flex justify-center gap-3">
        <BaseButton variant="primary" :disabled="saving" @click="saveEdit">
          {{ saving ? 'Saving...' : 'Save' }}
        </BaseButton>
        <BaseButton variant="secondary" :disabled="saving" @click="cancelEdit"> Cancel </BaseButton>
      </div>
    </template>
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { useProfileStore } from '../stores/profileStore'
import { useWinesStore } from '../stores/winesStore'
import BaseMultiselect from '../components/ui/BaseMultiselect.vue'
import BaseButton from '../components/ui/BaseButton.vue'
import { buildPreferenceOptionsFromWines } from '../services/preferenceOptions'

const profileStore = useProfileStore()
const winesStore = useWinesStore()

// Load data from the database.
onMounted(async () => {
  await Promise.all([profileStore.fetchProfile(), winesStore.getAllWines()])
})

// Preferences currently stored in the Pinia store.
const prefs = computed(() => profileStore.selectedPreferences)

const dynamicOptions = computed(() =>
  buildPreferenceOptionsFromWines(winesStore.confirmedWines, profileStore.selectedPreferences)
)

const fallbackOptions = computed(() => profileStore.wineType || {})

const pickOptions = (key) => {
  const dynamic = dynamicOptions.value[key] || []
  if (dynamic.length) return dynamic
  return fallbackOptions.value[key] || []
}

const wineTypeOptions = computed(() => pickOptions('wineTypes'))
const wineStyleOptions = computed(() => pickOptions('style'))
const flavourProfileOptions = computed(() => pickOptions('flavourProfile'))
const regionsOptions = computed(() => pickOptions('regions'))
const priceRangesOptions = computed(() => pickOptions('priceRanges'))
const alcoholLevelsOptions = computed(() => pickOptions('alcoholLevels'))
const foodTypePreferences = computed(() => pickOptions('foodPreferences'))
const yearPreferences = computed(() => pickOptions('wineYears'))

const isEditing = ref(false)
const saving = ref(false)

// Draft state used while editing.
const draft = reactive({
  wineTypes: [],
  style: [],
  flavourProfile: [],
  regions: [],
  alcoholLevels: [],
  foodPreferences: [],
  wineYears: '',
  priceRanges: [],
})

function fillDraftFromPrefs() {
  draft.wineTypes = [...(prefs.value.wineTypes || [])]
  draft.style = [...(prefs.value.style || [])]
  draft.flavourProfile = [...(prefs.value.flavourProfile || [])]
  draft.regions = [...(prefs.value.regions || [])]
  draft.alcoholLevels = [...(prefs.value.alcoholLevels || [])]
  draft.foodPreferences = [...(prefs.value.foodPreferences || [])]
  draft.priceRanges = [...(prefs.value.priceRanges || [])]
  draft.wineYears = prefs.value.wineYears || ''
}

function startEdit() {
  fillDraftFromPrefs()
  isEditing.value = true
}

function cancelEdit() {
  isEditing.value = false
}

async function saveEdit() {
  saving.value = true
  try {
    const payload = {
      preferences: {
        wineTypes: draft.wineTypes,
        style: draft.style,
        flavourProfile: draft.flavourProfile,
        regions: draft.regions,
        alcoholLevels: draft.alcoholLevels,
        foodPreferences: draft.foodPreferences,
        wineYears: draft.wineYears,
        priceRanges: draft.priceRanges,
      },
    }

    await profileStore.updateProfile(payload)

    // Refresh the store from the database to keep everything in sync.
    await profileStore.fetchProfile()

    isEditing.value = false
  } finally {
    saving.value = false
  }
}

function pretty(arr) {
  if (!arr || arr.length === 0) return '—'
  return Array.isArray(arr) ? arr.join(', ') : String(arr)
}
function prettyOne(v) {
  if (v === null || v === undefined || v === '') return '—'
  return String(v)
}
</script>
