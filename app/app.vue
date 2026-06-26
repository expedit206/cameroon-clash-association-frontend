<template>
  <div class="app-container">
    <div class="bg-immersive"></div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup>
// La restauration de session est gérée par le plugin auth.ts
// qui s'exécute AVANT les middlewares de route, éliminant la course SSR/Client.
</script>

<style scoped>
.app-container {
  min-height: 100vh;
  position: relative;
}
</style>
