<template>
  <div class="page-shell">
    <div :class="['page-frame page-stack', maxWidth]">
      <slot />
    </div>
  </div>
</template>

<script setup>
defineProps({
  maxWidth: { type: String, default: '' },
})
</script>
