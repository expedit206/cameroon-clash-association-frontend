<template>
  <div class="clan-details-page min-h-screen py-10 px-4 lg:px-10 text-white">
    <div class="max-w-6xl mx-auto">

      <!-- Navigation Retour -->
      <NuxtLink to="/clans/cameroun" class="inline-flex items-center gap-2 text-gold/80 hover:text-gold text-xs font-bold uppercase tracking-widest mb-8 transition-colors">
        <span>←</span> Retour au Classement des Clans
      </NuxtLink>

      <!-- Loader -->
      <div v-if="loading" class="py-32 text-center bg-black/20 rounded-3xl backdrop-blur-md border border-white/5">
        <div class="spinner mx-auto mb-6"></div>
        <p class="text-gold font-bold tracking-[0.4em] animate-pulse uppercase text-xs">
          Chargement de la fiche du clan...
        </p>
      </div>

      <!-- Erreur / Introuvable -->
      <div v-else-if="!clan" class="py-32 text-center bg-black/20 rounded-3xl border border-white/5">
        <div class="text-6xl mb-4">🛡️</div>
        <h2 class="text-2xl font-black uppercase text-gold">Clan Introuvable</h2>
        <p class="text-white/50 text-sm mt-2">Le clan demandé n'existe pas ou n'est plus enregistré.</p>
        <NuxtLink to="/clans/cameroun" class="btn-premium btn-primary mt-6 inline-block">
          Voir tous les clans
        </NuxtLink>
      </div>

      <div v-else class="space-y-10">

        <!-- ═══ 1. HERO HEADER CLAN ═══════════════════════════════════════ -->
        <header class="glass-card p-6 sm:p-10 border-gold/20 relative overflow-hidden rounded-3xl">
          <div class="hero-bg-glow"></div>
          <div class="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-6 text-center md:text-left">
            <!-- Badge -->
            <div class="relative flex-shrink-0">
              <img
                :src="clan.badge_url"
                :alt="clan.name"
                class="w-28 h-28 sm:w-36 sm:h-36 object-contain filter drop-shadow-2xl"
                @error="(e) => (e.target.src = 'https://api-assets.clashofclans.com/badges/200/uofw477qfC2pT5E5K4H9fE44-S8y6E7u8H7u5u7u.png')"
              />
              <div class="absolute -bottom-2 right-0 bg-gold text-black text-xs font-black px-2.5 py-0.5 rounded-full shadow-lg">
                LVL {{ clan.clan_level }}
              </div>
            </div>

            <!-- Infos principales -->
            <div class="flex-1 min-w-0">
              <div class="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-2">
                <span v-if="clan.tournament_registration?.group" class="badge-group">
                  Groupe {{ clan.tournament_registration.group }}
                </span>
                <span v-if="clan.tournament_registration?.seed" class="badge-seed">
                  Seed #{{ clan.tournament_registration.seed }}
                </span>
                <span class="badge-season">Saison 1 🇨🇲</span>
              </div>

              <h1 class="text-3xl sm:text-5xl font-black italic uppercase tracking-tight text-white mb-1">
                {{ clan.name }}
              </h1>

              <p class="font-mono text-gold text-sm tracking-wider uppercase mb-4">
                {{ clan.tag_coc }}
              </p>

              <p v-if="clan.description" class="text-white/60 text-xs sm:text-sm max-w-2xl line-clamp-2 italic">
                "{{ clan.description }}"
              </p>
            </div>
          </div>

          <!-- Grille des Stats du Tournoi -->
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-white/10 relative z-10">
            <div class="stat-card">
              <span class="stat-label">Points CCA</span>
              <div class="stat-value text-gold text-3xl sm:text-4xl">
                {{ clan.tournament_stats?.points ?? 0 }}
              </div>
            </div>

            <div class="stat-card">
              <span class="stat-label">Matchs (V - N - D)</span>
              <div class="stat-value text-white text-xl sm:text-2xl mt-1">
                <span class="text-emerald-400">{{ clan.tournament_stats?.won ?? 0 }}</span> -
                <span class="text-amber-400">{{ clan.tournament_stats?.drawn ?? 0 }}</span> -
                <span class="text-rose-400">{{ clan.tournament_stats?.lost ?? 0 }}</span>
              </div>
            </div>

            <div class="stat-card">
              <span class="stat-label">Étoiles Totales</span>
              <div class="stat-value text-gold text-xl sm:text-2xl mt-1">
                {{ clan.tournament_stats?.total_stars ?? 0 }} ⭐️
              </div>
            </div>

            <div class="stat-card">
              <span class="stat-label">Destruction Moy.</span>
              <div class="stat-value text-white text-xl sm:text-2xl mt-1">
                {{ clan.tournament_stats?.avg_destruction ?? 0 }}%
              </div>
            </div>
          </div>
        </header>

        <!-- ═══ 2. PARCOURS DANS LE TOURNOI ══════════════════════════════ -->
        <section class="space-y-6">
          <div class="flex items-center justify-between">
            <div>
              <h2 class="text-2xl font-black italic uppercase tracking-tight text-gold">
                PARCOURS DANS LE TOURNOI ⚔️
              </h2>
              <p class="text-xs text-white/50 uppercase tracking-widest mt-0.5">
                Historique et résultats des affrontements de la Saison 1
              </p>
            </div>
            <span class="text-xs font-bold text-white/40 uppercase">
              {{ clan.tournament_matches?.length ?? 0 }} Match(s)
            </span>
          </div>

          <!-- Liste des Matchs -->
          <div v-if="!clan.tournament_matches || clan.tournament_matches.length === 0" class="glass-card p-10 text-center border-white/5">
            <p class="text-white/40 italic">Aucun match enregistré pour ce clan dans cette saison.</p>
          </div>

          <div v-else class="grid gap-4">
            <div
              v-for="match in clan.tournament_matches"
              :key="match.id"
              class="match-card glass-card p-5 border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 transition-all duration-300 hover:border-gold/30"
              :class="{
                'match-win': match.result === 'win',
                'match-loss': match.result === 'loss',
                'match-draw': match.result === 'draw'
              }"
            >
              <!-- Phase & Bilan Pill -->
              <div class="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
                <span class="phase-tag">
                  {{ formatPhase(match.phase) }}
                </span>

                <!-- Résultat Pill -->
                <span
                  class="result-badge"
                  :class="{
                    'bg-emerald-500/20 text-emerald-300 border-emerald-500/40': match.result === 'win',
                    'bg-rose-500/20 text-rose-300 border-rose-500/40': match.result === 'loss',
                    'bg-amber-500/20 text-amber-300 border-amber-500/40': match.result === 'draw',
                    'bg-white/10 text-white/50 border-white/20': match.result === 'pending'
                  }"
                >
                  <template v-if="match.result === 'win'">VICTOIRE 🟢</template>
                  <template v-else-if="match.result === 'loss'">DÉFAITE 🔴</template>
                  <template v-else-if="match.result === 'draw'">MATCH NUL 🟡</template>
                  <template v-else>À VENIR ⚪</template>
                </span>
              </div>

              <!-- Duel Center (Clan vs Adversaire) -->
              <div class="flex items-center justify-center gap-4 sm:gap-8 flex-1 w-full my-2 md:my-0">
                <!-- Mon Clan -->
                <div class="flex items-center gap-3 text-right flex-1 justify-end">
                  <div class="min-w-0">
                    <p class="font-black text-sm sm:text-base text-white truncate">{{ clan.name }}</p>
                    <p class="text-[10px] text-white/40 font-mono uppercase">Hôte/Invité</p>
                  </div>
                  <img :src="clan.badge_url" class="w-10 h-10 object-contain flex-shrink-0" />
                </div>

                <!-- Scores -->
                <div class="text-center px-4 py-2 rounded-xl bg-black/40 border border-white/10 flex-shrink-0 min-w-[120px]">
                  <template v-if="match.status === 'completed'">
                    <div class="text-lg sm:text-2xl font-black tracking-tight text-gold">
                      {{ match.my_stars }} <span class="text-xs">⭐️</span> - {{ match.opp_stars }} <span class="text-xs">⭐️</span>
                    </div>
                    <div class="text-[10px] font-bold text-white/60 mt-0.5">
                      {{ match.my_destruction }}% vs {{ match.opp_destruction }}%
                    </div>
                  </template>
                  <template v-else>
                    <div class="text-xs font-bold text-white/40 uppercase tracking-widest">VS</div>
                    <div class="text-[9px] text-gold/70 font-mono mt-0.5">Programmé</div>
                  </template>
                </div>

                <!-- Adversaire -->
                <div class="flex items-center gap-3 text-left flex-1 justify-start">
                  <img
                    v-if="match.opponent"
                    :src="match.opponent.badge_url"
                    class="w-10 h-10 object-contain flex-shrink-0"
                    @error="(e) => (e.target.src = 'https://api-assets.clashofclans.com/badges/200/uofw477qfC2pT5E5K4H9fE44-S8y6E7u8H7u5u7u.png')"
                  />
                  <div v-if="match.opponent" class="min-w-0">
                    <p class="font-black text-sm sm:text-base text-white truncate">{{ match.opponent.name }}</p>
                    <p class="text-[10px] text-gold/70 font-mono uppercase">{{ match.opponent.tag_coc }}</p>
                  </div>
                  <div v-else class="text-white/30 text-xs italic">
                    Adversaire TBD
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        <!-- ═══ 3. COMPOSITION DE L'ÉQUIPE (Si membres CoC) ═══════════════ -->
        <section v-if="clan.members && clan.members.length > 0" class="space-y-4">
          <h2 class="text-xl font-black italic uppercase tracking-tight text-white">
            ROSTER / MEMBRES ACTIFS ({{ clan.members.length }})
          </h2>
          <div class="glass-card p-4 sm:p-6 border-white/5 overflow-hidden rounded-2xl">
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              <div
                v-for="member in clan.members.slice(0, 15)"
                :key="member.tag"
                class="p-3 bg-white/5 rounded-xl border border-white/5 flex items-center justify-between"
              >
                <div>
                  <p class="font-bold text-sm text-white">{{ member.name }}</p>
                  <p class="text-[10px] text-gold/60 font-mono">{{ member.tag }}</p>
                </div>
                <div class="text-right">
                  <span class="text-xs font-black text-white/80 bg-black/50 px-2 py-1 rounded-md">
                    TH {{ member.townHallLevel || '?' }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

      </div>
    </div>
  </div>
</template>

<script setup>
const route = useRoute();
const { $api } = useNuxtApp();

const clan = ref(null);
const loading = ref(true);

const fetchClanDetails = async () => {
  loading.value = true;
  try {
    const rawTag = route.params.tag;
    clan.value = await $api(`/clans/${rawTag}`);
  } catch (e) {
    console.error("Error loading clan details:", e);
    clan.value = null;
  } finally {
    loading.value = false;
  }
};

const formatPhase = (phase) => {
  if (!phase) return 'Match';
  if (phase === 'group_stage') return 'Phase de Poules';
  if (phase === 'semi_final') return 'Demi-Finale';
  if (phase === 'final') return 'Grande Finale 🏆';
  if (phase === 'third_place') return 'Petite Finale 🥉';
  return phase.replace('_', ' ').toUpperCase();
};

onMounted(() => {
  fetchClanDetails();
});

useHead({
  title: computed(() => clan.value ? `${clan.value.name} — Parcours Tournoi | CCA League` : 'Profil Clan — CCA League'),
});
</script>

<style scoped>
.hero-bg-glow {
  position: absolute;
  top: -50%;
  left: -20%;
  width: 140%;
  height: 200%;
  background: radial-gradient(circle at center, rgba(212, 175, 55, 0.12) 0%, transparent 70%);
  pointer-events: none;
}

.badge-group {
  background: rgba(187, 0, 255, 0.2);
  border: 1px solid rgba(187, 0, 255, 0.4);
  color: #e280ff;
  font-size: 0.65rem;
  font-weight: 800;
  text-transform: uppercase;
  padding: 3px 10px;
  border-radius: 50px;
}

.badge-seed {
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: #fff;
  font-size: 0.65rem;
  font-weight: 800;
  text-transform: uppercase;
  padding: 3px 10px;
  border-radius: 50px;
}

.badge-season {
  background: rgba(212, 175, 55, 0.15);
  border: 1px solid rgba(212, 175, 55, 0.4);
  color: var(--secondary);
  font-size: 0.65rem;
  font-weight: 800;
  text-transform: uppercase;
  padding: 3px 10px;
  border-radius: 50px;
}

.stat-card {
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 16px;
  padding: 14px;
  text-align: center;
}

.stat-label {
  font-size: 0.65rem;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  color: rgba(255, 255, 255, 0.4);
  font-weight: 800;
}

.stat-value {
  font-family: var(--font-heading), sans-serif;
  font-weight: 900;
}

.phase-tag {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #fff;
  font-size: 0.65rem;
  font-weight: 800;
  text-transform: uppercase;
  padding: 4px 10px;
  border-radius: 8px;
}

.result-badge {
  font-size: 0.7rem;
  font-weight: 900;
  text-transform: uppercase;
  padding: 4px 12px;
  border-radius: 8px;
  border: 1px solid;
}

.match-card {
  transition: all 0.3s ease;
}

.match-win {
  border-left: 4px solid #10b981 !important;
}

.match-loss {
  border-left: 4px solid #f43f5e !important;
}

.match-draw {
  border-left: 4px solid #f59e0b !important;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid rgba(255, 255, 255, 0.05);
  border-top-color: var(--primary);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
