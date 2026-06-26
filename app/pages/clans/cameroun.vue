<template>
  <div class="discovery-page container py-10">
    <!-- Header Hero -->
    <header class="discovery-header text-center mb-16 animate-float">
      <h1 class="heading text-5xl">
        Découvrez les <span class="text-gold">Clans Camerounais</span>
      </h1>
      <p class="subtitle mt-4 text-xl opacity-80">
        Explorez l'élite du Clash au Cameroun 🇨🇲
      </p>
    </header>

    <!-- Filters Bar -->
    <div
      class="filters-bar glass-card p-6 mb-10 flex flex-wrap gap-6 items-end justify-center"
    >
      <div class="filter-group">
        <label class="block text-xs uppercase tracking-widest text-gold mb-2"
          >Rechercher</label
        >
        <input
          v-model="filters.name"
          type="text"
          placeholder="Nom du clan..."
          class="filter-input"
          @input="handleSearch"
        />
      </div>
      <div class="filter-group">
        <label class="block text-xs uppercase tracking-widest text-gold mb-2"
          >Niveau Min.</label
        >
        <select
          v-model="filters.minClanLevel"
          class="filter-input"
          @change="resetAndFetch"
        >
          <option :value="1">Tous les niveaux</option>
          <option v-for="n in 25" :key="n" :value="n">Niveau {{ n }}+</option>
        </select>
      </div>
      <div class="filter-group">
        <label class="block text-xs uppercase tracking-widest text-gold mb-2"
          >Membres Min.</label
        >
        <select
          v-model="filters.minMembers"
          class="filter-input"
          @change="resetAndFetch"
        >
          <option :value="1">Peu importe</option>
          <option :value="10">10+</option>
          <option :value="20">20+</option>
          <option :value="30">30+</option>
          <option :value="40">40+</option>
        </select>
      </div>
    </div>

    <!-- Clans Grid -->
    <div
      v-if="clans.length > 0"
      class="clans-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
    >
      <div
        v-for="clan in clans"
        :key="clan.tag"
        class="clan-card glass-card hover-glow"
      >
        <div class="card-header p-6 flex items-center gap-4">
          <img :src="clan.badgeUrls.medium" alt="" class="clan-badge-md" />
          <div class="clan-info">
            <h3 class="clan-name text-lg font-bold leading-tight">
              {{ clan.name }}
            </h3>
            <p class="clan-tag text-xs font-mono text-gold opacity-80">
              {{ clan.tag }}
            </p>
          </div>
        </div>

        <div class="card-body p-6 pt-0">
          <div class="stats-row flex justify-between text-sm mb-4">
            <div class="stat">
              <span class="label block text-[10px] uppercase opacity-50"
                >Niveau</span
              >
              <span class="value font-bold">{{ clan.clanLevel }}</span>
            </div>
            <div class="stat text-center">
              <span class="label block text-[10px] uppercase opacity-50"
                >Membres</span
              >
              <span class="value font-bold">{{ clan.members }}/50</span>
            </div>
            <div class="stat text-right">
              <span class="label block text-[10px] uppercase opacity-50"
                >Points</span
              >
              <span class="value font-bold text-gold">{{
                clan.clanPoints
              }}</span>
            </div>
          </div>

          <div class="clan-meta flex flex-wrap gap-2 mb-6">
            <span class="meta-badge">{{ clan.type }}</span>
            <span
              v-if="clan.warFrequency !== 'unknown'"
              class="meta-badge italic"
              >{{ clan.warFrequency }}</span
            >
          </div>

          <NuxtLink
            :to="`/clans/${clan.tag.replace('#', '')}`"
            class="btn-premium btn-outline btn-sm w-full text-center"
          >
            Voir le Clan
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- Empty State / Loader -->
    <div v-if="loading" class="loader-container py-20 text-center">
      <div class="spinner mx-auto mb-4"></div>
      <p class="text-gold animate-pulse">
        Synchronisation avec les serveurs Supercell...
      </p>
    </div>

    <div
      v-if="!loading && clans.length === 0"
      class="empty-state text-center py-20"
    >
      <p class="text-2xl opacity-50">Aucun clan trouvé avec ces critères 🛡️</p>
      <button @click="resetFilters" class="mt-4 text-gold hover:underline">
        Réinitialiser les filtres
      </button>
    </div>

    <!-- Infinite Scroll Anchor -->
    <div ref="scrollAnchor" class="h-10"></div>
  </div>
</template>

<script setup>
const { $api } = useNuxtApp();
const clans = ref([]);
const loading = ref(false);
const nextMarker = ref(null);
const hasMore = ref(true);
const scrollAnchor = ref(null);

const filters = ref({
  name: "",
  minClanLevel: 1,
  minMembers: 1,
});

let searchTimeout = null;

const fetchClans = async (isNew = false) => {
  if (loading.value || (!hasMore.value && !isNew)) return;

  loading.value = true;
  try {
    const params = {
      limit: 24,
      ...filters.value,
    };

    if (!isNew && nextMarker.value) {
      params.after = nextMarker.value;
    }

    // On ne veut pas de noms vides dans l'URL si on cherche par loc
    if (!params.name) delete params.name;

    const data = await $api("/clans/cameroun", { params });

    if (isNew) {
      clans.value = data.items || [];
    } else {
      clans.value.push(...(data.items || []));
    }

    nextMarker.value = data.paging?.cursors?.after || null;
    hasMore.value = !!nextMarker.value && data.items?.length > 0;
  } catch (e) {
    console.error("Error discovery clans:", e);
  } finally {
    loading.value = false;
  }
};

const handleSearch = () => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    resetAndFetch();
  }, 500);
};

const resetAndFetch = () => {
  nextMarker.value = null;
  hasMore.value = true;
  fetchClans(true);
};

const resetFilters = () => {
  filters.value = {
    name: "",
    minClanLevel: 1,
    minMembers: 1,
  };
  resetAndFetch();
};

// Infinite Scroll logic
onMounted(() => {
  fetchClans(true);

  const observer = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting && !loading.value && hasMore.value) {
        fetchClans();
      }
    },
    { threshold: 0.1 },
  );

  if (scrollAnchor.value) {
    observer.observe(scrollAnchor.value);
  }
});
</script>

<style scoped>
.discovery-page {
  min-height: 100vh;
}

.filter-input {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-sm);
  padding: 10px 15px;
  color: white;
  min-width: 200px;
  outline: none;
  transition: all 0.3s ease;
}

.filter-input:focus {
  border-color: var(--primary);
  background: rgba(255, 255, 255, 0.1);
  box-shadow: 0 0 10px rgba(212, 175, 55, 0.1);
}

.clan-card {
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.clan-card:hover {
  transform: translateY(-10px) scale(1.02);
}

.clan-badge-md {
  width: 60px;
  height: 60px;
  filter: drop-shadow(0 0 10px rgba(0, 0, 0, 0.5));
}

.meta-badge {
  font-size: 0.75rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--glass-border);
  padding: 4px 10px;
  border-radius: 4px;
  color: var(--text-muted);
}

.loader-container .spinner {
  width: 50px;
  height: 50px;
  border: 4px solid var(--glass-border);
  border-top-color: var(--primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 640px) {
  .filter-input {
    width: 100%;
  }
}
</style>
