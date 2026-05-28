<template>
  <div class="flex min-h-[80vh] w-full items-center justify-center px-4 py-10">
    <div class="w-full max-w-md text-center">
      <p class="text-5xl">📬</p>
      <h1 class="mt-4 text-2xl font-semibold text-[var(--text-main)]">Check your email</h1>
      <p class="mt-3 text-sm text-[var(--text-muted)]">
        We sent a verification link to your email address. Click the link to activate your account.
        The link expires in <strong>24 hours</strong>.
      </p>
      <p class="mt-6 text-sm text-[var(--text-muted)]">
        Already verified?
        <BaseButton to="/login" variant="simple" class="ml-1">Log in</BaseButton>
      </p>
    </div>
  </div>
</template>

<script setup>
import BaseButton from '../components/ui/BaseButton.vue'
</script>
