<template>
  <div class="flex min-h-screen items-center justify-center px-4 py-10">
    <div class="glass-panel w-full max-w-md rounded-2xl p-8 shadow-xl">
      <h2 class="mb-6 text-center text-3xl font-semibold">Elfelejtetted a jelszavad?</h2>
      <p class="mb-6 text-center text-sm text-[var(--text-muted)]">
        Add meg az e-mail címed, és küldünk egy visszaállító linket.
      </p>

      <form @submit.prevent="handleSubmit">
        <div class="mb-4">
          <label for="email" class="block text-sm mb-1">E-mail cím</label>
          <BaseInput
            v-model="email"
            type="email"
            id="email"
            placeholder="pelda@email.com"
            required
          />
        </div>

        <BaseButton variant="primary" type="submit"> Küldés </BaseButton>
      </form>

      <div class="text-sm text-center mt-6">
        <BaseButton to="/login" variant="simple">Vissza a bejelentkezéshez</BaseButton>
      </div>
    </div>
  </div>
</template>

<script setup>
import BaseButton from '../components/ui/BaseButton.vue'
import { ref } from 'vue'
import BaseInput from '../components/ui/BaseInput.vue'

const email = ref('')

function handleSubmit() {
  alert(`E-mail elküldve: ${email.value}`)
  email.value = ''
}
</script>
