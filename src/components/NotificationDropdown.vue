<template>
  <div class="relative inline-block">
    <div class="text-white text-xl cursor-pointer" @click="toggleNotifications">
      🔔
      <span
        v-if="unreadNotifications > 0"
        class="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-2"
      >
        {{ unreadNotifications }}
      </span>
    </div>

    <div
      v-if="showNotifications"
      class="absolute right-0 mt-2 w-72 bg-gray-900 border border-gray-700 rounded-lg shadow-lg p-3 z-50"
    >
      <div class="text-yellow-100 font-bold mb-2">Értesítések</div>

      <div v-if="profileStore.notifications.length === 0" class="text-gray-400 text-sm">
        Nincs értesítés
      </div>

      <div
        v-for="n in profileStore.notifications"
        :key="n._id"
        class="flex justify-between items-center text-sm text-gray-200 border-b border-gray-700 py-2"
      >
        <span>{{ n.message }}</span>

        <button
          @click="deleteNotification(n._id)"
          class="text-red-400 hover:text-red-200 text-xs ml-2"
        >
          ✕
        </button>
      </div>
    </div>
  </div>
</template>
<script setup>
import { computed, ref } from 'vue'
import client from '@/components/httpService/client'
import { useProfileStore } from '@/stores/profileStore'

const profileStore = useProfileStore()
const showNotifications = ref(false)

const unreadNotifications = computed(() => profileStore.notifications.length)

async function toggleNotifications() {
  showNotifications.value = !showNotifications.value

  if (showNotifications.value) {
    await profileStore.fetchProfile()
  }
}

async function deleteNotification(id) {
  try {
    await client.delete(`users/notifications/${id}`)

    profileStore.notifications = profileStore.notifications.filter((n) => n._id !== id)
  } catch (error) {
    console.error('Notification delete error:', error)
  }
}
</script>
