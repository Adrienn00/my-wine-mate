<template>
  <div class="p-8 bg-gray-900 rounded-xl shadow text-white">
    <h2 class="text-2xl font-semibold mb-6">Borok kezelése</h2>

    <BaseButton variant="secondary" @click="startAdd">Új bor hozzáadása</BaseButton>

    <div v-if="isEditing" class="bg-gray-800 p-4 rounded mb-6 mt-4">
      <h3 class="text-xl mb-2">{{ editWine.id ? 'Bor szerkesztése' : 'Új bor hozzáadása' }}</h3>

      <BaseInput v-model="editWine.name" label="Név" />
      <BaseInput v-model="editWine.type" label="Típus" />
      <BaseInput v-model="editWine.style" label="Stílus" />
      <BaseInput v-model="editWine.price" label="Ár" />
      <BaseInput v-model="editWine.flavor" label="Ízjegyek" />

      <div class="flex gap-2 mt-4">
        <BaseButton variant="secondary" @click="submitEdit">Mentés</BaseButton>
        <BaseButton variant="secondary" @click="cancelEdit">Mégse</BaseButton>
      </div>
    </div>

    <table class="w-full table-auto border-collapse text-left">
      <thead>
        <tr class="border-b border-gray-600 text-yellow-100">
          <th class="pb-2">Név</th>
          <th>Típus</th>
          <th>Stílus</th>
          <th>Ár</th>
          <th>Íz</th>
          <th>Műveletek</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="wine in allWines" :key="wine.id" class="border-b border-gray-700">
          <td class="py-2">{{ wine.name }}</td>
          <td>{{ wine.type }}</td>
          <td>{{ wine.style }}</td>
          <td>{{ wine.price }}</td>
          <td>{{ wine.flavor }}</td>
          <td class="space-x-2">
            <BaseButton variant="secondary" @click="startEdit(wine)">Szerkesztés</BaseButton>
            <BaseButton variant="secondary" @click="deleteWine(wine.id)">Törlés</BaseButton>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useWinesStore } from '@/stores/winesStore'
import BaseInput from '../ui/BaseInput.vue'
import BaseButton from '../ui/BaseButton.vue'

const winesStore = useWinesStore()

const isEditing = ref(false)

const editWine = ref({
  name: '',
  type: '',
  style: '',
  price: '',
  flavor: '',
})

const allWines = computed(() => winesStore.wines)

function startAdd() {
  isEditing.value = true
  editWine.value = {
    name: '',
    type: '',
    style: '',
    price: '',
    flavor: '',
  }
}

function startEdit(wine) {
  isEditing.value = true
  editWine.value = { ...wine }
}

function cancelEdit() {
  isEditing.value = false
}

function submitEdit() {
  const { name, type, style, price, flavor } = editWine.value

  if (
    !name?.toString().trim() ||
    !type?.toString().trim() ||
    !style?.toString().trim() ||
    !price?.toString().trim() ||
    !flavor?.toString().trim()
  ) {
    alert('Kérlek, tölts ki minden mezőt!')
    return
  }

  if (editWine.value.id != null) {
    winesStore.updateWine(editWine.value)
  } else {
    winesStore.addNewWine({ ...editWine.value, is_confirmed: true })
  }

  isEditing.value = false
}

function deleteWine(id) {
  if (confirm('Biztosan törlöd ezt a bort?')) {
    winesStore.deleteWine(id)
  }
}
</script>
