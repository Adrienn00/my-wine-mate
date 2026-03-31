<template>
  <section class="page-shell">
    <div class="page-frame page-stack max-w-4xl">
      <div class="page-actions">
        <BaseButton to="/profile" variant="secondary">Back</BaseButton>
      </div>

      <div class="section-intro text-center">
        <div class="section-kicker">Profile Settings</div>
        <h1 class="section-title">Recipe Preferences</h1>
        <p class="section-summary mx-auto">
          Save the recipe categories and ingredient styles you enjoy most so pairings feel more
          relevant across the app.
        </p>
      </div>

      <div
        class="glass-panel mx-auto flex max-h-150 w-full max-w-3xl flex-col justify-start gap-6 overflow-auto rounded-[2rem] p-8 text-[var(--text-main)]"
      >
        <template v-if="!isEditing">
          <div class="section-intro mb-0 text-center">
            <div class="micro-label">Current Setup</div>
            <h2 class="text-[2rem]">Saved Recipe Preferences</h2>
          </div>

          <div class="grid gap-3 text-left text-[var(--text-muted)] md:grid-cols-2">
            <div class="soft-card rounded-2xl p-4">
              <span class="font-bold text-[var(--text-main)]">Recipe categories:</span>
              {{ pretty(prefs.recipeCategories) }}
            </div>
            <div class="soft-card rounded-2xl p-4">
              <span class="font-bold text-[var(--text-main)]">Dish types:</span>
              {{ pretty(prefs.recipeDishTypes) }}
            </div>
            <div class="soft-card rounded-2xl p-4">
              <span class="font-bold text-[var(--text-main)]">Main ingredients:</span>
              {{ pretty(prefs.recipeMainIngredients) }}
            </div>
            <div class="soft-card rounded-2xl p-4">
              <span class="font-bold text-[var(--text-main)]">Preferred meat types:</span>
              {{ pretty(prefs.recipeMeatTypes) }}
            </div>
          </div>

          <BaseButton variant="primary" class="mx-auto mt-2" @click="startEdit">Edit</BaseButton>
        </template>

        <template v-else>
          <div class="section-intro mb-0 text-center">
            <div class="micro-label">Editing</div>
            <h2 class="text-[2rem]">Update Your Recipe Preferences</h2>
          </div>

          <div class="space-y-1 text-left">
            <div class="micro-label">Recipe categories</div>
            <BaseMultiselect
              v-model="draft.recipeCategories"
              :options="recipeCategoryOptions"
              :multiple="true"
              placeholder="Select the recipe categories you like"
            />
          </div>

          <div class="space-y-1 text-left">
            <div class="micro-label">Dish types</div>
            <BaseMultiselect
              v-model="draft.recipeDishTypes"
              :options="recipeDishTypeOptions"
              :multiple="true"
              placeholder="Select the dish types you are looking for"
            />
          </div>

          <div class="space-y-1 text-left">
            <div class="micro-label">Main ingredients</div>
            <BaseMultiselect
              v-model="draft.recipeMainIngredients"
              :options="recipeMainIngredientOptions"
              :multiple="true"
              placeholder="Select your preferred main ingredients"
            />
          </div>

          <div class="space-y-1 text-left">
            <div class="micro-label">Preferred meat types</div>
            <BaseMultiselect
              v-model="draft.recipeMeatTypes"
              :options="recipeMeatTypeOptions"
              :multiple="true"
              placeholder="If it contains meat, what kind do you prefer?"
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
