<template>
  <div class="home-page">

    <!-- ═══════════════════════════════════════════════════
         HERO SECTION — Plein écran (100vw × 100vh)
         Image en fond + overlay sombre + contenu centré
    ═══════════════════════════════════════════════════ -->
    <section class="hero">
      <!-- 1. Image de fond absolute -->
      <img
        src="/imagescoc/firstcoc.webp"
        alt=""
        class="hero-bg-img"
        aria-hidden="true"
      />
      <!-- 2. Overlay dégradé pour lisibilité du texte -->
      <div class="hero-overlay"></div>

      <!-- 3. Contenu principal centré verticalement -->
      <div class="hero-body">

        <!-- Titre du tournoi -->
        <div class="hero-top-badge">⚔️ SAISON 1 &bull; 2026</div>
        <h1 class="hero-title">
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
            <span class="stat-icon">🏆</span>
            <div class="stat-info">
              <p class="stat-val">50&nbsp;000 FCFA</p>
              <p class="stat-lbl">Cashprize Total</p>
            </div>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-pill">
            <span class="stat-icon">🛡️</span>
            <div class="stat-info">
              <p class="stat-val">16 Clans</p>
              <p class="stat-lbl">Places Limitées</p>
            </div>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-pill">
            <span class="stat-icon">📅</span>
            <div class="stat-info">
              <p class="stat-val">1 — 15 Juillet</p>
              <p class="stat-lbl">Inscriptions</p>
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
          <NuxtLink to="/register" class="btn-premium btn-primary btn-hero">
            ⚔️ Inscrire mon Clan
          </NuxtLink>
          <NuxtLink to="/rules" class="btn-premium btn-outline btn-hero">
            📜 Règlement
          </NuxtLink>
        </div>
      </div>

      <!-- 4. Personnage décoratif en bas à droite -->
      <img
        src="/imagescoc/all heros.webp"
        alt="Héros CCA"
        class="hero-character animate-float"
      />

      <!-- 5. Flèche vers le bas -->
      <a href="#about" class="hero-scroll">▾ Découvrir</a>
    </section>

    <!-- ═══════════════════════════════════════════════════
         SECTIONS INFORMATIVES — Contenu en max-width
    ═══════════════════════════════════════════════════ -->
    <div class="page-body">

      <!-- ── À PROPOS ─────────────────────────────────── -->
      <section id="about" class="section">
        <div class="label">À PROPOS</div>
        <div class="about-grid">
          <div class="about-img-wrap">
            <img src="/imagescoc/grand gardien skin.webp" alt="Grand Gardien" class="about-img animate-float" />
          </div>
          <div class="about-text">
            <h2>Qu'est-ce que la <span class="text-gold">CCA National League</span> ?</h2>
            <p>
              La <strong>Cameroon Clash Association (CCA)</strong> est une organisation née de la passion
              des joueurs camerounais pour Clash of Clans. Notre objectif : offrir à la communauté un
              cadre compétitif, transparent et festif.
            </p>
            <p>
              La <strong>CCA National League Saison&nbsp;1</strong> réunit les 16 meilleurs clans du pays
              dans un tournoi à élimination directe, suivi en temps réel sur cette plateforme
              par une communauté de plus de <strong>500 membres actifs</strong>.
            </p>
            <div class="highlights">
              <div class="highlight"><span>🌍</span> Ouvert à tous les clans camerounais</div>
              <div class="highlight"><span>⚖️</span> Arbitrage officiel & résultats transparents</div>
              <div class="highlight"><span>📡</span> Suivi en direct sur la plateforme CCA</div>
            </div>
          </div>
        </div>
      </section>

      <!-- ── COMMENT PARTICIPER ─────────────────────── -->
      <section class="section">
        <div class="label centered">COMMENT PARTICIPER</div>
        <h2 class="section-title">Le chemin vers la <span class="text-gold">Gloire</span></h2>
        <div class="phases-grid">
          <div class="glass-card phase-card">
            <img src="/imagescoc/badge 1.webp" alt="" class="phase-img" />
            <div class="phase-num">01</div>
            <h3>Inscription du Joueur</h3>
            <p>Créez votre compte avec votre tag CoC. La vérification est <strong>gratuite</strong>.</p>
          </div>
          <div class="glass-card phase-card featured-card">
            <img src="/imagescoc/DragonEventDeco.webp" alt="" class="phase-img" />
            <div class="phase-num text-gold">02</div>
            <h3>Composition de l'Équipe</h3>
            <p>Le capitaine sélectionne <strong>5 titulaires + 5 remplaçants</strong> issus de son clan.</p>
          </div>
          <div class="glass-card phase-card">
            <img src="/imagescoc/badge 2.webp" alt="" class="phase-img" />
            <div class="phase-num">03</div>
            <h3>Paiement & Confirmation</h3>
            <p>Payez <strong>5&nbsp;000 FCFA</strong> via Orange/MTN Money. Validation par l'admin CCA.</p>
          </div>
        </div>
      </section>

      <!-- ── FORMAT DU TOURNOI ──────────────────────── -->
      <section class="section format-section glass-card">
        <div class="format-left">
          <div class="label">FORMAT</div>
          <h2>Comment ça <span class="text-gold">fonctionne</span> ?</h2>
          <ul class="format-list">
            <li><span>⚔️</span><span><strong>16 clans</strong> — Brackets élimination directe</span></li>
            <li><span>🏰</span><span>Format <strong>5v5</strong> — Bases HDV 14 à 18</span></li>
            <li><span>⏱️</span><span>15 min préparation · 1h de guerre</span></li>
            <li><span>📊</span><span>Résultats publiés en temps réel</span></li>
            <li><span>🥇</span><span>Grande finale pour le titre de Champion CCA 2026</span></li>
          </ul>
          <NuxtLink to="/rules" class="btn-premium btn-outline">Voir le Règlement Complet</NuxtLink>
        </div>
        <img src="/imagescoc/machine de combat.webp" alt="Machine de combat" class="format-img animate-float" />
      </section>

      <!-- ── RÉCOMPENSES ────────────────────────────── -->
      <section class="section">
        <div class="label centered">RÉCOMPENSES</div>
        <h2 class="section-title">Les Trophées de la <span class="text-gold">Victoire</span></h2>
        <div class="rewards-grid">
          <div class="glass-card reward-card" style="border-color:var(--secondary)">
            <div class="reward-place">🥇</div>
            <p class="reward-amount text-gold">30&nbsp;000 FCFA</p>
            <p class="reward-label">Champion CCA</p>
            <p class="reward-extra">+ Trophée officiel & Badge Champion</p>
          </div>
          <div class="glass-card reward-card" style="border-color:#c0c0c0">
            <div class="reward-place">🥈</div>
            <p class="reward-amount" style="color:#c0c0c0">20&nbsp;000 FCFA</p>
            <p class="reward-label">Finaliste</p>
            <p class="reward-extra">+ Badge Finaliste</p>
          </div>
          <div class="glass-card reward-card" style="border-color:#cd7f32">
            <div class="reward-place">🥉</div>
            <p class="reward-amount" style="color:#cd7f32">Mention d'Honneur</p>
            <p class="reward-label">3e Place</p>
            <p class="reward-extra">+ Badge Semi-Finaliste</p>
          </div>
        </div>
      </section>

      <!-- ── CTA FINAL ──────────────────────────────── -->
      <section class="cta-section">
        <img src="/imagescoc/fun image.webp" alt="" class="cta-bg-img" aria-hidden="true" />
        <div class="cta-overlay"></div>
        <div class="cta-content">
          <img src="/imagescoc/skin barbarian.webp" alt="Barbarian" class="cta-char" />
          <div class="cta-text">
            <h2>Ne laissez pas votre rival<br /><span class="text-gold">s'inscrire avant vous.</span></h2>
            <p>Les places sont limitées aux 16 premiers clans confirmés.</p>
            <div class="cta-btns">
              <NuxtLink to="/register" class="btn-premium btn-secondary btn-hero">Inscrire mon Clan</NuxtLink>
              <NuxtLink to="/clans" class="btn-premium btn-outline btn-hero">Clans Inscrits</NuxtLink>
            </div>
          </div>
        </div>
      </section>

    </div><!-- /page-body -->
  </div><!-- /home-page -->
</template>

<script setup>
/* Utilise le layout "home" dédié sans padding/max-width pour le plein écran */
definePageMeta({ layout: 'home' })

useHead({
  title: 'CCA National League — Tournoi Clash of Clans Cameroun',
  meta: [{
    name: 'description',
    content: '50 000 FCFA de cashprize. 16 clans. 1 champion. Inscrivez votre clan au plus grand tournoi Clash of Clans du Cameroun.'
  }]
})
</script>

<style scoped>
/* ══ PAGE ══════════════════════════════════════════ */
.home-page { display: flex; flex-direction: column; }

/* ══ HERO — Plein écran (100vw × 100vh) ═══════════ */
.hero {
  position: relative;
  width: 100vw;
  height: 100vh;          /* TOUTE la hauteur de la fenêtre */
  display: flex;
  align-items: center;    /* Centrage vertical */
  overflow: hidden;
}

/* Image qui remplit tout l'espace */
.hero-bg-img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;      /* Remplit sans déformer */
  object-position: center;
  z-index: 0;
}

/* Overlay sombre dégradé pour rendre le texte lisible */
.hero-overlay {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(to right, rgba(6,7,10,.92) 0%, rgba(6,7,10,.75) 55%, rgba(6,7,10,.3) 100%),
    linear-gradient(to top, rgba(6,7,10,.6) 0%, transparent 40%);
  z-index: 1;
}

/* Zone de contenu texte + stats */
.hero-body {
  position: relative;
  z-index: 3;
  padding: 0 80px;
  max-width: 820px;
  display: flex;
  flex-direction: column;
  gap: 28px;
}

/* Petit badge "saison" en haut */
.hero-top-badge {
  display: inline-block;
  padding: 6px 18px;
  background: rgba(187,0,255,.2);
  border: 1px solid rgba(187,0,255,.5);
  border-radius: 50px;
  font-size: .75rem;
  font-weight: 700;
  letter-spacing: 3px;
  color: var(--primary);
  text-transform: uppercase;
  width: fit-content;
}

/* Titre géant */
.hero-title {
  display: flex;
  flex-direction: column;
  line-height: 1;
  gap: 0;
}
.hero-title-cca {
  font-family: 'Outfit', sans-serif;
  font-size: 7rem;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: -2px;
}
.hero-title-league {
  font-family: 'Outfit', sans-serif;
  font-size: 4.5rem;
  font-weight: 800;
  text-transform: uppercase;
  color: var(--secondary);
  text-shadow: 0 0 30px rgba(255,215,0,.4);
  line-height: 1.05;
}

/* Sous-titre */
.hero-subtitle {
  font-size: 1.15rem;
  color: var(--text-muted);
  line-height: 1.8;
  max-width: 530px;
}

/* Barre de stats glassmorphic */
.hero-stats {
  display: flex;
  align-items: center;
  gap: 0;
  background: rgba(255,255,255,.05);
  border: 1px solid rgba(255,255,255,.12);
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
.stat-pill:first-child { padding-left: 0; }
.stat-pill:last-child  { padding-right: 0; }
.stat-icon { font-size: 1.6rem; }
.stat-val {
  font-family: 'Outfit', sans-serif;
  font-weight: 800;
  font-size: 1rem;
  color: white;
  white-space: nowrap;
}
.stat-lbl {
  font-size: .7rem;
  text-transform: uppercase;
  letter-spacing: .5px;
  color: var(--text-muted);
  white-space: nowrap;
}
.stat-divider {
  width: 1px;
  height: 36px;
  background: rgba(255,255,255,.15);
  flex-shrink: 0;
}

/* Boutons du hero */
.hero-actions { display: flex; gap: 18px; flex-wrap: wrap; }
.btn-hero { padding: 16px 40px; font-size: 1rem; }

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
  filter: drop-shadow(0 0 60px rgba(187,0,255,.35));
  pointer-events: none;
}

/* Flèche scroll */
.hero-scroll {
  position: absolute;
  bottom: 28px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 4;
  color: rgba(255,255,255,.5);
  font-size: .85rem;
  text-decoration: none;
  letter-spacing: 2px;
  animation: bob 2s ease-in-out infinite;
}
@keyframes bob { 0%,100% { transform: translateX(-50%) translateY(0); } 50% { transform: translateX(-50%) translateY(6px); } }

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
  font-family: 'Outfit', sans-serif;
  font-size: .7rem;
  font-weight: 800;
  letter-spacing: 5px;
  color: var(--primary);
  text-transform: uppercase;
  margin-bottom: 10px;
}
.label.centered { text-align: center; }
.section-title {
  font-size: 2.8rem;
  text-align: center;
  margin-bottom: 50px;
}

/* ── About ─────────────────────────────────────── */
.about-grid {
  display: grid;
  grid-template-columns: 0.8fr 1.2fr;
  gap: 80px;
  align-items: center;
}
.about-img { width: 100%; filter: drop-shadow(0 0 30px var(--primary-glow)); }
.about-text h2 { font-size: 2.4rem; margin-bottom: 24px; }
.about-text p  { color: var(--text-muted); font-size: 1.05rem; line-height: 1.8; margin-bottom: 18px; }
.highlights    { display: flex; flex-direction: column; gap: 12px; margin-top: 24px; }
.highlight     { display: flex; align-items: center; gap: 12px; font-weight: 500; }

/* ── Phases ────────────────────────────────────── */
.phases-grid {
  display: grid;
  grid-template-columns: repeat(3,1fr);
  gap: 30px;
}
.phase-card   { text-align: center; padding: 50px 28px; position: relative; overflow: hidden; }
.featured-card {
  border-color: var(--primary);
  background: linear-gradient(180deg, rgba(187,0,255,.08), rgba(10,11,18,.9));
}
.phase-img    { height: 80px; margin-bottom: 20px; }
.phase-num    {
  position: absolute; top: 14px; right: 18px;
  font-family: 'Outfit'; font-size: 3.5rem; font-weight: 900; opacity: .12; line-height: 1;
}
.phase-card h3 { font-size: 1.3rem; margin-bottom: 14px; }
.phase-card p  { color: var(--text-muted); line-height: 1.7; font-size: .95rem; }

/* ── Format ────────────────────────────────────── */
.format-section {
  display: grid;
  grid-template-columns: 1.2fr 0.8fr;
  align-items: center;
  gap: 60px;
  padding: 60px;
}
.format-left h2 { font-size: 2.5rem; margin-bottom: 28px; }
.format-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 36px;
}
.format-list li { display: flex; gap: 14px; color: var(--text-muted); align-items: flex-start; line-height: 1.6; }
.format-img { width: 100%; filter: drop-shadow(0 0 30px var(--primary-glow)); }

/* ── Rewards ───────────────────────────────────── */
.rewards-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 30px; }
.reward-card  { text-align: center; padding: 50px 28px; }
.reward-place { font-size: 3rem; margin-bottom: 16px; }
.reward-amount { font-family: 'Outfit'; font-size: 2rem; font-weight: 900; margin-bottom: 8px; }
.reward-label  { font-size: 1.1rem; font-weight: 700; margin-bottom: 8px; }
.reward-extra  { font-size: .85rem; color: var(--text-muted); }

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
  width: 100%; height: 100%;
  object-fit: cover;
  filter: brightness(.2) saturate(1.5);
  z-index: 0;
}
.cta-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to right, rgba(10,11,18,.9) 40%, rgba(10,11,18,.6) 100%);
  z-index: 1;
}
.cta-content {
  position: relative;
  z-index: 2;
  display: grid;
  grid-template-columns: 240px 1fr;
  align-items: center;
  padding: 60px;
  gap: 60px;
}
.cta-char { width: 100%; filter: drop-shadow(0 0 20px black); }
.cta-text h2 { font-size: 2.5rem; margin-bottom: 14px; line-height: 1.2; }
.cta-text p  { color: var(--text-muted); font-size: 1.1rem; margin-bottom: 30px; }
.cta-btns    { display: flex; gap: 20px; }

/* ══ RESPONSIVE ════════════════════════════════════ */
@media (max-width: 1100px) {
  .hero-body { padding: 0 40px; }
  .hero-title-cca { font-size: 5rem; }
  .hero-title-league { font-size: 3.5rem; }
  .hero-character { opacity: .5; max-width: 50%; }
  .page-body { padding: 80px 40px 100px; }
  .about-grid { grid-template-columns: 1fr; }
  .about-img-wrap { display: flex; justify-content: center; }
  .about-img { max-width: 280px; }
  .format-section { grid-template-columns: 1fr; }
  .cta-content { grid-template-columns: 1fr; text-align: center; }
  .cta-char { max-width: 180px; margin: 0 auto; }
  .cta-btns { justify-content: center; }
}

@media (max-width: 768px) {
  .hero-body { padding: 0 24px; max-width: 100%; }
  .hero-title-cca { font-size: 4rem; }
  .hero-title-league { font-size: 2.5rem; }
  .hero-character { display: none; }
  .hero-stats { width: 100%; justify-content: space-around; }
  .stat-divider { display: none; }
  .stat-pill { padding: 8px; }
  .phases-grid, .rewards-grid { grid-template-columns: 1fr; }
  .page-body { padding: 60px 20px 80px; gap: 60px; }
}
</style>
