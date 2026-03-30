<template>
  <div class="min-h-screen w-full flex items-center justify-center bg">
    <form
      @submit.prevent="loginUser"
      class="w-full max-w-md flex flex-col gap-y-4 px-6 py-12 bg-gray-900 rounded-xl shadow-lg"
    >
      <h1 class="text-yellow-100 font-bold text-2xl text-center mb-4">Bejelentkezés</h1>

      <BaseInput id="email" label="E-mail" type="email" v-model="email" :error="emailError" />

      <BaseInput
        id="password"
        label="Jelszó"
        type="password"
        v-model="password"
        :error="passwordError"
      />

      <div class="w-full text-right">
        <BaseButton to="/forgotPassword" variant="simple"> Elfelejtetted a jelszavad? </BaseButton>
      </div>

      <BaseButton variant="secondary" type="submit" class="w-full mt-2">Bejelentkezés</BaseButton>

      <BaseButton to="/signup" variant="simple" class="mt-2 text-center text-sm">
        Regisztráció
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
  emailError.value = !email.value ? 'Add meg az emailed!' : ''
  passwordError.value = !password.value ? 'Add meg a jelszavad!' : ''
  if (emailError.value || passwordError.value) return

  try {
    await auth.login({
      email: email.value,
      password: password.value,
    })

    // Átirányítás profilra vagy főoldalra
    router.push('/')
  } catch (err) {
    console.error('❌ [login] Login failed:', err.message)
    passwordError.value = 'Hibás e-mail vagy jelszó!'
  }
}
</script>

<style scoped>
.bg {
  background-image: url('../assets/images/bg.jpg');
  background-size: cover;
}
</style>
