<template>
  <div class="clan-tournament-page min-h-screen pb-20">
    <div class="container mx-auto px-4 py-8 max-w-4xl">
      <!-- Loading State -->
      <div
        v-if="loading"
        class="flex flex-col items-center justify-center py-20"
      >
        <div class="spinner-premium mb-4"></div>
        <p
          class="text-gold text-xs uppercase tracking-[0.3em] font-black animate-pulse"
        >
          Synchronisation Clan...
        </p>
      </div>

      <div v-else-if="registration" class="animate-in">
        <!-- Header: Clan Identity -->
        <header
          class="flex flex-col md:flex-row items-center gap-6 mb-8 p-8 glass-card border-gold/20"
        >
          <img
            :src="registration.clan?.badge_url"
            class="w-24 h-24 object-contain drop-shadow-2xl"
          />
          <div class="flex-1 text-center md:text-left">
            <div
              class="flex items-center justify-center md:justify-start gap-3 mb-1"
            >
              <h1
                class="text-3xl md:text-4xl font-black italic text-white uppercase"
              >
                {{ registration.clan?.name }}
              </h1>
              <span
                class="px-3 py-1 bg-gold text-black text-[9px] font-black rounded-full uppercase tracking-widest"
                >Saison 1</span
              >
            </div>
            <p
              class="text-white/40 text-[10px] uppercase tracking-[0.4em] font-mono"
            >
              {{ registration.clan?.tag_coc }}
            </p>

            <div
              class="flex flex-wrap justify-center md:justify-start gap-4 mt-6"
            >
              <div class="stat-pill">
                <span class="label">Status</span>
                <span
                  class="value text-green-400"
                  v-if="registration.status === 'confirmed'"
                  >Prêt au Combat</span
                >
                <span class="value text-gold" v-else>En Attente</span>
              </div>
              <div class="stat-pill">
                <span class="label">Paiements</span>
                <span class="value">{{ confirmedPaymentsCount }} / 5</span>
              </div>
            </div>
          </div>
          <div class="hidden lg:block text-right">
            <p
              class="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] mb-2"
            >
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
              <h3
                class="text-xs font-black text-white/40 uppercase tracking-[0.4em] mb-4 flex items-center gap-2"
              >
                <span class="w-1.5 h-1.5 bg-gold rounded-full"></span> Matchs du
                Tournoi
              </h3>

              <div v-if="matches.length" class="space-y-4">
                <div
                  v-for="match in matches"
                  :key="match.id"
                  class="match-card glass-card hover:border-gold/30 transition-all"
                >
                  <div class="p-4 flex items-center justify-between">
                    <div class="flex-1 flex flex-col items-center gap-2">
                      <img
                        :src="match.clan1?.badge_url"
                        class="w-10 h-10 object-contain"
                      />
                      <span
                        class="text-[9px] font-black text-white uppercase truncate max-w-[80px]"
                        >{{ match.clan1?.name }}</span
                      >
                    </div>

                    <div class="flex flex-col items-center gap-1 px-4">
                      <div
                        class="text-[10px] text-white/20 uppercase font-black tracking-widest"
                      >
                        {{ match.scheduled_at_formatted }}
                      </div>
                      <div class="text-2xl font-black italic text-white">
                        <span v-if="match.status === 'completed'"
                          >{{ match.score1 }} - {{ match.score2 }}</span
                        >
                        <span v-else class="text-gold/40">VS</span>
                      </div>
                      <div
                        class="px-2 py-0.5 bg-white/5 rounded text-[8px] uppercase font-black text-white/40"
                      >
                        {{ match.round_name }}
                      </div>
                    </div>

                    <div class="flex-1 flex flex-col items-center gap-2">
                      <img
                        :src="match.clan2?.badge_url"
                        class="w-10 h-10 object-contain"
                      />
                      <span
                        class="text-[9px] font-black text-white uppercase truncate max-w-[80px]"
                        >{{ match.clan2?.name }}</span
                      >
                    </div>
                  </div>
                </div>
              </div>
              <div
                v-else
                class="text-center py-12 border-2 border-dashed border-white/5 rounded-2xl"
              >
                <p
                  class="text-white/20 text-[10px] uppercase font-black tracking-widest"
                >
                  Le tableau des matchs n'est pas encore généré
                </p>
              </div>
            </section>
          </div>

          <!-- Column 2: Roster & Payment Status -->
          <div class="space-y-6">
            <section>
              <h3
                class="text-xs font-black text-white/40 uppercase tracking-[0.4em] mb-4"
              >
                Roster & Status
              </h3>
              <div class="glass-card overflow-hidden">
                <div class="p-4 bg-white/5 border-b border-white/5">
                  <p
                    class="text-[10px] font-black text-white/60 uppercase tracking-widest"
                  >
                    National Team
                  </p>
                </div>
                <div class="divide-y divide-white/5">
                  <div
                    v-for="p in registration.players"
                    :key="p.id"
                    class="p-4 flex items-center gap-3"
                  >
                    <div
                      class="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-[10px] font-black"
                      :class="p.is_substitute ? 'text-white/20' : 'text-gold'"
                    >
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
                      <span
                        v-if="p.is_substitute"
                        class="text-[7px] px-1.5 py-0.5 bg-white/5 text-white/40 font-black rounded uppercase"
                        >Sub</span
                      >
                      <div
                        v-if="!p.is_substitute"
                        class="payment-dot"
                        :class="
                          isPaid(p.player_id)
                            ? 'bg-green-500 shadow-green-500/50'
                            : 'bg-red-500 shadow-red-500/20'
                        "
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <!-- Actions -->
            <div class="space-y-3">
              <button
                v-if="!amIPaid && amIStarter"
                @click="navigateToRegister"
                class="btn-premium btn-primary w-full text-[10px]"
              >
                Régler ma Participation (1,000 FCFA)
              </button>
              <NuxtLink
                to="/tournaments/bracket"
                class="btn-tournament secondary w-full text-[10px]"
                >Voir le Bracket Global</NuxtLink
              >
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
        <NuxtLink :to="ctaTo" class="btn-premium btn-primary text-xs"
          >{{ ctaIcon }} {{ ctaLabel }}</NuxtLink
        >
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
    registration.value?.players.find((p) => p.user?.role === "captain")?.user,
);
const confirmedPaymentsCount = computed(
  () => payments.value.filter((p) => p.status === "confirmed").length,
);
const amIStarter = computed(() =>
  registration.value?.players.find(
    (p) => p.player_id === user.value?.id && !p.is_substitute,
  ),
);
const amIPaid = computed(() =>
  payments.value.some(
    (p) => p.user_id === user.value?.id && p.status === "confirmed",
  ),
);

const fetchData = async () => {
  loading.value = true;
  try {
    const res = await $api(
      `/competitions/${competitionId}/registration/status`,
    );
    registration.value = res;

    if (res) {
      // Fetch matches related to this clan
      const allMatches = await $api(`/tournament/bracket`); // Simplified, assume we filter frontend for now
      matches.value = allMatches.filter(
        (m) => m.clan1_id === res.clan_id || m.clan2_id === res.clan_id,
      );

      // Fetch payments for this registration
      // (Backend support might be needed for a clean list, but assuming it's in registration meta or separate)
      payments.value = res.payments || [];
    }
  } catch (e) {
    console.error(e);
    $toast.error("Impossible de charger les données de votre clan.");
  } finally {
    loading.value = false;
  }
};

const isPaid = (userId) =>
  payments.value.some((p) => p.user_id === userId && p.status === "confirmed");

const navigateToRegister = () => router.push(`/tournaments/register?step=3`);

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
