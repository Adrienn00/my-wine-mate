import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useWinesStore = defineStore('wines', () => {
  const wines = ref([
    {
      id: 0,
      name: 'Cabernet Sauvignon',
      type: 'Vörös',
      style: 'Száraz',
      price: '80-130',
      flavor: 'Fűszeres',
      ratings: [],
      is_confirmed: true,
    },
    {
      id: 1,
      name: 'Chardonnay',
      type: 'Fehér',
      style: 'Félszáraz',
      price: '50-80',
      flavor: 'Gyümölcsös',
      ratings: [],
      is_confirmed: true,
    },
    {
      id: 2,
      name: 'Tokaji Aszú',
      type: 'Fehér',
      style: 'Édes',
      price: '>130',
      flavor: 'Egyéb',
      ratings: [],
      is_confirmed: true,
    },
    {
      id: 3,
      name: 'Kékfrankos Rosé',
      type: 'Rozé',
      style: 'Száraz',
      price: '20-50',
      flavor: 'Virágos',
      ratings: [],
      is_confirmed: true,
    },
    {
      id: 4,
      name: 'Merlot',
      type: 'Vörös',
      style: 'Félédes',
      price: '50-80',
      flavor: 'Földes',
      ratings: [],
      is_confirmed: true,
    },
  ])
  const nextId = ref(5)
  function addRating(wineName, rating, comment) {
    const wine = wines.value.find((w) => w.name === wineName)
    if (wine) {
      wine.ratings.push({ rating, comment })
    }
  }
  function getAllWines() {
    return wines.value
  }

  function addNewWine(wine) {
    const newWine = {
      id: nextId.value++,
      ...wine,
      ratings: [],
      is_confirmed: false,
    }
    wines.value.push(newWine)
  }

  function approveWine(id) {
    const wine = wines.value.find((w) => w.id === id)
    if (wine) wine.is_confirmed = true
  }

  function rejectWine(id) {
    wines.value = wines.value.find((w) => w.id !== id)
  }

  const confirmedWines = computed(() => wines.value.filter((w) => w.is_confirmed))
  const pendingWines = computed(() => wines.value.filter((w) => !w.is_confirmed))

  return {
    wines,
    addRating,
    addNewWine,
    approveWine,
    rejectWine,
    getAllWines,
    confirmedWines,
    pendingWines,
  }
})
