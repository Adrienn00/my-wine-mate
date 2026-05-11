<template>
  <div class="page-shell">
    <div class="page-frame page-stack">

      <section class="dashboard-panel hero-sheen overflow-hidden rounded-xl p-6 md:p-8">
        <div class="relative z-10">
          <span class="section-kicker">Recommendations</span>
          <h1 class="section-title">Wines picked for you</h1>
          <p class="section-summary mt-3">
            Your personalized picks are based on the preferences you set in your profile. The
            popular section shows top-rated wines from the whole catalog.
          </p>
        </div>
        <div class="mt-4">
          <BaseButton to="/profile" variant="secondary">Back to Profile</BaseButton>
        </div>
      </section>

      <div v-if="loading" class="py-16 text-center text-[var(--text-muted)]">Loading…</div>

      <template v-else>

        <!-- Personalized section -->
        <section class="dashboard-panel rounded-xl p-5 md:p-7">
          <div class="mb-5 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 class="text-2xl font-semibold md:text-3xl">Personalized for you</h2>
              <p class="mt-1 text-sm text-[var(--text-muted)]">
                {{ personal.length ? 'Based on your saved preferences.' : 'Set preferences in your profile to get personalized picks.' }}
              </p>
            </div>
            <span class="micro-label">{{ personal.length }} wines</span>
          </div>

          <div v-if="personal.length" class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <WineRecommendationCard
              v-for="wine in personal"
              :key="wine._id"
              :wine="wine"
              badge-label="For you"
              badge-color="wine"
            />
          </div>

          <div v-else class="rounded-2xl border border-dashed border-[var(--line)] p-8 text-center">
            <p class="text-[var(--text-muted)]">No personalized results yet.</p>
            <BaseButton to="/preferences" variant="secondary" class="mt-4">
              Set my preferences
            </BaseButton>
          </div>
        </section>

        <!-- Popular section -->
        <section class="dashboard-panel rounded-xl p-5 md:p-7">
          <div class="mb-5 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 class="text-2xl font-semibold md:text-3xl">Popular wines</h2>
              <p class="mt-1 text-sm text-[var(--text-muted)]">
                Top-rated wines from the catalog{{ personal.length ? ', not shown above' : '' }}.
              </p>
            </div>
            <span class="micro-label">{{ general.length }} wines</span>
          </div>

          <div v-if="general.length" class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <WineRecommendationCard
              v-for="wine in general"
              :key="wine._id"
              :wine="wine"
              badge-label="Popular"
              badge-color="gold"
            />
          </div>

          <p v-else class="text-sm text-[var(--text-muted)]">No wines in the catalog yet.</p>
        </section>

      </template>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useProfileStore } from '../stores/profileStore'
import BaseButton from '../components/ui/BaseButton.vue'
import WineRecommendationCard from '../components/WineRecommendationCard.vue'
import client from '../components/httpService/client'

const profileStore = useProfileStore()

const loading = ref(true)
const personal = ref([])
const general = ref([])

onMounted(async () => {
  try {
    await profileStore.fetchProfile()
    const response = await client.post('wines/recommendations/split', {
      preferences: profileStore.selectedPreferences,
      limit: 6,
    })
    personal.value = response.personal || []
    general.value = response.general || []
  } catch (error) {
    console.error('Error loading recommendations:', error)
  } finally {
    loading.value = false
  }
})
</script>
