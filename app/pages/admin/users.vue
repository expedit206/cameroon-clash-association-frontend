<template>
  <div class="admin-users-page">
    <div class="header-action mb-8">
      <NuxtLink to="/admin/dashboard" class="btn-back"
        >← Retour au Tableau de Bord</NuxtLink
      >
      <h1 class="heading mt-4">
        Validation des <span class="text-gold">Joueurs</span>
      </h1>
      <p class="text-muted">
        Vérifiez la concordance entre le nom In-Game et la capture d'écran
        fournie.
      </p>
    </div>

    <div v-if="loading" class="loader-placeholder">
      <div class="spinner"></div>
      <p>Chargement des dossiers...</p>
    </div>

    <div v-else-if="users.length === 0" class="empty-state glass-card">
      <p>Aucun joueur en attente de validation. 🎉</p>
    </div>

    <div v-else class="users-list">
      <div
        v-for="user in users"
        :key="user.id"
        class="user-moderation-card glass-card"
      >
        <div class="user-main-info">
          <div class="user-identity">
            <h3>{{ user.name }}</h3>
            <span class="tag-coc text-gold">{{ user.tag_coc }}</span>
          </div>
          <div class="user-details">
            <p><strong>HDV :</strong> {{ user.hdv_level }}</p>
            <p><strong>WhatsApp :</strong> {{ user.phone_whatsapp }}</p>
            <p class="text-xs text-muted">
              Inscrit le {{ formatDate(user.created_at) }}
            </p>
          </div>
        </div>

        <div class="user-proof">
          <button class="btn-view-proof" @click="viewProof(user)">
            📸 Voir la Preuve
          </button>
        </div>

        <div class="user-actions">
          <button
            class="btn-action check"
            @click="approveUser(user.id)"
            :disabled="processing === user.id"
          >
            {{ processing === user.id ? "..." : "Valider" }}
          </button>
          <button
            class="btn-action cross"
            @click="rejectUser(user.id)"
            :disabled="processing === user.id"
          >
            Refuser
          </button>
        </div>
      </div>
    </div>

    <!-- Modal pour la preuve -->
    <Transition name="fade">
      <div
        v-if="selectedUser"
        class="modal-overlay"
        @click="selectedUser = null"
      >
        <div class="modal-content glass-card" @click.stop>
          <div class="modal-header">
            <h3>Preuve de {{ selectedUser.name }}</h3>
            <button class="btn-close" @click="selectedUser = null">
              &times;
            </button>
          </div>
          <div class="modal-body">
            <!-- On suppose que screenshot_proof est une URL relative stockée en DB -->
            <!-- Dans un vrai projet Laravel/Nuxt, on utiliserait le chemin public -->
            <img
              :src="getProofUrl(selectedUser.screenshot_proof)"
              alt="Capture CoC"
              class="proof-img"
            />
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
const { $api } = useNuxtApp();
const users = ref([]);
const loading = ref(true);
const processing = ref(null);
const selectedUser = ref(null);

const fetchUsers = async () => {
  try {
    users.value = await $api("/admin/users/pending");
  } catch (e) {
    console.error(e);
  } finally {
    loading.value = false;
  }
};

const approveUser = async (id) => {
  processing.value = id;
  try {
    await $api(`/admin/users/${id}/validate`, { method: "PUT" });
    users.value = users.value.filter((u) => u.id !== id);
  } catch (e) {
    alert("Erreur lors de la validation.");
  } finally {
    processing.value = null;
  }
};

const rejectUser = async (id) => {
  if (!confirm("Voulez-vous vraiment refuser ce joueur ?")) return;
  processing.value = id;
  try {
    await $api(`/admin/users/${id}/reject`, { method: "PUT" });
    users.value = users.value.filter((u) => u.id !== id);
  } catch (e) {
    alert("Erreur lors du refus.");
  } finally {
    processing.value = null;
  }
};

const viewProof = (user) => {
  selectedUser.value = user;
};

const getProofUrl = (path) => {
  // Ajustez selon votre configuration de stockage Laravel
  return `http://localhost:8000/${path}`;
};

const formatDate = (dateStr) => {
  return new Date(dateStr).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

onMounted(fetchUsers);
</script>

<style scoped>
.btn-back {
  text-decoration: none;
  color: var(--primary);
  font-weight: 600;
  font-size: 0.9rem;
}

.user-moderation-card {
  display: grid;
  grid-template-columns: 1fr 180px 180px;
  align-items: center;
  gap: 20px;
  padding: 20px;
  margin-bottom: 16px;
}

.user-identity h3 {
  margin: 0;
}
.tag-coc {
  font-weight: bold;
  letter-spacing: 1px;
}

.user-details p {
  margin: 2px 0;
  font-size: 0.85rem;
}

.btn-view-proof {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--glass-border);
  color: white;
  padding: 10px 15px;
  border-radius: 8px;
  cursor: pointer;
  width: 100%;
  font-size: 0.85rem;
}

.btn-view-proof:hover {
  background: rgba(255, 255, 255, 0.1);
}

.user-actions {
  display: flex;
  gap: 10px;
}

.btn-action {
  flex: 1;
  padding: 10px;
  border-radius: 8px;
  border: none;
  font-weight: bold;
  cursor: pointer;
  color: white;
}

.btn-action.check {
  background: #10b981;
}
.btn-action.cross {
  background: #ef4444;
}

.btn-action:hover:not(:disabled) {
  opacity: 0.8;
}
.btn-action:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  width: 90%;
  max-width: 800px;
  padding: 20px;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.btn-close {
  background: transparent;
  border: none;
  font-size: 2rem;
  color: white;
  cursor: pointer;
}

.proof-img {
  width: 100%;
  border-radius: 8px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@media (max-width: 768px) {
  .user-moderation-card {
    grid-template-columns: 1fr;
    text-align: center;
  }
}
</style>
