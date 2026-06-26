<template>
  <div class="admin-clans-page">
    <div class="header-action mb-8">
      <NuxtLink to="/admin/dashboard" class="btn-back"
        >← Retour au Tableau de Bord</NuxtLink
      >
      <h1 class="heading mt-4">
        Validation des <span class="text-gold">Clans</span>
      </h1>
      <p class="text-muted">
        Approuvez les candidatures des capitaines pour la Phase 1.
      </p>
    </div>

    <div v-if="loading" class="loader-placeholder">
      <div class="spinner"></div>
      <p>Chargement des candidatures...</p>
    </div>

    <div v-else-if="clans.length === 0" class="empty-state glass-card">
      <p>Aucune candidature de clan en attente. 🛡️</p>
    </div>

    <div v-else class="clans-list">
      <div
        v-for="clan in clans"
        :key="clan.id"
        class="clan-moderation-card glass-card"
      >
        <div class="clan-main">
          <img
            :src="clan.badge_url"
            alt=""
            class="clan-badge-md"
            v-if="clan.badge_url"
          />
          <div class="clan-info">
            <h3>{{ clan.name }}</h3>
            <span class="text-gold">{{ clan.tag_coc }}</span>
            <div class="level-badge">Niveau {{ clan.clan_level }}</div>
          </div>
        </div>

        <div class="captain-info">
          <p class="text-xs text-muted">Capitaine :</p>
          <p>
            <strong>{{ clan.captain?.name }}</strong>
          </p>
          <p class="text-xs">{{ clan.captain?.tag_coc }}</p>
        </div>

        <div class="clan-actions">
          <button
            class="btn-action check"
            @click="approveClan(clan.id)"
            :disabled="processing === clan.id"
          >
            Accepter
          </button>
          <button
            class="btn-action cross"
            @click="rejectClan(clan.id)"
            :disabled="processing === clan.id"
          >
            Refuser
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const { $api } = useNuxtApp();
const clans = ref([]);
const loading = ref(true);
const processing = ref(null);

const fetchClans = async () => {
  try {
    clans.value = await $api("/admin/clans/pending");
  } catch (e) {
    console.error(e);
  } finally {
    loading.value = false;
  }
};

const approveClan = async (id) => {
  processing.value = id;
  try {
    await $api(`/admin/clans/${id}/validate`, { method: "PUT" });
    clans.value = clans.value.filter((c) => c.id !== id);
  } catch (e) {
    alert("Erreur lors de la validation.");
  } finally {
    processing.value = null;
  }
};

const rejectClan = async (id) => {
  if (!confirm("Refuser cette candidature ?")) return;
  processing.value = id;
  try {
    await $api(`/admin/clans/${id}/reject`, { method: "PUT" });
    clans.value = clans.value.filter((c) => c.id !== id);
  } catch (e) {
    alert("Erreur lors du refus.");
  } finally {
    processing.value = null;
  }
};

onMounted(fetchClans);
</script>

<style scoped>
.btn-back {
  text-decoration: none;
  color: var(--primary);
  font-weight: 600;
  font-size: 0.9rem;
}

.clan-moderation-card {
  display: grid;
  grid-template-columns: 1fr 200px 180px;
  align-items: center;
  gap: 20px;
  padding: 20px;
  margin-bottom: 16px;
}

.clan-main {
  display: flex;
  align-items: center;
  gap: 20px;
}

.clan-badge-md {
  width: 50px;
}

.level-badge {
  display: inline-block;
  font-size: 0.7rem;
  font-weight: bold;
  padding: 2px 8px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--glass-border);
  border-radius: 4px;
}

.clan-info h3 {
  margin: 0;
}

.btn-action {
  flex: 1;
  padding: 10px;
  border-radius: 8px;
  border: none;
  font-weight: bold;
  cursor: pointer;
  color: white;
  width: 100%;
}

.clan-actions {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.btn-action.check {
  background: #10b981;
}
.btn-action.cross {
  background: #ef4444;
}

@media (max-width: 768px) {
  .clan-moderation-card {
    grid-template-columns: 1fr;
    text-align: center;
  }
  .clan-main {
    justify-content: center;
    flex-direction: column;
  }
}
</style>
