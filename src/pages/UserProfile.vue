<template>
  <div class="max-w-4xl mx-auto bg-gray-900 rounded-lg shadow-lg p-8 border-2 text-yellow-100">
    <div class="flex flex-col items-center mb-8">
      <img
        :src="user.img"
        alt="Profilkép"
        class="w-32 h-32 rounded-full border-4 border-rose-500 mb-5 cursor-pointer hover:opacity-80 transition"
        @click="triggerFileInput"
      />
      <input
        type="file"
        ref="fileInput"
        accept="image/*"
        @change="handleImageUpload"
        class="hidden"
      />
      <h3 class="text-2xl font-bold">{{ user.firstName }} {{ user.lastName }}</h3>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <BaseInput id="firstName" label="Keresztnév" type="text" v-model="user.firstName" />

      <BaseInput id="lastName" label="Vezetéknév" type="text" v-model="user.lastName" />

      <BaseInput id="email" label="Email cím" type="email" v-model="user.email" />

      <BaseInput id="phoneNumber" label="Telefonszám" type="text" v-model="user.phone" />

      <BaseInput id="location" label="Lokáció" type="text" v-model="user.location" />

      <BaseInput id="postalCode" label="Irányítószám" type="text" v-model="user.postalCode" />
    </div>
    <div class="mt-8 text-center">
      <BaseButton variant="secondary" @click="saveChanges"> Mentés </BaseButton>
      <p v-if="saved" class="mt-4 text-green-400 font-medium">Mentve!</p>
    </div>
  </div>
</template>

<script setup>
import { ref, useTemplateRef } from 'vue'
import BaseInput from '../components/ui/BaseInput.vue'
import BaseButton from '../components/ui/BaseButton.vue'
import avatar from '../assets/images/avatar.png'

const user = ref({
  firstName: 'Keresztnév',
  lastName: 'Vezetéknév',
  email: 'borimado@example.com',
  phone: '071234567',
  location: 'Székelyudvarhely',
  postalCode: '535600',
  img: avatar,
})

const saved = ref(false)
const inputRef = useTemplateRef('fileInput')

const userList = ref([])

function saveChanges() {
  saved.value = 'true'
  userList.value.push({ ...user.value })
  console.log('Felhasználók tömbje:', userList.value)
}
function triggerFileInput() {
  inputRef.value.click()
}
function handleImageUpload(event) {
  const file = event.target.files[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      user.value.img = e.target.result
    }
    reader.readAsDataURL(file)
  }
}
</script>
