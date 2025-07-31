import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useWinesStore = defineStore('wines', () => {
  const wines = ref([])
  const confirmedWines = computed(() => wines.value.filter((w) => w.is_confirmed))
  const pendingWines = computed(() => wines.value.filter((w) => !w.is_confirmed))

  async function addRating(wineName, rating, comment) {
    try {
      const response = await fetch('http://localhost:3000/api/wines/rating', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ wineName, rating, comment }),
      })
      if (!response.ok) throw new Error('Sikertelen ertekeles hozzaadasa')
      const updatedWine = await response.json()
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
      const response = await fetch('http://localhost:3000/api/wines')
      const data = await response.json()
      wines.value = data
      return wines.value
    } catch (error) {
      console.error('Hiba a borok lekerdezesekor: ', error)
      return []
    }
  }

  async function addNewWine(wineData) {
    try {
      const response = await fetch('http://localhost:3000/api/wines', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(wineData),
      })
      if (!response.ok) throw new Error('Sikertelen hozzáadás')

      const newWine = await response.json()
      wines.value.push(newWine)

      return newWine
    } catch (error) {
      console.error('Hiba bor hozzáadásakor:', error)
      return null
    }
  }

  async function approveWine(id) {
    try {
      const response = await fetch(`http://localhost:3000/api/wines/approve/${id}`, {
        method: 'PUT',
      })
      if (!response.ok) throw new Error('Sikertelen jovahagyas')
      const updatedWine = await response.json()
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
      const response = await fetch(`http://localhost:3000/api/wines/${updatedWine.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedWine),
      })
      if (!response.ok) throw new Error('Sikertelen frissites')
      const updated = await response.json()
      const index = wines.value.findIndex((w) => w.id === updated.id)
      if (index !== -1) {
        wines.value[index] = updated
      }
      return updated
    } catch (error) {
      console.error('Hiba bor frissitesekor:', error)
      return null
    }
  }

  async function deleteWine(id) {
    try {
      const response = await fetch(`http://localhost:3000/api/wines/${id}`, {
        method: 'DELETE',
      })
      if (!response.ok) throw new Error('Sikertelen torles')
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
