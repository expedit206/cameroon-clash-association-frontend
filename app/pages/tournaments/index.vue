<template>
  <div class="tournament-area min-h-screen pb-12 bg-[#06070a]">
    <!-- Header Hero -->
    <header
      class="relative min-h-[35vh] md:min-h-[45vh] flex flex-col items-center justify-center pt-24 pb-16 px-6 text-center border-b border-white/5">
      <div class="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <img src="/images/hero-bg.png" class="w-full h-full object-cover opacity-60 scale-105" alt="" />
        <div class="absolute inset-0 bg-gradient-to-b from-transparent via-[#06070a]/50 to-[#06070a]/90"></div>
      </div>

      <div class="relative z-10 animate-in" v-if="competition">
        <!-- Badge Saison 2 -->
        <div
          class="inline-flex items-center gap-2 px-4 py-1.5 mb-5 bg-gold/10 border border-gold/25 rounded-full text-[0.7rem] font-bold tracking-widest text-gold/90">
          <span class="w-1.5 h-1.5 rounded-full bg-gold animate-pulse"></span>
          Saison 2 — Inscriptions le 10 novembre
        </div>

        <h1 class="text-3xl md:text-5xl font-black italic tracking-tighter text-white uppercase mb-3">
          {{ competition.name }}
          <span class="text-gold">Saison 2</span>
        </h1>

        <p class="max-w-xl mx-auto text-white/40 text-xs md:text-sm tracking-[0.3em] font-light mb-8">
          L'élite du Cameroun s'affronte pour le trône
        </p>

        <div class="flex flex-wrap justify-center gap-3">
          <!-- Avant ouverture -->
          <template v-if="competition.status === 'draft' || competition.status === 'closed'">
            <div class="btn-tournament primary cursor-default opacity-90">
              ⏳ Ouverture des inscriptions : 10 novembre 2026
            </div>
          </template>

          <!-- Inscriptions ouvertes -->
          <NuxtLink v-else-if="competition.status === 'open'" to="/tournaments/register" class="btn-tournament primary">
            ⚔️ Inscrire mon clan
          </NuxtLink>

          <!-- Tournoi en cours / terminé -->
          <NuxtLink v-else to="/tournaments/bracket" class="btn-tournament primary">
            🏆 Voir le Bracket
          </NuxtLink>

          <NuxtLink to="/rules" class="btn-tournament secondary">
            <LucideFileText :size="18" class="inline mr-1" /> Règlement
          </NuxtLink>
        </div>
      </div>
    </header>

    <div class="container mx-auto px-4 max-w-6xl -mt-8 relative z-20">
      <!-- Description + Stats -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
        <!-- Description -->
        <div class="lg:col-span-2 glass-card !p-8 border-white/5">
          <div class="flex items-center gap-3 mb-6">
            <div class="w-8 h-px bg-gold/50"></div>
            <h3 class="text-[10px] font-black uppercase tracking-[0.4em] text-gold italic">
              Présentation du Tournoi
            </h3>
          </div>
          <div class="space-y-4">
            <p class="text-white/70 leading-relaxed text-sm md:text-base">
              La
              <span class="text-white font-bold">CCA National League</span>
              est la compétition suprême réunissant les
              <strong>16 meilleurs clans</strong> du Cameroun. Format à
              élimination indirecte en <strong>5v5</strong> (HDV 14 à 18).
            </p>
            <p class="text-white/60 text-xs md:text-sm italic border-l-2 border-gold/20 pl-4 py-1">
              « Plus qu'un tournoi, une légende en construction pour l'eSport
              camerounais. »
            </p>
          </div>

          <!-- Stats compactes -->
          <div class="grid grid-cols-2 md:grid-cols-4 gap-6 mt-10 pt-8 border-t border-white/5">
            <div class="stat-box">
              <div class="text-[9px] text-white/30 uppercase tracking-widest mb-1">
                Capacité
              </div>
              <div class="text-xl font-black text-white italic tracking-tighter">
                {{ competition?.max_teams }} Clans
              </div>
            </div>
            <div class="stat-box">
              <div class="text-[9px] text-white/30 uppercase tracking-widest mb-1">
                Format
              </div>
              <div class="text-xl font-black text-white italic tracking-tighter">
                5 VS 5
              </div>
            </div>
            <div class="stat-box">
              <div class="text-[9px] text-white/30 uppercase tracking-widest mb-1">
                HDV
              </div>
              <div class="text-xl font-black text-white italic tracking-tighter">
                14 à 18
              </div>
            </div>
            <div class="stat-box">
              <div class="text-[9px] text-white/30 uppercase tracking-widest mb-1">
                Inscrits
              </div>
              <div class="text-xl font-black text-gold italic tracking-tighter">
                {{ confirmedClans }} / 16
              </div>
            </div>
          </div>
        </div>

        <!-- Chronologie -->
        <div class="glass-card !p-0 border-white/5 bg-white/2">
          <div class="p-6 border-b border-white/5">
            <h3 class="text-[10px] font-black tracking-[0.4em] text-white/40 italic">
              Chronologie
            </h3>
          </div>
          <div class="p-8 space-y-6">
            <div class="deadline-item">
              <div class="flex items-center gap-3 mb-2">
                <span class="text-xl">📅</span>
                <span class="text-[10px] font-black tracking-widest uppercase text-white/30">
                  Ouverture des inscriptions
                </span>
              </div>
              <div class="text-lg font-black text-white ml-8 italic tracking-tighter">
                10 novembre 2026
              </div>
            </div>

            <div class="deadline-item">
              <div class="flex items-center gap-3 mb-2">
                <span class="text-xl">⚔️</span>
                <span class="text-[10px] font-black tracking-widest uppercase text-white/30">
                  Début des matches
                </span>
              </div>
              <div class="text-lg font-black text-white/50 ml-8 italic tracking-tighter">
                À définir
              </div>
            </div>

            <div class="deadline-item">
              <div class="flex items-center gap-3 mb-2">
                <span class="text-xl">🏆</span>
                <span class="text-[10px] font-black tracking-widest uppercase text-white/30">
                  Cashprize total
                </span>
              </div>
              <div class="text-lg font-black text-gold ml-8 italic tracking-tighter">
                80 000 FCFA
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Récompenses -->
      <div class="glass-card !p-8 mb-12 border-white/5 relative overflow-hidden">
        <div class="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
          <span class="text-9xl font-black italic">WIN</span>
        </div>

        <h3 class="text-[10px] font-black uppercase tracking-[0.4em] text-white/40 italic mb-10 text-center">
          Distribution des Récompenses — Saison 2
        </h3>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <!-- 2e -->
          <div
            class="payout-card glass-card !bg-white/5 border-white/5 text-center flex flex-col justify-center order-2 md:order-1">
            <div class="text-[9px] font-black tracking-[0.2em] text-white/30 uppercase mb-2">
              Finaliste
            </div>
            <div class="text-2xl font-black text-white/70 italic tracking-tighter mb-4">
              {{ formatFcfa(competition?.prize_2nd) }}
            </div>
            <div class="h-1 bg-white/10 rounded-full mx-10"></div>
          </div>

          <!-- 1er -->
          <div
            class="payout-card glass-card !bg-gold/10 border-gold/20 text-center py-10 scale-105 relative z-10 order-1 md:order-2">
            <div
              class="absolute -top-4 left-1/2 -translate-x-1/2 bg-gold text-black text-[9px] font-black px-3 py-1 rounded-full tracking-widest">
              VAINQUEUR
            </div>
            <div
              class="text-4xl font-black text-white italic tracking-tighter mb-4 drop-shadow-[0_0_15px_rgba(212,175,55,0.4)]">
              {{ formatFcfa(competition?.prize_1st) }}
            </div>
            <div class="h-1.5 bg-gold/50 rounded-full mx-12"></div>
            <p class="mt-4 text-[10px] font-black tracking-widest text-gold uppercase">
              Champion National S2
            </p>
          </div>

          <!-- 3e -->
          <div
            class="payout-card glass-card !bg-white/5 border-white/5 text-center flex flex-col justify-center order-3">
            <div class="text-[9px] font-black tracking-[0.2em] text-white/30 uppercase mb-2">
              Semi-finaliste
            </div>
            <div class="text-2xl font-black text-white/40 italic tracking-tighter mb-4">
              {{ formatFcfa(competition?.prize_3rd) }}
            </div>
            <div class="h-1 bg-white/5 rounded-full mx-10"></div>
          </div>
        </div>
      </div>

      <!-- Mur des participants -->
      <div class="mb-12">
        <div class="flex items-center gap-4 mb-8 px-2">
          <h2 class="text-2xl font-black italic text-white uppercase tracking-tighter flex-shrink-0">
            Les <span class="text-gold">Prétendants</span>
          </h2>
          <div class="h-px w-full bg-gradient-to-r from-white/10 to-transparent"></div>
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <div v-for="clan in clans" :key="clan.id"
            class="glass-card !p-4 border-white/5 hover:border-gold/30 hover:bg-gold/5 transition-all duration-300 group text-center">
            <img :src="clan.badge"
              class="w-12 h-12 mx-auto object-contain transition-transform group-hover:scale-110 mb-3"
              :alt="clan.name" />
            <h4 class="font-bold text-xs uppercase truncate tracking-wide text-white">
              {{ clan.name }}
            </h4>
            <span class="text-[8px] font-black text-white/20 tracking-widest uppercase truncate">
              {{ clan.tag }}
            </span>
          </div>

          <!-- Places libres -->
          <div v-for="n in Math.max(0, 16 - confirmedClans)" :key="'empty' + n"
            class="glass-card !p-4 border-dashed border-white/10 flex items-center justify-center opacity-20">
            <span class="text-[10px] font-black text-white/30 tracking-widest uppercase">
              Libre
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const { $api } = useNuxtApp();
const route = useRoute();

useHead({
  title: "Tournois & Compétitions | CCA National League Saison 2 🇨🇲",
  meta: [
    {
      name: "description",
      content:
        "CCA National League Saison 2 — Inscriptions le 10 novembre 2026. 80 000 FCFA de cashprize, 16 clans d'élite, format 5v5.",
    },
    {
      name: "keywords",
      content:
        "tournoi camerounais, tournoi coc, clash of clans cameroun, eSport cameroun, cca league saison 2, bracket tournoi",
    },
    {
      property: "og:title",
      content: "CCA National League Saison 2 — Tournois & Matches CoC Cameroun 🏆",
    },
    {
      property: "og:description",
      content:
        "16 clans s'affrontent en 5v5. Inscriptions ouvertes le 10 novembre 2026. Cashprize total 80 000 FCFA.",
    },
    {
      property: "og:image",
      content: "/images/cca-affiche1.png",
    },
  ],
});

const loading = ref(true);
const competition = ref(null);
const clans = ref([]);
const confirmedClans = ref(0);

const COMPETITION_ID = 2;

const formatFcfa = (n) => {
  if (n === null || n === undefined) return "---";
  return n.toLocaleString("fr-FR") + " FCFA";
};

const formatDate = (d) => {
  if (!d) return "À définir";
  return new Date(d).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};

const fetchData = async () => {
  loading.value = true;
  try {


    const [competitionData, clansData] = await Promise.all([
      $api('/tournament/competition').catch(() => null),
      $api('/tournament/clans').catch(() => []),
    ]);

    competition.value = competitionData;
    clans.value = clansData || [];
    confirmedClans.value = clans.value.length;


    /**const [clansData] = await Promise.all([
      $api("/tournament/clans").catch(() => []),
    ]);

    clans.value = clansData || [];
    confirmedClans.value = clans.value.length;

    // Données Saison 2 (alignées avec la homepage)
    competition.value = {
      id: COMPETITION_ID,
      name: "CCA National League",
      season_number: 2,
      status: "draft", // avant le 10 novembre → draft
      max_teams: 16,
      registration_fee: 1000,
      prize_1st: 50000,
      prize_2nd: 20000,
      prize_3rd: 10000,
      registration_opens_at: "2026-11-10T00:00:00+01:00",
      starts_at: null, // à définir plus tard
    };**/
  } catch (e) {
    console.error("Error fetching tournament data:", e);
  } finally {
    loading.value = false;
  }
};

onMounted(async () => {
  await fetchData();
});
</script>

<style scoped>
.status-badge-compact {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 16px;
  border-radius: 40px;
  font-size: 0.65rem;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  background: rgba(212, 175, 55, 0.1);
  border: 1px solid rgba(212, 175, 55, 0.2);
  color: var(--gold);
}

.pulse-dot {
  width: 6px;
  height: 6px;
  background: var(--gold);
  border-radius: 50%;
  animation: dot-pulse 2s infinite;
}

@keyframes dot-pulse {

  0%,
  100% {
    opacity: 1;
    transform: scale(1);
  }

  50% {
    opacity: 0.5;
    transform: scale(1.2);
  }
}

.stat-box {
  display: flex;
  flex-direction: column;
}

.payout-card {
  padding: 24px;
  border-radius: 12px;
  transition: all 0.3s;
}

.animate-in {
  animation: reveal 0.8s cubic-bezier(0.16, 1, 0.3, 1) backwards;
}

@keyframes reveal {
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