<template>
  <div class="page-shell">
    <div
      :class="['page-frame grid gap-5', authStore.user ? 'xl:grid-cols-[290px_minmax(0,1fr)]' : '']"
    >
      <aside
        v-if="authStore.user"
        class="anim-fade-up dashboard-panel paper-grid h-fit rounded-[1.7rem] p-5 md:p-6"
      >
        <router-link
          to="/profile"
          class="flex items-center gap-4 rounded-2xl transition hover:bg-white/40 hover:px-2 hover:py-2"
        >
          <div
            class="flex h-14 w-14 items-center justify-center rounded-full border border-[var(--line)] bg-white/85 text-lg font-semibold text-[var(--wine)]"
          >
            {{ profileInitials }}
          </div>
          <div>
            <p class="text-sm text-[var(--text-muted)]">Welcome back,</p>
            <h2 class="text-2xl font-semibold">{{ profileName }}</h2>
          </div>
        </router-link>

        <div class="dashboard-divider my-5"></div>

        <section>
          <p class="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-[var(--wine)]">
            My Wine Cellar
          </p>
          <div class="space-y-2">
            <BaseButton to="/favorite" variant="simpleRose">Favorites</BaseButton>
            <BaseButton to="/foodPairing" variant="simpleRose">Past Pairings</BaseButton>
            <BaseButton to="/preferences" variant="simpleRose">Preferences</BaseButton>
            <BaseButton to="/recommended" variant="simpleRose">Recommendations</BaseButton>
          </div>
        </section>

        <div class="dashboard-divider my-5"></div>

        <section>
          <p class="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-[var(--wine)]">
            Snapshot
          </p>
          <div class="grid gap-3">
            <div class="rounded-2xl border border-[var(--line)] bg-white/80 p-4">
              <p class="text-xs uppercase tracking-[0.18em] text-[var(--text-muted)]">Wines</p>
              <p class="text-gold-shimmer mt-2 text-3xl font-semibold">{{ confirmedWineCount }}</p>
            </div>
            <div class="rounded-2xl border border-[var(--line)] bg-white/80 p-4">
              <p class="text-xs uppercase tracking-[0.18em] text-[var(--text-muted)]">Recipes</p>
              <p class="text-gold-shimmer mt-2 text-3xl font-semibold">{{ confirmedRecipeCount }}</p>
            </div>
          </div>
        </section>

        <div class="dashboard-divider my-5"></div>

        <section
          class="rounded-[1.45rem] bg-[linear-gradient(180deg,#5d1f32_0%,#6e2c43_100%)] p-5 text-[#f9ead7] shadow-[0_22px_34px_rgba(93,31,50,0.28)]"
        >
          <p class="text-xs font-semibold uppercase tracking-[0.2em] text-[#f4dcb6]">
            AI Sommelier
          </p>
          <h3 class="mt-3 text-2xl font-semibold leading-tight text-white">
            Chat for instant pairing ideas
          </h3>
          <p class="mt-3 text-sm leading-6 text-[#faefe3]">
            Tell me a wine, a mood, or a dish, and I'll point you to the best pairing route.
          </p>
          <div
            class="mt-4 rounded-2xl border border-[rgba(255,255,255,0.14)] bg-[rgba(255,248,239,0.1)] p-3 text-sm text-[#fff3e7]"
          >
            "I have a Pinot Noir. What should I cook tonight?"
          </div>
          <BaseButton
            to="/pairing-assistant"
            variant="secondary"
            class="mt-4 w-full !border-[rgba(255,255,255,0.32)] !bg-[#fff7ef] !text-[#5d1f32] shadow-[0_10px_24px_rgba(35,11,16,0.2)] hover:!bg-white"
          >
            Open Assistant
          </BaseButton>
        </section>
      </aside>

      <div class="anim-fade-up anim-d1 page-stack">
        <section
          class="relative overflow-hidden rounded-[1.7rem] bg-[linear-gradient(135deg,#5d1f32_0%,#7a3048_52%,#c7a367_130%)] p-6 text-[#fff3e7] shadow-[0_24px_48px_rgba(93,31,50,0.24)] md:p-8"
        >
          <div
            class="anim-float absolute right-[-3rem] top-[-2rem] h-40 w-40 rounded-full bg-[rgba(255,245,229,0.16)] blur-2xl"
          ></div>
          <div
            class="anim-float-slow absolute bottom-[-3rem] right-[18%] h-32 w-32 rounded-full bg-[rgba(255,214,145,0.18)] blur-2xl"
          ></div>

          <!-- Dekoratív tipográfiai elem -->
          <span
            aria-hidden="true"
            class="pointer-events-none absolute bottom-0 right-4 top-0 hidden select-none items-center overflow-hidden text-[9rem] font-semibold italic leading-none tracking-[0.04em] text-white opacity-[0.05] lg:flex"
            style="font-family:'Cormorant Garamond',Georgia,serif"
          >VINUM</span>

          <div
            class="relative grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(280px,0.8fr)] lg:items-center"
          >
            <div>
              <p class="anim-fade-in text-xs font-semibold uppercase tracking-[0.24em] text-[#f4dcb6]">
                AI Sommelier
              </p>
              <h1 class="anim-fade-up anim-d1 mt-3 max-w-3xl text-4xl font-semibold leading-[0.95] md:text-5xl">
                Ask for pairings like you are texting a sommelier.
              </h1>
              <p class="anim-fade-up anim-d2 mt-4 max-w-2xl text-sm leading-7 text-[#fff1e2] md:text-base">
                Describe a bottle, a dinner plan, or just a craving, and get a faster wine-food
                direction without digging through filters first.
              </p>
              <div class="anim-fade-up anim-d3 mt-6 flex flex-wrap gap-3">
                <BaseButton
                  to="/pairing-assistant"
                  variant="secondary"
                  class="!border-[rgba(255,255,255,0.32)] !bg-[#fff7ef] !text-[#5d1f32] shadow-[0_10px_24px_rgba(35,11,16,0.2)] hover:!bg-white"
                >
                  Open Sommelier Chat
                </BaseButton>
                <BaseButton to="/foodPairing" variant="navAccent">
                  Browse Classic Pairing
                </BaseButton>
              </div>
            </div>

            <div
              class="anim-fade-up anim-d4 hero-gold-pulse rounded-[1.5rem] border border-[rgba(255,255,255,0.16)] bg-[rgba(255,248,239,0.12)] p-4 backdrop-blur-sm"
            >
              <div
                class="rounded-[1.2rem] bg-[rgba(255,252,246,0.94)] p-4 text-[var(--text-main)] shadow-[0_12px_28px_rgba(45,20,27,0.18)]"
              >
                <p class="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--wine)]">
                  Example Prompt
                </p>
                <p class="mt-3 text-base leading-7">
                  I am making creamy mushroom pasta and want a white wine that still feels crisp.
                </p>
              </div>
              <div
                class="mt-3 rounded-[1.2rem] border border-[rgba(255,255,255,0.16)] bg-[rgba(93,31,50,0.28)] p-4 text-sm leading-7 text-[#fff3e7]"
              >
                Try a mineral Chardonnay or a fresher Sauvignon Blanc, especially if you want to
                balance the richness of the sauce.
              </div>
            </div>
          </div>
        </section>

        <template v-if="authStore.user">
          <div class="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.92fr)]">
            <BaseCard as="section" rounded="rounded-[1.6rem]" padding="p-5 md:p-6">
              <div class="mb-4 flex items-start justify-between gap-3">
                <SectionHeader
                  variant="card"
                  title-tag="h2"
                  kicker="Taste Profile"
                  title="Your saved preferences"
                />
                <BaseButton to="/preferences" variant="secondary">Edit</BaseButton>
              </div>

              <div class="flex flex-wrap gap-2">
                <span v-for="item in preferenceHighlights" :key="item" class="dashboard-chip">
                  {{ item }}
                </span>
                <p v-if="!preferenceHighlights.length" class="text-sm text-[var(--text-muted)]">
                  No preferences saved yet.
                </p>
              </div>

              <div class="mt-5 flex flex-wrap gap-3">
                <BaseButton to="/recipe-preferences" variant="secondary">
                  Recipe Preferences
                </BaseButton>
                <BaseButton to="/recommended" variant="secondary">Recommendations</BaseButton>
              </div>
            </BaseCard>

            <BaseCard as="section" rounded="rounded-[1.6rem]" padding="p-5 md:p-6">
              <p class="text-xs uppercase tracking-[0.22em] text-[var(--text-muted)]">
                Quick Actions
              </p>
              <div class="mt-4 grid gap-3">
                <BaseButton to="/profile" variant="secondary" class="justify-start">
                  Edit Profile
                </BaseButton>
                <BaseButton to="/addRecipe" variant="secondary" class="justify-start">
                  Add New Recipe
                </BaseButton>
                <BaseButton to="/addWine" variant="secondary" class="justify-start">
                  Add New Wine
                </BaseButton>
              </div>
            </BaseCard>
          </div>
        </template>

        <BaseCard
          v-else
          as="section"
          rounded="rounded-[1.6rem]"
          padding="p-6 md:p-8"
          class="text-center"
        >
          <SectionHeader
            variant="card"
            title-tag="h2"
            kicker="Get started"
            title="Unlock your personal wine experience"
          />
          <p class="mt-3 text-sm leading-6 text-[var(--text-muted)]">
            Create an account to save preferences, get personalized pairing recommendations, manage
            your wine cellar, and track your favorite recipes.
          </p>
          <div class="mt-6 flex flex-wrap justify-center gap-3">
            <BaseButton to="/signup" variant="primary">Create account</BaseButton>
            <BaseButton to="/login" variant="secondary">Log in</BaseButton>
          </div>
        </BaseCard>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useAuthStore } from '../stores/authStore'
import { useProfileStore } from '../stores/profileStore'
import { useRecipesStore } from '../stores/recipesStore'
import { useWinesStore } from '../stores/winesStore'
import BaseButton from '../components/ui/BaseButton.vue'
import BaseCard from '../components/ui/BaseCard.vue'
import SectionHeader from '../components/ui/SectionHeader.vue'

const winesStore = useWinesStore()
const recipesStore = useRecipesStore()
const authStore = useAuthStore()
const profileStore = useProfileStore()

const profileName = computed(() => profileStore.fullName || authStore.user?.firstName || 'Guest')
const profileInitials = computed(() => {
  const value = profileName.value.trim()
  if (!value) return 'G'
  return value
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || '')
    .join('')
})
const confirmedWineCount = computed(() => winesStore.confirmedWines.length)
const confirmedRecipeCount = computed(() => recipesStore.confirmedRecipes.length)
const preferenceHighlights = computed(() => {
  const prefs = profileStore.selectedPreferences || {}
  return [
    ...(prefs.wineTypes || []),
    ...(prefs.style || []),
    ...(prefs.flavourProfile || []),
    ...(prefs.recipeCategories || []),
  ]
    .filter(Boolean)
    .slice(0, 8)
})

onMounted(async () => {
  await Promise.all([
    winesStore.wines.length ? Promise.resolve() : winesStore.getAllWines(),
    recipesStore.recipes.length ? Promise.resolve() : recipesStore.getAllRecipes(),
    authStore.token ? profileStore.fetchProfile() : Promise.resolve(),
  ])
})
</script>
