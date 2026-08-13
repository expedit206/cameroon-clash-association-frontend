<template>
  <div class="min-h-screen bg-[#06070a] text-white pb-12 pt-6">
    <div class="container mx-auto px-1 max-w-3xl">

      <div class="flex items-center justify-between mb-6">
        <NuxtLink to="/clash-bet"
          class="inline-flex items-center gap-1.5 text-[11px] text-white/40 hover:text-gold transition-colors">
          ← Retour aux marchés
        </NuxtLink>
        <NuxtLink to="/clash-bet/wallet"
          class="inline-flex items-center gap-2 px-3 py-1.5 bg-gold/10 border border-gold/20 text-gold text-xs font-black rounded-xl hover:bg-gold/20 transition-all">
          💰 {{ formatFcfa(wallet?.balance || 0) }}
        </NuxtLink>
      </div>

      <div class="mb-6">
        <h1 class="text-2xl font-black italic uppercase">🎫 Mes Tickets</h1>
        <p class="text-white/30 text-xs mt-1">Retrouvez tous vos paris P2P et leur état en temps réel.</p>
      </div>

      <!-- ═══ FILTRE PAR STATUT ═══ -->
      <div class="flex gap-2 flex-wrap mb-5">
        <button v-for="f in filters" :key="f.key" @click="activeFilter = f.key; fetchTickets()"
          :class="['filter-btn', activeFilter === f.key ? 'active' : '']">
          {{ f.label }}
          <span v-if="counts[f.key] > 0" class="ml-1 text-[8px] opacity-70">({{ counts[f.key] }})</span>
        </button>
      </div>

      <!-- Loader -->
      <div v-if="loading" class="space-y-3">
        <div v-for="n in 4" :key="n" class="ticket-card animate-pulse">
          <div class="h-4 bg-white/10 rounded w-36 mb-3"></div>
          <div class="grid grid-cols-2 gap-2">
            <div class="h-8 bg-white/5 rounded"></div>
            <div class="h-8 bg-white/5 rounded"></div>
          </div>
        </div>
      </div>

      <!-- Empty -->
      <div v-else-if="tickets.length === 0" class="flex flex-col items-center py-20 text-center">
        <div class="text-5xl mb-4">🎫</div>
        <h3 class="text-lg font-black mb-2">Aucun ticket dans cette catégorie</h3>
        <p class="text-white/40 text-sm mb-5">
          {{ activeFilter === 'all' ? 'Vous n\'avez pas encore de ticket. Commencez à parier !' : 'Aucun ticket dans cet état.' }}
        </p>
        <NuxtLink to="/clash-bet"
          class="px-5 py-2.5 bg-gradient-to-r from-gold to-yellow-600 text-black font-black text-sm rounded-xl">
          Voir les Matchs
        </NuxtLink>
      </div>

      <!-- Tickets List Compact (Style 1xBet Minimaliste) -->
      <div v-else class="space-y-2">
        <div v-for="ticket in tickets" :key="ticket.id"
          class="bg-[#0b0c12] border border-white/10 hover:border-gold/30 rounded-xl p-3 space-y-2 transition-all">

          <!-- Ligne 1 : Top Header (N° Ticket, Statut & Date) -->
          <div class="flex items-center justify-between text-[10px] pb-1.5 border-b border-white/5">
            <div class="flex items-center gap-2">
              <span class="font-mono text-gold font-bold">#{{ ticket.ticket_number }}</span>
              <span :class="getStatusBadgeClass(ticket.status)">{{ statusLabel(ticket.status) }}</span>
            </div>
            <span class="text-white/30 text-[9px]">{{ formatDate(ticket.created_at) }}</span>
          </div>

          <!-- Ligne 2 : Détails du Pari & Cotes (Horizontal Minimaliste) -->
          <div class="flex items-center justify-between gap-3">
            <div class="min-w-0 flex-1">
              <div class="text-xs font-black text-white ">
                {{ ticket.market_title || (ticket.match?.home + ' vs ' + ticket.match?.away) }}
              </div>
              <div class="text-[10px] text-white/40 ">
                {{ ticket.match?.home }} vs {{ ticket.match?.away }}
              </div>
            </div>

            <!-- Side (YES/NO) & Cote -->
            <div class="flex items-center gap-2 flex-shrink-0">
              <span
                :class="['px-2 py-0.5 rounded text-[10px] font-black uppercase', ticket.my_side === 'YES' ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30']">
                {{ ticket.my_side === 'YES' ? '👍 OUI' : '👎 NON' }}
              </span>
            </div>
          </div>

          <!-- Ligne 3 : Montants & Actions (Barre Basse Compacte) -->
          <div class="flex items-center justify-between pt-1 text-[10px] bg-white/[0.02] p-2 rounded-lg">
            <div class="flex items-center gap-3">
              <div>
                <span class="text-white/30 uppercase text-[8px] block">Mise</span>
                <span class="font-black text-white tabular-nums">{{ formatFcfa(ticket.amount) }}</span>
              </div>
              <div>
                <span class="text-green-400/60 uppercase text-[8px] block">Gain Net</span>
                <span class="font-black text-green-400 tabular-nums">{{ formatFcfa(ticket.net_payout) }}</span>
              </div>
              <div v-if="ticket.status === 'settled'">
                <span :class="['font-black text-[10px]', ticket.is_winner ? 'text-green-400' : 'text-red-400']">
                  {{ ticket.is_winner ? '🏆 GAGNÉ' : '😔 PERDU' }}
                </span>
              </div>
            </div>

            <!-- Annuler si open -->
            <button v-if="ticket.status === 'open'" @click="cancelTicket(ticket)" :disabled="cancelling === ticket.id"
              class="px-2.5 py-1 bg-red-500/10 border border-red-500/30 text-red-400 text-[10px] font-bold rounded-lg hover:bg-red-500/20 transition-all disabled:opacity-40">
              <span v-if="cancelling === ticket.id">...</span>
              <span v-else>🗑 Annuler</span>
            </button>
          </div>

        </div>
      </div>

      <!-- Pagination -->
      <div v-if="meta.last_page > 1" class="flex justify-center gap-2 mt-4">
        <button @click="fetchTickets(meta.current_page - 1)" :disabled="meta.current_page <= 1"
          class="px-3 py-1 text-xs border border-white/10 rounded-lg text-white/40 hover:text-gold disabled:opacity-30">←</button>
        <span class="px-3 py-1 text-xs text-white/40">{{ meta.current_page }} / {{ meta.last_page }}</span>
        <button @click="fetchTickets(meta.current_page + 1)" :disabled="meta.current_page >= meta.last_page"
          class="px-3 py-1 text-xs border border-white/10 rounded-lg text-white/40 hover:text-gold disabled:opacity-30">→</button>
      </div>
    </div>

  </div>
</template>

<script setup>
definePageMeta({
  alias: ['/clash-bet/mes-tickets'],
});

const { $api, $toast } = useNuxtApp();
useHead({ title: 'Mes Tickets — CCA Clash Bet P2P' });

const loading = ref(true);
const cancelling = ref(null);
const tickets = ref([]);
const wallet = ref(null);
const counts = ref({});
const activeFilter = ref('all');
const meta = ref({ current_page: 1, last_page: 1, total: 0 });

const filters = [
  { key: 'all', label: 'Tous' },
  { key: 'open', label: '🟡 Ouverts' },
  { key: 'matched', label: '🔵 Appariés' },
  { key: 'settled', label: '✅ Terminés' },
  { key: 'cancelled', label: '❌ Annulés' },
  { key: 'refunded', label: '↩️ Remboursés' },
];

const statusLabel = (s) => ({
  open: '⏳ En attente',
  matched: '🔵 EN COURS',
  locked: '🔒 VERROUILLÉ',
  settled: '✅ RÉGLÉ',
  cancelled: '❌ ANNULÉ',
  refunded: '↩️ REMBOURSÉ',
}[s] || s);

const getStatusBadgeClass = (s) => ({
  open: 'px-2 py-0.5 bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 rounded font-black text-[9px]',
  matched: 'px-2 py-0.5 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded font-black text-[9px]',
  locked: 'px-2 py-0.5 bg-purple-500/10 text-purple-400 border border-purple-500/20 rounded font-black text-[9px]',
  settled: 'px-2 py-0.5 bg-green-500/10 text-green-400 border border-green-500/20 rounded font-black text-[9px]',
  cancelled: 'px-2 py-0.5 bg-red-500/10 text-red-400 border border-red-500/20 rounded font-black text-[9px]',
  refunded: 'px-2 py-0.5 bg-gray-500/10 text-gray-400 border border-gray-500/20 rounded font-black text-[9px]',
}[s] || 'px-2 py-0.5 bg-white/10 text-white/50 rounded font-bold text-[9px]');

const formatFcfa = (n) => {
  if (!n && n !== 0) return '0 FCFA';
  return Number(n).toLocaleString('fr-FR') + ' FCFA';
};

const formatDate = (d) => {
  if (!d) return '—';
  return new Date(d).toLocaleString('fr-FR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
};

const fetchTickets = async (page = 1) => {
  loading.value = true;
  try {
    const params = { page };
    if (activeFilter.value !== 'all') params.status = activeFilter.value;
    const res = await $api('/clash-bet/my-tickets', { params });
    tickets.value = res.data || res || [];
    if (res.meta) meta.value = res.meta;
    else if (res.last_page) meta.value = { current_page: res.current_page, last_page: res.last_page, total: res.total };
  } catch (e) {
    console.error(e);
  } finally {
    loading.value = false;
  }
};

const buildCounts = async () => {
  try {
    const statuses = ['open', 'matched', 'settled'];
    await Promise.all(statuses.map(async (s) => {
      const res = await $api('/clash-bet/my-tickets', { params: { status: s, page: 1 } });
      counts.value[s] = res.meta?.total || res.total || 0;
    }));
  } catch { }
};

const cancelTicket = async (ticket) => {
  cancelling.value = ticket.id;
  try {
    await $api(`/clash-bet/tickets/${ticket.id}/cancel`, { method: 'POST' });
    $toast.success(`Ticket annulé — ${formatFcfa(ticket.amount)} remboursés.`);
    fetchTickets();
  } catch (e) {
    $toast.error(e?.data?.message || 'Impossible d\'annuler ce ticket.');
  } finally {
    cancelling.value = null;
  }
};

const fetchWallet = async () => {
  try { wallet.value = await $api('/clash-bet/wallet'); } catch { }
};

onMounted(() => {
  fetchTickets();
  buildCounts();
  fetchWallet();
});
</script>

<style scoped>
.filter-btn {
  @apply px-3 py-1.5 text-[10px] font-bold border border-white/10 rounded-lg text-white/40 hover:border-gold/30 hover:text-gold transition-all;
}

.filter-btn.active {
  @apply border-gold/50 text-gold bg-gold/10;
}

.ticket-card {
  @apply bg-white/[0.02] border border-white/[0.08] rounded-2xl p-4;
}

.status-badge {
  @apply inline-flex items-center px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-wider;
}

.status-badge.open {
  @apply bg-amber-500/10 border border-amber-500/25 text-amber-400;
}

.status-badge.matched {
  @apply bg-blue-500/10 border border-blue-500/25 text-blue-400;
}

.status-badge.locked {
  @apply bg-purple-500/10 border border-purple-500/25 text-purple-400;
}

.status-badge.settled {
  @apply bg-green-500/10 border border-green-500/25 text-green-400;
}

.status-badge.cancelled {
  @apply bg-red-500/10 border border-red-500/25 text-red-400;
}

.status-badge.refunded {
  @apply bg-white/5 border border-white/15 text-white/40;
}
</style>
