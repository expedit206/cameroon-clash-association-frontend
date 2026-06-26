<template>
  <div class="profile-page container py-20">
    <div class="glass-card max-w-2xl mx-auto p-10 text-center">
      <div v-if="user" class="profile-header">
        <img
          v-if="user.league_icon"
          :src="user.league_icon"
          alt="League"
          class="league-big-icon"
        />
        <h1 class="heading text-4xl mt-4">{{ user.name }}</h1>
        <p class="text-gold font-mono">{{ user.tag_coc }}</p>
        <div class="role-badge mt-4" :class="roleBadgeClass">
          {{ roleLabel }}
        </div>
      </div>

      <div class="profile-details mt-10 grid grid-cols-2 gap-6 text-left">
        <div class="detail-item">
          <span class="label">Niveau HDV</span>
          <span class="value">{{ user?.hdv_level }}</span>
        </div>
        <div class="detail-item">
          <span class="label">Niveau Experience</span>
          <span class="value">{{ user?.exp_level || "N/A" }}</span>
        </div>
        <div class="detail-item">
          <span class="label">Téléphone</span>
          <span class="value">{{ user?.phone_whatsapp }}</span>
        </div>
        <div class="detail-item">
          <span class="label">Statut Profil</span>
          <span class="value capitalize">{{ user?.profile_status }}</span>
        </div>
      </div>

      <div class="mt-10 pt-10 border-t border-white/10">
        <NuxtLink to="/" class="btn-premium btn-outline"
          >Retour à l'accueil</NuxtLink
        >
      </div>
    </div>
  </div>
</template>

<script setup>
const { user } = useAuth();

const roleLabel = computed(() => {
  const labels = {
    player: "Joueur",
    captain: "Capitaine",
    referee: "Arbitre",
    admin: "Admin",
  };
  return labels[user.value?.role] || user.value?.role;
});

const roleBadgeClass = computed(() => {
  const classes = {
    player: "role-player",
    captain: "role-captain",
    referee: "role-referee",
    admin: "role-admin",
  };
  return classes[user.value?.role] || "";
});
</script>

<style scoped>
.league-big-icon {
  width: 100px;
  height: 100px;
  margin: 0 auto;
  filter: drop-shadow(0 0 20px rgba(212, 175, 55, 0.3));
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.detail-item .label {
  font-size: 0.8rem;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 1px;
}

.detail-item .value {
  font-weight: bold;
  font-size: 1.1rem;
}

.role-badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: bold;
  text-transform: uppercase;
  border: 1px solid currentColor;
}

.role-player {
  color: #94a3b8;
  border-color: #94a3b830;
  background: #94a3b810;
}
.role-captain {
  color: var(--primary);
  border-color: var(--primary-glow);
  background: rgba(212, 175, 55, 0.1);
}
.role-referee {
  color: #818cf8;
  border-color: #818cf830;
  background: #818cf810;
}
.role-admin {
  color: #f87171;
  border-color: #f8717130;
  background: #f8717110;
}
</style>
