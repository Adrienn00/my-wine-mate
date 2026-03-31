<template>
  <div class="mx-auto mb-4 mt-2 max-w-xl text-left">
    <BaseButton to="/profile" variant="secondary">Vissza</BaseButton>
  </div>

  <div class="text-center text-4xl text-[var(--text-main)]">Hozzád illő receptek</div>

  <div
    class="glass-panel my-6 mx-auto flex max-h-150 max-w-xl flex-col justify-start gap-6 overflow-auto rounded-2xl border border-[var(--line)] p-8 text-center text-[var(--text-main)]"
  >
    <template v-if="!isEditing">
      <div class="text-2xl font-semibold">Elmentett recept preferenciáid</div>

      <div class="space-y-2 text-left font-normal not-italic text-[var(--text-muted)]">
        <div>
          <span class="font-bold">Recept kategóriák:</span> {{ pretty(prefs.recipeCategories) }}
        </div>
        <div><span class="font-bold">Ételtípus:</span> {{ pretty(prefs.recipeDishTypes) }}</div>
        <div>
          <span class="font-bold">Fő alapanyag:</span> {{ pretty(prefs.recipeMainIngredients) }}
        </div>
        <div>
          <span class="font-bold">Kedvelt húsfajták:</span> {{ pretty(prefs.recipeMeatTypes) }}
        </div>
      </div>

      <BaseButton variant="primary" class="mx-auto mt-4" @click="startEdit">
        Szerkesztés
      </BaseButton>
    </template>

    <template v-else>
      <div class="text-2xl font-semibold">Recept preferenciák szerkesztése</div>

      <BaseMultiselect
        v-model="draft.recipeCategories"
        :options="recipeCategoryOptions"
        :multiple="true"
        placeholder="Válaszd ki, milyen típusú recepteket szeretsz"
      />

      <BaseMultiselect
        v-model="draft.recipeDishTypes"
        :options="recipeDishTypeOptions"
        :multiple="true"
        placeholder="Válaszd ki, milyen ételtípusokat keresel"
      />

      <BaseMultiselect
        v-model="draft.recipeMainIngredients"
        :options="recipeMainIngredientOptions"
        :multiple="true"
        placeholder="Válaszd ki a kedvelt fő alapanyagokat"
      />

      <BaseMultiselect
        v-model="draft.recipeMeatTypes"
        :options="recipeMeatTypeOptions"
        :multiple="true"
        placeholder="Ha húsos, milyen hús legyen benne"
      />

      <div class="mt-2 flex justify-center gap-3">
        <BaseButton variant="primary" :disabled="saving" @click="saveEdit">
          {{ saving ? 'Mentés...' : 'Mentés' }}
        </BaseButton>
        <BaseButton variant="secondary" :disabled="saving" @click="cancelEdit">Mégse</BaseButton>
      </div>
    </template>
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { useProfileStore } from '../stores/profileStore'
import { useRecipesStore } from '../stores/recipesStore'
import BaseButton from '../components/ui/BaseButton.vue'
import BaseMultiselect from '../components/ui/BaseMultiselect.vue'
import { buildRecipePreferenceOptions } from '../services/recipePreferenceOptions'

const profileStore = useProfileStore()
const recipesStore = useRecipesStore()

onMounted(async () => {
  await Promise.all([profileStore.fetchProfile(), recipesStore.getAllRecipes()])
})

const prefs = computed(() => profileStore.selectedPreferences)

const dynamicOptions = computed(() =>
  buildRecipePreferenceOptions(recipesStore.confirmedRecipes, profileStore.selectedPreferences)
)

const fallbackOptions = computed(() => profileStore.wineType || {})

const pickOptions = (key) => {
  const dynamic = dynamicOptions.value[key] || []
  if (dynamic.length) return dynamic
  return fallbackOptions.value[key] || []
}

const recipeCategoryOptions = computed(() => pickOptions('recipeCategories'))
const recipeDishTypeOptions = computed(() => pickOptions('recipeDishTypes'))
const recipeMainIngredientOptions = computed(() => pickOptions('recipeMainIngredients'))
const recipeMeatTypeOptions = computed(() => pickOptions('recipeMeatTypes'))

const isEditing = ref(false)
const saving = ref(false)

const draft = reactive({
  recipeCategories: [],
  recipeDishTypes: [],
  recipeMainIngredients: [],
  recipeMeatTypes: [],
})

function fillDraftFromPrefs() {
  draft.recipeCategories = [...(prefs.value.recipeCategories || [])]
  draft.recipeDishTypes = [...(prefs.value.recipeDishTypes || [])]
  draft.recipeMainIngredients = [...(prefs.value.recipeMainIngredients || [])]
  draft.recipeMeatTypes = [...(prefs.value.recipeMeatTypes || [])]
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
        ...prefs.value,
        recipeCategories: draft.recipeCategories,
        recipeDishTypes: draft.recipeDishTypes,
        recipeMainIngredients: draft.recipeMainIngredients,
        recipeMeatTypes: draft.recipeMeatTypes,
      },
    }

    await profileStore.updateProfile(payload)
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
</script>
