<template>
  <div class="min-h-screen">
    <NavBar />
    <div
      class="max-w-6xl mx-auto px-6 py-16 text-yellow-100 flex flex-col lg:flex-row items-center gap-12"
    >
      <div class="lg:w-1/2">
        <h1 class="text-4xl font-light mb-6">Rólunk</h1>
        <p class="mb-4">
          A <strong>My Wine Mate</strong> egy államvizsga projekt, amit egyedül készítettem. Az
          ötlet a vendéglátásban szerzett tapasztalataimból született: láttam, hogy sokan
          bizonytalanok, amikor bort kell választani – legyen az étkezéshez, ajándékba vagy egy esti
          beszélgetéshez.
        </p>
        <p class="mb-4">
          Ezt felismerve döntöttem úgy, hogy egy olyan webes alkalmazást hozok létre, ami segít
          eligazodni a borok világában – egyszerű, gyors és felhasználóbarát módon.
        </p>
        <p class="mb-4">
          A célom, hogy megkönnyítsem a döntést mindazok számára, akik szeretnének jobban eligazodni
          a borok között, de nem rendelkeznek mélyebb szakmai ismeretekkel.
        </p>
        <p class="mb-4">
          A My Wine Mate nem csupán egy kereső – hanem egy társ a választásban. A jövőben fotóalapú
          keresés, adatbázis és bővített borleírások is elérhetőek lesznek.
        </p>
        <p class="mt-6 italic text-sm text-gray-400">Köszönöm, hogy ellátogattál!</p>
      </div>
      <div class="lg:w-1/2">
        <img
          :src="aboutimage"
          alt="Borospalack"
          class="w-full max-w-md mx-auto rounded shadow-lg"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import NavBar from '../components/NavBar.vue'
import aboutimage from '/home/adrienn/www/my-wine-mate/src/assets/images/aboutimage.jpeg'
</script>
