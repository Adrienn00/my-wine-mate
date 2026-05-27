<template>
  <div v-if="!authStore.user" class="page-shell text-center text-[var(--text-main)]">Loading...</div>

  <PageFrame v-else>
    <div class="page-actions">
      <BaseButton to="/" variant="secondary">Back</BaseButton>
    </div>

    <SectionHeader class="px-1" kicker="Account" title="Profile" />

    <BaseCard rounded="rounded-2xl" padding="p-8">
      <div v-if="!isEditing">
        <div class="mb-8 flex flex-col items-center">
          <img
            :src="authStore.user.img || avatar"
            alt="Profile picture"
            class="mb-5 h-32 w-32 rounded-full border-4 border-[var(--wine-soft)]"
          />
          <h3 class="text-2xl font-bold">
            {{ authStore.user.firstName }} {{ authStore.user.lastName }}
          </h3>
        </div>

        <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
          <p><strong>First name:</strong> {{ authStore.user.firstName }}</p>
          <p><strong>Last name:</strong> {{ authStore.user.lastName }}</p>
          <p><strong>Email:</strong> {{ authStore.user.email }}</p>
          <p><strong>Phone number:</strong> {{ authStore.user.phoneNumber }}</p>
          <p><strong>Location:</strong> {{ authStore.user.location }}</p>
          <p><strong>Postal code:</strong> {{ authStore.user.postalCode }}</p>
        </div>

        <div class="mt-8 text-center">
          <BaseButton variant="secondary" @click="isEditing = true">Edit</BaseButton>
        </div>
      </div>

      <div v-else>
        <div class="mb-8 flex flex-col items-center">
          <div class="group relative mb-5 cursor-pointer" @click="triggerFileInput">
            <img
              :src="authStore.user.img || avatar"
              alt="Profile picture"
              class="h-32 w-32 rounded-full border-4 border-[var(--wine-soft)] object-cover transition-all duration-300 group-hover:brightness-75"
            />
            <div class="absolute inset-0 flex flex-col items-center justify-center rounded-full bg-black/40 opacity-0 transition-all duration-300 group-hover:opacity-100">
              <span class="text-2xl">📷</span>
              <span class="mt-1 text-xs font-semibold text-white">Change</span>
            </div>
            <div v-if="uploading" class="absolute inset-0 flex items-center justify-center rounded-full bg-black/60">
              <span class="text-xs font-semibold text-white">Processing…</span>
            </div>
          </div>
          <input ref="fileInput" type="file" accept="image/*" class="hidden" @change="handleImageUpload" />
        </div>

        <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
          <BaseInput label="First name" v-model="authStore.user.firstName" />
          <BaseInput label="Last name" v-model="authStore.user.lastName" />
          <BaseInput label="Email" type="email" v-model="authStore.user.email" />
          <BaseInput label="Phone number" v-model="authStore.user.phoneNumber" />
          <BaseInput label="Location" v-model="authStore.user.location" />
          <BaseInput label="Postal code" v-model="authStore.user.postalCode" />
        </div>

        <div class="mt-8 space-x-4 text-center">
          <BaseButton variant="secondary" @click="saveChanges">Save</BaseButton>
          <BaseButton variant="secondary" @click="isEditing = false">Cancel</BaseButton>
        </div>
      </div>
    </BaseCard>

    <!-- API Key card — always visible -->
    <BaseCard rounded="rounded-2xl" padding="p-6" class="border border-[var(--line)]">
      <div class="mb-4 flex items-center gap-3">
        <span class="text-xl">🔑</span>
        <div>
          <h2 class="text-lg font-semibold text-[var(--text-main)]">Groq API Key</h2>
          <p class="text-xs text-[var(--text-muted)]">Required for AI features (chat, label scan, wine enrichment)</p>
        </div>
        <span v-if="authStore.groqApiKey" class="ml-auto rounded-full bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-700">✔ Active</span>
        <span v-else class="ml-auto rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-700">⚠ Not set</span>
      </div>

      <div class="flex gap-2">
        <div class="relative flex-1">
          <input
            v-model="groqKeyInput"
            :type="showGroqKey ? 'text' : 'password'"
            placeholder="gsk_..."
            class="w-full rounded-lg border border-[var(--line)] bg-white px-3 py-2 pr-10 text-sm text-[var(--text-main)] outline-none focus:border-[var(--wine)]"
          />
          <button
            type="button"
            class="absolute right-2 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-main)]"
            @click="showGroqKey = !showGroqKey"
          >{{ showGroqKey ? '🙈' : '👁' }}</button>
        </div>
        <BaseButton variant="primary" @click="saveGroqKey">Save</BaseButton>
        <BaseButton v-if="authStore.groqApiKey" variant="secondary" @click="clearGroqKey">Clear</BaseButton>
      </div>

      <p class="mt-3 text-xs text-[var(--text-muted)]">
        Get a free key at <span class="font-mono">console.groq.com</span> → API Keys. Stored only in your browser, never in the database.
      </p>
    </BaseCard>

    <BaseCard
      v-if="profileStore.notifications?.length"
      rounded="rounded-2xl"
      padding="p-6"
      class="border border-[var(--line)]"
    >
      <h2 class="mb-4 text-xl font-bold">Notifications</h2>
      <div
        v-for="n in profileStore.notifications"
        :key="n._id"
        class="mb-3 flex items-center gap-2 rounded-lg border border-[var(--line)] bg-[var(--surface)] p-3"
      >
        <span v-if="n.type === 'approved'" class="text-green-600">✔</span>
        <span v-if="n.type === 'rejected'" class="text-[var(--danger)]">✖</span>
        <span v-if="n.type === 'share'" class="text-[var(--accent)]">⇗</span>
        <span>{{ n.message }}</span>
        <router-link v-if="n.link" :to="n.link" class="ml-auto text-xs text-[var(--wine)] underline">View</router-link>
      </div>
      <div v-if="!profileStore.notifications.length">No notifications yet.</div>
    </BaseCard>

    <BaseCard rounded="rounded-2xl" padding="p-6" class="border border-[var(--line)]">
      <h2 class="mb-4 text-xl font-bold">Friends</h2>

      <div class="mb-4 flex gap-2">
        <input
          v-model="friendInput"
          type="text"
          placeholder="Add friend by username..."
          class="friend-input"
          @keyup.enter="addFriend"
        />
        <button class="friend-add-btn" @click="addFriend">Add</button>
      </div>
      <p v-if="friendError" class="mb-2 text-sm text-[var(--danger)]">{{ friendError }}</p>

      <p v-if="friendsLoading" class="text-sm text-[var(--text-muted)]">Loading...</p>

      <div v-else-if="friends.length" class="space-y-2">
        <div
          v-for="f in friends"
          :key="f._id"
          class="flex items-center gap-3 rounded-lg border border-[var(--line)] bg-[var(--surface)] px-3 py-2 text-sm"
        >
          <span class="flex-1 font-medium">{{ f.username }}</span>
          <span v-if="f.firstName || f.lastName" class="text-xs text-[var(--text-muted)]">
            {{ f.firstName }} {{ f.lastName }}
          </span>
          <button class="text-xs text-[var(--danger)] hover:underline" @click="removeFriend(f._id)">Remove</button>
        </div>
      </div>

      <p v-else class="text-sm text-[var(--text-muted)]">No friends added yet.</p>
    </BaseCard>

    <BaseCard rounded="rounded-2xl" padding="p-6" class="border border-[var(--line)]">
      <div class="mb-4 flex items-center justify-between">
        <h2 class="text-xl font-bold">Search History</h2>
        <button
          v-if="searchHistory.length"
          class="text-xs text-[var(--text-muted)] underline hover:text-[var(--danger)]"
          @click="clearHistory"
        >
          Clear all
        </button>
      </div>

      <p v-if="historyLoading" class="text-sm text-[var(--text-muted)]">Loading...</p>

      <div v-else-if="searchHistory.length" class="space-y-2">
        <div
          v-for="entry in searchHistory.slice(0, 15)"
          :key="entry._id"
          class="flex items-center gap-2 rounded-lg border border-[var(--line)] bg-[var(--surface)] px-3 py-2 text-sm"
        >
          <span class="text-[var(--text-muted)]">🔍</span>
          <span class="flex-1">{{ entry.query }}</span>
          <span class="rounded-full bg-[var(--rose)] px-2 py-0.5 text-xs text-[var(--wine)]">{{ entry.type }}</span>
          <span class="text-xs text-[var(--text-muted)]">{{ formatDate(entry.searchedAt) }}</span>
        </div>
      </div>

      <p v-else class="text-sm text-[var(--text-muted)]">No search history yet.</p>
    </BaseCard>
  </PageFrame>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '../stores/authStore'
import { useProfileStore } from '../stores/profileStore'
import BaseButton from '../components/ui/BaseButton.vue'
import BaseCard from '../components/ui/BaseCard.vue'
import BaseInput from '../components/ui/BaseInput.vue'
import PageFrame from '../components/ui/PageFrame.vue'
import SectionHeader from '../components/ui/SectionHeader.vue'
import avatar from '../assets/images/avatar.png'
import client from '../components/httpService/client'

const authStore = useAuthStore()
const profileStore = useProfileStore()

const isEditing = ref(false)
const fileInput = ref(null)
const uploading = ref(false)

const groqKeyInput = ref(authStore.groqApiKey || '')
const showGroqKey = ref(false)

function saveGroqKey() {
  authStore.setGroqApiKey(groqKeyInput.value)
}

function clearGroqKey() {
  authStore.setGroqApiKey('')
  groqKeyInput.value = ''
}
const searchHistory = ref([])
const historyLoading = ref(false)
const friends = ref([])
const friendsLoading = ref(false)
const friendInput = ref('')
const friendError = ref('')

onMounted(async () => {
  profileStore.fetchProfile()

  historyLoading.value = true
  friendsLoading.value = true

  const [history, friendList] = await Promise.allSettled([
    client.get('users/search-history'),
    client.get('users/friends'),
  ])

  searchHistory.value = history.status === 'fulfilled' ? history.value : []
  friends.value = friendList.status === 'fulfilled' ? friendList.value : []

  historyLoading.value = false
  friendsLoading.value = false
})

async function addFriend() {
  const username = friendInput.value.trim()
  if (!username) return
  friendError.value = ''
  try {
    const newFriend = await client.post('users/friends', { username })
    if (!friends.value.find((f) => f._id === newFriend._id)) {
      friends.value.push(newFriend)
    }
    friendInput.value = ''
  } catch (err) {
    friendError.value = err.message || 'Could not add friend.'
  }
}

async function removeFriend(friendId) {
  try {
    await client.delete(`users/friends/${friendId}`)
    friends.value = friends.value.filter((f) => f._id !== friendId)
  } catch {}
}

function formatDate(iso) {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}

async function clearHistory() {
  try {
    await client.delete('users/search-history')
    searchHistory.value = []
  } catch {}
}

async function saveChanges() {
  await profileStore.updateProfile(authStore.user)
  isEditing.value = false
}

function triggerFileInput() {
  fileInput.value.click()
}

function compressImage(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onerror = reject
    reader.onload = (e) => {
      const img = new Image()
      img.onerror = reject
      img.onload = () => {
        const MAX = 300
        const scale = Math.min(1, MAX / Math.max(img.width, img.height))
        const canvas = document.createElement('canvas')
        canvas.width = Math.round(img.width * scale)
        canvas.height = Math.round(img.height * scale)
        canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height)
        resolve(canvas.toDataURL('image/jpeg', 0.82))
      }
      img.src = e.target.result
    }
    reader.readAsDataURL(file)
  })
}

async function handleImageUpload(event) {
  const file = event.target.files?.[0]
  if (!file) return
  uploading.value = true
  try {
    authStore.user.img = await compressImage(file)
  } catch {
    // keep existing image on error
  } finally {
    uploading.value = false
    fileInput.value.value = ''
  }
}
</script>

<style scoped>
.friend-input {
  flex: 1;
  border-radius: 0.65rem;
  border: 1px solid var(--line);
  background: var(--surface);
  color: var(--text-main);
  font-size: 0.9rem;
  padding: 0.5rem 0.8rem;
  outline: none;
  transition: 0.2s ease;
}

.friend-input:focus {
  border-color: var(--wine);
  box-shadow: 0 0 0 2px rgba(93, 31, 50, 0.12);
}

.friend-add-btn {
  border-radius: 0.65rem;
  border: 1px solid var(--wine);
  background: transparent;
  color: var(--wine);
  font-size: 0.9rem;
  font-weight: 600;
  padding: 0.5rem 1rem;
  cursor: pointer;
  transition: 0.15s ease;
}

.friend-add-btn:hover {
  background: var(--wine);
  color: white;
}
</style>
