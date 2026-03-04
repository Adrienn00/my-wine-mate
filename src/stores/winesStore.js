import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import client from '../components/httpService/client'

export const useWinesStore = defineStore('wines', () => {
  const wines = ref([])

  const pendingWines = computed(() => wines.value.filter((w) => w && w.is_confirmed === false))
  const confirmedWines = computed(() => wines.value.filter((w) => w && w.is_confirmed === true))

  async function getAllWines() {
    try {
      const response = await client.get('wines')
      wines.value = Array.isArray(response) ? response : (response?.data ?? [])
      return wines.value
    } catch (error) {
      console.error('An error occurred while fetching wines:', error)
      wines.value = []
      return []
    }
  }

  // EGY bor lekérése a backenden (ne a wines tömbből keresgélj)
  async function getSelectedWine(id) {
    try {
      const response = await client.get(`wines/${id}`)
      return response
    } catch (error) {
      console.error('An error occurred while fetching the selected wine:', error)
      return null
    }
  }

  async function addRating(id, rating, comment) {
    try {
      const response = await client.post(`wines/${id}/rating`, { rating, comment })

      // frissítsük a listában is, ha benne van
      const index = wines.value.findIndex((w) => w._id === response._id)
      if (index !== -1) wines.value[index] = response

      return response
    } catch (error) {
      console.error('Error while adding rating:', error)
      return null
    }
  }

  async function addNewWine(wineData) {
    try {
      const newWine = await client.post('wines', wineData)
      wines.value.push(newWine)
      return newWine
    } catch (error) {
      console.error('Error while adding wine:', error)
      return null
    }
  }

  async function approveWine(id) {
    try {
      const updatedWine = await client.put(`wines/${id}`, { is_confirmed: true })
      const index = wines.value.findIndex((w) => w._id === id)
      if (index !== -1) wines.value[index] = updatedWine
      return updatedWine
    } catch (error) {
      console.error('Error while approving wine:', error)
      return null
    }
  }

  async function updateWine(updatedWine) {
    try {
      const updated = await client.put(`wines/${updatedWine._id}`, updatedWine)
      const index = wines.value.findIndex((w) => w._id === updated._id)
      if (index !== -1) wines.value[index] = updated
      return updated
    } catch (error) {
      console.error('Error while updating wine:', error)
      return null
    }
  }

  async function deleteWine(id) {
    try {
      await client.delete(`wines/${id}`)
      const index = wines.value.findIndex((w) => w._id === id)
      if (index !== -1) wines.value.splice(index, 1)
      return true
    } catch (error) {
      console.error('Error while deleting wine:', error)
      return false
    }
  }

  return {
    wines,
    confirmedWines,
    pendingWines,
    getAllWines,
    getSelectedWine,
    addRating,
    addNewWine,
    approveWine,
    updateWine,
    deleteWine,
  }
})
