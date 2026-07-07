<template>
  <div class="rankings-page">
    <div class="container-fluid py-10 px-4 lg:px-10">
      <!-- Header Hero -->
      <header class="rankings-header text-center mb-16 animate-float">
        <h1 class="heading text-6xl font-black italic tracking-tighter">
          L'ÉLITE DU <span class="text-gold">CAMEROUN</span> 🇨🇲
        </h1>
        <p
          class="subtitle mt-2 text-xl opacity-60 uppercase tracking-[0.3em] font-light"
        >
          Classement National en Temps Réel
        </p>
      </header>

      <!-- Rankings Filter Bar -->
      <div class="filters-wrapper mb-10">
        <div
          class="filters-bar glass-card p-6 flex flex-wrap gap-6 items-end border-gold/10 shadow-2xl"
        >
          <div class="filter-group flex-1 min-w-[280px]">
            <label
              class="block text-[10px] uppercase tracking-widest text-gold mb-2 font-bold"
              >Rechercher un Guerrier</label
            >
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Tag ou Nom..."
              class="filter-input w-full"
            />
          </div>
          <div class="filter-group w-32">
            <label
              class="block text-[10px] uppercase tracking-widest text-gold mb-2 font-bold"
              >Exp Min.</label
            >
            <input
              v-model.number="minExp"
              type="number"
              placeholder="Min..."
              class="filter-input w-full"
            />
          </div>
          <div class="filter-group flex-1 min-w-[280px]">
            <label
              class="block text-[10px] uppercase tracking-widest text-gold mb-2 font-bold"
              >Palier de Ligue</label
            >
            <select v-model="selectedLeague" class="filter-input w-full">
              <option value="">Tous les paliers</option>
              <option
                v-for="league in availableLeagues"
                :key="league"
                :value="league"
                class="bg-gray-800"
              >
                {{ league }}
              </option>
            </select>
          </div>
          <button @click="resetFilters" class="btn-reset">↺</button>
        </div>
      </div>

      <!-- Content Loader -->
      <div
        v-if="loading"
        class="loader-container py-32 text-center bg-black/20 rounded-3xl"
      >
        <div class="spinner mx-auto mb-6"></div>
        <p
          class="text-gold font-bold tracking-[0.5em] animate-pulse uppercase text-xs"
        >
          Extraction des données...
        </p>
      </div>

      <!-- Rankings Content (Empty State) -->
      <div
        v-else-if="filteredPlayers.length === 0"
        class="empty-state py-32 text-center bg-black/20 rounded-3xl border border-white/5"
      >
        <div class="text-6xl mb-6">🛡️</div>
        <p class="opacity-40 text-xl font-black uppercase tracking-widest">
          Aucun guerrier identifié
        </p>
        <button @click="resetFilters" class="mt-8 btn-premium btn-sm">
          Réinitialiser les filtres
        </button>
      </div>

      <!-- Rankings Content (Data) -->
      <div v-else class="rankings-content">
        <!-- Desktop/Tablet View (Table) -->
        <div
          class="hidden sm:block rankings-container shadow-2xl border border-white/5 overflow-hidden rounded-3xl"
        >
          <div class="table-responsive">
            <table class="rankings-table w-full">
              <thead>
                <tr
                  class="text-gold text-[11px] uppercase tracking-[0.25em] font-black border-b border-white/10 text-left"
                >
                  <th class="p-6 w-24 text-center">Rang</th>
                  <th class="p-6 w-24 text-center hidden md:table-cell">
                    Ligue
                  </th>
                  <th class="p-6">Guerrier</th>
                  <th class="p-6 w-32 text-center hidden md:table-cell">Exp</th>
                  <th class="p-6 text-right w-48">Trophées</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="player in filteredPlayers"
                  :key="player.tag"
                  class="rank-row transition-all duration-300 border-b border-white/5 hover:bg-white/5"
                  :class="{
                    'gold-tier': player.rank === 1,
                    'silver-tier': player.rank === 2,
                    'bronze-tier': player.rank === 3,
                  }"
                >
                  <td class="p-6 text-center">
                    <span class="rank-id" :class="getRankClass(player.rank)">{{
                      player.rank
                    }}</span>
                  </td>
                  <td class="p-6 text-center hidden md:table-cell">
                    <div class="relative inline-block">
                      <img
                        v-if="player.leagueTier"
                        :src="player.leagueTier.iconUrls.small"
                        class="tier-icon"
                      />
                      <img
                        v-else-if="player.league"
                        :src="player.league.iconUrls.tiny"
                        class="tier-icon"
                      />
                      <!-- Legend Tier Numeral Overlay -->
                      <div
                        v-if="getTierNumeral(player)"
                        class="tier-numeral-overlay"
                      >
                        {{ getTierNumeral(player) }}
                      </div>
                    </div>
                  </td>
                  <td class="p-6">
                    <div
                      class="name text-xl font-black text-white flex items-center gap-2"
                    >
                      {{ player.name }}
                      <LucideCrown v-if="player.rank <= 3" :size="20" class="inline crown text-yellow-500" />
                    </div>
                  </td>
                  <td class="p-6 text-center hidden md:table-cell">
                    <div class="xp-badge">{{ player.expLevel }}</div>
                  </td>
                  <td class="p-6 text-center ">
                    <!-- <div class="trophy-meta inline-flex items-center gap-2"> -->
                    <span
                      class="trophy-val text-xl font-black italic tracking-tighter"
                      >{{ player.trophies }}</span
                    >
                    <!-- </div> -->
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Mobile View (Ultra-Minimalist Cards) -->
        <div class="sm:hidden flex flex-col gap-3">
          <div
            v-for="player in filteredPlayers"
            :key="player.tag"
            class="mobile-player-card glass-card border-white/5 flex items-center p-3 gap-4"
            :class="{
              'gold-line': player.rank === 1,
              'silver-line': player.rank === 2,
              'bronze-line': player.rank === 3,
            }"
          >
            <!-- Rank & Badge -->
            <div class="relative w-12 flex flex-col items-center gap-1.5">
              <span class="rank-id-mobile" :class="getRankClass(player.rank)">{{
                player.rank
              }}</span>
              <div class="relative">
                <img
                  v-if="player.leagueTier"
                  :src="player.leagueTier.iconUrls.small"
                  class="w-8 h-8 object-contain opacity-80"
                />
                <div
                  v-if="getTierNumeral(player)"
                  class="absolute -bottom-1 -right-1 text- text-[7px] font-black px-1 rounded-full"
                >
                  {{ getTierNumeral(player) }}
                </div>
              </div>
            </div>

          <div class="flex-1 min-w-0">
              <!-- Nom sans truncate -->
              <div class="text-white font-black text-lg leading-tight break-words">
                {{ player.name }}
                <LucideCrown v-if="player.rank <= 3" :size="18" class="inline text-sm text-yellow-500" />
              </div>
              <!-- Infos en dessous : exp + score -->
              <div class="flex items-center justify-between mt-1">
                <span class="text-[10px] font-bold text-white/40 uppercase tracking-widest">
                  Exp {{ player.expLevel }}
                </span>
                <span class="text-white font-black text-base italic tracking-tighter">
                  Pts: {{ player.trophies }}
                </span>
              </div>
              <div class="text-[9px] font-bold text-gold opacity-50 uppercase tracking-tighter text-right">
                National Rank
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const { $api } = useNuxtApp();
const players = ref([]);
const loading = ref(false);

useHead({
  title: "L'Elite du Cameroun — Trophées & Rang National | CCA 🇨🇲",
  meta: [
    {
      name: "description",
      content:
        "Classement en temps réel des meilleurs joueurs Clash of Clans du Cameroun. Découvrez les champions nationaux et les guerriers légendes.",
    },
    {
      name: "keywords",
      content:
        "meilleurs joueurs cameroun, clasheur camerounais, elite cameroun, coc cameroun, trophées clash of clans, clasher, cca",
    },
    {
      property: "og:title",
      content: "L'Elite du Cameroun — Classement Individuel Coc | CCA 👑",
    },
    {
      property: "og:description",
      content:
        "Découvrez qui est au sommet du classement national en trophées.",
    },
    {
      property: "og:image",
      content: "/images/cca-affiche1.png",
    },
  ],
});

const searchQuery = ref("");
const minExp = ref(null);
const selectedLeague = ref("");

const filteredPlayers = computed(() => {
  return players.value.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      p.tag.toLowerCase().includes(searchQuery.value.toLowerCase());
    const matchesExp = !minExp.value || p.expLevel >= minExp.value;
    const matchesLeague =
      !selectedLeague.value ||
      (p.leagueTier && p.leagueTier.name === selectedLeague.value) ||
      (p.league && p.league.name === selectedLeague.value);

    return matchesSearch && matchesExp && matchesLeague;
  });
});

const availableLeagues = computed(() => {
  const leagues = players.value
    .map((p) => p.leagueTier?.name || p.league?.name)
    .filter(Boolean);
  return [...new Set(leagues)].sort();
});

const fetchRankings = async () => {
  loading.value = true;
  try {
    const data = await $api("/players/cameroun");
    players.value = data.items || [];
  } catch (e) {
    console.error("Error fetching rankings:", e);
  } finally {
    loading.value = false;
  }
};

const getRankClass = (rank) => {
  if (rank === 1) return "rank-gold";
  if (rank === 2) return "rank-silver";
  if (rank === 3) return "rank-bronze";
  return "";
};

const getTierNumeral = (player) => {
  const leagueName = player.leagueTier?.name || player.league?.name || "";
  if (!leagueName.toLowerCase().includes("legend")) return null;

  // Extract I, II, or III from strings like "Legend League III"
  if (leagueName.endsWith(" III")) return "III";
  if (leagueName.endsWith(" II")) return "II";
  if (leagueName.endsWith(" I")) return "I";

  return null;
};

const resetFilters = () => {
  searchQuery.value = "";
  minExp.value = null;
  selectedLeague.value = "";
};

onMounted(fetchRankings);
</script>

<style scoped>
.rankings-page {
  background:
    radial-gradient(
      circle at 50% 0%,
      rgba(212, 175, 55, 0.1) 0%,
      transparent 50%
    ),
    linear-gradient(to bottom, transparent, rgba(0, 0, 0, 0.4));
  min-height: 100vh;
}

.rankings-container {
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(20px);
}

.rank-id,
.rank-id-mobile {
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.03);
  font-weight: 900;
  color: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.05);
  transition: all 0.3s ease;
}

.rank-id {
  width: 48px;
  height: 48px;
  font-size: 1.2rem;
}
.rank-id-mobile {
  width: 34px;
  height: 34px;
  font-size: 0.9rem;
  border-radius: 10px;
}

.rank-gold {
  background: linear-gradient(135deg, #ffd700, #ff8c00);
  color: #000 !important;
  border: none;
  box-shadow: 0 0 30px rgba(255, 215, 0, 0.3);
}
.rank-silver {
  background: linear-gradient(135deg, #f0f0f0, #999);
  color: #000 !important;
  border: none;
}
.rank-bronze {
  background: linear-gradient(135deg, #cd7f32, #704214);
  color: #fff !important;
  border: none;
}

.gold-tier {
  background: linear-gradient(90deg, rgba(212, 175, 55, 0.1), transparent);
}
.silver-tier {
  background: linear-gradient(90deg, rgba(255, 255, 255, 0.05), transparent);
}
.bronze-tier {
  background: linear-gradient(90deg, rgba(205, 127, 50, 0.05), transparent);
}

.mobile-player-card {
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(10px);
  border-radius: 14px;
}

.gold-line {
  border-left: 3px solid #ffd700;
  background: linear-gradient(90deg, rgba(255, 215, 0, 0.08), transparent);
}
.silver-line {
  border-left: 3px solid #f0f0f0;
}
.bronze-line {
  border-left: 3px solid #cd7f32;
}

.tier-icon {
  width: 50px;
  height: 50px;
  object-fit: contain;
  filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.6));
}

.tier-numeral-overlay {
  position: absolute;
  bottom: -5px;
  right: -5px;
  background: var(--secondary);
  color: #000;
  font-size: 10px;
  font-weight: 900;
  padding: 1px 6px;
  border-radius: 4px;
  border: 1px solid rgba(0, 0, 0, 0.2);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
}

.xp-badge {
  display: inline-block;
  padding: 6px 14px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 100px;
  font-weight: 800;
  font-size: 0.9rem;
}

.trophy-val {
  background: linear-gradient(to bottom, #fff, #999);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.filter-input {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  padding: 14px 18px;
  color: #fff;
  transition: all 0.3s ease;
}

.filter-input:focus {
  border-color: var(--primary);
  background: rgba(255, 255, 255, 0.08);
  box-shadow: 0 0 20px rgba(212, 175, 55, 0.1);
}

.btn-reset {
  width: 52px;
  height: 52px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  color: var(--primary);
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.btn-reset:hover {
  background: var(--primary);
  color: #000;
  transform: rotate(180deg);
}

.spinner {
  width: 60px;
  height: 60px;
  border: 4px solid rgba(255, 255, 255, 0.03);
  border-top-color: var(--primary);
  border-radius: 50%;
  animation: spin 0.8s cubic-bezier(0.4, 0, 0.2, 1) infinite;
}
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
@keyframes float {
  0% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-15px);
  }
  100% {
    transform: translateY(0px);
  }
}
.animate-float {
  animation: float 8s ease-in-out infinite;
}

@media (max-width: 640px) {
  .heading {
    font-size: 2.2rem;
    line-height: 1;
  }
  .filters-bar {
    padding: 20px;
  }
  .filter-input {
    padding: 12px;
    font-size: 0.9rem;
  }
}
</style>
