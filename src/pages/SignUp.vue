<template>
  <div class="flex min-h-[80vh] w-full items-center justify-center px-4 py-10">
    <div class="w-full max-w-md">
      <div class="mb-8 text-center">
        <p class="font-['Cormorant_Garamond'] text-3xl font-semibold text-[var(--wine)]">
          MyWineMate
        </p>
        <p class="mt-1 text-sm text-[var(--text-muted)]">Create your free account</p>
      </div>

      <BaseCard
        as="form"
        rounded="rounded-2xl"
        padding="px-6 py-8 md:px-8"
        @submit.prevent="signup"
      >
        <h1 class="mb-6 text-2xl font-semibold">Sign Up</h1>

        <BaseInput
          id="username"
          v-model="username"
          label="Username"
          type="text"
          :error="usernameError"
        />
        <BaseInput id="email" label="Email" type="email" v-model="email" :error="emailError" />
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

        <BaseButton variant="primary" type="submit" class="mt-2 w-full">Create Account</BaseButton>

        <div class="mt-4 text-center text-sm text-[var(--text-muted)]">
          Already have an account?
          <BaseButton to="/login" variant="simple" class="ml-1">Log in</BaseButton>
        </div>
      </BaseCard>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import BaseButton from '../components/ui/BaseButton.vue'
import BaseCard from '../components/ui/BaseCard.vue'
import BaseInput from '../components/ui/BaseInput.vue'

const router = useRouter()
const auth = useAuthStore()

const username = ref('')
const email = ref('')
const password = ref('')
const repeatedPassword = ref('')
const usernameError = ref('')
const emailError = ref('')
const passwordError = ref('')
const repeatedPasswordError = ref('')

async function signup() {
  usernameError.value = !username.value.trim() ? 'Please enter a username.' : ''
  emailError.value = !email.value ? 'Please enter your email.' : ''
  passwordError.value = !password.value ? 'Please enter your password.' : ''
  repeatedPasswordError.value =
    password.value && password.value !== repeatedPassword.value
      ? 'The two passwords do not match.'
      : ''

  if (usernameError.value || emailError.value || passwordError.value || repeatedPasswordError.value) return

  try {
    await auth.register({
      username: username.value.trim(),
      email: email.value,
      password: password.value,
    })
    router.push('/login')
  } catch (err) {
    usernameError.value = err.message?.includes('username') ? 'This username is already taken.' : ''
    emailError.value = err.message?.includes('email') ? 'This email is already registered.' : ''
    if (!usernameError.value && !emailError.value) console.error('Sign-up error:', err.message)
  }
}
</script>
