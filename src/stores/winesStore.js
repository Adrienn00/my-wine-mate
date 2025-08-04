import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import client from '../components/httpService/client'

export const useWinesStore = defineStore('wines', () => {
  const wines = ref([])
  const confirmedWines = computed(() => wines.value.filter((w) => w.is_confirmed))
  const pendingWines = computed(() => wines.value.filter((w) => !w.is_confirmed))

  async function addRating(wineName, rating, comment) {
    try {
      const updatedWine = await client.post('wines/rating', { wineName, rating, comment })
      const index = wines.value.findIndex((w) => w.name === wineName)
      if (index !== -1) {
        wines.value[index] = updatedWine
      }

      return true
    } catch (error) {
      console.error(error)
      return false
    }
  }

  async function getAllWines() {
    try {
      wines.value = await client.get('wines')
      return wines.value
    } catch (error) {
      console.error('An error occurred while fetching wines', error)
      return []
    }
  }

  async function addNewWine(wineData) {
    try {
      const newWine = await client.post('wines', wineData)
      wines.value.push(newWine)

      return newWine
    } catch (error) {
      console.error('Error while adding wine', error)
      return null
    }
  }

  async function approveWine(id) {
    try {
      const updatedWine = await client.put(`wines/approve/${id}`)
      const index = wines.value.findIndex((w) => w.id === id)
      if (index !== -1) {
        wines.value[index] = updatedWine
      }

      return updatedWine
    } catch (error) {
      console.error(error)
      return null
    }
  }

  async function updateWine(updatedWine) {
    try {
      const updated = await client.put(`wines/${updatedWine.id}`)
      const index = wines.value.findIndex((w) => w.id === updated.id)
      if (index !== -1) {
        wines.value[index] = updated
      }
      return updated
    } catch (error) {
      console.error('Error while updating wine', error)
      return null
    }
  }

  async function deleteWine(id) {
    try {
      await client.delete(`wines/${id}`)
      const index = wines.value.findIndex((w) => w.id === id)
      if (index !== -1) {
        wines.value.splice(index, 1)
      }
      return true
    } catch (error) {
      console.error(error)
      return false
    }
  }

  return {
    wines,
    addRating,
    addNewWine,
    approveWine,
    getAllWines,
    confirmedWines,
    pendingWines,
    updateWine,
    deleteWine,
  }
})
