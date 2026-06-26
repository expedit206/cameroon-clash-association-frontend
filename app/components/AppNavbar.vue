<template>
  <!-- ══════════════════════════════════════════════
       NAVBAR — Composant réutilisable & responsive
       Usage: <AppNavbar :overlay="true" /> pour le hero home
  ══════════════════════════════════════════════ -->
  <nav :class="['app-navbar', { 'is-overlay': overlay, 'is-open': menuOpen }]">
    <div class="nav-inner">
      <!-- Logo -->
      <NuxtLink to="/" class="nav-logo heading" @click="menuOpen = false">
        CCA <span class="text-gold">NL</span>
      </NuxtLink>

      <!-- Liens desktop (cachés < 768px) -->
      <div class="nav-links-desktop">
        <NuxtLink to="/" class="nav-link" exact-active-class="active"
          >Accueil</NuxtLink
        >
        <NuxtLink to="/rules" class="nav-link" active-class="active"
          >Règlement</NuxtLink
        >
        <NuxtLink to="/clans" class="nav-link" active-class="active"
          >Clans NL</NuxtLink
        >
        <NuxtLink to="/clans/cameroun" class="nav-link" active-class="active"
          >Clans 🇨🇲</NuxtLink
        >
        <NuxtLink to="/tournaments" class="nav-link" active-class="active"
          >Tournois</NuxtLink
        >
      </div>

      <!-- Actions desktop -->
      <div class="nav-actions-desktop">
        <template v-if="!isLoggedIn">
          <NuxtLink to="/login" class="nav-link" active-class="active"
            >Connexion</NuxtLink
          >
          <NuxtLink to="/register" class="btn-premium btn-primary btn-sm"
            >S'inscrire</NuxtLink
          >
        </template>
        <template v-else>
          <!-- Mon Clan : uniquement pour joueurs et capitaines -->
          <NuxtLink
            v-if="showMyClan"
            to="/my-clan"
            class="nav-link"
            active-class="active"
            >Mon Clan</NuxtLink
          >

          <!-- Dashboard : absent pour les joueurs simples sans clan -->
          <NuxtLink
            v-if="dashboardPath"
            :to="dashboardPath"
            class="nav-link text-gold"
            active-class="active"
          >
            {{ dashboardLabel }}
          </NuxtLink>

          <!-- Admin Panel (lien direct, si admin) -->
          <NuxtLink
            v-if="user?.role === 'admin'"
            to="/admin/clans"
            class="nav-link"
            active-class="active"
            >Modération</NuxtLink
          >

          <!-- Avatar utilisateur → lien profil + dropdown déconnexion -->
          <div
            class="user-avatar-wrapper"
            :class="{ 'dropdown-open': dropdownOpen }"
          >
            <button
              class="user-avatar-btn"
              @click="dropdownOpen = !dropdownOpen"
              aria-label="Mon profil"
            >
              <!-- Icône de ligue CoC -->
              <img
                v-if="user?.league_icon"
                :src="user.league_icon"
                class="league-icon-nav"
                alt="Ligue"
              />
              <div v-else class="avatar-initials" :class="roleBadgeClass">
                {{ user?.name?.charAt(0)?.toUpperCase() || "?" }}
              </div>
              <div class="avatar-text">
                <span class="avatar-name">{{ user?.name }}</span>
                <span class="avatar-tag">{{ user?.tag_coc }}</span>
              </div>
              <span class="avatar-chevron">▾</span>
            </button>

            <!-- Dropdown menu -->
            <Transition name="dropdown">
              <div v-if="dropdownOpen" class="avatar-dropdown">
                <div class="dropdown-header">
                  <span class="role-badge" :class="roleBadgeClass">{{
                    roleLabel
                  }}</span>
                </div>
                <NuxtLink
                  to="/profile"
                  class="dropdown-item"
                  @click="dropdownOpen = false"
                >
                  👤 Mon Profil
                </NuxtLink>
                <div class="dropdown-divider"></div>
                <button class="dropdown-item danger" @click="handleLogout">
                  🚪 Déconnexion
                </button>
              </div>
            </Transition>
          </div>
        </template>
      </div>

      <!-- Bouton hamburger (visible < 768px) -->
      <button
        class="hamburger"
        :class="{ open: menuOpen }"
        @click="menuOpen = !menuOpen"
        aria-label="Toggle navigation"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>
    </div>

    <!-- Menu mobile déroulant -->
    <Transition name="menu">
      <div v-if="menuOpen" class="nav-mobile-drawer">
        <NuxtLink to="/" class="mobile-link" @click="menuOpen = false"
          >🏠 Accueil</NuxtLink
        >
        <NuxtLink to="/rules" class="mobile-link" @click="menuOpen = false"
          >📜 Règlement</NuxtLink
        >
        <NuxtLink to="/clans" class="mobile-link" @click="menuOpen = false"
          >🛡️ Clans NL</NuxtLink
        >
        <NuxtLink
          to="/clans/cameroun"
          class="mobile-link"
          @click="menuOpen = false"
          >🇨🇲 Clans Cameroun</NuxtLink
        >
        <NuxtLink
          to="/tournaments"
          class="mobile-link"
          @click="menuOpen = false"
          >⚔️ Tournois</NuxtLink
        >
        <div class="mobile-divider"></div>
        <template v-if="!isLoggedIn">
          <NuxtLink to="/login" class="mobile-link" @click="menuOpen = false"
            >🔑 Connexion</NuxtLink
          >
          <NuxtLink
            to="/register"
            class="btn-premium btn-primary mobile-cta"
            @click="menuOpen = false"
          >
            S'inscrire maintenant
          </NuxtLink>
        </template>
        <template v-else>
          <!-- Identité mobile -->
          <div class="mobile-identity">
            <span class="role-badge" :class="roleBadgeClass">{{
              roleLabel
            }}</span>
            <span class="user-tag">{{ user?.tag_coc }}</span>
          </div>

          <!-- Mon Clan (joueur/capitaine uniquement) -->
          <NuxtLink
            v-if="showMyClan"
            to="/my-clan"
            class="mobile-link"
            @click="menuOpen = false"
            >🏰 Mon Clan</NuxtLink
          >

          <!-- Dashboard -->
          <NuxtLink
            v-if="dashboardPath"
            :to="dashboardPath"
            class="mobile-link text-gold"
            @click="menuOpen = false"
          >
            🏠 {{ dashboardLabel }}
          </NuxtLink>

          <!-- Liens admin supplémentaires -->
          <template v-if="user?.role === 'admin'">
            <NuxtLink
              to="/admin/users"
              class="mobile-link"
              @click="menuOpen = false"
              >👥 Modérer les joueurs</NuxtLink
            >
            <NuxtLink
              to="/admin/clans"
              class="mobile-link"
              @click="menuOpen = false"
              >🛡️ Modérer les clans</NuxtLink
            >
            <NuxtLink
              to="/admin/registrations"
              class="mobile-link"
              @click="menuOpen = false"
              >📋 Inscriptions</NuxtLink
            >
          </template>

          <button @click="logout" class="mobile-link text-red">
            🚪 Déconnexion
          </button>
        </template>
      </div>
    </Transition>
  </nav>
</template>

<script setup>
/* Props */
defineProps({
  /** true = position absolue (par-dessus le hero full-screen) */
  overlay: { type: Boolean, default: false },
});

const { user, isLoggedIn, logout } = useAuth();
const menuOpen = ref(false);
const dropdownOpen = ref(false);

/* Fermer le menu lors d'une navigation */
const route = useRoute();
watch(
  () => route.path,
  () => {
    menuOpen.value = false;
    dropdownOpen.value = false;
  },
);

const handleLogout = async () => {
  dropdownOpen.value = false;
  await logout();
};

/**
 * Lien Dashboard adapté au rôle :
 * - admin    → /admin/dashboard
 * - captain  → /dashboard
 * - referee  → /dashboard
 * - player   → null (pas de dashboard, redirection évitée)
 */
const dashboardPath = computed(() => {
  if (!user.value) return null;
  if (user.value.role === "admin") return "/admin/dashboard";
  if (user.value.role === "captain") return "/dashboard";
  if (user.value.role === "referee") return "/dashboard";
  return null; // joueur simple : pas de lien dashboard (évite la redirection confuse)
});

/** Label du lien Dashboard selon le rôle */
const dashboardLabel = computed(() => {
  if (user.value?.role === "admin") return "Panel Admin";
  if (user.value?.role === "referee") return "Arbitrage";
  return "Mon Arène";
});

/** Afficher "Mon Clan" uniquement pour les rôles pertinents */
const showMyClan = computed(
  () => isLoggedIn.value && ["player", "captain"].includes(user.value?.role),
);

/** Badge texte du rôle */
const roleLabel = computed(() => {
  const labels = {
    player: "Joueur",
    captain: "Capitaine",
    referee: "Arbitre",
    admin: "Admin",
  };
  return labels[user.value?.role] || user.value?.role;
});

/** Classe CSS du badge selon le rôle */
const roleBadgeClass = computed(() => {
  const classes = {
    player: "role-player",
    captain: "role-captain",
    referee: "role-referee",
    admin: "role-admin",
  };
  return classes[user.value?.role] || "";
});
</script>

<style scoped>
/* ── Base navbar ─────────────────────────────────── */

/* ── User identity (desktop) ──────────────────── */
.user-info {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 2px;
}

.user-tag {
  font-size: 0.72rem;
  color: var(--text-muted);
  font-family: monospace;
  letter-spacing: 0.5px;
}

/* ── User Avatar Dropdown (Desktop) ───────────── */
.user-avatar-wrapper {
  position: relative;
  margin-left: 10px;
}

.user-avatar-btn {
  display: flex;
  align-items: center;
  gap: 12px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--glass-border);
  padding: 6px 14px 6px 8px;
  border-radius: 40px;
  cursor: pointer;
  transition: all 0.3s ease;
  color: white;
}

.user-avatar-btn:hover,
.dropdown-open .user-avatar-btn {
  background: rgba(255, 255, 255, 0.1);
  border-color: var(--primary-glow);
  box-shadow: 0 0 15px rgba(212, 175, 55, 0.1);
}

.league-icon-nav {
  width: 32px;
  height: 32px;
  object-fit: contain;
  filter: drop-shadow(0 0 5px rgba(0, 0, 0, 0.5));
}

.avatar-initials {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 0.9rem;
}

.avatar-text {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  line-height: 1.2;
}

.avatar-name {
  font-size: 0.85rem;
  font-weight: 600;
  max-width: 100px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.avatar-tag {
  font-size: 0.65rem;
  color: var(--text-muted);
  font-family: monospace;
}

.avatar-chevron {
  font-size: 0.7rem;
  color: var(--text-muted);
  transition: transform 0.3s ease;
}

.dropdown-open .avatar-chevron {
  transform: rotate(180deg);
}

/* Dropdown Menu */
.avatar-dropdown {
  position: absolute;
  top: calc(100% + 12px);
  right: 0;
  width: 200px;
  background: #0f111a;
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-md);
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.6);
  padding: 8px;
  z-index: 300;
  transform-origin: top right;
}

.dropdown-header {
  padding: 8px 12px 12px;
  border-bottom: 1px solid var(--glass-border);
  margin-bottom: 8px;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 10px 14px;
  border-radius: var(--radius-sm);
  color: var(--text-muted);
  text-decoration: none;
  font-size: 0.9rem;
  transition: all 0.2s;
  border: none;
  background: transparent;
  cursor: pointer;
  text-align: left;
}

.dropdown-item:hover {
  background: rgba(255, 255, 255, 0.05);
  color: white;
}

.dropdown-item.danger {
  color: #f87171;
}

.dropdown-item.danger:hover {
  background: rgba(248, 113, 113, 0.1);
}

.dropdown-divider {
  height: 1px;
  background: var(--glass-border);
  margin: 6px 0;
}

/* Animation Dropdown */
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.2s ease;
}
.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-10px) scale(0.95);
}

/* Badge de rôle */
.role-badge {
  font-size: 0.68rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  padding: 2px 8px;
  border-radius: 20px;
  border: 1px solid currentColor;
}

.role-player {
  color: #94a3b8;
  border-color: #94a3b830;
  background: #94a3b810;
}
.role-captain {
  color: var(--primary);
  border-color: var(--primary-glow);
  background: rgba(212, 175, 55, 0.1);
}
.role-referee {
  color: #818cf8;
  border-color: #818cf830;
  background: #818cf810;
}
.role-admin {
  color: #f87171;
  border-color: #f8717130;
  background: #f8717110;
}

/* Identité mobile */
.mobile-identity {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 10px;
  background: rgba(255, 255, 255, 0.03);
  border-radius: var(--radius-sm);
  margin-bottom: 4px;
}

.app-navbar {
  position: sticky;
  top: 10px;
  left: 20px;
  right: 20px;
  margin: 10px 20px;
  z-index: 200;
  border-radius: var(--radius-md);
  background: rgba(10, 11, 18, 0.75);
  backdrop-filter: blur(16px);
  border: 1px solid var(--glass-border);
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.4);
  transition: all 0.3s ease;
  overflow: hidden; /* pour le drawer */
}

/* En mode overlay (position absolute sur le hero) */
.app-navbar.is-overlay {
  position: absolute;
  top: 16px;
  left: 20px;
  right: 20px;
  margin: 0;
}

/* ── Ligne principale ────────────────────────────── */
.nav-inner {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 28px;
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
}

/* Logo */
.nav-logo {
  font-size: 1.3rem;
  text-decoration: none;
  color: white;
  flex-shrink: 0;
  letter-spacing: 1px;
}

/* Liens desktop */
.nav-links-desktop {
  display: flex;
  gap: 28px;
}

.nav-link {
  color: var(--text-muted);
  text-decoration: none;
  font-weight: 500;
  font-size: 0.93rem;
  padding: 4px 0;
  position: relative;
  transition: color 0.25s;
}

.nav-link::after {
  content: "";
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 0;
  height: 2px;
  background: var(--primary);
  transition: width 0.25s;
  border-radius: 2px;
}

.nav-link:hover,
.nav-link.active {
  color: white;
}

.nav-link.active::after {
  width: 100%;
}

/* Actions desktop */
.nav-actions-desktop {
  display: flex;
  align-items: center;
  gap: 18px;
}

.btn-sm {
  padding: 9px 22px;
  font-size: 0.88rem;
}

/* ── Hamburger ───────────────────────────────────── */
.hamburger {
  display: none; /* Caché sur desktop */
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 5px;
  width: 40px;
  height: 40px;
  background: transparent;
  border: 1px solid var(--glass-border);
  border-radius: 8px;
  cursor: pointer;
  padding: 8px 7px;
  flex-shrink: 0;
}

.hamburger span {
  display: block;
  width: 100%;
  height: 2px;
  background: white;
  border-radius: 2px;
  transition: all 0.3s ease;
  transform-origin: center;
}

/* Animation → X */
.hamburger.open span:nth-child(1) {
  transform: translateY(7px) rotate(45deg);
}
.hamburger.open span:nth-child(2) {
  opacity: 0;
  transform: scaleX(0);
}
.hamburger.open span:nth-child(3) {
  transform: translateY(-7px) rotate(-45deg);
}

/* ── Drawer mobile ───────────────────────────────── */
.nav-mobile-drawer {
  display: flex;
  flex-direction: column;
  padding: 10px 24px 24px;
  border-top: 1px solid var(--glass-border);
  gap: 4px;
}

.mobile-link {
  color: var(--text-muted);
  text-decoration: none;
  font-size: 1rem;
  font-weight: 500;
  padding: 12px 10px;
  border-radius: var(--radius-sm);
  transition: all 0.2s;
}

.mobile-link:hover {
  color: white;
  background: rgba(255, 255, 255, 0.06);
}

.mobile-divider {
  height: 1px;
  background: var(--glass-border);
  margin: 8px 0;
}

.mobile-cta {
  margin-top: 10px;
  text-align: center;
  justify-content: center;
}

/* ── Animation drawer ────────────────────────────── */
.menu-enter-active,
.menu-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
}
.menu-enter-from,
.menu-leave-to {
  max-height: 0;
  opacity: 0;
}
.menu-enter-to,
.menu-leave-from {
  max-height: 400px;
  opacity: 1;
}

/* ── Responsive : Mobile (< 768px) ──────────────── */
@media (max-width: 768px) {
  .nav-links-desktop,
  .nav-actions-desktop {
    display: none; /* Masquer le menu desktop */
  }

  .hamburger {
    display: flex; /* Afficher le hamburger */
  }

  .nav-inner {
    padding: 12px 20px;
  }
}
</style>
