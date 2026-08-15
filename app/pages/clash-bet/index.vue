<template>
  <div class="min-h-screen bg-[#06070a] text-white pb-20">

    <!-- ═══ ECRAN DE MAINTENACE SI DESACTIVE EN BDD ═══ -->
    <div v-if="!canAccessClashBet" class="container mx-auto px-4 max-w-2xl py-20 text-center space-y-5">
      <div
        class="w-20 h-20 bg-gold/10 border border-gold/30 rounded-3xl flex items-center justify-center text-4xl mx-auto shadow-[0_0_30px_rgba(212,175,55,0.2)]">
        🔒
      </div>
      <h2 class="text-3xl font-black italic uppercase text-white tracking-tight">Clash Bet Indisponible</h2>
      <p class="text-white/60 text-sm leading-relaxed max-w-md mx-auto">
        Le module de paris P2P est actuellement désactivé par l'administration pour maintenance ou configuration.
        Revenez très bientôt !
      </p>
      <NuxtLink to="/"
        class="inline-block px-6 py-3 bg-gradient-to-r from-gold to-yellow-600 text-black font-black text-xs uppercase tracking-wider rounded-xl hover:brightness-110 transition-all">
        ← Retourner à l'accueil
      </NuxtLink>
    </div>

    <div v-else>
      <section class="relative overflow-hidden flex flex-col items-center justify-center px-3 pt-6 pb-4 text-center">
        <div class="absolute inset-0 pointer-events-none">
          <div
            class="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[180px] bg-gold/10 rounded-full blur-[100px]">
          </div>
        </div>

        <div class="relative z-10 max-w-xl mx-auto">
          <div class="flex items-center justify-center gap-2 mb-2">
            <span
              class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-gold/10 border border-gold/30 text-gold text-[9px] font-black uppercase tracking-wider">
              🎫 P2P BETTING EXCHANGE
            </span>
          </div>

          <h1 class="text-2xl sm:text-4xl font-black italic tracking-tighter uppercase leading-none mb-1.5">
            CCA <span class="text-transparent bg-clip-text bg-gradient-to-r from-gold via-yellow-300 to-gold">CLASH
              BET</span>
          </h1>

          <p class="text-white/50 text-xs max-w-md mx-auto mb-3 leading-snug">
            Tu paries contre <strong class="text-white/80">d'autres joueurs</strong> — Cote fixe 2.00
          </p>

          <div class="flex flex-wrap justify-center gap-2">
            <NuxtLink to="/clash-bet/wallet?tab=deposit"
              class="inline-flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-gold to-yellow-600 text-black font-black text-xs rounded-xl hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] transition-all">
              <span>💳</span>
              <span>Déposer</span>
            </NuxtLink>
            <NuxtLink to="/clash-bet/wallet?tab=withdraw"
              class="inline-flex items-center gap-1.5 px-4 py-2 bg-white/10 border border-white/20 text-white font-black text-xs rounded-xl hover:bg-white/20 transition-all">
              <span>💸</span>
              <span>Retirer</span>
            </NuxtLink>
            <NuxtLink to="/clash-bet/mes-tickets"
              class="inline-flex items-center gap-1.5 px-4 py-2 bg-white/5 border border-white/15 text-white/80 font-bold text-xs rounded-xl hover:bg-white/10 transition-all">
              <span>🎫</span>
              <span>Mes Tickets</span>
            </NuxtLink>
          </div>
        </div>
      </section>

      <!-- ═══ WALLET MINI COMPACT ═══ -->
      <div v-if="isLoggedIn && wallet" class=" bg-[#06070a]  sticky top-[5rem] z-100 container mx-auto px-2 max-w-5xl mb-4">
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <div class="bg-[#0b0c12] border border-white/10 p-2.5 rounded-xl text-center flex flex-col justify-between">
            <span class="text-[9px] text-white/40 uppercase font-semibold block">Disponible</span>
            <span class="text-xs sm:text-sm font-black text-gold tabular-nums">{{ formatFcfa(wallet.balance) }}</span>
            <NuxtLink to="/clash-bet/wallet?tab=deposit"
              class="text-[9px] text-gold font-bold hover:underline mt-1 block">
              + Recharger
            </NuxtLink>
          </div>
          <div class="bg-[#0b0c12] border border-white/10 p-2.5 rounded-xl text-center">
            <span class="text-[9px] text-white/40 uppercase font-semibold block">En Jeu</span>
            <span class="text-xs sm:text-sm font-black text-orange-400 tabular-nums">{{ formatFcfa(wallet.locked_amount)
              }}</span>
          </div>
          <div class="bg-[#0b0c12] border border-white/10 p-2.5 rounded-xl text-center flex flex-col justify-between">
            <span class="text-[9px] text-white/40 uppercase font-semibold block">Gains Cumulés</span>
            <span class="text-xs sm:text-sm font-black text-green-400 tabular-nums">+{{ formatFcfa(wallet.total_won)
              }}</span>
            <NuxtLink to="/clash-bet/wallet?tab=withdraw"
              class="text-[9px] text-green-400 font-bold hover:underline mt-1 block">
              Retirer →
            </NuxtLink>
          </div>
          <div class="bg-[#0b0c12] border border-white/10 p-2.5 rounded-xl text-center">
            <span class="text-[9px] text-white/40 uppercase font-semibold block">Total Déposé</span>
            <span class="text-xs sm:text-sm font-black text-white/80 tabular-nums">{{ formatFcfa(wallet.total_deposited)
              }}</span>
          </div>
        </div>
      </div>

      <!-- ═══ ENCADRE EXPLICATIF : COMMENT CA MARCHE ? ═══ -->
      <div class="container mx-auto px-2 max-w-5xl mb-6">
        <div
          class="p-4 bg-gradient-to-r from-gold/10 via-black/60 to-gold/5 border border-gold/30 rounded-2xl space-y-3">
          <div class="flex items-center gap-2 text-gold font-black uppercase text-xs tracking-wider">
            <span>💡</span>
            <span>Comment fonctionne le Clash Bet P2P ?</span>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            <div class="p-3 bg-black/50 border border-white/10 rounded-xl space-y-1">
              <div class="font-bold text-white flex items-center gap-1.5">
                <span class="text-gold">1.</span> Choisissez votre position
              </div>
              <p class="text-[11px] text-white/60 leading-snug">
                Sélectionnez OUI ou NON sur les victoires d'équipes, les performances de duels HDV ou de joueurs.
              </p>
            </div>
            <div class="p-3 bg-black/50 border border-white/10 rounded-xl space-y-1">
              <div class="font-bold text-white flex items-center gap-1.5">
                <span class="text-gold">2.</span> Appariement P2P (Cote 2.00)
              </div>
              <p class="text-[11px] text-white/60 leading-snug">
                Votre mise est jumelée à 100% contre un autre parieur ayant pris la position inverse (Cote fixe 2.00).
              </p>
            </div>
            <div class="p-3 bg-black/50 border border-white/10 rounded-xl space-y-1">
              <div class="font-bold text-white flex items-center gap-1.5">
                <span class="text-gold">3.</span> Règlement & Gains direct
              </div>
              <p class="text-[11px] text-white/60 leading-snug">
                Dès la fin du match, le système évalue la règle automatiquement et crédite vos gains sur votre solde.
              </p>
            </div>
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
            <div
              class="flex items-center justify-between text-[10px] text-white/40 mb-1.5 pb-1 border-b border-white/5">
              <div class="flex items-center gap-1.5">
                <span
                  class="px-1.5 py-0.2 bg-green-500/10 text-green-400 border border-green-500/20 rounded font-black text-[9px]">OPEN</span>
                <span class="font-mono text-[9px] uppercase">{{ formatDate(match.betting_closes_at) }}</span>
              </div>
              <span class="text-[9px] text-gold font-bold">
                ⚡ {{ (match.yes_tickets_count || 0) + (match.no_tickets_count || 0) }} tickets
              </span>
            </div>

         
            <!-- Ligne 3 : Confrontation & Cotes Compactes Style 1xBet -->
            <div class="flex items-center flex-col  gap-2">
              <!-- Clans & VS -->
              <div class="flex items-center justify-center gap-2 w-full">
                <div class="flex items-center gap-1.5 ">
                  <img :src="match.match?.clan_home?.badge_url || '/default-clan.png'"
                    class="w-5 h-5 object-contain flex-shrink-0" @error="$event.target.src = '/default-clan.png'" />
                  <span class="text-[11px] font-bold text-white/90 ">{{ match.match?.clan_home?.name || 'Home' }}</span>
                </div>
                <span class="text-[9px] font-black text-gold/80 flex-shrink-0">VS</span>
                <div class="flex items-center gap-1.5 ">
                  <img :src="match.match?.clan_away?.badge_url || '/default-clan.png'"
                    class="w-5 h-5 object-contain flex-shrink-0" @error="$event.target.src = '/default-clan.png'" />
                  <span class="text-[11px] font-bold text-white/90 ">{{ match.match?.clan_away?.name || 'Away' }}</span>
                </div>
              </div>

              <!-- Ligne 2 : Titre du marché (si présent) -->
              <div class="text-[11px] font-black text-white group-hover:text-gold transition-colors  mb-2">
                {{ match.title || 'Victoire du Clan' }}
              </div>


              <!-- Boutons Cotes (YES / NO) 1xBet Style -->
              <div class="flex items-center justify-between px-3 gap-1 w-full">
                <div
                  class="px-2.5 py-1 bg-green-500/10 border border-green-500/20 hover:border-green-500/50 rounded-lg text-center transition-all w-1/3">
                  <div class="text-[8px] font-black text-green-400 uppercase leading-none">OUI</div>
                  <div class="text-xs font-black text-gold leading-tight">2.00</div>
                </div>
                <div
                  class="px-2.5 py-1 bg-red-500/10 border border-red-500/20 hover:border-red-500/50 rounded-lg text-center transition-all w-1/3 ">
                  <div class="text-[8px] font-black text-red-400 uppercase leading-none">NON</div>
                  <div class="text-xs font-black text-gold leading-tight">2.00</div>
                </div>
              </div>
            </div>

          </NuxtLink>
        </div>
      </main>
    </div>
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
  if (!d) return '';
  return new Date(d).toLocaleString('fr-FR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
};

const totalOpenTickets = (match) => {
  return (match.yes_tickets_count || 0) + (match.no_tickets_count || 0);
};

const shuffleArray = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

const fetchData = async () => {
  loading.value = true;
  try {
    const [matchesRes, walletRes] = await Promise.allSettled([
      $api('/clash-bet/matches'),
      isLoggedIn.value ? $api('/clash-bet/wallet') : null,
    ]);
    const raw = matchesRes.status === 'fulfilled' ? (matchesRes.value?.data || matchesRes.value || []) : [];
    matches.value = shuffleArray(raw);
    if (walletRes?.status === 'fulfilled' && walletRes.value) {
      wallet.value = walletRes.value;
    }
  } finally {
    loading.value = false;
  }
};

const { canAccessClashBet, fetchPublicConfig } = useClashBetConfig();

onMounted(async () => {
  await fetchPublicConfig();
  if (canAccessClashBet.value) {
    fetchData();
  }
});
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
