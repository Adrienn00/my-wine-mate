<template>
  <div class="flex justify-center p-8">
    <div
      class="glass-panel w-full max-w-5xl rounded-2xl border border-[var(--line)] p-8 text-[var(--text-main)]"
    >
      <div class="mb-4">
        <BaseButton to="/profile" variant="secondary">Vissza</BaseButton>
      </div>

      <h2 class="mb-6 text-center text-3xl font-semibold">Kedvenceid</h2>

      <div class="mb-6 flex justify-center space-x-4">
        <BaseButton
          :variant="activeTab === 'wines' ? 'primary' : 'secondary'"
          @click="activeTab = 'wines'"
        >
          Borok
        </BaseButton>
        <BaseButton
          :variant="activeTab === 'recipes' ? 'primary' : 'secondary'"
          @click="activeTab = 'recipes'"
        >
          Receptek
        </BaseButton>
      </div>

      <div v-if="activeTab === 'wines'">
        <div v-if="favoriteWines && favoriteWines.length">
          <div v-for="wine in favoriteWines" :key="wine._id || wine" class="mb-2 text-center">
            <BaseButton :to="`/wine/${wine._id || wine}?from=favorites`" variant="simple">
              {{ wine.name || 'Bor részletei' }}
            </BaseButton>
          </div>
        </div>
        <p v-else class="text-center text-[var(--text-muted)]">Nincs még kedvenc borod.</p>
      </div>

      <div v-else>
        <div v-if="favoriteRecipes && favoriteRecipes.length">
          <div
            v-for="recipe in favoriteRecipes"
            :key="recipe._id || recipe"
            class="mb-2 text-center"
          >
            <BaseButton :to="`/recipe/${recipe._id || recipe}`" variant="simple">
              {{ recipe.name || 'Recept megnyitása' }}
            </BaseButton>
          </div>
        </div>
        <p v-else class="text-center text-[var(--text-muted)]">Nincs még kedvenc recepted.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useProfileStore } from '../stores/profileStore'
import BaseButton from '../components/ui/BaseButton.vue'

const profileStore = useProfileStore()
const activeTab = ref('wines')

// Biztosítjuk, hogy üres tömb legyen az alapértelmezett, ha még nem töltött be
const favoriteWines = computed(() => profileStore.favoriteWines || [])
const favoriteRecipes = computed(() => profileStore.favoriteRecipes || [])

onMounted(async () => {
  // A legutóbbi backend javításod után ez már a populate-olt adatokat fogja hozni
  await profileStore.fetchProfile()
})
</script>
