<template>
  <div class="page-shell">
    <div class="page-frame page-stack">
      <div class="section-intro text-center">
        <span class="section-kicker">Control Center</span>
        <h1 class="section-title">Admin Features</h1>
        <p class="mx-auto max-w-2xl text-[var(--text-muted)]">
          Keep the admin area visually aligned with the rest of the product while making the action
          paths clearer and easier to scan.
        </p>
      </div>

      <div class="mx-auto grid w-full max-w-4xl gap-4 md:grid-cols-2">
        <BaseButton variant="adminFunctions" to="/admin/pending">Approval / Editing</BaseButton>
        <BaseButton variant="adminFunctions" to="/admin/manager">Database Management</BaseButton>
        <BaseButton variant="adminFunctions" to="/admin/roles">Role Management</BaseButton>
        <BaseButton variant="adminFunctions">OCR System Management</BaseButton>
        <BaseButton variant="adminFunctions">AI Management</BaseButton>
        <BaseButton variant="adminFunctions" to="/admin/stats">System Statistics</BaseButton>
      </div>
    </div>
  </div>
</template>

<script setup>
import BaseButton from '@/components/ui/BaseButton.vue'
</script>
