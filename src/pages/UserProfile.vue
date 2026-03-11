<template>
  <!-- BETÖLTÉS -->
  <div v-if="!authStore.user" class="text-center text-yellow-100 mt-10">Betöltés...</div>

  <!-- PROFIL -->
  <div
    v-else
    class="max-w-4xl mx-auto bg-gray-900 rounded-lg shadow-lg p-8 border-2 text-yellow-100"
  >
    <!-- NÉZET MÓD -->
    <div v-if="!isEditing">
      <div class="flex flex-col items-center mb-8">
        <img
          :src="authStore.user.img || avatar"
          alt="Profilkép"
          class="w-32 h-32 rounded-full border-4 border-rose-500 mb-5"
        />
        <h3 class="text-2xl font-bold">
          {{ authStore.user.firstName }} {{ authStore.user.lastName }}
        </h3>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <p><strong>Keresztnév:</strong> {{ authStore.user.firstName }}</p>
        <p><strong>Vezetéknév:</strong> {{ authStore.user.lastName }}</p>
        <p><strong>Email cím:</strong> {{ authStore.user.email }}</p>
        <p><strong>Telefonszám:</strong> {{ authStore.user.phoneNumber }}</p>
        <p><strong>Lokáció:</strong> {{ authStore.user.location }}</p>
        <p><strong>Irányítószám:</strong> {{ authStore.user.postalCode }}</p>
      </div>

      <div class="mt-8 text-center">
        <BaseButton variant="secondary" @click="isEditing = true"> Szerkesztés </BaseButton>
      </div>
    </div>

    <!-- SZERKESZTÉS MÓD -->
    <div v-else>
      <div class="flex flex-col items-center mb-8">
        <img
          :src="authStore.user.img || avatar"
          alt="Profilkép"
          class="w-32 h-32 rounded-full border-4 border-rose-500 mb-5 cursor-pointer"
          @click="triggerFileInput"
        />
        <input
          type="file"
          ref="fileInput"
          accept="image/*"
          @change="handleImageUpload"
          class="hidden"
        />
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <BaseInput label="Keresztnév" v-model="authStore.user.firstName" />
        <BaseInput label="Vezetéknév" v-model="authStore.user.lastName" />
        <BaseInput label="Email" type="email" v-model="authStore.user.email" />
        <BaseInput label="Telefonszám" v-model="authStore.user.phoneNumber" />
        <BaseInput label="Lokáció" v-model="authStore.user.location" />
        <BaseInput label="Irányítószám" v-model="authStore.user.postalCode" />
      </div>

      <div class="mt-8 text-center space-x-4">
        <BaseButton variant="secondary" @click="saveChanges"> Mentés </BaseButton>
        <BaseButton variant="danger" @click="isEditing = false"> Mégse </BaseButton>
      </div>
    </div>
  </div>

  <!-- NOTIFICATIONS -->
  <div
    v-if="profileStore.profile?.notifications"
    class="max-w-4xl mx-auto mt-8 bg-gray-900 rounded-lg shadow-lg p-6 border-2 text-yellow-100"
  >
    <h2 class="text-xl font-bold mb-4">Értesítések</h2>

    <div
      v-for="n in profileStore.profile.notifications"
      :key="n._id"
      class="bg-gray-800 p-3 rounded mb-3 flex items-center gap-2"
    >
      <span v-if="n.type === 'approved'" class="text-green-400">✔</span>
      <span v-if="n.type === 'rejected'" class="text-red-400">✖</span>

      <span>{{ n.message }}</span>
    </div>

    <div v-if="!profileStore.profile.notifications.length">Nincs még értesítés.</div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '../stores/authStore'
import { useProfileStore } from '../stores/profileStore'
import BaseInput from '../components/ui/BaseInput.vue'
import BaseButton from '../components/ui/BaseButton.vue'
import avatar from '../assets/images/avatar.png'

const authStore = useAuthStore()
const profileStore = useProfileStore()

const isEditing = ref(false)
const fileInput = ref(null)

onMounted(() => {
  profileStore.fetchProfile()
})

async function saveChanges() {
  await profileStore.updateProfile(authStore.user)
  isEditing.value = false
}

function triggerFileInput() {
  fileInput.value.click()
}

function handleImageUpload(event) {
  const file = event.target.files[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = (e) => {
    authStore.user.img = e.target.result
  }
  reader.readAsDataURL(file)
}
</script>
