<template>
  <PageFrame>
      <section class="sommelier-hero overflow-hidden rounded-[1.8rem] p-6 md:p-8">
        <div class="relative z-10 grid gap-6 xl:grid-cols-[minmax(0,1.15fr)_340px] xl:items-end">
          <div class="max-w-4xl">
            <span class="section-kicker !text-[#f0d8ad]">AI Sommelier</span>
            <h1 class="sommelier-title">
              A more cinematic chat for wine moods, dinner plans, and instant pairing ideas.
            </h1>
            <p class="sommelier-summary mt-4">
              Ask naturally, describe a bottle, an ingredient, or a vibe, and the assistant will
              search your own catalog while keeping the answers conversational.
            </p>
          </div>

          <div class="sommelier-tip-card">
            <div class="text-xs font-semibold uppercase tracking-[0.22em] text-[#f0d8ad]">Tips</div>
            <div class="mt-3 space-y-2 text-sm leading-6 text-[#fff2e3]">
              <p>Mention a wine style, dish type, ingredient, or occasion.</p>
              <p>If you are logged in, saved preferences are considered too.</p>
              <p>Try follow-up prompts to refine pairings instead of starting over.</p>
            </div>
          </div>
        </div>
      </section>

      <section class="grid gap-6 xl:grid-cols-[1.18fr_0.82fr]">
        <!-- Chat panel -->
        <div class="dashboard-panel overflow-hidden rounded-[1.7rem]">
          <div class="chat-panel-header">
            <div>
              <p class="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--text-muted)]">
                Sommelier Chat
              </p>
              <h2 class="mt-2 text-2xl font-semibold md:text-3xl">Start the conversation</h2>
              <p class="mt-1 text-sm text-[var(--text-muted)]">
                Try a quick prompt or write your own detailed request.
              </p>
            </div>
            <div class="flex items-center gap-3">
              <span class="dashboard-chip">{{ messages.length }} messages</span>
              <BaseButton
                v-if="messages.length > 1"
                variant="secondary"
                @click="resetConversation"
              >
                Clear chat
              </BaseButton>
            </div>
          </div>

          <div class="chat-panel-prompts">
            <button
              v-for="suggestion in quickPrompts"
              :key="suggestion"
              class="sommelier-prompt-chip"
              @click="useSuggestion(suggestion)"
            >
              {{ suggestion }}
            </button>
          </div>

          <div ref="chatContainer" class="chat-scroll-shell">
            <article
              v-for="message in messages"
              :key="message.id"
              :class="message.role === 'user' ? 'chat-row user' : 'chat-row ai'"
            >
              <div class="chat-avatar">
                {{ message.role === 'user' ? 'Y' : 'S' }}
              </div>

              <div :class="message.role === 'user' ? 'chat-bubble user' : 'chat-bubble ai'">
                <div class="mb-1 text-[0.72rem] font-bold uppercase tracking-[0.18em] text-[var(--wine)]">
                  {{ message.role === 'user' ? 'You' : 'Sommelier' }}
                </div>

                <div v-if="message.isTyping && !message.text" class="typing-dots">
                  <span></span><span></span><span></span>
                </div>

                <div
                  v-else-if="message.role === 'ai'"
                  class="prose prose-sm max-w-none leading-6"
                  v-html="renderMarkdown(message.text)"
                />

                <p v-else class="whitespace-pre-wrap text-sm leading-6">{{ message.text }}</p>
              </div>
            </article>
          </div>

          <div class="chat-composer">
            <label for="pairing-chat" class="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-[var(--text-muted)]">
              Your request
            </label>
            <textarea
              id="pairing-chat"
              v-model="draft"
              class="chat-textarea"
              placeholder="Example: I want a light white wine for lemon chicken, or suggest a cozy dinner for a fruity red."
              @keydown.ctrl.enter="sendMessage"
            />

            <div class="mt-4 flex flex-wrap items-center justify-between gap-3">
              <p class="text-sm text-[var(--text-muted)]">
                The reply uses wines and recipes already stored in your own database.
              </p>
              <BaseButton :disabled="loading || !trimmedDraft" @click="sendMessage">
                {{ loading ? 'Searching…' : 'Ask the assistant' }}
              </BaseButton>
            </div>

            <p v-if="errorMessage" class="mt-3 text-sm text-[var(--danger)]">
              {{ errorMessage }}
            </p>
          </div>
        </div>

        <!-- Results panel -->
        <div class="space-y-6">
          <section class="dashboard-panel rounded-[1.5rem] p-5 md:p-6">
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
                class="result-card"
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
                        class="result-fav-btn"
                        :title="isWineFav(wine.wine_id) ? 'Remove from favorites' : 'Add to favorites'"
                        @click="toggleWineFav(wine)"
                      >
                        {{ isWineFav(wine.wine_id) ? '♥' : '♡' }}
                      </button>
                    </div>
                    <div class="mt-1 inline-flex rounded-full border border-[var(--line)] bg-[rgba(255,248,239,0.86)] px-2.5 py-1 text-xs font-semibold text-[var(--wine)]">
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

          <section class="dashboard-panel rounded-[1.5rem] p-5 md:p-6">
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
                class="result-card"
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
                        class="result-fav-btn"
                        :title="isRecipeFav(recipe.recipe_id) ? 'Remove from favorites' : 'Add to favorites'"
                        @click="toggleRecipeFav(recipe)"
                      >
                        {{ isRecipeFav(recipe.recipe_id) ? '♥' : '♡' }}
                      </button>
                    </div>
                    <div class="mt-1 inline-flex rounded-full border border-[var(--line)] bg-[rgba(255,248,239,0.86)] px-2.5 py-1 text-xs font-semibold text-[var(--wine)]">
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
            class="dashboard-panel rounded-[1.5rem] p-5 md:p-6"
          >
            <h3 class="text-2xl font-semibold">Try next</h3>
            <div class="mt-4 flex flex-wrap gap-2.5">
              <button
                v-for="suggestion in latestResult.followUpSuggestions"
                :key="suggestion"
                class="sommelier-prompt-chip"
                @click="useSuggestion(suggestion)"
              >
                {{ suggestion }}
              </button>
            </div>
          </section>
        </div>
      </section>
  </PageFrame>
</template>

<script setup>
import { computed, nextTick, ref } from 'vue'
import { marked } from 'marked'
import DOMPurify from 'dompurify'
import BaseButton from '../components/ui/BaseButton.vue'
import PageFrame from '../components/ui/PageFrame.vue'
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
.sommelier-hero {
  position: relative;
  background:
    radial-gradient(circle at top right, rgba(255, 225, 176, 0.22), transparent 26%),
    linear-gradient(135deg, #5d1f32 0%, #7b3048 55%, #b78360 125%);
  color: #fff1e5;
  box-shadow: 0 24px 54px rgba(93, 31, 50, 0.24);
}

.sommelier-title {
  margin: 0;
  font-size: clamp(2.6rem, 4.6vw, 4.8rem);
  line-height: 0.96;
  color: #fff3e7;
}

.sommelier-summary {
  max-width: 44rem;
  font-size: 1.02rem;
  line-height: 1.75;
  color: #fff1e2;
}

.sommelier-tip-card {
  border-radius: 1.4rem;
  border: 1px solid rgba(255, 241, 226, 0.16);
  background: rgba(255, 247, 239, 0.12);
  padding: 1.15rem;
  backdrop-filter: blur(10px);
}

.chat-panel-header {
  display: flex;
  flex-wrap: wrap;
  align-items: end;
  justify-content: space-between;
  gap: 1rem;
  padding: 1.4rem 1.4rem 0;
}

.chat-panel-prompts {
  display: flex;
  flex-wrap: wrap;
  gap: 0.7rem;
  padding: 1rem 1.4rem 0;
}

.sommelier-prompt-chip {
  border-radius: 999px;
  border: 1px solid var(--line);
  background: rgba(255, 250, 243, 0.94);
  padding: 0.65rem 0.95rem;
  color: var(--text-muted);
  font-size: 0.9rem;
  font-weight: 600;
  transition: 0.18s ease;
}

.sommelier-prompt-chip:hover {
  transform: translateY(-1px);
  border-color: rgba(107, 45, 62, 0.3);
  color: var(--wine);
  background: #fffdf9;
}

.chat-scroll-shell {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  min-height: 30rem;
  max-height: 44rem;
  overflow-y: auto;
  padding: 1.4rem;
  margin-top: 1rem;
  background:
    linear-gradient(180deg, rgba(255, 252, 247, 0.88), rgba(252, 244, 235, 0.82)),
    linear-gradient(rgba(95, 40, 53, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(95, 40, 53, 0.03) 1px, transparent 1px);
  background-size: auto, 30px 30px, 30px 30px;
  border-top: 1px solid var(--line-soft);
  border-bottom: 1px solid var(--line-soft);
}

.chat-row {
  display: flex;
  gap: 0.8rem;
  align-items: flex-start;
}

.chat-row.user {
  justify-content: flex-end;
  flex-direction: row-reverse;
}

.chat-row.ai {
  justify-content: flex-start;
}

.chat-avatar {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.3rem;
  height: 2.3rem;
  flex-shrink: 0;
  border-radius: 999px;
  border: 1px solid var(--line);
  background: rgba(255, 248, 239, 0.96);
  color: var(--wine);
  font-size: 0.78rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  box-shadow: 0 8px 20px rgba(28, 15, 19, 0.08);
}

.chat-bubble {
  max-width: min(100%, 42rem);
  border-radius: 1.3rem;
  padding: 1rem 1.1rem;
  border: 1px solid var(--line);
  box-shadow: 0 12px 26px rgba(28, 15, 19, 0.08);
}

.chat-bubble.user {
  background: linear-gradient(135deg, #6d2740 0%, #5d1f32 100%);
  color: #fff7ef;
  border-color: rgba(93, 31, 50, 0.2);
}

.chat-bubble.ai {
  background: rgba(255, 252, 247, 0.98);
  color: var(--text-main);
}

.chat-composer {
  padding: 1.25rem 1.4rem 1.4rem;
}

.chat-textarea {
  width: 100%;
  min-height: 9rem;
  resize: vertical;
  border-radius: 1.3rem;
  border: 1px solid var(--line);
  background: rgba(255, 251, 246, 0.98);
  color: var(--text-main);
  padding: 1rem 1.05rem;
  outline: none;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.65);
  transition: 0.2s ease;
}

.chat-textarea:focus {
  border-color: var(--wine);
  box-shadow: 0 0 0 2px rgba(107, 45, 62, 0.14);
}

.result-card {
  border-radius: 1.15rem;
  border: 1px solid var(--line);
  background: linear-gradient(180deg, rgba(255, 252, 247, 0.96), rgba(255, 247, 239, 0.92));
  padding: 1rem;
  box-shadow: 0 10px 26px rgba(28, 15, 19, 0.06);
}

.result-fav-btn {
  flex-shrink: 0;
  width: 2.1rem;
  height: 2.1rem;
  border-radius: 999px;
  border: 1px solid var(--line);
  background: rgba(255, 250, 243, 0.94);
  color: var(--wine);
  font-size: 1rem;
  line-height: 1;
  transition: 0.18s ease;
}

.result-fav-btn:hover {
  transform: scale(1.08);
  background: white;
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

@media (max-width: 768px) {
  .chat-scroll-shell {
    min-height: 24rem;
    max-height: none;
  }

  .chat-panel-header,
  .chat-panel-prompts,
  .chat-composer {
    padding-left: 1rem;
    padding-right: 1rem;
  }
}
</style>
