<template>
  <!-- ══════════════════════════════════════════════
       NAVBAR — Refonte v4 (Single Row Mobile Accès)
  ══════════════════════════════════════════════ -->
  <nav
    :class="[
      'app-navbar',
      {
        'is-overlay': overlay,
        'is-open': menuOpen,
        'has-subnav': showSubNav && !isMobile,
      },
    ]"
  >
    <div class="nav-inner">
      <!-- Zone Logo -->
      <img src="/images/logo cca.png" alt="Logo" class="!h-[3rem] !w-[3rem]" />
      <NuxtLink to="/" class="nav-logo" @click="closeAll"> </NuxtLink>

      <!-- Liens Desktop -->
      <div class="nav-links-desktop">
        <NuxtLink to="/" class="nav-link" exact-active-class="active"
          >Accueil</NuxtLink
        >
        <NuxtLink to="/clans/cameroun" class="nav-link" active-class="active"
          >Clans</NuxtLink
        >
        <NuxtLink to="/players/cameroun" class="nav-link" active-class="active"
          >Joueurs</NuxtLink
        >
        <NuxtLink to="/tournaments" class="nav-link" active-class="active"
          >Tournois</NuxtLink
        >
        <NuxtLink to="/rules" class="nav-link" active-class="active"
          >Règlement</NuxtLink
        >
      </div>

      <!-- Liens Mobiles (En ligne à côté du logo) -->
      <div class="nav-links-mobile-inline" v-if="isMobile">
        <NuxtLink to="/" class="mobile-inline-link" exact-active-class="active">
          <span class="icon">🏠</span>
          <span class="label-text">Acceuil</span>
        </NuxtLink>

        <button
          class="mobile-inline-link"
          :class="{ active: rankingsOpen }"
          @click="toggleRankings"
        >
          <LucideBarChart3 :size="20" class="inline icon" />
          <span class="label-text"
            >Rang national <span class="tiny-chevron">▾</span></span
          >
        </button>

        <button
          class="mobile-inline-link"
          :class="{ active: tournamentsMenuOpen }"
          @click="toggleTournamentsMenu"
        >
          <LucideSwords :size="20" class="inline icon" />
          <span class="label-text"
            >Tournoi <span class="tiny-chevron">▾</span></span
          >
        </button>
      </div>

      <!-- Actions Desktop / Hamburger Mobile -->
      <div class="nav-actions">
        <div class="nav-actions-desktop" v-if="!isMobile">
          <template v-if="!isLoggedIn">
            <NuxtLink to="/login" class="nav-link mr-2" >Connexion</NuxtLink>
            <NuxtLink to="/register" class="btn-premium btn-primary btn-sm"
              >S'inscrire</NuxtLink
            >
          </template>
          <template v-else>
            <div
              class="user-avatar-wrapper"
              :class="{ 'dropdown-open': dropdownOpen }"
            >
              <button
                class="user-avatar-btn"
                @click="dropdownOpen = !dropdownOpen"
              >
              
                <img
                  v-if="user?.league_icon"
                  :src="user.league_icon"
                  class="league-icon-nav"
                />
                <div v-else class="avatar-initials" :class="roleBadgeClass">
                  {{ user?.name?.charAt(0) }}
                </div>
                <div class="avatar-text">
                  <span class="avatar-name">{{ user?.name }}</span>
                  <!-- <span class="avatar-tag">{{ user?.tag_coc }}</span> -->
                </div>
                <span class="avatar-chevron">▾</span>
              </button>
              <Transition name="dropdown">
                <div v-if="dropdownOpen" class="avatar-dropdown">
                  <NuxtLink
                    to="/profile"
                    class="dropdown-item"
                    @click="dropdownOpen = false"
                    ><LucideUser :size="18" class="inline mr-1" /> Profil</NuxtLink
                  >
                  <NuxtLink
                    v-if="showMyClan"
                    to="/my-clan"
                    class="dropdown-item"
                    @click="dropdownOpen = false"
                    ><LucideCastle :size="18" class="inline mr-1" /> Clan</NuxtLink
                  >
                  <NuxtLink
                    v-if="showMyClan"
                    to="/tournaments/my-clan"
                    class="dropdown-item"
                    @click="dropdownOpen = false"
                    ><LucideSwords :size="18" class="inline mr-1" /> Compétition</NuxtLink
                  >
                  <NuxtLink
                    v-if="dashboardPath"
                    :to="dashboardPath"
                    class="dropdown-item text-gold"
                    @click="dropdownOpen = false"
                    ><LucideHome :size="18" class="inline mr-1" /> Dashboard</NuxtLink
                  >
                  <div class="dropdown-divider"></div>
                  <button class="dropdown-item danger" @click="handleLogout">
                    <LucideLogOut :size="18" class="inline mr-1" /> Déconnexion
                  </button>
                </div>
              </Transition>
            </div>
          </template>
        </div>

        <button
          v-if="isMobile"
          class="hamburger"
          :class="{ open: menuOpen }"
          @click="toggleMenu"
        >
          <span></span><span></span><span></span>
        </button>
      </div>
    </div>

    <!-- Modals / Dropdowns Flottants Mobile -->
    <Transition name="quick-dropdown">
      <div
        v-if="(rankingsOpen || tournamentsMenuOpen) && isMobile"
        class="mobile-floating-menu"
      >
        <template v-if="rankingsOpen">
          <div class="menu-header">Classements</div>
          <NuxtLink to="/clans/cameroun" class="menu-item" @click="closeAll"
            >🇨🇲 Clans Cameroun</NuxtLink
          >
          <NuxtLink to="/players/cameroun" class="menu-item" @click="closeAll"
            >🏆 Joueurs Cameroun</NuxtLink
          >
        </template>
        <template v-else-if="tournamentsMenuOpen">
          <div class="menu-header">Tournois</div>
          <NuxtLink to="/tournaments" class="menu-item" @click="closeAll"
            >Vue d'ensemble</NuxtLink
          >
          <NuxtLink :to="ctaTo" class="menu-item" @click="closeAll"
            >{{ ctaIcon }} {{ ctaLabel }}</NuxtLink
          >
          <NuxtLink
            to="/tournaments/my-clan"
            class="menu-item"
            @click="closeAll"
            >Mon Clan (Tournoi)</NuxtLink
          >
          <NuxtLink
            to="/tournaments/bracket"
            class="menu-item"
            @click="closeAll"
            >Bracket & Scores</NuxtLink
          >
        </template>
      </div>
    </Transition>

    <!-- Drawer Mobile (Reste) -->
    <Transition name="menu">
      <div v-if="menuOpen && isMobile" class="nav-mobile-drawer">
        <NuxtLink to="/rules" class="mobile-link" @click="closeAll"
          ><LucideFileText :size="18" class="inline mr-1" /> Règlement</NuxtLink
        >
        <div class="mobile-divider"></div>
        <template v-if="!isLoggedIn">
          <NuxtLink to="/login" class="mobile-link" @click="closeAll"
            ><LucideKey :size="18" class="inline mr-1" /> Connexion</NuxtLink
          >
          <NuxtLink
            to="/register"
            class="btn-premium btn-primary mobile-cta"
            @click="closeAll"
            >S'inscrire</NuxtLink
          >
        </template>
        <template v-else>
          <div class="mobile-identity">
            <span class="role-badge" :class="roleBadgeClass">{{
              user.name
            }}</span>
            <span class="user-tag">{{ user?.tag_coc }}</span>
          </div>
          <NuxtLink to="/profile" class="mobile-link" @click="closeAll"
            ><LucideUser :size="18" class="inline mr-1" /> Profil</NuxtLink
          >
          <NuxtLink
            v-if="showMyClan"
            to="/my-clan"
            class="mobile-link"
            @click="closeAll"
            ><LucideCastle :size="18" class="inline mr-1" /> Mon Clan</NuxtLink
          >
          <NuxtLink
            v-if="dashboardPath"
            :to="dashboardPath"
            class="mobile-link text-gold"
            @click="closeAll"
            ><LucideHome :size="18" class="inline mr-1" /> {{ dashboardLabel }}</NuxtLink
          >
          <button @click="handleLogout" class="mobile-link text-red">
            <LucideLogOut :size="18" class="inline mr-1" /> Déconnexion
          </button>
        </template>
      </div>
    </Transition>

    <!-- SubNav Desktop Contextuelle -->
    <Transition name="subnav">
      <div v-if="showSubNav && !isMobile" class="subnav-container">
        <div class="subnav-inner">
          <NuxtLink
            to="/tournaments"
            class="sub-link"
            exact-active-class="active"
            >Vue d'ensemble</NuxtLink
          >
          <NuxtLink :to="ctaTo" class="sub-link" active-class="active"
            >{{ ctaIcon }} {{ ctaLabel }}</NuxtLink
          >
          <NuxtLink
            to="/tournaments/my-clan"
            class="sub-link"
            active-class="active"
            >Mon Clan (Tournoi)</NuxtLink
          >
          <NuxtLink
            to="/tournaments/bracket"
            class="sub-link"
            active-class="active"
            >Bracket & Scores</NuxtLink
          >
        </div>
      </div>
    </Transition>
  </nav>
</template>

<script setup>
const props = defineProps({ overlay: Boolean });
const { user, isLoggedIn, logout } = useAuth();
const { $toast } = useNuxtApp();
const route = useRoute();
const { ctaLabel, ctaTo, ctaIcon } = useTournamentCta();

const menuOpen = ref(false);
const dropdownOpen = ref(false);
const rankingsOpen = ref(false);
const tournamentsMenuOpen = ref(false);
const isMobile = ref(false);

const checkMobile = () => {
  if (process.client) isMobile.value = window.innerWidth <= 768;
};
onMounted(() => {
  checkMobile();
  window.addEventListener("resize", checkMobile);
});

const toggleMenu = () => {
  menuOpen.value = !menuOpen.value;
  rankingsOpen.value = false;
  tournamentsMenuOpen.value = false;
};
const toggleRankings = () => {
  rankingsOpen.value = !rankingsOpen.value;
  tournamentsMenuOpen.value = false;
  menuOpen.value = false;
};
const toggleTournamentsMenu = () => {
  tournamentsMenuOpen.value = !tournamentsMenuOpen.value;
  rankingsOpen.value = false;
  menuOpen.value = false;
};

const closeAll = () => {
  menuOpen.value = false;
  dropdownOpen.value = false;
  rankingsOpen.value = false;
  tournamentsMenuOpen.value = false;
};
const showSubNav = computed(() => route.path.startsWith("/tournaments"));
watch(() => route.path, closeAll);

const handleLogout = async () => {
  closeAll();
  await logout();
  $toast.info("À bientôt, chef !");
};

const dashboardPath = computed(() =>
  user.value?.role === "admin"
    ? "/admin/dashboard"
    : ["captain", "referee"].includes(user.value?.role)
      ? "/dashboard"
      : null,
);
const dashboardLabel = computed(() =>
  user.value?.role === "admin" ? "Admin" : "Arène",
);
const roleLabel = computed(
  () =>
    ({
      player: "Joueur",
      captain: "Capitaine",
      referee: "Arbitre",
      admin: "Admin",
    })[user.value?.role] || user.value?.role,
);
const roleBadgeClass = computed(
  () =>
    ({
      player: "role-player",
      captain: "role-captain",
      referee: "role-referee",
      admin: "role-admin",
    })[user.value?.role] || "",
);
const showMyClan = computed(
  () => isLoggedIn.value && ["player", "captain"].includes(user.value?.role),
);
</script>

<style>
.app-navbar {
  position: sticky;
  top: 0;
  left: 0;
  right: 0;
  width: 100%;
  z-index: 200;
  background: rgba(10, 11, 18, 0.95);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 4px 25px rgba(0, 0, 0, 0.4);
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.nav-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 20px;
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
}

.nav-logo-img {
  /* height: 2re3px;
  width: 2rem; */
  object-fit: cover;
}

/* ── Mobile Inline Links (Stacked) ──────────── */
.nav-links-mobile-inline {
  display: flex;
  gap: 8px;
  align-items: center;
  flex: 1;
  justify-content: center;
  margin: 0 10px;
}

.mobile-inline-link {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  color: rgba(255, 255, 255, 0.4);
  padding: 4px 8px;
  border-radius: 8px;
  transition: 0.2s;
  background: transparent;
  border: none;
  cursor: pointer;
}

.mobile-inline-link .icon {
  font-size: 1rem;
}

.mobile-inline-link .label-text {
  font-size: 0.5rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  white-space: nowrap;
}

.mobile-inline-link.active {
  color: var(--gold);
  background: rgba(212, 175, 55, 0.08);
}

.tiny-chevron {
  font-size: 0.45rem;
  margin-left: 1px;
  opacity: 0.5;
}

/* ── Floating Mobile Menu (Full Width Under Nav) ─ */
.mobile-floating-menu {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: #0b0c12;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  padding: 8px 0;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.7);
  z-index: 300;
}

.menu-header {
  font-size: 0.6rem;
  font-weight: 900;
  text-transform: uppercase;
  color: var(--gold);
  padding: 10px 20px;
  opacity: 0.8;
  letter-spacing: 1.5px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.03);
}

.menu-item {
  display: block;
  padding: 14px 20px;
  color: #fff;
  font-size: 0.85rem;
  font-weight: 600;
  text-decoration: none;
}

.menu-item:active {
  background: rgba(255, 255, 255, 0.05);
}

/* ── Desktop & Common Styles ────────────────── */
.nav-links-desktop {
  display: flex;
  gap: 28px;
}

.nav-link {
  color: rgba(255, 255, 255, 0.5);
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 600;
  transition: all 0.3s;
}

.nav-link:hover,
.nav-link.active {
  color: #fff;
}

.nav-actions {
  display: flex;
  align-items: center;
  gap: 15px;
}

.hamburger {
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: 34px;
  height: 34px;
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.hamburger span {
  width: 18px;
  height: 2px;
  background: #fff;
  border-radius: 2px;
  transition: 0.3s;
}

.hamburger.open span:nth-child(1) {
  transform: translateY(6px) rotate(45deg);
}

.hamburger.open span:nth-child(2) {
  opacity: 0;
}

.hamburger.open span:nth-child(3) {
  transform: translateY(-6px) rotate(-45deg);
}

.nav-mobile-drawer {
  padding: 10px 0 30px;
  background: #06070a;
}

.mobile-link {
  display: block;
  padding: 16px 20px;
  color: rgba(255, 255, 255, 0.7);
  font-weight: 600;
  text-decoration: none;
  border-bottom: 1px solid rgba(255, 255, 255, 0.02);
}

.mobile-divider {
  height: 1px;
  background: rgba(255, 255, 255, 0.05);
  margin: 10px 20px;
}

.subnav-container {
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  background: rgba(0, 0, 0, 0.2);
}

.subnav-inner {
  display: flex;
  justify-content: center;
  gap: 25px;
  padding: 12px;
}

.sub-link {
  color: rgba(255, 255, 255, 0.3);
  font-size: 0.7rem;
  font-weight: 800;
  text-transform: uppercase;
  text-decoration: none;
}

.sub-link.active {
  color: var(--gold);
}

/* User Identity Display */
.user-avatar-btn {
  display: flex;
  align-items: center;
  gap: 10px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  padding: 4px 12px;
  border-radius: 30px;
  color: #fff;
}

.league-icon-nav {
  height: 24px;
}

.avatar-text {
  text-align: left;
  line-height: 1.1;
}

.avatar-name {
  font-size: 0.75rem;
  font-weight: 700;
}

.avatar-tag {
  font-size: 0.55rem;
  opacity: 0.5;
  font-family: monospace;
}

.avatar-dropdown {
  position: absolute;
  top: calc(100% + 10px);
  right: 0;
  width: 190px;
  background: #0f111a;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 6px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
  z-index: 300;
}

.mobile-identity {
  padding: 20px;
  background: rgba(255, 255, 255, 0.02);
  display: flex;
  align-items: center;
  gap: 10px;
}

@media (max-width: 768px) {
  .nav-links-desktop {
    display: none;
  }
}
</style>
