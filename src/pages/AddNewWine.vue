<template>
  <div class="min-h-screen bg">
    <div class="flex items-center justify-between max-w-6xl mx-auto px-4 py-12">
      <div class="flex flex-col gap-y-5 w-100">
        <h1 class="text-center text-3xl md:text-5xl font-light mb-6 leading-snug text-yellow-100">
          Adj hozzá új bort
        </h1>
        <div class="flex flex-col gap-y-5">
          <BaseInput
            id="wineName"
            v-model="wine.name"
            placeholder="Add meg a bor nevet"
            datalistId="name-options"
            :datalist="[
              'Merlot',
              'Chardonnay',
              'Cabernet Sauvignion',
              'Tokaji Aszú',
              'Kékfrankos Rosé',
            ]"
          />

          <BaseInput
            id="grape"
            v-model="wine.grape"
            placeholder="Add meg a szőlő fajtáját..."
            datalistId="grape-options"
            :datalist="['Vörös', 'Fehér', 'Rozé']"
          />
          <BaseInput
            id="style"
            v-model="wine.style"
            placeholder="Add meg a bor típusát..."
            datalistId="style-options"
            :datalist="['Száraz', 'Félszáraz', 'Édes', 'Félédes']"
          />
          <BaseInput
            id="price"
            v-model="wine.price"
            placeholder="Add meg  bor árát..."
            datalistId="price-options"
            :datalist="['20-50', '50-80', '80-130', '>130']"
          />
          <BaseInput
            id="flavor"
            v-model="wine.flavor"
            placeholder="Add meg a bor ízvilágát..."
            datalistId="flavour-options"
            :datalist="['Gyümölcsös', 'Fűszeres', 'Virágos', 'Földes']"
          />
          <BaseButton variant="secondary" @click="submitWine">Bor hozzáadása</BaseButton>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import BaseButton from '../components/ui/BaseButton.vue'
import BaseInput from '../components/ui/BaseInput.vue'
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
