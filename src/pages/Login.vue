<template>
  <NavBar />
  <div class="min-h-screen w-full flex items-center justify-center">
    <form
      @submit.prevent="login"
      class="w-full max-w-md flex flex-col gap-y-4 px-6 py-12 bg-gray-900 rounded-xl shadow-lg"
    >
      <h1 class="text-yellow-100 font-bold text-2xl text-center mb-4">Bejelentkezés</h1>

      <div class="w-full">
        <label for="email" class="block text-yellow-100 mb-1">E-mail</label>
        <input
          type="email"
          id="email"
          v-model="email"
          class="w-full py-2 px-3 border rounded bg-gray-800 text-white border-gray-600 focus:outline-none focus:ring focus:border-yellow-300"
        />
        <p v-if="emailError" class="text-xs text-red-600 mt-1">{{ emailError }}</p>
      </div>

      <div class="w-full">
        <label for="password" class="block text-yellow-100 mb-1">Jelszó</label>
        <input
          type="password"
          id="password"
          v-model="password"
          class="w-full py-2 px-3 border rounded bg-gray-800 text-white border-gray-600 focus:outline-none focus:ring focus:border-yellow-300"
        />
        <p v-if="passwordError" class="text-xs text-red-600 mt-1">{{ passwordError }}</p>
      </div>

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

const email = ref('')
const password = ref('')
const emailError = ref('')
const passwordError = ref('')

const login = () => {
  if (!email.value) {
    emailError.value = 'Add meg az emailed!'
  } else {
    emailError.value = ''
  }

  if (!password.value) {
    passwordError.value = 'Add meg a jelszavad!'
  } else {
    passwordError.value = ''
  }
  console.log('Email:', email.value)
  console.log('Password:', password.value)
}
</script>
