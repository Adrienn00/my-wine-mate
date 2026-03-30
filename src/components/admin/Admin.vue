<template>
  <div
    class="mb-8 text-center text-4xl font-extrabold text-[var(--text-main)] underline underline-offset-8"
  >
    Funkciók
  </div>

  <div
    class="mx-auto flex max-w-md flex-col items-center gap-6 rounded-2xl border border-[var(--line)] bg-[rgba(255,248,239,0.82)] p-6"
  >
    <BaseButton variant="adminFunctions" to="/admin/pending">Jóváhagyás / Szerkesztés</BaseButton>
    <BaseButton variant="adminFunctions" to="/admin/manager">Adatbázis-kezelés</BaseButton>
    <BaseButton variant="adminFunctions" to="/admin/roles"> Jogosultságkezelés </BaseButton>
    <BaseButton variant="adminFunctions">OCR rendszer-kezelés</BaseButton>
    <BaseButton variant="adminFunctions">MI kezelés</BaseButton>
    <BaseButton variant="adminFunctions" to="/admin/stats">Rendszerstatisztika</BaseButton>
  </div>
</template>

<script setup>
import BaseButton from '@/components/ui/BaseButton.vue'
</script>
