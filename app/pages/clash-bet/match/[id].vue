<template>
  <div class="min-h-screen bg-[#06070a] text-white pb-20 pt-24">
    <div class="container mx-auto px-4 max-w-4xl">

      <!-- Breadcrumb -->
      <NuxtLink to="/clash-bet"
        class="inline-flex items-center gap-1.5 text-[11px] text-white/40 hover:text-gold transition-colors mb-6">
        ← Retour au Lobby
      </NuxtLink>

      <!-- Loader -->
      <div v-if="loading" class="space-y-4 animate-pulse">
        <div class="h-48 bg-white/[0.03] border border-white/[0.06] rounded-3xl"></div>
        <div class="h-64 bg-white/[0.03] border border-white/[0.06] rounded-3xl"></div>
      </div>

      <!-- No market -->
      <div v-else-if="!activeMarket" class="flex flex-col items-center py-24 text-center">
        <span class="text-5xl mb-4">🔒</span>
        <h2 class="text-xl font-black mb-2">Aucun marché disponible pour ce match</h2>
        <NuxtLink to="/clash-bet" class="text-gold text-sm hover:underline">← Retour au lobby</NuxtLink>
      </div>

      <div v-else class="space-y-5">

        <!-- ═══ MATCH BANNER ═══ -->
        <div class="match-banner">
          <div class="flex items-center justify-between pb-3 mb-4 border-b border-white/[0.07]">
            <div class="flex items-center gap-2">
              <span class="badge-live"><span class="dot-live"></span> {{ matchMarkets.length }} MARCHÉS</span>
              <span class="text-[10px] text-white/30 font-mono uppercase">{{
                formatDate(activeMarket?.match?.scheduled_at) }}</span>
            </div>
            <!-- Countdown -->
            <div v-if="countdown"
              class="flex items-center gap-1 px-3 py-1.5 bg-gold/10 border border-gold/30 rounded-xl">
              <span class="text-[9px] text-gold/70 uppercase font-bold">⏰</span>
              <span class="font-mono font-black text-gold text-sm">{{ countdown }}</span>
            </div>
          </div>

          <div class="grid grid-cols-[1fr_auto_1fr] items-center gap-4 py-2">
            <div class="flex flex-col items-center gap-2 text-center">
              <div
                class="w-20 h-20 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center p-3">
                <img :src="activeMarket?.match?.clan_home?.badge_url || '/default-clan.png'"
                  class="max-w-full max-h-full object-contain" @error="$event.target.src = '/default-clan.png'" />
              </div>
              <h2 class="font-black text-sm uppercase leading-tight">{{ activeMarket?.match?.clan_home?.name || 'Équipe A' }}</h2>
            </div>
            <div class="flex flex-col items-center">
              <span class="text-3xl font-black italic text-gold drop-shadow-[0_0_20px_rgba(212,175,55,0.5)]">VS</span>
            </div>
            <div class="flex flex-col items-center gap-2 text-center">
              <div
                class="w-20 h-20 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center p-3">
                <img :src="activeMarket?.match?.clan_away?.badge_url || '/default-clan.png'"
                  class="max-w-full max-h-full object-contain" @error="$event.target.src = '/default-clan.png'" />
              </div>
              <h2 class="font-black text-sm uppercase leading-tight">{{ activeMarket?.match?.clan_away?.name || 'Équipe B' }}</h2>
            </div>
          </div>

        
        </div>

        <!-- ═══ MARCHÉS LISTE ═══ -->
        <div v-for="market in matchMarkets" :key="market.id" class="panel">

          <!-- Titre & catégorie -->
          <div class="flex items-center justify-between border-b border-white/[0.07] pb-3 mb-4">
            <div class="space-y-1">
              <div class="flex items-center gap-2">
                <span
                  class="px-2 py-0.5 bg-gold/10 border border-gold/30 text-gold text-[9px] uppercase font-black rounded">
                  {{ market.category || 'team' }}
                </span>
                <span class="text-[10px] text-white/30 font-mono">Marché #{{ market.id }}</span>
              </div>
              <h3 class="font-black text-base text-white uppercase">{{ market.title }}</h3>
            </div>
            <!-- Badge gagnant si réglé -->
            <div v-if="market.winning_side" class="px-3 py-1.5 rounded-xl border font-black text-xs uppercase"
              :class="market.winning_side === 'YES' ? 'bg-green-500/20 border-green-500/40 text-green-400' : 'bg-red-500/20 border-red-500/40 text-red-400'">
              🏆 {{ market.winning_side }} gagne
            </div>
          </div>

          <!-- ONGLETS YES / NO + bouton créer -->
          <div class="flex items-center justify-between mb-4 gap-3">
            <div class="flex gap-1 bg-white/5 border border-white/10 rounded-xl p-1">
              <button @click="setTab(market.id, 'YES')" :class="['side-tab', getTab(market.id) === 'YES' ? 'yes' : '']">
                👍 OUI (YES)
                <span class="ml-1 px-1.5 py-0.5 text-[8px] rounded-full font-black"
                  :class="getTab(market.id) === 'YES' ? 'bg-green-900/60' : 'bg-white/10'">
                  {{ market.yes_tickets_count || 0 }}
                </span>
              </button>
              <button @click="setTab(market.id, 'NO')" :class="['side-tab', getTab(market.id) === 'NO' ? 'no' : '']">
                👎 NON (NO)
                <span class="ml-1 px-1.5 py-0.5 text-[8px] rounded-full font-black"
                  :class="getTab(market.id) === 'NO' ? 'bg-red-900/60' : 'bg-white/10'">
                  {{ market.no_tickets_count || 0 }}
                </span>
              </button>
            </div>
            <button v-if="isLoggedIn" @click="openCreateModal(market)"
              class="px-4 py-2 bg-gradient-to-r from-gold to-yellow-600 text-black font-black text-xs rounded-xl hover:brightness-110 transition-all whitespace-nowrap">
              + Créer un Ticket
            </button>
          </div>

          <!-- Tableau des tickets disponibles -->
          <div v-if="loadingTickets[market.id]" class="text-center py-6 text-white/40 text-xs animate-pulse">
            Chargement des tickets...
          </div>
          <div v-else-if="!getTickets(market.id).length" class="flex flex-col items-center py-10 text-center">
            <div class="text-3xl mb-2">🎫</div>
            <p class="text-white/40 text-xs">Aucun ticket {{ getTab(market.id) }} disponible.</p>
            <button v-if="isLoggedIn" @click="openCreateModal(market, getTab(market.id))"
              class="mt-3 px-4 py-2 bg-gold/10 border border-gold/30 text-gold text-xs font-bold rounded-xl hover:bg-gold/20">
              Être le premier à parier {{ getTab(market.id) }}
            </button>
          </div>
          <div v-else class="overflow-x-auto">
            <table class="w-full text-xs">
              <thead>
                <tr class="border-b border-white/5">
                  <th class="text-left py-2.5 px-2 text-white/30 font-semibold uppercase text-[9px] tracking-wider">
                    Joueur</th>
                  <th class="text-right py-2.5 px-2 text-white/30 font-semibold uppercase text-[9px] tracking-wider">
                    Mise</th>
                  <th class="text-right py-2.5 px-2 text-white/30 font-semibold uppercase text-[9px] tracking-wider">
                    Cote</th>
                  <th class="text-right py-2.5 px-2 text-white/30 font-semibold uppercase text-[9px] tracking-wider">
                    Potentiel</th>
                  <th class="text-right py-2.5 px-2 text-white/30 font-semibold uppercase text-[9px] tracking-wider">
                    Créé</th>
                  <th class="py-2.5 px-2"></th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="ticket in getTickets(market.id)" :key="ticket.id"
                  class="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors group">
                  <!-- Joueur anonymisé -->
                  <td class="py-3 px-2">
                    <div class="flex items-center gap-2">
                      <div
                        class="w-7 h-7 rounded-full bg-gradient-to-br from-gold/30 to-purple-600/30 border border-white/20 flex items-center justify-center text-[10px] font-black text-white/60">
                        {{ ticket.ticket_number?.slice(-2) || '??' }}
                      </div>
                      <span class="font-mono text-white/50 text-[10px]">Joueur #{{ ticket.creator_id || '???' }}</span>
                    </div>
                  </td>
                  <!-- Mise -->
                  <td class="py-3 px-2 text-right">
                    <span class="font-black text-white tabular-nums">{{ formatFcfa(ticket.amount) }}</span>
                  </td>
                  <!-- Cote -->
                  <td class="py-3 px-2 text-right">
                    <span class="font-black text-gold">{{ ticket.odds ?? '2.00' }}</span>
                  </td>
                  <!-- Potentiel -->
                  <td class="py-3 px-2 text-right">
                    <span class="font-black text-green-400 tabular-nums">{{ formatFcfa(ticket.gross_payout) }}</span>
                  </td>
                  <!-- Créé il y a -->
                  <td class="py-3 px-2 text-right text-white/30 text-[10px] whitespace-nowrap">
                    {{ timeAgo(ticket.created_at) }}
                  </td>
                  <!-- Action -->
                  <td class="py-3 px-2 text-right">
                    <button v-if="isLoggedIn" @click="openMatchConfirm(ticket, market)"
                      class="px-3 py-1.5 bg-gradient-to-r from-gold to-yellow-600 text-black font-black text-[10px] uppercase rounded-lg hover:brightness-110 transition-alltranslate-x-1 group-hover:translate-x-0 duration-200">
                      PRENDRE
                    </button>
                    <NuxtLink v-else to="/login"
                      class="px-3 py-1.5 bg-white/5 text-white/40 text-[10px] font-bold rounded-lg">
                      Connexion
                    </NuxtLink>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>

    <!-- ═══ MODAL CRÉATION DE TICKET ═══ -->
    <Teleport to="body">
      <Transition name="fade-modal">
        <div v-if="createModal.show"
          class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
          @click.self="createModal.show = false">
          <div class="w-full max-w-md bg-[#0d0e14] border border-gold/30 rounded-3xl p-6 shadow-2xl space-y-5">

            <div class="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <span class="text-[10px] text-gold font-bold uppercase">Nouveau Ticket P2P</span>
                <h3 class="text-sm font-black uppercase text-white leading-tight">{{ createModal.market?.title }}</h3>
              </div>
              <button @click="createModal.show = false" class="text-white/30 hover:text-white text-xl">✕</button>
            </div>

            <!-- Choix YES / NO -->
            <div>
              <label class="text-[10px] text-white/50 uppercase font-bold block mb-2">Ma position</label>
              <div class="grid grid-cols-2 gap-3">
                <button @click="createModal.side = 'YES'"
                  :class="['p-4 rounded-2xl border-2 transition-all font-black text-sm uppercase', createModal.side === 'YES' ? 'border-green-500 bg-green-500/15 text-green-400' : 'border-white/10 bg-white/5 text-white/50 hover:border-green-500/40']">
                  👍 OUI (YES)
                </button>
                <button @click="createModal.side = 'NO'"
                  :class="['p-4 rounded-2xl border-2 transition-all font-black text-sm uppercase', createModal.side === 'NO' ? 'border-red-500 bg-red-500/15 text-red-400' : 'border-white/10 bg-white/5 text-white/50 hover:border-red-500/40']">
                  👎 NON (NO)
                </button>
              </div>
            </div>

            <!-- Solde -->
            <div class="flex justify-between text-xs text-white/50 px-1">
              <span>💰 Solde disponible</span>
              <span class="font-bold text-gold">{{ formatFcfa(wallet?.balance || 0) }}</span>
            </div>

            <!-- Montant -->
            <div>
              <label class="text-[10px] text-white/50 uppercase font-bold block mb-1">Montant de la mise</label>
              <div class="relative">
                <input v-model.number="createModal.amount" type="number" min="100" step="100"
                  class="w-full bg-black border border-white/20 rounded-xl px-4 py-3 text-xl font-black text-white focus:border-gold outline-none pr-16" />
                <span class="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-gold">FCFA</span>
              </div>
              <div class="flex gap-2 mt-2 flex-wrap">
                <button v-for="p in [500, 1000, 2000, 5000, 10000]" :key="p" @click="createModal.amount = p"
                  class="quick-btn">
                  {{ p >= 1000 ? (p / 1000) + 'k' : p }}
                </button>
              </div>
            </div>

            <!-- Récap -->
            <div class="p-3 bg-gold/5 border border-gold/20 rounded-xl space-y-1 text-xs">
              <div class="flex justify-between text-white/60">
                <span>Gain brut (×2.00)</span>
                <span class="font-bold">{{ formatFcfa(createModal.amount * 2) }}</span>
              </div>
              <div class="flex justify-between text-white/60">
                <span>Commission ticket</span>
                <span class="font-bold text-green-400">0 FCFA ✅</span>
              </div>
              <div class="flex justify-between font-black text-sm border-t border-white/10 pt-2">
                <span>Gain net potentiel</span>
                <span class="text-green-400">{{ formatFcfa(createModal.amount * 2) }}</span>
              </div>
            </div>

            <button @click="submitCreate" :disabled="submitting || createModal.amount < 100"
              class="w-full py-3.5 bg-gradient-to-r from-gold to-yellow-600 text-black font-black uppercase text-xs rounded-xl shadow-lg hover:brightness-110 disabled:opacity-40 transition-all">
              <span v-if="submitting">⏳ Création...</span>
              <span v-else>Créer le Ticket {{ createModal.side }} — {{ formatFcfa(createModal.amount) }}</span>
            </button>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- ═══ MODAL CONFIRMATION PRISE DE TICKET ═══ -->
    <Teleport to="body">
      <Transition name="fade-modal">
        <div v-if="matchModal.ticket"
          class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
          @click.self="matchModal.ticket = null">
          <div class="w-full max-w-sm bg-[#0d0e14] border border-white/15 rounded-3xl p-6 shadow-2xl space-y-4">

            <h3 class="text-lg font-black text-white border-b border-white/10 pb-3">🤝 Prendre ce Ticket</h3>

            <!-- Ticket sélectionné -->
            <div class="p-3 bg-gold/5 border border-gold/20 rounded-xl space-y-1 text-xs">
              <div class="flex items-center gap-2 mb-2">
                <span class="font-mono text-gold text-[10px] font-black">{{ matchModal.ticket?.ticket_number }}</span>
                <span class="text-white/60 font-bold">{{ matchModal.market?.title }}</span>
              </div>
              <div class="flex justify-between text-white/60">
                <span>Position du créateur</span>
                <span
                  :class="matchModal.ticket?.side === 'YES' ? 'text-green-400 font-black' : 'text-red-400 font-black'">{{
                    matchModal.ticket?.side }}</span>
              </div>
              <div class="flex justify-between text-white/60 border-t border-white/10 pt-1 mt-1">
                <span>Ma position (opposée)</span>
                <span :class="opponentSide === 'YES' ? 'text-green-400 font-black' : 'text-red-400 font-black'">{{
                  opponentSide }}</span>
              </div>
            </div>

            <div class="space-y-2 text-xs">
              <div class="flex justify-between text-white/60">
                <span>Mise à engager</span>
                <span class="font-black text-white">{{ formatFcfa(matchModal.ticket?.amount) }}</span>
              </div>
              <div class="flex justify-between text-white/60">
                <span>Cote</span>
                <span class="font-black text-gold">× 2.00</span>
              </div>
              <div class="flex justify-between font-black text-sm border-t border-white/10 pt-2">
                <span>Gain net si victoire</span>
                <span class="text-green-400">{{ formatFcfa(matchModal.ticket?.net_payout) }}</span>
              </div>
            </div>

            <p class="text-[10px] text-white/30 text-center">
              En confirmant, {{ formatFcfa(matchModal.ticket?.amount) }} sera bloqué jusqu'au règlement.
            </p>

            <div class="flex gap-3">
              <button @click="matchModal.ticket = null"
                class="flex-1 py-3 border border-white/10 text-white/60 font-bold text-xs rounded-2xl hover:bg-white/5">
                Annuler
              </button>
              <button @click="doMatch" :disabled="submitting"
                class="flex-1 py-3 bg-gradient-to-r from-gold to-yellow-600 text-black font-black text-xs rounded-2xl hover:brightness-110 disabled:opacity-50">
                <span v-if="submitting">⏳...</span>
                <span v-else>PRENDRE LE TICKET</span>
              </button>
            </div>

          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- ═══ OVERLAY SUCCÈS ═══ -->
    <Teleport to="body">
      <Transition name="fade-modal">
        <div v-if="successOverlay"
          class="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
          <div class="text-center space-y-4 max-w-sm">
            <div class="text-6xl animate-bounce">🤝</div>
            <h2 class="text-2xl font-black text-white uppercase">TICKET APPARIÉ !</h2>
            <p class="text-white/60 text-sm">Les deux mises sont maintenant bloquées et seront distribuées à l'issue du
              match.</p>
            <button @click="successOverlay = false; router.push('/clash-bet/mes-tickets')"
              class="px-6 py-3 bg-gradient-to-r from-gold to-yellow-600 text-black font-black uppercase rounded-xl hover:brightness-110">
              VOIR MES TICKETS
            </button>
          </div>
        </div>
      </Transition>
    </Teleport>

  </div>
</template>

<script setup>
const route = useRoute();
const router = useRouter();
const { $api, $toast } = useNuxtApp();
const { isLoggedIn } = useAuth();

useHead({ title: 'Marketplace P2P — CCA Clash Bet' });

const matchId = route.params.id;
const loading = ref(true);
const submitting = ref(false);
const matchMarkets = ref([]);
const wallet = ref(null);
const successOverlay = ref(false);

// Tab YES/NO par marché
const marketTabs = ref({});
// Tickets par marché + side
const marketTickets = ref({});
const loadingTickets = ref({});

// Modals
const createModal = ref({ show: false, market: null, side: 'YES', amount: 1000 });
const matchModal = ref({ ticket: null, market: null });

// Countdown
const countdown = ref('');
let countdownInterval = null;

const activeMarket = computed(() => matchMarkets.value[0] || null);
const opponentSide = computed(() => (matchModal.value.ticket?.side === 'YES' ? 'NO' : 'YES'));

const formatFcfa = (n) => {
  if (!n && n !== 0) return '0 FCFA';
  return Number(n).toLocaleString('fr-FR') + ' FCFA';
};

const formatDate = (d) => {
  if (!d) return '—';
  return new Date(d).toLocaleString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
};

const timeAgo = (dateStr) => {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'à l\'instant';
  if (mins < 60) return `${mins} min`;
  if (mins < 1440) return `${Math.floor(mins / 60)}h`;
  return `${Math.floor(mins / 1440)}j`;
};

const getTab = (marketId) => marketTabs.value[marketId] || 'YES';
const setTab = (marketId, side) => {
  marketTabs.value[marketId] = side;
  loadMarketTickets(marketId, side);
};

const getTickets = (marketId) => {
  const side = getTab(marketId);
  return (marketTickets.value[`${marketId}_${side}`] || []);
};

const loadMarketTickets = async (marketId, side) => {
  const key = `${marketId}_${side}`;
  if (loadingTickets.value[key]) return;
  loadingTickets.value[key] = true;
  try {
    const res = await $api(`/clash-bet/markets/${marketId}/tickets`, { params: { side } });
    marketTickets.value[key] = res.data || res || [];
  } catch (e) {
    console.error(e);
    marketTickets.value[key] = [];
  } finally {
    loadingTickets.value[key] = false;
  }
};

const startCountdown = (scheduledAt) => {
  if (!scheduledAt) return;
  countdownInterval = setInterval(() => {
    const diff = new Date(scheduledAt).getTime() - Date.now();
    if (diff <= 0) { countdown.value = 'EN COURS'; clearInterval(countdownInterval); return; }
    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000).toString().padStart(2, '0');
    const m = Math.floor((diff % 3600000) / 60000).toString().padStart(2, '0');
    const s = Math.floor((diff % 60000) / 1000).toString().padStart(2, '0');
    countdown.value = d > 0 ? `${d}J ${h}H ${m}M` : `${h}:${m}:${s}`;
  }, 1000);
};

const openCreateModal = (market, side = null) => {
  if (!isLoggedIn.value) return router.push('/login');
  createModal.value = { show: true, market, side: side || getTab(market.id), amount: 1000 };
};

const openMatchConfirm = (ticket, market) => {
  if (!isLoggedIn.value) return router.push('/login');
  matchModal.value = { ticket, market };
};

const submitCreate = async () => {
  if (!createModal.value.market || createModal.value.amount < 100) return;
  submitting.value = true;
  try {
    await $api('/clash-bet/tickets', {
      method: 'POST',
      body: {
        market_id: createModal.value.market.id,
        side: createModal.value.side,
        amount: createModal.value.amount,
      },
    });
    $toast.success(`🎫 Ticket ${createModal.value.side} créé !`);
    createModal.value.show = false;
    // Recharger les tickets
    await loadMarketTickets(createModal.value.market.id, createModal.value.side);
    // Recharger le marché pour les compteurs
    await refreshMarkets();
  } catch (e) {
    $toast.error(e?.data?.message || 'Erreur lors de la création du ticket.');
  } finally {
    submitting.value = false;
  }
};

const doMatch = async () => {
  if (!matchModal.value.ticket) return;
  submitting.value = true;
  try {
    await $api(`/clash-bet/tickets/${matchModal.value.ticket.id}/match`, { method: 'POST' });
    matchModal.value.ticket = null;
    successOverlay.value = true;
  } catch (e) {
    $toast.error(e?.data?.message || 'Erreur lors du matching.');
  } finally {
    submitting.value = false;
  }
};

const refreshMarkets = async () => {
  const res = await $api('/clash-bet/matches');
  const all = res.data || res || [];
  matchMarkets.value = all.filter(m => {
    // Chercher par match_id dans les données retournées
    return m.match?.id == matchId || m.match_id == matchId;
  });
};

const fetchAll = async () => {
  loading.value = true;
  try {
    const res = await $api('/clash-bet/matches');
    const all = res.data || res || [];
    // Filtrer les marchés du match courant
    matchMarkets.value = all.filter(m => m.match?.id == matchId || String(m.id) === String(matchId));

    if (!matchMarkets.value.length) {
      // Essayer par market ID direct
      try {
        const marketRes = await $api(`/clash-bet/markets/${matchId}`);
        if (marketRes?.market) matchMarkets.value = [marketRes.market];
      } catch { }
    }

    // Initialiser les tabs et charger les tickets YES pour chaque marché
    for (const market of matchMarkets.value) {
      marketTabs.value[market.id] = 'YES';
      await loadMarketTickets(market.id, 'YES');
    }

    // Countdown
    const scheduledAt = activeMarket.value?.match?.scheduled_at;
    if (scheduledAt) startCountdown(scheduledAt);

    // Wallet
    if (isLoggedIn.value) {
      try { wallet.value = await $api('/clash-bet/wallet'); } catch { }
    }
  } catch (e) {
    console.error(e);
  } finally {
    loading.value = false;
  }
};

onMounted(fetchAll);
onUnmounted(() => { if (countdownInterval) clearInterval(countdownInterval); });
</script>

<style scoped>
.match-banner {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.07);
  border-radius: 1.5rem;
  padding: 1.5rem;
}

.panel {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.07);
  border-radius: 1.5rem;
  padding: 1.25rem 1.5rem;
}

.badge-live {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.25rem 0.625rem;
  border-radius: 9999px;
  background: rgba(34, 197, 94, 0.1);
  border: 1px solid rgba(34, 197, 94, 0.25);
  color: #4ade80;
  font-size: 9px;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.dot-live {
  width: 6px;
  height: 6px;
  border-radius: 9999px;
  background: #4ade80;
  display: inline-block;
  animation: ping 1s infinite;
}

.side-tab {
  flex: 1;
  padding: 0.5rem 0.75rem;
  border-radius: 0.625rem;
  font-size: 11px;
  font-weight: 900;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.4);
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.side-tab.yes {
  background: rgba(34, 197, 94, 0.15);
  color: #4ade80;
  box-shadow: 0 0 15px rgba(34, 197, 94, 0.1);
}

.side-tab.no {
  background: rgba(239, 68, 68, 0.15);
  color: #f87171;
  box-shadow: 0 0 15px rgba(239, 68, 68, 0.1);
}

.quick-btn {
  padding: 0.3rem 0.75rem;
  font-size: 11px;
  font-weight: 700;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 0.5rem;
  background: rgba(255, 255, 255, 0.03);
  color: rgba(255, 255, 255, 0.5);
  transition: all 0.2s;
  cursor: pointer;
}

.quick-btn:hover {
  border-color: rgba(212, 175, 55, 0.4);
  color: #d4af37;
}

.fade-modal-enter-active,
.fade-modal-leave-active {
  transition: opacity 0.2s;
}

.fade-modal-enter-from,
.fade-modal-leave-to {
  opacity: 0;
}

@keyframes ping {

  0%,
  100% {
    opacity: 1;
  }

  50% {
    opacity: 0.3;
  }
}
</style>
