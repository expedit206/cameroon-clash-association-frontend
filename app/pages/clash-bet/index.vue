<template>
  <div class="min-h-screen bg-[#06070a] text-white pb-20">

    <!-- ═══ HERO COMPACT ═══ -->
    <section
      class="relative overflow-hidden flex flex-col items-center justify-center px-3 pt-6 pb-4 text-center">
      <div class="absolute inset-0 pointer-events-none">
        <div class="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[180px] bg-gold/10 rounded-full blur-[100px]">
        </div>
      </div>

      <div class="relative z-10 max-w-xl mx-auto">
        <div class="flex items-center justify-center gap-2 mb-2">
          <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-gold/10 border border-gold/30 text-gold text-[9px] font-black uppercase tracking-wider">
            🎫 P2P BETTING EXCHANGE
          </span>
        </div>

        <h1 class="text-2xl sm:text-4xl font-black italic tracking-tighter uppercase leading-none mb-1.5">
          CCA <span class="text-transparent bg-clip-text bg-gradient-to-r from-gold via-yellow-300 to-gold">CLASH BET</span>
        </h1>

        <p class="text-white/50 text-xs max-w-md mx-auto mb-3 leading-snug">
          Tu paries contre <strong class="text-white/80">d'autres joueurs</strong> — Cote fixe 2.00
        </p>

        <div class="flex flex-wrap justify-center gap-2">
          <NuxtLink to="/clash-bet/wallet"
            class="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-gradient-to-r from-gold to-yellow-600 text-black font-black text-xs rounded-lg hover:brightness-110 transition-all">
            <span>💰</span>
            <span>{{ isLoggedIn ? formatFcfa(wallet?.balance || 0) : 'Mon wallet' }}</span>
          </NuxtLink>
          <NuxtLink to="/clash-bet/mes-tickets"
            class="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-white/5 border border-white/15 text-white font-bold text-xs rounded-lg hover:bg-white/10 transition-all">
            🎫 Mes Tickets
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- ═══ WALLET MINI COMPACT ═══ -->
    <div v-if="isLoggedIn && wallet" class="container mx-auto px-2 max-w-5xl mb-4">
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <div class="bg-[#0b0c12] border border-white/10 p-2 rounded-xl text-center">
          <span class="text-[9px] text-white/40 uppercase font-semibold block">Disponible</span>
          <span class="text-xs sm:text-sm font-black text-gold tabular-nums">{{ formatFcfa(wallet.balance) }}</span>
        </div>
        <div class="bg-[#0b0c12] border border-white/10 p-2 rounded-xl text-center">
          <span class="text-[9px] text-white/40 uppercase font-semibold block">En Jeu</span>
          <span class="text-xs sm:text-sm font-black text-orange-400 tabular-nums">{{ formatFcfa(wallet.locked_amount) }}</span>
        </div>
        <div class="bg-[#0b0c12] border border-white/10 p-2 rounded-xl text-center">
          <span class="text-[9px] text-white/40 uppercase font-semibold block">Gains Cumulés</span>
          <span class="text-xs sm:text-sm font-black text-green-400 tabular-nums">+{{ formatFcfa(wallet.total_won) }}</span>
        </div>
        <div class="bg-[#0b0c12] border border-white/10 p-2 rounded-xl text-center">
          <span class="text-[9px] text-white/40 uppercase font-semibold block">Total Déposé</span>
          <span class="text-xs sm:text-sm font-black text-white/80 tabular-nums">{{ formatFcfa(wallet.total_deposited) }}</span>
        </div>
      </div>
    </div>


    <!-- ═══ MATCHS DISPONIBLES ═══ -->
    <main class="container mx-auto px-1  max-w-5xl">
      <div class="flex items-center justify-between mb-5 px-1">
        <h2 class="text-lg font-black uppercase tracking-wider flex items-center gap-2">
          <span v-if="!loading" class="ml-1 px-2 py-0.5 bg-gold/15 text-gold text-[10px] font-black rounded-full">{{
            matches.length }}</span>
        </h2>
        <button @click="fetchData" :disabled="loading"
          class="flex items-center gap-1.5 text-xs text-white/40 hover:text-white transition-colors">
          <LucideRefreshCw :size="13" :class="loading ? 'animate-spin' : ''" />
          Actualiser
        </button>
      </div>

      <!-- Skeleton -->
      <div v-if="loading" class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div v-for="n in 4" :key="n" class="market-card animate-pulse">
          <div class="h-5 bg-white/10 rounded-full w-24 mb-4"></div>
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

      <!-- Empty -->
      <div v-else-if="matches.length === 0" class="flex flex-col items-center justify-center py-24 text-center">
        <div class="text-6xl mb-5">🎫</div>
        <h3 class="text-xl font-black mb-2">Aucun marché ouvert</h3>
        <p class="text-white/40 text-sm max-w-xs">Les prochains marchés de paris ouvriront dès qu'un match sera
          planifié.</p>
      </div>

      <!-- Match Cards Ultra-Compacts (Style 1xBet Minimaliste) -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-2.5">
        <NuxtLink v-for="match in matches" :key="match.id" :to="`/clash-bet/match/${match.id}`"
          class="market-card-compact group block no-underline bg-[#0b0c12] border border-white/10 hover:border-gold/30 rounded-xl p-2.5 transition-all">
          
          <!-- Ligne 1 : Header Match & Statut -->
          <div class="flex items-center justify-between text-[10px] text-white/40 mb-1.5 pb-1 border-b border-white/5">
            <div class="flex items-center gap-1.5">
              <span class="px-1.5 py-0.2 bg-green-500/10 text-green-400 border border-green-500/20 rounded font-black text-[9px]">OPEN</span>
              <span class="font-mono text-[9px] uppercase">{{ formatDate(match.betting_closes_at) }}</span>
            </div>
            <span class="text-[9px] text-gold font-bold">
              ⚡ {{ (match.yes_tickets_count || 0) + (match.no_tickets_count || 0) }} tickets
            </span>
          </div>

          <!-- Ligne 2 : Titre du marché (si présent) -->
          <div class="text-[11px] font-black text-white group-hover:text-gold transition-colors truncate mb-2">
            {{ match.title || 'Victoire du Clan' }}
          </div>

          <!-- Ligne 3 : Confrontation & Cotes Compactes Style 1xBet -->
          <div class="flex items-center flex-col justify-between gap-2">
            <!-- Clans & VS -->
            <div class="flex items-center justify-between gap-2 w-full">
              <div class="flex items-center gap-1.5 ">
                <img :src="match.match?.clan_home?.badge_url || '/default-clan.png'" class="w-5 h-5 object-contain flex-shrink-0" @error="$event.target.src = '/default-clan.png'" />
                <span class="text-[11px] font-bold text-white/90 ">{{ match.match?.clan_home?.name || 'Home' }}</span>
              </div>
              <span class="text-[9px] font-black text-gold/80 flex-shrink-0">VS</span>
              <div class="flex items-center gap-1.5 ">
                <img :src="match.match?.clan_away?.badge_url || '/default-clan.png'" class="w-5 h-5 object-contain flex-shrink-0" @error="$event.target.src = '/default-clan.png'" />
                <span class="text-[11px] font-bold text-white/90 ">{{ match.match?.clan_away?.name || 'Away' }}</span>
              </div>
            </div>

            <!-- Boutons Cotes (YES / NO) 1xBet Style -->
            <div class="flex items-center justify-between px-3 gap-1 w-full">
              <div class="px-2.5 py-1 bg-green-500/10 border border-green-500/20 hover:border-green-500/50 rounded-lg text-center transition-all w-1/3">
                <div class="text-[8px] font-black text-green-400 uppercase leading-none">OUI</div>
                <div class="text-xs font-black text-gold leading-tight">2.00</div>
              </div>
              <div class="px-2.5 py-1 bg-red-500/10 border border-red-500/20 hover:border-red-500/50 rounded-lg text-center transition-all w-1/3 ">
                <div class="text-[8px] font-black text-red-400 uppercase leading-none">NON</div>
                <div class="text-xs font-black text-gold leading-tight">2.00</div>
              </div>
            </div>
          </div>

        </NuxtLink>
      </div>
    </main>
  </div>
</template>

<script setup>
const { $api } = useNuxtApp();

const { isLoggedIn } = useAuth();

useHead({ title: 'CCA Clash Bet | Marketplace P2P' });

const loading = ref(true);
const matches = ref([]);
const wallet = ref(null);

const formatFcfa = (n) => {
  if (!n && n !== 0) return '0 FCFA';
  return Number(n).toLocaleString('fr-FR') + ' FCFA';
};

const formatDate = (d) => {
  if (!d) return 'Clôture avant match';
  return new Date(d).toLocaleString('fr-FR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
};

const totalOpenTickets = (match) => {
  return (match.yes_tickets_count || 0) + (match.no_tickets_count || 0);
};

const fetchData = async () => {
  loading.value = true;
  try {
    const [matchesRes, walletRes] = await Promise.allSettled([
      $api('/clash-bet/matches'),
      isLoggedIn.value ? $api('/clash-bet/wallet') : null,
    ]);
    matches.value = matchesRes.status === 'fulfilled' ? (matchesRes.value?.data || matchesRes.value || []) : [];
    if (walletRes?.status === 'fulfilled' && walletRes.value) {
      wallet.value = walletRes.value;
    }
  } finally {
    loading.value = false;
  }
};

onMounted(fetchData);
</script>

<style scoped>
.stat-pill {
  @apply flex flex-col gap-0.5 px-4 py-3 rounded-2xl bg-white/[0.03] border border-white/[0.06] text-center;
}

.stat-label {
  @apply text-[9px] uppercase tracking-widest text-white/30 font-semibold;
}

.stat-value {
  @apply text-base font-black tabular-nums;
}

.step-explain {
  @apply flex flex-col items-center gap-1;
}

.step-icon {
  @apply text-2xl;
}

.step-title {
  @apply text-[10px] font-black uppercase tracking-wider text-gold;
}

.step-desc {
  @apply text-[9px] text-white/40;
}

.market-card {
  @apply bg-white/[0.02] border border-white/[0.07] rounded-3xl p-5 hover:border-gold/25 hover:bg-white/[0.04] transition-all duration-300 cursor-pointer;
}

.badge-live {
  @apply inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-green-500/10 border border-green-500/25 text-green-400 text-[9px] font-black uppercase tracking-widest;
}

.dot-live {
  @apply w-1.5 h-1.5 rounded-full bg-green-400 inline-block animate-ping;
}

.ticket-option-pill {
  @apply flex flex-col items-center gap-0.5 py-3 px-2 rounded-xl border border-white/[0.07] bg-white/[0.03] text-center;
}
</style>
