<template>
  <!-- Footer riche — colonnes de liens + identité + copyright -->
  <footer class="app-footer">
    <div class="footer-inner">
      <!-- Colonne 1 : Identité -->
      <div class="footer-brand">
        <p class="footer-logo heading">
          CCA <span class="text-gold">National League</span>
        </p>
        <p class="footer-tagline">
          La compétition Clash of Clans la plus sérieuse du Cameroun.
        </p>
        <div class="footer-badge">⚔️ Saison 1 · Juillet 2026</div>
      </div>

      <!-- Colonne 2 : Navigation -->
      <div class="footer-col">
        <p class="footer-col-title">Navigation</p>
        <NuxtLink to="/" class="footer-link">Accueil</NuxtLink>
        <NuxtLink to="/rules" class="footer-link">Règlement Officiel</NuxtLink>
        <NuxtLink to="/clans" class="footer-link">Clans Inscrits</NuxtLink>
        <NuxtLink to="/tournaments" class="footer-link">Tournois</NuxtLink>
      </div>

      <!-- Colonne 3 : Participer -->
      <div class="footer-col">
        <p class="footer-col-title">Participer</p>
        <NuxtLink to="/register" class="footer-link"
          >Inscrire mon Clan</NuxtLink
        >
        <NuxtLink to="/login" class="footer-link">Se connecter</NuxtLink>
        <a href="#" class="footer-link">Paiement (Orange/MTN)</a>
      </div>

      <!-- Colonne 4 : Communauté -->
      <div class="footer-col">
        <p class="footer-col-title">Communauté</p>
        <a href="#" class="footer-link">📱 Groupe WhatsApp</a>
        <a href="#" class="footer-link">📲 Canal Telegram</a>
        <a href="/rules" class="footer-link">📜 Règlement</a>
        <a href="mailto:cca@tournoi.cm" class="footer-link">✉️ Contact Admin</a>
      </div>
    </div>

    <!-- Barre copyright -->
    <div class="footer-bottom">
      <span>© 2026 Cameroon Clash Association. Tous droits réservés.</span>
      <span class="footer-disclaimer">
        Ce site n'est pas affilié à Supercell. Clash of Clans est une marque
        déposée de Supercell Oy.
      </span>
    </div>
  </footer>
</template>

<style scoped>
.app-footer {
  background: rgba(10, 11, 18, 0.85);
  backdrop-filter: blur(16px);
  border-top: 1px solid var(--glass-border);
  margin-top: 80px;
}

.footer-inner {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  gap: 50px;
  max-width: 1400px;
  margin: 0 auto;
  padding: 60px 40px 40px;
}

/* Colonne identité */
.footer-logo {
  font-size: 1.3rem;
  color: white;
  margin-bottom: 12px;
}
.footer-tagline {
  color: var(--text-muted);
  font-size: 0.9rem;
  line-height: 1.6;
  margin-bottom: 20px;
}
.footer-badge {
  display: inline-block;
  padding: 6px 16px;
  background: rgba(187, 0, 255, 0.12);
  border: 1px solid rgba(187, 0, 255, 0.3);
  border-radius: 50px;
  font-size: 0.78rem;
  font-weight: 700;
  color: var(--primary);
  letter-spacing: 1px;
}

/* Colonnes de liens */
.footer-col {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.footer-col-title {
  font-family: "Outfit", sans-serif;
  font-size: 0.7rem;
  font-weight: 800;
  letter-spacing: 3px;
  text-transform: uppercase;
  color: var(--text-muted);
  margin-bottom: 6px;
}
.footer-link {
  color: var(--text-muted);
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 500;
  transition: color 0.2s;
}
.footer-link:hover {
  color: white;
}

/* Barre copyright */
.footer-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
  padding: 20px 40px;
  border-top: 1px solid var(--glass-border);
  max-width: 1400px;
  margin: 0 auto;
  font-size: 0.8rem;
  color: var(--text-muted);
}
.footer-disclaimer {
  text-align: right;
  font-size: 0.72rem;
  opacity: 0.6;
  max-width: 450px;
}

/* ── Responsive ───────────────────────────────── */
@media (max-width: 1024px) {
  .footer-inner {
    grid-template-columns: 1fr 1fr;
    gap: 40px;
    padding: 50px 30px 30px;
  }
  .footer-brand {
    grid-column: span 2;
  }
}

@media (max-width: 600px) {
  .footer-inner {
    grid-template-columns: 1fr;
    padding: 40px 24px 24px;
  }
  .footer-brand {
    grid-column: span 1;
  }
  .footer-bottom {
    flex-direction: column;
    text-align: center;
    padding: 20px 24px;
  }
  .footer-disclaimer {
    text-align: center;
    max-width: 100%;
  }
}
</style>
