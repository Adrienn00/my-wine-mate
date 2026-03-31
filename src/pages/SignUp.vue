<template>
  <div class="flex min-h-screen w-full items-center justify-center px-4 py-10">
    <form
      @submit.prevent="signup"
      class="glass-panel w-full max-w-md rounded-2xl px-6 py-10 shadow-xl md:px-8"
    >
      <h1 class="mb-5 text-center text-3xl font-semibold">Sign Up</h1>

      <BaseInput
        id="email"
        label="Email"
        type="email"
        v-model="email"
        :error="emailError"
      />
      <BaseInput
        id="password"
        label="Password"
        type="password"
        v-model="password"
        :error="passwordError"
      />
      <BaseInput
        id="repeatedPassword"
        label="Confirm password"
        type="password"
        v-model="repeatedPassword"
        :error="repeatedPasswordError"
      />

      <div class="w-full text-right">
        <BaseButton to="/login" variant="simple"> Already have an account? Log in! </BaseButton>
      </div>

      <BaseButton variant="primary" type="submit" class="mt-2 w-full">Create Account</BaseButton>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import BaseButton from '../components/ui/BaseButton.vue'
import BaseInput from '../components/ui/BaseInput.vue'

const router = useRouter()
const auth = useAuthStore()

const email = ref('')
const password = ref('')
const repeatedPassword = ref('')
const emailError = ref('')
const passwordError = ref('')
const repeatedPasswordError = ref('')

async function signup() {
  // Basic validation.
  emailError.value = !email.value ? 'Please enter your email.' : ''
  passwordError.value = !password.value ? 'Please enter your password.' : ''
  repeatedPasswordError.value =
    password.value && password.value !== repeatedPassword.value ? 'The two passwords do not match.' : ''

  // Do not submit the form if any validation error is present.
  if (emailError.value || passwordError.value || repeatedPasswordError.value) {
    return
  }

  try {
    await auth.register({
      username: email.value.split('@')[0],
      email: email.value,
      password: password.value,
    })
    router.push('/login')
  } catch (err) {
    console.error('Sign-up error:', err.message)
  }
}
</script>
