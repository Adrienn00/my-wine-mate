<template>
  <slot v-if="hasKey" />
  <div
    v-else
    class="flex flex-col items-center justify-center gap-3 rounded-xl border border-[var(--line)] bg-[var(--surface)] px-6 py-8 text-center"
  >
    <span class="text-3xl">🔑</span>
    <p class="font-semibold text-[var(--text-main)]">Groq API key required</p>
    <p class="max-w-xs text-sm text-[var(--text-muted)]">
      This feature needs your own Groq API key. It's free — set it up in 30 seconds.
    </p>
    <BaseButton to="/profile" variant="primary">Add API Key</BaseButton>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import BaseButton from './ui/BaseButton.vue'

const auth = useAuthStore()
const hasKey = computed(() => !!auth.groqApiKey)
</script>
