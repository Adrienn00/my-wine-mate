<template>
  <div v-if="!authStore.user" class="page-shell text-center text-[var(--text-main)]">Loading...</div>

  <PageFrame v-else>
    <div class="page-actions">
      <BaseButton to="/" variant="secondary">Back</BaseButton>
    </div>

    <SectionHeader class="px-1" kicker="Account" title="Profile" />

    <BaseCard rounded="rounded-2xl" padding="p-8">
      <div v-if="!isEditing">
        <div class="mb-8 flex flex-col items-center">
          <img
            :src="authStore.user.img || avatar"
            alt="Profile picture"
            class="mb-5 h-32 w-32 rounded-full border-4 border-[var(--wine-soft)]"
          />
          <h3 class="text-2xl font-bold">
            {{ authStore.user.firstName }} {{ authStore.user.lastName }}
          </h3>
        </div>

        <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
          <p><strong>First name:</strong> {{ authStore.user.firstName }}</p>
          <p><strong>Last name:</strong> {{ authStore.user.lastName }}</p>
          <p><strong>Email:</strong> {{ authStore.user.email }}</p>
          <p><strong>Phone number:</strong> {{ authStore.user.phoneNumber }}</p>
          <p><strong>Location:</strong> {{ authStore.user.location }}</p>
          <p><strong>Postal code:</strong> {{ authStore.user.postalCode }}</p>
        </div>

        <div class="mt-8 text-center">
          <BaseButton variant="secondary" @click="isEditing = true">Edit</BaseButton>
        </div>
      </div>

      <div v-else>
        <div class="mb-8 flex flex-col items-center">
          <img
            :src="authStore.user.img || avatar"
            alt="Profile picture"
            class="mb-5 h-32 w-32 cursor-pointer rounded-full border-4 border-[var(--wine-soft)]"
            @click="triggerFileInput"
          />
          <input ref="fileInput" type="file" accept="image/*" class="hidden" @change="handleImageUpload" />
        </div>

        <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
          <BaseInput label="First name" v-model="authStore.user.firstName" />
          <BaseInput label="Last name" v-model="authStore.user.lastName" />
          <BaseInput label="Email" type="email" v-model="authStore.user.email" />
          <BaseInput label="Phone number" v-model="authStore.user.phoneNumber" />
          <BaseInput label="Location" v-model="authStore.user.location" />
          <BaseInput label="Postal code" v-model="authStore.user.postalCode" />
        </div>

        <div class="mt-8 space-x-4 text-center">
          <BaseButton variant="secondary" @click="saveChanges">Save</BaseButton>
          <BaseButton variant="secondary" @click="isEditing = false">Cancel</BaseButton>
        </div>
      </div>
    </BaseCard>

    <BaseCard
      v-if="profileStore.notifications?.length"
      rounded="rounded-2xl"
      padding="p-6"
      class="border border-[var(--line)]"
    >
      <h2 class="mb-4 text-xl font-bold">Notifications</h2>
      <div
        v-for="n in profileStore.notifications"
        :key="n._id"
        class="mb-3 flex items-center gap-2 rounded-lg border border-[var(--line)] bg-[var(--surface)] p-3"
      >
        <span v-if="n.type === 'approved'" class="text-green-600">✔</span>
        <span v-if="n.type === 'rejected'" class="text-[var(--danger)]">✖</span>
        <span>{{ n.message }}</span>
      </div>
      <div v-if="!profileStore.notifications.length">No notifications yet.</div>
    </BaseCard>
  </PageFrame>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '../stores/authStore'
import { useProfileStore } from '../stores/profileStore'
import BaseButton from '../components/ui/BaseButton.vue'
import BaseCard from '../components/ui/BaseCard.vue'
import BaseInput from '../components/ui/BaseInput.vue'
import PageFrame from '../components/ui/PageFrame.vue'
import SectionHeader from '../components/ui/SectionHeader.vue'
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
  reader.onload = (e) => { authStore.user.img = e.target.result }
  reader.readAsDataURL(file)
}
</script>
