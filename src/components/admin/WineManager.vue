<template>
  <div
    class="rounded-xl border border-[var(--line)] bg-[rgba(255,248,239,0.82)] p-8 text-[var(--text-main)] shadow-sm"
  >
    <div class="mb-6 flex items-center justify-between">
      <h2 class="text-2xl font-semibold">Borok kezelése</h2>
      <BaseButton v-if="!isEditing" variant="secondary" @click="startAdd"
        >Új bor hozzáadása</BaseButton
      >
    </div>

    <WineForm
      v-if="isEditing"
      :initialData="editWineData"
      @save="handleSave"
      @cancel="cancelEdit"
    />

    <WineTable v-else :wines="allWines" @edit="startEdit" @delete="handleDelete" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useWinesStore } from '@/stores/winesStore'
import WineForm from './WineForm.vue'
import WineTable from './WineTable.vue'
import BaseButton from '../ui/BaseButton.vue'

const winesStore = useWinesStore()
const allWines = computed(() => winesStore.wines)

const isEditing = ref(false)
const editWineData = ref(null)

const emptyWine = () => ({
  name: '',
  winery: '',
  description: '',
  type: '',
  style: '',
  flavorProfiles: [],
  origin: { country: '', region: '' },
  grapeVarieties: [],
  year: null,
  alcohol: null,
  priceRange: '',
  foodPairingHints: [],
  aiFoodPairingEnabled: false,
  purchaseOptions: [],
  imageUrl: '',
  is_award_winner: false,
  is_confirmed: true,
  tags: [],
  ratings: [],
})

onMounted(() => {
  winesStore.getAllWines()
})

function startAdd() {
  editWineData.value = emptyWine()
  isEditing.value = true
}

function startEdit(wine) {
  editWineData.value = wine
  isEditing.value = true
}

function cancelEdit() {
  isEditing.value = false
  editWineData.value = null
}

async function handleSave(wineData) {
  if (wineData._id) {
    await winesStore.updateWine(wineData)
  } else {
    await winesStore.addNewWine(wineData)
  }
  cancelEdit()
}

async function handleDelete(id) {
  if (confirm('Biztosan törlöd ezt a bort?')) {
    await winesStore.deleteWine(id)
  }
}
</script>
