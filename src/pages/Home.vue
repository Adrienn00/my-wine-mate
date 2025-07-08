<template>
  <NavBar />
  <div class="flex items-center justify-between max-w-6xl mx-auto px-4 py-12">
    <div class="flex flex-col gap-y-5">
      <section class="text-center px-6 py-16">
        <h1 class="text-3xl md:text-5xl font-light mb-6 leading-snug text-yellow-100">Találd meg a hozzád illő bort</h1>
        <div class="flex flex-wrap justify-center gap-4 my-6">
          <select class="bg-gray-900 border border-gray-700 px-4 py-2 rounded">
            <option>Szőlőfajta</option>
          </select>
          <select class="bg-gray-900 border border-gray-700 px-4 py-2 rounded">
            <option>Régió</option>
          </select>
          <select class="bg-gray-900 border border-gray-700 px-4 py-2 rounded">
            <option>Stílus</option>
          </select>
          <select class="bg-gray-900 border border-gray-700 px-4 py-2 rounded">
            <option>Ár</option>
          </select>
          <button class="bg-red-900 hover:bg-red-800 px-6 py-2 rounded">Fotó alapján keresek</button>
        </div>
      </section>
    </div>
    <div class="w-1/2 flex justify-end">
      <img :src="WineBottle" alt="Wine Bottle" class="max-w-md w-full h-auto" />
    </div>
  </div>
</template>

<script>
import WineBottle from "/home/adrienn/www/my-wine-mate/src/assets/images/WineBottle.png";
import NavBar from "../components/NavBar.vue";
export default {
  name: "Home",
  components: {
    NavBar,
  },
  data() {
    return {
      WineBottle,
    };
  },
};
</script>
