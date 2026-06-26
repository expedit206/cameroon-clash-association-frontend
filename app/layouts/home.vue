<template>
  <!-- Layout home : pas de padding/max-width pour permettre le hero plein écran -->
  <div class="layout-home">
    <!-- Navbar en position absolute par-dessus le hero fullscreen -->
    <AppNavbar :overlay="true" />
    <StatusBanner />

    <!-- Contenu de la page sans contraintes -->
    <slot />

    <!-- Footer riche & responsive -->
    <AppFooter />
  </div>
</template>

<style scoped>
.layout-home {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  position: relative;
}
</style>
