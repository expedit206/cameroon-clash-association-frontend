<template>
  <div class="clan-tournament-page min-h-screen pb-20">
    <div class="container mx-auto px-4 py-8 max-w-4xl">
      <!-- Loading State -->
      <div v-if="loading" class="flex flex-col items-center justify-center py-20">
        <div class="spinner-premium mb-4"></div>
        <p class="text-gold text-xs uppercase tracking-[0.3em] font-black animate-pulse">
          Synchronisation Clan...
        </p>
      </div>

      <div v-else-if="registration" class="animate-in">
        <!-- Header: Clan Identity -->
        <header class="flex flex-col md:flex-row items-center gap-6 mb-8 p-8 glass-card border-gold/20">
          <img :src="registration.clan?.badge_url" class="w-24 h-24 object-contain drop-shadow-2xl" />
          <div class="flex-1 text-center md:text-left">
            <div class="flex items-center justify-center md:justify-start gap-3 mb-1">
              <h1 class="text-3xl md:text-4xl font-black italic text-white uppercase">
                {{ registration.clan?.name }}
              </h1>
              <span
                class="px-3 py-1 bg-gold text-black text-[9px] font-black rounded-full uppercase tracking-widest">Saison
                1</span>
            </div>
            <p class="text-white/40 text-[10px] uppercase tracking-[0.4em] font-mono">
              {{ registration.clan?.tag_coc }}
            </p>

            <div class="flex flex-wrap justify-center md:justify-start gap-4 mt-6">
              <div class="flex flex-wrap justify-center md:justify-start gap-4 mt-6">
                <div class="stat-pill">
                  <span class="label">Status</span>
                  <span class="value text-green-400" v-if="registration.status === 'confirmed'">Prêt au Combat</span>
                  <span class="value text-gold" v-else>En Attente</span>
                </div>

                <div class="stat-pill" v-if="registration.group">
                  <span class="label">Poule Assignée</span>
                  <span class="value text-gold font-black uppercase">
                    Groupe {{ registration.group }}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div class="hidden lg:block text-right">
            <p class="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] mb-2">
              Capitaine
            </p>
            <p class="text-white font-bold">
              {{ captain?.name || "Non assigné" }}
            </p>
          </div>
        </header>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <!-- Column 1: Match Schedule & Results -->
          <div class="lg:col-span-2 space-y-6">
            <section>
              <h3 class="text-xs font-black text-white/40 uppercase tracking-[0.4em] mb-4 flex items-center gap-2">
                <span class="w-1.5 h-1.5 bg-gold rounded-full"></span> Matchs du
                Tournoi ({{ matches.length }})
              </h3>

              <div v-if="matches.length" class="space-y-4">
                <div v-for="match in matches" :key="match.id"
                  class="match-card glass-card hover:border-gold/30 transition-all p-4 relative" :class="{
                    'border-red-500/40 shadow-[0_0_10px_rgba(239,68,68,0.12)]': matchPriority(match) === 'urgent',
                    'border-orange-400/25': matchPriority(match) === 'soon',
                  }">
                  <!-- Priority blink -->
                  <span v-if="matchPriority(match) === 'urgent'"
                    class="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-red-500 animate-ping inline-block"
                    title="Match imminent (< 24h)"></span>
                  <span v-else-if="matchPriority(match) === 'soon'"
                    class="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-orange-400 animate-pulse inline-block"
                    title="Match dans < 3 jours"></span>

                  <div
                    class="flex items-center justify-between mb-3 text-[9px] text-white/50 border-b border-white/5 pb-2">
                    <span class="font-black uppercase text-gold">
                      {{ match.phase === 'group_stage' ? `Groupe ${match.group || 'A'}` : (match.phase === 'semi_final'
                        ? 'Demi-Finale' : (match.phase === 'final' ? 'Grande Finale' : match.phase)) }}
                    </span>
                    <span class="font-mono" :class="{
                      'text-red-400 font-bold': matchPriority(match) === 'urgent',
                      'text-orange-300': matchPriority(match) === 'soon',
                      'text-white/70': matchPriority(match) === 'none',
                    }">
                      📅 {{ formatScheduledDate(match.scheduled_at) }}
                    </span>
                  </div>

                  <div class="flex items-center justify-between">
                    <!-- Clan Domicile -->
                    <div class="flex-1 flex flex-col items-center gap-1.5 text-center">
                      <img :src="match.clan_home?.badge_url || match.clan1?.badge_url || '/images/default-clan.png'"
                        class="w-10 h-10 object-contain" />
                      <span class="text-[10px] font-bold text-white truncate max-w-[110px]"
                        :class="match.winner_clan_id === match.clan_home_id ? 'text-gold font-black' : ''">{{
                          match.clan_home?.name || match.clan1?.name }}</span>
                    </div>

                    <!-- Score / Status -->
                    <div class="flex flex-col items-center gap-1 px-4">
                      <div class="text-2xl font-black italic text-white">
                        <span v-if="match.status === 'completed'" class="flex items-center gap-1">
                          <span :class="match.winner_clan_id === match.clan_home_id ? 'text-gold' : 'text-white/60'">{{
                            match.total_stars_home ?? 0 }}</span>
                          <span class="text-white/30 text-base">-</span>
                          <span :class="match.winner_clan_id === match.clan_away_id ? 'text-gold' : 'text-white/60'">{{
                            match.total_stars_away ?? 0 }}</span>
                        </span>
                        <span v-else class="text-gold/60 text-lg">VS</span>
                      </div>
                      <span class="px-2 py-0.5 rounded text-[8px] uppercase font-black"
                        :class="match.status === 'completed' ? 'bg-green-500/20 text-green-400' : 'bg-white/5 text-white/40'">
                        {{ match.status === 'completed' ? 'Terminé' : (match.status === 'in_progress' ? 'En Cours' :
                          'Programmé') }}
                      </span>
                    </div>

                    <!-- Clan Extérieur -->
                    <div class="flex-1 flex flex-col items-center gap-1.5 text-center">
                      <img :src="match.clan_away?.badge_url || match.clan2?.badge_url || '/images/default-clan.png'"
                        class="w-10 h-10 object-contain" />
                      <span class="text-[10px] font-bold text-white truncate max-w-[110px]"
                        :class="match.winner_clan_id === match.clan_away_id ? 'text-gold font-black' : ''">{{
                          match.clan_away?.name || match.clan2?.name }}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div v-else class="text-center py-12 border-2 border-dashed border-white/5 rounded-2xl">
                <p class="text-white/20 text-[10px] uppercase font-black tracking-widest">
                  Le tableau des matchs n'est pas encore généré
                </p>
              </div>
            </section>
          </div>

          <!-- Column 2: Roster & Payment Status -->
          <div class="space-y-6">
            <section>
              <h3 class="text-xs font-black text-white/40 uppercase tracking-[0.4em] mb-4">
                Roster & Status
              </h3>
              <div class="glass-card overflow-hidden">
                <div class="p-4 bg-white/5 border-b border-white/5">
                  <p class="text-[10px] font-black text-white/60 uppercase tracking-widest">
                    National Team
                  </p>
                </div>
                <div class="divide-y divide-white/5">
                  <div v-for="p in registration.players" :key="p.id" class="p-4 flex items-center gap-3">
                    <div class="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-[10px] font-black"
                      :class="p.is_substitute ? 'text-white/20' : 'text-gold'">
                      HDV{{ p.hdv_position }}
                    </div>
                    <div class="flex-1">
                      <div class="text-xs font-bold text-white">
                        {{ p.user?.name }}
                      </div>
                      <div class="text-[8px] font-mono text-white/20">
                        {{ p.user?.tag_coc }}
                      </div>
                    </div>
                    <div class="flex items-center gap-2">
                      <span v-if="p.is_substitute"
                        class="text-[7px] px-1.5 py-0.5 bg-white/5 text-white/40 font-black rounded uppercase">Sub</span>

                    </div>
                  </div>
                </div>
              </div>
            </section>

            <!-- Actions -->
            <div class="space-y-3">

              <NuxtLink v-if="isClanCaptain && !registration?.brackets_generated" to="/tournaments/register?edit=true"
                class="btn-premium btn-primary w-full text-[10px] text-center !py-2.5 flex items-center justify-center">
                Modifier mon Roster</NuxtLink>

              <NuxtLink to="/tournaments/bracket" class="btn-tournament secondary w-full text-[10px]">Voir le Bracket
                Global</NuxtLink>
            </div>
          </div>
        </div>
      </div>

      <!-- No Registration State -->
      <div v-else class="text-center py-20">
        <LucideShield :size="96" class="inline mb-6" />
        <h2 class="text-2xl font-black text-white uppercase italic mb-2">
          Aucun Clan Inscrit
        </h2>
        <p class="text-white/40 text-sm max-w-sm mx-auto mb-8">
          Votre clan n'est pas encore inscrit à cette compétition. Lancez vous
          dans l'aventure !
        </p>
        <NuxtLink :to="ctaTo" class="btn-premium btn-primary text-xs">{{ ctaIcon }} {{ ctaLabel }}</NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
const { $api, $toast } = useNuxtApp();
const { user } = useAuth();
const router = useRouter();
const { ctaLabel, ctaTo, ctaIcon } = useTournamentCta();

const competitionId = 1;
const loading = ref(true);
const registration = ref(null);
const matches = ref([]);
const payments = ref([]);

const captain = computed(
  () =>
    // Le capitaine est défini par captain_id sur le clan, pas nécessairement dans le roster
    registration.value?.clan?.captain ||
    registration.value?.players?.find((p) => p.user?.role === "admin" || p.user?.role === "captain")?.user,
);

const isClanCaptain = computed(() => !!user.value?.capitained_clan);


const fetchData = async () => {
  loading.value = true;
  try {
    const res = await $api(
      `/competitions/${competitionId}/registration/status`,
    );
    registration.value = res;

    if (res) {
      // Fetch all tournament matches (groups + bracket)
      let allMatchesList = [];
      try {
        allMatchesList = await $api(`/tournament/matches`);
      } catch (err) {
        const bracketRes = await $api(`/tournament/bracket`);
        allMatchesList = Object.values(bracketRes).flat();
      }

      if (!Array.isArray(allMatchesList)) {
        allMatchesList = Object.values(allMatchesList).flat();
      }

      matches.value = allMatchesList.filter(
        (m) => m.clan_home_id === res.clan_id || m.clan_away_id === res.clan_id,
      );

      payments.value = res.payments || [];
    }
  } catch (e) {
    console.error(e);
    $toast.error("Impossible de charger les données de votre clan.");
  } finally {
    loading.value = false;
  }
};

const matchPriority = (match) => {
  if (!match.scheduled_at || match.status === 'completed') return 'none';
  const now = new Date();
  const scheduled = new Date(match.scheduled_at);
  const diffHours = (scheduled - now) / (1000 * 60 * 60);
  if (diffHours < 0) return 'none';
  if (diffHours <= 24) return 'urgent';
  if (diffHours <= 72) return 'soon';
  return 'none';
};

const formatScheduledDate = (dateStr) => {
  if (!dateStr) return 'Non programmé';
  const d = new Date(dateStr);
  return d.toLocaleString('fr-FR', {
    timeZone: 'Africa/Douala',
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const isPaid = () => true; // Inscription gratuite - tous les joueurs sont validés



onMounted(fetchData);
</script>

<style scoped>
.clan-tournament-page {
  background: #06070a;
  color: white;
}

.stat-pill {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

/* .stat-pill .label { font-[10px] font-black uppercase text-white/20 tracking-widest; } */
.stat-pill .value {
  font-size: 0.8rem;
  font-weight: 800;
  color: white;
}

.match-card {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 20px;
}

.payment-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  box-shadow: 0 0 10px currentColor;
}

.spinner-premium {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(212, 175, 55, 0.1);
  border-top-color: var(--gold);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.animate-in {
  animation: slideUp 0.6s cubic-bezier(0.2, 0.8, 0.2, 1);
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
