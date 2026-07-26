<template>
  <div class="tournament-area min-h-screen pb-12 bg-[#06070a]">
    <!-- Header Hero (Refined & Compact) -->
    <header
      class="relative min-h-[35vh] md:min-h-[45vh] flex flex-col items-center justify-center pt-24 pb-16 px-6 text-center border-b border-white/5"
    >
      <div class="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <img
          src="/images/tournaments/hero-bg.png"
          class="w-full h-full object-cover opacity-40 scale-105"
        />
        <div
          class="absolute inset-0 bg-gradient-to-b from-transparent via-[#06070a]/5 0 to-[#06070a]/20"
        ></div>
      </div>

      <div class="relative z-10 animate-in" v-if="competition">
        <div class="flex justify-center mb-4">
          <span class="status-badge-compact pulse-gold">
            <span class="pulse-dot"></span>
            {{ statusLabel }}
          </span>
        </div>

        <h1
          class="text-3xl md:text-5xl font-black italic tracking-tighter text-white uppercase mb-3"
        >
          {{ competition.name }} <span class="text-gold">Saison 1</span>
        </h1>

        <p
          class="max-w-xl mx-auto text-white/40 text-xs md:text-sm uppercase tracking-[0.3em] font-light mb-8"
        >
          L'élite du Cameroun s'affronte pour le trône
        </p>

        <div class="flex flex-wrap justify-center gap-3">
          <NuxtLink
            v-if="competition.status === 'open'"
            :to="`/tournaments/register`"
            class="btn-tournament primary cursor-pointer"
          >
            ⚔️ Inscrire mon Clan
          </NuxtLink>
          <NuxtLink
            v-else
            :to="`/tournaments/bracket`"
            class="btn-tournament primary"
          >
            🏆 Voir le Bracket
          </NuxtLink>
          <NuxtLink to="/rules" class="btn-tournament secondary">
            <LucideFileText :size="18" class="inline mr-1" /> Règlement
          </NuxtLink>
        </div>
      </div>
    </header>

    <div class="container mx-auto px-4 max-w-6xl -mt-8 relative z-20">
      <!-- Tournament Description & Core Stats -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
        <!-- Description Section -->
        <div class="lg:col-span-2 glass-card !p-8 border-white/5">
          <div class="flex items-center gap-3 mb-6">
            <div class="w-8 h-px bg-gold/50"></div>
            <h3
              class="text-[10px] font-black uppercase tracking-[0.4em] text-gold italic"
            >
              Présentation du Tournoi
            </h3>
          </div>
          <div class="space-y-4">
            <p class="text-white/70 leading-relaxed text-sm md:text-base">
              La
              <span class="text-white font-bold">CCA National League</span> est
              la compétition suprême réunissant les 16 meilleurs clans du
              Cameroun. Dans un format de bracket à élimination directe, chaque
              duel est une démonstration de stratégie, de précision et de force.
            </p>
            <p
              class="text-white/60 text-xs md:text-sm italic border-l-2 border-gold/20 pl-4 py-1"
            >
              "Plus qu'un tournoi, une légende en construction pour l'eSport
              camerounais."
            </p>
          </div>

          <!-- Compact Stats Row -->
          <div
            class="grid grid-cols-2 md:grid-cols-4 gap-6 mt-10 pt-8 border-t border-white/5"
          >
            <div class="stat-box">
              <div
                class="text-[9px] text-white/30 uppercase tracking-widest mb-1"
              >
                Capacité
              </div>
              <div
                class="text-xl font-black text-white italic tracking-tighter"
              >
                {{ competition?.max_teams }} Clans
              </div>
            </div>
            <div class="stat-box">
              <div
                class="text-[9px] text-white/30 uppercase tracking-widest mb-1"
              >
                Format
              </div>
              <div
                class="text-xl font-black text-white italic tracking-tighter"
              >
                5 VS 5
              </div>
            </div>
            <div class="stat-box">
              <div
                class="text-[9px] text-white/30 uppercase tracking-widest mb-1"
              >
                HDV
              </div>
              <div
                class="text-xl font-black text-white italic tracking-tighter"
              >
                14 à 18
              </div>
            </div>
            <div class="stat-box">
              <div
                class="text-[9px] text-white/30 uppercase tracking-widest mb-1"
              >
                Inscrit
              </div>
              <div class="text-xl font-black text-gold italic tracking-tighter">
                {{ confirmedClans }} / 16
              </div>
            </div>
          </div>
        </div>

        <!-- Quick Info & Deadlines -->
        <div class="glass-card !p-0 border-white/5 bg-white/2">
          <div class="p-6 border-b border-white/5">
            <h3
              class="text-[10px] font-black uppercase tracking-[0.4em] text-white/40 italic"
            >
              Chronologie
            </h3>
          </div>
          <div class="p-8 space-y-6">
            <div class="deadline-item">
              <div class="flex items-center gap-3 mb-2">
                <span class="text-xl">📅</span>
                <span
                  class="text-[10px] font-black tracking-widest uppercase text-white/30"
                  >Début des inscriptions des clans</span
                >
              </div>
              <div
                class="text-lg font-black text-white ml-8 italic tracking-tighter"
              >
                15 Juillet 2026
              </div>
            </div>
            <div class="deadline-item">
              <div class="flex items-center gap-3 mb-2">
                <span class="text-xl">⚔️</span>
                <span
                  class="text-[10px] font-black tracking-widest uppercase text-white/30"
                  >Début des Matches</span
                >
              </div>
              <div
                class="text-lg font-black text-white ml-8 italic tracking-tighter"
              >
                {{ formatDate(competition?.starts_at) }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Payout Grid (Compact Podium) -->
      <div
        class="glass-card !p-8 mb-12 border-white/5 relative overflow-hidden"
      >
        <div class="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
          <span class="text-9xl font-black italic">WIN</span>
        </div>

        <h3
          class="text-[10px] font-black uppercase tracking-[0.4em] text-white/40 italic mb-10 text-center"
        >
          Distribution des Récompenses
        </h3>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <!-- 2nd -->
          <div
            class="payout-card glass-card !bg-white/5 border-white/5 text-center flex flex-col justify-center order-2 md:order-1"
          >
            <div
              class="text-[9px] font-black tracking-[0.2em] text-white/30 uppercase mb-2"
            >
              Finaliste
            </div>
            <div
              class="text-2xl font-black text-white/70 italic tracking-tighter mb-4"
            >
              {{ formatFcfa(competition?.prize_2nd) }}
            </div>
            <div class="h-1 bg-white/10 rounded-full mx-10"></div>
          </div>
          <!-- 1st -->
          <div
            class="payout-card glass-card !bg-gold/10 border-gold/20 text-center py-10 scale-105 relative z-10 order-1 md:order-2"
          >
            <div
              class="absolute -top-4 left-1/2 -translate-x-1/2 bg-gold text-black text-[9px] font-black px-3 py-1 rounded-full tracking-widest"
            >
              VAINQUEUR
            </div>
            <div
              class="text-4xl font-black text-white italic tracking-tighter mb-4 drop-shadow-[0_0_15px_rgba(212,175,55,0.4)]"
            >
              {{ formatFcfa(competition?.prize_1st) }}
            </div>
            <div class="h-1.5 bg-gold/50 rounded-full mx-12"></div>
            <p
              class="mt-4 text-[10px] font-black tracking-widest text-gold uppercase"
            >
              Champion National
            </p>
          </div>
          <!-- 3rd -->
          <div
            class="payout-card glass-card !bg-white/5 border-white/5 text-center flex flex-col justify-center order-3"
          >
            <div
              class="text-[9px] font-black tracking-[0.2em] text-white/30 uppercase mb-2"
            >
              Podium
            </div>
            <div
              class="text-2xl font-black text-white/40 italic tracking-tighter mb-4"
            >
              {{ formatFcfa(competition?.prize_3rd) }}
            </div>
            <div class="h-1 bg-white/5 rounded-full mx-10"></div>
          </div>
        </div>
      </div>

      <!-- Participant Wall (Compact Cards) -->
      <div class="mb-12">
        <div class="flex items-center gap-4 mb-8 px-2">
          <h2
            class="text-2xl font-black italic text-white uppercase tracking-tighter flex-shrink-0"
          >
            Les <span class="text-gold">Prétendants</span>
          </h2>
          <div
            class="h-px w-full bg-gradient-to-r from-white/10 to-transparent"
          ></div>
        </div>

        <div
          class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4"
        >
          <div
            v-for="clan in clans"
            :key="clan.id"
            class="glass-card !p-4 border-white/5 hover:border-gold/30 hover:bg-gold/5 transition-all duration-300 group text-center"
          >
            <img
              :src="clan.badge"
              class="w-12 h-12 mx-auto object-contain transition-transform group-hover:scale-110 mb-3"
            />
            <h4
              class="font-bold text-xs uppercase truncate tracking-wide text-white"
            >
              {{ clan.name }}
            </h4>
            <span
              class="text-[8px] font-black text-white/20 tracking-widest uppercase truncate"
              >{{ clan.tag }}</span
            >
          </div>

          <!-- Fill gaps -->
          <div
            v-for="n in 16 - confirmedClans"
            :key="'empty' + n"
            class="glass-card !p-4 border-dashed border-white/10 flex items-center justify-center opacity-20"
          >
            <span
              class="text-[10px] font-black text-white/30 tracking-widest uppercase"
              >Libre</span
            >
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de Phase de Prélancement -->
    <div
      v-if="showLaunchModal"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#06070a]/90 backdrop-blur-md transition-all duration-300 animate-in"
    >
      <div
        class="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto glass-card border border-gold/30 rounded-2xl flex flex-col md:flex-row shadow-[0_0_50px_rgba(212,175,55,0.15)] bg-[#0e1017]"
      >
        <!-- Close Button (Absolute on Mobile, top-right of modal) -->
        <button
          @click="showLaunchModal = false"
          class="absolute top-4 right-4 z-20 w-10 h-10 flex items-center justify-center rounded-full bg-white/5 border border-white/10 hover:border-gold hover:text-gold transition-all cursor-pointer text-white"
        >
          ✕
        </button>

        <!-- Left Column: Visual Poster -->
        <div
          class="w-full md:w-1/2 relative bg-black/40 flex items-center justify-center p-6 border-b md:border-b-0 md:border-r border-white/5"
        >
          <img
            src="/images/cca-affiche1.png"
            class="w-full h-auto max-h-[350px] md:max-h-[500px] object-contain rounded-lg shadow-2xl"
            alt="CCA Poster"
          />
        </div>

        <!-- Right Column: Content & Instructions -->
        <div class="w-full md:w-1/2 p-8 md:p-10 flex flex-col justify-between">
          <div class="space-y-6">
            <div class="flex items-center gap-3">
              <span
                class="px-3 py-1 text-[9px] font-black uppercase tracking-wider bg-gold/10 text-gold border border-gold/20 rounded-full flex items-center gap-1"
              >
                <LucideMegaphone :size="14" /> Phase de Prélancement
              </span>
            </div>

            <div>
              <h2
                class="text-2xl md:text-3xl font-black italic tracking-tight text-white uppercase mb-2"
              >
                INSCRIPTIONS DU CLAN <br />
                <span class="text-gold">LE 15 JUILLET 2026</span>
              </h2>
              <div class="h-1 w-16 bg-gold rounded-full"></div>
            </div>

            <p class="text-white/70 text-sm leading-relaxed">
              La plateforme est officiellement lancée ! L'espace d'inscription
              au tournoi est temporairement verrouillé et s'ouvrira le
              <b>15 Juillet 2026</b>.
            </p>

            <div
              class="p-5 bg-white/5 rounded-xl border border-white/10 space-y-4"
            >
              <h4
                class="text-white font-bold text-xs uppercase tracking-wide flex items-center gap-2"
              >
                <LucideZap :size="16" /> QUE FAIRE EN ATTENDANT ?
              </h4>
              <ul class="space-y-3 text-xs text-white/60">
                <li class="flex items-start gap-2">
                  <span class="text-gold">✔</span>
                  <span
                    ><b>Enregistrez vos joueurs :</b> Invitez dès maintenant
                    tous les membres de votre clan à s'enregistrer et lier leur
                    profil sur la plateforme CCA.</span
                  >
                </li>
                <li class="flex items-start gap-2">
                  <span class="text-gold">✔</span>
                  <span
                    ><b>Formez votre Roster :</b> Réunissez vos 5 titulaires et
                    remplaçants (HDV 14 à 18 requis).</span
                  >
                </li>
                <li class="flex items-start gap-2">
                  <span class="text-gold">✔</span>
                  <span
                    ><b>Entraînez-vous :</b> Préparez vos stratégies de guerre
                    pour être prêts le jour J !</span
                  >
                </li>
              </ul>
            </div>
          </div>

          <div class="mt-8 flex flex-col sm:flex-row gap-3">
            <NuxtLink
              to="/rules"
              @click="showLaunchModal = false"
              class="btn-tournament primary text-center flex-1 py-3 text-sm font-bold uppercase tracking-wider cursor-pointer flex items-center justify-center gap-1"
            >
              <LucideFileText :size="18" /> Lire le Règlement
            </NuxtLink>
            <button
              @click="showLaunchModal = false"
              class="btn-tournament secondary text-center flex-1 py-3 text-sm font-bold uppercase tracking-wider cursor-pointer"
            >
              Vue d'ensemble
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const { $api } = useNuxtApp();
const { isLoggedIn } = useAuth();
const route = useRoute();
const showLaunchModal = ref(false);

useHead({
  title: "Tournois & Compétitions | CCA National League 🇨🇲",
  meta: [
    {
      name: "description",
      content:
        "Suivez les tournois officiels de la Cameroon Clash Association. Rejoignez les 16 clans d'élite pour la Saison 1 du tournoi CoC Cameroun.",
    },
    {
      name: "keywords",
      content:
        "tournoi camerounois, tournoi coc, clash of clans cameroun, eSport cameroun, cca league, bracket tournoi",
    },
    {
      property: "og:title",
      content: "Tournois & Matches CoC Cameroun — CCA League 🏆",
    },
    {
      property: "og:description",
      content:
        "16 clans s'affrontent en 5v5. Suivez le calendrier et découvrez les vainqueurs.",
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

const COMPETITION_ID = 1;

const statusLabel = computed(() => {
  const labels = {
    draft: "Saison à Venir",
    open: "Inscriptions Ouvertes",
    closed: "En Préparation",
    in_progress: "Combat en Cours",
    finished: "Guerre Terminée",
  };
  return labels[competition.value?.status] || competition.value?.status;
});

const formatFcfa = (n) => {
  if (!n && n !== 0) return "---";
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
    const [clansData] = await Promise.all([
      $api("/tournament/clans").catch(() => []),
    ]);

    clans.value = clansData || [];
    confirmedClans.value = clans.value.length;

    competition.value = {
      id: COMPETITION_ID,
      name: "CCA National League",
      season_number: 1,
      status: "open",
      max_teams: 16,
      registration_fee: 0,
      prize_1st: 50000,
      prize_2nd: 20000,
      prize_3rd: 10000,
      starts_at: "2026-07-25T10:00:00",
    };
  } catch (e) {
    console.error("Error fetching tournament data:", e);
  } finally {
    loading.value = false;
  }
};

onMounted(async () => {
  await fetchData();
  if (route.query.showLaunchModal === "true") {
    showLaunchModal.value = false;
  }
});
</script>

<style scoped>
/* Refined Typography and Scaling */
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
