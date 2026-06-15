import { defineStore } from 'pinia'
import { ref } from 'vue'
import client from '@/components/httpService/client'

export const useAdminStore = defineStore('admin', () => {
  const users = ref([])
  const stats = ref(null)
  const pairingFeedback = ref([])
  const pairingTrainingSummary = ref(null)
  const trainingRun = ref(null)
  const ratingComments = ref([])

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

  async function fetchRatingComments() {
    const [wineRatings, recipeRatings] = await Promise.all([
      client.get('wines/admin/ratings'),
      client.get('recipes/admin/ratings'),
    ])
    ratingComments.value = [...wineRatings, ...recipeRatings].sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0
      return dateB - dateA
    })
    return ratingComments.value
  }

  async function deleteRatingComment(item) {
    const endpoint =
      item.itemType === 'wine'
        ? `wines/${item.itemId}/rating/${item.ratingId}`
        : `recipes/${item.itemId}/rating/${item.ratingId}`

    await client.delete(endpoint)
    ratingComments.value = ratingComments.value.filter(
      (comment) =>
        !(
          comment.itemType === item.itemType &&
          comment.itemId === item.itemId &&
          comment.ratingId === item.ratingId
        )
    )
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
    ratingComments,
    fetchPairingFeedback,
    reviewPairingFeedback,
    approvePendingPairingFeedback,
    fetchPairingTrainingSummary,
    trainPairingModel,
    fetchRatingComments,
    deleteRatingComment,
  }
})
