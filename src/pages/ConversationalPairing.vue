<template>
  <div class="page-shell">
    <div class="page-frame page-stack">
      <section class="glass-panel hero-sheen overflow-hidden rounded-[2rem] p-6 md:p-8">
        <div class="relative z-10 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div class="max-w-3xl">
            <span class="section-kicker">Conversational AI</span>
            <h1 class="section-title">
              Describe the wine mood, the dish, or both, and let the assistant search your own
              database.
            </h1>
            <p class="section-summary mt-3">
              Ask naturally, like “I want a crisp white wine for grilled fish” or “What should I
              cook with a fruity red?”. The assistant replies in chat form and lists matching wines
              and recipes from your app.
            </p>
          </div>

          <div class="rounded-2xl border border-[var(--line)] bg-[rgba(255,251,246,0.82)] p-4 text-sm text-[var(--text-muted)] shadow-[0_12px_30px_rgba(80,42,23,0.1)]">
            <div class="font-semibold text-[var(--text-main)]">Tips</div>
            <div class="mt-2">Mention a wine style, dish type, ingredient, or occasion.</div>
            <div class="mt-1">If you are logged in, saved preferences are considered too.</div>
          </div>
        </div>
      </section>

      <section class="glass-panel rounded-[1.8rem] p-5 md:p-7">
        <div class="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 class="text-2xl font-semibold md:text-3xl">Start the conversation</h2>
            <p class="mt-1 text-sm text-[var(--text-muted)]">
              Try a quick prompt or write your own detailed request.
            </p>
          </div>
          <BaseButton
            v-if="messages.length > 1"
            variant="secondary"
            @click="resetConversation"
          >
            Clear chat
          </BaseButton>
        </div>

        <div class="mt-5 flex flex-wrap gap-2.5">
          <button
            v-for="suggestion in quickPrompts"
            :key="suggestion"
            class="rounded-full border border-[var(--line)] bg-[rgba(255,251,246,0.92)] px-4 py-2 text-sm font-semibold text-[var(--text-main)] transition hover:-translate-y-0.5 hover:border-[rgba(122,32,56,0.26)] hover:bg-[rgba(237,215,212,0.32)]"
            @click="useSuggestion(suggestion)"
          >
            {{ suggestion }}
          </button>
        </div>

        <div class="mt-6">
          <BaseInput
            id="pairing-chat"
            v-model="draft"
            label="Your request"
            textarea
            placeholder="Example: I want a light white wine for lemon chicken, or suggest a cozy dinner for a fruity red."
          />

          <div class="flex flex-wrap items-center gap-3">
            <BaseButton :disabled="loading || !trimmedDraft" @click="sendMessage">
              {{ loading ? 'Searching...' : 'Ask the assistant' }}
            </BaseButton>
            <span class="text-sm text-[var(--text-muted)]">
              The reply uses wines and recipes already stored in your own database.
            </span>
          </div>
          <p v-if="errorMessage" class="mt-3 text-sm text-[var(--danger)]">
            {{ errorMessage }}
          </p>
        </div>
      </section>

      <section class="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <div class="glass-panel rounded-[1.8rem] p-5 md:p-7">
          <div class="mb-4 flex items-center justify-between">
            <h2 class="text-2xl font-semibold md:text-3xl">Conversation</h2>
            <span class="micro-label">{{ messages.length }} messages</span>
          </div>

          <div class="space-y-4">
            <article
              v-for="message in messages"
              :key="message.id"
              :class="message.role === 'user' ? 'chat-row user' : 'chat-row ai'"
            >
              <div :class="message.role === 'user' ? 'chat-bubble user' : 'chat-bubble ai'">
                <div class="mb-1 text-[0.72rem] font-bold uppercase tracking-[0.18em] text-[var(--wine)]">
                  {{ message.role === 'user' ? 'You' : 'Assistant' }}
                </div>
                <p class="whitespace-pre-wrap text-sm leading-6">{{ message.text }}</p>
              </div>
            </article>
          </div>
        </div>

        <div class="space-y-6">
          <section class="glass-panel rounded-[1.8rem] p-5 md:p-6">
            <div class="mb-4 flex items-center justify-between">
              <h3 class="text-2xl font-semibold">Matching wines</h3>
              <span class="text-xs uppercase tracking-[0.16em] text-[var(--text-muted)]">
                {{ latestResult?.wines?.length || 0 }} items
              </span>
            </div>

            <div v-if="latestResult?.wines?.length" class="space-y-3">
              <article
                v-for="wine in latestResult.wines"
                :key="wine.wine_id"
                class="rounded-2xl border border-[var(--line)] bg-[rgba(255,251,246,0.9)] p-4"
              >
                <BaseButton :to="`/wine/${wine.wine_id}`" variant="simple" class="px-0 text-lg font-semibold">
                  {{ wine.wine_name }}
                </BaseButton>
                <div class="mt-2 inline-flex rounded-full border border-[var(--line)] bg-white/60 px-2.5 py-1 text-xs font-semibold text-[var(--wine)]">
                  Wine match
                </div>
                <div class="mt-3 space-y-1 text-sm text-[var(--text-muted)]">
                  <div><span class="font-semibold">Type:</span> {{ wine.type || '—' }}</div>
                  <div><span class="font-semibold">Style:</span> {{ wine.style || '—' }}</div>
                  <div><span class="font-semibold">Match:</span> {{ toPercent(wine.match_score) }}%</div>
                </div>
                <p class="mt-3 text-sm text-[var(--text-muted)]">
                  {{ wine.reason || 'Relevant wine from your own catalog.' }}
                </p>
              </article>
            </div>

            <p v-else class="text-sm text-[var(--text-muted)]">
              The assistant will place matching wines here after the first question.
            </p>
          </section>

          <section class="glass-panel rounded-[1.8rem] p-5 md:p-6">
            <div class="mb-4 flex items-center justify-between">
              <h3 class="text-2xl font-semibold">Matching recipes</h3>
              <span class="text-xs uppercase tracking-[0.16em] text-[var(--text-muted)]">
                {{ latestResult?.recipes?.length || 0 }} items
              </span>
            </div>

            <div v-if="latestResult?.recipes?.length" class="space-y-3">
              <article
                v-for="recipe in latestResult.recipes"
                :key="recipe.recipe_id"
                class="rounded-2xl border border-[var(--line)] bg-[rgba(255,251,246,0.9)] p-4"
              >
                <BaseButton :to="`/recipe/${recipe.recipe_id}`" variant="simple" class="px-0 text-lg font-semibold">
                  {{ recipe.recipe_name }}
                </BaseButton>
                <div class="mt-2 inline-flex rounded-full border border-[var(--line)] bg-white/60 px-2.5 py-1 text-xs font-semibold text-[var(--wine)]">
                  Recipe match
                </div>
                <div class="mt-3 space-y-1 text-sm text-[var(--text-muted)]">
                  <div>
                    <span class="font-semibold">Categories:</span>
                    {{ recipe.categories?.join(', ') || '—' }}
                  </div>
                  <div><span class="font-semibold">Match:</span> {{ toPercent(recipe.match_score) }}%</div>
                </div>
                <p class="mt-3 text-sm text-[var(--text-muted)]">
                  {{ recipe.reason || 'Relevant recipe from your own catalog.' }}
                </p>
              </article>
            </div>

            <p v-else class="text-sm text-[var(--text-muted)]">
              Matching recipes will show up here when the question points toward a dish or pairing.
            </p>
          </section>

          <section
            v-if="latestResult?.followUpSuggestions?.length"
            class="glass-panel rounded-[1.8rem] p-5 md:p-6"
          >
            <h3 class="text-2xl font-semibold">Try next</h3>
            <div class="mt-4 flex flex-wrap gap-2.5">
              <button
                v-for="suggestion in latestResult.followUpSuggestions"
                :key="suggestion"
                class="rounded-full border border-[var(--line)] bg-[rgba(255,251,246,0.92)] px-4 py-2 text-sm font-semibold text-[var(--text-main)] transition hover:-translate-y-0.5 hover:border-[rgba(122,32,56,0.26)] hover:bg-[rgba(237,215,212,0.32)]"
                @click="useSuggestion(suggestion)"
              >
                {{ suggestion }}
              </button>
            </div>
          </section>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import BaseButton from '../components/ui/BaseButton.vue'
import BaseInput from '../components/ui/BaseInput.vue'
import client from '../components/httpService/client'

const draft = ref('')
const loading = ref(false)
const errorMessage = ref('')
const messages = ref([
  {
    id: crypto.randomUUID(),
    role: 'ai',
    text: 'Tell me what kind of wine or meal you have in mind, and I will search your own catalog for matching wines and recipes.',
  },
])
const latestResult = ref(null)

const quickPrompts = [
  'I want a crisp white wine for grilled fish.',
  'Suggest a pasta dish for a fruity red wine.',
  'Show me a sparkling wine for a celebration dinner.',
  'What should I cook with a dry rose wine?',
]

const trimmedDraft = computed(() => draft.value.trim())

function toPercent(probability) {
  const numeric = Number(probability)
  if (!Number.isFinite(numeric)) return 0
  return Math.round(numeric * 100)
}

function pushMessage(role, text) {
  messages.value.push({
    id: crypto.randomUUID(),
    role,
    text,
  })
}

function useSuggestion(suggestion) {
  draft.value = suggestion
}

async function sendMessage() {
  if (!trimmedDraft.value || loading.value) return

  const message = trimmedDraft.value
  errorMessage.value = ''
  pushMessage('user', message)
  draft.value = ''
  loading.value = true

  try {
    const response = await client.post('pairings/agent-search', {
      message,
      topK: 4,
    })

    latestResult.value = response
    pushMessage('ai', response.reply || 'I found a few promising matches in your database.')
  } catch (error) {
    errorMessage.value = error.message || 'The assistant could not answer right now.'
    pushMessage('ai', 'I could not complete that search right now. Please try another prompt.')
  } finally {
    loading.value = false
  }
}

function resetConversation() {
  draft.value = ''
  errorMessage.value = ''
  latestResult.value = null
  messages.value = [
    {
      id: crypto.randomUUID(),
      role: 'ai',
      text: 'Tell me what kind of wine or meal you have in mind, and I will search your own catalog for matching wines and recipes.',
    },
  ]
}
</script>

<style scoped>
.chat-row {
  display: flex;
}

.chat-row.user {
  justify-content: flex-end;
}

.chat-row.ai {
  justify-content: flex-start;
}

.chat-bubble {
  max-width: min(100%, 42rem);
  border-radius: 1.4rem;
  padding: 1rem 1.1rem;
  border: 1px solid var(--line);
  box-shadow: 0 14px 30px rgba(80, 42, 23, 0.08);
}

.chat-bubble.user {
  background: linear-gradient(135deg, rgba(122, 32, 56, 0.94), rgba(169, 68, 93, 0.88));
  color: #fff7ef;
  border-color: rgba(122, 32, 56, 0.25);
}

.chat-bubble.ai {
  background: rgba(255, 251, 246, 0.92);
  color: var(--text-main);
}

.chat-bubble.user .text-\[var\(--wine\)\] {
  color: rgba(255, 247, 239, 0.82);
}
</style>
