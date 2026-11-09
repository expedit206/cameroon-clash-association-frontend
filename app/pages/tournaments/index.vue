<template>
  <div class="min-h-screen pb-12 bg-[#06070a]">

    <!-- ═══════ HEADER ═══════ -->
    <header class="relative min-h-[35vh] md:min-h-[45vh] flex flex-col items-center justify-center pt-24 pb-16 px-6 text-center">
      <div class="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <img src="/images/hero-bg.png" class="w-full h-full object-cover opacity-60 scale-105" alt="" />
        <div class="absolute inset-0 bg-gradient-to-b from-transparent via-[#06070a]/50 to-[#06070a]" />
      </div>

      <div v-if="competition" class="relative z-10 animate-in">

        <!-- Badge statut -->
        <div class="inline-flex items-center gap-2 px-4 py-1.5 mb-5 bg-gold/10 border border-gold/25 rounded-full text-[0.7rem] font-bold tracking-widest text-gold/90">
          <span class="w-1.5 h-1.5 rounded-full bg-gold animate-pulse"></span>
          Inscriptions ouvertes — Du 9 au 20 novembre
        </div>

        <h1 class="text-3xl md:text-5xl font-black italic tracking-tighter text-white uppercase mb-3">
          {{ competition.name }}
          <span class="text-gold">Saison 2</span>
        </h1>

        <p class="max-w-xl mx-auto text-white/40 text-xs md:text-sm tracking-[0.3em] font-light mb-8">
          L'élite du Cameroun s'affronte pour le trône
        </p>

        <div class="flex flex-wrap justify-center gap-3">
          <!-- Bouton d'inscription -->
          <NuxtLink to="/tournaments/register" class="btn-premium btn-secondary btn-hero">
            <LucideSwords class="w-4 h-4 mr-1.5" /> Inscrire mon clan (5 000 FCFA)
          </NuxtLink>

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

          <!-- Bloc règles clés -->
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
              <div class="text-xl font-black text-white tracking-tight">16 clans</div>
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
                {{ confirmedClans }} / 16
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
                <LucideCalendar class="w-4 h-4 text-gold" />
                <span class="text-[10px] font-black tracking-widest uppercase text-white/30">Inscriptions</span>
              </div>
              <div class="text-sm font-black text-white ml-7 tracking-tight">
                Du 9 au 20 novembre 2026
              </div>
            </div>
            <div v-if="competition?.start_date">
              <div class="flex items-center gap-2.5 mb-1.5">
                <LucideSwords class="w-4 h-4 text-white/30" />
                <span class="text-[10px] font-black tracking-widest uppercase text-white/30">Début des matches</span>
              </div>
              <div class="text-base font-black text-white ml-7 tracking-tight">{{ formatDate(competition.start_date) }}</div>
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

      <!-- ═══════ RÉCOMPENSES (inchangé) ═══════ -->
      <!-- ... Gardez la section récompenses telle quelle ... -->
      <div class="glass-card !p-8 mb-12 border-white/5">
        <h2 class="text-[10px] font-black uppercase tracking-[0.4em] text-white/40 mb-8 text-center">
          Distribution des récompenses — Saison 2
        </h2>
        <!-- (Copiez/collez le bloc récompenses original ici) -->
      </div>

      <!-- ═══════ PARTICIPANTS ═══════ -->
      <div class="mb-12">
        <div class="flex items-center gap-4 mb-6 px-2">
          <h2 class="text-2xl font-black text-white uppercase tracking-tighter flex-shrink-0">
            Les <span class="text-gold">Prétendants</span>
          </h2>
          <div class="h-px w-full bg-gradient-to-r from-white/10 to-transparent"></div>
          <span class="text-[0.65rem] font-black uppercase tracking-widest text-white/40 flex-shrink-0">
            {{ confirmedClans }} / 16
          </span>
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <!-- Clans confirmés -->
          <div v-for="clan in clans" :key="clan.id"
            class="glass-card !p-4 border-white/5 hover:border-gold/30 hover:bg-gold/5 transition-all duration-300 group text-center">
            <img :src="clan.badge" class="w-12 h-12 mx-auto object-contain transition-transform group-hover:scale-110 mb-3" :alt="clan.name" />
            <h3 class="font-bold text-xs uppercase truncate tracking-wide text-white">{{ clan.name }}</h3>
            <span class="text-[8px] font-black text-white/20 tracking-widest uppercase truncate">{{ clan.tag }}</span>
          </div>

          <!-- Places libres -->
          <template v-for="n in Math.max(0, 16 - confirmedClans)" :key="'empty' + n">
            <NuxtLink to="/tournaments/register" class="glass-card !p-4 border-dashed border-gold/20 hover:border-gold/50 hover:bg-gold/[0.04] transition-all duration-300 flex flex-col items-center justify-center gap-1.5 text-center group">
              <LucidePlus class="w-6 h-6 text-gold/40 group-hover:text-gold transition-colors" />
              <span class="text-[9px] font-black text-gold/50 group-hover:text-gold tracking-widest uppercase">
                Rejoindre
              </span>
            </NuxtLink>
          </template>
        </div>

        <!-- CTA bas de section -->
        <div class="mt-8 text-center">
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
  title: "Inscriptions Ouvertes — CCA National League Saison 2",
  meta: [
    { name: "description", content: "Les inscriptions de la CCA National League Saison 2 sont ouvertes du 9 au 20 novembre. 16 clans d'élite, mode E-sport, 80 000 FCFA de cashprize." },
  ],
});

const competition = ref(null);
const clans = ref([]);
const confirmedClans = ref(0);

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
    confirmedClans.value = clans.value.length;
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
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
</style> 