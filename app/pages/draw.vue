<template>
  <div class="draw-page min-h-screen bg-[#05070a] text-white overflow-hidden relative selection:bg-gold/30">
    <!-- Particules de fond -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div v-for="i in 15" :key="i" class="particle absolute bg-gold/20 rounded-full"
           :style="`top: ${Math.random() * 100}%; left: ${Math.random() * 100}%; width: ${Math.random() * 4 + 1}px; height: ${Math.random() * 4 + 1}px; animation-duration: ${Math.random() * 10 + 5}s; animation-delay: -${Math.random() * 5}s`">
      </div>
    </div>

    <!-- Navigation Slides -->
    <div v-if="!isLiveMode" class="absolute bottom-4 sm:bottom-10 left-1/2 -translate-x-1/2 flex gap-3 z-50">
      <button v-for="s in 3" :key="s" @click="currentSlide = s"
              class="w-3 h-3 sm:w-12 sm:h-1.5 rounded-full transition-all"
              :class="currentSlide === s ? 'bg-gold shadow-[0_0_10px_#d4af37]' : 'bg-white/20 hover:bg-white/40'">
      </button>
      <button v-if="currentSlide === 3" @click="startLiveDraw"
              class="ml-4 px-4 py-1.5 bg-red-600 font-black text-[10px] sm:text-xs rounded-full uppercase tracking-widest animate-pulse hover:bg-red-500 transition">
        Passer au Live 🔴
      </button>
    </div>

    <!-- SLIDE 1 : INTRO -->
    <Transition name="fade">
      <div v-if="currentSlide === 1 && !isLiveMode" class="absolute inset-0 flex flex-col items-center justify-center p-4">
        <div class="text-center space-y-6 max-w-3xl w-full z-10">
          <div class="flex justify-center items-center gap-6 mb-8">
            <img src="/images/logo cca.png" alt="CCA" class="w-16 h-16 sm:w-24 sm:h-24 drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]" />
          </div>
          <h1 class="text-3xl sm:text-6xl font-black italic uppercase tracking-tighter leading-tight drop-shadow-2xl">
            TIRAGE AU SORT <br /> <span class="text-gold">OFFICIEL DES POULES</span>
          </h1>
          <p class="text-red-500 font-black tracking-[0.3em] uppercase text-sm sm:text-xl drop-shadow-[0_0_10px_rgba(239,68,68,0.5)]">
            CCA National League — En Direct
          </p>
          <div class="pt-10">
            <button @click="currentSlide = 2" class="px-8 py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-full text-sm uppercase tracking-widest backdrop-blur-md transition">
              Découvrir le Format →
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- SLIDE 2 : FORMAT -->
    <Transition name="fade">
      <div v-if="currentSlide === 2 && !isLiveMode" class="absolute inset-0 flex flex-col items-center justify-center p-4">
        <div class="w-full max-w-5xl z-10">
          <h2 class="text-2xl sm:text-4xl font-black italic text-center uppercase tracking-tight mb-8 sm:mb-16">
            Format de la <span class="text-gold">Compétition</span>
          </h2>
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-10">
            <!-- Etape 1 -->
            <div class="bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-sm text-center relative overflow-hidden group hover:border-gold/30 transition-all">
              <div class="absolute -top-10 -right-10 w-32 h-32 bg-gold/10 rounded-full blur-2xl group-hover:bg-gold/20 transition-all"></div>
              <div class="text-4xl mb-4">🛡️</div>
              <h3 class="font-black uppercase text-lg mb-2 text-white/90">Phase de Groupes</h3>
              <p class="text-sm text-white/60">11 Clans répartis en deux groupes. <br/><b>Groupe A (6)</b> | <b>Groupe B (5)</b>.</p>
              <p class="text-[10px] text-gold mt-3 font-bold uppercase">4 Matchs exactement par clan</p>
            </div>

            <!-- Etape 2 -->
            <div class="bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-sm text-center relative overflow-hidden group hover:border-blue-500/30 transition-all">
              <div class="absolute -top-10 -right-10 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl group-hover:bg-blue-500/20 transition-all"></div>
              <div class="text-4xl mb-4">⚔️</div>
              <h3 class="font-black uppercase text-lg mb-2 text-white/90">Qualification</h3>
              <p class="text-sm text-white/60">Seuls les <b>2 meilleurs clans</b> de chaque groupe accèdent au carré VIP.</p>
              <p class="text-[10px] text-blue-400 mt-3 font-bold uppercase">Victoire = 3pts, Nul = 1pt</p>
            </div>

            <!-- Etape 3 -->
            <div class="bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-sm text-center relative overflow-hidden group hover:border-red-500/30 transition-all">
              <div class="absolute -top-10 -right-10 w-32 h-32 bg-red-500/10 rounded-full blur-2xl group-hover:bg-red-500/20 transition-all"></div>
              <div class="text-4xl mb-4">🏆</div>
              <h3 class="font-black uppercase text-lg mb-2 text-white/90">Phase Finale</h3>
              <p class="text-sm text-white/60">Demi-finales croisées (A1 vs B2, B1 vs A2) puis la Grande Finale pour le sacre.</p>
              <p class="text-[10px] text-red-500 mt-3 font-bold uppercase">Knockout Direct</p>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <!-- SLIDE 3 : TRANSPARENCE -->
    <Transition name="fade">
      <div v-if="currentSlide === 3 && !isLiveMode" class="absolute inset-0 flex flex-col items-center justify-center p-4">
        <div class="text-center space-y-8 max-w-2xl w-full z-10">
          <div class="w-20 h-20 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <span class="text-4xl">🎲</span>
          </div>
          <h2 class="text-3xl sm:text-5xl font-black italic uppercase tracking-tighter leading-tight drop-shadow-lg">
            Transparence <br/> <span class="text-gold">& Équité</span>
          </h2>
          <p class="text-base sm:text-lg text-white/60 leading-relaxed">
            Le tirage est effectué de manière aléatoire en coulisses par la direction de la ligue.
            La révélation se fera <b>en direct</b> et de façon asynchrone sur vos écrans. Aucune manipulation n'est possible une fois les matchs scellés.
          </p>
          <div class="pt-8 flex justify-center">
             <button @click="startLiveDraw" class="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-red-600 to-red-800 hover:from-red-500 hover:to-red-700 text-white font-black rounded-lg text-sm sm:text-base uppercase tracking-widest shadow-xl shadow-red-900/50 transition-all transform hover:scale-105 active:scale-95">
              <span class="w-3 h-3 rounded-full bg-white animate-pulse"></span>
              Lancer la révélation Live
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- ================= LIVE MODE : THE DRAW ================= -->
    <Transition name="slide-up">
      <div v-if="isLiveMode" class="absolute inset-0 flex flex-col p-4 sm:p-8 z-20 overflow-y-scroll">
        
        <header class="flex justify-between items-center mb-8 border-b border-white/5 pb-4">
          <div class="flex items-center gap-4">
            <img src="/images/logo cca.png" class="w-10 h-10 sm:w-14 sm:h-14" />
            <div>
              <h1 class="text-lg sm:text-2xl font-black italic uppercase">Tirage au sort <span class="text-gold">Live</span></h1>
              <p class="text-[10px] sm:text-xs text-white/40 uppercase tracking-widest font-bold">Mise à jour en temps réel...</p>
            </div>
          </div>
          <div class="flex items-center gap-2 px-3 py-1 bg-red-950/50 border border-red-500/20 rounded-full">
            <span class="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
            <span class="text-[9px] sm:text-[10px] text-red-500 font-bold uppercase tracking-widest">En Direct</span>
          </div>
        </header>

        <div class="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-12 relative">
          
          <!-- Ligne de séparation centrale (Desktop) -->
          <div class="hidden lg:block absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-white/10 to-transparent -translate-x-1/2"></div>
          
          <!-- GROUPE A -->
          <div class="flex flex-col">
            <div class="text-center mb-6">
              <h2 class="text-2xl sm:text-4xl font-black italic text-blue-500 uppercase drop-shadow-[0_0_10px_rgba(59,130,246,0.3)]">
                Groupe A
              </h2>
              <p class="text-xs text-white/40 uppercase font-bold tracking-widest mt-1">{{ groupA.length }}/6 CLANS</p>
            </div>
            
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 flex-1 content-start">
              <TransitionGroup name="list">
                <div v-for="(r, i) in groupA" :key="r.id" 
                     class="bg-blue-950/20 border border-blue-500/30 rounded-xl p-3 flex items-center gap-3 backdrop-blur-sm transform transition-all shadow-[0_4px_20px_rgba(59,130,246,0.1)]">
                  <div class="w-8 h-8 rounded-full bg-blue-900/50 flex items-center justify-center font-black text-blue-400 text-xs shadow-inner border border-blue-500/20">
                    A{{ i + 1 }}
                  </div>
                  <img :src="r.clan?.badge_url || '/images/default-clan.png'" class="w-8 h-8 object-contain drop-shadow-md" />
                  <div class="flex-1 truncate">
                    <p class="font-bold text-sm text-white truncate">{{ r.clan?.name }}</p>
                    <p class="text-[9px] text-white/50 font-mono">{{ r.clan?.tag }}</p>
                  </div>
                </div>
              </TransitionGroup>
              
              <!-- Slots vides Groupe A -->
              <div v-for="i in Math.max(0, 6 - groupA.length)" :key="'empty-a-' + i" 
                   class="border border-dashed border-white/5 rounded-xl p-3 flex items-center justify-center h-[62px] bg-white/[0.01]">
                <div class="spinner w-4 h-4 border-2 border-white/10 border-t-blue-500/50 mr-2"></div>
                <span class="text-[10px] text-white/20 uppercase font-bold tracking-widest">En attente...</span>
              </div>
            </div>
          </div>

          <!-- GROUPE B -->
          <div class="flex flex-col">
            <div class="text-center mb-6">
              <h2 class="text-2xl sm:text-4xl font-black italic text-purple-500 uppercase drop-shadow-[0_0_10px_rgba(168,85,247,0.3)]">
                Groupe B
              </h2>
              <p class="text-xs text-white/40 uppercase font-bold tracking-widest mt-1">{{ groupB.length }}/5 CLANS</p>
            </div>
            
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 flex-1 content-start">
              <TransitionGroup name="list">
                <div v-for="(r, i) in groupB" :key="r.id" 
                     class="bg-purple-950/20 border border-purple-500/30 rounded-xl p-3 flex items-center gap-3 backdrop-blur-sm transform transition-all shadow-[0_4px_20px_rgba(168,85,247,0.1)]">
                  <div class="w-8 h-8 rounded-full bg-purple-900/50 flex items-center justify-center font-black text-purple-400 text-xs shadow-inner border border-purple-500/20">
                    B{{ i + 1 }}
                  </div>
                  <img :src="r.clan?.badge_url || '/images/default-clan.png'" class="w-8 h-8 object-contain drop-shadow-md" />
                  <div class="flex-1 truncate">
                    <p class="font-bold text-sm text-white truncate">{{ r.clan?.name }}</p>
                    <p class="text-[9px] text-white/50 font-mono">{{ r.clan?.tag }}</p>
                  </div>
                </div>
              </TransitionGroup>

              <!-- Slots vides Groupe B -->
              <div v-for="i in Math.max(0, 5 - groupB.length)" :key="'empty-b-' + i" 
                   class="border border-dashed border-white/5 rounded-xl p-3 flex items-center justify-center h-[62px] bg-white/[0.01]">
                <div class="spinner w-4 h-4 border-2 border-white/10 border-t-purple-500/50 mr-2"></div>
                <span class="text-[10px] text-white/20 uppercase font-bold tracking-widest">En attente...</span>
              </div>
            </div>
          </div>

        </div>

        <!-- Récapitulatif Final -->
        <Transition name="fade">
          <div v-if="groupA.length === 6 && groupB.length === 5" class="mt-8 pt-8 border-t border-white/10 text-center">
            <h3 class="text-xl sm:text-2xl font-black text-gold uppercase italic mb-2 animate-bounce">Tirage Terminé ! 🎉</h3>
            <p class="text-sm text-white/60 max-w-md mx-auto mb-6">Les 11 clans sont assignés. La phase de poules peut officiellement commencer.</p>
            <NuxtLink to="/tournaments/bracket" class="px-8 py-3 bg-white text-black font-black uppercase text-sm rounded-lg hover:bg-gold transition-colors inline-block tracking-widest shadow-[0_0_15px_rgba(255,255,255,0.2)]">
              Voir le Tableau Officiel ➔
            </NuxtLink>
          </div>
        </Transition>
      </div>
    </Transition>

  </div>
</template>

<script setup>
definePageMeta({
  layout: 'default' // Or a minimal layout if you have one without navbar
})

const { $api } = useNuxtApp();

const currentSlide = ref(1);
const isLiveMode = ref(false);
const clans = ref([]);
let pollingInterval = null;

const groupA = computed(() => clans.value.filter(c => c.group === 'A'));
const groupB = computed(() => clans.value.filter(c => c.group === 'B'));

const fetchLiveGroups = async () => {
  try {
    const data = await $api('/admin/competitions/1/confirmed-clans'); // Note: endpoint returns registrations with clan data
    if (data && Array.isArray(data)) {
      clans.value = data;
    }
  } catch (error) {
    console.error("Error fetching live draw:", error);
  }
};

const startLiveDraw = () => {
  isLiveMode.value = true;
  fetchLiveGroups();
  // Poll every 3 seconds to get live updates from admin interface
  pollingInterval = setInterval(fetchLiveGroups, 3000);
};

onUnmounted(() => {
  if (pollingInterval) clearInterval(pollingInterval);
});

useHead({
  title: '🔴 Tirage au Sort en Direct - CCA National League'
})
</script>

<style scoped>
.particle {
  animation: float linear infinite;
}
@keyframes float {
  0% { transform: translateY(100vh) scale(0); opacity: 0; }
  20% { opacity: 1; }
  80% { opacity: 1; }
  100% { transform: translateY(-20vh) scale(1); opacity: 0; }
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

.slide-up-enter-active, .slide-up-leave-active {
  transition: all 0.7s cubic-bezier(0.16, 1, 0.3, 1);
}
.slide-up-enter-from {
  opacity: 0;
  transform: translateY(50px);
}
.slide-up-leave-to {
  opacity: 0;
  transform: translateY(-50px);
}

.list-enter-active, .list-leave-active {
  transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.list-enter-from {
  opacity: 0;
  transform: translateX(-30px) scale(0.9);
}
.list-leave-to {
  opacity: 0;
  transform: translateX(30px) scale(0.9);
}

.spinner {
  border-radius: 50%;
  animation: spin 1s linear infinite;
}
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
