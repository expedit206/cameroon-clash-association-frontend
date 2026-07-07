<template>
  <div class="bracket-page min-h-screen pb-20">
    <div class="container mx-auto px-4 py-10">
      <!-- Header -->
      <header class="page-header text-center mb-16 animate-float">
        <h1
          class="heading text-5xl md:text-6xl font-black italic tracking-tighter"
        >
          TABLEAU DE <span class="text-gold">TOURNOI</span>
        </h1>
        <p
          class="subtitle mt-2 text-xl opacity-60 uppercase tracking-[0.3em] font-light"
        >
          Le chemin vers la consécration ultime
        </p>
      </header>

      <!-- Loader -->
      <div
        v-if="loading"
        class="loader-container py-32 text-center bg-black/20 rounded-3xl"
      >
        <div class="spinner mx-auto mb-6"></div>
        <p
          class="text-gold font-bold tracking-[0.5em] animate-pulse uppercase text-xs"
        >
          Génération de l'arène...
        </p>
      </div>

      <!-- Empty State -->
      <div
        v-else-if="Object.keys(bracket).length === 0"
        class="empty-bracket glass-card text-center p-10 md:p-20"
      >
        <div class="text-7xl mb-6">🏟️</div>
        <p class="text-xl font-bold text-white mb-6 uppercase tracking-wider">
          Le tournoi n'a pas encore été généré.
        </p>
        <p class="opacity-50 text-sm max-w-md mx-auto mb-10">
          Dès que 16 clans d'élite seront confirmés et validés par
          l'administration, l'arbre de combat apparaîtra ici.
        </p>

        <div class="registration-status max-w-sm mx-auto">
          <div
            class="relative h-3 bg-white/5 rounded-full overflow-hidden mb-3"
          >
            <div
              class="h-full bg-gradient-to-r from-gold to-orange-500 rounded-full transition-all duration-1000"
              :style="{ width: (confirmedCount / 16) * 100 + '%' }"
            ></div>
          </div>
          <p class="text-xs font-black text-gold uppercase tracking-widest">
            {{ confirmedCount }} / 16 clans confirmés
          </p>
        </div>
      </div>

      <!-- Tournament Tree -->
      <div v-else class="bracket-wrapper">
        <div class="bracket-scroll-container overflow-x-auto pb-10">
          <div
            class="bracket-container flex gap-12 md:gap-20 min-w-[1200px] justify-center px-4"
          >
            <!-- Round 1: 8èmes -->
            <div class="bracket-round flex flex-col w-64">
              <h4
                class="round-title text-[10px] uppercase font-black tracking-[0.3em] text-white/30 mb-8 text-center italic"
              >
                8èmes de Finale
              </h4>
              <div
                class="matches-list flex flex-col justify-around flex-1 gap-6"
              >
                <div
                  v-for="match in bracket[1]"
                  :key="match.id"
                  class="match-card glass-card !p-3 border-white/5 hover:border-gold/30 transition-all duration-300"
                >
                  <div class="match-teams space-y-2">
                    <div
                      class="team-row flex items-center gap-3 p-2 rounded-lg"
                      :class="getTeamStatusClass(match, 1)"
                    >
                      <img
                        :src="
                          match.clan1?.badge_url || '/images/default-clan.png'
                        "
                        class="w-6 h-6 object-contain"
                      />
                      <span class="name flex-1 font-bold text-sm truncate">{{
                        match.clan1?.name || "TBD"
                      }}</span>
                      <span
                        v-if="match.status === 'completed'"
                        class="score font-black text-gold"
                        >{{ match.total_stars_home }}</span
                      >
                    </div>
                    <div class="vs-divider flex items-center gap-2">
                      <div class="h-px flex-1 bg-white/5"></div>
                      <span
                        class="text-[8px] font-black italic opacity-20 uppercase"
                        >VS</span
                      >
                      <div class="h-px flex-1 bg-white/5"></div>
                    </div>
                    <div
                      class="team-row flex items-center gap-3 p-2 rounded-lg"
                      :class="getTeamStatusClass(match, 2)"
                    >
                      <img
                        :src="
                          match.clan2?.badge_url || '/images/default-clan.png'
                        "
                        class="w-6 h-6 object-contain"
                      />
                      <span class="name flex-1 font-bold text-sm truncate">{{
                        match.clan2?.name || "TBD"
                      }}</span>
                      <span
                        v-if="match.status === 'completed'"
                        class="score font-black text-gold"
                        >{{ match.total_stars_away }}</span
                      >
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Round 2: Quarts -->
            <div class="bracket-round flex flex-col w-64">
              <h4
                class="round-title text-[10px] uppercase font-black tracking-[0.3em] text-white/30 mb-8 text-center italic"
              >
                Quarts de Finale
              </h4>
              <div
                class="matches-list flex flex-col justify-around flex-1 gap-6"
              >
                <div
                  v-for="match in bracket[2]"
                  :key="match.id"
                  class="match-card glass-card !p-3 border-white/5 hover:border-gold/30 transition-all duration-300"
                >
                  <div class="match-teams space-y-2">
                    <div
                      class="team-row flex items-center gap-3 p-2 rounded-lg"
                      :class="getTeamStatusClass(match, 1)"
                    >
                      <img
                        v-if="match.clan1"
                        :src="match.clan1.badge_url"
                        class="w-6 h-6 object-contain"
                      />
                      <span class="name flex-1 font-bold text-sm truncate">{{
                        match.clan1?.name || "Vainqueur M" + match.match_number
                      }}</span>
                    </div>
                    <div class="vs-divider flex items-center gap-2">
                      <div class="h-px flex-1 bg-white/5"></div>
                      <span
                        class="text-[8px] font-black italic opacity-20 uppercase"
                        >VS</span
                      >
                      <div class="h-px flex-1 bg-white/5"></div>
                    </div>
                    <div
                      class="team-row flex items-center gap-3 p-2 rounded-lg"
                      :class="getTeamStatusClass(match, 2)"
                    >
                      <img
                        v-if="match.clan2"
                        :src="match.clan2.badge_url"
                        class="w-6 h-6 object-contain"
                      />
                      <span class="name flex-1 font-bold text-sm truncate">{{
                        match.clan2?.name ||
                        "Vainqueur M" + (match.match_number + 1)
                      }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Round 3: Semis -->
            <div class="bracket-round flex flex-col w-64">
              <h4
                class="round-title text-[10px] uppercase font-black tracking-[0.3em] text-white/30 mb-8 text-center italic text-gold"
              >
                Demi-Finales
              </h4>
              <div
                class="matches-list flex flex-col justify-around flex-1 gap-6"
              >
                <div
                  v-for="match in bracket[3]"
                  :key="match.id"
                  class="match-card glass-card !p-3 border-white/5 hover:border-gold/50 transition-all duration-300 semi-card"
                >
                  <div class="match-teams space-y-2">
                    <div
                      class="team-row flex items-center gap-3 p-2 rounded-lg"
                      :class="getTeamStatusClass(match, 1)"
                    >
                      <span
                        class="name flex-1 font-black text-sm text-center uppercase italic opacity-70"
                        >{{ match.clan1?.name || "TOP 4" }}</span
                      >
                    </div>
                    <div class="vs-divider flex items-center gap-2">
                      <div class="h-px flex-1 bg-white/5"></div>
                      <span
                        class="text-[8px] font-black italic opacity-20 uppercase"
                        >VS</span
                      >
                      <div class="h-px flex-1 bg-white/5"></div>
                    </div>
                    <div
                      class="team-row flex items-center gap-3 p-2 rounded-lg"
                      :class="getTeamStatusClass(match, 2)"
                    >
                      <span
                        class="name flex-1 font-black text-sm text-center uppercase italic opacity-70"
                        >{{ match.clan2?.name || "TOP 4" }}</span
                      >
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Round 4: Final + Trophy -->
            <div class="bracket-round flex flex-col w-72 pt-10">
              <div class="grand-finale-header text-center mb-10">
                <div
                  class="trophy-icon text-7xl mb-4 drop-shadow-2xl animate-bounce-slow"
                >
                  🏆
                </div>
                <h4
                  class="round-title text-[12px] uppercase font-black tracking-[0.5em] text-gold italic"
                >
                  GRANDE FINALE
                </h4>
              </div>
              <div class="matches-list flex flex-col justify-center flex-1">
                <div
                  v-for="match in bracket[4]"
                  :key="match.id"
                  class="match-card glass-card !p-6 border-gold/30 shadow-[0_0_50px_rgba(212,175,55,0.1)] final-card"
                >
                  <div class="match-teams space-y-4">
                    <div
                      class="team-row flex items-center gap-4 p-4 rounded-xl scale-110"
                      :class="getTeamStatusClass(match, 1)"
                    >
                      <img
                        v-if="match.clan1"
                        :src="match.clan1.badge_url"
                        class="w-10 h-10 object-contain"
                      />
                      <span
                        class="name flex-1 font-black text-xl italic tracking-tighter truncate"
                        >{{ match.clan1?.name || "FINALE" }}</span
                      >
                    </div>
                    <div class="vs-divider flex items-center gap-4">
                      <div class="h-px flex-1 bg-gold/20"></div>
                      <span
                        class="text-xs font-black italic text-gold uppercase tracking-widest"
                        >OU</span
                      >
                      <div class="h-px flex-1 bg-gold/20"></div>
                    </div>
                    <div
                      class="team-row flex items-center gap-4 p-4 rounded-xl scale-110"
                      :class="getTeamStatusClass(match, 2)"
                    >
                      <img
                        v-if="match.clan2"
                        :src="match.clan2.badge_url"
                        class="w-10 h-10 object-contain"
                      />
                      <span
                        class="name flex-1 font-black text-xl italic tracking-tighter truncate"
                        >{{ match.clan2?.name || "FINALE" }}</span
                      >
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const { $api } = useNuxtApp();
const bracket = ref({});
const confirmedCount = ref(0);
const loading = ref(true);

const fetchData = async () => {
  loading.value = true;
  try {
    const [bracketData, adminStats] = await Promise.all([
      $api("/tournament/bracket"),
      $api("/admin/stats"),
    ]);
    bracket.value = bracketData;
    confirmedCount.value = adminStats.confirmed_registrations || 0;
  } catch (e) {
    console.error("Error fetching bracket data:", e);
  } finally {
    loading.value = false;
  }
};

const getTeamStatusClass = (match, teamNum) => {
  if (match.status !== "completed") return "";
  const isWinner =
    teamNum === 1
      ? match.winner_clan_id === match.clan_home_id
      : match.winner_clan_id === match.clan_away_id;
  return isWinner
    ? "winner-glow bg-gold/10 text-gold scale-[1.02]"
    : "opacity-30 grayscale";
};

onMounted(fetchData);
</script>

<style scoped>
.bracket-page {
  background:
    radial-gradient(
      circle at 50% 0%,
      rgba(212, 175, 55, 0.15) 0%,
      transparent 60%
    ),
    linear-gradient(to bottom, #06070a, #0a1122);
}

.bracket-wrapper {
  background: rgba(255, 255, 255, 0.02);
  border-radius: 40px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  padding: 40px 0;
  backdrop-filter: blur(10px);
}

.match-card {
  transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
  position: relative;
}

.match-card:hover {
  transform: scale(1.05);
  z-index: 10;
  background: rgba(255, 255, 255, 0.07);
}

.winner-glow {
  box-shadow: inset 0 0 20px rgba(212, 175, 55, 0.1);
}

.spinner {
  width: 60px;
  height: 60px;
  border: 4px solid rgba(255, 255, 255, 0.03);
  border-top-color: var(--primary);
  border-radius: 50%;
  animation: spin 0.8s cubic-bezier(0.4, 0, 0.2, 1) infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@keyframes bounceSlow {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.animate-bounce-slow {
  animation: bounceSlow 3s ease-in-out infinite;
}

/* Custom Scrollbar for the horizontal bracket */
.bracket-scroll-container::-webkit-scrollbar {
  height: 8px;
}
.bracket-scroll-container::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.02);
  border-radius: 10px;
}
.bracket-scroll-container::-webkit-scrollbar-thumb {
  background: rgba(212, 175, 55, 0.2);
  border-radius: 10px;
}
.bracket-scroll-container::-webkit-scrollbar-thumb:hover {
  background: rgba(212, 175, 55, 0.4);
}

@media (max-width: 640px) {
  .heading {
    font-size: 2.2rem;
    line-height: 1.1;
  }
  .bracket-wrapper {
    border-radius: 20px;
    padding: 20px 0;
  }
}
</style>
