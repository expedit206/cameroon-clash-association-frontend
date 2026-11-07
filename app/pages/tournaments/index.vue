<template>
  <div class="min-h-screen pb-12 bg-[#06070a]">

    <!-- ═══════ HEADER ═══════ -->
    <header
      class="relative min-h-[35vh] md:min-h-[45vh] flex flex-col items-center justify-center pt-24 pb-16 px-6 text-center">
      <div class="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <img src="/images/hero-bg.png" class="w-full h-full object-cover opacity-60 scale-105" alt="" />
        <div class="absolute inset-0 bg-gradient-to-b from-transparent via-[#06070a]/50 to-[#06070a]" />
      </div>

      <div v-if="competition" class="relative z-10 animate-in">

        <!-- Badge statut dynamique -->
        <div
          class="inline-flex items-center gap-2 px-4 py-1.5 mb-5 bg-gold/10 border border-gold/25 rounded-full text-[0.7rem] font-bold tracking-widest text-gold/90">
          <span class="w-1.5 h-1.5 rounded-full bg-gold animate-pulse"></span>
          {{ statusLabel }}
        </div>

        <h1 class="text-3xl md:text-5xl font-black italic tracking-tighter text-white uppercase mb-3">
          {{ competition.name }}
          <span class="text-gold">{{ competition.season || 'Saison 2' }}</span>
        </h1>

        <p class="max-w-xl mx-auto text-white/40 text-xs md:text-sm tracking-[0.3em] font-light mb-8">
          L'élite du Cameroun s'affronte pour le trône
        </p>

        <div class="flex flex-wrap justify-center gap-3">
          <!-- CTA principal selon statut -->
          <template v-if="competition.status === 'open'">
            <NuxtLink to="/tournaments/register" class="btn-premium btn-secondary btn-hero">
              <LucideSwords class="w-4 h-4 mr-1.5" /> Inscrire mon clan
            </NuxtLink>
          </template>
          <template v-else-if="competition.status === 'in_progress' || competition.status === 'finished'">
            <NuxtLink to="/tournaments/bracket" class="btn-premium btn-secondary btn-hero">
              <LucideTrophy class="w-4 h-4 mr-1.5" /> Voir le bracket
            </NuxtLink>
          </template>
          <template v-else>
            <div class="btn-premium btn-outline btn-hero cursor-default opacity-70">
              <LucideClock class="w-4 h-4 mr-1.5" />
              {{ competition.status === 'closed' ? 'Inscriptions fermées' : 'Ouverture : 10 novembre 2026' }}
            </div>
          </template>

          <NuxtLink to="/rules" class="btn-premium btn-outline btn-hero">
            <LucideFileText class="w-4 h-4 mr-1.5" /> Règlement
          </NuxtLink>
        </div>
      </div>
    </header>

    <div class="container mx-auto px-4 max-w-6xl -mt-8 relative z-20">

      <!-- ═══════ PRÉSENTATION + STATS ═══════ -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
        <div class="lg:col-span-2 glass-card !p-8 border-white/5">
          <div class="flex items-center gap-3 mb-6">
            <div class="w-8 h-px bg-gold/50"></div>
            <h2 class="text-[10px] font-black uppercase tracking-[0.4em] text-gold">
              Présentation du tournoi
            </h2>
          </div>

          <div class="space-y-4">
            <p class="text-white/70 leading-relaxed text-sm md:text-base">
              La <span class="text-white font-bold">CCA National League</span> réunit les
              <strong>16 meilleurs clans</strong> du Cameroun en
              <strong>élimination directe</strong>, format <strong>5v5 en mode E-sport</strong>.
            </p>
            <p class="text-white/60 text-xs md:text-sm italic border-l-2 border-gold/20 pl-4 py-1">
              « Plus qu'un tournoi, une légende en construction pour l'eSport camerounais. »
            </p>
          </div>

          <!-- Bloc règles clés (nouveau) -->
          <div class="mt-6 grid grid-cols-1 md:grid-cols-2 gap-2">
            <div class="flex items-start gap-2.5 p-3 rounded-lg bg-[#d4af37]/[0.06] border border-[#d4af37]/20">
              <LucideShield class="w-4 h-4 text-gold flex-shrink-0 mt-0.5" />
              <div>
                <p class="text-[0.7rem] font-extrabold uppercase tracking-wider text-gold mb-0.5">Mode E-sport</p>
                <p class="text-[0.8rem] text-white/55 leading-snug">Le modificateur le plus strict du jeu.</p>
              </div>
            </div>
            <div class="flex items-start gap-2.5 p-3 rounded-lg bg-[#bb00ff]/[0.06] border border-[#bb00ff]/20">
              <LucideTarget class="w-4 h-4 text-[#bb00ff] flex-shrink-0 mt-0.5" />
              <div>
                <p class="text-[0.7rem] font-extrabold uppercase tracking-wider text-[#bb00ff] mb-0.5">Mirror HDV</p>
                <p class="text-[0.8rem] text-white/55 leading-snug">1 base de chaque HDV (14 → 18) par clan.</p>
              </div>
            </div>
          </div>

          <!-- Stats -->
          <div class="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8 pt-6 border-t border-white/5">
            <div>
              <div class="text-[9px] text-white/30 uppercase tracking-widest mb-1">Capacité</div>
              <div class="text-xl font-black text-white tracking-tight">{{ competition?.max_teams }} clans</div>
            </div>
            <div>
              <div class="text-[9px] text-white/30 uppercase tracking-widest mb-1">Format</div>
              <div class="text-xl font-black text-white tracking-tight">5 vs 5</div>
            </div>
            <div>
              <div class="text-[9px] text-white/30 uppercase tracking-widest mb-1">HDV</div>
              <div class="text-xl font-black text-white tracking-tight">14 → 18</div>
            </div>
            <div>
              <div class="text-[9px] text-gold/60 uppercase tracking-widest mb-1">Inscrits</div>
              <div class="text-xl font-black text-gold tracking-tight">
                {{ confirmedClans }} / {{ competition?.max_teams || 16 }}
              </div>
            </div>
          </div>
        </div>

        <!-- Chronologie -->
        <div class="glass-card !p-0 border-white/5 bg-white/[0.02]">
          <div class="p-6 border-b border-white/5">
            <h2 class="text-[10px] font-black tracking-[0.4em] text-white/40">Chronologie</h2>
          </div>
          <div class="p-6 space-y-5">
            <div>
              <div class="flex items-center gap-2.5 mb-1.5">
                <LucideCalendar class="w-4 h-4 text-white/30" />
                <span class="text-[10px] font-black tracking-widest uppercase text-white/30">Inscriptions</span>
              </div>
              <div class="text-base font-black text-white ml-7 tracking-tight">10 novembre 2026</div>
            </div>
            <div v-if="competition?.start_date">
              <div class="flex items-center gap-2.5 mb-1.5">
                <LucideSwords class="w-4 h-4 text-white/30" />
                <span class="text-[10px] font-black tracking-widest uppercase text-white/30">Début des matches</span>
              </div>
              <div class="text-base font-black text-white ml-7 tracking-tight">{{ formatDate(competition.start_date) }}
              </div>
            </div>
            <div>
              <div class="flex items-center gap-2.5 mb-1.5">
                <LucideTrophy class="w-4 h-4 text-gold" />
                <span class="text-[10px] font-black tracking-widest uppercase text-white/30">Cashprize total</span>
              </div>
              <div class="text-base font-black text-gold ml-7 tracking-tight">80 000 FCFA</div>
            </div>
          </div>
        </div>
      </div>

      <!-- ═══════ RÉCOMPENSES ═══════ -->
      <div class="glass-card !p-8 mb-12 border-white/5">
        <h2 class="text-[10px] font-black uppercase tracking-[0.4em] text-white/40 mb-8 text-center">
          Distribution des récompenses — Saison 2
        </h2>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 items-end max-w-4xl mx-auto">

          <!-- 2e place -->
          <div class="order-2 md:order-1 p-6 rounded-2xl bg-white/[0.03] border border-[#c0c0c0]/30 text-center">
            <div
              class="inline-flex items-center justify-center w-10 h-10 rounded-full bg-[#c0c0c0]/10 border border-[#c0c0c0]/30 mb-3">
              <LucideMedal class="w-5 h-5 text-[#c0c0c0]" />
            </div>
            <p class="text-[9px] font-black tracking-[0.2em] text-white/40 uppercase mb-1.5">Finaliste</p>
            <p class="text-2xl font-black text-[#c0c0c0] tracking-tight">
              {{ formatFcfa(competition?.prize_2nd) }}
            </p>
          </div>

          <!-- 1re place -->
          <div class="order-1 md:order-2 relative p-7 rounded-2xl bg-gradient-to-b from-[#d4af37]/[0.15] to-[#06070a]
                      border-2 border-[#d4af37]/60 shadow-[0_0_40px_-5px_rgba(212,175,55,0.35)]
                      md:-translate-y-4 text-center">
            <div class="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-gold text-[#06070a]
                        text-[9px] font-black tracking-widest uppercase">
              Vainqueur
            </div>
            <LucideCrown class="w-8 h-8 text-gold mx-auto mb-3 drop-shadow-[0_0_12px_rgba(212,175,55,0.6)]" />
            <p class="text-[9px] font-black tracking-[0.2em] text-gold/80 uppercase mb-1.5">Champion</p>
            <p class="text-3xl font-black text-gold tracking-tight drop-shadow-[0_0_20px_rgba(212,175,55,0.5)]">
              {{ formatFcfa(competition?.prize_1st) }}
            </p>
            <p class="mt-3 text-[9px] font-black tracking-widest text-gold/70 uppercase">
              Champion National S2
            </p>
          </div>

          <!-- 3e place -->
          <div class="order-3 p-6 rounded-2xl bg-white/[0.03] border border-[#cd7f32]/30 text-center">
            <div
              class="inline-flex items-center justify-center w-10 h-10 rounded-full bg-[#cd7f32]/10 border border-[#cd7f32]/30 mb-3">
              <LucideMedal class="w-5 h-5 text-[#cd7f32]" />
            </div>
            <p class="text-[9px] font-black tracking-[0.2em] text-white/40 uppercase mb-1.5">3e place</p>
            <p class="text-2xl font-black text-[#cd7f32] tracking-tight">
              {{ formatFcfa(competition?.prize_3rd) }}
            </p>
          </div>
        </div>

        <p class="text-center text-[0.72rem] text-white/35 mt-6">
          Cashprize versé par Mobile Money dans les 7 jours suivant la finale.
        </p>
      </div>

      <!-- ═══════ PARTICIPANTS ═══════ -->
      <div class="mb-12">
        <div class="flex items-center gap-4 mb-6 px-2">
          <h2 class="text-2xl font-black text-white uppercase tracking-tighter flex-shrink-0">
            Les <span class="text-gold">Prétendants</span>
          </h2>
          <div class="h-px w-full bg-gradient-to-r from-white/10 to-transparent"></div>
          <span class="text-[0.65rem] font-black uppercase tracking-widest text-white/40 flex-shrink-0">
            {{ confirmedClans }} / {{ competition?.max_teams || 16 }}
          </span>
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <!-- Clans confirmés -->
          <div v-for="clan in clans" :key="clan.id"
            class="glass-card !p-4 border-white/5 hover:border-gold/30 hover:bg-gold/5 transition-all duration-300 group text-center">
            <img :src="clan.badge"
              class="w-12 h-12 mx-auto object-contain transition-transform group-hover:scale-110 mb-3"
              :alt="clan.name" />
            <h3 class="font-bold text-xs uppercase truncate tracking-wide text-white">{{ clan.name }}</h3>
            <span class="text-[8px] font-black text-white/20 tracking-widest uppercase truncate">{{ clan.tag }}</span>
          </div>

          <!-- Places libres — transformées en CTA -->
          <template v-for="n in Math.max(0, (competition?.max_teams || 16) - confirmedClans)" :key="'empty' + n">
            <NuxtLink v-if="competition?.status === 'open'" to="/tournaments/register" class="glass-card !p-4 border-dashed border-gold/20 hover:border-gold/50 hover:bg-gold/[0.04]
                     transition-all duration-300 flex flex-col items-center justify-center gap-1.5 text-center group">
              <LucidePlus class="w-6 h-6 text-gold/40 group-hover:text-gold transition-colors" />
              <span class="text-[9px] font-black text-gold/50 group-hover:text-gold tracking-widest uppercase">
                Rejoindre
              </span>
            </NuxtLink>
            <div v-else
              class="glass-card !p-4 border-dashed border-white/10 flex items-center justify-center opacity-30">
              <span class="text-[9px] font-black text-white/40 tracking-widest uppercase">Libre</span>
            </div>
          </template>
        </div>

        <!-- CTA bas de section si inscriptions ouvertes -->
        <div v-if="competition?.status === 'open'" class="mt-6 text-center">
          <NuxtLink to="/tournaments/register" class="btn-premium btn-secondary">
            Inscrire mon clan — 5 000 FCFA
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const { $api } = useNuxtApp();

useHead({
  title: "CCA National League Saison 2 — Tournoi CoC Cameroun",
  meta: [
    { name: "description", content: "16 clans d'élite en mode E-sport mirror HDV. 80 000 FCFA de cashprize. Inscriptions le 10 novembre 2026." },
    { name: "keywords", content: "tournoi coc cameroun, clash of clans cameroun, cca league saison 2, bracket coc, e-sport cameroun" },
    { property: "og:title", content: "CCA National League Saison 2 — Tournoi CoC Cameroun" },
    { property: "og:description", content: "16 clans, mode E-sport, 80 000 FCFA de cashprize. Inscriptions le 10 novembre 2026." },
    { property: "og:image", content: "/images/cca-affiche1.png" },
  ],
});

const competition = ref(null);
const clans = ref([]);
const confirmedClans = ref(0);

const statusLabel = computed(() => {
  const s = competition.value?.status;
  if (s === 'open') return 'Inscriptions ouvertes';
  if (s === 'closed') return 'Inscriptions fermées';
  if (s === 'in_progress') return 'Tournoi en cours';
  if (s === 'finished') return 'Saison terminée';
  return 'Ouverture : 10 novembre 2026';
});

const formatFcfa = (n) => {
  if (n === null || n === undefined) return '---';
  return n.toLocaleString('fr-FR') + ' FCFA';
};

const formatDate = (d) => {
  if (!d) return 'À définir';
  return new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' });
};

onMounted(async () => {
  try {
    const [competitionData, clansData] = await Promise.all([
      $api('/tournament/competition').catch(() => null),
      $api('/tournament/clans').catch(() => []),
    ]);
    competition.value = competitionData;
    clans.value = clansData || [];
    confirmedClans.value = clans.value.filter(c => c.status === 'confirmed' || !c.status).length;
  } catch (e) {
    console.error('Error fetching tournament data:', e);
  }
});
</script>

<style scoped>
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