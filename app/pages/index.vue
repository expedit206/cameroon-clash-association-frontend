<template>
  <div class="flex flex-col">

    <!-- ═══════════ HERO ═══════════ -->
    <!-- ═══════════ HERO ═══════════ -->
    <section class="relative w-screen min-h-screen flex overflow-hidden bg-[#06070a] max-[1100px]:flex-col">

      <!-- Background layers (inchangé) -->
      <img src="/images/hero-bg.png" alt="" aria-hidden="true"
        class="hero-bg-breathe absolute inset-0 w-full h-full object-cover object-center z-0 opacity-50 saturate-[0.7]" />
      <div class="hero-overlay absolute inset-0 z-[1]" />
      <div class="hero-grid-overlay absolute inset-0 z-[2] opacity-[0.04] pointer-events-none" aria-hidden="true" />
      <div class="hero-scanline absolute inset-0 z-[2] pointer-events-none" aria-hidden="true" />
      <div
        class="hero-orb hero-orb--gold absolute w-[600px] h-[600px] max-md:w-[300px] max-md:h-[300px] rounded-full top-[20%] left-[25%] z-[2] pointer-events-none blur-[40px]"
        aria-hidden="true" />
      <div
        class="hero-orb hero-orb--purple absolute w-[500px] h-[500px] max-md:w-[250px] max-md:h-[250px] rounded-full top-[40%] left-[55%] z-[2] pointer-events-none blur-[40px]"
        aria-hidden="true" />

      <!-- ⬇ NOUVEAU : paillettes d'or flottantes -->
      <div class="hero-sparkles absolute inset-0 z-[3] pointer-events-none overflow-hidden" aria-hidden="true">
        <span v-for="n in 10" :key="n" class="sparkle" />
      </div>

      <!-- Left content (inchangé sauf countdown seconds ⬇) -->
      <div class="relative z-[5] flex-1 flex items-center min-h-screen pl-20
           max-[1100px]:pt-[120px] max-[1100px]:px-10 max-[1100px]:pb-10 max-[1100px]:min-h-0 max-[1100px]:flex-none max-[1100px]:w-full
           max-[768px]:pt-[100px] max-[768px]:px-6 max-[768px]:pb-[30px]">
        <div class="flex flex-col gap-[26px] max-w-[560px] max-[768px]:max-w-full">

          <!-- Badge (inchangé) -->
          <div
            class="anim-fade anim-d1 inline-flex items-center gap-2 px-[14px] py-[5px] bg-[#d4af37]/[0.08] border border-[#d4af37]/25 rounded-full text-[0.7rem] font-bold tracking-[0.5px] text-[#d4af37]/85 w-fit">
            <span class="season-badge-dot w-1.5 h-1.5 rounded-full bg-[#d4af37] flex-shrink-0"></span>
            Saison 2 — Inscriptions le 10 novembre
          </div>

          <!-- Title -->
          <div class="anim-fade anim-d2 flex flex-col gap-2">
            <h1
              class="flex items-center gap-[18px] leading-none max-[768px]:flex-col max-[768px]:gap-[10px] max-[768px]:items-start">
              <!-- ⬇ NOUVEAU : shine sweep au lieu du gradient statique -->
              <span
                class="hero-title-cca font-heading text-[5.5rem] max-[1100px]:text-[4.5rem] max-[768px]:text-[3.5rem] font-extrabold uppercase tracking-[-2px] drop-shadow-[0_0_30px_rgba(187,0,255,0.3)]">CCA</span>
              <span
                class="w-[2px] h-[70px] max-[1100px]:h-[55px] max-[768px]:w-[50px] max-[768px]:h-[2px] bg-gradient-to-b max-[768px]:bg-gradient-to-r from-[#d4af37]/60 to-[#bb00ff]/30 rounded-sm flex-shrink-0"></span>
              <span class="flex flex-col">
                <span
                  class="font-heading text-[2.8rem] max-[1100px]:text-[2.4rem] max-[768px]:text-[2rem] font-extrabold uppercase tracking-[6px] max-[1100px]:tracking-[4px] max-[768px]:tracking-[3px] text-[#d4af37] [text-shadow:0_0_40px_rgba(212,175,55,0.3)] leading-[1.15]">National</span>
                <span
                  class="font-heading text-[2.8rem] max-[1100px]:text-[2.4rem] max-[768px]:text-[2rem] font-extrabold uppercase tracking-[6px] max-[1100px]:tracking-[4px] max-[768px]:tracking-[3px] text-[#d4af37] [text-shadow:0_0_40px_rgba(212,175,55,0.3)] leading-[1.15]">League</span>
              </span>
            </h1>
            <p class="text-[0.72rem] font-bold tracking-[6px] uppercase text-white/25 pl-0.5">Deuxième édition</p>
          </div>

          <!-- Subtitle (inchangé) -->
          <p class="anim-fade anim-d3 text-[1.05rem] leading-[1.85] text-white/55 max-w-[440px]">
            Le tournoi Clash of Clans le plus compétitif du Cameroun.
            Une nouvelle saison, seize clans, un seul champion.
          </p>

          <!-- Countdown -->
          <div class="anim-fade anim-d4 flex flex-col gap-2.5">
            <p class="text-[0.65rem] font-bold tracking-[3px] text-white/30">Ouverture des inscriptions dans</p>
            <div class="flex items-center gap-1.5 max-[768px]:gap-1">
              <div v-for="(val, i) in [countdown.days, countdown.hours, countdown.minutes, countdown.seconds]" :key="i"
                class="contents">
                <div
                  class="countdown-tile relative overflow-hidden flex flex-col items-center bg-white/[0.04] border border-white/[0.08] rounded-[10px] px-4 py-3 min-w-[62px] max-[768px]:px-2.5 max-[768px]:py-2 max-[768px]:min-w-[50px] backdrop-blur-md">
                  <!-- ⬇ NOUVEAU : la tuile "sec" pulse à chaque tick via :key -->
                  <span v-if="i === 3" :key="countdown.seconds"
                    class="countdown-tick font-heading text-[1.7rem] max-[768px]:text-[1.3rem] font-extrabold text-white leading-none tracking-tight">{{
                      val }}</span>
                  <span v-else
                    class="font-heading text-[1.7rem] max-[768px]:text-[1.3rem] font-extrabold text-white leading-none tracking-tight">{{
                      val }}</span>
                  <span class="text-[0.55rem] font-bold uppercase tracking-[1.5px] text-white/30 mt-1">{{ ['jours',
                    'heures', 'min', 'sec'][i] }}</span>
                </div>
                <div v-if="i < 3" class="w-[3px] h-[3px] rounded-full bg-[#d4af37]/40 mx-0.5 self-center mb-[14px]" />
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="anim-fade anim-d5 flex gap-3 flex-wrap pt-1">
            <!-- ⬇ shimmer : classe btn-hero-primary déjà présente, CSS mis à jour -->
            <!-- <NuxtLink :to="ctaTo"
              class="btn-hero-primary relative overflow-hidden inline-flex items-center gap-2.5 px-[30px] py-[14px] bg-gradient-to-br from-[#d4af37]/20 to-[#bb00ff]/15 border border-[#d4af37]/50 hover:border-[#d4af37]/80 rounded-[10px] text-[#d4af37] font-extrabold text-[0.82rem] tracking-wide no-underline cursor-pointer transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(212,175,55,0.2)]">
              Inscrire mon clan
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                stroke-linecap="round" stroke-linejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </NuxtLink> -->
            <NuxtLink to="/tournaments/bracket"
              class="inline-flex items-center px-7 py-[14px] bg-transparent border border-white/[0.12] hover:border-white/30 hover:bg-white/[0.04] rounded-[10px] text-white/60 hover:text-white font-bold text-[0.82rem] no-underline cursor-pointer transition-all duration-300">
              Palmarès saison 1
            </NuxtLink>
          </div>
        </div>
      </div>

      <!-- Right: character + stats -->
      <div class="relative z-[3] flex-none w-[45%] flex items-end justify-end min-h-screen
        max-[1100px]:w-full max-[1100px]:min-h-0 max-[1100px]:h-[320px] max-[768px]:hidden">

        <!-- ⬇ NOUVEAU : aura pulsante derrière le perso -->
        <div class="hero-character-aura absolute bottom-0 right-[15%] w-[600px] h-[600px] z-[2] pointer-events-none"
          aria-hidden="true" />

        <!-- Character — ⬇ NOUVEAU : wrapper entrance + img idle -->
        <div
          class="hero-character-enter absolute bottom-0 right-0 h-[92%] max-[1100px]:h-full max-[1100px]:right-[10%] z-[3]">
          <img src="/imagescoc/fun image.webp" alt="" aria-hidden="true" class="hero-character-idle h-full w-auto object-contain object-bottom-right pointer-events-none
               drop-shadow-[0_0_80px_rgba(187,0,255,0.2)] drop-shadow-[0_0_30px_rgba(212,175,55,0.15)]
               max-[1100px]:opacity-50" />
        </div>

        <!-- Vignette (inchangée) -->
        <div aria-hidden="true" class="absolute inset-y-0 left-0 w-[360px] z-[5] pointer-events-none
        bg-gradient-to-r from-[#06070a]/30 via-[#06070a]/45 to-transparent
        max-[1100px]:hidden" />

        <!-- Stats strip -->
        <div
          class="absolute left-6 top-1/2 -translate-y-1/2 z-[6] flex flex-col gap-2.5
            max-[1100px]:relative max-[1100px]:left-auto max-[1100px]:top-auto max-[1100px]:translate-y-0
            max-[1100px]:flex-row max-[1100px]:flex-wrap max-[1100px]:justify-center max-[1100px]:gap-2 max-[1100px]:p-5">

          <!-- ⬇ NOUVEAU : chaque chip entre en cascade -->
          <div class="chip-enter chip-d1 flex items-center gap-2.5 px-4 py-2.5 rounded-xl min-w-[170px]
            bg-[#06070a]/60 border border-white/10 backdrop-blur-xl
            shadow-[0_8px_24px_-6px_rgba(0,0,0,0.6)]
            max-[1100px]:min-w-[140px]">
            <LucideTrophy class="w-5 h-5 flex-shrink-0" style="color:#d4af37" />
            <div>
              <p class="font-heading font-extrabold text-[0.85rem] text-white whitespace-nowrap leading-tight">80 000
                FCFA</p>
              <p class="text-[0.6rem] uppercase tracking-[0.5px] text-white/50 whitespace-nowrap">Cashprize</p>
            </div>
          </div>

          <div class="chip-enter chip-d2 flex items-center gap-2.5 px-4 py-2.5 rounded-xl min-w-[170px]
            bg-[#06070a]/60 border border-white/10 backdrop-blur-xl
            shadow-[0_8px_24px_-6px_rgba(0,0,0,0.6)]
            max-[1100px]:min-w-[140px]">
            <LucideShield class="w-5 h-5 flex-shrink-0" style="color:#bb00ff" />
            <div>
              <p class="font-heading font-extrabold text-[0.85rem] text-white whitespace-nowrap leading-tight">16 clans
              </p>
              <p class="text-[0.6rem] uppercase tracking-[0.5px] text-white/50 whitespace-nowrap">Places limitées</p>
            </div>
          </div>

          <div class="chip-enter chip-d3 flex items-center gap-2.5 px-4 py-2.5 rounded-xl min-w-[170px]
            bg-[#06070a]/60 border border-white/10 backdrop-blur-xl
            shadow-[0_8px_24px_-6px_rgba(0,0,0,0.6)]
            max-[1100px]:min-w-[140px]">
            <LucideCalendar class="w-5 h-5 flex-shrink-0" style="color:rgba(255,255,255,0.55)" />
            <div>
              <p class="font-heading font-extrabold text-[0.85rem] text-white whitespace-nowrap leading-tight">10
                novembre</p>
              <p class="text-[0.6rem] uppercase tracking-[0.5px] text-white/50 whitespace-nowrap">Inscriptions</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Bottom fade (inchangé) -->
      <div
        class="absolute bottom-0 left-0 right-0 h-[120px] bg-gradient-to-t from-[#06070a] to-transparent z-[4] pointer-events-none max-[1100px]:hidden"
        aria-hidden="true" />
    </section>

    <!-- ═══════════ CHAMPION S1 ═══════════ -->
    <section v-if="champion" class="champion-section-bg relative overflow-hidden py-20 px-10">
      <div class="relative z-[1] max-w-[900px] mx-auto flex flex-col items-center gap-12">

        <div class="text-center">
          <span
            class="inline-block px-[14px] py-1 bg-[#bb00ff]/10 border border-[#bb00ff]/30 rounded-full text-[0.68rem] font-extrabold tracking-[2.5px] text-[#bb00ff] uppercase">Palmarès
            officiel</span>
          <h2 class="font-heading text-[2.6rem] font-extrabold uppercase leading-tight my-3">
            Champion de la <span class="text-[#d4af37]">CCA National League</span>
          </h2>
          <p class="text-xs text-white/40 tracking-[4px] uppercase font-bold">Saison 1 — 2026</p>
        </div>

        <div class="flex items-end justify-center gap-6 w-full max-[768px]:flex-col max-[768px]:items-center">
          <!-- Runner-up -->
          <div v-if="runnerUp"
            class="flex flex-col items-center gap-2.5 py-6 px-5 rounded-[20px] bg-white/[0.04] border border-white/10 flex-1 max-w-[220px] text-center max-[768px]:max-w-full max-[768px]:w-full">
            <div
              class="w-10 h-10 rounded-full border border-white/15 flex items-center justify-center font-heading text-[1.1rem] font-extrabold text-white/50">
              2</div>
            <img :src="runnerUp.badge_url" :alt="runnerUp.name" class="w-16 h-16 object-contain" />
            <p class="font-heading text-base font-extrabold text-white">{{ runnerUp.name }}</p>
            <p class="text-[0.7rem] font-bold uppercase tracking-[2px] text-white/45">Finaliste</p>
            <div v-if="championMatch"
              class="text-[0.85rem] font-extrabold text-[#d4af37] bg-[#d4af37]/10 border border-[#d4af37]/30 rounded-lg px-3 py-1">
              {{ championMatch.stars_runner_up }} étoiles</div>
          </div>

          <!-- Champion -->
          <div class="podium-champion-glow relative flex flex-col items-center gap-2.5 pt-8 px-7 pb-6 rounded-[20px] flex-1 max-w-[280px] text-center -translate-y-5
                   bg-gradient-to-b from-[#d4af37]/10 to-[#0a0b12]/90 border-2 border-[#d4af37]/55 shadow-[0_0_50px_rgba(212,175,55,0.2),0_0_100px_rgba(212,175,55,0.08)]
                   max-[768px]:translate-y-0 max-[768px]:order-first max-[768px]:max-w-[260px] max-[768px]:w-full">
            <div class="inline-block px-[14px] py-[3px] bg-[#d4af37]/15 border border-[#d4af37]/40 rounded-full">
              <span class="text-[0.65rem] font-extrabold tracking-[3px] uppercase text-[#d4af37]">Champion</span>
            </div>
            <img :src="champion.badge_url" :alt="champion.name"
              class="w-[88px] h-[88px] object-contain drop-shadow-[0_0_22px_rgba(212,175,55,0.65)]" />
            <p
              class="font-heading text-[1.35rem] font-extrabold text-[#d4af37] drop-shadow-[0_0_20px_rgba(212,175,55,0.5)]">
              {{ champion.name }}</p>
            <p class="text-[0.7rem] font-bold uppercase tracking-[2px] text-[#d4af37]">Champion Saison 1</p>
            <div v-if="championMatch"
              class="text-[1.1rem] font-extrabold text-[#d4af37] bg-[#d4af37]/[0.18] border border-[#d4af37]/45 rounded-lg px-3 py-1">
              {{ championMatch.stars_winner }} étoiles</div>
            <div class="text-[0.78rem] font-extrabold text-[#d4af37] tracking-wide opacity-75">50 000 FCFA</div>
          </div>

          <!-- Third -->
          <div
            class="flex flex-col items-center gap-2.5 py-6 px-5 rounded-[20px] bg-white/[0.04] border border-white/10 flex-1 max-w-[220px] text-center max-[768px]:max-w-full max-[768px]:w-full">
            <div
              class="w-10 h-10 rounded-full border border-[#cd7f32]/30 flex items-center justify-center font-heading text-[1.1rem] font-extrabold text-[#cd7f32]">
              3</div>
            <p class="font-heading text-sm italic text-white/40">3e place</p>
            <p class="text-[0.7rem] font-bold uppercase tracking-[2px] text-white/45">Semi-finaliste</p>
          </div>
        </div>

        <div class="flex justify-center">
          <NuxtLink to="/tournaments/bracket" class="btn-premium btn-secondary">
            Voir le tableau complet du tournoi
          </NuxtLink>
        </div>
      </div>
    </section>


    <!-- ═══════════ PAGE BODY ═══════════ -->
    <div class="flex flex-col gap-[100px] pt-[100px] pb-[120px] px-20 max-w-[1400px] mx-auto w-full
             max-[1100px]:pt-20 max-[1100px]:pb-[100px] max-[1100px]:px-10
             max-[768px]:pt-[60px] max-[768px]:pb-20 max-[768px]:px-5 max-[768px]:gap-[60px]">

      <!-- ── À PROPOS ─────────────────────────────────── -->
      <section id="about" class="section">
        <div class="label">La CCA en bref</div>

        <div class="grid grid-cols-[0.55fr_1.45fr] gap-10 items-center
              max-[1100px]:grid-cols-1 max-[1100px]:gap-8">

          <!-- Colonne image -->
          <div class="relative flex justify-center">
            <div class="about-frame relative w-full max-w-[340px]">
              <img src="/imagescoc/grand gardien skin.webp" alt="Grand Gardien — emblème de la CCA"
                class="about-img w-full animate-float relative z-[1]" />
            </div>
            <!-- Badge ancrage temporel -->
            <!-- <div class="absolute -bottom-2 right-1/2 translate-x-1/2 px-3 py-1.5 rounded-full
                  bg-[#06070a] border border-[#d4af37]/40
                  text-[0.65rem] font-extrabold tracking-[2px] uppercase text-[#d4af37]
                  shadow-[0_8px_24px_-6px_rgba(0,0,0,0.6)]">
              Depuis 2026
            </div> -->
          </div>

          <!-- Colonne contenu -->
          <div>
            <h2 class="text-2xl md:text-3xl mb-4">
              La <span class="text-[#d4af37]">CCA National League</span>
            </h2>

            <p class="text-white/60 text-base leading-[1.85] mb-5">
              La Cameroon Clash Association réunit les joueurs les plus compétitifs du pays autour d'une seule ambition
              :
              faire du Cameroun une nation de référence sur Clash of Clans. Après une Saison 1 intense et couronnée de
              succès,
              la CCA lance la deuxième édition de sa compétition phare.
            </p>

            <!-- Barre de stats -->
            <div class="grid grid-cols-3 gap-3 mb-6">
              <div class="text-center py-3.5 px-2 rounded-xl bg-white/[0.03] border border-white/[0.07]">
                <p class="font-heading text-xl md:text-2xl font-extrabold text-[#d4af37] leading-none">150+</p>
                <p class="text-[0.65rem] uppercase tracking-[1.5px] text-white/45 mt-1.5">Membres actifs</p>
              </div>
              <div class="text-center py-3.5 px-2 rounded-xl bg-white/[0.03] border border-white/[0.07]">
                <p class="font-heading text-xl md:text-2xl font-extrabold text-[#d4af37] leading-none">16</p>
                <p class="text-[0.65rem] uppercase tracking-[1.5px] text-white/45 mt-1.5">Clans d'élite</p>
              </div>
              <div class="text-center py-3.5 px-2 rounded-xl bg-white/[0.03] border border-white/[0.07]">
                <p class="font-heading text-xl md:text-2xl font-extrabold text-[#d4af37] leading-none">80K</p>
                <p class="text-[0.65rem] uppercase tracking-[1.5px] text-white/45 mt-1.5">FCFA cashprize</p>
              </div>
            </div>

            <!-- Points clés en mini-cards -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-2 mb-6">
              <div class="flex items-start gap-2.5 p-3 rounded-lg bg-white/[0.03] border border-white/[0.06]">
                <LucideGlobe class="w-5 h-5 text-[#bb00ff] flex-shrink-0 mt-0.5" />
                <span class="text-[0.88rem] leading-snug text-white/70">Ouvert à tous les clans camerounais</span>
              </div>
              <div class="flex items-start gap-2.5 p-3 rounded-lg bg-white/[0.03] border border-white/[0.06]">
                <LucideScale class="w-5 h-5 text-[#d4af37] flex-shrink-0 mt-0.5" />
                <span class="text-[0.88rem] leading-snug text-white/70">Arbitrage officiel et transparent</span>
              </div>
              <div class="flex items-start gap-2.5 p-3 rounded-lg bg-white/[0.03] border border-white/[0.06]">
                <LucideRadio class="w-5 h-5 text-[#bb00ff] flex-shrink-0 mt-0.5" />
                <span class="text-[0.88rem] leading-snug text-white/70">Suivi en direct sur la plateforme</span>
              </div>
            </div>

            <!-- CTA optionnel (nécessite une page /about) -->
            <NuxtLink to="/rules" class="btn-premium btn-outline">
              Découvrir le règlement officiel
            </NuxtLink>
          </div>
        </div>
      </section>

      <section class="section py-6 md:py-20">
        <header class="mb-10 md:text-center md:mb-14">
          <p class="label">Le parcours</p>
          <h2 class="font-heading text-[clamp(1.6rem,5vw,2.2rem)] font-extrabold tracking-tight leading-tight mt-2">
            Trois étapes.<br />
            <span class="text-[#d4af37]">Une seule couronne.</span>
          </h2>
          <p class="text-white/55 text-[0.95rem] mt-4 max-w-[560px] mx-auto leading-relaxed">
            De la composition de l'équipe au paiement des frais — voici concrètement comment votre clan rejoint la
            compétition.
          </p>
        </header>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-5">

          <!-- ══ ÉTAPE 01 — COMPOSITION ═══════════════ -->
          <article class="flex flex-col bg-white/[0.03] border border-white/[0.07] rounded-2xl p-6 md:p-7">
            <header class="flex items-center gap-3 mb-4">
              <span class="flex items-center justify-center w-9 h-9 rounded-full bg-[#06070a] border border-white/15
                     font-heading text-[0.8rem] font-extrabold text-white/70">01</span>
              <span
                class="font-heading text-[0.65rem] font-extrabold tracking-[2px] uppercase text-white/30">Composition</span>
            </header>

            <h3 class="font-heading text-[1.15rem] font-extrabold mb-2">Le capitaine compose l'équipe</h3>
            <p class="text-[0.92rem] leading-relaxed text-white/55 mb-4">
              Le capitaine sélectionne les 4 joueurs qui l'accompagneront. Il fait lui-même partie du roster — 5 joueurs
              au total.
            </p>

            <ul class="flex flex-col gap-2.5 mb-5 text-[0.88rem] text-white/65">
              <li class="flex gap-2.5">
                <LucideCheck class="w-4 h-4 text-[#bb00ff] flex-shrink-0 mt-0.5" />
                <span>Le capitaine <strong class="text-white/85">s'inclut dans le roster</strong></span>
              </li>
              <li class="flex gap-2.5">
                <LucideCheck class="w-4 h-4 text-[#bb00ff] flex-shrink-0 mt-0.5" />
                <span>Sélection des <strong class="text-white/85">4 autres joueurs</strong> via leur tag CoC</span>
              </li>
              <li class="flex gap-2.5">
                <LucideCheck class="w-4 h-4 text-[#bb00ff] flex-shrink-0 mt-0.5" />
                <span>Chaque joueur invité reçoit une <strong class="text-white/85">notification</strong> sur la
                  plateforme
                </span>
              </li>
            </ul>

          </article>

          <!-- ══ ÉTAPE 02 — CONFIRMATION ══════════════ -->
          <article class="flex flex-col bg-[#d4af37]/[0.03] border border-[#d4af37]/20 rounded-2xl p-6 md:p-7">
            <header class="flex items-center gap-3 mb-4">
              <span class="flex items-center justify-center w-9 h-9 rounded-full bg-[#06070a] border border-[#d4af37]/30
                     font-heading text-[0.8rem] font-extrabold text-[#d4af37]/80">02</span>
              <span
                class="font-heading text-[0.65rem] font-extrabold tracking-[2px] uppercase text-[#d4af37]/60">Confirmation</span>
            </header>

            <h3 class="font-heading text-[1.15rem] font-extrabold mb-2 text-[#d4af37]/90">Chaque joueur confirme</h3>
            <p class="text-[0.92rem] leading-relaxed text-white/55 mb-4">
              Chaque membre du roster valide sa participation <strong class="text-white/80">de son côté</strong>, depuis
              son propre compte.
            </p>

            <ul class="flex flex-col gap-2.5 mb-5 text-[0.88rem] text-white/65">
              <li class="flex gap-2.5">
                <LucideCheck class="w-4 h-4 text-[#d4af37]/80 flex-shrink-0 mt-0.5" />
                <span>Le joueur <strong class="text-white/85">accepte la notification</strong> et confirme participer
                  avec ce clan</span>
              </li>
              <li class="flex gap-2.5">
                <LucideCheck class="w-4 h-4 text-[#d4af37]/80 flex-shrink-0 mt-0.5" />
                <span>Le capitaine voit <strong class="text-white/85">en temps réel</strong> qui a confirmé</span>
              </li>
              <li class="flex gap-2.5">
                <LucideCheck class="w-4 h-4 text-[#d4af37]/80 flex-shrink-0 mt-0.5" />
                <span>Roster validé dès que <strong class="text-white/85">5/5 joueurs</strong> ont confirmé</span>
              </li>
            </ul>

          </article>

          <!-- ══ ÉTAPE 03 — PAIEMENT ══════════════════ -->
          <article class="flex flex-col bg-[#d4af37]/[0.06] border border-[#d4af37]/30 rounded-2xl p-6 md:p-7">
            <header class="flex items-center gap-3 mb-4">
              <span class="flex items-center justify-center w-9 h-9 rounded-full bg-[#06070a] border border-[#d4af37]/40
                     font-heading text-[0.8rem] font-extrabold text-[#d4af37]">03</span>
              <span
                class="font-heading text-[0.65rem] font-extrabold tracking-[2px] uppercase text-[#d4af37]/70">Paiement</span>
            </header>

            <h3 class="font-heading text-[1.15rem] font-extrabold mb-2 text-[#d4af37]">Payer & entrer dans le bracket
            </h3>
            <p class="text-[0.92rem] leading-relaxed text-white/55 mb-4">
              Une fois le roster confirmé, deux options de règlement s'offrent au clan.
            </p>

            <!-- Deux options de paiement -->
            <div class="flex items-stretch gap-2 mb-5">
              <div class="flex-1 p-3 rounded-lg bg-[#06070a]/60 border border-white/10 text-center">
                <p class="text-[0.6rem] uppercase tracking-wider text-white/45 mb-1">Chacun</p>
                <p class="font-heading text-sm font-extrabold text-white leading-tight">1 000 FCFA</p>
                <p class="text-[0.7rem] text-white/50 mt-0.5">par joueur</p>
              </div>
              <span class="self-center text-[0.7rem] font-extrabold text-[#d4af37]/70 uppercase flex-shrink-0">ou</span>
              <div class="flex-1 p-3 rounded-lg bg-[#d4af37]/15 border border-[#d4af37]/40 text-center">
                <p class="text-[0.6rem] uppercase tracking-wider text-[#d4af37]/80 mb-1">Capitaine</p>
                <p class="font-heading text-sm font-extrabold text-[#d4af37] leading-tight">5 000 FCFA</p>
                <p class="text-[0.7rem] text-[#d4af37]/70 mt-0.5">pour tous</p>
              </div>
            </div>

            <ul class="flex flex-col gap-2.5 mb-5 text-[0.88rem] text-white/65">
              <li class="flex gap-2.5">
                <LucideCheck class="w-4 h-4 text-[#d4af37] flex-shrink-0 mt-0.5" />
                <span>Paiement par <strong class="text-white/85">MTN MoMo</strong> ou <strong
                    class="text-white/85">Orange Money</strong></span>
              </li>
              <li class="flex gap-2.5">
                <LucideCheck class="w-4 h-4 text-[#d4af37] flex-shrink-0 mt-0.5" />
                <span>Validation CCA puis <strong class="text-white/85">entrée automatique dans le
                    bracket</strong></span>
              </li>
            </ul>


          </article>
        </div>

      </section>

      <!-- ── FORMAT DU TOURNOI ──────────────────────── -->
      <section class="section py-4 md:py-5">
        <header class="mb-10 md:text-center md:mb-12">
          <p class="label">Format du tournoi</p>
          <h2 class="font-heading text-[clamp(1.6rem,5vw,2.2rem)] font-extrabold tracking-tight leading-tight mt-2">
            Comment ça <span class="text-[#d4af37]">fonctionne</span>
          </h2>

        </header>


        <!-- ══ RÈGLES DE MATCH ══════════════════════ -->
        <div class="grid md:grid-cols-3 gap-4 mb-6">
          <div class="p-5 rounded-xl bg-white/[0.03] border border-white/[0.07]">
            <LucideSwords class="w-6 h-6 text-[#d4af37] mb-3" />
            <p class="text-[0.65rem] font-extrabold uppercase tracking-[2px] text-white/40 mb-2">Format</p>
            <p class="font-heading text-lg font-extrabold text-white mb-2">5v5 mirror strict</p>
            <p class="text-[0.88rem] text-white/55 leading-relaxed">
              Chaque attaque cible le vis-à-vis du <strong class="text-white/85">même HDV</strong> dans le clan adverse
              — impossible d'attaquer plus bas.
            </p>
          </div>

          <div class="p-5 rounded-xl bg-white/[0.03] border border-white/[0.07]">
            <LucideClock class="w-6 h-6 text-[#bb00ff] mb-3" />
            <p class="text-[0.65rem] font-extrabold uppercase tracking-[2px] text-white/40 mb-2">Cadence</p>
            <p class="font-heading text-lg font-extrabold text-white mb-2">1h de guerre</p>
            <p class="text-[0.88rem] text-white/55 leading-relaxed">
              <strong class="text-white/85">15 min de préparation</strong> pour poser les bases, puis
              <strong class="text-white/85">1h de guerre</strong> pour attaquer. Pas de prolongation.
            </p>
          </div>

          <div class="p-5 rounded-xl bg-white/[0.03] border border-white/[0.07]">
            <LucideMedal class="w-6 h-6 text-[#d4af37] mb-3" />
            <p class="text-[0.65rem] font-extrabold uppercase tracking-[2px] text-white/40 mb-2">Victoire</p>
            <p class="font-heading text-lg font-extrabold text-white mb-2">Aux étoiles</p>
            <p class="text-[0.88rem] text-white/55 leading-relaxed">
              Le plus d'<strong class="text-white/85">étoiles</strong> l'emporte. Égalité ? On tranche au
              <strong class="text-white/85">% de destruction</strong>, puis au temps le plus rapide.
            </p>
          </div>
        </div>


        <!-- ══ CTA ══════════════════════════════════ -->
        <div class="flex flex-col md:flex-row items-start md:items-center md:justify-between">

          <NuxtLink to="/rules" class="btn-premium btn-outline whitespace-nowrap">
            Voir le règlement complet
          </NuxtLink>
        </div>

      </section>



      <!-- ── RÉCOMPENSES ────────────────────────────── -->
      <section class="section">
        <div class="label centered">Récompenses</div>
        <h2
          class="text-center font-heading text-[clamp(1.6rem,5vw,2.2rem)] font-extrabold tracking-tight leading-tight mt-2 mb-2">
          <span class="text-[#d4af37]">80 000 FCFA</span> à se partager
        </h2>
        <p class="text-center text-white/50 text-[0.92rem] max-w-[480px] mx-auto mb-10 leading-relaxed">
          Un cashprize total de 80 000 FCFA réparti entre les trois meilleurs clans de la saison.
        </p>

        <!-- Podium -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5 items-end max-w-4xl mx-auto">

          <!-- 2e place -->
          <div class="order-2 md:order-1 relative flex flex-col items-center text-center p-6 md:py-8 rounded-2xl
                bg-white/[0.03] border border-[#c0c0c0]/30">
            <div class="flex items-center justify-center w-12 h-12 rounded-full
                  bg-[#c0c0c0]/10 border border-[#c0c0c0]/30 mb-3">
              <LucideMedal class="w-6 h-6 text-[#c0c0c0]" />
            </div>
            <p class="text-[0.62rem] font-extrabold uppercase tracking-[3px] text-white/40 mb-1">Finaliste</p>
            <p class="font-heading text-2xl font-extrabold text-[#c0c0c0] leading-none">20 000</p>
            <p class="text-[0.7rem] text-white/35 mt-1">FCFA</p>
          </div>

          <!-- 1re place — élevé + glow -->
          <div class="order-1 md:order-2 relative flex flex-col items-center text-center p-7 md:py-10 rounded-2xl
                bg-gradient-to-b from-[#d4af37]/[0.15] to-[#06070a]
                border-2 border-[#d4af37]/60
                shadow-[0_0_40px_-5px_rgba(212,175,55,0.35)]
                md:-translate-y-4">
            <div class="absolute -top-3 px-3 py-1 rounded-full bg-[#d4af37]
                  text-[0.6rem] font-extrabold uppercase tracking-[2px] text-[#06070a]">
              Champion
            </div>
            <LucideCrown class="w-10 h-10 text-[#d4af37] mb-3 drop-shadow-[0_0_12px_rgba(212,175,55,0.6)]" />
            <p class="text-[0.62rem] font-extrabold uppercase tracking-[3px] text-[#d4af37]/80 mb-1">Vainqueur</p>
            <p
              class="font-heading text-4xl font-extrabold text-[#d4af37] leading-none drop-shadow-[0_0_20px_rgba(212,175,55,0.5)]">
              50 000
            </p>
            <p class="text-[0.75rem] text-[#d4af37]/70 font-bold tracking-wider mt-1">FCFA</p>
          </div>

          <!-- 3e place -->
          <div class="order-3 relative flex flex-col items-center text-center p-6 md:py-8 rounded-2xl
                bg-white/[0.03] border border-[#cd7f32]/30">
            <div class="flex items-center justify-center w-12 h-12 rounded-full
                  bg-[#cd7f32]/10 border border-[#cd7f32]/30 mb-3">
              <LucideMedal class="w-6 h-6 text-[#cd7f32]" />
            </div>
            <p class="text-[0.62rem] font-extrabold uppercase tracking-[3px] text-white/40 mb-1">3e place</p>
            <p class="font-heading text-2xl font-extrabold text-[#cd7f32] leading-none">10 000</p>
            <p class="text-[0.7rem] text-white/35 mt-1">FCFA</p>
          </div>
        </div>

        <p class="text-center text-[0.72rem] text-white/35 mt-4">
          Cashprize versé par Mobile Money dans les 7 jours suivant la finale.
        </p>
      </section>


      <!-- CTA FINAL -->
      <section class="relative rounded-[var(--radius-lg)] overflow-hidden border border-[#bb00ff]/40">
        <img src="/imagescoc/fun image.webp" alt="" aria-hidden="true"
          class="absolute inset-0 w-full h-full object-cover brightness-[0.18] saturate-[1.4] z-0" />
        <div class="cta-overlay absolute inset-0 z-[1]" />
        <div
          class="relative z-[2] grid grid-cols-[220px_1fr] items-center gap-12 px-8 py-2 max-[1100px]:grid-cols-1 max-[1100px]:text-center">
          <img src="/imagescoc/skin barbarian.webp" alt="" aria-hidden="true"
            class="w-full drop-shadow-[0_0_20px_black] max-[1100px]:max-w-[160px] max-[1100px]:mx-auto" />
          <div>
            <h2 class="text-[1.6rem] font-extrabold leading-snug mb-3.5">
              Les champions de la Saison 1<br />
              <span class="text-[#d4af37]">seront de retour.</span>
            </h2>
            <p class="text-white/50 text-base mb-7 leading-[1.7]">
              Les seize places s'ouvrent le 10 novembre. Votre clan doit être prêt.
            </p>
            <!-- <div class="flex gap-4 flex-wrap max-[1100px]:justify-center">
              <NuxtLink :to="ctaTo" class="btn-premium btn-secondary btn-hero">{{ ctaLabel }}</NuxtLink>
              <NuxtLink to="/clans/cameroun" class="btn-premium btn-outline btn-hero">Voir les clans</NuxtLink>
            </div> -->
          </div>
        </div>
      </section>

      <!-- ── CLÔTURE — Manifeste ────────────────────── -->
      <section class="relative overflow-hidden py-10 md:py-14 px-6 md:px-10">

        <!-- Fond : torche dorée qui monte du sol -->
        <div class="closing-glow absolute inset-0 pointer-events-none" aria-hidden="true" />
        <div class="closing-grid absolute inset-0 opacity-[0.03] pointer-events-none" aria-hidden="true" />

        <div class="relative max-w-3xl mx-auto text-center">

          <!-- Tagline -->
          <h2
            class="closing-fade closing-d2 font-heading text-[clamp(2*1rem,4vw,2.6rem)] font-extrabold leading-[1.1] tracking-tight mb-8">
            Unis par Clash.<br />
            <span class="closing-gold">construit pour la gloire.</span>
          </h2>

          <!-- Manifeste -->
          <p
            class="closing-fade closing-d3 text-white/55 text-[1rem] md:text-lg leading-relaxed max-w-xl mx-auto mb-10">
            Nous ne jouons pas pour participer.<br class="hidden md:block" />
            Nous jouons pour <strong class="text-white/85">régner</strong>.
            Seize clans, une nation, une couronne — et l'histoire à écrire.
          </p>

          <!-- Valeurs -->
          <div class="closing-fade closing-d4 flex flex-wrap justify-center gap-2 mb-12">
            <span class="px-4 py-2 rounded-full bg-white/[0.04] border border-white/10
                   text-[0.7rem] font-extrabold uppercase tracking-[2px] text-white/60">
              Unis
            </span>
            <span class="px-4 py-2 rounded-full bg-white/[0.04] border border-white/10
                   text-[0.7rem] font-extrabold uppercase tracking-[2px] text-white/60">
              Déterminés
            </span>
            <span class="px-4 py-2 rounded-full bg-[#d4af37]/10 border border-[#d4af37]/40
                   text-[0.7rem] font-extrabold uppercase tracking-[2px] text-[#d4af37]">
              Légendaires
            </span>
          </div>

          <!-- Lien discret (pas de gros bouton — la CTA est au-dessus) -->

          <a href="https://chat.whatsapp.com/GBHLhcO0JyLDJuYT8xJgSl?s=cl&p=a&ilr=1" target="_blank"
            rel="noopener noreferrer" class="footer-link flex gap-2 justify-center text-green-400">
            <div class="relative z-10 group-hover:scale-110 transition-transform">
              <LucideMessageCircle class="w-5 h-5 text-green-400" :stroke-width="2" />
            </div>
            Réjoindre la communauté Whatsapp 
          </a>


         

        </div>
      </section>


    </div>
  </div>
</template>

<script setup>
definePageMeta({ layout: 'home' });

const { $api } = useNuxtApp();
const { ctaLabel, ctaTo } = useTournamentCta();

const champion = ref(null);
const runnerUp = ref(null);
const championMatch = ref(null);

onMounted(async () => {
  try {
    const data = await $api('/tournament/champion');
    if (data?.champion) {
      champion.value = data.champion;
      runnerUp.value = data.runner_up || null;
      championMatch.value = data.match || null;
    }
  } catch { /* Pas encore de champion */ }

  startCountdown();
});

const countdown = ref({ days: '00', hours: '00', minutes: '00', seconds: '00' });
let countdownTimer = null;
const pad = (n) => String(n).padStart(2, '0');

function startCountdown() {
  const target = new Date('2026-11-10T00:00:00+01:00').getTime();
  const tick = () => {
    const diff = target - Date.now();
    if (diff <= 0) {
      countdown.value = { days: '00', hours: '00', minutes: '00', seconds: '00' };
      return;
    }
    countdown.value = {
      days: pad(Math.floor(diff / 86400000)),
      hours: pad(Math.floor((diff % 86400000) / 3600000)),
      minutes: pad(Math.floor((diff % 3600000) / 60000)),
      seconds: pad(Math.floor((diff % 60000) / 1000)),
    };
  };
  tick();
  countdownTimer = setInterval(tick, 1000);
}
onBeforeUnmount(() => countdownTimer && clearInterval(countdownTimer));

useHead({
  title: 'CCA National League Saison 2 — Tournoi Clash of Clans Cameroun',
  meta: [
    { name: 'description', content: 'Les inscriptions pour la CCA National League Saison 2 ouvrent le 10 novembre. 80 000 FCFA de cashprize, 16 clans d\'élite, un seul champion.' },
    { name: 'keywords', content: 'tournoi camerounais, coc cameroun, cca saison 2, clash of clans cameroun, cca league' },
    { property: 'og:title', content: 'CCA National League Saison 2 — Championnat CoC du Cameroun' },
    { property: 'og:description', content: 'Inscriptions ouvertes le 10 novembre. 16 clans, une seule couronne.' },
    { property: 'og:image', content: '/images/cca-affiche1.png' },
  ],
});
</script>

<style scoped>
/* ══════════════════════════════════════════════════
   CLÔTURE — ambiance "manifeste"
   ══════════════════════════════════════════════════ */

.closing-glow {
  background:
    radial-gradient(ellipse 60% 50% at 50% 110%, rgba(212, 175, 55, 0.22) 0%, transparent 70%),
    radial-gradient(ellipse 40% 40% at 50% 100%, rgba(187, 0, 255, 0.10) 0%, transparent 60%);
  z-index: 0;
}

.closing-grid {
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.15) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.15) 1px, transparent 1px);
  background-size: 60px 60px;
  mask-image: radial-gradient(ellipse 70% 60% at 50% 50%, #000 20%, transparent 80%);
  -webkit-mask-image: radial-gradient(ellipse 70% 60% at 50% 50%, #000 20%, transparent 80%);
  z-index: 0;
}

/* Reveal séquencé */
.closing-fade {
  opacity: 0;
  transform: translateY(14px);
  animation: closing-in 0.9s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

.closing-d1 {
  animation-delay: 0.1s;
}

.closing-d2 {
  animation-delay: 0.3s;
}

.closing-d3 {
  animation-delay: 0.5s;
}

.closing-d4 {
  animation-delay: 0.7s;
}

.closing-d5 {
  animation-delay: 0.85s;
}

.closing-d6 {
  animation-delay: 1s;
}

@keyframes closing-in {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* "Bâtis pour la gloire" — shine sweep doré */
.closing-gold {
  background: linear-gradient(100deg,
      #d4af37 0%,
      #f5d76e 25%,
      #d4af37 40%,
      #b8962f 60%,
      #d4af37 80%,
      #f5d76e 100%);
  background-size: 250% 100%;
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: closing-shine 6s ease-in-out infinite;
  display: inline-block;
}

@keyframes closing-shine {

  0%,
  100% {
    background-position: 0% 50%;
  }

  50% {
    background-position: 100% 50%;
  }
}

/* Accessibilité */
@media (prefers-reduced-motion: reduce) {

  .closing-fade,
  .closing-gold {
    animation: none !important;
  }

  .closing-fade {
    opacity: 1;
    transform: none;
  }
}

/* ══════════════════════════════════════════════════
   ANIMATIONS HERO — ambiance Clash of Clans
   ══════════════════════════════════════════════════ */

/* 1. Character — summon + breathing */
.hero-character-enter {
  opacity: 0;
  animation: character-summon 1.2s cubic-bezier(0.16, 1, 0.3, 1) 0.4s forwards;
}

@keyframes character-summon {
  0% {
    opacity: 0;
    transform: translateX(80px) scale(0.9);
  }

  60% {
    opacity: 1;
    transform: translateX(-8px) scale(1.02);
  }

  100% {
    opacity: 1;
    transform: translateX(0) scale(1);
  }
}

.hero-character-idle {
  animation: character-breathe 5s ease-in-out 1.8s infinite;
}

@keyframes character-breathe {

  0%,
  100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-10px);
  }
}

/* 2. Aura pulsante derrière le perso */
.hero-character-aura {
  background: radial-gradient(circle,
      rgba(187, 0, 255, 0.18) 0%,
      rgba(212, 175, 55, 0.08) 35%,
      transparent 70%);
  filter: blur(20px);
  animation: aura-pulse 4s ease-in-out infinite;
  transform-origin: center;
}

@keyframes aura-pulse {

  0%,
  100% {
    opacity: 0.5;
    transform: scale(0.95);
  }

  50% {
    opacity: 1;
    transform: scale(1.08);
  }
}

/* 3. Paillettes d'or */
.sparkle {
  position: absolute;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: radial-gradient(circle, #f5d76e 0%, #d4af37 45%, transparent 75%);
  box-shadow:
    0 0 8px 2px rgba(212, 175, 55, 0.7),
    0 0 16px 4px rgba(212, 175, 55, 0.25);
  opacity: 0;
  animation: sparkle-float 7s ease-in-out infinite;
}

.sparkle:nth-child(1) {
  left: 38%;
  bottom: 8%;
  --dx: 20px;
  animation-delay: 0s;
}

.sparkle:nth-child(2) {
  left: 52%;
  bottom: 20%;
  --dx: -25px;
  animation-delay: 1.2s;
  width: 3px;
  height: 3px;
}

.sparkle:nth-child(3) {
  left: 68%;
  bottom: 12%;
  --dx: 15px;
  animation-delay: 2.4s;
}

.sparkle:nth-child(4) {
  left: 78%;
  bottom: 25%;
  --dx: -18px;
  animation-delay: 0.6s;
  width: 5px;
  height: 5px;
}

.sparkle:nth-child(5) {
  left: 85%;
  bottom: 6%;
  --dx: 22px;
  animation-delay: 3.5s;
}

.sparkle:nth-child(6) {
  left: 45%;
  bottom: 35%;
  --dx: -20px;
  animation-delay: 4.2s;
  width: 3px;
  height: 3px;
}

.sparkle:nth-child(7) {
  left: 92%;
  bottom: 18%;
  --dx: -12px;
  animation-delay: 5s;
}

.sparkle:nth-child(8) {
  left: 60%;
  bottom: 5%;
  --dx: 18px;
  animation-delay: 2s;
  width: 3px;
  height: 3px;
}

.sparkle:nth-child(9) {
  left: 72%;
  bottom: 40%;
  --dx: -22px;
  animation-delay: 3s;
}

.sparkle:nth-child(10) {
  left: 30%;
  bottom: 30%;
  --dx: 15px;
  animation-delay: 1.8s;
  width: 5px;
  height: 5px;
}

@keyframes sparkle-float {
  0% {
    opacity: 0;
    transform: translate(0, 0) scale(0.4);
  }

  15% {
    opacity: 1;
    transform: translate(var(--dx, 0), -10vh) scale(1);
  }

  75% {
    opacity: 0.7;
    transform: translate(calc(var(--dx, 0) * 2), -50vh) scale(1.1);
  }

  100% {
    opacity: 0;
    transform: translate(calc(var(--dx, 0) * 3), -70vh) scale(0.8);
  }
}

/* 4. Shine sweep sur "CCA" — gradient animé sur text-clip */
.hero-title-cca {
  background: linear-gradient(100deg,
      #bb00ff 0%,
      #7b2fbe 25%,
      #d4af37 50%,
      #f5d76e 60%,
      #d4af37 70%,
      #7b2fbe 85%,
      #bb00ff 100%);
  background-size: 250% 100%;
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: title-shine 8s ease-in-out infinite;
}

@keyframes title-shine {

  0%,
  100% {
    background-position: 0% 50%;
  }

  50% {
    background-position: 100% 50%;
  }
}

/* 5. Countdown — tick sur les secondes */
.countdown-tick {
  animation: countdown-pop 1s ease-out;
}

@keyframes countdown-pop {
  0% {
    transform: scale(1);
    color: #fff;
  }

  20% {
    transform: scale(1.12);
    color: #f5d76e;
  }

  100% {
    transform: scale(1);
    color: #fff;
  }
}

/* 6. Stats chips — entrance en cascade */
.chip-enter {
  opacity: 0;
  animation: chip-slide-in 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

.chip-d1 {
  animation-delay: 0.7s;
}

.chip-d2 {
  animation-delay: 0.9s;
}

.chip-d3 {
  animation-delay: 1.1s;
}

@keyframes chip-slide-in {
  from {
    opacity: 0;
    transform: translateX(-24px) scale(0.94);
  }

  to {
    opacity: 1;
    transform: translateX(0) scale(1);
  }
}

/* 7. Bouton — shimmer sweep au hover */
.btn-hero-primary::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 40%;
  height: 100%;
  background: linear-gradient(90deg,
      transparent 0%,
      rgba(245, 215, 110, 0.55) 50%,
      transparent 100%);
  transform: translateX(-150%) skewX(-20deg);
  pointer-events: none;
}

.btn-hero-primary:hover::after {
  animation: btn-shimmer 0.9s ease-out;
}

@keyframes btn-shimmer {
  to {
    transform: translateX(300%) skewX(-20deg);
  }
}

/* 8. Background — respiration très lente */
.hero-bg-breathe {
  animation: bg-breathe 25s ease-in-out infinite;
}

@keyframes bg-breathe {

  0%,
  100% {
    transform: scale(1);
    opacity: 0.5;
  }

  50% {
    transform: scale(1.04);
    opacity: 0.55;
  }
}

/* ══════════════════════════════════════════════════
   Accessibilité — désactive tout si l'utilisateur préfère
   ══════════════════════════════════════════════════ */
@media (prefers-reduced-motion: reduce) {

  .hero-character-enter,
  .hero-character-idle,
  .hero-character-aura,
  .sparkle,
  .hero-title-cca,
  .countdown-tick,
  .chip-enter,
  .btn-hero-primary::after,
  .hero-bg-breathe,
  .hero-orb,
  .season-badge-dot {
    animation: none !important;
  }

  .hero-character-enter,
  .chip-enter {
    opacity: 1;
    transform: none;
  }
}

/* ══ Typographie (design tokens) ═══════════════ */
.font-heading {
  font-family: var(--font-heading);
}

.label {
  font-family: var(--font-ui);
  font-size: 0.68rem;
  font-weight: 800;
  letter-spacing: 5px;
  color: var(--primary);
  text-transform: uppercase;
  margin-bottom: 10px;
}


/* Ancrage visuel de l'image "à propos" */
.about-frame::before {
  content: '';
  position: absolute;
  inset: -12px;
  border-radius: 24px;
  background:
    radial-gradient(ellipse at 50% 50%, rgba(187, 0, 255, 0.12) 0%, transparent 70%),
    radial-gradient(ellipse at 50% 80%, rgba(212, 175, 55, 0.1) 0%, transparent 70%);
  filter: blur(20px);
  z-index: 0;
  pointer-events: none;
}

.label.centered {
  text-align: center;
}

/* ══ Effets complexes incompressibles en utilities ══ */
.hero-overlay {
  background:
    linear-gradient(to right, rgba(6, 7, 10, 0.97) 0%, rgba(6, 7, 10, 0.82) 28%, rgba(6, 7, 10, 0.35) 55%, rgba(6, 7, 10, 0.1) 100%),
    linear-gradient(to top, rgba(6, 7, 10, 0.85) 0%, transparent 30%);
}

.hero-grid-overlay {
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.15) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.15) 1px, transparent 1px);
  background-size: 80px 80px;
}

.hero-scanline {
  background: repeating-linear-gradient(0deg,
      transparent, transparent 2px,
      rgba(0, 0, 0, 0.03) 2px, rgba(0, 0, 0, 0.03) 4px);
}

/* Orbes animés */
.hero-orb {
  border-radius: 50%;
  animation: orb-float 8s ease-in-out infinite;
}

.hero-orb--gold {
  background: radial-gradient(circle, rgba(212, 175, 55, 0.12) 0%, transparent 70%);
}

.hero-orb--purple {
  background: radial-gradient(circle, rgba(187, 0, 255, 0.1) 0%, transparent 70%);
  animation-delay: -3s;
  animation-duration: 10s;
}

@keyframes orb-float {

  0%,
  100% {
    transform: translate(0, 0) scale(1);
  }

  33% {
    transform: translate(30px, -20px) scale(1.05);
  }

  66% {
    transform: translate(-15px, 15px) scale(0.97);
  }
}

/* Fond champion */
.champion-section-bg {
  background:
    radial-gradient(ellipse at 50% 0%, rgba(212, 175, 55, 0.16) 0%, transparent 65%),
    linear-gradient(180deg, #06070a 0%, #100d00 50%, #06070a 100%);
}

/* Petit trait lumineux en haut des tuiles du countdown */
.countdown-tile::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(to right, transparent, rgba(212, 175, 55, 0.3), transparent);
}

/* Pulsation du badge "Saison 2" */
.season-badge-dot {
  animation: pulse-dot 2s ease-in-out infinite;
}

@keyframes pulse-dot {

  0%,
  100% {
    opacity: 1;
    transform: scale(1);
  }

  50% {
    opacity: 0.4;
    transform: scale(0.6);
  }
}

/* Fade-in décalé (hero) */
.anim-fade {
  opacity: 0;
  transform: translateY(18px);
  animation: fade-up 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

.anim-d1 {
  animation-delay: 0.15s;
}

.anim-d2 {
  animation-delay: 0.3s;
}

.anim-d3 {
  animation-delay: 0.45s;
}

.anim-d4 {
  animation-delay: 0.6s;
}

.anim-d5 {
  animation-delay: 0.75s;
}

@keyframes fade-up {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Reflet dégradé au hover du bouton principal */
.btn-hero-primary::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(212, 175, 55, 0.15), transparent);
  opacity: 0;
  transition: opacity 0.3s;
}

.btn-hero-primary:hover::before {
  opacity: 1;
}

/* Halo des illustrations (variable design-system) */
.about-img,
.format-img {
  filter: drop-shadow(0 0 30px var(--primary-glow));
}

/* Overlay du CTA final */
.cta-overlay {
  background: linear-gradient(to right,
      rgba(10, 11, 18, 0.92) 40%,
      rgba(10, 11, 18, 0.6) 100%);
}

/* Glow arrière du podium champion (doit passer sous la carte) */
.podium-champion-glow::before {
  content: '';
  position: absolute;
  inset: -2px;
  border-radius: 20px;
  background: linear-gradient(135deg, rgba(212, 175, 55, 0.25), transparent 55%);
  z-index: -1;
  pointer-events: none;
}
</style>