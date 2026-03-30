<template>
  <!-- BETÖLTÉS -->
  <div v-if="!authStore.user" class="mt-10 text-center text-[var(--text-main)]">Betöltés...</div>

  <!-- PROFIL -->
  <div
    v-else
    class="glass-panel mx-auto max-w-4xl rounded-2xl border border-[var(--line)] p-8 text-[var(--text-main)]"
  >
    <div class="mb-4">
      <BaseButton to="/" variant="secondary">Vissza</BaseButton>
    </div>

    <!-- NÉZET MÓD -->
    <div v-if="!isEditing">
      <div class="flex flex-col items-center mb-8">
        <img
          :src="authStore.user.img || avatar"
          alt="Profilkép"
          class="mb-5 h-32 w-32 rounded-full border-4 border-[var(--wine-soft)]"
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
        <BaseButton variant="secondary" @click="startEdit"> Szerkesztés </BaseButton>
      </div>
    </div>

    <!-- SZERKESZTÉS MÓD -->
    <div v-else>
      <div class="flex flex-col items-center mb-8">
        <img
          :src="editForm.img || authStore.user.img || avatar"
          alt="Profilkép"
          class="mb-5 h-32 w-32 cursor-pointer rounded-full border-4 border-[var(--wine-soft)]"
          @click="triggerFileInput"
        />
        <input
          ref="fileInput"
          type="file"
          accept="image/*"
          class="hidden"
          @change="handleImageUpload"
        />
        <p v-if="uploadError" class="mt-2 text-sm text-[var(--danger)]">{{ uploadError }}</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <BaseInput v-model="editForm.firstName" label="Keresztnév" />
        <BaseInput v-model="editForm.lastName" label="Vezetéknév" />
        <BaseInput v-model="editForm.email" type="email" label="Email" />
        <BaseInput v-model="editForm.phoneNumber" label="Telefonszám" />
        <BaseInput v-model="editForm.location" label="Lokáció" />
        <BaseInput v-model="editForm.postalCode" label="Irányítószám" />
      </div>

      <div class="mt-8 space-x-4 text-center">
        <BaseButton variant="secondary" @click="saveChanges"> Mentés </BaseButton>
        <BaseButton variant="secondary" @click="isEditing = false"> Mégse </BaseButton>
      </div>
    </div>
  </div>

  <!-- NOTIFICATIONS -->
  <div
    v-if="profileStore.profile?.notifications"
    class="glass-panel mx-auto mt-8 max-w-4xl rounded-2xl border border-[var(--line)] p-6 text-[var(--text-main)]"
  >
    <h2 class="text-xl font-bold mb-4">Értesítések</h2>

    <div
      v-for="n in profileStore.profile.notifications"
      :key="n._id"
      class="mb-3 flex items-center gap-2 rounded-lg border border-[var(--line)] bg-[rgba(255,251,246,0.88)] p-3"
    >
      <span v-if="n.type === 'approved'" class="text-green-600">✔</span>
      <span v-if="n.type === 'rejected'" class="text-[var(--danger)]">✖</span>

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
const uploadError = ref('')
const editForm = ref({
  firstName: '',
  lastName: '',
  email: '',
  phoneNumber: '',
  location: '',
  postalCode: '',
  img: '',
})

onMounted(() => {
  profileStore.fetchProfile()
})

function mapUserToEditForm(user = {}) {
  return {
    firstName: user.firstName || '',
    lastName: user.lastName || '',
    email: user.email || '',
    phoneNumber: user.phoneNumber || '',
    location: user.location || '',
    postalCode: user.postalCode || '',
    img: user.img || '',
  }
}

function startEdit() {
  uploadError.value = ''
  editForm.value = mapUserToEditForm(authStore.user)
  isEditing.value = true
}

async function saveChanges() {
  const payload = mapUserToEditForm(editForm.value)
  const updated = await profileStore.updateProfile(payload)
  if (!updated) {
    alert('Nem sikerült menteni a profil módosításait.')
    return
  }
  isEditing.value = false
}

function triggerFileInput() {
  fileInput.value.click()
}

function handleImageUpload(event) {
  uploadError.value = ''
  const file = event.target.files[0]
  if (!file) return
  if (!file.type.startsWith('image/')) {
    uploadError.value = 'Csak képfájl tölthető fel.'
    return
  }
  if (file.size > 2 * 1024 * 1024) {
    uploadError.value = 'A kép mérete maximum 2 MB lehet.'
    return
  }

  const reader = new FileReader()
  reader.onload = (e) => {
    editForm.value.img = e.target.result
  }
  reader.readAsDataURL(file)
}
</script>
