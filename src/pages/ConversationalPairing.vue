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
              Ask naturally, like "I want a crisp white wine for grilled fish" or "What should I
              cook with a fruity red?". The assistant replies in chat form and lists matching wines
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
            @keydown.ctrl.enter="sendMessage"
          />

          <div class="flex flex-wrap items-center gap-3">
            <BaseButton :disabled="loading || !trimmedDraft" @click="sendMessage">
              {{ loading ? 'Searching…' : 'Ask the assistant' }}
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
        <!-- Chat panel -->
        <div class="glass-panel rounded-[1.8rem] p-5 md:p-7">
          <div class="mb-4 flex items-center justify-between">
            <h2 class="text-2xl font-semibold md:text-3xl">Conversation</h2>
            <span class="micro-label">{{ messages.length }} messages</span>
          </div>

          <div ref="chatContainer" class="space-y-4">
            <article
              v-for="message in messages"
              :key="message.id"
              :class="message.role === 'user' ? 'chat-row user' : 'chat-row ai'"
            >
              <div :class="message.role === 'user' ? 'chat-bubble user' : 'chat-bubble ai'">
                <div class="mb-1 text-[0.72rem] font-bold uppercase tracking-[0.18em] text-[var(--wine)]">
                  {{ message.role === 'user' ? 'You' : 'Assistant' }}
                </div>

                <!-- Typing indicator -->
                <div v-if="message.isTyping && !message.text" class="typing-dots">
                  <span></span><span></span><span></span>
                </div>

                <!-- AI message rendered as markdown -->
                <div
                  v-else-if="message.role === 'ai'"
                  class="prose prose-sm max-w-none leading-6"
                  v-html="renderMarkdown(message.text)"
                />

                <!-- User message as plain text -->
                <p v-else class="whitespace-pre-wrap text-sm leading-6">{{ message.text }}</p>
              </div>
            </article>
          </div>
        </div>

        <!-- Results panel -->
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
                <div class="flex items-start gap-3">
                  <img
                    v-if="wine.imageUrl"
                    :src="wine.imageUrl"
                    :alt="wine.wine_name"
                    class="h-14 w-14 flex-shrink-0 rounded-xl object-cover"
                  />
                  <div class="min-w-0 flex-1">
                    <div class="flex items-start justify-between gap-2">
                      <BaseButton :to="`/wine/${wine.wine_id}`" variant="simple" class="px-0 text-lg font-semibold">
                        {{ wine.wine_name }}
                      </BaseButton>
                      <button
                        v-if="profileStore.hasProfile"
                        class="flex-shrink-0 text-xl leading-none transition hover:scale-110"
                        :title="isWineFav(wine.wine_id) ? 'Remove from favorites' : 'Add to favorites'"
                        @click="toggleWineFav(wine)"
                      >
                        {{ isWineFav(wine.wine_id) ? '♥' : '♡' }}
                      </button>
                    </div>
                    <div class="mt-1 inline-flex rounded-full border border-[var(--line)] bg-white/60 px-2.5 py-1 text-xs font-semibold text-[var(--wine)]">
                      Wine match
                    </div>
                    <div class="mt-2 space-y-0.5 text-sm text-[var(--text-muted)]">
                      <div v-if="wine.type"><span class="font-semibold">Type:</span> {{ wine.type }}</div>
                      <div v-if="wine.style"><span class="font-semibold">Style:</span> {{ wine.style }}</div>
                      <div v-if="wine.flavorProfiles?.length">
                        <span class="font-semibold">Flavors:</span> {{ wine.flavorProfiles.slice(0, 3).join(', ') }}
                      </div>
                    </div>
                  </div>
                </div>
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
                <div class="flex items-start gap-3">
                  <img
                    v-if="recipe.imageUrl"
                    :src="recipe.imageUrl"
                    :alt="recipe.recipe_name"
                    class="h-14 w-14 flex-shrink-0 rounded-xl object-cover"
                  />
                  <div class="min-w-0 flex-1">
                    <div class="flex items-start justify-between gap-2">
                      <BaseButton :to="`/recipe/${recipe.recipe_id}`" variant="simple" class="px-0 text-lg font-semibold">
                        {{ recipe.recipe_name }}
                      </BaseButton>
                      <button
                        v-if="profileStore.hasProfile"
                        class="flex-shrink-0 text-xl leading-none transition hover:scale-110"
                        :title="isRecipeFav(recipe.recipe_id) ? 'Remove from favorites' : 'Add to favorites'"
                        @click="toggleRecipeFav(recipe)"
                      >
                        {{ isRecipeFav(recipe.recipe_id) ? '♥' : '♡' }}
                      </button>
                    </div>
                    <div class="mt-1 inline-flex rounded-full border border-[var(--line)] bg-white/60 px-2.5 py-1 text-xs font-semibold text-[var(--wine)]">
                      Recipe match
                    </div>
                    <div class="mt-2 text-sm text-[var(--text-muted)]">
                      <span class="font-semibold">Categories:</span>
                      {{ recipe.categories?.slice(0, 3).join(', ') || '—' }}
                    </div>
                  </div>
                </div>
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
import { computed, nextTick, ref } from 'vue'
import { marked } from 'marked'
import DOMPurify from 'dompurify'
import BaseButton from '../components/ui/BaseButton.vue'
import BaseInput from '../components/ui/BaseInput.vue'
import { useProfileStore } from '../stores/profileStore'

const API_BASE = import.meta.env.VITE_API_BASE_URL

const profileStore = useProfileStore()

const INITIAL_AI_TEXT =
  'Tell me what kind of wine or meal you have in mind, and I will search your own catalog for matching wines and recipes.'

const MAX_HISTORY = 10

const draft = ref('')
const loading = ref(false)
const errorMessage = ref('')
const chatContainer = ref(null)
const messages = ref([
  { id: crypto.randomUUID(), role: 'ai', text: INITIAL_AI_TEXT, isTyping: false },
])
const history = ref([])
const latestResult = ref(null)

const quickPrompts = [
  'I want a crisp white wine for grilled fish.',
  'Suggest a pasta dish for a fruity red wine.',
  'Show me a sparkling wine for a celebration dinner.',
  'What should I cook with a dry rose wine?',
]

const trimmedDraft = computed(() => draft.value.trim())

marked.setOptions({ breaks: true, gfm: true })

function renderMarkdown(text) {
  if (!text) return ''
  return DOMPurify.sanitize(marked.parse(text))
}

async function scrollToBottom() {
  await nextTick()
  const container = chatContainer.value
  if (!container) return
  const last = container.lastElementChild
  last?.scrollIntoView({ behavior: 'smooth', block: 'end' })
}

function useSuggestion(suggestion) {
  draft.value = suggestion
}

function isWineFav(wineId) {
  return profileStore.favoriteWines.some((w) => (w._id || w) === wineId)
}

function isRecipeFav(recipeId) {
  return profileStore.favoriteRecipes.some((r) => (r._id || r) === recipeId)
}

async function toggleWineFav(wine) {
  if (isWineFav(wine.wine_id)) {
    await profileStore.removeFavoriteWine({ _id: wine.wine_id })
  } else {
    await profileStore.addFavoriteWine({ _id: wine.wine_id, name: wine.wine_name })
  }
}

async function toggleRecipeFav(recipe) {
  if (isRecipeFav(recipe.recipe_id)) {
    await profileStore.removeFavoriteRecipe({ _id: recipe.recipe_id })
  } else {
    await profileStore.addFavoriteRecipe({ _id: recipe.recipe_id, name: recipe.recipe_name })
  }
}

async function sendMessage() {
  if (!trimmedDraft.value || loading.value) return

  const message = trimmedDraft.value
  errorMessage.value = ''

  // Add user bubble
  messages.value.push({ id: crypto.randomUUID(), role: 'user', text: message, isTyping: false })

  // Trim and update history
  const trimmedHistory = history.value.slice(-(MAX_HISTORY - 1))
  trimmedHistory.push({ role: 'user', content: message })
  history.value = trimmedHistory

  draft.value = ''
  loading.value = true

  // Add typing indicator bubble
  const aiMsgId = crypto.randomUUID()
  messages.value.push({ id: aiMsgId, role: 'ai', text: '', isTyping: true })
  await scrollToBottom()

  let fullReply = ''

  try {
    const token = localStorage.getItem('token')
    const response = await fetch(`${API_BASE}/pairings/chat-stream`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ messages: history.value, topK: 4 }),
    })

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}))
      throw new Error(errData.error || errData.message || `HTTP ${response.status}`)
    }

    // Streaming starts — remove typing animation
    const aiMsg = messages.value.find((m) => m.id === aiMsgId)
    if (aiMsg) aiMsg.isTyping = false

    const reader = response.body.getReader()
    const decoder = new TextDecoder()
    let buffer = ''

    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      buffer += decoder.decode(value, { stream: true })

      const lines = buffer.split('\n')
      buffer = lines.pop() ?? ''

      for (const line of lines) {
        if (!line.startsWith('data: ')) continue
        const dataStr = line.slice(6)
        if (dataStr === '[DONE]') break

        try {
          const event = JSON.parse(dataStr)
          if (event.type === 'chunk') {
            const msg = messages.value.find((m) => m.id === aiMsgId)
            if (msg) msg.text += event.content
            fullReply += event.content
            await scrollToBottom()
          } else if (event.type === 'done') {
            latestResult.value = event
          } else if (event.type === 'error') {
            throw new Error(event.message)
          }
        } catch (parseErr) {
          if (parseErr.message && parseErr.message !== 'Unexpected token') throw parseErr
        }
      }
    }

    history.value.push({ role: 'assistant', content: fullReply })
  } catch (error) {
    const fallback = 'I could not complete that search right now. Please try another prompt.'
    const aiMsg = messages.value.find((m) => m.id === aiMsgId)
    if (aiMsg) {
      aiMsg.text = fallback
      aiMsg.isTyping = false
    }
    errorMessage.value = error.message || 'The assistant could not answer right now.'
    history.value.push({ role: 'assistant', content: fallback })
  } finally {
    loading.value = false
    await scrollToBottom()
  }
}

function resetConversation() {
  draft.value = ''
  errorMessage.value = ''
  latestResult.value = null
  history.value = []
  messages.value = [{ id: crypto.randomUUID(), role: 'ai', text: INITIAL_AI_TEXT, isTyping: false }]
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

/* Typing indicator */
.typing-dots {
  display: flex;
  gap: 5px;
  align-items: center;
  padding: 4px 0;
}

.typing-dots span {
  display: block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--wine);
  opacity: 0.5;
  animation: typing-bounce 1.2s infinite ease-in-out;
}

.typing-dots span:nth-child(2) {
  animation-delay: 0.2s;
}

.typing-dots span:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes typing-bounce {
  0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
  40% { transform: translateY(-6px); opacity: 1; }
}

/* Markdown prose styles inside AI bubbles */
.prose :deep(p) {
  margin: 0 0 0.5em;
  font-size: 0.875rem;
  line-height: 1.6;
}

.prose :deep(p:last-child) {
  margin-bottom: 0;
}

.prose :deep(ul),
.prose :deep(ol) {
  margin: 0.4em 0 0.6em 1.2em;
  font-size: 0.875rem;
}

.prose :deep(li) {
  margin-bottom: 0.2em;
}

.prose :deep(strong) {
  font-weight: 600;
  color: var(--text-main);
}

.prose :deep(em) {
  font-style: italic;
}
</style>
