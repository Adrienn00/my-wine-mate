import { defineStore } from 'pinia'

export const useFavoritesStore = defineStore('favorites', {
  state: () => ({
    favorites: [],
  }),
  actions: {
    addFavorite(wine) {
      if (!this.favorites.find((w) => w.name === wine.name)) {
        this.favorites.push(wine)
      }
    },
    removeFavorite(wine) {
      this.favorites = this.favorites.filter((w) => w.name !== wine.name)
    },
    isFavorite(wine) {
      return this.favorites.some((w) => w.name === wine.name)
    },
  },
})
