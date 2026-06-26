<template>
  <div class="my-clan-page">
    <div class="page-header animate-float">
      <h1 class="heading">Mon <span class="text-gold">Clan</span></h1>
      <p class="subtitle">
        Synchronisez vos guerriers et préparez la conquête.
      </p>
    </div>

    <div v-if="loading" class="loader-container">
      <div class="spinner"></div>
      <p>Chargement des guerriers du clan...</p>
    </div>

    <div v-else-if="error" class="error-container glass-card">
      <p>⚠️ {{ error }}</p>
      <NuxtLink to="/dashboard" class="btn-premium btn-outline mt-4"
        >Retour au Dashboard</NuxtLink
      >
    </div>

    <!-- Cas : joueur sans clan sur CoC -->
    <div v-else-if="noClan" class="no-clan-container glass-card">
      <div class="no-clan-icon">🏰</div>
      <h2>Vous n'avez pas de clan</h2>
      <p>
        Votre compte Clash of Clans n'est rattaché à aucun clan pour le
        moment.<br />
        Rejoignez un clan dans le jeu, puis synchronisez votre profil.
      </p>
      <NuxtLink to="/dashboard" class="btn-premium btn-primary mt-4"
        >Retour au Dashboard</NuxtLink
      >
    </div>

    <div v-else class="clan-content">
      <!-- Active Election Module -->
      <ElectionModule
        v-if="activeElection"
        :election="activeElection"
        :members="members"
        @voted="fetchClanData"
      />

      <!-- Info Header -->
      <div class="clan-info-banner glass-card" v-if="clanInfo">
        <div class="clan-badge-wrapper">
          <img
            :src="clanInfo.badge_url || '/imagescoc/clan-placeholder.png'"
            class="clan-badge"
            alt="Clan Badge"
          />
        </div>
        <div class="clan-details">
          <h2 class="text-gold">{{ clanInfo.name }}</h2>
          <p class="tag">#{{ clanTag }}</p>
          <div class="stats">
            <span>Niveau {{ clanInfo.clan_level }}</span>
            <span class="divider">|</span>
            <span>{{ members.length }} membres</span>
          </div>
        </div>
        <div class="clan-actions" v-if="user?.profile_status !== 'validated'">
          <div class="validation-cta glass-card">
            <p v-if="user?.profile_status === 'none'">
              Prêt pour la compétition ? Validez votre profil CoC pour être
              éligible au tournoi.
            </p>
            <p v-else-if="user?.profile_status === 'pending'">
              Demande en cours d'examen par CCA...
            </p>
            <p v-else-if="user?.profile_status === 'rejected'">
              Votre profil a été refusé. Veuillez contacter le support.
            </p>

            <button
              v-if="
                user?.profile_status === 'none' ||
                user?.profile_status === 'rejected'
              "
              @click="submitVerification"
              class="btn-premium btn-primary btn-sm"
            >
              Soumettre mon profil
            </button>
            <template
              v-else-if="
                user?.profile_status === 'validated' && !activeElection
              "
            >
              <button
                @click="initiateElection"
                class="btn-premium btn-outline btn-sm"
              >
                Initier une élection
              </button>
            </template>
            <div
              v-else-if="user?.profile_status === 'pending'"
              class="status-indicator"
            >
              🕒 En attente de validation
            </div>
          </div>
        </div>
      </div>

      <!-- Members Grid -->
      <div class="members-section">
        <div class="section-title">
          <h3>Effectif du Clan</h3>
          <div class="legend">
            <span class="legend-item"
              ><span class="dot verified"></span> Vérifié</span
            >
            <span class="legend-item"
              ><span class="dot registered"></span> Inscrit</span
            >
            <span class="legend-item"
              ><span class="dot guest"></span> Inconnu</span
            >
          </div>
        </div>

        <div class="members-grid">
          <div
            v-for="member in members"
            :key="member.tag_coc"
            :class="[
              'member-card glass-card',
              { 'is-unregistered': !member.is_registered },
            ]"
          >
            <div class="member-rank">
              <img
                v-if="member.league_icon"
                :src="member.league_icon"
                class="league-icon"
                alt="League"
              />
              <span v-else class="rank-fallback"
                >Lvl {{ member.exp_level }}</span
              >
            </div>

            <div class="member-main">
              <div class="member-name">{{ member.name }}</div>
              <div class="member-tag">{{ member.tag_coc }}</div>
              <div class="member-role">{{ formatRole(member.role_coc) }}</div>
            </div>

            <div class="member-platform-status">
              <template v-if="member.is_registered">
                <div
                  v-if="member.platform_user.is_validated"
                  class="status-badge verified"
                  title="Profil validé par CCA"
                >
                  🛡️ <span>Vérifié</span>
                </div>
                <div
                  v-else
                  class="status-badge registered"
                  title="Inscrit sur la plateforme"
                >
                  👤 <span>Inscrit</span>
                </div>
              </template>
              <div
                v-else
                class="status-badge guest"
                title="Non inscrit sur CCA NL"
              >
                ❌ <span>Hors CCA</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const { $api } = useNuxtApp();
const { user, isLoggedIn } = useAuth();
const loading = ref(true);
const error = ref(null);
const noClan = ref(false);
const members = ref([]);
const clanTag = ref("");
const clanInfo = ref(null);
const activeElection = ref(null);

const fetchClanData = async () => {
  if (!isLoggedIn.value) {
    console.warn("[My Clan] User not logged in, skipping fetch.");
    return;
  }

  try {
    const data = await $api("/clans/my-clan/members");
    members.value = data.members;
    clanTag.value = data.clan_tag;
    activeElection.value = data.active_election;

    // Retirer le '#' du tag pour un segment d'URL propre
    const cleanTag = data.clan_tag.replace("#", "");
    const clanRes = await $api(`/clans/${cleanTag}`);
    clanInfo.value = clanRes;
  } catch (e) {
    // 400 = joueur sans clan sur CoC (tag manquant dans son profil)
    if (e.response?.status === 400 || e.status === 400) {
      noClan.value = true;
    } else {
      error.value =
        e.data?.message || "Impossible de charger les données du clan.";
    }
  } finally {
    loading.value = false;
  }
};

const formatRole = (role) => {
  const roles = {
    leader: "Chef",
    coLeader: "Adjoint",
    admin: "Aîné",
    member: "Membre",
  };
  return roles[role] || role;
};

const submitVerification = async () => {
  try {
    const res = await $api("/auth/submit-profile", { method: "POST" });
    if (user.value) {
      user.value.profile_status = "pending";
    }
    alert("Demande envoyée ! Un administrateur va vérifier votre profil.");
  } catch (e) {
    alert(e.data?.message || "Erreur lors de l'envoi de la demande.");
  }
};

const initiateElection = async () => {
  if (!confirm("Voulez-vous lancer l'élection du capitaine pour ce clan ?"))
    return;
  try {
    await $api("/elections/initiate", { method: "POST" });
    fetchClanData();
  } catch (e) {
    alert(e.data?.message || "Erreur lors du lancement.");
  }
};

onMounted(() => {
  fetchClanData();
});

useHead({
  title: "Mon Clan | CCA National League",
});
</script>

<style scoped>
.my-clan-page {
  padding-bottom: 60px;
}

.page-header {
  margin-bottom: 40px;
  text-align: center;
}

.clan-info-banner {
  display: flex;
  align-items: center;
  gap: 30px;
  padding: 30px;
  margin-bottom: 40px;
}

.clan-badge {
  width: 100px;
  filter: drop-shadow(0 0 10px rgba(0, 0, 0, 0.5));
}

.clan-details h2 {
  font-size: 2.2rem;
  margin-bottom: 5px;
}

.clan-details .tag {
  color: var(--text-muted);
  font-family: monospace;
  font-size: 1.1rem;
  margin-bottom: 10px;
}

.stats {
  display: flex;
  gap: 15px;
  font-weight: 600;
}

.divider {
  color: var(--glass-border);
}

.clan-actions {
  margin-left: auto;
}

.validation-cta {
  padding: 15px 20px;
  text-align: center;
  background: rgba(255, 215, 0, 0.05);
  border-color: rgba(255, 215, 0, 0.2);
}

.validation-cta p {
  font-size: 0.85rem;
  margin-bottom: 10px;
  color: var(--text-muted);
}

/* Members Grid */
.section-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
  padding: 0 10px;
}

.section-title h3 {
  font-size: 1.5rem;
}

.legend {
  display: flex;
  gap: 20px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.85rem;
  color: var(--text-muted);
}

.dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

.dot.verified {
  background: #10b981;
  box-shadow: 0 0 5px #10b981;
}
.dot.registered {
  background: var(--primary);
  box-shadow: 0 0 5px var(--primary);
}
.dot.guest {
  background: #6b7280;
}

.members-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.member-card {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 15px 20px;
  transition: transform 0.2s ease;
}

.member-card:hover {
  transform: translateY(-5px);
  border-color: var(--primary);
}

.member-card.is-unregistered {
  opacity: 0.7;
}

.league-icon {
  width: 45px;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
}

.rank-fallback {
  font-size: 0.75rem;
  font-weight: bold;
  color: var(--text-muted);
  background: rgba(255, 255, 255, 0.05);
  padding: 5px;
  border-radius: 4px;
}

.member-main {
  flex-grow: 1;
}

.member-name {
  font-weight: bold;
  font-size: 1.1rem;
}

.member-tag {
  font-size: 0.8rem;
  color: var(--text-muted);
  font-family: monospace;
}

.member-role {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: var(--primary);
  font-weight: 600;
}

.member-platform-status {
  flex-shrink: 0;
}

.status-badge {
  padding: 5px 12px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: bold;
  display: flex;
  align-items: center;
  gap: 6px;
  background: rgba(255, 255, 255, 0.05);
}

.status-badge.verified {
  color: #10b981;
  background: rgba(16, 185, 129, 0.1);
  border: 1px solid rgba(16, 185, 129, 0.2);
}

.status-badge.registered {
  color: var(--primary);
  background: rgba(212, 175, 55, 0.1);
  border: 1px solid rgba(212, 175, 55, 0.2);
}

.status-badge.guest {
  color: var(--text-muted);
}

/* Cas : pas de clan */
.no-clan-container {
  max-width: 520px;
  margin: 80px auto;
  padding: 50px 40px;
  text-align: center;
}

.no-clan-icon {
  font-size: 4rem;
  margin-bottom: 20px;
  filter: drop-shadow(0 0 12px rgba(255, 215, 0, 0.3));
}

.no-clan-container h2 {
  font-size: 1.8rem;
  color: var(--text-primary);
  margin-bottom: 15px;
}

.no-clan-container p {
  color: var(--text-muted);
  line-height: 1.7;
  font-size: 0.95rem;
}

.loader-container {
  text-align: center;
  padding: 100px 0;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid var(--glass-border);
  border-top-color: var(--primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 768px) {
  .clan-info-banner {
    flex-direction: column;
    text-align: center;
  }
  .stats {
    justify-content: center;
  }
  .clan-actions {
    margin: 20px 0 0;
    width: 100%;
  }
  .section-title {
    flex-direction: column;
    gap: 15px;
  }
}
</style>
<script>
export default {
  layout: "default",
};
</script>
