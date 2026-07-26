<template>
  <div class="rules-page">
    <!-- ── EN-TÊTE ─────────────────────────────────── -->
    <section class="rules-header">
      <img src="/imagescoc/DragonEventDeco.webp" alt="" class="header-deco" aria-hidden="true" />
      <div class="section-label">DOCUMENT OFFICIEL · CCA NATIONAL LEAGUE</div>
      <h1 class="heading">
        <span class="text-gradient-purple text-xl">Règlement</span>
        <span class="text-gold text-xl"> Officiel</span>
      </h1>
      <p class="header-sub">
        Version 1.0 — Saison 2026 · Dernière mise à jour : Juin 2026<br />
        Ce document constitue le cadre légal de la compétition. Chaque clan
        participant s'engage à en respecter l'intégralité.
      </p>
      <!-- Table des matières rapide -->
      <nav class="toc">
        <a href="#eligibility">1. Éligibilité</a>
        <span>·</span>
        <a href="#inscription">2. Inscriptions</a>
        <span>·</span>
        <a href="#composition">3. Composition</a>
        <span>·</span>
        <a href="#format">4. Format</a>
        <span>·</span>
        <a href="#match">5. Déroulement</a>
        <span>·</span>
        <a href="#resultats">6. Résultats</a>
        <span>·</span>
        <a href="#arbitrage">7. Arbitrage</a>
        <span>·</span>
        <a href="#sanctions">8. Sanctions</a>
        <span>·</span>
        <a href="#cashprize">9. Cashprize</a>
      </nav>
    </section>

    <!-- ── CORPS DU RÈGLEMENT ─────────────────────── -->
    <div class="rules-body">
      <!-- 1. ÉLIGIBILITÉ -->
      <article id="eligibility" class="glass-card rule-block">
        <div class="rule-num text-gradient-purple">01</div>
        <img src="/imagescoc/badge 1.webp" alt="" class="rule-icon" />
        <div class="rule-content">
          <h2 class="text-gold">Éligibilité des Clans & Joueurs</h2>
          <ul>
            <li>
              Le tournoi est ouvert à
              <strong>tout clan Clash of Clans</strong> dont les membres
              sont Camerounais.
            </li>
            <li>
              Le clan doit être au <strong>d'origine camerounaise</strong> dans le jeu
              au moment de l'inscription.
            </li>
            <li>
              Chaque joueur doit posséder une base
              <strong>HDV 14 minimum</strong> pour être éligible à participer au tournoi.
            </li>
            <li>
              Les
              <strong>titulaires doivent couvrir les HDV 14, 15, 16, 17 et 18</strong>
              (un joueur par niveau).
            </li>
            <li>
              Un joueur ne peut être inscrit que dans
              <strong>un seul clan</strong> par saison.
            </li>
            <li>
              Le rôle de capitaine est attribué au joueurs par
              <strong>l'administrateur de la plateforme</strong>
               
            </li>
        
          </ul>
        </div>
      </article>

      <!-- 2. INSCRIPTIONS -->
      <article id="inscription" class="glass-card rule-block featured">
        <div class="rule-num text-gold">02</div>
        <img src="/imagescoc/badge 2.webp" alt="" class="rule-icon" />
        <div class="rule-content">
          <h2 class="text-gold">Processus d'Inscription (4 Étapes)</h2>

          <div class="phase-block">
            <p class="phase-title">
              <LucidePin :size="18" class="inline mr-1" /> Étape 1 — Éligibilité du Clan (Vérification API)
            </p>
            <ul>
              <li>
                Le système vérifie l'origine du clan en temps réel (Cameroun
                requis).
              </li>
              <li>
                Le joueur initiant l'inscription doit être
                <strong>HDV 14 minimum</strong>.
              </li>
              <li>
                L'éligibilité est confirmée instantanément avant de passer au
                vote.
              </li>
            </ul>
          </div>

          <div class="phase-block">
            <p class="phase-title">
              <LucidePin :size="18" class="inline mr-1" /> Étape 2 — Élection du Capitaine 
            </p>
            <ul>
              <li>
                Tout joueur pourra être capitaine si ce dernier a été designé
                par les membre de son clan .
              </li>
              <li>
                les membres du clan devrons informer l'administrateur(whatsapp)
                pour le choix de leur capitaine.
              </li>
              <li>
                À l'issue de cette decision l'administrateur attribuera le rôle
                de capitaine au joueur concerné.
              </li>
            </ul>
          </div>

          <div class="phase-block">
            <p class="phase-title">
              <LucidePin :size="18" class="inline mr-1" /> Étape 3 — Roster & Composition (Capitaine)
            </p>
            <ul>
              <li>
                Le Capitaine élu sélectionne les
                <strong>5 titulaires + 5 remplaçants</strong>.
              </li>
              <li>
                Il doit s'assurer que son équipe couvre les paliers HDV requis.
              </li>
              <li>
                Une fois validé, le clan est officiellement inscrit et envoyé aux administrateurs pour validation
              </li>
            </ul>
          </div>

          <div class="phase-block">
            <p class="phase-title">
              <LucidePin :size="18" class="inline mr-1" /> Étape 4 — Validation & Confirmation
            </p>
            <ul>
              <li>
                Chaque joueur titulaire doit valider sa participation sur la
                plateforme.
              </li>
              <li>
                Un administrateur CCA vérifie la composition et valide l'équipe
                sous 24h.
              </li>
              <li>
                Dès que les 5 titulaires sont validés, l'équipe est
                <strong>"Confirmée"</strong> pour la compétition.
              </li>
            </ul>
          </div>
        </div>
      </article>

      <!-- 3. COMPOSITION -->
      <article id="composition" class="glass-card rule-block">
        <div class="rule-num text-gradient-purple">03</div>
        <img src="/imagescoc/all heros.webp" alt="" class="rule-icon" />
        <div class="rule-content">
          <h2 class="text-gold">Composition de l'Équipe</h2>
          <ul>
            <li>
              Chaque équipe comprend <strong>5 titulaires obligatoires</strong>,
              un par niveau HDV (14, 15, 16, 17, 18).
            </li>
            <li>
              Jusqu'à <strong>5 remplaçants</strong> peuvent être enregistrés,
              de HDV 14 minimum.
            </li>
            <li>
              Un remplaçant ne peut entrer en jeu que si le titulaire de son HDV
              est indisponible.
            </li>
            <li>
              Aucun remplacement n'est autorisé
              <strong>après le debut d'un match</strong>.
            </li>
            <li>
              En cas de désistement d'un titulaire avant le match, le capitaine
              doit notifier l'arbitre <strong>au moins 1h à l'avance</strong>.
            </li>
          </ul>
        </div>
      </article>

      <!-- 4. FORMAT DU TOURNOI -->
      <article id="format" class="glass-card rule-block featured">
        <div class="rule-num text-gold">04</div>
        <img src="/imagescoc/machine de combat.webp" alt="" class="rule-icon rule-icon-lg" />
        <div class="rule-content">
          <h2 class="text-gold">Format du Tournoi</h2>
          <ul>
            <li>
              <strong>16 clans</strong> en phase de groupes → Élimination
              directe (bracket).
            </li>
            <li>
              Structure :
              <strong>8e de finale → Quarts → Demi-finales → Finale</strong>.
            </li>
            <li>
              Chaque rencontre = <strong>1 Guerre Amicale 5v5</strong> sur Clash
              of Clans.
            </li>
            <li>
              Le clan désigné "Hôte" par le système envoie l'invitation de
              guerre amicale.
            </li>
            <li>Durée de préparation : <strong>15 minutes</strong>.</li>
            <li>Durée de la guerre : <strong>1 heure</strong>.</li>
            <li>
              En cas d'égalité de score :
              <strong>nombre d'étoiles</strong> total, puis
              <strong>dommages infligés</strong>.
            </li>
            <li>
              Si toujours égalité : l'équipe gagnante est celle qui a fait le  <strong>moins de temps en attaque</strong>.
            </li>
          </ul>
        </div>
      </article>

      <!-- 5. DÉROULEMENT D'UN MATCH -->
      <article id="match" class="glass-card rule-block">
        <div class="rule-num text-gradient-purple">05</div>
        <img src="/imagescoc/grand gardien skin.webp" alt="" class="rule-icon" />
        <div class="rule-content">
          <h2 class="text-gold">Déroulement d'un Match</h2>
          <ul>
            <li>
              Les matchs sont planifiés par les administrateurs CCA et publiés
              sur la plateforme.
            </li>
            <li>
              Le capitaine hôte dispose de <strong>10 minutes</strong> après
              l'heure prévue pour lancer la guerre amicale.
            </li>
            <li>
              Le capitaine adverse dispose de <strong>10 minutes</strong> pour
              accepter la guerre.
            </li>
            <li>
              Tout dépassement non justifié entraîne un
              <strong>forfait</strong> pour le clan fautif.
            </li>
            <li>
              Les joueurs doivent utiliser
              <strong>leurs bases CoC enregistrées enregistré dans la plateforme</strong>. Toute substitution
              non déclarée est sanctionnée.
            </li>
            <li>
              Les attaques doivent être effectuées dans le temps imparti. Les
              attaques non lancées ne sont pas reportées.
            </li>
          </ul>
        </div>
      </article>

  

      <!-- 7. ARBITRAGE & LITIGES -->
      <article id="arbitrage" class="glass-card rule-block featured">
        <div class="rule-num text-gold">06</div>
        <img src="/imagescoc/badge 1.webp" alt="" class="rule-icon" />
        <div class="rule-content">
          <h2 class="text-gold">Arbitrage & Gestion des Litiges</h2>
          <ul>
            <li>
              Un arbitre officiel CCA valide chaque résultat sur la base des
              <strong>preuves soumises</strong>.
            </li>
            <li>
              Un capitaine peut déposer une
              <strong>réclamation officielle</strong> dans les
              <strong>24h</strong> suivant la validation d'un match.
            </li>
            <li>
              La réclamation doit être accompagnée de
              <strong>screenshots ou vidéos de preuve</strong>.
            </li>
            <li>
              L'arbitre CCA statue de manière
              <strong>définitive et irrévocable</strong>.
            </li>
            <li>
              Si la tricherie est avérée, le clan fautif est éliminé et remplacé
              par le suivant sur la liste d'attente.
            </li>
            <li>
              Toute tentative d'influencer ou d'intimider un arbitre entraîne
              une <strong>exclusion définitive de la saison</strong>.
            </li>
          </ul>
        </div>
      </article>

      <!-- 8. FAIR-PLAY & SANCTIONS -->
      <article id="sanctions" class="glass-card rule-block">
        <div class="rule-num text-gradient-purple">07</div>
        <img src="/imagescoc/skin barbarian.webp" alt="" class="rule-icon" />
        <div class="rule-content">
          <h2 class="text-gold">Fair-play & Sanctions</h2>
          <div class="warning-box">
            ⚠️ La CCA applique une politique de
            <strong>tolérance zéro</strong> contre la triche et le comportement
            toxique.
          </div>
          <ul>
            <li>
              <strong>Triche (logiciels tiers, comptes partagés)</strong> →
              Élimination immédiate + bannissement 1 saison.
            </li>
            <li>
              <strong>Comportement toxique/insultant</strong> → Avertissement
              formel, puis exclusion de la saison si récidive.
            </li>
            <li>
              <strong>Forfait injustifié</strong> → Défaite enregistrée et
              avertissement official.
            </li>
            <li>
              <strong>2 forfaits</strong> dans la compétition → Exclusion du
              tournoi sans remboursement.
            </li>
            <li>
              <strong>Non-respect des délais</strong> de soumission → Pénalité
              de points ou forfait selon la gravité.
            </li>
            <li>
              Toute décision de sanction est
              <strong>notifiée par écrit</strong> au capitaine concerné via la
              plateforme.
            </li>
          </ul>
        </div>
      </article>

      <!-- 9. CASHPRIZE & RÉCOMPENSES -->
      <article id="cashprize" class="glass-card rule-block featured">
        <div class="rule-num text-gold">09</div>
        <img src="/imagescoc/badge 2.webp" alt="" class="rule-icon" />
        <div class="rule-content">
          <h2 class="text-gold">Cashprize & Récompenses</h2>
          <div class="rewards-table">
            <div class="reward-row gold">
              <span class="r-place">
                <LucideTrophy :size="18" class="inline mr-1 text-yellow-500" /> 1er — Champion CCA
              </span>
              <span class="r-prize">50 000 FCFA</span>
              <span class="r-bonus">+ Trophée officiel & Badge Numérique Champion</span>
            </div>
            <div class="reward-row silver">
              <span class="r-place">
                <LucideMedal :size="18" class="inline mr-1 text-gray-300" /> 2ème — Finaliste
              </span>
              <span class="r-prize">20 000 FCFA</span>
              <span class="r-bonus">+ Badge Numérique Finaliste</span>
            </div>
            <div class="reward-row bronze">
              <span class="r-place">
                <LucideMedal :size="18" class="inline mr-1 text-orange-600" /> 3ème — Semi-Finaliste
              </span>
              <span class="r-prize">10 000 FCFA</span>
              <span class="r-bonus">+ Badge Numérique Semi-Finaliste</span>
            </div>
          </div>
          <ul>
            <li>
              Le cashprize est distribué via <strong>Mobile Money</strong> dans
              les <strong>7 jours</strong> suivant la finale.
            </li>
            <li>
              En cas de disqualification après la finale (tricherie avérée), le
              prix passe au suivant.
            </li>
            <li>
              La CCA se réserve le droit d'ajouter des récompenses en cours de
              saison selon les sponsors.
            </li>
          </ul>
        </div>
      </article>
    </div>
    <!-- /rules-body -->

    <!-- ── CTA ────────────────────────────────────── -->
    <section class="rules-cta glass-card">
      <img src="/imagescoc/skin barbarian.webp" alt="" class="cta-char" />
      <div class="cta-text">
        <h2>
          Vous avez tout lu. Vous êtes <span class="text-gold">prêts</span>.
        </h2>
        <p>
          Engagez votre clan et rejoignez les 16 élus de la CCA National League
          Saison 1.
        </p>
        <div class="cta-btns">
          <NuxtLink :to="ctaTo" class="btn-premium btn-primary">⚔️ {{ ctaLabel }}</NuxtLink>
          <NuxtLink to="/" class="btn-premium btn-outline">← Accueil</NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
definePageMeta({ layout: "default" });

const { ctaLabel, ctaTo } = useTournamentCta();

useHead({
  title: "Règlement Officiel | CCA National League 🇨🇲",
  meta: [
    {
      name: "description",
      content:
        "Règlement complet et transparent de la CCA National League Saison 1 : éligibilité des joueurs, frais d'inscription MTN/Orange Money, format 5v5, arbitrage, sanctions et cashprize de 50.000Fcfa.",
    },
    {
      name: "keywords",
      content:
        "règles cca, règlement tournoi coc, clash of clans cameroun, coc cameroun, cgc, tournoi camerounais clash of clan",
    },
    {
      property: "og:title",
      content: "Règlement Officiel — CCA National League saison 1 📜",
    },
    {
      property: "og:description",
      content:
        "Prenez connaissance des règles officielles du tournoi Clash of Clans de la Cameroon Clash Association.",
    },
    {
      property: "og:image",
      content: "/images/cca-affiche1.png",
    },
  ],
});
</script>

<style scoped>
/* ── PAGE ─────────────────────────────────────── */
.rules-page {
  display: flex;
  flex-direction: column;
  gap: 60px;
  padding: 40px 0 100px;
}

/* ── EN-TÊTE ──────────────────────────────────── */
.rules-header {
  text-align: center;
  position: relative;
  padding-bottom: 40px;
  border-bottom: 1px solid var(--glass-border);
}

.header-deco {
  position: absolute;
  top: -20px;
  right: 0;
  height: 160px;
  opacity: 0.5;
  filter: drop-shadow(0 0 10px var(--primary-glow));
}

.section-label {
  font-size: 0.7rem;
  font-weight: 800;
  letter-spacing: 4px;
  color: var(--primary);
  text-transform: uppercase;
  margin-bottom: 14px;
}

.rules-header h1 {
  font-size: 4rem;
  margin-bottom: 18px;
}

.header-sub {
  color: var(--text-muted);
  max-width: 700px;
  margin: 0 auto 28px;
  line-height: 1.8;
  font-size: 1rem;
}

.toc {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  font-size: 0.85rem;
}

.toc a {
  color: var(--text-muted);
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s;
}

.toc a:hover {
  color: var(--secondary);
}

.toc span {
  color: var(--glass-border);
}

/* ── CORPS ────────────────────────────────────── */
.rules-body {
  display: flex;
  flex-direction: column;
  gap: 40px;
}

/* ── CARTE DE RÈGLE ───────────────────────────── */
.rule-block {
  display: grid;
  grid-template-columns: 60px 120px 1fr;
  align-items: start;
  gap: 30px;
  padding: 24px;
  position: relative;
}

.rule-block.featured {
  border-color: var(--primary);
  background: linear-gradient(135deg,
      rgba(187, 0, 255, 0.06) 0%,
      rgba(10, 11, 18, 0.9) 100%);
}

.rule-num {
  font-family: var(--font-heading);
  font-size: 3.5rem;
  font-weight: 700;
  line-height: 1;
  opacity: 0.25;
  align-self: start;
}

.rule-icon {
  width: 100%;
  filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.15));
}

.rule-icon-lg {
  transform: scale(1.2);
  margin-top: -10px;
}

.rule-content h2 {
  font-size: 1.6rem;
  margin-bottom: 20px;
}

.rule-content ul {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.rule-content li {
  position: relative;
  padding-left: 16px;
  color: var(--text-muted);
  line-height: 1.7;
  font-size: 0.98rem;
}

.rule-content li::before {
  content: "🛡️";
  position: absolute;
  left: 0;
  top: 1px;
  font-size: 0.85rem;
}

.rule-content li strong {
  color: white;
}

.rule-content li em {
  color: var(--secondary);
  font-style: normal;
}

/* Bloc phase (dans article 2) */
.phase-block {
  margin-bottom: 24px;
  border-left: 3px solid var(--primary);
  padding-left: 8px;
}

.phase-title {
  font-family: var(--font-ui);
  font-weight: 700;
  font-size: 1.1rem;
  color: white;
  margin-bottom: 12px;
}

/* Avertissement */
.warning-box {
  background: rgba(255, 75, 75, 0.1);
  border: 1px solid rgba(255, 75, 75, 0.3);
  color: #ff8888;
  padding: 14px 18px;
  border-radius: var(--radius-sm);
  margin-bottom: 20px;
  font-size: 0.95rem;
  line-height: 1.6;
}

/* Tableau cashprize */
.rewards-table {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 24px;
}

.reward-row {
  display: grid;
  grid-template-columns: 2fr 1.2fr 2fr;
  gap: 12px;
  align-items: center;
  padding: 14px 18px;
  border-radius: var(--radius-sm);
  font-size: 0.95rem;
}

.reward-row.gold {
  background: rgba(255, 215, 0, 0.1);
  border: 1px solid rgba(255, 215, 0, 0.3);
}

.reward-row.silver {
  background: rgba(192, 192, 192, 0.1);
  border: 1px solid rgba(192, 192, 192, 0.3);
}

.reward-row.bronze {
  background: rgba(205, 127, 50, 0.1);
  border: 1px solid rgba(205, 127, 50, 0.3);
}

.r-place {
  font-weight: 700;
  color: white;
}

.r-prize {
  font-family: var(--font-heading);
  font-weight: 700;
  font-size: 1.1rem;
  color: var(--secondary);
}

.reward-row.silver .r-prize {
  color: #c0c0c0;
}

.reward-row.bronze .r-prize {
  color: #cd7f32;
}

.r-bonus {
  color: var(--text-muted);
  font-size: 0.85rem;
}

/* ── CTA FINAL ────────────────────────────────── */
.rules-cta {
  display: grid;
  grid-template-columns: 220px 1fr;
  align-items: center;
  gap: 50px;
  padding: 50px 60px;
  margin-top: 20px;
  border-color: var(--secondary);
}

.cta-char {
  width: 100%;
  filter: drop-shadow(0 0 20px var(--primary-glow));
}

.cta-text h2 {
  font-size: 2.2rem;
  margin-bottom: 14px;
}

.cta-text p {
  color: var(--text-muted);
  margin-bottom: 28px;
  line-height: 1.7;
}

.cta-btns {
  display: flex;
  gap: 18px;
  flex-wrap: wrap;
}

/* ── RESPONSIVE ───────────────────────────────── */
@media (max-width: 900px) {
  .rule-block {
    grid-template-columns: 1fr;
    text-align: center;
  }

  .rule-num {
    font-size: 2.5rem;
  }

  .rule-icon {
    max-width: 100px;
    margin: 0 auto;
  }

  .rule-content li {
    text-align: left;
  }

  .reward-row {
    grid-template-columns: 1fr;
    text-align: center;
    gap: 6px;
  }

  .rules-cta {
    grid-template-columns: 1fr;
    text-align: center;
  }

  .cta-char {
    max-width: 150px;
    margin: 0 auto;
  }

  .cta-btns {
    justify-content: center;
  }

  .header-deco {
    display: none;
  }
}
</style>
