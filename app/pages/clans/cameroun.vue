<template>
  <div class="discovery-page">
    <div class="container-fluid py-10 px-4 lg:px-10">
      <!-- Header Hero -->
      <header class="discovery-header text-center mb-12 animate-float">
        <div class="inline-block px-4 py-1.5 rounded-full bg-gold/10 border border-gold/30 text-gold text-xs font-black tracking-widest uppercase mb-4">
          🏆 SAISON 1 — CCA NATIONAL LEAGUE
        </div>
        <h1 class="heading text-4xl sm:text-6xl font-black italic tracking-tighter">
          CLASSEMENT DES <span class="text-gold">CLANS</span> 🇨🇲
        </h1>
        <p class="subtitle mt-2 text-sm sm:text-xl opacity-60 uppercase tracking-[0.2em] font-light">
          Classement Officiel basé sur les Performances en Tournoi
        </p>
      </header>

      <!-- Filters Bar -->
      <div class="filters-wrapper mb-10">
        <div class="filters-bar glass-card p-4 sm:p-6 flex flex-wrap gap-4 items-end border-gold/10 shadow-2xl">
          <div class="filter-group flex-1 min-w-[220px]">
            <label class="block text-[10px] uppercase tracking-widest text-gold mb-2 font-bold">
              Rechercher un Clan
            </label>
            <input
              v-model="filters.name"
              type="text"
              placeholder="Nom ou tag du clan..."
              class="filter-input w-full"
              @input="handleSearch"
            />
          </div>
          <div class="filter-group w-40">
            <label class="block text-[10px] uppercase tracking-widest text-gold mb-2 font-bold">
              Groupe
            </label>
            <select
              v-model="filters.group"
              class="filter-input w-full"
              @change="fetchClans"
            >
              <option value="">Tous les Groupes</option>
              <option value="A">Groupe A</option>
              <option value="B">Groupe B</option>
            </select>
          </div>
          <button @click="resetFilters" class="btn-reset" title="Réinitialiser">↺</button>
        </div>
      </div>

      <!-- Clans Content -->
      <div v-if="loading && clans.length === 0" class="loader-container py-32 text-center bg-black/20 rounded-3xl">
        <div class="spinner mx-auto mb-6"></div>
        <p class="text-gold font-bold tracking-[0.5em] animate-pulse uppercase text-xs">
          Calcul du classement officiel...
        </p>
      </div>

      <div v-else-if="clans.length === 0" class="empty-state py-32 text-center bg-black/20 rounded-3xl border border-white/5">
        <div class="text-6xl mb-6">🛡️</div>
        <p class="opacity-40 text-xl font-black uppercase tracking-widest">
          Aucun clan ne correspond aux critères
        </p>
        <button @click="resetFilters" class="mt-8 btn-premium btn-sm">
          Réinitialiser les filtres
        </button>
      </div>

      <div v-else class="clans-results">
        <!-- Desktop/Tablet Table View -->
        <div class="hidden md:block clans-container shadow-2xl border border-white/5 overflow-hidden rounded-3xl">
          <div class="table-responsive">
            <table class="clans-table w-full">
              <thead>
                <tr class="text-gold text-[11px] uppercase tracking-[0.25em] font-black border-b border-white/10 text-left">
                  <th class="p-5 w-16 text-center">Rang</th>
                  <th class="p-5 w-20 text-center">Blason</th>
                  <th class="p-5">Clan</th>
                  <th class="p-5 text-center">Groupe</th>
                  <th class="p-5 text-center">Bilan (V-N-D)</th>
                  <th class="p-5 text-center">Étoiles</th>
                  <th class="p-5 text-center">% Destruction</th>
                  <th class="p-5 text-right w-36">Points CCA</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="clan in clans"
                  :key="clan.tag"
                  class="clan-row transition-all duration-300 border-b border-white/5 hover:bg-white/5 cursor-pointer"
                  @click="navigateToClan(clan.tag)"
                >
                  <!-- Rang -->
                  <td class="p-5 text-center">
                    <span
                      class="rank-number font-black text-lg"
                      :class="{
                        'text-gold font-extrabold text-xl': clan.rank === 1,
                        'text-gray-300': clan.rank === 2,
                        'text-amber-600': clan.rank === 3,
                        'text-white/40': clan.rank > 3
                      }"
                    >
                      #{{ clan.rank }}
                    </span>
                  </td>

                  <!-- Blason -->
                  <td class="p-5 text-center">
                    <img
                      :src="clan.badge_url"
                      alt=""
                      class="clan-badge-table"
                      @error="(e) => (e.target.src = 'https://api-assets.clashofclans.com/badges/200/uofw477qfC2pT5E5K4H9fE44-S8y6E7u8H7u5u7u.png')"
                    />
                  </td>

                  <!-- Nom & Tag -->
                  <td class="p-5">
                    <div class="name text-lg font-black text-white group-hover:text-gold transition-colors leading-tight">
                      {{ clan.name }}
                    </div>
                    <div class="tag text-[11px] font-mono text-gold/60 mt-0.5 uppercase tracking-tighter">
                      {{ clan.tag }}
                    </div>
                  </td>

                  <!-- Groupe -->
                  <td class="p-5 text-center">
                    <span v-if="clan.group" class="group-pill">Groupe {{ clan.group }}</span>
                    <span v-else class="text-white/20 text-xs italic">-</span>
                  </td>

                  <!-- Bilan -->
                  <td class="p-5 text-center">
                    <div class="font-bold text-white/80 text-sm">
                      <span class="text-emerald-400 font-extrabold">{{ clan.won }}V</span> -
                      <span class="text-amber-400 font-extrabold">{{ clan.drawn }}N</span> -
                      <span class="text-rose-400 font-extrabold">{{ clan.lost }}D</span>
                    </div>
                    <div class="text-[10px] text-white/30 font-bold uppercase tracking-wider mt-0.5">
                      {{ clan.played }} match{{ clan.played > 1 ? 's' : '' }}
                    </div>
                  </td>

                  <!-- Étoiles -->
                  <td class="p-5 text-center">
                    <div class="inline-flex items-center gap-1 text-gold font-black text-base">
                      <span>{{ clan.total_stars }}</span>
                      <span class="text-xs">⭐️</span>
                    </div>
                  </td>

                  <!-- Destruction % -->
                  <td class="p-5 text-center">
                    <div class="font-bold text-white/90 text-sm">
                      {{ clan.avg_destruction }}%
                    </div>
                  </td>

                  <!-- Points CCA -->
                  <td class="p-5 text-right">
                    <div class="points-meta inline-flex items-center gap-2">
                      <div class="points-val text-2xl font-black italic tracking-tighter text-gold">
                        {{ clan.points }}
                      </div>
                      <span class="text-gold text-sm font-bold">PTS</span>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Mobile Cards -->
        <div class="md:hidden flex flex-col gap-3">
          <div
            v-for="clan in clans"
            :key="clan.tag"
            class="mobile-clan-card glass-card border-white/5 p-4 flex flex-col gap-3 cursor-pointer"
            @click="navigateToClan(clan.tag)"
          >
            <div class="flex items-center gap-3">
              <!-- Rang -->
              <span
                class="font-black text-lg min-w-[28px] text-center"
                :class="{
                  'text-gold font-extrabold text-xl': clan.rank === 1,
                  'text-gray-300': clan.rank === 2,
                  'text-amber-600': clan.rank === 3,
                  'text-white/40': clan.rank > 3
                }"
              >
                #{{ clan.rank }}
              </span>

              <!-- Badge -->
              <img
                :src="clan.badge_url"
                class="w-12 h-12 object-contain filter drop-shadow-md flex-shrink-0"
                @error="(e) => (e.target.src = 'https://api-assets.clashofclans.com/badges/200/uofw477qfC2pT5E5K4H9fE44-S8y6E7u8H7u5u7u.png')"
              />

              <!-- Nom & Tag -->
              <div class="flex-1 min-w-0">
                <div class="text-white font-black text-base leading-tight truncate">
                  {{ clan.name }}
                </div>
                <div class="text-[10px] font-mono text-gold/70 mt-0.5">
                  {{ clan.tag }}
                </div>
              </div>

              <!-- Groupe -->
              <span v-if="clan.group" class="group-pill text-[10px] py-0.5 px-2">
                Gr. {{ clan.group }}
              </span>
            </div>

            <!-- Stats Bar mobile -->
            <div class="grid grid-cols-4 gap-2 pt-2 border-t border-white/5 text-center">
              <div>
                <span class="text-[9px] uppercase tracking-wider text-white/40 block font-bold">Bilan</span>
                <span class="text-xs font-bold text-white">
                  {{ clan.won }}V-{{ clan.drawn }}N-{{ clan.lost }}D
                </span>
              </div>

              <div>
                <span class="text-[9px] uppercase tracking-wider text-white/40 block font-bold">Étoiles</span>
                <span class="text-xs font-black text-gold">
                  {{ clan.total_stars }} ⭐️
                </span>
              </div>

              <div>
                <span class="text-[9px] uppercase tracking-wider text-white/40 block font-bold">Destr.</span>
                <span class="text-xs font-bold text-white/80">
                  {{ clan.avg_destruction }}%
                </span>
              </div>

              <div>
                <span class="text-[9px] uppercase tracking-wider text-gold block font-bold">Points</span>
                <span class="text-sm font-black text-gold italic">
                  {{ clan.points }} Pts
                </span>
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
const clans = ref([]);
const loading = ref(true);

useHead({
  title: "Classement des Clans — CCA National League 🇨🇲",
  meta: [
    {
      name: "description",
      content: "Découvrez le classement officiel des clans de la CCA National League basé sur les points, les étoiles et la destruction.",
    },
  ],
});

const filters = ref({
  name: "",
  group: "",
});

let searchTimeout = null;

const fetchClans = async () => {
  loading.value = true;
  try {
    const params = {};
    if (filters.value.name) params.name = filters.value.name;
    if (filters.value.group) params.group = filters.value.group;

    const data = await $api("/clans/cameroun", { params });
    clans.value = data.items || [];
  } catch (e) {
    console.error("Error loading tournament standings:", e);
  } finally {
    loading.value = false;
  }
};

const handleSearch = () => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => fetchClans(), 400);
};

const resetFilters = () => {
  filters.value = { name: "", group: "" };
  fetchClans();
};

const navigateToClan = (tag) => {
  if (!tag) return;
  const cleanTag = tag.replace("#", "");
  navigateTo(`/clans/${cleanTag}`);
};

onMounted(() => {
  fetchClans();
});
</script>

<style scoped>
.discovery-page {
  background:
    radial-gradient(
      circle at 50% 0%,
      rgba(212, 175, 55, 0.1) 0%,
      transparent 50%
    ),
    linear-gradient(to bottom, transparent, rgba(0, 0, 0, 0.4));
  min-height: 100vh;
}

.clans-container {
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(20px);
}
.clan-badge-table {
  width: 54px;
  height: 54px;
  object-fit: contain;
  filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.6));
}

.mobile-clan-card {
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(10px);
  border-radius: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.mobile-clan-card:active {
  transform: scale(0.98);
  background: rgba(255, 255, 255, 0.06);
}

.level-badge {
  display: inline-block;
  padding: 6px 14px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 100px;
  font-weight: 800;
  font-size: 0.9rem;
}

.points-val {
  background: linear-gradient(to bottom, #fff, #999);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.filter-input {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(18, 17, 17, 0.471);
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

.spinner,
.spinner-sm {
  border: 4px solid rgba(255, 255, 255, 0.03);
  border-top-color: var(--primary);
  border-radius: 50%;
  animation: spin 0.8s cubic-bezier(0.4, 0, 0.2, 1) infinite;
}
.spinner {
  width: 70px;
  height: 70px;
}
.spinner-sm {
  width: 30px;
  height: 30px;
  border-width: 2px;
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
  /* .discovery-header { mb-10; } */
  .filters-bar {
    padding: 18px;
  }
}
</style>
