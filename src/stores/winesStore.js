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
    },
    {
      id: 1,
      name: 'Chardonnay',
      type: 'Fehér',
      style: 'Félszáraz',
      price: '50-80',
      flavor: 'Gyümölcsös',
      ratings: [],
    },
    {
      id: 2,
      name: 'Tokaji Aszú',
      type: 'Fehér',
      style: 'Édes',
      price: '>130',
      flavor: 'Egyéb',
      ratings: [],
    },
    {
      id: 3,
      name: 'Kékfrankos Rosé',
      type: 'Rozé',
      style: 'Száraz',
      price: '20-50',
      flavor: 'Virágos',
      ratings: [],
    },
    {
      id: 4,
      name: 'Merlot',
      type: 'Vörös',
      style: 'Félédes',
      price: '50-80',
      flavor: 'Földes',
      ratings: [],
    },
  ])

  function addRating(wineName, rating, comment) {
    const wine = wines.value.find((w) => w.name === wineName)
    if (wine) {
      wine.ratings.push({ rating, comment })
    }
  }

  const getAllWines = computed(() => wines.value)

  return { wines, addRating, getAllWines }
})
