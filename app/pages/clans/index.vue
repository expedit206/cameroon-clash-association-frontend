<template>
  <div class="clans-page">
    <header class="page-header animate-float">
      <h1 class="heading">Les <span class="text-gold">16 Éclaireurs</span></h1>
      <p class="subtitle">
        Découvrez les clans d'élite sélectionnés pour la Saison 1.
      </p>
    </header>

    <div v-if="loading" class="loader-container">
      <div class="spinner"></div>
      <p>Appel des troupes...</p>
    </div>

    <div v-else-if="clans.length === 0" class="empty-clans glass-card">
      <p>
        Les inscriptions sont toujours en cours. Les 16 clans d'élite
        apparaîtront ici bientôt.
      </p>
      <NuxtLink to="/rules" class="btn-premium btn-primary mt-4"
        >Voir les Modalités</NuxtLink
      >
    </div>

    <div v-else class="clans-grid">
      <div
        v-for="clan in clans"
        :key="clan.id"
        class="clan-profile-card glass-card"
      >
        <div class="card-glow"></div>
        <div class="card-content">
          <div class="clan-badge-container">
            <img :src="clan.badge" :alt="clan.name" class="clan-badge" />
            <span class="clan-level">LVL {{ clan.level }}</span>
          </div>
          <h3 class="clan-name heading">{{ clan.name }}</h3>
          <p class="clan-tag text-gold">{{ clan.tag }}</p>

          <div class="clan-meta">
            <div class="meta-item">
              <span class="label">Seed</span>
              <span class="value">#{{ clan.seed }}</span>
            </div>
            <div class="meta-item">
              <span class="label">Région</span>
              <span class="value">Cameroun</span>
            </div>
          </div>

          <div class="card-actions">
            <button class="btn-premium btn-outline w-full py-2">
              Fiche Complète
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const { $api } = useNuxtApp();
const clans = ref([]);
const loading = ref(true);

const fetchClans = async () => {
  try {
    clans.value = await $api("/tournament/clans");
  } catch (e) {
    console.error(e);
  } finally {
    loading.value = false;
  }
};

onMounted(fetchClans);
</script>

<style scoped>
.page-header {
  text-align: center;
  margin-bottom: 60px;
}

.clans-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 30px;
}

.clan-profile-card {
  position: relative;
  overflow: hidden;
  padding: 30px;
  text-align: center;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.clan-profile-card:hover {
  transform: translateY(-10px);
  border-color: var(--primary);
  box-shadow: 0 10px 40px rgba(187, 0, 255, 0.2);
}

.card-glow {
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(
    circle at center,
    rgba(187, 0, 255, 0.1) 0%,
    transparent 70%
  );
  opacity: 0;
  transition: opacity 0.3s;
  pointer-events: none;
}

.clan-profile-card:hover .card-glow {
  opacity: 1;
}

.clan-badge-container {
  position: relative;
  display: inline-block;
  margin-bottom: 20px;
}

.clan-badge {
  width: 100px;
  height: 100px;
  filter: drop-shadow(0 0 10px rgba(0, 0, 0, 0.5));
}

.clan-level {
  position: absolute;
  bottom: 0;
  right: -5px;
  background: var(--primary);
  color: white;
  font-size: 0.65rem;
  font-weight: 800;
  padding: 2px 8px;
  border-radius: 50px;
  border: 2px solid var(--bg-dark);
}

.clan-name {
  margin: 0;
  font-size: 1.4rem;
  letter-spacing: 1px;
}

.clan-tag {
  font-size: 0.8rem;
  font-weight: bold;
  margin-bottom: 20px;
}

.clan-meta {
  display: flex;
  justify-content: center;
  gap: 30px;
  margin-bottom: 25px;
  padding-top: 15px;
  border-top: 1px solid var(--glass-border);
}

.meta-item {
  display: flex;
  flex-direction: column;
}

.meta-item .label {
  font-size: 0.65rem;
  text-transform: uppercase;
  color: var(--text-muted);
  letter-spacing: 2px;
}

.meta-item .value {
  font-weight: 800;
  font-size: 1rem;
}

.loader-container {
  text-align: center;
  padding: 100px 0;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid var(--glass-border);
  border-top-color: var(--primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.empty-clans {
  text-align: center;
  padding: 60px;
}
</style>
