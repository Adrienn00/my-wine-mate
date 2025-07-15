<template>
  <NavBar />
  <div class="min-h-screen bg">
    <div class="flex items-center justify-between max-w-6xl mx-auto px-4 py-12">
      <div class="flex flex-col gap-y-5 w-100">
        <h1 class="text-center text-3xl md:text-5xl font-light mb-6 leading-snug text-yellow-100">
          Adj hozzá új bort
        </h1>
        <div class="flex flex-col gap-y-5">
          <input
            id="wineName"
            v-model="wine.name"
            list="name-options"
            placeholder="Add meg a bor nevét..."
            class="px-4 py-2 border rounded bg-gray-900 text-white border-gray-700 focus:outline-none focus:ring focus:border-yellow-300"
          />
          <datalist id="name-options">
            <option value="Cabernet Sauvignon" />
            <option value="Merlot" />
            <option value="Chardonnay" />
            <option value="Pinot Noir" />
          </datalist>
          <input
            id="grape"
            v-model="wine.grape"
            list="grape-options"
            placeholder="Add meg a szőlő fajtáját..."
            class="px-4 py-2 border rounded bg-gray-900 text-white border-gray-700 focus:outline-none focus:ring focus:border-yellow-300"
          />
          <datalist id="grape-options">
            <option value="Vörös" />
            <option value="Fehér" />
            <option value="Rozé" />
          </datalist>
          <input
            id="style"
            v-model="wine.style"
            list="style-options"
            placeholder="Add meg a bor típusát..."
            class="px-4 py-2 border rounded bg-gray-900 text-white border-gray-700 focus:outline-none focus:ring focus:border-yellow-300"
          />
          <datalist id="style-options">
            <option value="Száraz" />
            <option value="Félszáraz" />
            <option value="Édes" />
            <option value="Félédes"></option>
          </datalist>
          <input
            id="price"
            v-model="wine.price"
            list="price-options"
            placeholder="Add meg  bor árát..."
            class="px-4 py-2 border rounded bg-gray-900 text-white border-gray-700 focus:outline-none focus:ring focus:border-yellow-300"
          />
          <datalist id="price-options">
            <option value="20-50" />
            <option value="50-80" />
            <option value="80-130" />
            <option value=">130" />
          </datalist>
          <input
            id="flavor"
            v-model="wine.flavor"
            list="flavor-options"
            placeholder="Add meg a bor ízvilágát..."
            class="px-4 py-2 border rounded bg-gray-900 text-white border-gray-700 focus:outline-none focus:ring focus:border-yellow-300"
          />
          <datalist id="flavor-options">
            <option value="Gyümölcsös" />
            <option value="Fűszeres" />
            <option value="Virágos" />
            <option value="Földes" />
          </datalist>
          <BaseButton variant="secondary" @click="submitWine">Bor hozzáadása</BaseButton>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import BaseButton from '../components/BaseButton.vue'
import NavBar from '../components/NavBar.vue'
import { ref } from 'vue'

const wine = ref({
  name: '',
  grape: '',
  style: '',
  price: '',
  flavor: '',
})

const wineList = ref([])

function submitWine() {
  for (const [key, value] of Object.entries(wine.value)) {
    if (!value.trim()) {
      alert(`A(z) "${key}" mező kitöltése kötelező!`)
      return
    }
  }
  wineList.value.push({ ...wine.value })

  Object.keys(wine.value).forEach((key) => {
    wine.value[key] = ''
  })

  console.log('Borok:', wineList.value)
}
</script>
<style scoped>
.bg {
  background-image: url('/home/adrienn/www/my-wine-mate/src/assets/images/bg.jpg');
  background-size: cover;
}
</style>
