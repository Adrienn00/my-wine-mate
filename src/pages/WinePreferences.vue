<template>
  <section class="page-shell">
    <div class="page-frame page-stack max-w-4xl">
      <div class="page-actions">
        <BaseButton to="/profile" variant="secondary">Back</BaseButton>
      </div>

      <div class="section-intro text-center">
        <div class="section-kicker">Profile Settings</div>
        <h1 class="section-title">Wine Preferences</h1>
        <p class="section-summary mx-auto">
          Keep your wine profile in one place so search results and future recommendations stay
          aligned with your taste.
        </p>
      </div>

      <div
        class="glass-panel mx-auto flex max-h-150 w-full max-w-3xl flex-col justify-start gap-6 overflow-auto rounded-[2rem] p-8 text-[var(--text-main)]"
      >
        <template v-if="!isEditing">
          <div class="section-intro mb-0 text-center">
            <div class="micro-label">Current Setup</div>
            <h2 class="text-[2rem]">Saved Preferences</h2>
          </div>

          <div class="grid gap-3 text-left text-[var(--text-muted)] md:grid-cols-2">
            <div class="soft-card rounded-2xl p-4"><span class="font-bold text-[var(--text-main)]">Wine types:</span> {{ pretty(prefs.wineTypes) }}</div>
            <div class="soft-card rounded-2xl p-4"><span class="font-bold text-[var(--text-main)]">Style:</span> {{ pretty(prefs.style) }}</div>
            <div class="soft-card rounded-2xl p-4"><span class="font-bold text-[var(--text-main)]">Flavor profile:</span> {{ pretty(prefs.flavourProfile) }}</div>
            <div class="soft-card rounded-2xl p-4"><span class="font-bold text-[var(--text-main)]">Region:</span> {{ pretty(prefs.regions) }}</div>
            <div class="soft-card rounded-2xl p-4"><span class="font-bold text-[var(--text-main)]">Price range:</span> {{ pretty(prefs.priceRanges) }}</div>
            <div class="soft-card rounded-2xl p-4"><span class="font-bold text-[var(--text-main)]">Alcohol level:</span> {{ pretty(prefs.alcoholLevels) }}</div>
            <div class="soft-card rounded-2xl p-4 md:col-span-2"><span class="font-bold text-[var(--text-main)]">Food preferences:</span> {{ pretty(prefs.foodPreferences) }}</div>
            <div class="soft-card rounded-2xl p-4 md:col-span-2"><span class="font-bold text-[var(--text-main)]">Wine year:</span> {{ prettyOne(prefs.wineYears) }}</div>
          </div>

          <BaseButton variant="primary" class="mx-auto mt-2" @click="startEdit">Edit</BaseButton>
        </template>

        <template v-else>
          <div class="section-intro mb-0 text-center">
            <div class="micro-label">Editing</div>
            <h2 class="text-[2rem]">Update Your Preferences</h2>
          </div>

          <div class="space-y-1 text-left">
            <div class="micro-label">Wine type</div>
            <BaseMultiselect
              v-model="draft.wineTypes"
              :options="wineTypeOptions"
              :multiple="true"
              placeholder="Select your favorite wine types"
            />
          </div>

          <div class="space-y-1 text-left">
            <div class="micro-label">Style</div>
            <BaseMultiselect
              v-model="draft.style"
              :options="wineStyleOptions"
              :multiple="true"
              placeholder="Select your preferred styles"
            />
          </div>

          <div class="space-y-1 text-left">
            <div class="micro-label">Flavor profile</div>
            <BaseMultiselect
              v-model="draft.flavourProfile"
              :options="flavourProfileOptions"
              :multiple="true"
              placeholder="Select your preferred flavor profiles"
            />
          </div>

          <div class="space-y-1 text-left">
            <div class="micro-label">Region</div>
            <BaseMultiselect
              v-model="draft.regions"
              :options="regionsOptions"
              :multiple="true"
              placeholder="Select region(s)"
            />
          </div>

          <div class="space-y-1 text-left">
            <div class="micro-label">Price range</div>
            <BaseMultiselect
              v-model="draft.priceRanges"
              :options="priceRangesOptions"
              :multiple="true"
              placeholder="Select price ranges"
            />
          </div>

          <div class="space-y-1 text-left">
            <div class="micro-label">Alcohol level</div>
            <BaseMultiselect
              v-model="draft.alcoholLevels"
              :options="alcoholLevelsOptions"
              :multiple="true"
              placeholder="Select alcohol levels"
            />
          </div>

          <div class="space-y-1 text-left">
            <div class="micro-label">Food preferences</div>
            <BaseMultiselect
              v-model="draft.foodPreferences"
              :options="foodTypePreferences"
              :multiple="true"
              placeholder="Select your food preferences"
            />
          </div>

          <div class="space-y-1 text-left">
            <div class="micro-label">Wine year</div>
            <BaseMultiselect
              v-model="draft.wineYears"
              :options="yearPreferences"
              :multiple="false"
              placeholder="Select wine year"
            />
          </div>

          <div class="mt-2 flex justify-center gap-3">
            <BaseButton variant="primary" :disabled="saving" @click="saveEdit">
              {{ saving ? 'Saving...' : 'Save' }}
            </BaseButton>
            <BaseButton variant="secondary" :disabled="saving" @click="cancelEdit">
              Cancel
            </BaseButton>
          </div>
        </template>
      </div>
    </div>
  </section>
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
