<template>
  <div class="admin-clans-page">
    <div class="header-action mb-8">
      <NuxtLink to="/admin/dashboard" class="btn-back">← Retour au Tableau de Bord</NuxtLink>
      <h1 class="heading mt-4">
        Gestion et Validation des <span class="text-gold">Clans</span>
      </h1>
      <p class="text-muted">
        Consultez l'ensemble des clans, gérez les équipes de la ligue et ajoutez/retirez des joueurs des rosters.
      </p>
    </div>

    <!-- ── FILTRES ───────────────────── -->
    <div class="controls-section glass-card mb-8">
      <div class="filter-tabs flex flex-wrap gap-2">
        <button v-for="tab in tabs" :key="tab.value" class="filter-tab" :class="{ active: statusFilter === tab.value }"
          @click="statusFilter = tab.value">
          {{ tab.label }}
        </button>
      </div>
    </div>

    <div v-if="loading" class="loader-placeholder">
      <div class="spinner"></div>
      <p>Chargement des clans...</p>
    </div>

    <div v-else-if="clans.length === 0" class="empty-state glass-card">
      <p>Aucun clan trouvé correspondant aux critères. 🛡️</p>
    </div>

    <div v-else class="clans-list">
      <TransitionGroup name="list">
        <div v-for="clan in clans" :key="clan.id" class="clan-moderation-card glass-card">
          <!-- ── IDENTITÉ DU CLAN ── -->
          <div class="clan-main">
            <img :src="clan.badge_url" alt="" class="clan-badge-md" v-if="clan.badge_url" />
            <div class="clan-info">
              <h3>{{ clan.name }}</h3>
              <span class="text-gold font-ui tracking-widest font-bold text-xs">{{ clan.tag_coc }}</span>
              <div class="level-badge mt-2">Niveau {{ clan.clan_level }}</div>
              <div class="mt-2">
                <span :class="['status-badge', clan.status]">{{ translateStatus(clan.status) }}</span>
              </div>
            </div>
          </div>

          <!-- ── CAPITAINE + WHATSAPP ── -->
          <div class="captain-info">
            <p class="text-[10px] text-white/40 mb-1 font-ui uppercase tracking-wider">Capitaine :</p>
            <p class="font-bold text-white">
              <LucideCrown :size="14" class="inline text-gold mr-1" />
              {{ clan.captain?.name || 'Inconnu' }}
            </p>
            <p class="text-[10px] text-white/50 font-mono mb-2">{{ clan.captain?.tag_coc }}</p>
            <a v-if="clan.captain?.phone_whatsapp"
              :href="`https://wa.me/${clan.captain.phone_whatsapp.replace(/\D/g, '')}`" target="_blank"
              class="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wide bg-green-900/40 text-green-400 border border-green-600/30 px-2 py-1 rounded-full hover:bg-green-900/60 transition-colors">
              <span class="text-base leading-none">📱</span> WhatsApp
            </a>
            <span v-else class="text-[10px] text-white/20 italic">Pas de WhatsApp</span>
          </div>

          <!-- ── ROSTER TOURNOI ── -->
          <div class="roster-preview text-xs">
            <p class="text-[10px] text-white/40 mb-1 font-ui uppercase tracking-wider">Roster Tournoi :</p>
            <template v-if="clan.registrations && clan.registrations.length > 0">
              <div class="space-y-0.5">
                <div v-for="p in getStarters(clan)" :key="p.id" class="flex items-center gap-1.5 text-white/80">
                  <span class="w-1.5 h-1.5 rounded-full bg-gold flex-shrink-0"></span>
                  <span class="font-bold truncate">{{ p.user?.name }}</span>
                  <span class="text-white/30">HDV{{ p.user?.hdv_level || p.hdv_position }}</span>
                </div>
                <div v-for="p in getSubs(clan)" :key="p.id" class="flex items-center gap-1.5 text-white/40">
                  <span class="w-1.5 h-1.5 rounded-full bg-white/20 flex-shrink-0"></span>
                  <span class="truncate">{{ p.user?.name }}</span>
                  <span class="text-white/20 text-[9px]">Remplac.</span>
                </div>
                <button @click="openRosterModal(clan)"
                  class="mt-2 text-[10px] font-bold text-blue-400 hover:text-blue-300 transition-colors uppercase tracking-wide flex items-center gap-1">
                  <LucidePencil :size="10" /> Gérer le Roster ({{ (getStarters(clan).length + getSubs(clan).length) }}
                  joueurs)
                </button>
              </div>
            </template>
            <p v-else class="text-white/20 text-[10px] italic">Pas encore inscrit au tournoi</p>
          </div>

          <!-- ── ACTIONS ── -->
          <div class="clan-actions">
            <template v-if="clan.status === 'pending'">
              <button class="btn-action check" @click="approveClan(clan.id)" :disabled="processing === clan.id">
                Valider
              </button>
              <button class="btn-action cross" @click="rejectClan(clan.id)" :disabled="processing === clan.id">
                Refuser
              </button>
            </template>
            <template v-else>
              <a :href="getClanCoCLink(clan.tag_coc)" target="_blank"
                class="btn-action view font-ui text-center text-[11px] flex items-center justify-center">
                Profil In-Game
              </a>
            </template>
            <button class="btn-action delete font-ui text-[11px] flex items-center justify-center gap-1 mt-2"
              @click="deleteClan(clan.id, clan.name)" :disabled="processing === clan.id">
              <LucideTrash2 :size="14" /> Supprimer
            </button>
          </div>
        </div>
      </TransitionGroup>
    </div>

    <!-- ── MODAL ROSTER AVANCÉ ───────────────── -->
    <Transition name="fade">
      <div v-if="showRosterModal && selectedClan" class="modal-overlay" @click="showRosterModal = false">
        <div class="modal-content glass-card max-w-xl w-full mx-4" @click.stop>
          <div class="modal-header">
            <div>
              <h3 class="text-gold">Roster — {{ selectedClan.name }}</h3>
              <p class="text-xs text-white/40 mt-0.5">Ajoutez/retirez des joueurs ou basculez Titulaire/Remplaçant</p>
            </div>
            <button class="btn-close" @click="showRosterModal = false">&times;</button>
          </div>

          <!-- LISTE DES JOUEURS ACTUELS DU ROSTER -->
          <div class="modal-body mt-4 space-y-2 max-h-[45vh] overflow-y-auto pr-1">
            <div v-if="rosterPlayers.length === 0"
              class="text-center text-white/40 py-6 border border-dashed border-white/10 rounded-xl">
              Aucun joueur dans ce roster pour le moment.
            </div>
            <div v-for="player in rosterPlayers" :key="player.id"
              class="flex items-center justify-between p-3 rounded-xl border transition-all"
              :class="player.is_substitute ? 'bg-white/3 border-white/8' : 'bg-gold/5 border-gold/30'">
              <div class="flex items-center gap-3 flex-1 min-w-0">
                <span class="text-lg">{{ player.is_substitute ? '🔄' : '⭐' }}</span>
                <div class="min-w-0">
                  <p class="font-bold text-white text-sm truncate">{{ player.user?.name || 'Joueur #' + player.player_id
                    }}
                  </p>
                  <p class="text-[10px] text-white/40 font-mono">{{ player.user?.tag_coc }}</p>
                </div>
                <span class="text-[10px] font-bold px-2 py-0.5 rounded-full"
                  :class="player.is_substitute ? 'bg-white/10 text-white/50' : 'bg-gold/20 text-gold'">
                  {{ player.is_substitute ? 'Remplaçant' : 'Titulaire' }}
                </span>
                <span class="text-[10px] text-white/30">HDV{{ player.user?.hdv_level || player.hdv_position }}</span>
              </div>
              <div class="flex items-center gap-2">
                <button @click="toggleSubstitute(player)"
                  class="px-2.5 py-1 text-[10px] font-bold uppercase rounded-lg border transition-all flex-shrink-0"
                  :class="player.is_substitute ? 'border-gold/40 text-gold hover:bg-gold/10' : 'border-white/20 text-white/50 hover:bg-white/10'">
                  {{ player.is_substitute ? '↑ Titulaire' : '↓ Remplaçant' }}
                </button>
                <button @click="removePlayerFromRoster(player)" title="Retirer du roster"
                  class="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg border border-red-500/20 transition-all">
                  <LucideTrash2 :size="14" />
                </button>
              </div>
            </div>
          </div>

          <!-- SECTION AJOUTER UN JOUEUR -->
          <div class="mt-4 pt-4 border-t border-white/10 space-y-2">
            <p class="text-xs font-bold text-white/70 uppercase tracking-wider">➕ Ajouter un joueur au roster :</p>
            <div class="flex gap-2">
              <select v-model="selectedUserToAdd"
                class="bg-black/60 border border-white/20 rounded-lg px-3 py-2 text-xs text-white flex-1 focus:border-gold outline-none">
                <option :value="null">-- Choisir un joueur éligible --</option>
                <option v-for="u in availablePlayersList" :key="u.id" :value="u.id">
                  {{ u.name }} ({{ u.tag_coc }}) - HDV {{ u.hdv_level }}
                </option>
              </select>
              <select v-model="addAsSubstitute"
                class="bg-black/60 border border-white/20 rounded-lg px-3 py-2 text-xs text-white w-32 outline-none">
                <option :value="false">Titulaire</option>
                <option :value="true">Remplaçant</option>
              </select>
              <button @click="addPlayerToRoster" :disabled="!selectedUserToAdd || addingPlayer"
                class="px-4 py-2 bg-green-600 hover:bg-green-500 text-white text-xs font-bold rounded-lg transition disabled:opacity-40">
                {{ addingPlayer ? '...' : 'Ajouter' }}
              </button>
            </div>
            <p v-if="availablePlayersList.length === 0" class="text-[10px] text-white/30 italic">
              Aucun autre joueur disponible sans clan ou déjà dans le roster.
            </p>
          </div>

          <!-- PIED DE MODAL -->
          <div class="mt-6 flex justify-end gap-3">
            <button @click="showRosterModal = false"
              class="px-4 py-2 text-sm text-white/50 hover:text-white bg-white/5 rounded-lg transition">
              Fermer
            </button>
            <button @click="saveRoster" :disabled="savingRoster"
              class="px-5 py-2 bg-gold text-black font-black text-sm rounded-lg hover:bg-yellow-400 transition disabled:opacity-50">
              {{ savingRoster ? 'Enregistrement...' : '💾 Sauvegarder Statuts' }}
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
const clans = ref([]);
const loading = ref(true);
const processing = ref(null);
const statusFilter = ref("all");

const showRosterModal = ref(false);
const selectedClan = ref(null);
const rosterPlayers = ref([]);
const availablePlayersList = ref([]);
const selectedUserToAdd = ref(null);
const addAsSubstitute = ref(false);
const addingPlayer = ref(false);
const savingRoster = ref(false);

const tabs = [
  { value: "all", label: "Tous" },
  { value: "pending", label: "En attente" },
  { value: "validated", label: "Validés" },
  { value: "rejected", label: "Refusés" }
];

const getStarters = (clan) => {
  const reg = clan.registrations?.[0];
  return reg?.players?.filter(p => !p.is_substitute) || [];
};
const getSubs = (clan) => {
  const reg = clan.registrations?.[0];
  return reg?.players?.filter(p => p.is_substitute) || [];
};

const openRosterModal = async (clan) => {
  selectedClan.value = clan;
  const reg = clan.registrations?.[0];
  rosterPlayers.value = reg?.players ? JSON.parse(JSON.stringify(reg.players)) : [];
  selectedUserToAdd.value = null;
  showRosterModal.value = true;
  await fetchAvailablePlayers(clan.id);
};

const fetchAvailablePlayers = async (clanId) => {
  try {
    availablePlayersList.value = await $api(`/admin/clans/${clanId}/available-players`);
  } catch (e) {
    console.error("Erreur chargement joueurs disponibles", e);
  }
};

const toggleSubstitute = (player) => {
  player.is_substitute = !player.is_substitute;
};

const removePlayerFromRoster = async (player) => {
  if (!confirm(`Retirer ce joueur du roster ?`)) return;
  try {
    if (player.id) {
      await $api(`/admin/clans/${selectedClan.value.id}/roster/${player.id}`, { method: 'DELETE' });
    }
    rosterPlayers.value = rosterPlayers.value.filter(p => p.id !== player.id);
    // Refresh available players list
    await fetchAvailablePlayers(selectedClan.value.id);
    await fetchClans();
  } catch (e) {
    alert("Erreur lors du retrait du joueur.");
  }
};

const addPlayerToRoster = async () => {
  if (!selectedUserToAdd.value || !selectedClan.value) return;
  addingPlayer.value = true;
  try {
    const res = await $api(`/admin/clans/${selectedClan.value.id}/roster/add`, {
      method: 'POST',
      body: {
        user_id: selectedUserToAdd.value,
        is_substitute: addAsSubstitute.value
      }
    });
    if (res.player) {
      rosterPlayers.value.push(res.player);
    }
    selectedUserToAdd.value = null;
    await fetchAvailablePlayers(selectedClan.value.id);
    await fetchClans();
  } catch (e) {
    alert(e.data?.message || "Erreur lors de l'ajout du joueur.");
  } finally {
    addingPlayer.value = false;
  }
};

const saveRoster = async () => {
  if (!selectedClan.value) return;
  savingRoster.value = true;
  try {
    const payload = {
      players: rosterPlayers.value.map(p => ({
        registration_player_id: p.id,
        is_substitute: p.is_substitute
      }))
    };
    const res = await $api(`/admin/clans/${selectedClan.value.id}/roster`, {
      method: 'PUT', body: payload
    });
    alert(res.message || 'Roster mis à jour !');
    const reg = selectedClan.value.registrations?.[0];
    if (reg) reg.players = rosterPlayers.value;
    showRosterModal.value = false;
    await fetchClans();
  } catch (e) {
    alert("Erreur lors de la sauvegarde du roster.");
  } finally {
    savingRoster.value = false;
  }
};

const fetchClans = async () => {
  loading.value = true;
  try {
    clans.value = await $api("/admin/clans", {
      params: { status: statusFilter.value },
    });
  } catch (e) {
    console.error(e);
  } finally {
    loading.value = false;
  }
};

watch(statusFilter, () => fetchClans());

const approveClan = async (id) => {
  processing.value = id;
  try {
    await $api(`/admin/clans/${id}/validate`, { method: "PUT" });
    const clan = clans.value.find(c => c.id === id);
    if (clan) clan.status = 'validated';
  } catch (e) {
    alert("Erreur lors de la validation.");
  } finally { processing.value = null; }
};

const rejectClan = async (id) => {
  if (!confirm("Refuser cette candidature ?")) return;
  processing.value = id;
  try {
    await $api(`/admin/clans/${id}/reject`, { method: "PUT" });
    const clan = clans.value.find(c => c.id === id);
    if (clan) clan.status = 'rejected';
  } catch (e) {
    alert("Erreur lors du refus.");
  } finally { processing.value = null; }
};

const deleteClan = async (id, name) => {
  if (!confirm(`Voulez-vous vraiment supprimer définitivement le clan ${name} ? Cette action est irréversible.`)) return;
  processing.value = id;
  try {
    await $api(`/admin/clans/${id}`, { method: "DELETE" });
    clans.value = clans.value.filter(c => c.id !== id);
  } catch (e) {
    alert("Erreur lors de la suppression.");
  } finally { processing.value = null; }
};

const getClanCoCLink = (tag) => {
  if (!tag) return '#';
  return `https://link.clashofclans.com/en?action=OpenClanProfile&tag=${encodeURIComponent(tag.replace("#", ""))}`;
};

const translateStatus = (status) => {
  const mapping = { pending: "En attente", validated: "Validé", rejected: "Refusé" };
  return mapping[status] || status;
};

onMounted(fetchClans);
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

.clans-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.clan-moderation-card {
  display: grid;
  grid-template-columns: 1.5fr 1fr 1.2fr 160px;
  align-items: start;
  gap: 24px;
  padding: 24px;
}

.clan-main {
  display: flex;
  align-items: center;
  gap: 16px;
}

.clan-badge-md {
  width: 56px;
  height: 56px;
  object-fit: contain;
}

.level-badge {
  display: inline-block;
  font-size: 0.7rem;
  font-weight: bold;
  padding: 2px 10px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid var(--glass-border);
  border-radius: 4px;
}

.clan-info h3 {
  margin: 0;
  font-family: var(--font-heading);
  font-size: 1.4rem;
}

.status-badge {
  font-size: 0.65rem;
  padding: 2px 8px;
  border-radius: 4px;
  text-transform: uppercase;
  font-weight: bold;
  letter-spacing: 0.5px;
}

.status-badge.pending {
  background: rgba(243, 156, 18, .2);
  color: #f39c12;
  border: 1px solid rgba(243, 156, 18, .4);
}

.status-badge.validated {
  background: rgba(46, 204, 113, .2);
  color: #2ecc71;
  border: 1px solid rgba(46, 204, 113, .4);
}

.status-badge.rejected {
  background: rgba(231, 76, 60, .2);
  color: #e74c3c;
  border: 1px solid rgba(231, 76, 60, .4);
}

.clan-actions {
  display: flex;
  flex-direction: column;
  gap: 8px;
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
  text-transform: uppercase;
  letter-spacing: 0.5px;
  transition: all 0.2s;
}

.btn-action.check {
  background: #10b981;
}

.btn-action.cross {
  background: #ef4444;
}

.btn-action.delete {
  background: rgba(239, 68, 68, .1);
  border: 1px solid rgba(239, 68, 68, .4);
  color: #ff8888;
}

.btn-action.delete:hover {
  background: rgba(239, 68, 68, .3);
}

.btn-action.view {
  background: rgba(255, 255, 255, .08);
  border: 1px solid rgba(255, 255, 255, .2);
  color: white;
  text-decoration: none;
}

.btn-action.view:hover {
  background: rgba(255, 255, 255, .18);
}

.btn-action:hover:not(:disabled) {
  filter: brightness(1.1);
}

.btn-action:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* MODAL */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, .85);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.modal-content {
  padding: 24px;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  border-bottom: 1px solid var(--glass-border);
  padding-bottom: 14px;
}

.modal-header h3 {
  margin: 0;
  font-size: 1.4rem;
}

.btn-close {
  background: transparent;
  border: none;
  font-size: 2rem;
  color: var(--text-muted);
  cursor: pointer;
}

.btn-close:hover {
  color: white;
}

/* Transitions */
.list-enter-active,
.list-leave-active {
  transition: all .3s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity .3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@media (max-width: 900px) {
  .clan-moderation-card {
    grid-template-columns: 1fr 1fr;
    gap: 16px;
  }

  .clan-actions {
    grid-column: 1 / -1;
    flex-direction: row;
    flex-wrap: wrap;
  }
}

@media (max-width: 600px) {
  .clan-moderation-card {
    grid-template-columns: 1fr;
    text-align: center;
  }

  .clan-main {
    justify-content: center;
    flex-direction: column;
  }

  .roster-preview {
    text-align: left;
  }

  .clan-actions {
    flex-direction: column;
  }
}
</style>
