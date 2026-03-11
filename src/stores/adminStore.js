import { defineStore } from 'pinia'
import { ref } from 'vue'
import client from '@/components/httpService/client'

export const useAdminStore = defineStore('admin', () => {
  const users = ref([])

  async function fetchUsers() {
    users.value = await client.get('users/all')
  }

  async function updateUserRole(id, isAdmin) {
    const updated = await client.put(`users/role/${id}`, { isAdmin })

    const index = users.value.findIndex((u) => u._id === id)
    if (index !== -1) {
      users.value[index] = updated
    }
  }

  return {
    users,
    fetchUsers,
    updateUserRole,
  }
})
