<template>
  <PageFrame>
    <BaseCard as="section" class="hero-sheen overflow-hidden" padding="p-6 md:p-8">
      <div class="relative z-10">
        <SectionHeader
          kicker="Recommendations"
          title="Wines picked for you"
          description="Your personalized picks are based on the preferences you set in your profile. The popular section shows top-rated wines from the whole catalog."
        />
      </div>
      <div class="mt-4">
        <BaseButton to="/profile" variant="secondary">Back to Profile</BaseButton>
      </div>
    </BaseCard>

    <div v-if="loading" class="py-16 text-center text-[var(--text-muted)]">Loading…</div>

    <template v-else>
      <BaseCard as="section" padding="p-5 md:p-7">
        <div class="mb-5 flex flex-wrap items-end justify-between gap-3">
          <div>
            <SectionHeader
              variant="card"
              title-tag="h2"
              title="Personalized for you"
              :description="personal.length ? 'Based on your saved preferences.' : 'Set preferences in your profile to get personalized picks.'"
            />
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
      </BaseCard>

      <BaseCard as="section" padding="p-5 md:p-7">
        <div class="mb-5 flex flex-wrap items-end justify-between gap-3">
          <div>
            <SectionHeader
              variant="card"
              title-tag="h2"
              title="Popular wines"
              :description="`Top-rated wines from the catalog${personal.length ? ', not shown above' : ''}.`"
            />
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
      </BaseCard>
    </template>
  </PageFrame>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useProfileStore } from '../stores/profileStore'
import BaseButton from '../components/ui/BaseButton.vue'
import PageFrame from '../components/ui/PageFrame.vue'
import BaseCard from '../components/ui/BaseCard.vue'
import SectionHeader from '../components/ui/SectionHeader.vue'
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
