<template>
  <div class="flex min-h-screen w-full items-center justify-center px-4 py-10">
    <form
      @submit.prevent="loginUser"
      class="glass-panel w-full max-w-md rounded-2xl px-6 py-10 shadow-xl md:px-8"
    >
      <h1 class="mb-5 text-center text-3xl font-semibold">Log In</h1>

      <BaseInput id="email" label="E-mail" type="email" v-model="email" :error="emailError" />

      <BaseInput
        id="password"
        label="Password"
        type="password"
        v-model="password"
        :error="passwordError"
      />

      <div class="w-full text-right text-sm">
        <BaseButton to="/forgotPassword" variant="simple"> Forgot your password? </BaseButton>
      </div>

      <BaseButton variant="primary" type="submit" class="mt-2 w-full">Log In</BaseButton>

      <BaseButton to="/signup" variant="simple" class="mt-3 text-center text-sm">
        Sign Up
      </BaseButton>
    </form>
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
    await auth.login({
      email: email.value,
      password: password.value,
    })

    router.push('/')
  } catch (err) {
    console.error('❌ [login] Login failed:', err.message)
    passwordError.value = 'Incorrect email or password.'
  }
}
</script>
