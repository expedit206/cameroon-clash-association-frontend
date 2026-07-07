<template>
  <Teleport to="body">
    <div class="toast-container">
      <TransitionGroup name="toast">
        <div
          v-for="toast in $toast.toasts"
          :key="toast.id"
          class="toast-pill"
          :class="toast.type"
        >
          <div class="toast-icon">
            <span v-if="toast.type === 'success'">✔️</span>
            <span v-else-if="toast.type === 'error'">⚠️</span>
            <span v-else-if="toast.type === 'info'">ℹ️</span>
            <span v-else-if="toast.type === 'warning'">⚡</span>
          </div>
          <div class="toast-message">{{ toast.message }}</div>
          <button class="toast-close" @click="$toast.remove(toast.id)">
            ✕
          </button>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup>
const { $toast } = useNuxtApp();
</script>

<style scoped>
.toast-container {
  position: fixed;
  top: 24px;
  right: 24px;
  z-index: 10000;
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-width: 380px;
  pointer-events: none;
}

.toast-pill {
  pointer-events: auto;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 18px;
  border-radius: 40px;
  background: rgba(15, 17, 26, 0.85);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.4);
  color: white;
  transition: all 0.3s cubic-bezier(0.18, 0.89, 0.32, 1.28);
}

.toast-message {
  font-size: 0.85rem;
  font-weight: 600;
  line-height: 1.4;
}

.toast-pill.success {
  border-color: rgba(34, 197, 94, 0.3);
}
.toast-pill.success .toast-icon {
  color: #22c55e;
}

.toast-pill.error {
  border-color: rgba(239, 68, 68, 0.3);
}
.toast-pill.error .toast-icon {
  color: #ef4444;
}

.toast-pill.warning {
  border-color: rgba(234, 179, 8, 0.3);
}
.toast-pill.warning .toast-icon {
  color: #eab308;
}

.toast-close {
  margin-left: 8px;
  opacity: 0.4;
  font-size: 0.7rem;
  cursor: pointer;
  transition: opacity 0.2s;
}
.toast-close:hover {
  opacity: 1;
}

/* Animations */
.toast-enter-from {
  opacity: 0;
  transform: translateX(100px) scale(0.9);
}
.toast-leave-to {
  opacity: 0;
  transform: translateY(-20px) scale(0.95);
}
</style>
