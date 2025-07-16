<template>
  <NavBar />
  <div class="min-h-screen bg text-white p-4">
    <ul v-if="!selectedRecipe">
      <li
        v-for="recipe in recipes"
        :key="recipe.name"
        @click="selectRecipe(recipe)"
        class="px-4 py-2 border-b border-gray-700 last:border-b-0 hover:bg-gray-700 cursor-pointer"
      >
        {{ recipe.name }}
      </li>
    </ul>
    <div v-else class="mt-6 bg-black/70 p-4 rounded-lg shadow-lg">
      <h2 class="text-2xl font-bold mb-2">{{ selectedRecipe.name }}</h2>
      <p class="mb-2"><strong>Hozzávalók:</strong> {{ selectedRecipe.ingredients.join(', ') }}</p>
      <p class="mb-4"><strong>Leírás:</strong> {{ selectedRecipe.description }}</p>
      <div class="flex space-x-5">
        <BaseButton variant="primary" @click="selectedRecipe = null"> Vissza </BaseButton>
        <router-link
          to="/foodpairing"
          class="rounded px-4 py-2 transition bg-red-900 hover:bg-red-800 text-white"
          >Bor ajánló</router-link
        >
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import NavBar from '../components/NavBar.vue'
import BaseButton from '../components/BaseButton.vue'

const recipes = [
  {
    name: 'Rántotta',
    ingredients: ['tojás', 'só', 'olaj'],
    description: 'A tojásokat felverjük, megsózzuk, és olajon megsütjük.',
  },
  {
    name: 'Tejfölös gombapaprikás',
    ingredients: ['gomba', 'hagyma', 'paprika', 'tejföl', 'só'],
    description:
      'A hagymát megdinszteljük, hozzáadjuk a paprikát, gombát, majd tejföllel sűrítjük.',
  },
  {
    name: 'Sajtos melegszendvics',
    ingredients: ['kenyér', 'vaj', 'sajt'],
    description: 'A kenyeret megvajazzuk, sajtot teszünk rá, és megsütjük.',
  },
  {
    name: 'Banánturmix',
    ingredients: ['banán', 'tej', 'méz'],
    description: 'Minden hozzávalót összeturmixolunk.',
  },
  {
    name: 'Paradicsomos tészta',
    ingredients: ['tészta', 'paradicsomszósz', 'fokhagyma', 'só'],
    description: 'A tésztát kifőzzük, majd paradicsomszósszal összeforgatjuk.',
  },
]

const selectedRecipe = ref(null)

function selectRecipe(recipe) {
  selectedRecipe.value = recipe
}
</script>

<style scoped>
.bg {
  background-image: url('/home/adrienn/www/my-wine-mate/src/assets/images/bgfood.jpg');
  background-size: cover;
}
</style>
