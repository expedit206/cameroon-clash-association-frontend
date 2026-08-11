<template>
  <div class="min-h-screen bg-[#06070a] text-white pb-20">

    <!-- ═══ HERO BANNER ═══ -->
    <section class="relative overflow-hidden min-h-[50vh] flex flex-col items-center justify-center px-4 pt-24 pb-16 text-center">
      <!-- animated glows -->
      <div class="absolute inset-0 pointer-events-none">
        <div class="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gold/10 rounded-full blur-[120px]"></div>
        <div class="absolute top-1/3 left-1/4 w-[200px] h-[200px] bg-purple-700/10 rounded-full blur-[80px]"></div>
        <div class="absolute bottom-0 right-1/4 w-[200px] h-[200px] bg-yellow-500/5 rounded-full blur-[80px]"></div>
        <div class="absolute inset-0 bg-[url('/images/tournaments/hero-bg.png')] bg-cover bg-center opacity-[0.06]"></div>
        <!-- grid lines -->
        <div class="absolute inset-0" style="background-image: linear-gradient(rgba(212,175,55,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(212,175,55,0.04) 1px, transparent 1px); background-size: 40px 40px;"></div>
      </div>

      <div class="relative z-10 max-w-2xl mx-auto">
        <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/30 text-green-400 text-[10px] font-black uppercase tracking-widest mb-5">
          <span class="w-1.5 h-1.5 rounded-full bg-green-400 animate-ping inline-block"></span>
          Marchés P2P en Direct
        </span>

        <h1 class="text-5xl sm:text-6xl md:text-7xl font-black italic tracking-tighter uppercase leading-none mb-3">
          CCA <span class="text-transparent bg-clip-text bg-gradient-to-r from-gold via-yellow-300 to-gold">CLASH BET</span>
        </h1>

        <p class="text-white/50 text-sm sm:text-base max-w-lg mx-auto mb-8 leading-relaxed">
          Prédit l'issue des matchs de la <strong class="text-white/80">CCA National League</strong>. Les cotes évoluent en temps réel selon la communauté.
        </p>

        <div class="flex flex-wrap justify-center gap-3">
          <NuxtLink to="/clash-bet/wallet" class="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-gold to-yellow-600 text-black font-black text-sm rounded-xl hover:shadow-[0_0_30px_rgba(212,175,55,0.4)] transition-all duration-300 hover:-translate-y-0.5">
            <span>💰</span>
            <span>{{ isLoggedIn ? formatFcfa(wallet?.balance || 0) : 'Mon Wallet' }}</span>
          </NuxtLink>
          <NuxtLink to="/clash-bet/mes-paris" class="inline-flex items-center gap-2 px-5 py-2.5 bg-white/5 border border-white/15 text-white font-bold text-sm rounded-xl hover:bg-white/10 hover:border-white/30 transition-all duration-200">
            <span>🎫</span> Mes Paris
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- ═══ WALLET QUICK INFO (connecté) ═══ -->
    <div v-if="isLoggedIn && wallet" class="container mx-auto px-4 max-w-5xl mb-6">
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div class="stat-pill">
          <span class="stat-label">Disposible</span>
          <span class="stat-value text-gold">{{ formatFcfa(wallet.balance) }}</span>
        </div>
        <div class="stat-pill">
          <span class="stat-label">En Jeu</span>
          <span class="stat-value text-orange-400">{{ formatFcfa(wallet.locked_amount) }}</span>
        </div>
        <div class="stat-pill">
          <span class="stat-label">Gains Cumulés</span>
          <span class="stat-value text-green-400">+{{ formatFcfa(wallet.total_won) }}</span>
        </div>
        <div class="stat-pill">
          <span class="stat-label">Total Déposé</span>
          <span class="stat-value">{{ formatFcfa(wallet.total_deposited) }}</span>
        </div>
      </div>
    </div>

    <!-- ═══ MARCHÉS DISPONIBLES ═══ -->
    <main class="container mx-auto px-4 max-w-5xl">
      <!-- Section Header -->
      <div class="flex items-center justify-between mb-5">
        <h2 class="text-lg font-black uppercase tracking-wider flex items-center gap-2">
          <span class="text-gold">⚡</span> Marchés <span class="text-gold">Ouverts</span>
          <span v-if="!loading" class="ml-1 px-2 py-0.5 bg-gold/15 text-gold text-[10px] font-black rounded-full">{{ markets.length }}</span>
        </h2>
        <button @click="fetchMarkets" :disabled="loading" class="flex items-center gap-1.5 text-xs text-white/40 hover:text-white transition-colors">
          <LucideRefreshCw :size="13" :class="loading ? 'animate-spin' : ''" />
          Actualiser
        </button>
      </div>

      <!-- Skeleton Loader -->
      <div v-if="loading" class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div v-for="n in 4" :key="n" class="market-card animate-pulse">
          <div class="flex justify-between mb-4">
            <div class="h-4 bg-white/10 rounded-full w-20"></div>
            <div class="h-4 bg-white/5 rounded-full w-28"></div>
          </div>
          <div class="flex items-center justify-between gap-4 my-5">
            <div class="flex-1 flex flex-col items-center gap-2">
              <div class="w-14 h-14 bg-white/5 rounded-xl"></div>
              <div class="h-3 bg-white/10 rounded w-16"></div>
            </div>
            <div class="text-white/20 font-black text-xl">VS</div>
            <div class="flex-1 flex flex-col items-center gap-2">
              <div class="w-14 h-14 bg-white/5 rounded-xl"></div>
              <div class="h-3 bg-white/10 rounded w-16"></div>
            </div>
          </div>
          <div class="grid grid-cols-2 gap-2 mt-4">
            <div class="h-16 bg-white/5 rounded-xl"></div>
            <div class="h-16 bg-white/5 rounded-xl"></div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else-if="markets.length === 0" class="flex flex-col items-center justify-center py-24 text-center">
        <div class="text-6xl mb-5">🏆</div>
        <h3 class="text-xl font-black mb-2">Aucun marché ouvert</h3>
        <p class="text-white/40 text-sm max-w-xs">Les prochains marchés de prédiction ouvriront dès qu'un match sera planifié.</p>
      </div>

      <!-- Market Grid -->
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div
          v-for="market in markets"
          :key="market.id"
          class="market-card group"
        >
          <!-- Card Header -->
          <div class="flex items-center justify-between mb-3 pb-3 border-b border-white/5">
            <span class="badge-live">
              <span class="dot-live"></span> EN DIRECT
            </span>
            <div class="flex items-center gap-1 text-[10px] text-white/40 font-mono">
              POT : <span class="text-gold font-black ml-1">{{ formatFcfa(market.total_pool) }}</span>
            </div>
          </div>

          <!-- Clan Duel -->
          <div class="grid grid-cols-[1fr_44px_1fr] items-center gap-2 py-2">
            <!-- Home Clan -->
            <div class="flex flex-col items-center gap-1.5">
              <div class="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center p-2 group-hover:border-gold/20 transition-colors">
                <img
                  :src="market.match?.clan_home?.badge_url || '/default-clan.png'"
                  :alt="market.match?.clan_home?.name"
                  class="max-w-full max-h-full object-contain drop-shadow-md"
                  @error="$event.target.src='/default-clan.png'"
                />
              </div>
              <span class="text-[11px] font-black uppercase text-center leading-tight max-w-[80px] line-clamp-2">
                {{ market.match?.clan_home?.name || 'Équipe A' }}
              </span>
            </div>

            <!-- VS -->
            <div class="flex flex-col items-center gap-1">
              <span class="text-lg font-black italic text-gold">VS</span>
              <span class="text-[9px] text-white/20 font-mono">R{{ market.match?.round || 1 }}</span>
            </div>

            <!-- Away Clan -->
            <div class="flex flex-col items-center gap-1.5">
              <div class="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center p-2 group-hover:border-gold/20 transition-colors">
                <img
                  :src="market.match?.clan_away?.badge_url || '/default-clan.png'"
                  :alt="market.match?.clan_away?.name"
                  class="max-w-full max-h-full object-contain drop-shadow-md"
                  @error="$event.target.src='/default-clan.png'"
                />
              </div>
              <span class="text-[11px] font-black uppercase text-center leading-tight max-w-[80px] line-clamp-2">
                {{ market.match?.clan_away?.name || 'Équipe B' }}
              </span>
            </div>
          </div>

          <!-- Odds Buttons -->
          <div class="grid grid-cols-2 gap-2 mt-3">
            <NuxtLink
              v-for="option in market.options"
              :key="option.id"
              :to="`/clash-bet/match/${market.id}?option=${option.id}`"
              class="odds-btn"
            >
              <span class="odds-label">{{ option.label }}</span>
              <span class="odds-value">{{ (option.current_odds ?? 2.00).toFixed(2) }}</span>
              <span class="odds-pool">{{ formatFcfa(option.current_pool) }}</span>
            </NuxtLink>
          </div>

          <!-- Card Footer -->
          <div class="mt-3 pt-3 border-t border-white/5 flex items-center justify-between">
            <span class="text-[10px] text-white/30">🕒 {{ formatDate(market.betting_closes_at) }}</span>
            <NuxtLink :to="`/clash-bet/match/${market.id}`" class="text-[11px] text-gold font-black hover:text-yellow-300 transition-colors flex items-center gap-1">
              Parier →
            </NuxtLink>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
const { $api } = useNuxtApp();
const { isLoggedIn } = useAuth();

useHead({ title: 'CCA Clash Bet | Marché de Prédiction E-sport Cameroun' });

const loading = ref(true);
const markets = ref([]);
const wallet = ref(null);

const formatFcfa = (n) => {
  if (!n && n !== 0) return '0 FCFA';
  return Number(n).toLocaleString('fr-FR') + ' FCFA';
};

const formatDate = (d) => {
  if (!d) return 'Avant le match';
  return new Date(d).toLocaleString('fr-FR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
};

const fetchMarkets = async () => {
  loading.value = true;
  try {
    const res = await $api('/clash-bet/markets');
    markets.value = res.data || res || [];
  } catch (e) {
    console.error(e);
  } finally {
    loading.value = false;
  }
};

const fetchWallet = async () => {
  if (!isLoggedIn.value) return;
  try { wallet.value = await $api('/clash-bet/wallet'); } catch {}
};

onMounted(() => { fetchMarkets(); fetchWallet(); });
</script>

<style scoped>
/* ── Stat pills ── */
.stat-pill {
  @apply flex flex-col gap-0.5 px-4 py-3 rounded-2xl bg-white/[0.03] border border-white/[0.06] text-center;
}
.stat-label { @apply text-[9px] uppercase tracking-widest text-white/30 font-semibold; }
.stat-value  { @apply text-base font-black tabular-nums; }

/* ── Market Card ── */
.market-card {
  @apply bg-white/[0.02] border border-white/[0.07] rounded-3xl p-5
         hover:border-gold/25 hover:bg-white/[0.035] transition-all duration-300 cursor-pointer;
}

/* ── Badge Live ── */
.badge-live {
  @apply inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-500/10
         border border-green-500/25 text-green-400 text-[9px] font-black uppercase tracking-widest;
}
.dot-live {
  @apply w-1.5 h-1.5 rounded-full bg-green-400 inline-block animate-ping;
}

/* ── Odds Button ── */
.odds-btn {
  @apply flex flex-col items-center gap-0.5 py-3 px-2 rounded-xl border border-white/[0.07]
         bg-white/[0.03] hover:bg-gold/10 hover:border-gold/40 transition-all duration-200 no-underline text-center;
}
.odds-label { @apply text-[9px] text-white/50 font-semibold uppercase truncate w-full text-center; }
.odds-value { @apply text-2xl font-black text-gold leading-none; }
.odds-pool  { @apply text-[8px] text-white/20 font-mono; }
</style>
