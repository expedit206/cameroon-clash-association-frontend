<template>
  <div class="about-page min-h-screen">
    <div class="container mx-auto px-4 py-20 max-w-4xl">
      <header class="text-center mb-20 animate-float">
        <h1
          class="heading text-5xl md:text-7xl font-black italic tracking-tighter uppercase mb-4"
        >
          À propos de la <span class="text-gold">CCA</span>
        </h1>
        <p class="text-xl opacity-60 uppercase tracking-[0.3em] font-light">
          Cameroun Clash Association
        </p>
      </header>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20">
        <div class="glass-card !p-8 border-gold/20">
          <h2
            class="text-2xl font-black text-gold mb-6 uppercase tracking-wider italic"
          >
            Notre Mission
          </h2>
          <p class="text-white/70 leading-relaxed mb-6">
            La
            <span class="text-white font-bold"
              >CCA (Cameroun Clash Association)</span
            >
            est l'organisation phare dédiée à la promotion et à l'excellence des
            joueurs de Clash of Clans au Cameroun. Notre mission est de
            structurer la scène compétitive nationale et de propulser nos
            meilleurs talents sur le devant de la scène internationale.
          </p>
          <div
            class="flex items-center gap-4 text-sm font-black uppercase tracking-widest text-gold/60"
          >
            <span class="w-8 h-px bg-gold/30"></span> 237 Esports Legacy
          </div>
        </div>
        <div class="relative group">
          <div
            class="absolute inset-0 bg-gold/10 blur-3xl group-hover:bg-gold/20 transition-all duration-700"
          ></div>
          <div
            class="relative glass-card !p-12 text-center aspect-square flex flex-col items-center justify-center border-white/5"
          >
            <span class="text-8xl mb-4">🇨🇲</span>
            <div class="text-4xl font-black text-white italic tracking-tighter">
              ELITE CLASS
            </div>
          </div>
        </div>
      </div>

      <div class="glass-card !p-10 mb-20">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
          <div class="feature-item">
            <div class="text-4xl mb-4 text-gold">⚔️</div>
            <h3
              class="font-bold text-white uppercase text-sm mb-2 tracking-widest"
            >
              Compétition
            </h3>
            <p class="text-xs text-white/40">
              Organisation de tournois nationaux officiels avec des cashprizes
              attractifs.
            </p>
          </div>
          <div class="feature-item">
            <div class="text-4xl mb-4 text-gold">🛡️</div>
            <h3
              class="font-bold text-white uppercase text-sm mb-2 tracking-widest"
            >
              Communauté
            </h3>
            <p class="text-xs text-white/40">
              Fédérer les plus grands clans du Cameroun dans un esprit de
              fair-play.
            </p>
          </div>
          <div class="feature-item">
            <div class="text-4xl mb-4 text-gold">🎖️</div>
            <h3
              class="font-bold text-white uppercase text-sm mb-2 tracking-widest"
            >
              Prestige
            </h3>
            <p class="text-xs text-white/40">
              Mise en avant des meilleurs joueurs et clans à travers le
              classement national.
            </p>
          </div>
        </div>
      </div>

      <footer class="text-center">
        <p class="text-white/30 text-xs uppercase tracking-widest">
          CCA National League © 2026 — Fièrement camerounais
        </p>
      </footer>
    </div>
  </div>
</template>

<style scoped>
.about-page {
  background:
    radial-gradient(
      circle at 100% 0%,
      rgba(212, 175, 55, 0.1) 0%,
      transparent 40%
    ),
    radial-gradient(
      circle at 0% 100%,
      rgba(187, 0, 255, 0.05) 0%,
      transparent 40%
    );
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}
.animate-float {
  animation: float 6s ease-in-out infinite;
}
</style>
