<template>
  <div class="max-w-4xl mx-auto bg-gray-900 rounded-lg shadow-lg p-8 border-2 text-yellow-100">
    <h2 class="text-3xl font-semibold mb-8 text-center">Jóváhagyásra váró borok</h2>

    <div v-if="pendingWines.length === 0" class="text-gray-400 text-center">
      Nincs jóváhagyásra váró bor.
    </div>

    <ul class="space-y-6">
      <li
        v-for="wine in pendingWines"
        :key="wine.id"
        class="bg-gray-800 p-6 rounded-lg shadow-md border"
      >
        <div v-if="editId === wine.id" class="space-y-4">
          <BaseInput id="name" label="Bor neve" v-model="editWine.name" placeholder="Bor neve" />
          <BaseInput id="type" label="Típus" v-model="editWine.type" placeholder="Típus" />
          <BaseInput id="style" label="Stílus" v-model="editWine.style" placeholder="Stílus" />
          <BaseInput id="price" label="Ár" v-model="editWine.price" placeholder="Ár" />
          <BaseInput id="flavor" label="Ízvilág" v-model="editWine.flavor" placeholder="Ízvilág" />

          <div class="flex space-x-4">
            <BaseButton variant="secondary" @click="saveEdit(wine.id)"> Mentés </BaseButton>
            <BaseButton variant="secondary" @click="cancelEdit"> Mégse </BaseButton>
          </div>
        </div>

        <div v-else class="flex justify-between items-start">
          <div>
            <h3 class="text-xl font-bold mb-2">{{ wine.name }}</h3>
            <p><strong>Típus:</strong> {{ wine.type }}</p>
            <p><strong>Stílus:</strong> {{ wine.style }}</p>
            <p><strong>Ár:</strong> {{ wine.price }}</p>
            <p><strong>Ízvilág:</strong> {{ wine.flavor }}</p>
          </div>

          <div class="flex flex-col space-y-3">
            <BaseButton variant="secondary" @click="startEdit(wine)"> Szerkesztés </BaseButton>
            <BaseButton variant="secondary" @click="approveWine(wine.id)"> Jóváhagyás </BaseButton>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useWinesStore } from '../../stores/winesStore'
import BaseInput from '../ui/BaseInput.vue'
import BaseButton from '../ui/BaseButton.vue'
const winesStore = useWinesStore()
const pendingWines = computed(() => winesStore.pendingWines)

const editId = ref(null)
const editWine = ref({
  name: '',
  type: '',
  style: '',
  price: '',
  flavor: '',
})

function approveWine(id) {
  winesStore.approveWine(id)
}

function startEdit(wine) {
  editId.value = wine.id
  Object.assign(editWine.value, wine)
}

function saveEdit(id) {
  const wine = winesStore.wines.find((w) => w.id === id)
  if (wine) {
    wine.name = editWine.value.name
    wine.type = editWine.value.type
    wine.style = editWine.value.style
    wine.price = editWine.value.price
    wine.flavor = editWine.value.flavor
  }
  editId.value = null
}

function cancelEdit() {
  editId.value = null
}
</script>
