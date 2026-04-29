<template>
  <div
    class="glass-panel mx-auto max-w-4xl rounded-2xl border border-[var(--line)] p-8 text-[var(--text-main)]"
  >
    <h2 class="mb-8 text-center text-3xl font-semibold">Wines Awaiting Approval</h2>

    <div v-if="pendingWines.length === 0" class="text-center text-[var(--text-muted)]">
      There are no wines awaiting approval.
    </div>

    <ul class="space-y-6">
      <li
        v-for="wine in pendingWines"
        :key="wine._id"
        class="rounded-xl border border-[var(--line)] bg-[rgba(255,251,246,0.9)] p-6 shadow-sm"
      >
        <div v-if="editId === wine._id" class="space-y-4">
          <BaseInput id="name" label="Wine name" v-model="editWine.name" placeholder="Wine name" />
          <BaseInput id="type" label="Type" v-model="editWine.type" placeholder="Type" />
          <BaseInput id="style" label="Style" v-model="editWine.style" placeholder="Style" />
          <BaseInput id="price" label="Price" v-model="editWine.price" placeholder="Price" />

          <BaseInput
            id="flavorProfiles"
            label="Flavor profile (comma separated)"
            v-model="editFlavorProfilesText"
            placeholder="Flavor profile"
          />

          <BaseInput
            id="grapeVarieties"
            label="Grape varieties (comma separated)"
            v-model="editGrapeVarietiesText"
            placeholder="Grape varieties"
          />

          <BaseInput
            id="tags"
            label="Tags (comma separated)"
            v-model="editTagsText"
            placeholder="Tags"
          />

          <div class="flex space-x-4">
            <BaseButton variant="secondary" @click="saveEdit(wine._id)">Save</BaseButton>
            <BaseButton variant="secondary" @click="cancelEdit">Cancel</BaseButton>
          </div>
        </div>

        <div v-else class="flex justify-between items-start">
          <div>
            <h3 class="text-xl font-bold mb-2">{{ wine.name }}</h3>
            <p><strong>Type:</strong> {{ wine.type }}</p>
            <p><strong>Style:</strong> {{ wine.style }}</p>
            <p><strong>Price:</strong> {{ wine.price }}</p>
            <p><strong>Flavor profile:</strong> {{ wine.flavorProfiles?.join(', ') || '' }}</p>
            <p><strong>Grape varieties:</strong> {{ wine.grapeVarieties?.join(', ') || '' }}</p>
            <p><strong>Tags:</strong> {{ wine.tags?.join(', ') || '' }}</p>
          </div>

          <div class="flex flex-col space-y-3">
            <BaseButton variant="secondary" @click="startEdit(wine)">Edit</BaseButton>
            <BaseButton variant="secondary" @click="approveWine(wine._id)">Approve</BaseButton>
            <BaseButton variant="secondary" @click="rejectWine(wine._id)">Reject</BaseButton>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useWinesStore } from '../../stores/winesStore'
import BaseInput from '../ui/BaseInput.vue'
import BaseButton from '../ui/BaseButton.vue'
onMounted(() => {
  winesStore.getAllWines()
})

const winesStore = useWinesStore()
const pendingWines = computed(() => winesStore.pendingWines)

const editId = ref(null)
const editWine = ref({
  name: '',
  type: '',
  style: '',
  price: '',
  flavorProfiles: [],
  grapeVarieties: [],
  tags: [],
})

const editFlavorProfilesText = ref('')
const editGrapeVarietiesText = ref('')
const editTagsText = ref('')

function startEdit(wine) {
  editId.value = wine._id
  Object.assign(editWine.value, wine)

  editFlavorProfilesText.value = (wine.flavorProfiles || []).join(', ')
  editGrapeVarietiesText.value = (wine.grapeVarieties || []).join(', ')
  editTagsText.value = (wine.tags || []).join(', ')
}

function saveEdit(id) {
  const wine = winesStore.wines.find((w) => w._id === id)
  if (!wine) return

  wine.name = editWine.value.name
  wine.type = editWine.value.type
  wine.style = editWine.value.style
  wine.price = editWine.value.price

  wine.flavorProfiles = editFlavorProfilesText.value
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)

  wine.grapeVarieties = editGrapeVarietiesText.value
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)

  wine.tags = editTagsText.value
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)

  editId.value = null
}

function cancelEdit() {
  editId.value = null
}

async function approveWine(id) {
  await winesStore.approveWine(id)
}

async function rejectWine(id) {
  await winesStore.deleteWine(id)
}
</script>
