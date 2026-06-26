<template>
  <div class="admin-registrations-page">
    <div class="header-action mb-8">
      <NuxtLink to="/admin/dashboard" class="btn-back"
        >← Retour au Tableau de Bord</NuxtLink
      >
      <h1 class="heading mt-4">
        Inscriptions & <span class="text-gold">Paiements</span>
      </h1>
      <p class="text-muted">
        Vérifiez les compositions d'équipe et confirmez les paiements reçus
        (Phase 3).
      </p>
    </div>

    <div v-if="loading" class="loader-placeholder">
      <div class="spinner"></div>
      <p>Chargement des dossiers...</p>
    </div>

    <div v-else-if="registrations.length === 0" class="empty-state glass-card">
      <p>Aucune inscription en attente de paiement. ⌛</p>
    </div>

    <div v-else class="registrations-list">
      <div
        v-for="reg in registrations"
        :key="reg.id"
        class="registration-card glass-card"
      >
        <!-- En-tête du Clan -->
        <div class="reg-header">
          <div class="clan-brand">
            <img
              :src="reg.clan?.badge_url"
              alt=""
              class="badge-sm"
              v-if="reg.clan?.badge_url"
            />
            <div>
              <h3>{{ reg.clan?.name }}</h3>
              <p class="text-xs text-gold">{{ reg.clan?.tag_coc }}</p>
            </div>
          </div>
          <div class="reg-status">
            <span class="badge-status" :class="reg.status">{{
              formatStatus(reg.status)
            }}</span>
          </div>
        </div>

        <!-- Composition Équipe -->
        <div class="reg-roster mt-4">
          <p class="text-sm font-bold mb-2">
            🛡️ Roster ({{ reg.players?.length }}/10) :
          </p>
          <div class="players-mini-grid">
            <div v-for="p in reg.players" :key="p.id" class="player-pill">
              <span class="hdv">TH{{ p.hdv_position }}</span> {{ p.user?.name }}
            </div>
          </div>
        </div>

        <!-- Infos Paiement -->
        <div
          v-if="reg.payment"
          class="reg-payment mt-6 p-4 bg-glass-dark rounded-lg border-l-4 border-gold"
        >
          <p class="text-gold font-bold mb-2">💰 Détails du Paiement :</p>
          <div class="payment-details">
            <p>
              <strong>Méthode :</strong>
              {{ reg.payment.payment_method?.toUpperCase() }}
            </p>
            <p><strong>Nombre :</strong> {{ reg.payment.phone_number }}</p>
            <p>
              <strong>Référence :</strong>
              <code class="text-gold highlight-ref">{{
                reg.payment.reference
              }}</code>
            </p>
            <p class="text-xs text-muted">
              Soumis le {{ formatDate(reg.payment.created_at) }}
            </p>
          </div>
        </div>
        <div
          v-else
          class="reg-payment mt-6 p-4 bg-glass-dark rounded-lg border-l-4 border-orange"
        >
          <p class="text-orange font-bold">
            Paiement non encore soumis par le capitaine.
          </p>
        </div>

        <!-- Actions -->
        <div class="reg-actions mt-6">
          <button
            class="btn-premium btn-primary w-full"
            @click="confirmRegistration(reg)"
            :disabled="
              reg.status === 'confirmed' ||
              processing === reg.id ||
              !reg.payment
            "
          >
            <span v-if="reg.status === 'confirmed'">✅ Déjà Confirmé</span>
            <span v-else-if="processing === reg.id">⌛ Vérification...</span>
            <span v-else-if="!reg.payment">⚠️ En attente de paiement</span>
            <span v-else>Confirmé & Valider le Paiement</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const { $api } = useNuxtApp();
const registrations = ref([]);
const loading = ref(true);
const processing = ref(null);

const fetchRegistrations = async () => {
  try {
    registrations.value = await $api("/admin/registrations");
  } catch (e) {
    console.error(e);
  } finally {
    loading.value = false;
  }
};

const confirmRegistration = async (reg) => {
  if (!confirm(`Confirmer l'inscription du clan ${reg.clan.name} ?`)) return;
  processing.value = reg.id;
  try {
    await $api(`/admin/registrations/${reg.id}/confirm`, { method: "PUT" });
    alert("Inscription confirmée et clan séléctionné pour le tournoi !");
    await fetchRegistrations();
  } catch (e) {
    alert(e.data?.message || "Erreur lors de la confirmation.");
  } finally {
    processing.value = null;
  }
};

const formatStatus = (status) => {
  const map = {
    pending_payment: "En attente de paiement",
    pending_confirmation: "Paiement à vérifier",
    confirmed: "Confirmé ✅",
    rejected: "Refusé ❌",
  };
  return map[status] || status;
};

const formatDate = (dateStr) => {
  return new Date(dateStr).toLocaleString("fr-FR", {
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getProofUrl = (path) => `http://localhost:8000/storage/${path}`;

onMounted(fetchRegistrations);
</script>

<style scoped>
.registration-card {
  margin-bottom: 24px;
  padding: 24px;
  border-left: 2px solid var(--glass-border);
}
.reg-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid var(--glass-border);
  padding-bottom: 15px;
}
.clan-brand {
  display: flex;
  gap: 15px;
  align-items: center;
}
.badge-sm {
  width: 40px;
}

.players-mini-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.player-pill {
  font-size: 0.75rem;
  background: rgba(255, 255, 255, 0.05);
  padding: 4px 10px;
  border-radius: 10px;
  border: 1px solid var(--glass-border);
}
.player-pill .hdv {
  font-weight: bold;
  color: var(--primary);
  margin-right: 4px;
}

.bg-glass-dark {
  background: rgba(0, 0, 0, 0.3);
}

.badge-status {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.7rem;
  font-weight: 800;
  text-transform: uppercase;
}
.badge-status.confirmed {
  background: var(--primary);
  color: white;
}
.badge-status.pending_payment {
  background: #f59e0b;
  color: white;
}
.badge-status.pending_confirmation {
  background: #6366f1;
  color: white;
}

.highlight-ref {
  background: rgba(187, 0, 255, 0.1);
  padding: 2px 6px;
  border-radius: 4px;
  border: 1px solid rgba(187, 0, 255, 0.3);
}

.border-gold {
  border-left-color: var(--primary) !important;
}
.border-orange {
  border-left-color: #f59e0b !important;
}
</style>
