<template>
  <div class="min-h-screen bg-[#06070a] text-white pb-20 pt-24">
    <!-- =========================================================
     CCA CLASH BET — MES POSITIONS
     ========================================================= -->

    <div class="max-w-5xl mx-auto pb-10">

      <!-- =======================================================
       HEADER
       ======================================================= -->
      <div class="flex items-start justify-between gap-4 mb-7">

        <div class="flex items-center gap-3">

          <NuxtLink to="/clash-bet" class="group w-10 h-10 shrink-0 rounded-2xl
               bg-white/[0.04] border border-white/[0.08]
               flex items-center justify-center
               text-white/40
               hover:text-gold hover:border-gold/30
               hover:bg-gold/[0.04]
               transition-all duration-300">
            <span class="text-lg transition-transform group-hover:-translate-x-0.5">
              ←
            </span>
          </NuxtLink>

          <div>

            <div class="flex items-center gap-2">

              <span class="hidden sm:flex w-8 h-8 rounded-xl
                       bg-gold/[0.08] border border-gold/20
                       items-center justify-center text-sm">
                ⚡
              </span>

              <h1 class="text-2xl sm:text-3xl font-black italic
                     uppercase tracking-tight text-white">
                MES
                <span class="text-gold">POSITIONS</span>
              </h1>

            </div>

            <p class="mt-1 text-[11px] sm:text-xs text-white/35">
              Suivez vos prédictions et vos cotes exécutées
            </p>

          </div>

        </div>

        <!-- Petit indicateur Clash Bet -->
        <div class="hidden sm:flex items-center gap-2
                px-3 py-2 rounded-xl
                bg-gold/[0.04]
                border border-gold/10">

          <span class="relative flex h-2 w-2">
            <span class="animate-ping absolute inline-flex h-full w-full
                 rounded-full bg-gold opacity-50"></span>

            <span class="relative inline-flex rounded-full
                     h-2 w-2 bg-gold"></span>
          </span>

          <span class="text-[9px] font-black uppercase
                   tracking-widest text-gold/70">
            Clash Bet
          </span>

        </div>

      </div>


      <!-- =======================================================
       ACTIVITY OVERVIEW
       ======================================================= -->

      <div class="relative overflow-hidden rounded-3xl
              border border-white/[0.08]
              bg-gradient-to-br
              from-white/[0.055]
              via-white/[0.025]
              to-transparent
              mb-5">

        <!-- Decorative glow -->
        <div class="absolute -top-24 -right-24
                w-56 h-56 rounded-full
                bg-gold/[0.07] blur-3xl pointer-events-none">
        </div>

        <div class="relative p-5 sm:p-6">

          <div class="flex items-center justify-between gap-4 mb-5">

            <div>

              <p class="text-[9px] font-black uppercase
                    tracking-[0.2em] text-gold/60 mb-1">
                Mon activité
              </p>

              <h2 class="text-lg sm:text-xl font-black uppercase">
                Vue d'ensemble
              </h2>

            </div>

            <div class="hidden sm:block text-right">

              <p class="text-[9px] uppercase tracking-wider text-white/25">
                Total des gains
              </p>

              <p class="text-lg font-black font-mono text-gold">
                {{ formatFcfa(totalWon) }}
              </p>

            </div>

          </div>


          <!-- Stats -->
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">

            <!-- Actifs -->
            <div class="group rounded-2xl
                    bg-amber-400/[0.04]
                    border border-amber-400/10
                    p-3.5
                    hover:border-amber-400/20
                    transition-all">

              <div class="flex items-center justify-between mb-2">

                <span class="text-[9px] font-black uppercase
                         tracking-wider text-white/35">
                  En cours
                </span>

                <span class="text-xs">◉</span>

              </div>

              <p class="text-xl sm:text-2xl font-black
                    font-mono text-amber-400">
                {{bets.filter(b => b.status === 'pending').length}}
              </p>

            </div>


            <!-- Gagnés -->
            <div class="group rounded-2xl
                    bg-green-400/[0.04]
                    border border-green-400/10
                    p-3.5
                    hover:border-green-400/20
                    transition-all">

              <div class="flex items-center justify-between mb-2">

                <span class="text-[9px] font-black uppercase
                         tracking-wider text-white/35">
                  Gagnés
                </span>

                <span class="text-xs text-green-400">✓</span>

              </div>

              <p class="text-xl sm:text-2xl font-black
                    font-mono text-green-400">
                {{bets.filter(b => b.status === 'won').length}}
              </p>

            </div>


            <!-- Perdus -->
            <div class="group rounded-2xl
                    bg-white/[0.02]
                    border border-white/[0.06]
                    p-3.5
                    hover:border-white/10
                    transition-all">

              <div class="flex items-center justify-between mb-2">

                <span class="text-[9px] font-black uppercase
                         tracking-wider text-white/35">
                  Perdus
                </span>

                <span class="text-xs text-white/20">×</span>

              </div>

              <p class="text-xl sm:text-2xl font-black
                    font-mono text-white/40">
                {{bets.filter(b => b.status === 'lost').length}}
              </p>

            </div>


            <!-- Gains -->
            <div class="group rounded-2xl
                    bg-gold/[0.05]
                    border border-gold/15
                    p-3.5
                    hover:border-gold/25
                    transition-all">

              <div class="flex items-center justify-between mb-2">

                <span class="text-[9px] font-black uppercase
                         tracking-wider text-white/35">
                  Gains
                </span>

                <span class="text-xs text-gold">◆</span>

              </div>

              <p class="text-base sm:text-lg font-black
                    font-mono text-gold truncate">
                {{ formatFcfa(totalWon) }}
              </p>

            </div>

          </div>


          <!-- Mobile total -->
          <div class="sm:hidden flex items-center justify-between
                  mt-4 pt-4 border-t border-white/[0.06]">

            <span class="text-[9px] uppercase
                     tracking-wider text-white/30">
              Total des gains
            </span>

            <span class="text-sm font-black font-mono text-gold">
              {{ formatFcfa(totalWon) }}
            </span>

          </div>

        </div>

      </div>


      <!-- =======================================================
       FILTERS
       ======================================================= -->

      <div class="flex items-center justify-between gap-3 mb-5">

        <div class="flex gap-1.5 overflow-x-auto
                pb-1 -mx-1 px-1 scrollbar-hide">

          <button v-for="tab in tabs" :key="tab.value" @click="activeTab = tab.value" :class="[
            'relative flex-shrink-0',
            'px-4 py-2.5 rounded-xl',
            'text-[10px] sm:text-[11px]',
            'font-black uppercase tracking-wider',
            'transition-all duration-300',
            activeTab === tab.value
              ? 'bg-gold/[0.08] text-gold border border-gold/20'
              : 'text-white/35 border border-transparent hover:text-white/70 hover:bg-white/[0.03]'
          ]">

            <span class="mr-1">
              {{ tab.icon }}
            </span>

            {{ tab.label }}

            <span class="ml-1 opacity-50 font-mono" v-if="tab.value !== 'all'">
              {{bets.filter(b => b.status === tab.value).length}}
            </span>

            <!-- Active indicator -->
            <span v-if="activeTab === tab.value" class="absolute bottom-0 left-1/2
                 -translate-x-1/2
                 w-5 h-[2px]
                 rounded-full bg-gold"></span>

          </button>

        </div>

        <span class="hidden sm:block text-[9px]
                 uppercase tracking-widest text-white/20">
          {{ filteredBets.length }} position{{ filteredBets.length > 1 ? 's' : '' }}
        </span>

      </div>


      <!-- =======================================================
       LOADING
       ======================================================= -->

      <div v-if="loading" class="space-y-3">

        <div v-for="n in 4" :key="n" class="h-44 rounded-3xl
             bg-white/[0.025]
             border border-white/[0.05]
             animate-pulse"></div>

      </div>


      <!-- =======================================================
       EMPTY STATE
       ======================================================= -->

      <div v-else-if="filteredBets.length === 0" class="relative overflow-hidden
           rounded-3xl
           border border-white/[0.07]
           bg-white/[0.02]
           py-20 sm:py-24
           px-6
           text-center">

        <!-- Glow -->
        <div class="absolute top-1/2 left-1/2
                -translate-x-1/2 -translate-y-1/2
                w-48 h-48
                bg-gold/[0.05]
                blur-3xl rounded-full">
        </div>

        <div class="relative">

          <div class="w-20 h-20 mx-auto mb-5
                  rounded-3xl
                  bg-gold/[0.05]
                  border border-gold/10
                  flex items-center justify-center">

            <span class="text-3xl opacity-70">
              ◇
            </span>

          </div>

          <h3 class="text-xl font-black uppercase mb-2">
            Aucune position
          </h3>

          <p class="text-white/35 text-xs sm:text-sm
                mb-7 max-w-sm mx-auto leading-relaxed">
            Vous n'avez encore aucune prédiction dans
            cette catégorie. Explorez les marchés
            disponibles et faites votre analyse.
          </p>

          <NuxtLink to="/clash-bet" class="inline-flex items-center gap-2
               px-6 py-3
               rounded-xl
               bg-gradient-to-r
               from-gold
               to-yellow-600
               text-black
               font-black
               text-[11px]
               uppercase
               tracking-wider
               shadow-lg shadow-gold/10
               hover:scale-[1.02]
               active:scale-[0.98]
               transition-all">
            Explorer les marchés

            <span class="text-sm">
              →
            </span>

          </NuxtLink>

        </div>

      </div>


      <!-- =======================================================
       POSITIONS
       ======================================================= -->

      <div v-else class="space-y-3">

        <div v-for="bet in filteredBets" :key="bet.id" :class="[
          'group relative overflow-hidden',
          'rounded-3xl',
          'border',
          'transition-all duration-300',

          bet.status === 'won'
            ? 'border-green-400/10 bg-green-400/[0.015] hover:border-green-400/20'
            : bet.status === 'lost'
              ? 'border-white/[0.05] bg-white/[0.015] opacity-80'
              : 'border-white/[0.08] bg-white/[0.025] hover:border-gold/20 hover:bg-white/[0.035]'
        ]">

          <!-- Status accent -->
          <div :class="[
            'absolute left-0 top-0 bottom-0 w-[2px]',
            bet.status === 'won'
              ? 'bg-green-400'
              : bet.status === 'lost'
                ? 'bg-white/10'
                : 'bg-gold'
          ]"></div>


          <div class="p-4 sm:p-5">

            <!-- =================================================
             TOP ROW
             ================================================= -->

            <div class="flex items-center gap-2 mb-4">

              <!-- Status -->
              <span :class="[
                'inline-flex items-center gap-1.5',
                'px-2.5 py-1.5',
                'rounded-lg',
                'text-[8px]',
                'font-black uppercase tracking-wider',

                bet.status === 'won'
                  ? 'bg-green-400/10 text-green-400 border border-green-400/10'
                  : bet.status === 'lost'
                    ? 'bg-white/[0.04] text-white/30 border border-white/[0.05]'
                    : 'bg-amber-400/10 text-amber-400 border border-amber-400/10'
              ]">

                <span :class="[
                  'w-1.5 h-1.5 rounded-full',
                  bet.status === 'won'
                    ? 'bg-green-400'
                    : bet.status === 'lost'
                      ? 'bg-white/20'
                      : 'bg-amber-400 animate-pulse'
                ]"></span>

                {{ getStatusLabel(bet.status) }}

              </span>


              <!-- ID -->
              <span class="text-[9px] text-white/20 font-mono">
                CCA-{{ bet.id }}
              </span>


              <!-- Date -->
              <span class="text-[9px] text-white/20
                       font-mono ml-auto">
                {{ formatDate(bet.created_at) }}
              </span>

            </div>


            <!-- =================================================
             MATCH
             ================================================= -->

            <div class="flex items-center gap-3 sm:gap-5">

              <!-- Home -->
              <div class="flex-1 min-w-0">

                <div class="text-sm sm:text-base
                        font-black uppercase
                        tracking-tight text-white
                        truncate">
                  {{ bet.market?.match?.clan_home?.name || 'Équipe A' }}
                </div>

                <div class="text-[8px] uppercase
                        tracking-widest
                        text-white/20 mt-1">
                  Équipe domicile
                </div>

              </div>


              <!-- VS -->
              <div class="shrink-0 flex flex-col items-center">

                <span class="text-[9px] font-black
                         italic text-gold">
                  VS
                </span>

                <span class="w-5 h-px bg-gold/20 mt-1"></span>

              </div>


              <!-- Away -->
              <div class="flex-1 min-w-0 text-right">

                <div class="text-sm sm:text-base
                        font-black uppercase
                        tracking-tight text-white
                        truncate">
                  {{ bet.market?.match?.clan_away?.name || 'Équipe B' }}
                </div>

                <div class="text-[8px] uppercase
                        tracking-widest
                        text-white/20 mt-1">
                  Équipe extérieur
                </div>

              </div>

            </div>


            <!-- =================================================
             PRONOSTIC
             ================================================= -->

            <div class="mt-4 p-3 rounded-2xl
                    bg-gold/[0.035]
                    border border-gold/[0.08]">

              <div class="flex items-center justify-between gap-3">

                <div>

                  <div class="text-[8px]
                          uppercase tracking-widest
                          text-white/25 mb-1">
                    Votre pronostic
                  </div>

                  <div class="text-xs sm:text-sm
                          font-black uppercase
                          text-gold">
                    {{ bet.option?.label || '—' }}
                  </div>

                </div>

                <span class="text-lg opacity-50">
                  ◆
                </span>

              </div>

            </div>


            <!-- =================================================
             FINANCIAL DATA
             ================================================= -->

            <div class="grid grid-cols-2 sm:grid-cols-3
                    gap-3
                    mt-4
                    pt-4
                    border-t border-white/[0.06]">

              <!-- Mise -->
              <div>

                <div class="text-[8px]
                        uppercase tracking-widest
                        text-white/25 mb-1">
                  Mise
                </div>

                <div class="text-sm
                        font-black font-mono
                        text-white">
                  {{ formatFcfa(bet.amount) }}
                </div>

              </div>


              <!-- Cote exécutée -->
              <div>

                <div class="text-[8px]
                        uppercase tracking-widest
                        text-white/25 mb-1">
                  Cote exécutée
                </div>

                <div class="text-sm
                        font-black font-mono
                        text-gold">
                  {{ parseFloat(bet.executed_odds || 0).toFixed(2) }}
                </div>

                <div class="text-[8px] text-white/20 mt-0.5">
                  verrouillée
                </div>

              </div>


              <!-- Gain -->
              <div class="col-span-2 sm:col-span-1
                      sm:text-right">

                <div class="text-[8px]
                        uppercase tracking-widest
                        text-white/25 mb-1">

                  {{ bet.status === 'won'
                    ? 'Gain effectif'
                    : 'Gain potentiel'
                  }}

                </div>

                <div :class="[
                  'text-base sm:text-lg',
                  'font-black font-mono',

                  bet.status === 'won'
                    ? 'text-green-400'
                    : bet.status === 'lost'
                      ? 'text-white/20 line-through'
                      : 'text-white'
                ]">
                  {{ formatFcfa(
                    bet.actual_payout || bet.potential_payout
                  ) }}
                </div>

              </div>

            </div>


            <!-- =================================================
             CURRENT ODDS
             ================================================= -->

            <!--
          Affiché uniquement si l'API fournit current_odds.
          Cela permet de comparer la cote actuelle
          avec la cote exécutée sans modifier
          la cote historique du pari.
        -->

            <div v-if="bet.status === 'pending' && bet.current_odds" class="mt-4 flex items-center
                 justify-between gap-3
                 px-3 py-2.5
                 rounded-xl
                 bg-white/[0.025]
                 border border-white/[0.05]">

              <div class="flex items-center gap-2">

                <span class="text-xs">
                  📈
                </span>

                <span class="text-[8px]
                         uppercase tracking-widest
                         text-white/30">
                  Cote actuelle
                </span>

              </div>

              <div class="flex items-center gap-2">

                <span class="text-xs font-black
                         font-mono text-white/60">
                  {{ parseFloat(bet.current_odds).toFixed(2) }}
                </span>

                <span v-if="
                  parseFloat(bet.current_odds) !==
                  parseFloat(bet.executed_odds)
                " class="text-[8px] px-1.5 py-0.5
                     rounded-md bg-amber-400/10
                     text-amber-400">
                  Marché en mouvement
                </span>

              </div>

            </div>


            <!-- =================================================
             FOOTER
             ================================================= -->

            <div class="flex items-center
                    justify-between gap-3
                    mt-4 pt-3
                    border-t border-white/[0.04]">

              <span class="text-[8px]
                       uppercase tracking-widest
                       text-white/20">
                {{ bet.status === 'pending'
                  ? 'Position active'
                  : 'Position réglée'
                }}
              </span>

              <button type="button" class="text-[9px] font-black
                   uppercase tracking-wider
                   text-white/30
                   hover:text-gold
                   transition-colors">
                Voir les détails →
              </button>

            </div>

          </div>

        </div>

      </div>

    </div>
  </div>
</template>

<script setup>
const { $api } = useNuxtApp();
const { isLoggedIn } = useAuth();

useHead({ title: 'Mes Paris — CCA Clash Bet' });

const loading = ref(true);
const bets = ref([]);
const activeTab = ref('all');

const tabs = [
  { label: 'Tous',         value: 'all',      icon: '🎟️' },
  { label: 'En cours',     value: 'pending',  icon: '⏳' },
  { label: 'Gagnés',       value: 'won',      icon: '🏆' },
  { label: 'Perdus',       value: 'lost',     icon: '❌' },
  { label: 'Remboursés',   value: 'refunded', icon: '↩️' },
];

const filteredBets = computed(() => activeTab.value === 'all' ? bets.value : bets.value.filter(b => b.status === activeTab.value));
const totalWon = computed(() => bets.value.filter(b => b.status === 'won').reduce((s, b) => s + (b.actual_payout || 0), 0));

const formatFcfa = (n) => { if (!n && n !== 0) return '0 FCFA'; return Number(n).toLocaleString('fr-FR') + ' FCFA'; };
const formatDate = (d) => { if (!d) return '-'; return new Date(d).toLocaleString('fr-FR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }); };
const getStatusLabel = (s) => ({ pending: '● En Cours', won: '🏆 Gagné', lost: '❌ Perdu', refunded: '↩️ Remboursé' }[s] || s);

const fetchMyBets = async () => {
  if (!isLoggedIn.value) return;
  loading.value = true;
  try {
    const res = await $api('/clash-bet/my-bets');
    bets.value = res.data || res || [];
  } catch {} finally { loading.value = false; }
};

onMounted(() => fetchMyBets());
</script>

<style scoped>
.stat-mini       { @apply flex flex-col items-center gap-0.5 p-3 rounded-2xl bg-white/[0.03] border border-white/[0.06] text-center; }
.stat-mini-label { @apply text-[9px] uppercase tracking-widest text-white/30; }
.stat-mini-val   { @apply text-lg font-black tabular-nums; }

.tab-btn {
  @apply px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wide whitespace-nowrap
         bg-white/[0.04] border border-white/[0.07] text-white/50
         hover:bg-white/[0.08] hover:text-white transition-all;
}
.tab-btn.active {
  @apply bg-gold text-black border-transparent shadow-[0_0_20px_rgba(212,175,55,0.3)];
}

.bet-card {
  @apply bg-white/[0.02] border border-white/[0.07] rounded-3xl p-5
         hover:bg-white/[0.03] transition-all;
}
.bet-card.won     { @apply border-green-500/20; }
.bet-card.pending { @apply border-amber-500/20; }
.bet-card.lost    { @apply opacity-60; }

.status-badge {
  @apply text-[9px] font-black uppercase px-2.5 py-1 rounded-full border;
}
.status-badge.pending  { @apply bg-amber-500/10 text-amber-400 border-amber-500/30; }
.status-badge.won      { @apply bg-green-500/10 text-green-400 border-green-500/30; }
.status-badge.lost     { @apply bg-white/5 text-white/30 border-white/10; }
.status-badge.refunded { @apply bg-blue-500/10 text-blue-400 border-blue-500/30; }
</style>
