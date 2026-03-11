<template>
  <div class="max-w-6xl mx-auto px-4">
    <div
      class="text-center text-4xl mb-10 text-yellow-100 font-extrabold underline underline-offset-8"
    >
      Rendszerstatisztika
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <div class="bg-gray-900 p-6 rounded-xl text-center shadow-lg">
        <div class="text-3xl font-bold text-yellow-200">
          {{ adminStore.stats?.usersCount }}
        </div>
        <div class="text-gray-400 mt-2">Felhasználók</div>
      </div>

      <div class="bg-gray-900 p-6 rounded-xl text-center shadow-lg">
        <div class="text-3xl font-bold text-yellow-200">
          {{ adminStore.stats?.winesCount }}
        </div>
        <div class="text-gray-400 mt-2">Borok</div>
      </div>

      <div class="bg-gray-900 p-6 rounded-xl text-center shadow-lg">
        <div class="text-3xl font-bold text-yellow-200">
          {{ adminStore.stats?.confirmedWinesCount }}
        </div>
        <div class="text-gray-400 mt-2">Jóváhagyott borok</div>
      </div>

      <div class="bg-gray-900 p-6 rounded-xl text-center shadow-lg">
        <div class="text-3xl font-bold text-yellow-200">
          {{ adminStore.stats?.pendingWinesCount }}
        </div>
        <div class="text-gray-400 mt-2">Jóváhagyásra vár</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useAdminStore } from '@/stores/adminStore'

const adminStore = useAdminStore()

onMounted(() => {
  adminStore.fetchStats()
})
</script>
