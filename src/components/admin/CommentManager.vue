<template>
  <div class="mx-auto max-w-7xl px-4 py-6 text-[var(--text-main)]">
    <div class="mb-4">
      <BaseButton to="/admin" variant="secondary">Back</BaseButton>
    </div>

    <div class="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h2 class="text-3xl font-semibold">Review & Comment Management</h2>
        <p class="mt-2 max-w-3xl text-sm text-[var(--text-muted)]">
          Moderate user comments left on wines and recipes from one admin view.
        </p>
      </div>
      <BaseButton variant="secondary" :disabled="loading" @click="loadComments">
        {{ loading ? 'Refreshing...' : 'Refresh' }}
      </BaseButton>
    </div>

    <div class="mb-5 flex flex-wrap items-center gap-3">
      <button
        v-for="option in filterOptions"
        :key="option.value"
        class="rounded-full border px-4 py-2 text-sm font-semibold transition"
        :class="
          filter === option.value
            ? 'border-[var(--wine)] bg-[var(--wine)] text-white'
            : 'border-[var(--line)] bg-white text-[var(--text-main)] hover:border-[var(--wine)]'
        "
        @click="filter = option.value"
      >
        {{ option.label }}
      </button>
      <span class="text-sm text-[var(--text-muted)]">
        {{ filteredComments.length }} visible / {{ adminStore.ratingComments.length }} total
      </span>
    </div>

    <p v-if="errorMessage" class="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
      {{ errorMessage }}
    </p>

    <div v-if="loading" class="dashboard-panel rounded-2xl p-8 text-center text-[var(--text-muted)]">
      Loading comments...
    </div>

    <div v-else-if="!filteredComments.length" class="dashboard-panel rounded-2xl p-8 text-center text-[var(--text-muted)]">
      No comments found for this filter.
    </div>

    <div v-else class="space-y-4">
      <article
        v-for="item in filteredComments"
        :key="`${item.itemType}-${item.itemId}-${item.ratingId}`"
        class="dashboard-panel rounded-2xl border border-[var(--line)] p-5"
      >
        <div class="flex flex-wrap items-start justify-between gap-4">
          <div class="min-w-0">
            <div class="mb-2 flex flex-wrap items-center gap-2">
              <span
                class="rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em]"
                :class="item.itemType === 'wine' ? 'bg-[var(--rose)] text-[var(--wine)]' : 'bg-orange-50 text-orange-700'"
              >
                {{ item.itemType }}
              </span>
              <span class="rounded-full bg-white px-3 py-1 text-xs font-semibold text-[var(--text-muted)]">
                ★ {{ item.rating ?? '—' }}
              </span>
            </div>
            <h3 class="text-xl font-semibold">{{ item.itemName || 'Untitled item' }}</h3>
            <p v-if="item.itemSubtitle" class="mt-1 text-sm text-[var(--text-muted)]">
              {{ item.itemSubtitle }}
            </p>
          </div>

          <BaseButton
            variant="danger"
            :disabled="deletingKey === itemKey(item)"
            @click="deleteComment(item)"
          >
            {{ deletingKey === itemKey(item) ? 'Deleting...' : 'Delete comment' }}
          </BaseButton>
        </div>

        <blockquote class="mt-4 rounded-xl border border-[var(--line)] bg-white/70 p-4 text-sm leading-6">
          {{ item.comment }}
        </blockquote>

        <div class="mt-3 flex flex-wrap gap-3 text-xs text-[var(--text-muted)]">
          <span>By: {{ item.userName || 'Unknown user' }}</span>
          <span v-if="item.createdAt">Created: {{ formatDate(item.createdAt) }}</span>
        </div>
      </article>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import BaseButton from '../ui/BaseButton.vue'
import { useAdminStore } from '../../stores/adminStore'

const adminStore = useAdminStore()
const loading = ref(false)
const errorMessage = ref('')
const filter = ref('all')
const deletingKey = ref('')

const filterOptions = [
  { label: 'All', value: 'all' },
  { label: 'Wines', value: 'wine' },
  { label: 'Recipes', value: 'recipe' },
]

const filteredComments = computed(() => {
  if (filter.value === 'all') return adminStore.ratingComments
  return adminStore.ratingComments.filter((item) => item.itemType === filter.value)
})

onMounted(loadComments)

async function loadComments() {
  loading.value = true
  errorMessage.value = ''
  try {
    await adminStore.fetchRatingComments()
  } catch (error) {
    errorMessage.value = error.message || 'Could not load comments.'
  } finally {
    loading.value = false
  }
}

function itemKey(item) {
  return `${item.itemType}-${item.itemId}-${item.ratingId}`
}

async function deleteComment(item) {
  const ok = window.confirm('Are you sure you want to delete this comment?')
  if (!ok) return

  deletingKey.value = itemKey(item)
  errorMessage.value = ''
  try {
    await adminStore.deleteRatingComment(item)
  } catch (error) {
    errorMessage.value = error.message || 'Could not delete comment.'
  } finally {
    deletingKey.value = ''
  }
}

function formatDate(value) {
  return new Date(value).toLocaleString()
}
</script>
