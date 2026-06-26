<template>
  <div class="admin-dashboard">
    <header class="admin-header">
      <h1 class="heading">
        Panneau de <span class="text-gold">Contrôle</span>
      </h1>
      <p class="subtitle">Gestion globale de la CCA National League.</p>
    </header>

    <!-- Cartes de Statistiques -->
    <div class="stats-grid">
      <div class="stat-card glass-card">
        <div class="stat-icon">👥</div>
        <div class="stat-info">
          <span class="label">Utilisateurs</span>
          <span class="value">{{ stats.users || 0 }}</span>
          <small v-if="stats.pending_users > 0" class="text-gold">
            {{ stats.pending_users }} en attente
          </small>
        </div>
      </div>

      <div class="stat-card glass-card">
        <div class="stat-icon">🛡️</div>
        <div class="stat-info">
          <span class="label">Clans</span>
          <span class="value">{{ stats.clans || 0 }}</span>
          <small v-if="stats.pending_clans > 0" class="text-gold">
            {{ stats.pending_clans }} candidatures
          </small>
        </div>
      </div>

      <div class="stat-card glass-card">
        <div class="stat-icon">⚔️</div>
        <div class="stat-info">
          <span class="label">Inscriptions</span>
          <span class="value">{{ stats.confirmed_registrations || 0 }}/16</span>
          <small>Clans confirmés</small>
        </div>
      </div>

      <div class="stat-card glass-card">
        <div class="stat-icon">💰</div>
        <div class="stat-info">
          <span class="label">Cagnotte</span>
          <span class="value text-gold">{{
            formatCurrency(stats.total_payments || 0)
          }}</span>
          <small>Fonds collectés</small>
        </div>
      </div>
    </div>

    <!-- Actions Rapides -->
    <div class="admin-grid mt-10">
      <div class="action-section glass-card">
        <h3 class="text-gold mb-6">Moderation</h3>
        <div class="action-buttons">
          <NuxtLink to="/admin/users" class="admin-action-btn">
            <span class="btn-icon">👤</span>
            <div class="btn-text">
              <p>Valider les Joueurs</p>
              <small>Vérifier les captures d'écran des tags CoC</small>
            </div>
            <span v-if="stats.pending_users > 0" class="badge-count">{{
              stats.pending_users
            }}</span>
          </NuxtLink>

          <NuxtLink to="/admin/clans" class="admin-action-btn">
            <span class="btn-icon">🏷️</span>
            <div class="btn-text">
              <p>Valider les Clans</p>
              <small>Approuver les candidatures des capitaines</small>
            </div>
            <span v-if="stats.pending_clans > 0" class="badge-count">{{
              stats.pending_clans
            }}</span>
          </NuxtLink>

          <NuxtLink to="/admin/registrations" class="admin-action-btn">
            <span class="btn-icon">💳</span>
            <div class="btn-text">
              <p>Vérifier les Paiements</p>
              <small>Confirmer les frais d'inscription (5k FCFA)</small>
            </div>
          </NuxtLink>
        </div>
      </div>

      <div class="system-section glass-card">
        <h3 class="text-gold mb-6">Système & Logs</h3>
        <!-- On pourra ajouter ici des logs de l'API ou statut des serveurs -->
        <div class="placeholder-content">
          <p class="text-muted text-sm">Le système est stable.</p>
          <div class="status-indicator online">Opérationnel</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const { $api } = useNuxtApp();
const stats = ref({});
const loading = ref(true);

const fetchStats = async () => {
  try {
    stats.value = await $api("/admin/stats");
  } catch (e) {
    console.error(e);
  } finally {
    loading.value = false;
  }
};

const formatCurrency = (val) => {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "XAF",
    maximumFractionDigits: 0,
  }).format(val);
};

onMounted(fetchStats);
</script>

<style scoped>
.admin-dashboard {
  padding-bottom: 40px;
}

.admin-header {
  margin-bottom: 40px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 24px;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 24px;
  transition: transform 0.3s;
}

.stat-card:hover {
  transform: translateY(-5px);
}

.stat-icon {
  font-size: 2.5rem;
  background: rgba(255, 255, 255, 0.05);
  width: 64px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
}

.stat-info {
  display: flex;
  flex-direction: column;
}

.stat-info .label {
  font-size: 0.8rem;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 1px;
}

.stat-info .value {
  font-size: 1.8rem;
  font-weight: 800;
  font-family: "Outfit", sans-serif;
}

.stat-info small {
  font-size: 0.75rem;
  font-weight: 600;
}

.admin-grid {
  display: grid;
  grid-template-columns: 1fr 340px;
  gap: 30px;
}

.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.admin-action-btn {
  display: flex;
  align-items: center;
  padding: 18px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid var(--glass-border);
  border-radius: 12px;
  text-decoration: none;
  color: white;
  transition: all 0.2s;
  position: relative;
}

.admin-action-btn:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: var(--primary);
  transform: translateX(5px);
}

.btn-icon {
  font-size: 1.5rem;
  margin-right: 20px;
  width: 40px;
  text-align: center;
}

.btn-text p {
  font-weight: 700;
  margin: 0;
}

.btn-text small {
  color: var(--text-muted);
  font-size: 0.8rem;
}

.badge-count {
  position: absolute;
  top: 18px;
  right: 18px;
  background: var(--primary);
  color: white;
  font-size: 0.7rem;
  font-weight: 800;
  padding: 2px 8px;
  border-radius: 20px;
  box-shadow: 0 0 10px var(--primary-glow);
}

.status-indicator {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: bold;
  background: rgba(16, 185, 129, 0.1);
  color: #10b981;
  border: 1px solid rgba(16, 185, 129, 0.2);
}

@media (max-width: 1024px) {
  .admin-grid {
    grid-template-columns: 1fr;
  }
}
</style>
