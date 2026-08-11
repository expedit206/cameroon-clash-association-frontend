<template>
  <div class="admin-bet-page min-h-screen bg-[#06070a] text-white pb-16 pt-24">
    <div class="container mx-auto px-4 max-w-6xl">
      <!-- Admin Header -->
      <div class="flex items-center justify-between gap-4 mb-8">
        <div>
          <span class="text-xs text-gold font-bold uppercase tracking-widest">⚙️ Administration</span>
          <h1 class="text-3xl font-black italic uppercase text-white tracking-tight">
            GESTION <span class="text-gold">CCA CLASH BET</span>
          </h1>
        </div>
        <NuxtLink to="/admin/dashboard" class="text-xs text-white/50 hover:text-white">
          ← Dashboard Admin
        </NuxtLink>
      </div>

      <!-- Stats KPIs Grid -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div class="glass-card !p-5 border-gold/20 bg-gold/5">
          <div class="text-[10px] text-white/40 uppercase tracking-widest mb-1">Volume des Pots</div>
          <div class="text-xl font-black text-gold italic">{{ formatFcfa(stats.total_pool_volume) }}</div>
        </div>

        <div class="glass-card !p-5 border-white/10">
          <div class="text-[10px] text-white/40 uppercase tracking-widest mb-1">Marchés Ouverts</div>
          <div class="text-xl font-black text-white italic">{{ stats.open_markets || 0 }} / {{ stats.total_markets || 0 }}</div>
        </div>

        <div class="glass-card !p-5 border-white/10">
          <div class="text-[10px] text-white/40 uppercase tracking-widest mb-1">Retraits en Attente</div>
          <div class="text-xl font-black text-amber-400 italic">{{ stats.pending_withdrawals || 0 }}</div>
        </div>

        <div class="glass-card !p-5 border-white/10">
          <div class="text-[10px] text-white/40 uppercase tracking-widest mb-1">Revenus CCA (7% Retraits)</div>
          <div class="text-xl font-black text-green-400 italic">+{{ formatFcfa(stats.total_fees_collected) }}</div>
        </div>
      </div>

      <!-- Main Admin Sections: Tabs (Marchés / Retraits / Créer) -->
      <div class="flex flex-wrap items-center justify-between gap-4 mb-6 border-b border-white/10 pb-4">
        <div class="flex gap-2">
          <button
            @click="activeSection = 'markets'"
            :class="[
              'px-4 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all',
              activeSection === 'markets' ? 'bg-gold text-black' : 'bg-white/5 text-white/60 hover:text-white'
            ]"
          >
            📊 Marchés ({{ markets.length }})
          </button>
          <button
            @click="activeSection = 'withdrawals'"
            :class="[
              'px-4 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all relative',
              activeSection === 'withdrawals' ? 'bg-gold text-black' : 'bg-white/5 text-white/60 hover:text-white'
            ]"
          >
            📤 Retraits à traiter
            <span v-if="stats.pending_withdrawals > 0" class="ml-1 px-1.5 py-0.5 text-[9px] bg-red-500 text-white rounded-full font-bold">
              {{ stats.pending_withdrawals }}
            </span>
          </button>
        </div>

        <button
          @click="openCreateModal"
          class="px-4 py-2 bg-gradient-to-r from-gold to-yellow-600 text-black font-black uppercase text-xs rounded-lg hover:shadow-[0_0_15px_rgba(212,175,55,0.4)] transition-all flex items-center gap-1"
        >
          ➕ Créer un Marché
        </button>
      </div>

      <!-- SECTION 1: Liste des Marchés -->
      <div v-if="activeSection === 'markets'" class="space-y-4">
        <div v-if="loadingMarkets" class="text-center text-white/40 py-8">Chargement des marchés...</div>

        <div v-else-if="markets.length === 0" class="glass-card !p-8 text-center text-white/40 text-xs">
          Aucun marché disponible. Cliquez sur "Créer un Marché" pour ouvrir les prédictions sur un match CCA.
        </div>

        <div v-else class="grid grid-cols-1 gap-4">
          <div
            v-for="market in markets"
            :key="market.id"
            class="glass-card !p-6 border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
          >
            <!-- Info Match & Pot -->
            <div class="space-y-2 flex-1">
              <div class="flex items-center gap-3">
                <span :class="getStatusBadgeClass(market.status)">
                  {{ market.status }}
                </span>
                <span class="text-xs text-white/40 font-mono">Marché #{{ market.id }}</span>
                <span class="text-xs text-white/30">• {{ market.bets_count }} paris placés</span>
              </div>

              <div class="text-lg font-black uppercase text-white tracking-wide">
                {{ market.match?.home || 'Équipe A' }}
                <span class="text-gold italic mx-1">VS</span>
                {{ market.match?.away || 'Équipe B' }}
              </div>

              <div class="flex items-center gap-4 text-xs text-white/60">
                <span>Pot Total : <strong class="text-gold">{{ formatFcfa(market.total_pool) }}</strong></span>
                <span>Fermeture : {{ formatDate(market.betting_closes_at) }}</span>
              </div>

              <!-- Options Odds Display -->
              <div class="flex gap-4 pt-2">
                <div v-for="opt in market.options" :key="opt.id" class="px-3 py-1.5 bg-white/5 rounded-lg border border-white/10 text-xs">
                  <span class="text-white/60 mr-2">{{ opt.label }} :</span>
                  <strong class="text-gold font-bold font-mono">{{ opt.current_odds.toFixed(2) }}</strong>
                  <span class="text-[9px] text-white/30 ml-2">({{ formatFcfa(opt.current_pool) }})</span>
                </div>
              </div>
            </div>

            <!-- Actions Admin sur le marché -->
            <div class="flex flex-wrap items-center gap-2">
              <button
                v-if="market.status === 'open'"
                @click="updateMarketStatus(market, 'suspended')"
                class="px-3 py-2 bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-lg text-xs font-bold hover:bg-amber-500/30"
              >
                ⏸️ Suspendre
              </button>

              <button
                v-if="market.status === 'suspended'"
                @click="updateMarketStatus(market, 'open')"
                class="px-3 py-2 bg-green-500/20 text-green-300 border border-green-500/30 rounded-lg text-xs font-bold hover:bg-green-500/30"
              >
                ▶️ Rouvrir
              </button>

              <button
                v-if="market.status === 'open' || market.status === 'suspended'"
                @click="openSettleModal(market)"
                class="px-3 py-2 bg-gold text-black font-black rounded-lg text-xs hover:shadow-[0_0_15px_rgba(212,175,55,0.4)]"
              >
                🏆 Régler & Distribuer
              </button>

              <button
                v-if="market.status !== 'settled' && market.status !== 'cancelled'"
                @click="cancelMarket(market)"
                class="px-3 py-2 bg-red-500/20 text-red-300 border border-red-500/30 rounded-lg text-xs font-bold hover:bg-red-500/30"
              >
                ❌ Annuler
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- SECTION 2: Traitement des Retraits -->
      <div v-if="activeSection === 'withdrawals'" class="space-y-4">
        <div v-if="loadingWithdrawals" class="text-center text-white/40 py-8">Chargement des demandes...</div>

        <div v-else-if="withdrawals.length === 0" class="glass-card !p-8 text-center text-white/40 text-xs">
          Aucune demande de retrait en attente.
        </div>

        <div v-else class="overflow-x-auto glass-card !p-6">
          <table class="w-full text-left text-xs">
            <thead>
              <tr class="border-b border-white/10 text-white/40 uppercase font-mono">
                <th class="py-3 px-2">Utilisateur</th>
                <th class="py-3 px-2">Montant Brut</th>
                <th class="py-3 px-2">Frais (7%)</th>
                <th class="py-3 px-2">Montant Net à verser</th>
                <th class="py-3 px-2">Opérateur</th>
                <th class="py-3 px-2">Numéro MoMo</th>
                <th class="py-3 px-2">Statut</th>
                <th class="py-3 px-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="w in withdrawals" :key="w.id" class="border-b border-white/5 hover:bg-white/5">
                <td class="py-3 px-2 font-bold text-white">{{ w.user?.name }} (ID #{{ w.user_id }})</td>
                <td class="py-3 px-2 font-mono font-bold">{{ formatFcfa(w.amount) }}</td>
                <td class="py-3 px-2 font-mono text-amber-400">-{{ formatFcfa(w.fee) }}</td>
                <td class="py-3 px-2 font-mono font-black text-green-400 text-sm">{{ formatFcfa(w.net_amount) }}</td>
                <td class="py-3 px-2 uppercase font-bold text-white/70">{{ w.payment_method }}</td>
                <td class="py-3 px-2 font-mono font-bold text-gold">{{ w.phone_number }}</td>
                <td class="py-3 px-2">
                  <span :class="w.status === 'pending' ? 'text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded font-bold' : 'text-white/40'">
                    {{ w.status }}
                  </span>
                </td>
                <td class="py-3 px-2">
                  <div v-if="w.status === 'pending'" class="flex gap-2">
                    <button
                      @click="processWithdrawal(w, 'approve')"
                      class="px-2 py-1 bg-green-500 text-black font-bold rounded text-[10px]"
                    >
                      ✓ Valider
                    </button>
                    <button
                      @click="processWithdrawal(w, 'reject')"
                      class="px-2 py-1 bg-red-500/20 text-red-300 border border-red-500/30 rounded text-[10px]"
                    >
                      ✕ Rejeter
                    </button>
                  </div>
                  <span v-else class="text-white/30 text-[10px]">—</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Modale Création de Marché -->
    <div v-if="showCreateModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div class="glass-card !p-8 border-gold/30 max-w-md w-full space-y-6">
        <h3 class="font-black text-lg uppercase text-white">Créer un marché de prédiction</h3>

        <div>
          <label class="block text-xs font-bold text-white/60 uppercase mb-1">Sélectionner un match CCA</label>
          <select v-model="createForm.match_id" class="w-full bg-black border border-white/20 rounded-xl px-4 py-3 text-white text-xs font-bold">
            <option v-for="m in availableMatches" :key="m.id" :value="m.id">
              Match #{{ m.id }} : {{ m.clan_home }} VS {{ m.clan_away }}
            </option>
          </select>
        </div>

        <div>
          <label class="block text-xs font-bold text-white/60 uppercase mb-1">Poids de liquidité (Bonding Curve)</label>
          <input v-model.number="createForm.liquidity_weight" type="number" step="10000" class="w-full bg-black border border-white/20 rounded-xl px-4 py-3 text-white font-mono text-sm" />
          <p class="text-[10px] text-white/40 mt-1">Par défaut : 100 000 (amortit les premières mises).</p>
        </div>

        <div class="flex gap-3 pt-4">
          <button @click="submitCreateMarket" class="flex-1 py-3 bg-gold text-black font-black uppercase text-xs rounded-xl">
            Créer le marché
          </button>
          <button @click="showCreateModal = false" class="py-3 px-4 bg-white/10 text-white font-bold text-xs rounded-xl">
            Annuler
          </button>
        </div>
      </div>
    </div>

    <!-- Modale Règlement du Marché -->
    <div v-if="settleMarketTarget" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div class="glass-card !p-8 border-gold/30 max-w-md w-full space-y-6">
        <h3 class="font-black text-lg uppercase text-white">Règlement du Marché #{{ settleMarketTarget.id }}</h3>

        <p class="text-xs text-white/70">
          Sélectionnez le clan vainqueur pour distribuer 100% du pool aux gagnants :
        </p>

        <div class="space-y-3">
          <button
            v-for="opt in settleMarketTarget.options"
            :key="opt.id"
            @click="submitSettleMarket(opt.id)"
            class="w-full p-4 bg-white/5 border border-white/10 hover:border-gold hover:bg-gold/10 rounded-xl text-left font-black uppercase text-sm flex items-center justify-between text-white"
          >
            <span>🏆 {{ opt.label }}</span>
            <span class="text-gold font-mono">{{ formatFcfa(opt.current_pool) }}</span>
          </button>
        </div>

        <button @click="settleMarketTarget = null" class="w-full py-3 bg-white/10 text-white font-bold text-xs rounded-xl">
          Fermer sans régler
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
const { $api, $toast } = useNuxtApp();

useHead({
  title: "Admin Clash Bet — CCA National League",
});

const activeSection = ref("markets");
const stats = ref({});
const markets = ref([]);
const withdrawals = ref([]);
const availableMatches = ref([]);

const loadingMarkets = ref(true);
const loadingWithdrawals = ref(true);

const showCreateModal = ref(false);
const createForm = ref({
  match_id: null,
  liquidity_weight: 100000,
});

const settleMarketTarget = ref(null);

const formatFcfa = (n) => {
  if (!n && n !== 0) return "0 FCFA";
  return n.toLocaleString("fr-FR") + " FCFA";
};

const formatDate = (d) => {
  if (!d) return "-";
  return new Date(d).toLocaleString("fr-FR", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getStatusBadgeClass = (s) => {
  const classes = {
    open: "bg-green-500/10 text-green-400 border border-green-500/30 px-2 py-0.5 rounded text-[10px] font-bold uppercase",
    suspended: "bg-amber-500/10 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded text-[10px] font-bold uppercase",
    closed: "bg-blue-500/10 text-blue-400 border border-blue-500/30 px-2 py-0.5 rounded text-[10px] font-bold uppercase",
    settled: "bg-gold/10 text-gold border border-gold/30 px-2 py-0.5 rounded text-[10px] font-bold uppercase",
    cancelled: "bg-red-500/10 text-red-400 border border-red-500/30 px-2 py-0.5 rounded text-[10px] font-bold uppercase",
  };
  return classes[s] || "bg-white/5 text-white";
};

const fetchStats = async () => {
  try {
    stats.value = await $api("/admin/clash-bet/stats");
  } catch (e) {
    console.error("Erreur stats :", e);
  }
};

const fetchMarkets = async () => {
  loadingMarkets.value = true;
  try {
    const res = await $api("/admin/clash-bet/markets");
    markets.value = res.data || res || [];
  } catch (e) {
    console.error("Erreur admin marchés :", e);
  } finally {
    loadingMarkets.value = false;
  }
};

const fetchWithdrawals = async () => {
  loadingWithdrawals.value = true;
  try {
    const res = await $api("/admin/clash-bet/withdrawals");
    withdrawals.value = res.data || res || [];
  } catch (e) {
    console.error("Erreur admin retraits :", e);
  } finally {
    loadingWithdrawals.value = false;
  }
};

const openCreateModal = async () => {
  try {
    availableMatches.value = await $api("/admin/clash-bet/available-matches");
    if (availableMatches.value.length > 0) {
      createForm.value.match_id = availableMatches.value[0].id;
    }
    showCreateModal.value = true;
  } catch (e) {
    $toast.error("Impossible de charger les matchs disponibles.");
  }
};

const submitCreateMarket = async () => {
  if (!createForm.value.match_id) return;
  try {
    await $api("/admin/clash-bet/markets", {
      method: "POST",
      body: createForm.value,
    });
    $toast.success("Marché créé avec succès !");
    showCreateModal.value = false;
    fetchMarkets();
    fetchStats();
  } catch (e) {
    $toast.error(e?.data?.message || "Erreur création marché.");
  }
};

const updateMarketStatus = async (market, newStatus) => {
  try {
    await $api(`/admin/clash-bet/markets/${market.id}/status`, {
      method: "PUT",
      body: { status: newStatus },
    });
    $toast.success(`Statut du marché #${market.id} mis à jour : ${newStatus}`);
    fetchMarkets();
  } catch (e) {
    $toast.error("Erreur mise à jour statut.");
  }
};

const openSettleModal = (market) => {
  settleMarketTarget.value = market;
};

const submitSettleMarket = async (winningOptionId) => {
  if (!settleMarketTarget.value) return;
  try {
    const res = await $api(`/admin/clash-bet/markets/${settleMarketTarget.value.id}/settle`, {
      method: "POST",
      body: { winning_option_id: winningOptionId },
    });
    $toast.success(res.message || "Marché réglé et gains distribués !");
    settleMarketTarget.value = null;
    fetchMarkets();
    fetchStats();
  } catch (e) {
    $toast.error(e?.data?.message || "Erreur règlement du marché.");
  }
};

const cancelMarket = async (market) => {
  const reason = prompt("Raison de l'annulation du marché (remboursement intégral) :");
  if (!reason) return;

  try {
    await $api(`/admin/clash-bet/markets/${market.id}/cancel`, {
      method: "POST",
      body: { reason },
    });
    $toast.success("Marché annulé et tous les paris remboursés.");
    fetchMarkets();
    fetchStats();
  } catch (e) {
    $toast.error("Erreur annulation marché.");
  }
};

const processWithdrawal = async (withdrawal, action) => {
  const note = prompt(action === 'approve' ? "Note d'approbation (optionnel) :" : "Motif du rejet (rembourse le solde de l'utilisateur) :");
  if (action === 'reject' && !note) return;

  try {
    const res = await $api(`/admin/clash-bet/withdrawals/${withdrawal.id}/process`, {
      method: "PUT",
      body: { action, admin_note: note },
    });
    $toast.success(res.message);
    fetchWithdrawals();
    fetchStats();
  } catch (e) {
    $toast.error("Erreur traitement du retrait.");
  }
};

onMounted(() => {
  fetchStats();
  fetchMarkets();
  fetchWithdrawals();
});
</script>
