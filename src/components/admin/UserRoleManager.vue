<template>
  <div class="glass-panel rounded-xl border border-[var(--line)] p-6 text-[var(--text-main)]">
    <div class="mb-4">
      <BaseButton to="/admin" variant="secondary">Vissza</BaseButton>
    </div>

    <h2 class="mb-6 text-2xl">Jogosultságkezelés</h2>

    <table class="w-full text-left">
      <thead>
        <tr class="border-b border-[var(--line)]">
          <th>Név</th>
          <th>Email</th>
          <th>Admin</th>
          <th>Művelet</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="user in adminStore.users" :key="user._id" class="border-b border-[var(--line)]">
          <td>{{ user.username }}</td>
          <td>{{ user.email }}</td>
          <td>
            <span v-if="user.isAdmin" class="text-green-600">Admin</span>
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
