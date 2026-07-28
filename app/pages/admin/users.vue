<template>
  <div class="admin-users-page">
    <div class="header-action mb-8">
      <NuxtLink to="/admin/dashboard" class="btn-back">← Retour au Tableau de Bord</NuxtLink>
      <h1 class="heading mt-4">
        Gestion et Validation des <span class="text-gold">Joueurs</span>
      </h1>
      <p class="text-muted">
        Consultez, recherchez, modérez les joueurs inscrits et accédez directement aux données in-game Clash of Clans.
      </p>
    </div>

    <!-- ── RECHERCHE & FILTRES ───────────────────── -->
    <div class="controls-section glass-card mb-8">
      <div class="search-box">
        <LucideSearch class="icon-search-btn" :size="20" />
        <input v-model="searchQuery" type="text" placeholder="Rechercher par nom, tag, ou clan..."
          class="search-input" />
      </div>

      <div class="filter-tabs mt-4">
        <button v-for="tab in tabs" :key="tab.value" class="filter-tab" :class="{ active: statusFilter === tab.value }"
          @click="statusFilter = tab.value">
          {{ tab.label }}
        </button>
      </div>
    </div>

    <!-- ── CHARGEMENT ────────────────────────── -->
    <div v-if="loading" class="loader-placeholder">
      <div class="spinner"></div>
      <p>Chargement des dossiers...</p>
    </div>

    <!-- ── LISTE VIDE ────────────────────────── -->
    <div v-else-if="users.length === 0" class="empty-state glass-card">
      <p>Aucun joueur trouvé correspondant aux critères. 🛡️</p>
    </div>

    <!-- ── LISTE DES JOUEURS ───────────────────── -->
    <div v-else class="users-list">
      <div v-for="user in users" :key="user.id" class="user-moderation-card glass-card">
        <div class="user-main-info">
          <div class="user-identity">
            <div class="flex items-center gap-2">
              <h3>{{ user.name }}</h3>
              <span v-if="user.role === 'captain'" class="badge-role captain" title="Capitaine du Clan">
                <LucideCrown :size="14" class="inline" /> Capitaine
              </span>
              <span v-else-if="user.role === 'referee'" class="badge-role referee">
                Arbitre
              </span>
              <span v-else class="badge-role player">
                Joueur
              </span>
            </div>

            <div class="flex items-center gap-2 mt-1">
              <span class="tag-coc text-gold">{{ user.tag_coc }}</span>
              <a :href="getPlayerCoCLink(user.tag_coc)" target="_blank" class="coc-external-link"
                title="Consulter le profil dans Clash of Clans">
                In-game
                <LucideExternalLink :size="12" class="inline" />
              </a>
            </div>
          </div>

          <div class="user-details mt-4">
            <p><strong>HDV :</strong> HDV {{ user.hdv_level }}</p>
            <p><strong>WhatsApp :</strong> {{ user.phone_whatsapp || 'Non fourni' }}</p>
            <p class="text-xs text-muted">
              Inscrit le {{ formatDate(user.created_at) }}
            </p>
          </div>
        </div>

        <!-- ── CLAN INFO ────────────────────────── -->
        <div class="clan-info-section">
          <p class="section-part-title font-ui">Clan Associé</p>
          <div v-if="user.current_clan_info" class="clan-details-box mt-2">
            <div class="clan-meta">
              <img v-if="user.current_clan_info.badge_url" :src="user.current_clan_info.badge_url" alt="Badge"
                class="clan-badge-img" />
              <div class="clan-texts">
                <span class="clan-name font-heading text-white">{{ user.current_clan_info.name }}</span>
                <span class="clan-tag text-xs text-muted block">{{ user.current_clan_info.tag_coc }}</span>
              </div>
            </div>
            <div class="clan-actions mt-3">
              <button class="btn-clan-members font-ui"
                @click="viewClanMembers(user.current_clan_info.tag_coc, user.current_clan_info.name)">
                <LucideUsers :size="14" class="inline mr-1" /> Membres
              </button>
              <a :href="getClanCoCLink(user.current_clan_info.tag_coc)" target="_blank" class="btn-clan-link font-ui"
                title="Voir le clan in-game">
                <LucideExternalLink :size="14" />
              </a>
            </div>
          </div>
          <div v-else class="text-xs text-muted mt-2 italic">
            Aucun clan synchronisé
          </div>
        </div>

        <!-- ── ACTIONS D'ADMINISTRATION ───────────── -->
        <div class="action-panel">
          <!-- Modération de statut (si en attente) -->
          <div class="moderation-status-box mb-3">
            <span class="text-xs text-muted font-ui block mb-2">Statut Compte</span>
            <div class="flex items-center gap-2">
              <span :class="['status-badge', user.status]">
                {{ translateStatus(user.status) }}
              </span>
              <button v-if="user.screenshot_proof" class="btn-view-proof" @click="viewProof(user)"
                title="Voir la capture d'écran de preuve">
                📸 Preuve
              </button>
            </div>
          </div>

          <!-- Actions de modification de statut -->
          <div v-if="user.status === 'pending'" class="flex gap-2 mb-3">
            <button class="btn-action check" @click="approveUser(user.id)" :disabled="processing === user.id">
              Valider
            </button>
            <button class="btn-action cross" @click="rejectUser(user.id)" :disabled="processing === user.id">
              Refuser
            </button>
          </div>

          <!-- Rôles et Suppression -->
          <div class="flex flex-col gap-2">
            <button v-if="user.role === 'player' && user.status === 'validated'" class="btn-promote font-ui"
              @click="promoteUserToCaptain(user.id, user.name)" :disabled="processing === user.id">
              <LucideCrown :size="14" class="inline mr-1" /> Promouvoir Capitaine
            </button>

            <button class="py-2 px-3 rounded-md font-ui font-bold text-xs uppercase tracking-wide bg-orange-600/20 text-orange-500 border border-orange-600/40 hover:bg-orange-600/40 transition-all text-left" 
              @click="openResetPasswordModal(user)" :disabled="processing === user.id">
              <LucideKey :size="14" class="inline mr-1 -mt-0.5" /> Réinitialiser Mot de passe
            </button>

            <button class="btn-delete font-ui" @click="deleteUserAccount(user.id, user.name)"
              :disabled="processing === user.id">
              <LucideTrash2 :size="14" class="inline mr-1" /> Supprimer Joueur
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- ── MODAL POUR LA PREUVE ───────────────── -->
    <Transition name="fade">
      <div v-if="selectedUser" class="modal-overlay" @click="selectedUser = null">
        <div class="modal-content glass-card" @click.stop>
          <div class="modal-header">
            <h3>Preuve de {{ selectedUser.name }}</h3>
            <button class="btn-close" @click="selectedUser = null">
              &times;
            </button>
          </div>
          <div class="modal-body text-center">
            <img :src="getProofUrl(selectedUser.screenshot_proof)" alt="Capture CoC" class="proof-img" />
          </div>
        </div>
      </div>
    </Transition>

    <!-- ── MODAL POUR LES MEMBRES DU CLAN ───────── -->
    <Transition name="fade">
      <div v-if="showMembersModal" class="modal-overlay" @click="showMembersModal = false">
        <div class="modal-content members-modal glass-card" @click.stop>
          <div class="modal-header">
            <div>
              <h3 class="text-gold font-heading">{{ activeClanName }}</h3>
              <p class="text-xs text-muted">{{ activeClanTag }}</p>
            </div>
            <button class="btn-close" @click="showMembersModal = false">
              &times;
            </button>
          </div>
          <div class="modal-body overflow-y-auto" style="max-height: 70vh;">
            <div v-if="loadingMembers" class="text-center py-8">
              <div class="spinner"></div>
              <p class="mt-2 text-muted">Récupération des membres depuis l'API CoC...</p>
            </div>

            <div v-else-if="selectedClanMembers.length === 0" class="text-center py-8">
              <p class="text-muted">Aucun membre trouvé ou erreur API.</p>
            </div>

            <div v-else class="members-table-container">
              <table class="members-table font-ui">
                <thead>
                  <tr>
                    <th>Joueur</th>
                    <th>HDV</th>
                    <th>Niveau</th>
                    <th>Rôle CoC</th>
                    <th>Statut Plateforme</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="member in selectedClanMembers" :key="member.tag_coc">
                    <td>
                      <div class="flex items-center gap-2">
                        <img v-if="member.league_icon" :src="member.league_icon" alt="Ligue"
                          class="league-icon-small" />
                        <div>
                          <div class="text-white font-medium">{{ member.name }}</div>
                          <div class="text-xs text-muted">{{ member.tag_coc }}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span class="th-badge">HDV {{ member.townHallLevel }}</span>
                    </td>
                    <td class="text-center">{{ member.exp_level }}</td>
                    <td>
                      <span class="text-muted text-xs capitalize">{{ translateClanRole(member.role_coc) }}</span>
                    </td>
                    <td>
                      <span :class="['registered-badge', member.is_registered ? 'registered' : 'unregistered']">
                        {{ member.is_registered ? 'Inscrit' : 'Non inscrit' }}
                      </span>
                    </td>
                    <td>
                      <a :href="getPlayerCoCLink(member.tag_coc)" target="_blank" class="btn-action-game"
                        title="Ouvrir dans le jeu">
                        Compte
                        <LucideExternalLink :size="10" class="inline" />
                      </a>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <!-- ── MODAL RESET PASSWORD ───────────────── -->
    <Transition name="fade">
      <div v-if="showResetPasswordModal" class="modal-overlay" @click="showResetPasswordModal = false">
        <div class="modal-content glass-card" @click.stop>
          <div class="modal-header">
            <h3 class="text-xl">Modifier Mot de Passe - {{ selectedUserToReset?.name }}</h3>
            <button class="btn-close" @click="showResetPasswordModal = false">
              &times;
            </button>
          </div>
          <div class="modal-body space-y-4 mt-4">
            <p class="text-sm text-muted mb-2">Veuillez saisir le nouveau mot de passe pour cet utilisateur.</p>
            <input v-model="newPassword" type="text" class="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-orange-500 transition-colors" placeholder="Nouveau mot de passe (min 8 caractères)..." />
            <button @click="submitResetPassword" :disabled="newPassword.length < 8 || resettingPassword"
              class="w-full py-3 bg-orange-600 hover:bg-orange-500 text-white font-bold uppercase tracking-widest text-xs rounded-lg disabled:opacity-50 mt-4 transition-colors">
              <span v-if="resettingPassword">Validation...</span>
              <span v-else>Confirmer la modification</span>
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';

const { $api } = useNuxtApp();
const users = ref([]);
const loading = ref(true);
const processing = ref(null);
const selectedUser = ref(null);

// Filtres
const searchQuery = ref("");
const statusFilter = ref("all");

const tabs = [
  { value: "all", label: "Tous" },
  { value: "pending", label: "En attente" },
  { value: "validated", label: "Validés" },
  { value: "rejected", label: "Refusés" }
];

// Gestion des membres de clan
const selectedClanMembers = ref([]);
const loadingMembers = ref(false);
const showMembersModal = ref(false);
const activeClanTag = ref("");
const activeClanName = ref("");

// Reset Password
const showResetPasswordModal = ref(false);
const selectedUserToReset = ref(null);
const newPassword = ref('');
const resettingPassword = ref(false);

const openResetPasswordModal = (user) => {
  selectedUserToReset.value = user;
  newPassword.value = '';
  showResetPasswordModal.value = true;
};

const submitResetPassword = async () => {
  if (!selectedUserToReset.value || newPassword.value.length < 8) return;
  resettingPassword.value = true;
  try {
    const res = await $api(`/admin/users/${selectedUserToReset.value.id}/reset-password`, { 
      method: "PUT",
      body: { new_password: newPassword.value }
    });
    alert(res.message || "Mot de passe réinitialisé avec succès.");
    showResetPasswordModal.value = false;
  } catch (e) {
    alert("Erreur lors de la réinitialisation du mot de passe.");
  } finally {
    resettingPassword.value = false;
  }
};

const fetchUsers = async () => {
  loading.value = true;
  try {
    users.value = await $api("/admin/users", {
      params: {
        search: searchQuery.value,
        status: statusFilter.value,
      },
    });
  } catch (e) {
    console.error(e);
  } finally {
    loading.value = false;
  }
};

// Observer les changements pour re-filtrer
watch([searchQuery, statusFilter], () => {
  fetchUsers();
});

const approveUser = async (id) => {
  processing.value = id;
  try {
    await $api(`/admin/users/${id}/validate`, { method: "PUT" });
    // Mettre à jour localement ou recharger
    const user = users.value.find(u => u.id === id);
    if (user) {
      user.status = 'validated';
    }
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
    const user = users.value.find(u => u.id === id);
    if (user) {
      user.status = 'rejected';
    }
  } catch (e) {
    alert("Erreur lors du refus.");
  } finally {
    processing.value = null;
  }
};

const promoteUserToCaptain = async (id, name) => {
  if (!confirm(`Voulez-vous vraiment promouvoir ${name} au rôle de capitaine ?`)) return;
  processing.value = id;
  try {
    await $api(`/admin/users/${id}/make-captain`, { method: "PUT" });
    alert(`${name} a été promu capitaine.`);
    fetchUsers();
  } catch (e) {
    alert("Erreur lors de la promotion.");
  } finally {
    processing.value = null;
  }
};

const deleteUserAccount = async (id, name) => {
  if (!confirm(`Voulez-vous vraiment supprimer définitivement le joueur ${name} ? Cette action est irréversible.`)) return;
  processing.value = id;
  try {
    await $api(`/admin/users/${id}`, { method: "DELETE" });
    users.value = users.value.filter(u => u.id !== id);
    alert(`Le joueur ${name} a été supprimé.`);
  } catch (e) {
    alert("Erreur lors de la suppression.");
  } finally {
    processing.value = null;
  }
};

const viewClanMembers = async (clanTag, clanName) => {
  activeClanTag.value = clanTag;
  activeClanName.value = clanName;
  showMembersModal.value = true;
  loadingMembers.value = true;
  selectedClanMembers.value = [];
  try {
    selectedClanMembers.value = await $api(`/admin/clans/${encodeURIComponent(clanTag)}/members`);
  } catch (e) {
    console.error(e);
    alert("Impossible de charger les membres de ce clan.");
    showMembersModal.value = false;
  } finally {
    loadingMembers.value = false;
  }
};

const viewProof = (user) => {
  selectedUser.value = user;
};

const getProofUrl = (path) => {
  if (process.client) {
    const hostname = window.location.hostname;
    if (hostname.includes("clashkamer.com")) {
      return `https://api.clashkamer.com/${path}`;
    }
  }
  return `http://localhost:8000/${path}`;
};

// Formater les liens de Clash of Clans
const getPlayerCoCLink = (tag) => {
  const cleanTag = tag.replace("#", "");
  return `https://link.clashofclans.com/en?action=OpenPlayerProfile&tag=${encodeURIComponent(cleanTag)}`;
};

const getClanCoCLink = (tag) => {
  const cleanTag = tag.replace("#", "");
  return `https://link.clashofclans.com/en?action=OpenClanProfile&tag=${encodeURIComponent(cleanTag)}`;
};

const formatDate = (dateStr) => {
  return new Date(dateStr).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const translateStatus = (status) => {
  const mapping = {
    pending: "En attente",
    validated: "Validé",
    rejected: "Refusé",
  };
  return mapping[status] || status;
};

const translateClanRole = (role) => {
  const mapping = {
    leader: "Chef",
    coLeader: "Co-Chef",
    admin: "Ainé",
    member: "Membre",
  };
  return mapping[role] || role;
};

onMounted(fetchUsers);
</script>

<style scoped>
.btn-back {
  text-decoration: none;
  color: var(--primary);
  font-weight: 600;
  font-size: 0.9rem;
  font-family: var(--font-ui);
}

.controls-section {
  padding: 20px;
}

.search-box {
  position: relative;
  width: 100%;
}

.icon-search-btn {
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-muted);
}

.search-input {
  width: 100%;
  background: rgba(0, 0, 0, 0.4);
  border: 1px solid var(--glass-border);
  color: white;
  padding: 12px 12px 12px 45px;
  border-radius: 8px;
  font-family: var(--font-ui);
  font-size: 1rem;
  transition: all 0.3s;
}

.search-input:focus {
  border-color: var(--primary);
  outline: none;
  box-shadow: 0 0 10px rgba(187, 0, 255, 0.2);
}

.filter-tabs {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.filter-tab {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--glass-border);
  color: var(--text-muted);
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-family: var(--font-ui);
  font-weight: 700;
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  transition: all 0.2s;
}

.filter-tab:hover,
.filter-tab.active {
  background: var(--primary);
  border-color: var(--primary);
  color: white;
}

.users-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.user-moderation-card {
  display: grid;
  grid-template-columns: 1.5fr 1fr 1fr;
  align-items: start;
  gap: 30px;
  padding: 24px;
}

.user-identity h3 {
  margin: 0;
  font-family: var(--font-heading);
  font-size: 1.4rem;
  color: white;
}

.badge-role {
  font-family: var(--font-ui);
  font-size: 0.7rem;
  padding: 2px 8px;
  border-radius: 4px;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.badge-role.captain {
  background: rgba(212, 175, 55, 0.2);
  color: #ffd700;
  border: 1px solid rgba(212, 175, 55, 0.4);
}

.badge-role.referee {
  background: rgba(52, 152, 219, 0.2);
  color: #3498db;
  border: 1px solid rgba(52, 152, 219, 0.4);
}

.badge-role.player {
  background: rgba(255, 255, 255, 0.1);
  color: #cccccc;
}

.tag-coc {
  font-weight: bold;
  letter-spacing: 1px;
  font-family: var(--font-ui);
}

.coc-external-link {
  color: var(--secondary);
  text-decoration: none;
  font-size: 0.75rem;
  font-family: var(--font-ui);
  text-transform: uppercase;
  font-weight: 700;
  letter-spacing: 0.5px;
}

.coc-external-link:hover {
  text-decoration: underline;
}

.user-details p {
  margin: 4px 0;
  font-size: 0.9rem;
}

.section-part-title {
  color: var(--text-muted);
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-weight: 700;
  border-bottom: 1px solid var(--glass-border);
  padding-bottom: 6px;
}

.clan-details-box {
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid var(--glass-border);
  padding: 12px;
  border-radius: 8px;
}

.clan-meta {
  display: flex;
  align-items: center;
  gap: 12px;
}

.clan-badge-img {
  width: 36px;
  height: 36px;
}

.clan-name {
  font-size: 1.1rem;
  display: block;
}

.clan-actions {
  display: flex;
  gap: 8px;
}

.btn-clan-members,
.btn-clan-link {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--glass-border);
  color: white;
  padding: 6px 12px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.8rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.btn-clan-link {
  padding: 6px 10px;
}

.btn-clan-members:hover,
.btn-clan-link:hover {
  background: rgba(255, 255, 255, 0.15);
  border-color: var(--secondary);
}

.status-badge {
  font-size: 0.8rem;
  padding: 4px 10px;
  border-radius: 6px;
  font-family: var(--font-ui);
  text-transform: uppercase;
  font-weight: 700;
  letter-spacing: 0.5px;
}

.status-badge.pending {
  background: rgba(243, 156, 18, 0.2);
  color: #f39c12;
  border: 1px solid rgba(243, 156, 18, 0.4);
}

.status-badge.validated {
  background: rgba(46, 204, 113, 0.2);
  color: #2ecc71;
  border: 1px solid rgba(46, 204, 113, 0.4);
}

.status-badge.rejected {
  background: rgba(231, 76, 60, 0.2);
  color: #e74c3c;
  border: 1px solid rgba(231, 76, 60, 0.4);
}

.btn-view-proof {
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid var(--glass-border);
  color: white;
  padding: 4px 10px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.8rem;
}

.btn-view-proof:hover {
  background: rgba(255, 255, 255, 0.15);
}

.btn-action {
  flex: 1;
  padding: 8px 12px;
  border-radius: 6px;
  border: none;
  font-family: var(--font-ui);
  font-weight: bold;
  cursor: pointer;
  color: white;
  text-transform: uppercase;
  font-size: 0.8rem;
  letter-spacing: 0.5px;
}

.btn-action.check {
  background: #10b981;
}

.btn-action.cross {
  background: #ef4444;
}

.btn-action:hover:not(:disabled) {
  opacity: 0.9;
  filter: brightness(1.1);
}

.btn-promote {
  background: rgba(212, 175, 55, 0.1);
  border: 1px solid rgba(212, 175, 55, 0.4);
  color: #ffd700;
  padding: 8px 12px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.8rem;
  font-weight: bold;
  transition: all 0.2s;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.btn-promote:hover:not(:disabled) {
  background: rgba(212, 175, 55, 0.25);
}

.btn-delete {
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.4);
  color: #ff8888;
  padding: 8px 12px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.8rem;
  font-weight: bold;
  transition: all 0.2s;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.btn-delete:hover:not(:disabled) {
  background: rgba(239, 68, 68, 0.25);
}

.btn-promote:disabled,
.btn-delete:disabled,
.btn-action:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* MODALS */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.modal-content {
  width: 100%;
  max-width: 600px;
  padding: 24px;
}

.modal-content.members-modal {
  max-width: 850px;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  border-bottom: 1px solid var(--glass-border);
  padding-bottom: 14px;
}

.modal-header h3 {
  margin: 0;
  font-size: 1.6rem;
}

.btn-close {
  background: transparent;
  border: none;
  font-size: 2rem;
  color: var(--text-muted);
  cursor: pointer;
  transition: color 0.2s;
}

.btn-close:hover {
  color: white;
}

.proof-img {
  max-width: 100%;
  max-height: 70vh;
  border-radius: 8px;
  border: 1px solid var(--glass-border);
}

/* CLAN MEMBERS TABLE */
.members-table-container {
  overflow-x: auto;
}

.members-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
}

.members-table th {
  padding: 12px;
  font-size: 0.8rem;
  color: var(--text-muted);
  border-bottom: 1px solid var(--glass-border);
  text-transform: uppercase;
  letter-spacing: 1px;
}

.members-table td {
  padding: 12px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  vertical-align: middle;
}

.league-icon-small {
  width: 24px;
  height: 24px;
}

.th-badge {
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid var(--glass-border);
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: bold;
}

.registered-badge {
  font-size: 0.75rem;
  padding: 2px 8px;
  border-radius: 4px;
  font-weight: bold;
}

.registered-badge.registered {
  background: rgba(46, 204, 113, 0.2);
  color: #2ecc71;
  border: 1px solid rgba(46, 204, 113, 0.4);
}

.registered-badge.unregistered {
  background: rgba(255, 255, 255, 0.05);
  color: var(--text-muted);
  border: 1px solid var(--glass-border);
}

.btn-action-game {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--glass-border);
  color: var(--secondary);
  padding: 4px 8px;
  border-radius: 4px;
  text-decoration: none;
  font-size: 0.75rem;
}

.btn-action-game:hover {
  background: rgba(255, 255, 255, 0.15);
  text-decoration: underline;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@media (max-width: 992px) {
  .user-moderation-card {
    grid-template-columns: 1fr;
    gap: 20px;
  }
}
</style>
