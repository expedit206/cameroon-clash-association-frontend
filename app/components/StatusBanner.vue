<template>
  <Transition name="slide-down">
    <div v-if="showBanner" class="status-banner">
      <div class="banner-content">
        <p>
          <strong>Profil en cours de vérification.</strong>
         (CCA verifie si le compte Clash of Clan avec le quel vous nous avez rejoins vous appartient effectivement) Vous pouvez explorer la plateforme, mais certaines actions
          (inscription de clan, etc.) sont limitées.
        </p>
      </div>
    </div>
  </Transition>
</template>

<script setup>
const { user } = useAuth();

const showBanner = computed(() => {
  return user.value && user.value.status === "pending";
});
</script>

<style scoped>
.status-banner {
  background: linear-gradient(90deg, #f59e0b, #d97706);
  color: white;
  padding: 10px 10px;
  text-align: center;
  font-size: 0.9rem;
  box-shadow: 0 4px 15px rgba(245, 158, 11, 0.3);
  z-index: 100;
  position: relative;
}

.banner-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
  max-width: 1200px;
  margin: 0 auto;
}

.icon {
  font-size: 1.2rem;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
  100% {
    opacity: 1;
  }
}

.slide-down-enter-active,
.slide-down-leave-active {
  transition:
    transform 0.3s ease,
    opacity 0.3s ease;
}
.slide-down-enter-from,
.slide-down-leave-to {
  transform: translateY(-100%);
  opacity: 0;
}
</style>
