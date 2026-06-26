<template>
  <div class="layout-default">
    <!-- Navbar réutilisable (mode sticky + responsive) -->
    <AppNavbar />
    <StatusBanner />

    <main class="main-content">
      <slot />
    </main>

    <!-- Footer riche & responsive -->
    <AppFooter />
  </div>
</template>

<style scoped>
.layout-default {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.main-content {
  flex: 1;
  padding: 40px 40px;
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
}

@media (max-width: 768px) {
  .main-content {
    padding: 20px 16px;
  }
}
</style>
