<template>
  <div class="flex min-h-[80vh] w-full items-center justify-center px-4 py-10">
    <div class="w-full max-w-md">
      <div class="mb-8 text-center">
        <p class="font-['Cormorant_Garamond'] text-3xl font-semibold text-[var(--wine)]">Vinology Cook</p>
        <p class="mt-1 text-sm text-[var(--text-muted)]">Sign in to your account</p>
      </div>

      <form
        @submit.prevent="loginUser"
        class="dashboard-panel rounded-2xl px-6 py-8 md:px-8"
      >
        <h1 class="mb-6 text-2xl font-semibold">Log In</h1>

        <BaseInput id="email" label="E-mail" type="email" v-model="email" :error="emailError" />
        <BaseInput
          id="password"
          label="Password"
          type="password"
          v-model="password"
          :error="passwordError"
        />

        <div class="mb-4 w-full text-right text-sm">
          <BaseButton to="/forgotPassword" variant="simple">Forgot your password?</BaseButton>
        </div>

        <BaseButton variant="primary" type="submit" class="w-full">Log In</BaseButton>

        <div class="mt-4 text-center text-sm text-[var(--text-muted)]">
          Don't have an account?
          <BaseButton to="/signup" variant="simple" class="ml-1">Sign Up</BaseButton>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import BaseButton from '../components/ui/BaseButton.vue'
import BaseInput from '../components/ui/BaseInput.vue'

const email = ref('')
const password = ref('')
const emailError = ref('')
const passwordError = ref('')
const router = useRouter()
const auth = useAuthStore()

async function loginUser() {
  emailError.value = !email.value ? 'Please enter your email.' : ''
  passwordError.value = !password.value ? 'Please enter your password.' : ''
  if (emailError.value || passwordError.value) return

  try {
    await auth.login({ email: email.value, password: password.value })
    router.push('/')
  } catch (err) {
    console.error('Login failed:', err.message)
    passwordError.value = 'Incorrect email or password.'
  }
}
</script>
