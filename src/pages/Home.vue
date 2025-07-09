<template>
  <NavBar />
  <div class="flex items-center justify-between max-w-6xl mx-auto px-4 py-12 min-h-screen">
    <div class="flex flex-col gap-y-5 w-1/2">
      <div class="text-center px-6 py-16">
        <div v-if="!selectedWine">
          <h1 class="text-3xl md:text-5xl font-light mb-6 leading-snug text-yellow-100">
            Találd meg a hozzád illő bort
          </h1>
          <input
            v-model="query"
            type="text"
            placeholder="Bor neve..."
            class="w-full px-4 py-2 border rounded bg-gray-900 text-white border-gray-700 focus:outline-none focus:ring focus:border-yellow-300 mb-6"
          />
          <div class="flex flex-wrap justify-center gap-4 my-6">
            <select v-model="selectedType" class="bg-gray-900 border border-gray-700 px-4 py-2 rounded">
              <option value="">Szőlőfajta</option>
              <option>Vörös</option>
              <option>Fehér</option>
              <option>Rozé</option>
            </select>

            <select v-model="selectedStyle" class="bg-gray-900 border border-gray-700 px-4 py-2 rounded">
              <option value="">Stílus</option>
              <option>Száraz</option>
              <option>Félszáraz</option>
              <option>Édes</option>
              <option>Félédes</option>
            </select>

            <select v-model="selectedPrice" class="bg-gray-900 border border-gray-700 px-4 py-2 rounded">
              <option value="">Ár</option>
              <option>20-50</option>
              <option>50-80</option>
              <option>80-130</option>
              <option>>130</option>
            </select>

            <select v-model="selectedFlavor" class="bg-gray-900 border border-gray-700 px-4 py-2 rounded">
              <option value="">Ízvilág</option>
              <option>Gyümölcsös</option>
              <option>Fűszeres</option>
              <option>Virágos</option>
              <option>Földes</option>
              <option>Egyéb</option>
            </select>
          </div>
          <div v-if="results.length" class="bg-gray-800 text-white rounded max-h-64 overflow-auto mb-4">
            <ul>
              <li
                v-for="(wine, index) in results"
                :key="index"
                class="px-4 py-2 border-b border-gray-700 last:border-b-0 hover:bg-gray-700 cursor-pointer"
              >
                <button class="w-full text-left" @click="showDetails(wine)">{{ wine.name }}</button>
              </li>
            </ul>
          </div>

          <p
            v-else-if="hasSearched && hasAnyFilter&& results.length === 0"
            class="text-sm text-gray-400 mb-4"
          >
            Nincs találat.
          </p>

          <button @click="searchWines" class="bg-red-900 hover:bg-red-800 px-6 py-2 rounded mr-4">Keresés</button>
          <button class="bg-red-900 hover:bg-red-800 px-6 py-2 rounded">Fotó alapján keresek</button>
        </div>
        <div v-else class="text-left bg-gray-800 text-yellow-100 p-6 rounded">
          <h2 class="text-2xl font-semibold mb-2">{{ selectedWine.name }}</h2>
          <p><strong>Szőlőfajta:</strong> {{ selectedWine.type }}</p>
          <p><strong>Stílus:</strong> {{ selectedWine.style }}</p>
          <p><strong>Ár:</strong> {{ selectedWine.price }}</p>
          <p><strong>Ízvilág:</strong> {{ selectedWine.flavor }}</p>
          <button @click="selectedWine = null" class="bg-red-900 hover:bg-red-800 px-6 py-2 rounded mr-4">
            Vissza a találatokhoz
          </button>
        </div>
      </div>
    </div>

    <div class="w-1/2 flex justify-end">
      <img :src="WineBottle" alt="Wine Bottle" class="max-w-md w-full h-auto" />
    </div>
  </div>
</template>

<script setup>
import WineBottle from "/home/adrienn/www/my-wine-mate/src/assets/images/WineBottle.png";
import NavBar from "../components/NavBar.vue";
import { ref } from "vue";
import { computed } from "vue";

const query = ref();
const selectedType = ref();
const selectedStyle = ref();
const selectedPrice = ref();
const selectedFlavor = ref();
const results = ref([]);
const selectedWine = ref(null);
const hasSearched = ref(false);

const wines = [
  {
    name: "Cabernet Sauvignon",
    type: "Vörös",
    style: "Száraz",
    price: "80-130",
    flavor: "Fűszeres",
  },
  {
    name: "Chardonnay",
    type: "Fehér",
    style: "Félszáraz",
    price: "50-80",
    flavor: "Gyümölcsös",
  },
  {
    name: "Tokaji Aszú",
    type: "Fehér",
    style: "Édes",
    price: ">130",
    flavor: "Egyéb",
  },
  {
    name: "Kékfrankos Rosé",
    type: "Rozé",
    style: "Száraz",
    price: "20-50",
    flavor: "Virágos",
  },
  {
    name: "Merlot",
    type: "Vörös",
    style: "Félédes",
    price: "50-80",
    flavor: "Földes",
  },
];

const hasAnyFilter = computed(() => {
  return (
    query.value !== "" ||
    selectedType.value !== "" ||
    selectedStyle.value !== "" ||
    selectedPrice.value !== "" ||
    selectedFlavor.value !== ""
  );
});
function searchWines() {
  hasSearched.value = true;

  if (!hasAnyFilter.value) {
    results.value = [];
    return;
  }

  results.value = wines.filter((wine) => {
    const matchesName = query.value ? wine.name.toLowerCase().includes(query.value.toLowerCase()) : true;
    const matchesType = selectedType.value ? wine.type === selectedType.value : true;
    const matchesStyle = selectedStyle.value ? wine.style === selectedStyle.value : true;
    const matchesPrice = selectedPrice.value ? wine.price === selectedPrice.value : true;
    const matchesFlavor = selectedFlavor.value ? wine.flavor === selectedFlavor.value : true;

    return matchesName && matchesType && matchesStyle && matchesPrice && matchesFlavor;
  });
}
function showDetails(wine) {
  selectedWine.value = wine;
}
</script>
