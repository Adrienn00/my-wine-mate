<template>
  <div class="flex min-h-[80vh] w-full items-center justify-center px-4 py-10">
    <div class="w-full max-w-md text-center">
      <template v-if="status === 'loading'">
        <p class="text-4xl">⏳</p>
        <p class="mt-4 text-[var(--text-muted)]">Verifying your email…</p>
      </template>

      <template v-else-if="status === 'success'">
        <p class="text-5xl">✅</p>
        <h1 class="mt-4 text-2xl font-semibold text-[var(--text-main)]">Email verified!</h1>
        <p class="mt-2 text-sm text-[var(--text-muted)]">Your account is active. You can now log in.</p>
        <BaseButton to="/login" variant="primary" class="mt-6">Go to Login</BaseButton>
      </template>

      <template v-else>
        <p class="text-5xl">❌</p>
        <h1 class="mt-4 text-2xl font-semibold text-[var(--text-main)]">Verification failed</h1>
        <p class="mt-2 text-sm text-[var(--text-muted)]">{{ errorMessage }}</p>
        <BaseButton to="/signup" variant="secondary" class="mt-6">Back to Sign Up</BaseButton>
      </template>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import client from '../components/httpService/client'
import BaseButton from '../components/ui/BaseButton.vue'

const route = useRoute()
const status = ref('loading')
const errorMessage = ref('')

onMounted(async () => {
  try {
    await client.get(`users/verify/${route.params.token}`)
    status.value = 'success'
  } catch (err) {
    status.value = 'error'
    errorMessage.value = err.message || 'The link is invalid or has expired.'
  }
})
</script>
