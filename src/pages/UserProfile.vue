<template>
  <div class="max-w-4xl mx-auto bg-gray-900 rounded-lg shadow-lg p-8 border-2 text-yellow-100">
    <div v-if="!isEditing">
      <div class="flex flex-col items-center mb-8">
        <img
          :src="user.img"
          alt="Profilkép"
          class="w-32 h-32 rounded-full border-4 border-rose-500 mb-5"
        />
        <h3 class="text-2xl font-bold">{{ user.firstName }} {{ user.lastName }}</h3>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <p><strong>Keresztnév:</strong> {{ user.firstName }}</p>
        <p><strong>Vezetéknév:</strong> {{ user.lastName }}</p>
        <p><strong>Email cím:</strong> {{ user.email }}</p>
        <p><strong>Telefonszám:</strong> {{ user.phone }}</p>
        <p><strong>Lokáció:</strong> {{ user.location }}</p>
        <p><strong>Irányítószám:</strong> {{ user.postalCode }}</p>
      </div>

      <div class="mt-8 text-center">
        <BaseButton variant="secondary" @click="isEditing = true">Szerkesztés</BaseButton>
      </div>
    </div>

    <div v-else>
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
        <BaseButton variant="secondary" @click="saveChanges">Mentés</BaseButton>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, useTemplateRef } from 'vue'
import { useProfileStore } from '../stores/profileStore'
import BaseInput from '../components/ui/BaseInput.vue'
import BaseButton from '../components/ui/BaseButton.vue'
import avatar from '../assets/images/avatar.png'

const profileStore = useProfileStore()

if (!profileStore.user.img) {
  profileStore.user.img = avatar
}

const user = ref({ ...profileStore.user })

const isEditing = ref(false)
const inputRef = useTemplateRef('fileInput')

function saveChanges() {
  profileStore.setUser(user.value)
  isEditing.value = false
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
