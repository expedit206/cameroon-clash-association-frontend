<template>
  <div class="home-page">
    <!-- ═══════════════════════════════════════════════════
         HERO SECTION — Plein écran (100vw × 100vh)
         Image en fond + overlay sombre + contenu centré
    ═══════════════════════════════════════════════════ -->
    <section class="hero">
      <!-- 1. Image de fond absolute -->
      <img src="/images/tournaments/hero-bg.png" alt="" class="hero-bg-img" aria-hidden="true" />
      <!-- 2. Overlay dégradé pour lisibilité du texte -->
      <div class="hero-overlay"></div>

      <!-- 3. Contenu principal centré verticalement -->
      <div class="hero-body">
        <!-- Titre du tournoi -->
        <h1 class="hero-title flex">
          <span class="hero-title-cca text-gradient-purple">CCA</span>
          <span class="hero-title-league">National<br />League</span>
        </h1>
        <p class="hero-subtitle">
          Le tournoi Clash of Clans le plus compétitif du Cameroun.<br />
          Une saison. 16 clans. Un seul champion.
        </p>

        <!-- Stats clés en glassmorphism -->
        <div class="hero-stats">
          <div class="stat-pill">
            <span class="stat-icon">
              <LucideTrophy class="w-7 h-7 text-[#d4af37]" />
            </span>
            <div class="stat-info">
              <p class="stat-val">50&nbsp;000 FCFA</p>
              <p class="stat-lbl">Cashprize Total</p>
            </div>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-pill">
            <span class="stat-icon">
              <LucideShield class="w-7 h-7 text-[#bb00ff]" />
            </span>
            <div class="stat-info">
              <p class="stat-val">16 Clans</p>
              <p class="stat-lbl">Places Limitées</p>
            </div>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-pill">
            <span class="stat-icon">
              <LucideCalendar class="w-7 h-7 text-white/70" />
            </span>
            <div class="stat-info">
              <p class="stat-val">15 Juillet</p>
              <p class="stat-lbl">Inscriptions des clans</p>
            </div>
          </div>
          <!-- <div class="stat-divider"></div>
          <div class="stat-pill">
            <span class="stat-icon">💳</span>
            <div class="stat-info">
              <p class="stat-val">5&nbsp;000 FCFA</p>
              <p class="stat-lbl">Frais d'inscription</p>
            </div>
          </div> -->
        </div>

        <!-- Boutons d'action -->
        <div class="hero-actions">
          <NuxtLink :to="ctaTo" class="btn-premium btn-primary btn-hero flex items-center gap-2">
            <LucideSwords class="w-4 h-4" /> Je veux participer au tournoi
          </NuxtLink>
        </div>
      </div>

      <!-- 4. Personnage décoratif en bas à droite -->
      <img src="/imagescoc/fun image.webp" alt="Héros CCA" class="hero-character animate-float" />

      <!-- 5. Flèche vers le bas -->
    </section>

    <!-- ═══════════════════════════════════════════════════
         SECTIONS INFORMATIVES — Contenu en max-width
    ═══════════════════════════════════════════════════ -->
    <div class="page-body">
      <!-- ── À PROPOS ─────────────────────────────────── -->
      <section id="about" class="section">
        <div class="label text-center">Qui sommes nous ?</div>
        <div class="about-grid">
          <div class="about-img-wrap">
            <img src="/imagescoc/grand gardien skin.webp" alt="Grand Gardien" class="about-img animate-float" />
          </div>
          <div class="about-text">
            <h2 class="text-xl md:text-2xl">
              Qu'est-ce que la
              <span class="text-gold">CCA National League</span> ?
            </h2>
            <p>
              La <strong>Cameroon Clash Association (CCA)</strong> est une
              organisation née de la passion des joueurs camerounais pour Clash
              of Clans. Notre objectif : offrir à la communauté un cadre
              compétitif, transparent et festif.
            </p>
            <p>
              La <strong>CCA National League Saison&nbsp;1</strong> réunit les
              16 meilleurs clans du pays dans un tournoi à élimination directe,
              suivi en temps réel sur cette plateforme par une communauté de
              plus de <strong>500 membres actifs</strong>.
            </p>
            <div class="highlights">
              <div class="highlight">
                <span>
                  <LucideGlobe class="w-5 h-5 text-[#bb00ff]" />
                </span> Ouvert à tous les clans camerounais
              </div>
              <div class="highlight">
                <span>
                  <LucideScale class="w-5 h-5 text-[#d4af37]" />
                </span> Arbitrage officiel &amp; résultats transparents
              </div>
              <div class="highlight">
                <span>
                  <LucideRadio class="w-5 h-5 text-[#bb00ff]" />
                </span> Suivi en direct sur la plateforme CCA
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- ── COMMENT PARTICIPER ─────────────────────── -->
      <section class="section">
        <div class="label centered">COMMENT PARTICIPER ?</div>
        <h2 class="text-center capitalize text-2xl pb-3 md:pb-6">
          Le chemin vers la <span class="text-gold">Gloire</span>
        </h2>
        <div class="flex flex-col gap-2 md:gap-3">
          <div class="glass-card phase-card">
            <div class="flex justify-center">
              <img src="/imagescoc/badge 1.webp" alt="" class="phase-img" />
            </div>
            <div class="phase-num">01</div>
            <h3>Inscription du Joueur</h3>
            <p>
              Créez votre compte avec votre tag CoC. La vérification est
              <strong>gratuite</strong>.
            </p>
          </div>
          <div class="glass-card phase-card featured-card">
            <div class="flex justify-center">
              <img src="/imagescoc/DragonEventDeco.webp" alt="" class="phase-img" />
            </div>
            <div class="phase-num text-gold">02</div>
            <h3>Composition de l'Équipe</h3>
            <p>
              Le capitaine sélectionne
              <strong>5 titulaires + 5 remplaçants</strong> issus de son clan.
            </p>
          </div>
          <div class="glass-card phase-card">
            <div class="flex justify-center">
              <img src="/imagescoc/badge 2.webp" alt="" class="phase-img" />
            </div>
            <div class="phase-num">03</div>
            <h3>Validation par l'admin CCA</h3>
            <p>
              L'administrateur de la plateforme de la CCA passera en revu l'équipe qui a été soumise , afin de verifier
              si elle respecte toutes les conditions requise pour le tournoi(<strong>CCA National League</strong>)
            </p>
          </div>
        </div>
      </section>

      <!-- ── FORMAT DU TOURNOI ──────────────────────── -->
      <section class="section format-section p-3 glass-card">
        <img src="/imagescoc/machine de combat.webp" alt="Machine de combat" class="format-img animate-float" />
        <div class="">
          <div class="text-lg italic">Format du tournoi</div>
          <h2 class="text-xl py-3">
            Comment ça <span class="text-gold">fonctionne</span> ?
          </h2>
          <ul class="format-list">
            <li>
              <span>
                <LucideSwords class="w-5 h-5 text-[#d4af37]" />
              </span><span><strong>16 clans</strong> — Brackets élimination directe</span>
            </li>
            <li>
              <span>
                <LucideCastle class="w-5 h-5 text-[#bb00ff]" />
              </span><span>Format <strong>5v5</strong> — Bases HDV 14 à 18</span>
            </li>
            <li>
              <span>
                <LucideClock class="w-5 h-5 text-white/60" />
              </span><span>15 min préparation · 1h de guerre</span>
            </li>
            <li><span>
                <LucideBarChart3 class="w-5 h-5 text-[#bb00ff]" />
              </span><span>Résultats publiés en temps réel</span></li>
            <li>
              <span>
                <LucideMedal class="w-5 h-5 text-[#d4af37]" />
              </span><span>Grande finale pour le titre de Champion CCA 2026</span>
            </li>
          </ul>
          <NuxtLink to="/rules" class="btn-premium btn-outline">Voir le Règlement Complet</NuxtLink>
        </div>
      </section>

      <!-- ── RÉCOMPENSES ────────────────────────────── -->
      <section class="section">
        <div class="label centered">RÉCOMPENSES</div>
        <h2 class="text-2xl py-3">
          Les Trophées de la <span class="text-gold">Victoire</span>
        </h2>
        <div class="flex flex-col gap-2">
          <div class="glass-card reward-card" style="border-color: var(--secondary)">
            <div class="reward-place">
              <LucideTrophy class="w-10 h-10 text-[#d4af37] mx-auto" />
            </div>
            <p class="reward-amount text-gold">50&nbsp;000 FCFA</p>
            <p class="reward-label">Champion CCA</p>
            <p class="reward-extra">+ Trophée officiel &amp; Badge Champion</p>
          </div>
          <div class="glass-card reward-card" style="border-color: #c0c0c0">
            <div class="reward-place">
              <LucideMedal class="w-10 h-10 mx-auto" style="color:#c0c0c0" />
            </div>
            <p class="reward-amount" style="color: #c0c0c0">20&nbsp;000 FCFA</p>
            <p class="reward-label">2e place</p>
            <p class="reward-extra">+ Badge Finaliste</p>
          </div>
          <div class="glass-card reward-card" style="border-color: #cd7f32">
            <div class="reward-place">
              <LucideMedal class="w-10 h-10 mx-auto" style="color:#cd7f32" />
            </div>
            <p class="reward-amount" style="color: #c0c0c0">10&nbsp;000 FCFA</p>

            <p class="reward-label">3e Place</p>
            <p class="reward-extra">+ Badge Semi-Finaliste</p>
          </div>
        </div>
      </section>

      <!-- ── CTA FINAL ──────────────────────────────── -->
      <section class="cta-section">
        <img src="/imagescoc/fun image.webp" alt="" class="cta-bg-img" aria-hidden="true" />
        <div class="cta-overlay"></div>
        <div class="cta-content p-2">
          <img src="/imagescoc/skin barbarian.webp" alt="Barbarian" class="cta-char" />
          <div class="text-md md:text-xl p-2">
            <h2>
              Ne laissez pas votre rival<br /><span class="text-gold">s'inscrire avant vous.</span>
            </h2>
            <p>Les places sont limitées aux 16 premiers clans confirmés.</p>
            <div class="cta-btns">
              <NuxtLink :to="ctaTo" class="btn-premium btn-secondary btn-hero"> {{ ctaLabel }}</NuxtLink>
              <NuxtLink to="/clans" class="btn-premium btn-outline btn-hero">Clans Inscrits</NuxtLink>
            </div>
          </div>
        </div>
      </section>
    </div>
    <!-- /page-body -->
  </div>
  <!-- /home-page -->
</template>

<script setup>
/* Utilise le layout "home" dédié sans padding/max-width pour le plein écran */
definePageMeta({ layout: "home" });

const { ctaLabel, ctaTo, ctaIcon } = useTournamentCta();

useHead({
  title: "CCA National League saison 1 — Tournoi Clash of Clans Cameroun 🇨🇲",
  meta: [
    {
      name: "description",
      content:
        "Participez à la CCA National League, le plus grand tournoi Clash of Clans au Cameroun. 50 000 FCFA de cashprize, 16 clans d'élite, 1 seul champion.",
    },
    {
      name: "keywords",
      content:
        "tournoi camerounois, coc cameroun, cca, clash of clans cameroun, cca league, cashprize coc",
    },
    {
      property: "og:title",
      content:
        "Cameroon Clash Association National League — Championnat CoC du Cameroun 🏆",
    },
    {
      property: "og:description",
      content:
        "Rejoignez la compétition de clans d'élite au Cameroun. Suivez les brackets et le classement.",
    },
    {
      property: "og:image",
      content: "/images/cca-affiche1.png",
    },
  ],
});
</script>

<style scoped>
/* ══ PAGE ══════════════════════════════════════════ */
.home-page {
  display: flex;
  flex-direction: column;
}

/* ══ HERO — Plein écran (100vw × 100vh) ═══════════ */
.hero {
  position: relative;
  width: 100vw;
  height: 100vh;
  /* TOUTE la hauteur de la fenêtre */
  display: flex;
  align-items: center;
  /* Centrage vertical */
  overflow: hidden;
}

/* Image qui remplit tout l'espace */
.hero-bg-img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  /* Remplit sans déformer */
  object-position: center;
  z-index: 0;
}

/* Overlay sombre dégradé pour rendre le texte lisible */
.hero-overlay {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(to right,
      rgba(6, 7, 10, 0.92) 0%,
      rgba(6, 7, 10, 0.75) 15%,
      rgba(6, 7, 10, 0.3) 40%),
    linear-gradient(to top, rgba(6, 7, 10, 0.6) 5%, transparent 20%);
  z-index: 1;
}

/* Zone de contenu texte + stats */
.hero-body {
  position: relative;
  z-index: 3;
  padding: 0 80px;
  /* max-width: 820px; */
  display: flex;
  flex-direction: column;
  gap: 28px;
}

/* Petit badge "saison" en haut */
.hero-top-badge {
  display: inline-block;
  padding: 6px 18px;
  background: rgba(187, 0, 255, 0.2);
  border: 1px solid rgba(187, 0, 255, 0.5);
  border-radius: 50px;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 3px;
  color: var(--primary);
  text-transform: uppercase;
  width: fit-content;
}

/* Titre géant */
.hero-title {
  display: flex;
  flex-direction: flex;
  line-height: 1;
  gap: 0;
}

.hero-title-cca {
  font-family: var(--font-heading);
  font-size: 5rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: -1px;
}

.hero-title-league {
  font-family: var(--font-heading);
  font-size: 4.5rem;
  font-weight: 700;
  text-transform: capitalize;
  color: var(--secondary);
  text-shadow: 0 0 30px rgba(255, 215, 0, 0.4);
  line-height: 1.05;
}

/* Sous-titre */
.hero-subtitle {
  font-size: 1.15rem;
  line-height: 1.8;
  max-width: 530px;
}

/* Barre de stats glassmorphic */
.hero-stats {
  display: flex;
  align-items: center;
  gap: 0;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(16px);
  border-radius: var(--radius-md);
  padding: 16px 24px;
  width: fit-content;
  flex-wrap: wrap;
}

.stat-pill {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0 20px;
}

.stat-pill:first-child {
  padding-left: 0;
}

.stat-pill:last-child {
  padding-right: 0;
}

.stat-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.stat-val {
  font-family: var(--font-ui);
  font-weight: 800;
  font-size: 1rem;
  color: white;
  white-space: nowrap;
}

.stat-lbl {
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  /* color: var(--text-muted); */
  white-space: nowrap;
}

.stat-divider {
  width: 1px;
  height: 36px;
  background: rgba(255, 255, 255, 0.15);
  flex-shrink: 0;
}

/* Boutons du hero */
.hero-actions {
  display: flex;
  gap: 18px;
  flex-wrap: wrap;
}

.btn-hero {
  padding: 16px 40px;
  font-size: .6rem;
}

/* Personnage en bas à droite */
.hero-character {
  position: absolute;
  bottom: 0;
  right: 0;
  z-index: 2;
  height: 95%;
  width: auto;
  max-width: 55%;
  object-fit: contain;
  object-position: bottom right;
  filter: drop-shadow(0 0 60px rgba(187, 0, 255, 0.35));
  pointer-events: none;
}

/* Flèche scroll */
.hero-scroll {
  position: absolute;
  bottom: 28px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 4;
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.85rem;
  text-decoration: none;
  letter-spacing: 2px;
  animation: bob 2s ease-in-out infinite;
}

@keyframes bob {

  0%,
  100% {
    transform: translateX(-50%) translateY(0);
  }

  50% {
    transform: translateX(-50%) translateY(6px);
  }
}

/* ══ PAGE BODY (sections sous le hero) ════════════ */
.page-body {
  display: flex;
  flex-direction: column;
  gap: 100px;
  padding: 100px 80px 120px;
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
}

/* Labels de section */
.label {
  font-family: var(--font-ui);
  font-size: 0.7rem;
  font-weight: 800;
  letter-spacing: 5px;
  color: var(--primary);
  text-transform: uppercase;
  margin-bottom: 10px;
}

.label.centered {
  text-align: center;
}

.section-title {
  font-size: 2.8rem;
  text-align: center;
  margin-bottom: 50px;
}

/* ── About ─────────────────────────────────────── */
.about-grid {
  display: grid;
  grid-template-columns: 0.6fr 1.4fr;
  gap: 1rem;
  align-items: center;
}

.about-img {
  width: 100%;
  filter: drop-shadow(0 0 30px var(--primary-glow));
}

.about-text h2 {
  /* font-size: 2.4rem; */
  margin-bottom: 24px;
}

.about-text p {
  color: var(--text-muted);
  font-size: 1.05rem;
  line-height: 1.8;
  margin-bottom: 18px;
}

.highlights {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 24px;
}

.highlight {
  display: flex;
  align-items: center;
  gap: 12px;
  font-weight: 500;
}

/* ── Phases ────────────────────────────────────── */

.phase-card {
  text-align: center;
  padding: 20px 10px;
  position: relative;
  overflow: hidden;
}

.featured-card {
  border-color: var(--primary);
  background: linear-gradient(180deg,
      rgba(187, 0, 255, 0.08),
      rgba(10, 11, 18, 0.9));
}

.phase-img {
  height: 80px;
  margin-bottom: 20px;
}

.phase-num {
  position: absolute;
  top: 14px;
  right: 18px;
  font-family: var(--font-heading);
  font-size: 3.5rem;
  font-weight: 700;
  opacity: 0.12;
  line-height: 1;
}

.phase-card h3 {
  font-size: 1.3rem;
  margin-bottom: 14px;
}

.phase-card p {
  color: var(--text-muted);
  line-height: 1.7;
  font-size: 0.95rem;
}

/* ── Format ────────────────────────────────────── */
.format-section {
  display: grid;
  grid-template-columns: 1.2fr 0.8fr;
  align-items: center;
  gap: 60px;
}

.format-left h2 {
  font-size: 2.5rem;
  margin-bottom: 28px;
}

.format-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 36px;
}

.format-list li {
  display: flex;
  gap: 14px;
  color: var(--text-muted);
  align-items: flex-start;
  line-height: 1.6;
}

.format-img {
  width: 100%;
  filter: drop-shadow(0 0 30px var(--primary-glow));
}

/* ── Rewards ───────────────────────────────────── */
.rewards-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
}

.reward-card {
  text-align: center;
  padding: 20px 18px;
}

.reward-place {
  font-size: 3rem;
  margin-bottom: 16px;
}

.reward-amount {
  font-family: var(--font-heading);
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 8px;
}

.reward-label {
  font-size: 1.1rem;
  font-weight: 700;
  margin-bottom: 8px;
}

.reward-extra {
  font-size: 0.85rem;
  color: var(--text-muted);
}

/* ── CTA Final ─────────────────────────────────── */
.cta-section {
  position: relative;
  border-radius: var(--radius-lg);
  overflow: hidden;
  border: 2px solid var(--primary);
}

.cta-bg-img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: brightness(0.2) saturate(1.5);
  z-index: 0;
}

.cta-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to right,
      rgba(10, 11, 18, 0.9) 40%,
      rgba(10, 11, 18, 0.6) 100%);
  z-index: 1;
}

.cta-content {
  position: relative;
  z-index: 2;
  display: grid;
  grid-template-columns: 240px 1fr;
  align-items: center;
  gap: 60px;
}

.cta-char {
  width: 100%;
  filter: drop-shadow(0 0 20px black);
}

.text-xl p-4 p {
  color: var(--text-muted);
  font-size: 1.1rem;
  margin-bottom: 30px;
}

.cta-btns {
  display: flex;
  gap: 20px;
}

/* ══ RESPONSIVE ════════════════════════════════════ */
@media (max-width: 1100px) {
  .hero-body {
    padding: 0 40px;
  }

  .hero-title-cca {
    font-size: 5rem;
  }

  .hero-title-league {
    font-size: 3.5rem;
  }

  .hero-character {
    opacity: 0.5;
    max-width: 50%;
  }

  .page-body {
    padding: 80px 40px 100px;
  }

  .about-grid {
    grid-template-columns: 1fr;
  }

  .about-img-wrap {
    display: flex;
    justify-content: center;
  }

  .about-img {
    max-width: 280px;
  }

  .format-section {
    grid-template-columns: 1fr;
  }

  .cta-content {
    grid-template-columns: 1fr;
    text-align: center;
  }

  .cta-char {
    max-width: 180px;
    margin: 0 auto;
  }

  .cta-btns {
    justify-content: center;
  }
}

@media (max-width: 768px) {
  .hero-body {
    padding: 0 24px;
    max-width: 100%;
  }

  .hero-title-cca {
    font-size: 4rem;
  }

  .hero-title-league {
    font-size: 2.5rem;
  }

  .hero-character {
    display: none;
  }

  .hero-stats {
    width: 100%;
    justify-content: space-around;
  }

  .stat-divider {
    display: none;
  }

  .stat-pill {
    padding: 8px;
  }

  .phases-grid gap-1 md:gap-3,
  .rewards-grid {
    grid-template-columns: 1fr;
  }

  .page-body {
    padding: 60px 20px 80px;
    gap: 60px;
  }
}
</style>
