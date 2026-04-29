import { defineStore } from 'pinia'
import { ref } from 'vue'
import client from '@/components/httpService/client'

export const useAdminStore = defineStore('admin', () => {
  const users = ref([])
  const stats = ref(null)
  const pairingFeedback = ref([])
  const pairingTrainingSummary = ref(null)
  const trainingRun = ref(null)

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

  async function fetchStats() {
    stats.value = await client.get('users/stats')
  }

  async function fetchPairingFeedback(status = 'all', limit = 50) {
    pairingFeedback.value = await client.get(
      `pairings/admin/feedback?status=${encodeURIComponent(status)}&limit=${encodeURIComponent(limit)}`
    )
    return pairingFeedback.value
  }

  async function reviewPairingFeedback(id, status) {
    const updated = await client.put(`pairings/admin/feedback/${id}/status`, { status })
    const index = pairingFeedback.value.findIndex((item) => item._id === id)
    if (index !== -1) {
      pairingFeedback.value[index] = updated
    }
    return updated
  }

  async function approvePendingPairingFeedback() {
    return await client.post('pairings/admin/feedback/approve-pending', {})
  }

  async function fetchPairingTrainingSummary() {
    pairingTrainingSummary.value = await client.get('pairings/admin/training-summary')
    trainingRun.value = pairingTrainingSummary.value?.training?.lastRun || null
    return pairingTrainingSummary.value
  }

  async function trainPairingModel() {
    trainingRun.value = await client.post('pairings/admin/train', {})
    await fetchPairingTrainingSummary()
    return trainingRun.value
  }

  return {
    users,
    fetchUsers,
    updateUserRole,
    fetchStats,
    stats,
    pairingFeedback,
    pairingTrainingSummary,
    trainingRun,
    fetchPairingFeedback,
    reviewPairingFeedback,
    approvePendingPairingFeedback,
    fetchPairingTrainingSummary,
    trainPairingModel,
  }
})
