<script setup>
definePageMeta({
  middleware: [
    () => navigateTo('/clash-bet/mes-paris', { redirectCode: 301 })
  ]
});
</script>

<template>
  <div class="min-h-screen bg-[#06070a] flex items-center justify-center text-white/40 text-xs">
    Chargement de vos tickets...
  </div>
</template>
