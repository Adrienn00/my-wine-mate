import { defineStore } from 'pinia'

export const useWinesStore = defineStore('wines', {
  state: () => ({
    wines: [
      {
        name: 'Cabernet Sauvignon',
        type: 'Vörös',
        style: 'Száraz',
        price: '80-130',
        flavor: 'Fűszeres',
        ratings: [],
        comment: [],
      },
      {
        name: 'Chardonnay',
        type: 'Fehér',
        style: 'Félszáraz',
        price: '50-80',
        flavor: 'Gyümölcsös',
        ratings: [],
        comment: [],
      },
      {
        name: 'Tokaji Aszú',
        type: 'Fehér',
        style: 'Édes',
        price: '>130',
        flavor: 'Egyéb',
        ratings: [],
        comment: [],
      },
      {
        name: 'Kékfrankos Rosé',
        type: 'Rozé',
        style: 'Száraz',
        price: '20-50',
        flavor: 'Virágos',
        ratings: [],
        comment: [],
      },
      {
        name: 'Merlot',
        type: 'Vörös',
        style: 'Félédes',
        price: '50-80',
        flavor: 'Földes',
        ratings: [],
        comment: [],
      },
    ],
  }),
  getters: {
    getAllWines: (state) => state.wines,
  },
  actions: {
    addRating(wineName, rating, comment) {
      const wine = this.wines.find((w) => w.name === wineName)
      if (wine) {
        wine.ratings.push({ rating, comment })
      }
    },
  },
})
