<template>
  <div class="admin-tournaments-page min-h-screen pb-20">
    <div class="container mx-auto px-4 py-10">
      <!-- Header -->
      <div
        class="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12"
      >
        <div>
          <NuxtLink
            to="/admin/dashboard"
            class="text-xs uppercase tracking-widest text-white/40 hover:text-gold mb-2 block"
            >← Dashboard</NuxtLink
          >
          <h1 class="text-4xl font-black italic tracking-tighter uppercase">
            Gestion du <span class="text-gold">Tournoi</span>
          </h1>
          <p class="text-white/40 text-sm mt-1 uppercase tracking-widest">
            Saisie des résultats & Bracket
          </p>
        </div>

        <div class="flex gap-4">
          <button
            @click="onGenerateBracket"
            class="btn-premium !bg-white/5 !text-white border border-white/10 hover:!bg-white/10 px-6 py-3 rounded-xl font-bold uppercase tracking-widest text-[10px]"
            :disabled="generating"
          >
            {{ generating ? "Génération..." : "⚡ Générer Bracket (T16)" }}
          </button>
        </div>
      </div>

      <!-- Rounds Navigation -->
      <div
        class="flex items-center gap-2 mb-8 bg-white/5 p-1 rounded-2xl w-fit mx-auto border border-white/5"
      >
        <button
          v-for="r in [1, 2, 3, 4]"
          :key="r"
          @click="currentRound = r"
          class="px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
          :class="
            currentRound === r
              ? 'bg-gold text-black shadow-lg shadow-gold/20'
              : 'text-white/40 hover:text-white'
          "
        >
          {{ getRoundName(r) }}
        </button>
      </div>

      <!-- Loader -->
      <div v-if="loading" class="py-20 text-center">
        <div class="spinner-sm mx-auto mb-4"></div>
        <p
          class="text-[10px] uppercase font-black tracking-widest text-white/20"
        >
          Chargement des matches...
        </p>
      </div>

      <!-- Matches Grid -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="match in filteredMatches"
          :key="match.id"
          class="match-admin-card glass-card !p-5 border-white/5 hover:border-gold/20 transition-all cursor-pointer"
          @click="openMatchModal(match)"
        >
          <div class="flex items-center justify-between mb-4">
            <span
              class="text-[9px] font-black uppercase tracking-widest text-white/20"
              >Match #{{ match.match_number }}</span
            >
            <span class="status-badge" :class="`status-${match.status}`">{{
              match.status
            }}</span>
          </div>

          <div class="space-y-4">
            <div
              class="flex items-center justify-between p-3 rounded-xl bg-white/3 border border-white/5"
              :class="
                match.winner_clan_id === match.clan_home_id
                  ? 'border-gold/30 bg-gold/5'
                  : ''
              "
            >
              <div class="flex items-center gap-3">
                <img
                  :src="match.clan_home?.badge_url"
                  class="w-8 h-8 object-contain"
                />
                <span class="font-bold text-sm truncate w-32">{{
                  match.clan_home?.name || "TBD"
                }}</span>
              </div>
              <div
                class="text-xl font-black"
                :class="
                  match.winner_clan_id === match.clan_home_id
                    ? 'text-gold'
                    : 'text-white/40'
                "
              >
                {{ match.total_stars_home }}
              </div>
            </div>

            <div
              class="text-center text-[10px] font-black italic opacity-20 py-1"
            >
              VS
            </div>

            <div
              class="flex items-center justify-between p-3 rounded-xl bg-white/3 border border-white/5"
              :class="
                match.winner_clan_id === match.clan_away_id
                  ? 'border-gold/30 bg-gold/5'
                  : ''
              "
            >
              <div class="flex items-center gap-3">
                <img
                  :src="match.clan_away?.badge_url"
                  class="w-8 h-8 object-contain"
                />
                <span class="font-bold text-sm truncate w-32">{{
                  match.clan_away?.name || "TBD"
                }}</span>
              </div>
              <div
                class="text-xl font-black"
                :class="
                  match.winner_clan_id === match.clan_away_id
                    ? 'text-gold'
                    : 'text-white/40'
                "
              >
                {{ match.total_stars_away }}
              </div>
            </div>
          </div>

          <div
            class="mt-6 pt-4 border-t border-white/5 flex justify-between items-center"
          >
            <div class="text-[9px] uppercase tracking-widest text-white/20">
              Destruction :
              <span class="text-white"
                >{{ match.total_destruction_home }} % vs
                {{ match.total_destruction_away }} %</span
              >
            </div>
            <button
              class="text-gold text-[10px] font-black uppercase tracking-widest hover:underline"
            >
              Modifier
            </button>
          </div>
        </div>
      </div>

      <!-- No matches -->
      <div
        v-if="!loading && filteredMatches.length === 0"
        class="py-20 text-center opacity-30"
      >
        <div class="text-5xl mb-4">😶🌫️</div>
        <p class="uppercase font-black tracking-widest text-sm">
          Aucun match dans ce round
        </p>
      </div>
    </div>

    <!-- Match Edit Modal Overlay -->
    <div
      v-if="selectedMatch"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
    >
      <div
        class="glass-card w-full max-w-lg p-8 animate-in shadow-2xl border-white/10"
      >
        <div class="flex justify-between items-start mb-8">
          <div>
            <h3 class="text-2xl font-black italic uppercase tracking-tighter">
              Saisie <span class="text-gold">Résultats</span>
            </h3>
            <p class="text-[10px] uppercase tracking-widest text-white/40 mt-1">
              Match #{{ selectedMatch.match_number }} —
              {{ getRoundName(selectedMatch.round) }}
            </p>
          </div>
          <button
            @click="selectedMatch = null"
            class="text-white/40 hover:text-white transition-colors text-xl"
          >
            ✕
          </button>
        </div>

        <form @submit.prevent="onSaveMatch" class="space-y-8">
          <div class="grid grid-cols-2 gap-8">
            <!-- Home -->
            <div class="space-y-4">
              <div class="flex flex-col items-center gap-2 mb-4">
                <img
                  :src="selectedMatch.clan_home?.badge_url"
                  class="w-12 h-12 object-contain"
                />
                <span
                  class="font-black text-xs text-center uppercase truncate w-full tracking-wider"
                  >{{ selectedMatch.clan_home?.name }}</span
                >
              </div>
              <div>
                <label
                  class="text-[9px] font-black uppercase tracking-widest text-white/40 block mb-2"
                  >Étoiles ⭐️</label
                >
                <input
                  v-model="editForm.total_stars_home"
                  type="number"
                  min="0"
                  max="15"
                  class="admin-input"
                />
              </div>
              <div>
                <label
                  class="text-[9px] font-black uppercase tracking-widest text-white/40 block mb-2"
                  >Destruction %</label
                >
                <input
                  v-model="editForm.total_destruction_home"
                  type="number"
                  step="0.01"
                  min="0"
                  max="100"
                  class="admin-input"
                />
              </div>
            </div>

            <!-- Away -->
            <div class="space-y-4">
              <div class="flex flex-col items-center gap-2 mb-4">
                <img
                  :src="selectedMatch.clan_away?.badge_url"
                  class="w-12 h-12 object-contain"
                />
                <span
                  class="font-black text-xs text-center uppercase truncate w-full tracking-wider"
                  >{{ selectedMatch.clan_away?.name }}</span
                >
              </div>
              <div>
                <label
                  class="text-[9px] font-black uppercase tracking-widest text-white/40 block mb-2"
                  >Étoiles ⭐️</label
                >
                <input
                  v-model="editForm.total_stars_away"
                  type="number"
                  min="0"
                  max="15"
                  class="admin-input"
                />
              </div>
              <div>
                <label
                  class="text-[9px] font-black uppercase tracking-widest text-white/40 block mb-2"
                  >Destruction %</label
                >
                <input
                  v-model="editForm.total_destruction_away"
                  type="number"
                  step="0.01"
                  min="0"
                  max="100"
                  class="admin-input"
                />
              </div>
            </div>
          </div>

          <div class="pt-6 border-t border-white/5">
            <label
              class="text-[9px] font-black uppercase tracking-widest text-white/40 block mb-3 text-center"
              >Status du match</label
            >
            <div class="flex gap-2">
              <button
                v-for="s in [
                  'scheduled',
                  'in_progress',
                  'completed',
                  'forfeit',
                ]"
                :key="s"
                type="button"
                @click="editForm.status = s"
                class="flex-1 py-3 rounded-xl border border-white/5 text-[9px] font-black uppercase tracking-widest transition-all"
                :class="
                  editForm.status === s
                    ? 'bg-gold text-black'
                    : 'bg-white/3 text-white/40'
                "
              >
                {{ s }}
              </button>
            </div>
          </div>

          <button
            type="submit"
            class="btn-premium w-full !rounded-2xl py-4 font-black uppercase tracking-widest text-sm flex items-center justify-center gap-2"
            :disabled="saving"
          >
            <span v-if="saving" class="spinner-xs"></span>
            <span v-else>💾 Enregistrer les Résultats</span>
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
const { $api } = useNuxtApp();
const matches = ref([]);
const loading = ref(true);
const currentRound = ref(1);
const generating = ref(false);
const saving = ref(false);

const selectedMatch = ref(null);
const editForm = ref({
  total_stars_home: 0,
  total_stars_away: 0,
  total_destruction_home: 0,
  total_destruction_away: 0,
  status: "scheduled",
});

const COMPETITION_ID = 1;

const filteredMatches = computed(() => {
  return matches.value.filter((m) => m.round === currentRound.value);
});

const getRoundName = (r) => {
  return ["8èmes", "Quarts", "Demis", "Finale"][r - 1];
};

const fetchMatches = async () => {
  loading.value = true;
  try {
    matches.value = await $api(`/admin/competitions/${COMPETITION_ID}/matches`);
  } catch (e) {
    console.error(e);
  } finally {
    loading.value = false;
  }
};

const onGenerateBracket = async () => {
  if (
    !confirm(
      "Cela effacera le bracket actuel et en générera un nouveau. Continuer ?",
    )
  )
    return;
  generating.value = true;
  try {
    await $api(`/admin/competitions/${COMPETITION_ID}/generate-bracket`, {
      method: "POST",
    });
    alert("Bracket généré !");
    await fetchMatches();
  } catch (e) {
    alert(e.data?.message || "Erreur lors de la génération");
  } finally {
    generating.value = false;
  }
};

const openMatchModal = (match) => {
  if (!match.clan_home_id || !match.clan_away_id) return;
  selectedMatch.value = match;
  editForm.value = {
    total_stars_home: match.total_stars_home,
    total_stars_away: match.total_stars_away,
    total_destruction_home: match.total_destruction_home,
    total_destruction_away: match.total_destruction_away,
    status: match.status,
  };
};

const onSaveMatch = async () => {
  saving.value = true;
  try {
    await $api(`/admin/matches/${selectedMatch.value.id}`, {
      method: "PUT",
      body: editForm.value,
    });
    alert("Match mis à jour !");
    selectedMatch.value = null;
    await fetchMatches();
  } catch (e) {
    alert(e.data?.message || "Erreur lors de la sauvegarde");
  } finally {
    saving.value = false;
  }
};

onMounted(fetchMatches);
</script>

<style scoped>
.admin-tournaments-page {
  background: radial-gradient(
    circle at 100% 0%,
    rgba(212, 175, 55, 0.1) 0%,
    transparent 40%
  );
}

.admin-input {
  width: 100%;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 12px;
  color: white;
  font-weight: 900;
  font-size: 1.2rem;
  text-align: center;
  transition: all 0.2s;
}

.admin-input:focus {
  outline: none;
  border-color: var(--gold);
  background: rgba(212, 175, 55, 0.05);
}

.status-badge {
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 9px;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  background: rgba(255, 255, 255, 0.05);
  color: white;
}

.status-completed {
  background: rgba(74, 222, 128, 0.15);
  color: #4ade80;
}
.status-in_progress {
  background: rgba(212, 175, 55, 0.15);
  color: #ffd700;
}
.status-scheduled {
  background: rgba(255, 255, 255, 0.05);
  color: rgba(255, 255, 255, 0.4);
}

.spinner-sm {
  width: 30px;
  height: 30px;
  border: 2px solid rgba(255, 255, 255, 0.03);
  border-top-color: var(--primary);
  border-radius: 50%;
  animation: spin 0.8s infinite linear;
}
.spinner-xs {
  width: 16px;
  height: 16px;
  border: 2px solid transparent;
  border-top-color: black;
  border-radius: 50%;
  animation: spin 0.6s infinite linear;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
@keyframes animateIn {
  from {
    opacity: 0;
    transform: scale(0.95) translateY(10px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.animate-in {
  animation: animateIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
</style>
