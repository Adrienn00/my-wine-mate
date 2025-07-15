<template>
  <NavBar />
  <div class="min-h-screen bg text-white flex items-center justify-center px-4">
    <div class="w-full max-w-md bg-gray-900 p-8 rounded shadow-md">
      <h2 class="text-3xl font-light text-yellow-100 mb-6 text-center">
        Elfelejtetted a jelszavad?
      </h2>
      <p class="text-sm text-gray-400 mb-6 text-center">
        Add meg az e-mail címed, és küldünk egy visszaállító linket.
      </p>

      <form @submit.prevent="handleSubmit">
        <div class="mb-4">
          <label for="email" class="block text-sm mb-1">E-mail cím</label>
          <input
            v-model="email"
            type="email"
            id="email"
            class="w-full py-2 px-3 border rounded bg-gray-800 text-white border-gray-600 focus:outline-none focus:ring focus:border-yellow-300"
            placeholder="pelda@email.com"
            required
          />
        </div>

        <BaseButton variant="secondary" type="submit"> Küldés </BaseButton>
      </form>

      <div class="text-sm text-center mt-6">
        <BaseButton to="/login" variant="simple">Vissza a bejelentkezéshez</BaseButton>
      </div>
    </div>
  </div>
</template>

<script setup>
import BaseButton from '../components/BaseButton.vue'
import { ref } from 'vue'
import NavBar from '../components/NavBar.vue'

const email = ref('')

function handleSubmit() {
  alert(`E-mail elküldve: ${email.value}`)
  email.value = ''
}
</script>
<style scoped>
.bg {
  background-image: url('/home/adrienn/www/my-wine-mate/src/assets/images/bg.jpg');
  background-size: cover;
}
</style>
