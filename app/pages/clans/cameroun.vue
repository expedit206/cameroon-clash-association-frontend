<template>
  <div class="discovery-page">
    <div class="container-fluid py-10 px-4 lg:px-10">
      <!-- Header Hero -->
      <header class="discovery-header text-center mb-16 animate-float">
        <h1 class="heading text-6xl font-black italic tracking-tighter">
          CLANS <span class="text-gold">CAMEROUNAIS</span> 🇨🇲
        </h1>
        <p
          class="subtitle mt-2 text-xl opacity-60 uppercase tracking-[0.3em] font-light"
        >
          Analyse du Territoire National
        </p>
      </header>

      <!-- Filters Bar -->
      <div class="filters-wrapper mb-12">
        <div
          class="filters-bar glass-card p-6 flex flex-wrap gap-6 items-end border-gold/10 shadow-2xl"
        >
          <div class="filter-group flex-1 min-w-[280px]">
            <label
              class="block text-[10px] uppercase tracking-widest text-gold mb-2 font-bold"
              >Rechercher un Clan</label
            >
            <input
              v-model="filters.name"
              type="text"
              placeholder="Nom du clan..."
              class="filter-input w-full"
              @input="handleSearch"
            />
          </div>
          <div class="filter-group w-32">
            <label
              class="block text-[10px] uppercase tracking-widest text-gold mb-2 font-bold"
              >Niveau Min.</label
            >
            <select
              v-model="filters.minClanLevel"
              class="filter-input w-full"
              @change="resetAndFetch"
            >
              <option :value="2">Lvl 2+</option>
              <option v-for="n in 23" :key="n + 2" :value="n + 2" class="bg-gray-800">
                {{ n + 2 }}+
              </option>
            </select>
          </div>
          <div class="filter-group w-32">
            <label
              class="block text-[10px] uppercase tracking-widest text-gold mb-2 font-bold"
              >Membres</label
            >
            <select
              v-model="filters.minMembers"
              class="filter-input w-full"
              @change="resetAndFetch"
            >
              <option :value="2" class="bg-gray-800">2+</option>
              <option :value="10" class="bg-gray-800">10+</option>
              <option :value="20" class="bg-gray-800">20+</option>
              <option :value="30" class="bg-gray-800">30+</option>
              <option :value="40" class="bg-gray-800">40+</option>
            </select>
          </div>
          <button @click="resetFilters" class="btn-reset">↺</button>
        </div>
      </div>

      <!-- Clans Content -->
      <div
        v-if="loading && clans.length === 0"
        class="loader-container py-32 text-center bg-black/20 rounded-3xl"
      >
        <div class="spinner mx-auto mb-6"></div>
        <p
          class="text-gold font-bold tracking-[0.5em] animate-pulse uppercase text-xs"
        >
          Décodage des signaux...
        </p>
      </div>

      <div
        v-else-if="clans.length === 0"
        class="empty-state py-32 text-center bg-black/20 rounded-3xl border border-white/5"
      >
        <div class="text-6xl mb-6">🏰</div>
        <p class="opacity-40 text-xl font-black uppercase tracking-widest">
          Zone déserte... aucun clan repéré
        </p>
        <button @click="resetFilters" class="mt-8 btn-premium btn-sm">
          Réinitialiser les filtres
        </button>
      </div>

      <div v-else class="clans-results">
        <!-- Desktop/Tablet Table View -->
        <div
          class="hidden md:block clans-container shadow-2xl border border-white/5 overflow-hidden rounded-3xl"
        >
          <div class="table-responsive">
            <table class="clans-table w-full">
              <thead>
                <tr
                  class="text-gold text-[11px] uppercase tracking-[0.25em] font-black border-b border-white/10 text-left"
                >
                  <th class="p-6 w-24 text-center">Blason</th>
                  <th class="p-6">Clan</th>
                  <th class="p-6 w-32 text-center hidden md:table-cell">Niv</th>
                  <th class="p-6 w-48 text-center hidden md:table-cell">
                    Membres
                  </th>
                  <th class="p-6 text-right w-48">Pts</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="clan in clans"
                  :key="clan.tag"
                  class="clan-row transition-all duration-300 border-b border-white/5 hover:bg-white/5 cursor-pointer"
                  @click="navigateToClan(clan.tag)"
                >
                  <td class="p-6 text-center">
                    <img
                      :src="clan.badgeUrls.medium"
                      alt=""
                      class="clan-badge-table"
                      @error="
                        (e) =>
                          (e.target.src =
                            'https://api-assets.clashofclans.com/badges/200/uofw477qfC2pT5E5K4H9fE44-S8y6E7u8H7u5u7u.png')
                      "
                    />
                  </td>
                  <td class="p-6">
                    <div
                      class="name text-xl font-black text-white group-hover:text-gold transition-colors leading-tight mb-1"
                    >
                      {{ clan.name }}
                    </div>
                    <div
                      class="tag text-[10px] font-mono opacity-30 mt-1 uppercase tracking-tighter"
                    >
                      {{ clan.tag }}
                    </div>
                  </td>
                  <td class="p-6 text-center hidden md:table-cell">
                    <div class="level-badge">{{ clan.clanLevel }}</div>
                  </td>
                  <td class="p-6 text-center hidden md:table-cell">
                    <div class="members-display font-bold text-white/60">
                      <span class="text-white">{{ clan.members }}</span> / 50
                    </div>
                  </td>
                  <td class="p-6 text-right">
                    <div class="points-meta inline-flex items-center gap-3">
                      <div
                        class="points-val text-3xl font-black italic tracking-tighter"
                      >
                        {{ clan.clanPoints }}
                      </div>
                      <span class="text-gold text-xl">🛡️</span>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Mobile Horizontal Cards (Ultra-Minimalist) -->
       <!-- Mobile Horizontal Cards (Ultra-Minimalist) -->
        <div class="sm:hidden flex flex-col gap-3">
          <div v-for="clan in clans" :key="clan.tag"
            class="mobile-clan-card glass-card border-white/5 flex items-start p-3 gap-4"
            @click="navigateToClan(clan.tag)">
            <!-- Badge avec niveau (inchangé) -->
            <div class="relative w-14 h-14 flex-shrink-0">
              <img :src="clan.badgeUrls.medium" class="w-full h-full object-contain filter drop-shadow-md" @error="
                (e) =>
                (e.target.src =
                  'https://api-assets.clashofclans.com/badges/200/uofw477qfC2pT5E5K4H9fE44-S8y6E7u8H7u5u7u.png')
              " />
              <div
                class="absolute -bottom-1 -right-1 bg-black/80 border border-white/20 text-gold text-[9px] font-black px-1.5 py-0.5 rounded-md min-w-[20px] text-center">
                {{ clan.clanLevel }}
              </div>
            </div>

            <!-- Colonne principale : nom + infos en deux lignes -->
            <div class="flex-1 min-w-0">
              <!-- Nom du clan (sans truncate, retour à la ligne si nécessaire) -->
              <div class="text-white font-black text-lg leading-tight break-words">
                {{ clan.name }}
              </div>

              <!-- Deuxième ligne : membres à gauche, score à droite -->
              <div class="flex items-center justify-between mt-1">
                <span class="text-[10px] font-bold text-white/40 uppercase tracking-widest">
                  {{ clan.members }} / 50
                </span>
                <span class="text-white font-black text-base italic tracking-tighter">
                  Pts: {{ clan.clanPoints }}
                </span>
              </div>

              <!-- (Optionnel) "National Score" peut être placé sous le score ou supprimé -->
              <div class="text-[9px] font-bold text-gold opacity-50 uppercase tracking-tighter text-right mt-0.5">
                National Score
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Loading Footer for Infinite Scroll -->
      <div v-if="loading && clans.length > 0" class="py-10 text-center">
        <div class="spinner-sm mx-auto"></div>
      </div>

      <!-- Infinite Scroll Anchor -->
      <div ref="scrollAnchor" class="h-20"></div>
    </div>
  </div>
</template>

<script setup>
const { $api } = useNuxtApp();
const clans = ref([]);
const loading = ref(false);

useHead({
  title: "Clans Camerounais — Annuaire National | CCA League 🇨🇲",
  meta: [
    {
      name: "description",
      content:
        "Explorez l'annuaire complet des clans Clash of Clans actifs au Cameroun. Suivez leur niveau, le nombre de membres et leurs points défensifs.",
    },
    {
      name: "keywords",
      content:
        "clans camerounais, coc cameroun, clan clash of clans, meilleur clan cameroun, cca league, cameroun ranking",
    },
    {
      property: "og:title",
      content: "Clans Camerounais — Annuaire National | CCA 🛡️",
    },
    {
      property: "og:description",
      content:
        "Trouvez un clan ou comparez vos statistiques par rapport au score national.",
    },
    {
      property: "og:image",
      content: "/images/cca-affiche1.png",
    },
  ],
});
const nextMarker = ref(null);
const hasMore = ref(true);
const scrollAnchor = ref(null);

const filters = ref({
  name: "",
  minClanLevel: 2,
  minMembers: 2,
});

let searchTimeout = null;

const fetchClans = async (isNew = false) => {
  if (loading.value || (!hasMore.value && !isNew)) return;

  loading.value = true;
  try {
    const params = { limit: 24, ...filters.value };
    if (!isNew && nextMarker.value) params.after = nextMarker.value;
    if (!params.name) delete params.name;

    const data = await $api("/clans/cameroun", { params });

    if (isNew) clans.value = data.items || [];
    else clans.value.push(...(data.items || []));

    nextMarker.value = data.paging?.cursors?.after || null;
    hasMore.value = !!nextMarker.value && (data.items?.length || 0) > 0;
  } catch (e) {
    console.error("Error discovery clans:", e);
  } finally {
    loading.value = false;
  }
};

const handleSearch = () => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => resetAndFetch(), 500);
};

const resetAndFetch = () => {
  nextMarker.value = null;
  hasMore.value = true;
  fetchClans(true);
};

const resetFilters = () => {
  filters.value = { name: "", minClanLevel: 2, minMembers: 2 };
  resetAndFetch();
};

const navigateToClan = (tag) => {
  navigateTo(`/clans/${tag.replace("#", "")}`);
};

onMounted(() => {
  fetchClans(true);
  const observer = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting && !loading.value && hasMore.value)
        fetchClans();
    },
    { threshold: 0.1 },
  );
  if (scrollAnchor.value) observer.observe(scrollAnchor.value);
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
