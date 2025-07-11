<template>
  <NavBar />
  <div class="min-h-screen w-full flex items-center justify-center">
    <form
      @submit.prevent="login"
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
        <router-link to="/forgotPassword" class="text-sm text-yellow-100 hover:underline">
          Elfelejtetted a jelszavad?
        </router-link>
      </div>

      <BaseButton variant="secondary" type="submit" class="w-full mt-2">Bejelentkezés</BaseButton>

      <router-link to="/signup" class="text-sm text-yellow-100 hover:underline text-center mt-2">
        Regisztráció
      </router-link>
    </form>
  </div>
</template>
<script setup>
import { ref } from 'vue'
import NavBar from '../components/NavBar.vue'
import BaseButton from '../components/BaseButton.vue'
import BaseInput from '../components/BaseInput.vue'

const email = ref('')
const password = ref('')
const emailError = ref('')
const passwordError = ref('')

const login = () => {
  emailError.value = !email.value ? 'Add meg az emailed!' : ''
  passwordError.value = !password.value ? 'Add meg a jelszavad!' : ''
}
</script>
