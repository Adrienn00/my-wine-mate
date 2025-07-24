<template>
  <div
    class="text-center text-4xl mb-8 text-yellow-100 font-extrabold underline underline-offset-8"
  >
    Funkciók
  </div>

  <div class="flex flex-col items-center gap-6 max-w-md mx-auto">
    <BaseButton variant="adminFunctions" to="/admin/pending">Jóváhagyás / Szerkesztés</BaseButton>
    <BaseButton variant="adminFunctions">Adatbázis-kezelés</BaseButton>
    <BaseButton variant="adminFunctions">Jogosultságkezelés</BaseButton>
    <BaseButton variant="adminFunctions">OCR rendszer-kezelés</BaseButton>
    <BaseButton variant="adminFunctions">MI kezelés</BaseButton>
    <BaseButton variant="adminFunctions">Rendszerstatisztika</BaseButton>
  </div>
</template>

<script setup>
import BaseButton from '@/components/ui/BaseButton.vue'
</script>
