<template>
  <div class="bg-gray-900 p-6 rounded-xl text-white">
    <h2 class="text-2xl mb-6">Jogosultságkezelés</h2>

    <table class="w-full text-left">
      <thead>
        <tr class="border-b border-gray-600">
          <th>Név</th>
          <th>Email</th>
          <th>Admin</th>
          <th>Művelet</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="user in adminStore.users" :key="user._id">
          <td>{{ user.username }}</td>
          <td>{{ user.email }}</td>
          <td>
            <span v-if="user.isAdmin" class="text-green-400">Admin</span>
            <span v-else>User</span>
          </td>

          <td>
            <BaseButton variant="secondary" @click="toggleAdmin(user)">
              {{ user.isAdmin ? 'Admin jog elvétele' : 'Adminná tesz' }}
            </BaseButton>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useAdminStore } from '@/stores/adminStore'
import BaseButton from '../ui/BaseButton.vue'

const adminStore = useAdminStore()

onMounted(() => {
  adminStore.fetchUsers()
})

function toggleAdmin(user) {
  adminStore.updateUserRole(user._id, !user.isAdmin)
}
</script>
