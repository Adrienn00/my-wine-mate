<template>
  <div class="max-w-6xl mx-auto px-4 py-6 text-[var(--text-main)]">
    <div class="mb-4">
      <BaseButton to="/admin" variant="secondary">Back</BaseButton>
    </div>

    <div class="mb-8 text-center">
      <span class="section-kicker">Control Center</span>
      <h1 class="section-title">System Statistics</h1>
    </div>

    <div v-if="loading" class="py-20 text-center text-[var(--text-muted)]">Loading…</div>

    <template v-else>

      <!-- 1. Catalog overview -->
      <section class="glass-panel mb-6 rounded-[1.8rem] p-6">
        <h2 class="mb-5 text-xl font-semibold">Catalog overview</h2>
        <div class="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          <div v-for="card in catalogCards" :key="card.label"
            class="rounded-2xl border border-[var(--line)] bg-white/55 p-4 text-center">
            <div class="text-3xl font-bold text-[var(--wine)]">{{ card.value ?? '—' }}</div>
            <div class="mt-1 text-sm text-[var(--text-muted)]">{{ card.label }}</div>
            <div v-if="card.sub" class="mt-1 text-xs text-[var(--text-muted)]">{{ card.sub }}</div>
          </div>
        </div>
      </section>

      <!-- 2. Recommendation quality -->
      <section class="glass-panel mb-6 rounded-[1.8rem] p-6">
        <h2 class="mb-1 text-xl font-semibold">Recommendation quality</h2>
        <p class="mb-5 text-sm text-[var(--text-muted)]">
          Based on user "Good match / Bad match" votes — only admin-approved feedback is counted.
        </p>

        <div class="grid gap-4 sm:grid-cols-3">
          <div v-for="card in qualityCards" :key="card.label"
            class="rounded-2xl border border-[var(--line)] bg-white/55 p-5">
            <div class="text-sm text-[var(--text-muted)]">{{ card.label }}</div>
            <div class="mt-2 text-4xl font-bold" :class="accuracyColor(card.percent)">
              {{ card.percent != null ? card.percent + '%' : '—' }}
            </div>
            <div class="mt-1 text-xs text-[var(--text-muted)]">{{ card.sub }}</div>
            <!-- accuracy bar -->
            <div class="mt-3 h-2 w-full overflow-hidden rounded-full bg-[var(--line)]">
              <div class="h-full rounded-full transition-all"
                :class="accuracyBarColor(card.percent)"
                :style="{ width: (card.percent ?? 0) + '%' }" />
            </div>
          </div>
        </div>

        <div class="mt-4 rounded-xl border border-[var(--gold)]/40 bg-[var(--gold)]/5 p-4">
          <div class="text-sm font-semibold">LLM silver labels</div>
          <div class="mt-2 flex flex-wrap gap-6 text-sm text-[var(--text-muted)]">
            <span>Auto-approved: <strong class="text-[#215d31]">{{ quality.llm?.autoApproved ?? 0 }}</strong></span>
            <span>Pending review: <strong class="text-[#7b5a12]">{{ quality.llm?.pending ?? 0 }}</strong></span>
            <span>Total: <strong>{{ (quality.llm?.autoApproved ?? 0) + (quality.llm?.pending ?? 0) }}</strong></span>
          </div>
        </div>
      </section>

      <!-- 3. Model performance -->
      <section class="glass-panel mb-6 rounded-[1.8rem] p-6">
        <h2 class="mb-1 text-xl font-semibold">Model performance</h2>
        <p class="mb-5 text-sm text-[var(--text-muted)]">
          XGBoost pairing model — metrics and history from the latest training runs.
        </p>

        <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div class="rounded-2xl border border-[var(--line)] bg-white/55 p-5">
            <div class="text-sm text-[var(--text-muted)]">Test accuracy</div>
            <div class="mt-2 text-4xl font-bold text-[var(--wine)]">
              {{ modelMetrics?.accuracy != null ? pct(modelMetrics.accuracy) + '%' : '—' }}
            </div>
          </div>
          <div class="rounded-2xl border border-[var(--line)] bg-white/55 p-5">
            <div class="text-sm text-[var(--text-muted)]">ROC AUC</div>
            <div class="mt-2 text-4xl font-bold text-[var(--wine)]">
              {{ modelMetrics?.roc_auc != null ? modelMetrics.roc_auc.toFixed(3) : '—' }}
            </div>
          </div>
          <div class="rounded-2xl border border-[var(--line)] bg-white/55 p-5">
            <div class="text-sm text-[var(--text-muted)]">Training rows</div>
            <div class="mt-2 text-4xl font-bold text-[var(--wine)]">{{ modelMetrics?.rows ?? '—' }}</div>
            <div v-if="modelMetrics" class="mt-1 text-xs text-[var(--text-muted)]">
              {{ modelMetrics.label_breakdown?.good ?? 0 }} good · {{ modelMetrics.label_breakdown?.bad ?? 0 }} bad
            </div>
          </div>
          <div class="rounded-2xl border border-[var(--line)] bg-white/55 p-5">
            <div class="text-sm text-[var(--text-muted)]">Feedback in training</div>
            <div class="mt-2 text-4xl font-bold text-[var(--wine)]">
              {{ modelMetrics?.feedback_rows_used ?? '—' }}
            </div>
            <div v-if="modelMetrics?.llm_feedback_rows != null" class="mt-1 text-xs text-[var(--text-muted)]">
              {{ modelMetrics.llm_feedback_rows }} LLM · {{ modelMetrics.user_feedback_rows }} user
            </div>
          </div>
        </div>

        <!-- Training data source breakdown bar -->
        <div v-if="modelMetrics" class="mt-5 rounded-xl border border-[var(--line)] bg-white/45 p-4">
          <div class="mb-3 text-sm font-semibold">Training data sources</div>
          <div class="flex h-5 w-full overflow-hidden rounded-full">
            <div class="bg-[var(--wine)] transition-all" :style="{ width: rulesBarPct + '%' }"
              :title="`Rules: ${rulesRows} rows`" />
            <div class="bg-[var(--gold)] transition-all" :style="{ width: heuristicBarPct + '%' }"
              :title="`Heuristic: ${modelMetrics.heuristic_rows_used} rows`" />
            <div class="bg-[#5a9e6f] transition-all" :style="{ width: feedbackBarPct + '%' }"
              :title="`Feedback: ${modelMetrics.feedback_rows_used} rows`" />
          </div>
          <div class="mt-3 flex flex-wrap gap-5 text-xs text-[var(--text-muted)]">
            <span class="flex items-center gap-1.5">
              <span class="inline-block h-2.5 w-2.5 rounded-full bg-[var(--wine)]" />
              Rules ({{ rulesRows }})
            </span>
            <span class="flex items-center gap-1.5">
              <span class="inline-block h-2.5 w-2.5 rounded-full bg-[var(--gold)]" />
              Heuristic ({{ modelMetrics.heuristic_rows_used }})
            </span>
            <span class="flex items-center gap-1.5">
              <span class="inline-block h-2.5 w-2.5 rounded-full bg-[#5a9e6f]" />
              Feedback ({{ modelMetrics.feedback_rows_used }})
            </span>
          </div>
        </div>

        <!-- Training history table -->
        <div v-if="trainingHistory.length" class="mt-5">
          <div class="mb-2 text-sm font-semibold">Training history (last {{ trainingHistory.length }} runs)</div>
          <div class="overflow-x-auto rounded-xl border border-[var(--line)]">
            <table class="w-full text-sm">
              <thead class="bg-white/60 text-left text-xs text-[var(--text-muted)]">
                <tr>
                  <th class="px-4 py-2">Date</th>
                  <th class="px-4 py-2">Trigger</th>
                  <th class="px-4 py-2">Rows</th>
                  <th class="px-4 py-2">Feedback</th>
                  <th class="px-4 py-2">Accuracy</th>
                  <th class="px-4 py-2">ROC AUC</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(run, i) in trainingHistory" :key="i"
                  class="border-t border-[var(--line)] bg-white/40">
                  <td class="px-4 py-2 text-xs">{{ formatDate(run.completedAt) }}</td>
                  <td class="px-4 py-2">
                    <span class="rounded-full px-2 py-0.5 text-xs font-semibold"
                      :class="run.triggerSource === 'auto'
                        ? 'bg-[rgba(210,239,214,0.9)] text-[#215d31]'
                        : 'bg-[rgba(122,32,56,0.1)] text-[var(--wine)]'">
                      {{ run.triggerSource ?? 'admin' }}
                    </span>
                  </td>
                  <td class="px-4 py-2">{{ run.rows ?? '—' }}</td>
                  <td class="px-4 py-2">{{ run.approvedFeedbackCount ?? 0 }}</td>
                  <td class="px-4 py-2 font-semibold"
                    :class="accuracyColor(run.accuracy != null ? Math.round(run.accuracy * 100) : null)">
                    {{ run.accuracy != null ? pct(run.accuracy) + '%' : '—' }}
                  </td>
                  <td class="px-4 py-2">{{ run.roc_auc != null ? run.roc_auc.toFixed(3) : '—' }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <!-- 4. Wine ratings Top 5 -->
      <section class="glass-panel rounded-[1.8rem] p-6">
        <div class="mb-5 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 class="text-xl font-semibold">Wine ratings</h2>
            <p class="mt-1 text-sm text-[var(--text-muted)]">
              Top 5 most-rated wines · average rating:
              <strong>{{ ratings.avgRating != null ? ratings.avgRating + ' / 5' : '—' }}</strong>
              ({{ ratings.totalRatings }} ratings total)
            </p>
          </div>
        </div>
        <div v-if="ratings.topRatedWines?.length" class="space-y-3">
          <div v-for="wine in ratings.topRatedWines" :key="wine._id"
            class="flex items-center gap-4 rounded-xl border border-[var(--line)] bg-white/55 px-4 py-3">
            <div class="flex-1 min-w-0">
              <div class="truncate font-semibold">{{ wine.name }}</div>
              <div class="text-xs text-[var(--text-muted)]">{{ wine.ratingsCount }} ratings</div>
            </div>
            <!-- star display -->
            <div class="flex items-center gap-1">
              <span v-for="star in 5" :key="star"
                class="text-lg leading-none"
                :class="star <= Math.round(wine.avgRating ?? 0) ? 'text-[var(--gold)]' : 'text-[var(--line)]'">
                ★
              </span>
              <span class="ml-2 text-sm font-semibold text-[var(--wine)]">{{ wine.avgRating ?? '—' }}</span>
            </div>
          </div>
        </div>
        <div v-else class="rounded-xl border border-dashed border-[var(--line)] p-8 text-center text-sm text-[var(--text-muted)]">
          No wine ratings yet.
        </div>
      </section>

    </template>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useAdminStore } from '@/stores/adminStore'
import BaseButton from '../ui/BaseButton.vue'

const adminStore = useAdminStore()
const loading = ref(true)

const raw = computed(() => adminStore.stats || {})
const catalog = computed(() => raw.value.catalog || {})
const quality = computed(() => raw.value.recommendationQuality || {})
const model = computed(() => raw.value.modelPerformance || {})
const ratings = computed(() => raw.value.wineRatings || {})
const modelMetrics = computed(() => model.value.metrics || null)
const trainingHistory = computed(() => model.value.trainingHistory || [])

const catalogCards = computed(() => [
  { label: 'Users', value: catalog.value.usersCount, sub: catalog.value.adminUsersCount != null ? `${catalog.value.adminUsersCount} admin` : null },
  { label: 'Wines', value: catalog.value.winesCount, sub: `${catalog.value.confirmedWinesCount ?? 0} confirmed · ${catalog.value.pendingWinesCount ?? 0} pending` },
  { label: 'Recipes', value: catalog.value.recipesCount, sub: `${catalog.value.confirmedRecipesCount ?? 0} confirmed · ${catalog.value.pendingRecipesCount ?? 0} pending` },
  { label: 'Active pairing rules', value: catalog.value.activePairingRulesCount },
  { label: 'Wine ratings', value: ratings.value.totalRatings, sub: ratings.value.avgRating != null ? `avg ${ratings.value.avgRating} / 5` : null },
])

const qualityCards = computed(() => [
  {
    label: 'Overall accuracy',
    percent: quality.value.accuracyPercent ?? null,
    sub: `${quality.value.feedbackGood ?? 0} good · ${quality.value.feedbackBad ?? 0} bad · ${quality.value.feedbackTotal ?? 0} total`,
  },
  {
    label: 'Wine → Recipe',
    percent: quality.value.wineToRecipe?.accuracyPercent ?? null,
    sub: `${quality.value.wineToRecipe?.good ?? 0} good / ${quality.value.wineToRecipe?.total ?? 0} votes`,
  },
  {
    label: 'Recipe → Wine',
    percent: quality.value.recipeToWine?.accuracyPercent ?? null,
    sub: `${quality.value.recipeToWine?.good ?? 0} good / ${quality.value.recipeToWine?.total ?? 0} votes`,
  },
])

const rulesRows = computed(() => {
  const m = modelMetrics.value
  if (!m) return 0
  return (m.rows ?? 0) - (m.heuristic_rows_used ?? 0) - (m.feedback_rows_used ?? 0)
})
const rulesBarPct = computed(() => pctOf(rulesRows.value, modelMetrics.value?.rows))
const heuristicBarPct = computed(() => pctOf(modelMetrics.value?.heuristic_rows_used, modelMetrics.value?.rows))
const feedbackBarPct = computed(() => pctOf(modelMetrics.value?.feedback_rows_used, modelMetrics.value?.rows))

function pctOf(part, total) {
  if (!total || part == null) return 0
  return Math.round((part / total) * 100)
}
function pct(decimal) {
  return Math.round(decimal * 100)
}
function accuracyColor(percent) {
  if (percent == null) return 'text-[var(--text-muted)]'
  if (percent >= 75) return 'text-[#215d31]'
  if (percent >= 50) return 'text-[#7b5a12]'
  return 'text-[var(--danger)]'
}
function accuracyBarColor(percent) {
  if (percent == null || percent === 0) return 'bg-[var(--line)]'
  if (percent >= 75) return 'bg-[#5a9e6f]'
  if (percent >= 50) return 'bg-[var(--gold)]'
  return 'bg-[var(--danger)]'
}
function formatDate(value) {
  if (!value) return '—'
  return new Date(value).toLocaleDateString('hu-HU', { year: 'numeric', month: 'short', day: 'numeric' })
}

onMounted(async () => {
  await adminStore.fetchStats()
  loading.value = false
})
</script>
