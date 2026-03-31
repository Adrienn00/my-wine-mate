<template>
  <div class="flex min-h-screen items-center justify-center px-4 py-10">
    <div class="glass-panel w-full max-w-md rounded-2xl p-8 shadow-xl">
      <h2 class="mb-6 text-center text-3xl font-semibold">Forgot your password?</h2>
      <p class="mb-6 text-center text-sm text-[var(--text-muted)]">
        Enter your email address and we will send you a reset link.
      </p>

      <form @submit.prevent="handleSubmit">
        <div class="mb-4">
          <label for="email" class="block text-sm mb-1">Email address</label>
          <BaseInput
            v-model="email"
            type="email"
            id="email"
            placeholder="example@email.com"
            required
          />
        </div>

        <BaseButton variant="primary" type="submit"> Send </BaseButton>
      </form>

      <div class="text-sm text-center mt-6">
        <BaseButton to="/login" variant="simple">Back to login</BaseButton>
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
  alert(`Email sent: ${email.value}`)
  email.value = ''
}
</script>
