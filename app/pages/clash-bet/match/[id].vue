<template>
  <div class="min-h-screen bg-[#06070a] text-white pb-20 pt-24">
    <div class="container mx-auto px-4 max-w-3xl">

      <!-- Breadcrumb -->
      <NuxtLink to="/clash-bet" class="inline-flex items-center gap-1.5 text-[11px] text-white/40 hover:text-gold transition-colors mb-6">
        ← Retour au Lobby
      </NuxtLink>

      <!-- Loader -->
      <div v-if="loading" class="space-y-4 animate-pulse">
        <div class="h-48 bg-white/[0.03] border border-white/[0.06] rounded-3xl"></div>
        <div class="h-64 bg-white/[0.03] border border-white/[0.06] rounded-3xl"></div>
      </div>

      <!-- No market -->
      <div v-else-if="!market" class="flex flex-col items-center py-24 text-center">
        <span class="text-5xl mb-4">🔒</span>
        <h2 class="text-xl font-black mb-2">Marché introuvable ou fermé</h2>
        <NuxtLink to="/clash-bet" class="text-gold text-sm hover:underline">← Retour au lobby</NuxtLink>
      </div>

      <div v-else class="space-y-5">

        <!-- ═══ MATCH BANNER ═══ -->
        <div class="match-banner">
          <!-- Header -->
          <div class="flex items-center justify-between pb-4 mb-4 border-b border-white/[0.07]">
            <div class="flex items-center gap-2">
              <span class="badge-live"><span class="dot-live"></span>EN DIRECT</span>
              <span class="text-[10px] text-white/30 uppercase tracking-wider">Round {{ market.match?.round || 1 }}</span>
            </div>
            <div class="text-[10px] text-white/30 font-mono">
              POT : <span class="text-gold font-black">{{ formatFcfa(market.total_pool) }}</span>
            </div>
          </div>

          <!-- Duel -->
          <div class="grid grid-cols-[1fr_auto_1fr] items-center gap-4 py-2">
            <!-- Home Clan -->
            <div class="flex flex-col items-center gap-2 text-center">
              <div class="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center p-3">
                <img :src="market.match?.clan_home?.badge_url || '/default-clan.png'" class="max-w-full max-h-full object-contain drop-shadow-lg" @error="$event.target.src='/default-clan.png'" />
              </div>
              <h2 class="font-black text-sm sm:text-base uppercase leading-tight max-w-[100px]">
                {{ market.match?.clan_home?.name || 'Équipe A' }}
              </h2>
              <span class="text-[10px] text-white/30">Niv. {{ market.match?.clan_home?.clan_level || '?' }}</span>
            </div>

            <!-- VS -->
            <div class="flex flex-col items-center gap-1">
              <span class="text-3xl sm:text-4xl font-black italic text-gold drop-shadow-[0_0_20px_rgba(212,175,55,0.5)]">VS</span>
              <span class="text-[9px] text-white/20 uppercase tracking-widest">Match Officiel</span>
            </div>

            <!-- Away Clan -->
            <div class="flex flex-col items-center gap-2 text-center">
              <div class="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center p-3">
                <img :src="market.match?.clan_away?.badge_url || '/default-clan.png'" class="max-w-full max-h-full object-contain drop-shadow-lg" @error="$event.target.src='/default-clan.png'" />
              </div>
              <h2 class="font-black text-sm sm:text-base uppercase leading-tight max-w-[100px]">
                {{ market.match?.clan_away?.name || 'Équipe B' }}
              </h2>
              <span class="text-[10px] text-white/30">Niv. {{ market.match?.clan_away?.clan_level || '?' }}</span>
            </div>
          </div>
        </div>

        <!-- ═══ OPTION SELECTOR ═══ -->
        <div class="panel">
          <h3 class="panel-title">🎯 Choisissez <span class="text-gold">votre vainqueur</span></h3>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
            <button
              v-for="option in market.options" :key="option.id"
              @click="selectOption(option)"
              :class="['option-card', selectedOption?.id === option.id ? 'selected' : '']"
            >
              <div class="text-left flex-1">
                <div class="font-black text-sm uppercase">{{ option.label }}</div>
                <div class="text-[10px] text-white/40 mt-0.5">Misés : {{ formatFcfa(option.current_pool) }}</div>
              </div>
              <div class="text-right flex-shrink-0">
                <div class="text-2xl font-black text-gold">{{ (option.current_odds ?? 2.00).toFixed(2) }}</div>
                <div class="text-[9px] text-white/30 uppercase tracking-wider">Cote actuelle</div>
              </div>
              <div v-if="selectedOption?.id === option.id" class="selected-check">✓</div>
            </button>
          </div>
        </div>

        <!-- ═══ BET FORM (shown when option selected) ═══ -->
        <Transition name="slide-up">
          <div v-if="selectedOption" class="panel">
            <div class="flex items-center justify-between mb-4">
              <h3 class="panel-title">💰 Mise sur <span class="text-gold">{{ selectedOption.label }}</span></h3>
              <span class="text-xs text-white/50">
                Solde : <strong class="text-gold">{{ formatFcfa(wallet?.balance || 0) }}</strong>
              </span>
            </div>

            <!-- Amount input -->
            <div class="relative mb-3">
              <input
                v-model.number="amount" type="number" min="100" step="100"
                placeholder="Montant à miser..."
                class="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-4 text-2xl font-black text-white focus:border-gold/50 focus:outline-none focus:ring-1 focus:ring-gold/20 transition-all pr-20"
                @input="previewOdds"
              />
              <span class="absolute right-5 top-1/2 -translate-y-1/2 text-xs font-bold text-gold">FCFA</span>
            </div>

            <!-- Quick amounts -->
            <div class="flex gap-2 flex-wrap mb-5">
              <button v-for="preset in [500, 1000, 2500, 5000, 10000]" :key="preset"
                @click="setAmount(preset)"
                :class="['quick-btn', amount === preset ? 'active' : '']">
                {{ preset >= 1000 ? (preset/1000)+'k' : preset }}
              </button>
              <button @click="setAmount(wallet?.balance || 0)" class="quick-btn ml-auto border-gold/30 text-gold/70 hover:text-gold">
                MAX
              </button>
            </div>

            <!-- Bet Summary Box -->
            <div class="p-4 bg-black/40 rounded-2xl border border-white/[0.07] space-y-2.5 mb-4">
              <div class="flex justify-between text-xs text-white/50">
                <span>Cote au clic</span>
                <span class="font-mono font-bold text-white">{{ selectedOption.current_odds.toFixed(2) }}</span>
              </div>
              <div class="flex justify-between text-xs text-white/50">
                <span>Cote estimée (après mise)</span>
                <span :class="['font-mono font-bold', hasSlippageWarning ? 'text-amber-400' : 'text-white']">
                  {{ simulatedOdds ? simulatedOdds.toFixed(2) : selectedOption.current_odds.toFixed(2) }}
                </span>
              </div>
              <div class="flex justify-between items-center pt-2.5 border-t border-white/[0.08]">
                <span class="text-sm font-bold text-white">Gain brut potentiel</span>
                <span class="text-xl font-black text-green-400 tabular-nums">{{ formatFcfa(potentialPayout) }}</span>
              </div>
            </div>

            <!-- Slippage Warning -->
            <div v-if="hasSlippageWarning" class="flex gap-2 p-3 bg-amber-500/10 border border-amber-500/25 rounded-xl text-xs text-amber-300 mb-4">
              <span>⚠️</span>
              <span><strong>Fluctuation de cote :</strong> Votre mise est importante — la cote d'exécution sera légèrement inférieure à la cote affichée ({{ simulatedOdds?.toFixed(2) }}).</span>
            </div>

            <!-- Submit Button -->
            <button
              @click="submitBet"
              :disabled="submitting || amount < 100 || (wallet && wallet.balance < amount)"
              class="w-full py-4 bg-gradient-to-r from-gold to-yellow-600 text-black font-black uppercase text-sm tracking-wider rounded-2xl hover:shadow-[0_0_30px_rgba(212,175,55,0.4)] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <span v-if="submitting">⏳ Acceptation du pari...</span>
              <span v-else-if="wallet && wallet.balance < amount">❌ Solde insuffisant ({{ formatFcfa(wallet.balance) }})</span>
              <span v-else>🎯 Confirmer la mise de {{ formatFcfa(amount) }}</span>
            </button>

            <p class="text-center text-[10px] text-white/20 mt-3 uppercase tracking-wider">
              🔒 La cote sera définitivement verrouillée au moment de la validation
            </p>
          </div>
        </Transition>

      </div>
    </div>
  </div>
</template>

<script setup>
const route = useRoute();
const router = useRouter();
const { $api, $toast } = useNuxtApp();
const { isLoggedIn } = useAuth();

useHead({ title: 'Placer un Pari — CCA Clash Bet' });

const marketId = route.params.id;
const loading    = ref(true);
const submitting = ref(false);
const market     = ref(null);
const wallet     = ref(null);

const selectedOption    = ref(null);
const amount            = ref(1000);
const simulatedOdds     = ref(null);
const potentialPayout   = ref(0);
const hasSlippageWarning = ref(false);

const formatFcfa = (n) => { if (!n && n !== 0) return '0 FCFA'; return Number(n).toLocaleString('fr-FR') + ' FCFA'; };

const selectOption = (opt) => { selectedOption.value = opt; previewOdds(); };
const setAmount    = (val) => { amount.value = val; previewOdds(); };

const previewOdds = async () => {
  if (!selectedOption.value || !amount.value || amount.value < 100) {
    potentialPayout.value = selectedOption.value ? Math.round(amount.value * (selectedOption.value.current_odds ?? 2)) : 0;
    return;
  }
  try {
    const res = await $api('/clash-bet/markets/preview-odds', { params: { option_id: selectedOption.value.id, amount: amount.value } });
    simulatedOdds.value = res.simulated_odds;
    potentialPayout.value = res.potential_payout;
    hasSlippageWarning.value = res.has_slippage;
  } catch {
    simulatedOdds.value = selectedOption.value.current_odds;
    potentialPayout.value = Math.round(amount.value * (selectedOption.value.current_odds ?? 2));
  }
};

const fetchMarket = async () => {
  loading.value = true;
  try {
    market.value = await $api(`/clash-bet/markets/${marketId}`);
    const optionId = parseInt(route.query.option);
    if (optionId && market.value?.options) {
      const found = market.value.options.find(o => o.id === optionId);
      if (found) selectOption(found);
    } else if (market.value?.options?.length) {
      selectOption(market.value.options[0]);
    }
  } catch {} finally { loading.value = false; }
};

const fetchWallet = async () => {
  if (!isLoggedIn.value) return;
  try { wallet.value = await $api('/clash-bet/wallet'); } catch {}
};

const submitBet = async () => {
  if (!isLoggedIn.value) { $toast.info('Connectez-vous pour parier.'); return router.push('/login'); }
  if (!selectedOption.value || amount.value < 100) return;
  submitting.value = true;
  try {
    const res = await $api('/clash-bet/bets', {
      method: 'POST',
      body: { option_id: selectedOption.value.id, amount: amount.value, expected_odds: selectedOption.value.current_odds },
    });
    $toast.success(`🏆 Pari accepté à la cote de ${res.executed_odds} !`);
    router.push('/clash-bet/mes-paris');
  } catch (e) { $toast.error(e?.data?.message || e?.message || 'Erreur placement du pari.'); }
  finally { submitting.value = false; }
};

onMounted(() => { fetchMarket(); fetchWallet(); });
</script>

<style scoped>
.match-banner {
  @apply bg-white/[0.02] border border-white/[0.07] rounded-3xl p-6 sm:p-8;
}
.panel { @apply bg-white/[0.02] border border-white/[0.07] rounded-3xl p-5 sm:p-6; }
.panel-title { @apply text-base font-black italic uppercase text-white; }

.badge-live {
  @apply inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-500/10
         border border-green-500/25 text-green-400 text-[9px] font-black uppercase tracking-widest;
}
.dot-live {
  @apply w-1.5 h-1.5 rounded-full bg-green-400 animate-ping inline-block;
}

.option-card {
  @apply flex items-center gap-4 p-4 rounded-2xl border border-white/[0.08] bg-white/[0.03]
         hover:border-gold/30 hover:bg-gold/5 transition-all duration-200 text-left relative overflow-hidden;
}
.option-card.selected {
  @apply border-gold bg-gold/15 shadow-[0_0_25px_rgba(212,175,55,0.15)];
}
.selected-check {
  @apply absolute top-3 right-3 w-5 h-5 rounded-full bg-gold text-black font-black
         text-xs flex items-center justify-center;
}

.quick-btn {
  @apply px-3 py-1.5 text-xs font-bold border border-white/10 rounded-xl
         bg-white/[0.03] text-white/50 hover:border-gold/40 hover:text-gold
         transition-all;
}
.quick-btn.active { @apply border-gold/50 text-gold bg-gold/10; }

/* Slide-up transition */
.slide-up-enter-from { transform: translateY(16px); opacity: 0; }
.slide-up-enter-active { transition: all 0.3s ease; }
.slide-up-leave-to { transform: translateY(8px); opacity: 0; }
.slide-up-leave-active { transition: all 0.2s ease; }
</style>
