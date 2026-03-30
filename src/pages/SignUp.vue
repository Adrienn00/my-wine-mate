<template>
  <div class="flex min-h-screen w-full items-center justify-center px-4 py-10">
    <form
      @submit.prevent="signup"
      class="glass-panel w-full max-w-md rounded-2xl px-6 py-10 shadow-xl md:px-8"
    >
      <h1 class="mb-5 text-center text-3xl font-semibold">Regisztráció</h1>

      <BaseInput
        id="email"
        label="Add meg az e-mailed!"
        type="email"
        v-model="email"
        :error="emailError"
      />
      <BaseInput
        id="password"
        label="Add meg a jelszavad!"
        type="password"
        v-model="password"
        :error="passwordError"
      />
      <BaseInput
        id="repeatedPassword"
        label="Add meg újra a jelszavad"
        type="password"
        v-model="repeatedPassword"
        :error="repeatedPasswordError"
      />

      <div class="w-full text-right">
        <BaseButton to="/login" variant="simple"> Már regisztráltál? Jelentkezz be! </BaseButton>
      </div>

      <BaseButton variant="primary" type="submit" class="mt-2 w-full">Regisztrálok</BaseButton>
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
  // Alap validálás
  emailError.value = !email.value ? 'Add meg az emailed!' : ''
  passwordError.value = !password.value ? 'Add meg a jelszavad!' : ''
  repeatedPasswordError.value =
    password.value && password.value !== repeatedPassword.value ? 'A két jelszó nem egyezik!' : ''

  // Ha van bármilyen hiba, ne küldjük el
  if (emailError.value || passwordError.value || repeatedPasswordError.value) {
    return
  }

  try {
    await auth.register({
      username: email.value.split('@')[0], // ideiglenes username
      email: email.value,
      password: password.value,
    })
    router.push('/login') // vagy mehet automatikusan bejelentkezés után pl. '/'
  } catch (err) {
    console.error('❌ Regisztrációs hiba:', err.message)
  }
}
</script>
