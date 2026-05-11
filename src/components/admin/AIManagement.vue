<template>
  <div class="max-w-7xl mx-auto px-4 py-6 text-[var(--text-main)]">
    <div class="mb-4">
      <BaseButton to="/admin" variant="secondary">Back</BaseButton>
    </div>

    <div class="mb-8">
      <h2 class="text-3xl font-semibold">AI Management</h2>
      <p class="mt-2 max-w-3xl text-sm text-[var(--text-muted)]">
        Review pairing feedback, approve the rows that should be used for learning, then trigger
        retraining for the XGBoost pairing model.
      </p>
    </div>

    <div class="grid gap-6 lg:grid-cols-[1.15fr_1fr]">
      <section class="glass-panel rounded-2xl border border-[var(--line)] p-6">
        <div class="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 class="text-xl font-semibold">Training Overview</h3>
            <p class="mt-1 text-sm text-[var(--text-muted)]">
              Approved feedback is used for both retraining and the reviewed LLM feedback signal.
            </p>
          </div>
          <div class="flex flex-wrap gap-3">
            <BaseButton
              variant="secondary"
              :disabled="summaryLoading || approveAllLoading || !pendingCount"
              @click="approveAllPending"
            >
              {{ approveAllLoading ? 'Approving...' : 'Approve all pending' }}
            </BaseButton>
            <BaseButton
              :disabled="trainingLoading || summaryLoading || !approvedCount"
              @click="trainModel"
            >
              {{ trainingLoading ? 'Training...' : 'Train model' }}
            </BaseButton>
          </div>
        </div>

        <div class="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div class="rounded-xl border border-[var(--line)] bg-white/55 p-4">
            <div class="text-sm text-[var(--text-muted)]">Pending feedback</div>
            <div class="mt-2 text-3xl font-semibold text-[var(--wine)]">{{ pendingCount }}</div>
          </div>
          <div class="rounded-xl border border-[var(--line)] bg-white/55 p-4">
            <div class="text-sm text-[var(--text-muted)]">Approved feedback</div>
            <div class="mt-2 text-3xl font-semibold text-[var(--wine)]">{{ approvedCount }}</div>
          </div>
          <div class="rounded-xl border border-[var(--line)] bg-white/55 p-4">
            <div class="text-sm text-[var(--text-muted)]">Rejected feedback</div>
            <div class="mt-2 text-3xl font-semibold text-[var(--wine)]">{{ rejectedCount }}</div>
          </div>
          <div class="rounded-xl border border-[var(--line)] bg-white/55 p-4">
            <div class="text-sm text-[var(--text-muted)]">Approved since last train</div>
            <div class="mt-2 text-3xl font-semibold text-[var(--wine)]">
              {{ approvedSinceLastTraining }}
            </div>
          </div>
          <div class="rounded-xl border border-[var(--line)] bg-white/55 p-4">
            <div class="text-sm text-[var(--text-muted)]">Approved good votes</div>
            <div class="mt-2 text-3xl font-semibold text-[var(--wine)]">
              {{ approvedGoodCount }}
            </div>
          </div>
          <div class="rounded-xl border border-[var(--line)] bg-white/55 p-4">
            <div class="text-sm text-[var(--text-muted)]">Approved bad votes</div>
            <div class="mt-2 text-3xl font-semibold text-[var(--wine)]">{{ approvedBadCount }}</div>
          </div>
        </div>

        <!-- LLM auto-training szekció -->
        <div class="mt-6 rounded-xl border border-[var(--gold)]/40 bg-[var(--gold)]/5 p-4">
          <h4 class="font-semibold">LLM feedback &amp; auto-training</h4>
          <p class="mt-1 text-xs text-[var(--text-muted)]">
            Az LLM ajánlásaiból automatikusan gyűlnek a tanítócímkék. Ha elég új auto-approved
            label összegyűlik, a rendszer magától elindítja az újratanítást.
          </p>
          <div class="mt-4 grid gap-3 sm:grid-cols-3">
            <div class="rounded-lg border border-[var(--line)] bg-white/60 p-3">
              <div class="text-xs text-[var(--text-muted)]">LLM silver labels (össz)</div>
              <div class="mt-1 text-2xl font-semibold text-[var(--wine)]">{{ llmTotal }}</div>
            </div>
            <div class="rounded-lg border border-[var(--line)] bg-white/60 p-3">
              <div class="text-xs text-[var(--text-muted)]">Auto-approved (≥{{ autoApproveThreshold * 100 }}% conf.)</div>
              <div class="mt-1 text-2xl font-semibold text-[#215d31]">{{ llmAutoApproved }}</div>
            </div>
            <div class="rounded-lg border border-[var(--line)] bg-white/60 p-3">
              <div class="text-xs text-[var(--text-muted)]">Pending LLM (admin dönt)</div>
              <div class="mt-1 text-2xl font-semibold text-[#7b5a12]">{{ llmPending }}</div>
            </div>
          </div>
          <div class="mt-3 space-y-1 text-xs text-[var(--text-muted)]">
            <p>Auto-train küszöb: <strong>{{ autoTrainThreshold }} új approved label</strong></p>
            <p>Cooldown: <strong>{{ autoTrainCooldownHours }}h</strong></p>
            <p v-if="nextAutoTrainAt">Következő lehetséges auto-train: <strong>{{ formatDate(nextAutoTrainAt) }}</strong></p>
          </div>
        </div>

        <div class="mt-6 rounded-xl border border-[var(--line)] bg-white/45 p-4">
          <div class="flex flex-wrap items-center justify-between gap-2">
            <h4 class="font-semibold">Last training run</h4>
            <div class="flex items-center gap-2">
              <span
                v-if="lastRun?.triggerSource === 'auto'"
                class="rounded-full bg-[rgba(210,239,214,0.95)] px-2 py-0.5 text-xs font-semibold text-[#215d31]"
              >auto</span>
              <span
                class="rounded-full px-3 py-1 text-xs font-semibold"
                :class="trainingStatusClass(lastRun?.status)"
              >
                {{ lastRun?.status || 'No run yet' }}
              </span>
            </div>
          </div>
          <div class="mt-3 space-y-1 text-sm text-[var(--text-muted)]">
            <p>Started: {{ formatDate(lastRun?.startedAt) }}</p>
            <p>Completed: {{ formatDate(lastRun?.completedAt) }}</p>
            <p>Approved rows used: {{ lastRun?.approvedFeedbackCount ?? 0 }}</p>
            <p v-if="lastRun?.metrics?.roc_auc !== undefined">
              ROC AUC: {{ lastRun.metrics.roc_auc }}
            </p>
            <p v-if="lastRun?.stderrTail" class="text-[var(--danger)]">
              {{ lastRun.stderrTail }}
            </p>
          </div>
        </div>
      </section>

      <section class="glass-panel rounded-2xl border border-[var(--line)] p-6">
        <div class="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 class="text-xl font-semibold">Feedback Review Queue</h3>
            <p class="mt-1 text-sm text-[var(--text-muted)]">
              Decide which user votes should become learning signals.
            </p>
          </div>
          <div class="flex items-center gap-2">
            <label class="text-sm text-[var(--text-muted)]" for="feedback-status">Status</label>
            <select
              id="feedback-status"
              v-model="selectedStatus"
              class="rounded-xl border border-[var(--line)] bg-white/80 px-3 py-2 text-sm"
            >
              <option value="all">All</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>

        <p v-if="errorMessage" class="mt-4 text-sm text-[var(--danger)]">
          {{ errorMessage }}
        </p>

        <div class="mt-5 space-y-4">
          <article
            v-for="item in feedbackItems"
            :key="item._id"
            class="rounded-2xl border border-[var(--line)] bg-white/55 p-4"
          >
            <div class="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div class="flex flex-wrap items-center gap-2">
                  <div class="text-sm uppercase tracking-[0.16em] text-[var(--text-muted)]">
                    {{ item.direction === 'wine_to_recipe' ? 'Wine to recipe' : 'Recipe to wine' }}
                  </div>
                  <span
                    class="rounded-full px-2 py-0.5 text-xs font-semibold"
                    :class="item.source === 'llm'
                      ? 'bg-[rgba(122,32,56,0.1)] text-[var(--wine)]'
                      : 'bg-[rgba(210,239,214,0.8)] text-[#215d31]'"
                  >
                    {{ item.source === 'llm' ? 'LLM' : 'User' }}
                  </span>
                </div>
                <h4 class="mt-1 text-lg font-semibold">
                  {{ item.feedback === 'good' ? 'Good match' : 'Bad match' }}
                </h4>
              </div>
              <span
                class="rounded-full px-3 py-1 text-xs font-semibold"
                :class="statusClass(item.status)"
              >
                {{ item.status || 'pending' }}
              </span>
            </div>

            <div class="mt-3 grid gap-2 text-sm text-[var(--text-muted)]">
              <p>Recipe ID: {{ item.recipeId }}</p>
              <p>Wine ID: {{ item.wineId }}</p>
              <p v-if="item.source !== 'llm'">User: {{ item.userId?.username || item.userId?.email || 'Anonymous' }}</p>
              <p v-if="item.confidence != null">Confidence: {{ Math.round(item.confidence * 100) }}%</p>
              <p v-else>Recommendation score: {{ formatScore(item.recommendationScore) }}</p>
              <p>Submitted: {{ formatDate(item.createdAt) }}</p>
              <p v-if="item.reviewedAt">
                Reviewed: {{ formatDate(item.reviewedAt) }} by
                {{ item.reviewedBy?.username || item.reviewedBy?.email || 'admin' }}
              </p>
            </div>

            <div class="mt-4 flex flex-wrap gap-3">
              <BaseButton
                variant="secondary"
                :disabled="rowLoading[item._id] || item.status === 'approved'"
                @click="reviewFeedback(item._id, 'approved')"
              >
                Approve
              </BaseButton>
              <BaseButton
                variant="danger"
                :disabled="rowLoading[item._id] || item.status === 'rejected'"
                @click="reviewFeedback(item._id, 'rejected')"
              >
                Reject
              </BaseButton>
              <BaseButton
                variant="simple"
                :disabled="rowLoading[item._id] || item.status === 'pending'"
                @click="reviewFeedback(item._id, 'pending')"
              >
                Reset to pending
              </BaseButton>
            </div>
          </article>

          <div
            v-if="!feedbackLoading && !feedbackItems.length"
            class="rounded-2xl border border-dashed border-[var(--line)] bg-white/35 p-6 text-center text-sm text-[var(--text-muted)]"
          >
            No feedback entries match the selected filter.
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useAdminStore } from '@/stores/adminStore'
import BaseButton from '../ui/BaseButton.vue'

const adminStore = useAdminStore()

const selectedStatus = ref('pending')
const feedbackLoading = ref(false)
const summaryLoading = ref(false)
const approveAllLoading = ref(false)
const trainingLoading = ref(false)
const errorMessage = ref('')
const rowLoading = ref({})

const feedbackItems = computed(() => adminStore.pairingFeedback || [])
const summary = computed(() => adminStore.pairingTrainingSummary || {})
const feedbackSummary = computed(() => summary.value.feedback || {})
const trainingSummary = computed(() => summary.value.training || {})
const llmSummary = computed(() => summary.value.llmFeedback || {})
const lastRun = computed(() => trainingSummary.value.lastRun || null)
const pendingCount = computed(() => feedbackSummary.value.pending || 0)
const approvedCount = computed(() => feedbackSummary.value.approved || 0)
const rejectedCount = computed(() => feedbackSummary.value.rejected || 0)
const approvedGoodCount = computed(() => feedbackSummary.value.approvedGood || 0)
const approvedBadCount = computed(() => feedbackSummary.value.approvedBad || 0)
const approvedSinceLastTraining = computed(() => trainingSummary.value.approvedSinceLastTraining || 0)
const llmTotal = computed(() => llmSummary.value.total || 0)
const llmAutoApproved = computed(() => llmSummary.value.autoApproved || 0)
const llmPending = computed(() => llmSummary.value.pending || 0)
const autoApproveThreshold = computed(() => llmSummary.value.autoApproveThreshold ?? 0.85)
const autoTrainThreshold = computed(() => trainingSummary.value.autoTrainThreshold ?? 20)
const autoTrainCooldownHours = computed(() => trainingSummary.value.autoTrainCooldownHours ?? 24)
const nextAutoTrainAt = computed(() => trainingSummary.value.nextAutoTrainAt || null)

async function loadSummary() {
  summaryLoading.value = true
  try {
    await adminStore.fetchPairingTrainingSummary()
  } finally {
    summaryLoading.value = false
  }
}

async function loadFeedback() {
  feedbackLoading.value = true
  errorMessage.value = ''
  try {
    await adminStore.fetchPairingFeedback(selectedStatus.value, 60)
  } catch (error) {
    errorMessage.value = error.message || 'Could not load pairing feedback.'
  } finally {
    feedbackLoading.value = false
  }
}

async function reviewFeedback(id, status) {
  rowLoading.value = { ...rowLoading.value, [id]: true }
  errorMessage.value = ''
  try {
    await adminStore.reviewPairingFeedback(id, status)
    await Promise.all([loadSummary(), loadFeedback()])
  } catch (error) {
    errorMessage.value = error.message || 'Could not update the feedback review status.'
  } finally {
    rowLoading.value = { ...rowLoading.value, [id]: false }
  }
}

async function approveAllPending() {
  approveAllLoading.value = true
  errorMessage.value = ''
  try {
    await adminStore.approvePendingPairingFeedback()
    await Promise.all([loadSummary(), loadFeedback()])
  } catch (error) {
    errorMessage.value = error.message || 'Could not approve pending feedback.'
  } finally {
    approveAllLoading.value = false
  }
}

async function trainModel() {
  trainingLoading.value = true
  errorMessage.value = ''
  try {
    await adminStore.trainPairingModel()
    await Promise.all([loadSummary(), loadFeedback()])
  } catch (error) {
    errorMessage.value = error.message || 'Could not start model training.'
  } finally {
    trainingLoading.value = false
  }
}

function formatDate(value) {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '—'
  return date.toLocaleString()
}

function formatScore(value) {
  const numeric = Number(value)
  if (!Number.isFinite(numeric)) return '—'
  return numeric.toFixed(2)
}

function statusClass(status) {
  if (status === 'approved') return 'bg-[rgba(210,239,214,0.95)] text-[#215d31]'
  if (status === 'rejected') return 'bg-[rgba(255,228,228,0.95)] text-[var(--danger)]'
  return 'bg-[rgba(255,246,214,0.95)] text-[#7b5a12]'
}

function trainingStatusClass(status) {
  if (status === 'completed') return 'bg-[rgba(210,239,214,0.95)] text-[#215d31]'
  if (status === 'failed') return 'bg-[rgba(255,228,228,0.95)] text-[var(--danger)]'
  if (status === 'running') return 'bg-[rgba(255,246,214,0.95)] text-[#7b5a12]'
  return 'bg-[rgba(255,249,242,0.9)] text-[var(--text-main)]'
}

watch(selectedStatus, () => {
  loadFeedback()
})

onMounted(async () => {
  await Promise.all([loadSummary(), loadFeedback()])
})
</script>
