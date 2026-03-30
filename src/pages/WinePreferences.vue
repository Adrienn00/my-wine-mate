<template>
  <div class="text-center text-4xl">Hozzád leginkább találó bor</div>

  <div
    class="flex flex-col justify-start gap-6 my-6 max-w-md mx-auto text-center font-bold italic border-2 text-yellow-100 max-h-150 overflow-auto bg-gray-900 rounded-lg shadow-lg p-8"
  >
    <!-- NÉZET MÓD -->
    <template v-if="!isEditing">
      <div class="text-2xl">Elmentett preferenciáid</div>

      <div class="text-left font-normal not-italic space-y-2">
        <div><span class="font-bold">Bor típusa:</span> {{ pretty(prefs.wineTypes) }}</div>
        <div><span class="font-bold">Stílus:</span> {{ pretty(prefs.style) }}</div>
        <div><span class="font-bold">Ízprofil:</span> {{ pretty(prefs.flavourProfile) }}</div>
        <div><span class="font-bold">Régió:</span> {{ pretty(prefs.regions) }}</div>
        <div><span class="font-bold">Árkategória:</span> {{ pretty(prefs.priceRanges) }}</div>
        <div><span class="font-bold">Alkoholtartalom:</span> {{ pretty(prefs.alcoholLevels) }}</div>
        <div>
          <span class="font-bold">Étel preferencia:</span> {{ pretty(prefs.foodPreferences) }}
        </div>
        <div><span class="font-bold">Bor év:</span> {{ prettyOne(prefs.wineYears) }}</div>
      </div>

      <BaseButton variant="login" class="mx-auto mt-4" @click="startEdit"> Szerkesztés </BaseButton>
    </template>

    <!-- SZERKESZTÉS MÓD -->
    <template v-else>
      <div class="text-2xl">Preferenciák szerkesztése</div>

      <div>Bor tipusa</div>

      <BaseMultiselect
        v-model="draft.wineTypes"
        :options="wineTypeOptions"
        :multiple="true"
        placeholder="Válaszd ki a kedvenc típusaid"
      />

      <BaseMultiselect
        v-model="draft.style"
        :options="wineStyleOptions"
        :multiple="true"
        placeholder="Válaszd ki a kedvelt"
      />

      <BaseMultiselect
        v-model="draft.flavourProfile"
        :options="flavourProfileOptions"
        :multiple="true"
        placeholder="Válaszd ki a kedvelt ízprofiljaid"
      />

      <BaseMultiselect
        v-model="draft.regions"
        :options="regionsOptions"
        :multiple="true"
        placeholder="Válaszd ki a régió(ka)t"
      />

      <BaseMultiselect
        v-model="draft.priceRanges"
        :options="priceRangesOptions"
        :multiple="true"
        placeholder="Válaszd ki az árakat"
      />

      <BaseMultiselect
        v-model="draft.alcoholLevels"
        :options="alcoholLevelsOptions"
        :multiple="true"
        placeholder="Válaszd ki az alkoholtartalmat"
      />

      <BaseMultiselect
        v-model="draft.foodPreferences"
        :options="foodTypePreferences"
        :multiple="true"
        placeholder="Válaszd ki az étkezési típusod"
      />

      <BaseMultiselect
        v-model="draft.wineYears"
        :options="yearPreferences"
        :multiple="false"
        placeholder="Válaszd ki a bor évet"
      />

      <div class="flex gap-3 justify-center mt-2">
        <BaseButton variant="login" @click="saveEdit" :disabled="saving">
          {{ saving ? 'Mentés...' : 'Mentés' }}
        </BaseButton>
        <BaseButton variant="secondary" @click="cancelEdit" :disabled="saving"> Mégse </BaseButton>
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

// betöltés DB-ből
onMounted(async () => {
  await Promise.all([profileStore.fetchProfile(), winesStore.getAllWines()])
})

// a STORE-ban lévő (betöltött) preferenciák
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

// draft szerkesztéshez
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

    // biztos ami biztos: frissítsük vissza a store-t is DB-ből
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
