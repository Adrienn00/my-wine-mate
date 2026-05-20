<template>
  <PageFrame max-width="max-w-4xl">
    <SectionHeader kicker="Community" title="Social" />

    <!-- Tabs -->
    <div class="mb-6 flex gap-1 rounded-xl border border-[var(--line)] bg-[var(--surface)] p-1">
      <button
        v-for="tab in tabs"
        :key="tab.key"
        class="tab-btn"
        :class="{ 'tab-btn--active': activeTab === tab.key }"
        @click="activeTab = tab.key"
      >
        {{ tab.label }}
        <span v-if="tab.badge" class="tab-badge">{{ tab.badge }}</span>
      </button>
    </div>

    <!-- FRIEND REQUESTS TAB -->
    <div v-if="activeTab === 'requests'">
      <BaseCard rounded="rounded-2xl" padding="p-6" class="mb-4 border border-[var(--line)]">
        <h3 class="mb-3 font-semibold">Send Friend Request</h3>
        <div class="flex gap-2">
          <input v-model="newRequestUsername" type="text" placeholder="Username..." class="social-input" @keyup.enter="sendRequest" />
          <button class="social-btn-primary" :disabled="requestSending" @click="sendRequest">
            {{ requestSending ? '...' : 'Send' }}
          </button>
        </div>
        <p v-if="requestMsg" :class="requestError ? 'text-[var(--danger)]' : 'text-green-600'" class="mt-2 text-sm">
          {{ requestMsg }}
        </p>
      </BaseCard>

      <BaseCard rounded="rounded-2xl" padding="p-6" class="border border-[var(--line)]">
        <h3 class="mb-4 font-semibold">Incoming Requests</h3>
        <p v-if="requestsLoading" class="text-sm text-[var(--text-muted)]">Loading...</p>
        <p v-else-if="!friendRequests.length" class="text-sm text-[var(--text-muted)]">No pending requests.</p>
        <div v-else class="space-y-3">
          <div
            v-for="req in friendRequests"
            :key="req._id"
            class="flex items-center gap-3 rounded-xl border border-[var(--line)] bg-white p-3"
          >
            <div class="flex-1">
              <p class="font-semibold">{{ req.from.username }}</p>
              <p v-if="req.from.firstName || req.from.lastName" class="text-xs text-[var(--text-muted)]">
                {{ req.from.firstName }} {{ req.from.lastName }}
              </p>
            </div>
            <button class="social-btn-primary text-sm" @click="acceptRequest(req.from._id)">Accept</button>
            <button class="social-btn-secondary text-sm" @click="declineRequest(req.from._id)">Decline</button>
          </div>
        </div>
      </BaseCard>
    </div>

    <!-- FRIENDS TAB -->
    <div v-else-if="activeTab === 'friends'">
      <BaseCard rounded="rounded-2xl" padding="p-6" class="border border-[var(--line)]">
        <h3 class="mb-4 font-semibold">My Friends</h3>
        <p v-if="friendsLoading" class="text-sm text-[var(--text-muted)]">Loading...</p>
        <p v-else-if="!friends.length" class="text-sm text-[var(--text-muted)]">
          No friends yet. Send a friend request above.
        </p>
        <div v-else class="space-y-3">
          <div
            v-for="f in friends"
            :key="f._id"
            class="flex items-center gap-3 rounded-xl border border-[var(--line)] bg-white p-3"
          >
            <div class="flex-1">
              <p class="font-semibold">{{ f.username }}</p>
              <p v-if="f.firstName || f.lastName" class="text-xs text-[var(--text-muted)]">
                {{ f.firstName }} {{ f.lastName }}
              </p>
            </div>
            <button class="text-xs text-[var(--danger)] hover:underline" @click="removeFriend(f._id)">Remove</button>
          </div>
        </div>
      </BaseCard>
    </div>

    <!-- SHARED WINES TAB -->
    <div v-else-if="activeTab === 'shared'">
      <div class="mb-4 flex gap-2">
        <button class="tab-btn" :class="{ 'tab-btn--active': sharedTab === 'inbox' }" @click="sharedTab = 'inbox'">
          Received
        </button>
        <button class="tab-btn" :class="{ 'tab-btn--active': sharedTab === 'sent' }" @click="sharedTab = 'sent'">
          Sent
        </button>
      </div>

      <p v-if="sharedLoading" class="text-sm text-[var(--text-muted)]">Loading...</p>

      <div v-else-if="sharedList.length" class="space-y-3">
        <div
          v-for="item in sharedList"
          :key="item._id"
          class="flex gap-4 rounded-xl border bg-white p-4"
          :class="!item.read && sharedTab === 'inbox' ? 'border-[var(--wine)]' : 'border-[var(--line)]'"
          @click="openSharedWine(item)"
        >
          <img
            v-if="item.wine?.imageUrl"
            :src="item.wine.imageUrl"
            class="h-16 w-16 rounded-lg object-cover"
          />
          <div v-else class="flex h-16 w-16 items-center justify-center rounded-lg bg-[var(--rose)] text-2xl">
            🍷
          </div>
          <div class="flex-1">
            <p class="font-semibold">{{ item.wine?.name || 'Unknown wine' }}</p>
            <p class="text-xs text-[var(--text-muted)]">{{ item.wine?.type }} · {{ item.wine?.winery }}</p>
            <p v-if="item.message" class="mt-1 text-sm italic text-[var(--text-muted)]">"{{ item.message }}"</p>
            <p class="mt-1 text-xs text-[var(--text-muted)]">
              <span v-if="sharedTab === 'inbox'">From {{ item.from?.username }}</span>
              <span v-else>To {{ item.to?.username }}</span>
              · {{ formatDate(item.createdAt) }}
            </p>
          </div>
          <span v-if="!item.read && sharedTab === 'inbox'" class="self-start rounded-full bg-[var(--wine)] px-2 py-0.5 text-xs text-white">
            New
          </span>
        </div>
      </div>

      <p v-else class="text-sm text-[var(--text-muted)]">
        {{ sharedTab === 'inbox' ? 'No wines received yet.' : 'You haven\'t shared any wines yet.' }}
      </p>
    </div>
  </PageFrame>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import PageFrame from '../components/ui/PageFrame.vue'
import SectionHeader from '../components/ui/SectionHeader.vue'
import BaseCard from '../components/ui/BaseCard.vue'
import client from '../components/httpService/client'

const router = useRouter()

const activeTab = ref('requests')
const sharedTab = ref('inbox')

const friendRequests = ref([])
const friends = ref([])
const inbox = ref([])
const sent = ref([])

const requestsLoading = ref(false)
const friendsLoading = ref(false)
const sharedLoading = ref(false)

const newRequestUsername = ref('')
const requestSending = ref(false)
const requestMsg = ref('')
const requestError = ref(false)

const sharedList = computed(() => sharedTab.value === 'inbox' ? inbox.value : sent.value)
const unreadCount = computed(() => inbox.value.filter((i) => !i.read).length)
const pendingCount = computed(() => friendRequests.value.length)

const tabs = computed(() => [
  { key: 'requests', label: 'Requests', badge: pendingCount.value || null },
  { key: 'friends', label: 'Friends', badge: null },
  { key: 'shared', label: 'Shared Wines', badge: unreadCount.value || null },
])

onMounted(async () => {
  await Promise.all([loadRequests(), loadFriends(), loadInbox()])
})

watch(sharedTab, async (tab) => {
  if (tab === 'sent' && !sent.value.length) await loadSent()
})

async function loadRequests() {
  requestsLoading.value = true
  try { friendRequests.value = await client.get('social/friend-requests') } catch { friendRequests.value = [] }
  finally { requestsLoading.value = false }
}

async function loadFriends() {
  friendsLoading.value = true
  try { friends.value = await client.get('social/friends') } catch { friends.value = [] }
  finally { friendsLoading.value = false }
}

async function loadInbox() {
  sharedLoading.value = true
  try { inbox.value = await client.get('social/shared-wines/inbox') } catch { inbox.value = [] }
  finally { sharedLoading.value = false }
}

async function loadSent() {
  sharedLoading.value = true
  try { sent.value = await client.get('social/shared-wines/sent') } catch { sent.value = [] }
  finally { sharedLoading.value = false }
}

async function sendRequest() {
  const username = newRequestUsername.value.trim()
  if (!username) return
  requestSending.value = true
  requestMsg.value = ''
  try {
    await client.post('social/friend-requests', { username })
    requestMsg.value = `Request sent to ${username}!`
    requestError.value = false
    newRequestUsername.value = ''
  } catch (err) {
    requestMsg.value = err.message || 'Could not send request.'
    requestError.value = true
  } finally {
    requestSending.value = false
  }
}

async function acceptRequest(requesterId) {
  try {
    await client.post(`social/friend-requests/${requesterId}/accept`)
    friendRequests.value = friendRequests.value.filter((r) => r.from._id !== requesterId)
    await loadFriends()
  } catch {}
}

async function declineRequest(requesterId) {
  try {
    await client.delete(`social/friend-requests/${requesterId}`)
    friendRequests.value = friendRequests.value.filter((r) => r.from._id !== requesterId)
  } catch {}
}

async function removeFriend(friendId) {
  try {
    await client.delete(`social/friends/${friendId}`)
    friends.value = friends.value.filter((f) => f._id !== friendId)
  } catch {}
}

async function openSharedWine(item) {
  if (!item.read && sharedTab.value === 'inbox') {
    try {
      await client.request(`social/shared-wines/${item._id}/read`, { method: 'PATCH' })
      item.read = true
    } catch {}
  }
  if (item.wine?._id) router.push(`/wine/${item.wine._id}`)
}

function formatDate(iso) {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}
</script>

<style scoped>
.tab-btn {
  flex: 1;
  border-radius: 0.6rem;
  padding: 0.5rem 0.8rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-muted);
  background: transparent;
  border: none;
  cursor: pointer;
  transition: 0.15s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
}

.tab-btn--active {
  background: white;
  color: var(--wine);
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
}

.tab-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 1.2rem;
  height: 1.2rem;
  border-radius: 999px;
  background: var(--wine);
  color: white;
  font-size: 0.7rem;
  font-weight: 700;
  padding: 0 0.3rem;
}

.social-input {
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

.social-input:focus {
  border-color: var(--wine);
  box-shadow: 0 0 0 2px rgba(93, 31, 50, 0.12);
}

.social-btn-primary {
  border-radius: 0.65rem;
  border: 1px solid var(--wine);
  background: var(--wine);
  color: white;
  font-size: 0.85rem;
  font-weight: 600;
  padding: 0.45rem 1rem;
  cursor: pointer;
  transition: 0.15s ease;
}

.social-btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.social-btn-primary:hover:not(:disabled) {
  opacity: 0.88;
}

.social-btn-secondary {
  border-radius: 0.65rem;
  border: 1px solid var(--line);
  background: transparent;
  color: var(--text-muted);
  font-size: 0.85rem;
  font-weight: 600;
  padding: 0.45rem 1rem;
  cursor: pointer;
  transition: 0.15s ease;
}

.social-btn-secondary:hover {
  border-color: var(--danger);
  color: var(--danger);
}
</style>
