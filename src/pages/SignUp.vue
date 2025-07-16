<template>
  <div class="min-h-screen w-full flex items-center justify-center bg">
    <form
      @submit.prevent="signup"
      class="w-full max-w-md flex flex-col gap-y-4 px-6 py-12 bg-gray-900 rounded-xl shadow-lg"
    >
      <h1 class="text-yellow-100 font-bold text-2xl text-center mb-4">Regisztráció</h1>
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

      <BaseButton variant="secondary" type="submit" class="w-full mt-2">Regisztrálok</BaseButton>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import BaseButton from '../components/ui/BaseButton.vue'
import BaseInput from '../components/ui/BaseInput.vue'

const router = useRouter()

const email = ref('')
const password = ref('')
const repeatedPassword = ref('')
const emailError = ref('')
const passwordError = ref('')
const repeatedPasswordError = ref('')

function signup() {
  emailError.value = !email.value ? 'Add meg az emailed!' : ''
  passwordError.value = !password.value ? 'Add meg a jelszavad!' : ''
  repeatedPasswordError.value =
    password.value && password.value !== repeatedPassword.value ? 'A két jelszó nem egyezik!' : ''
}
</script>
<style scoped>
.bg {
  background-image: url('/home/adrienn/www/my-wine-mate/src/assets/images/bg.jpg');
  background-size: cover;
}
</style>
