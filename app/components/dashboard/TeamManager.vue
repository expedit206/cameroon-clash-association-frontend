<template>
  <div class="team-manager">
    <div class="glass-card mb-6">
      <h3 class="text-gold mb-2">Phase 2 : Composition de l'Équipe</h3>
      <p class="text-sm text-muted">
        Choisissez 5 titulaires (HDV 14 à 18) et jusqu'à 5 remplaçants (HDV
        14+). Tous les joueurs doivent être dans votre clan CoC.
      </p>
    </div>

    <div class="manager-grid">
      <!-- Liste des membres du clan -->
      <div class="members-list glass-card">
        <div class="header-row">
          <h4>Membres du Clan</h4>
          <input
            v-model="search"
            type="text"
            placeholder="Rechercher..."
            class="search-input"
          />
        </div>

        <div v-if="loadingMembers" class="loader-placeholder">
          <div class="spinner-sm"></div>
          Chargement des guerriers...
        </div>

        <div v-else class="members-scroll">
          <div
            v-for="member in filteredMembers"
            :key="member.tag"
            class="member-item"
            :class="{ selected: isSelected(member.tag) }"
            @click="addPlayer(member)"
          >
            <div class="member-info">
              <span class="member-name">{{ member.name }}</span>
              <span class="member-tag">{{ member.tag }}</span>
            </div>
            <div class="member-role">{{ formatRole(member.role) }}</div>
            <button class="btn-add" v-if="!isSelected(member.tag)">+</button>
          </div>
        </div>
      </div>

      <!-- Roster actuel -->
      <div class="roster-selection">
        <h4 class="mb-4">Votre Composition ({{ roster.length }}/10)</h4>

        <div class="roster-list">
          <!-- Slots Titulaires -->
          <div
            v-for="hdv in [18, 17, 16, 15, 14]"
            :key="hdv"
            class="roster-slot starter"
          >
            <div class="slot-header">
              <span class="slot-badge">HDV {{ hdv }}</span>
              <span class="slot-type">Titulaire</span>
            </div>
            <div v-if="getStarterAt(hdv)" class="selected-player">
              <div class="player-details">
                <span class="name text-gold">{{ getStarterAt(hdv).name }}</span>
                <span class="tag">{{ getStarterAt(hdv).tag_coc }}</span>
              </div>
              <button
                class="btn-remove"
                @click="removePlayer(getStarterAt(hdv).tag_coc)"
              >
                &times;
              </button>
            </div>
            <div v-else class="empty-slot">Emplacement vide</div>
          </div>

          <!-- Slots Remplaçants -->
          <div v-for="i in 5" :key="'sub-' + i" class="roster-slot substitute">
            <div class="slot-header">
              <span class="slot-badge sub">Remplaçant</span>
            </div>
            <div v-if="getSubAt(i - 1)" class="selected-player">
              <div class="player-details">
                <span class="name">{{ getSubAt(i - 1).name }}</span>
                <span class="tag">{{ getSubAt(i - 1).tag_coc }}</span>
                <select v-model="getSubAt(i - 1).hdv_level" class="hdv-select">
                  <option v-for="h in [14, 15, 16, 17, 18]" :key="h" :value="h">
                    HDV {{ h }}
                  </option>
                </select>
              </div>
              <button
                class="btn-remove"
                @click="removePlayer(getSubAt(i - 1).tag_coc)"
              >
                &times;
              </button>
            </div>
            <div v-else class="empty-slot">Libre</div>
          </div>
        </div>

        <button
          class="btn-premium btn-primary w-full mt-6"
          :disabled="!isReady || submitting"
          @click="submitRoster"
        >
          {{ submitting ? "Enregistrement..." : "Confirmer la Composition" }}
        </button>
        <p v-if="!isReady" class="text-xs text-center mt-2 text-muted">
          Vous devez remplir tous les postes de titulaires avant de valider.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  competitionId: { type: [Number, String], required: true },
});
const emit = defineEmits(["saved"]);

const { $api } = useNuxtApp();
const search = ref("");
const members = ref([]);
const loadingMembers = ref(true);
const roster = ref([]);
const submitting = ref(false);

const filteredMembers = computed(() => {
  if (!search.value) return members.value;
  const q = search.value.toLowerCase();
  return members.value.filter(
    (m) => m.name.toLowerCase().includes(q) || m.tag.toLowerCase().includes(q),
  );
});

const isSelected = (tag) => roster.value.some((p) => p.tag_coc === tag);

const getStarterAt = (hdv) =>
  roster.value.find((p) => !p.is_substitute && p.hdv_level === hdv);
const getSubAt = (index) => roster.value.filter((p) => p.is_substitute)[index];

const isReady = computed(() => {
  const starters = [14, 15, 16, 17, 18].every((hdv) => getStarterAt(hdv));
  return starters;
});

const fetchMembers = async () => {
  try {
    const data = await $api(
      `/competitions/${props.competitionId}/registration/eligible-members`,
    );
    members.value = Array.isArray(data) ? data : [];
  } catch (e) {
    console.error(e);
  } finally {
    loadingMembers.value = false;
  }
};

const addPlayer = (member) => {
  if (isSelected(member.tag)) return;
  if (roster.value.length >= 10) {
    alert("Maximum 10 joueurs autorisés.");
    return;
  }

  // Logique d'attribution intelligente
  // On regarde s'il y a un slot titulaire vide pour son HDV (si on avait l'info HDV)
  // Comme on n'a pas le HDV via l'API members, on demande (ou on met par défaut)
  // Pour la simulation et facilité d'usage, on va ouvrir un petit prompt ou juste l'ajouter en sub par défaut

  const hdv = prompt(`Niveau HDV de ${member.name} (14-18) ?`, "14");
  if (!hdv || isNaN(hdv) || hdv < 14 || hdv > 18) {
    alert("Niveau HDV invalide (14 à 18 requis).");
    return;
  }

  const hdvNum = parseInt(hdv);
  const isSub = getStarterAt(hdvNum) ? true : false;

  if (isSub && roster.value.filter((p) => p.is_substitute).length >= 5) {
    alert("Maximum 5 remplaçants autorisés.");
    return;
  }

  roster.value.push({
    tag_coc: member.tag,
    name: member.name,
    hdv_level: hdvNum,
    is_substitute: isSub,
  });
};

const removePlayer = (tag) => {
  roster.value = roster.value.filter((p) => p.tag_coc !== tag);
};

const formatRole = (role) => {
  const map = {
    leader: "Chef",
    coLeader: "Sous-chef",
    admin: "Aîné",
    member: "Membre",
  };
  return map[role] || role;
};

const submitRoster = async () => {
  submitting.value = true;
  try {
    await $api(`/competitions/${props.competitionId}/register-team`, {
      method: "POST",
      body: { players: roster.value },
    });
    alert("Composition enregistrée avec succès !");
    emit("saved");
  } catch (e) {
    alert(e.data?.message || "Erreur lors de l'enregistrement.");
  } finally {
    submitting.value = false;
  }
};

onMounted(fetchMembers);
</script>

<style scoped>
.manager-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
}

.members-list {
  display: flex;
  flex-direction: column;
  height: 600px;
}

.header-row {
  padding-bottom: 15px;
  border-bottom: 1px solid var(--glass-border);
  margin-bottom: 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.search-input {
  width: 180px;
  padding: 6px 12px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--glass-border);
  color: white;
  border-radius: 6px;
  font-size: 0.8rem;
}

.members-scroll {
  overflow-y: auto;
  flex: 1;
}

.member-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 15px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  cursor: pointer;
  transition: background 0.2s;
}

.member-item:hover {
  background: rgba(255, 255, 255, 0.05);
}

.member-item.selected {
  opacity: 0.4;
  pointer-events: none;
}

.member-info {
  display: flex;
  flex-direction: column;
}

.member-name {
  font-weight: bold;
  font-size: 0.9rem;
}
.member-tag {
  font-size: 0.7rem;
  color: var(--text-muted);
}
.member-role {
  font-size: 0.8rem;
  color: var(--primary);
}

.btn-add {
  background: var(--bg-dark);
  border: 1px solid var(--primary);
  color: var(--primary);
  width: 24px;
  height: 24px;
  border-radius: 4px;
  cursor: pointer;
}

.roster-selection {
  display: flex;
  flex-direction: column;
}

.roster-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.roster-slot {
  background: rgba(0, 0, 0, 0.2);
  border: 1px dashed var(--glass-border);
  border-radius: 8px;
  padding: 12px;
  min-height: 60px;
  position: relative;
}

.roster-slot.starter {
  border-style: solid;
  border-color: rgba(187, 0, 255, 0.2);
}

.slot-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 5px;
}

.slot-badge {
  font-size: 0.65rem;
  font-weight: bold;
  padding: 2px 6px;
  background: var(--primary);
  color: white;
  border-radius: 4px;
  text-transform: uppercase;
}

.slot-badge.sub {
  background: #64748b;
}

.slot-type {
  font-size: 0.7rem;
  color: var(--text-muted);
}

.empty-slot {
  color: var(--text-muted);
  font-size: 0.8rem;
  font-style: italic;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 30px;
}

.selected-player {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.player-details {
  display: flex;
  flex-direction: column;
}

.player-details .name {
  font-weight: bold;
  font-size: 0.9rem;
}
.player-details .tag {
  font-size: 0.7rem;
  color: var(--text-muted);
}

.hdv-select {
  margin-top: 5px;
  background: transparent;
  border: 1px solid var(--glass-border);
  color: white;
  font-size: 0.7rem;
  padding: 2px;
  border-radius: 4px;
}

.btn-remove {
  background: transparent;
  border: none;
  color: #ff4b4b;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 0 5px;
}

.loader-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 200px;
  color: var(--text-muted);
  gap: 15px;
}

.spinner-sm {
  width: 24px;
  height: 24px;
  border: 2px solid var(--glass-border);
  border-top-color: var(--primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@media (max-width: 1100px) {
  .manager-grid {
    grid-template-columns: 1fr;
  }
}
</style>
