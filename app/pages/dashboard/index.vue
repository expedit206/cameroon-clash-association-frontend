<template>
  <div class="dashboard-page">
    <!-- Navbar & Header -->
    <header class="dashboard-header animate-float">
      <div class="header-content">
        <h1 class="heading">
          Arène du <span class="text-gold">Capitaine</span>
        </h1>
        <p class="subtitle">
          Gérez votre clan et menez vos guerriers vers la gloire.
        </p>
      </div>
      <div class="header-stats" v-if="user">
        <div class="mini-stat">
          <span class="label">Tag</span>
          <span class="value text-gold">{{ user.tag_coc }}</span>
        </div>
        <div class="mini-stat">
          <span class="label">Rôle</span>
          <span class="value capitalize">{{ user.role }}</span>
        </div>
        <div class="mini-stat" v-if="user.capitained_clan">
          <span class="label">Clan</span>
          <span class="value">{{ user.capitained_clan.name }}</span>
        </div>
      </div>
    </header>

    <div class="dashboard-grid">
      <!-- Sidebar / Progression -->
      <aside class="dashboard-sidebar">
        <div class="glass-card status-card">
          <h3 class="text-gold">Progression Tournoi</h3>
          <ul class="phase-steps">
            <li :class="{ active: currentPhase === 1, done: currentPhase > 1 }">
              <span class="step-num">1</span>
              <div class="step-label">
                <p>Clan</p>
                <small v-if="currentPhase > 1">Enregistré</small>
                <small v-else>En attente</small>
              </div>
            </li>
            <li :class="{ active: currentPhase === 2, done: currentPhase > 2 }">
              <span class="step-num">2</span>
              <div class="step-label">
                <p>Équipe</p>
                <small v-if="currentPhase > 2">Composée</small>
                <small v-else>À définir</small>
              </div>
            </li>
            <li :class="{ active: currentPhase === 3, done: teamIsConfirmed }">
              <span class="step-num">3</span>
              <div class="step-label">
                <p>Paiement</p>
                <small v-if="teamIsConfirmed">Validé</small>
                <small v-else>À régler</small>
              </div>
            </li>
          </ul>
        </div>
      </aside>

      <!-- Main Content Area -->
      <main class="dashboard-content">
        <!-- Loader -->
        <div v-if="loading" class="loader-container">
          <div class="spinner"></div>
          <p>Chargement des données de l'arène...</p>
        </div>

        <div v-else>
          <!-- PHASE 1 : Enregistrement du Clan -->
          <section v-if="currentPhase === 1" class="phase-section">
            <div class="glass-card info-card">
              <h2 class="text-gold">Phase 1 : Enregistrez votre Clan</h2>
              <p>
                Pour participer à la National League, vous devez d'abord
                déclarer votre clan officiel. Un admin vérifiera votre grade
                dans le jeu.
              </p>

              <div v-if="user?.capitained_clan" class="pending-notice">
                <img
                  :src="user.capitained_clan.badge_url"
                  alt=""
                  class="clan-badge"
                />
                <div class="notice-text">
                  <h3>
                    Candidature en cours : {{ user.capitained_clan.name }}
                  </h3>
                  <p>
                    Status :
                    <span
                      class="badge-status"
                      :class="user.capitained_clan.status"
                      >{{
                        user.capitained_clan.status === "pending"
                          ? "En attente de validation admin"
                          : "Validé"
                      }}</span
                    >
                  </p>
                </div>
              </div>

              <form v-else @submit.prevent="submitClan" class="form-horizontal">
                <div class="form-group">
                  <label>Tag du Clan CoC</label>
                  <input
                    v-model="clanForm.tag_coc"
                    type="text"
                    placeholder="#2PP..."
                    required
                  />
                </div>
                <div class="form-group">
                  <label>Nom du Clan</label>
                  <input
                    v-model="clanForm.name"
                    type="text"
                    placeholder="Entrez le nom du clan"
                    required
                  />
                </div>
                <button
                  type="submit"
                  class="btn-premium btn-primary"
                  :disabled="submitting"
                >
                  {{ submitting ? "Envoi..." : "Soumettre mon Clan" }}
                </button>
              </form>
            </div>
          </section>

          <!-- PHASE 2 : Composition de l'équipe -->
          <section v-if="currentPhase === 2" class="phase-section">
            <dashboard-team-manager
              :competition-id="1"
              @saved="fetchUserData"
            />
          </section>

          <!-- PHASE 3 : Paiement -->
          <section v-if="currentPhase === 3" class="phase-section">
            <div class="glass-card">
              <h2 class="text-gold">Phase 3 : Finalisez l'inscription</h2>
              <div class="payment-info mb-6">
                <p>
                  Votre équipe est prête pour la
                  <strong>National League</strong> !
                </p>
                <p>
                  Veuillez effectuer le dépôt de <strong>5 000 FCFA</strong> sur
                  l'un des numéros suivants :
                </p>
                <ul class="payment-numbers">
                  <li>
                    🟠 <strong>690 00 00 00</strong> (Orange Money - CCA Admin)
                  </li>
                  <li>
                    🟡 <strong>670 00 00 00</strong> (MTN Mobile Money - CCA
                    Admin)
                  </li>
                </ul>
              </div>

              <form @submit.prevent="submitPayment" class="form-horizontal">
                <div class="form-group">
                  <label>Méthode de Paiement</label>
                  <select v-model="paymentForm.method" required>
                    <option value="orange">Orange Money</option>
                    <option value="mtn">MTN Mobile Money</option>
                  </select>
                </div>
                <div class="form-group">
                  <label>Numéro Payeur</label>
                  <input
                    v-model="paymentForm.phone"
                    type="text"
                    placeholder="6..."
                    required
                  />
                </div>
                <div class="form-group">
                  <label>Référence de Transaction</label>
                  <input
                    v-model="paymentForm.reference"
                    type="text"
                    placeholder="ID Transaction"
                    required
                  />
                </div>
                <button
                  type="submit"
                  class="btn-premium btn-primary"
                  :disabled="submitting"
                >
                  {{ submitting ? "Validation..." : "Confirmer le Paiement" }}
                </button>
              </form>
            </div>
          </section>

          <!-- PHASE 4 : Terminé -->
          <section v-if="currentPhase === 4" class="phase-section">
            <div class="glass-card text-center py-10">
              <div
                class="success-icon"
                style="font-size: 4rem; margin-bottom: 20px"
              >
                🏆
              </div>
              <h2 class="text-gold">Inscription Terminée !</h2>
              <p v-if="teamIsConfirmed">
                Votre clan est officiellement inscrit au tournoi. Préparez vos
                guerriers !
              </p>
              <p v-else>
                Paiement reçu. L'administrateur valide votre enregistrement
                final.
              </p>

              <div class="mt-8">
                <NuxtLink to="/rules" class="btn-premium btn-outline"
                  >Revoir le Règlement</NuxtLink
                >
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
const { user, fetchUser, isLoggedIn } = useAuth();
const loading = ref(true);
const submitting = ref(false);

const clanForm = ref({
  tag_coc: "",
  name: "",
});

const paymentForm = ref({
  method: "orange",
  phone: "",
  reference: "",
});

const currentPhase = computed(() => {
  if (!user.value) return 1;
  if (
    !user.value.capitained_clan ||
    user.value.capitained_clan.status !== "validated"
  )
    return 1;

  const registration = user.value.registrations?.[0];
  if (!registration) return 2; // Clan validé mais équipe non inscrite
  if (registration.status === "pending_payment") return 3; // Équipe ok, attend paiement

  return 4; // Tout est bon ou attend confirmation admin
});

const teamIsConfirmed = computed(() => {
  return user.value?.registrations?.[0]?.status === "confirmed";
});

const fetchUserData = async () => {
  loading.value = true;
  try {
    await fetchUser();
    // Sécurité : si simple joueur, retour à l'accueil
    if (user.value && user.value.role !== 'admin' && !user.value.capitained_clan) {
      navigateTo('/');
    }
  } catch (e) {
    console.error(e);
  } finally {
    loading.value = false;
  }
};

const submitPayment = async () => {
  if (!user.value.registrations?.[0]) return;

  submitting.value = true;
  try {
    await $api(`/registrations/${user.value.registrations[0].id}/pay`, {
      method: "POST",
      body: {
        payment_method: paymentForm.value.method,
        phone_number: paymentForm.value.phone,
        transaction_reference: paymentForm.value.reference,
      },
    });
    alert("Preuve de paiement soumise !");
    await fetchUserData();
  } catch (e) {
    alert(e.data?.message || "Erreur lors de la validation du paiement.");
  } finally {
    submitting.value = false;
  }
};

const submitClan = async () => {
  submitting.value = true;
  try {
    await $api("/clans/submit", {
      method: "POST",
      body: clanForm.value,
    });
    alert("Clan soumis avec succès !");
    await fetchUserData();
  } catch (e) {
    alert(e.data?.message || "Erreur lors de la soumission.");
  } finally {
    submitting.value = false;
  }
};

onMounted(() => {
  fetchUserData();
});
</script>

<style scoped>
.dashboard-page {
  padding-top: 20px;
}

.dashboard-header {
  margin-bottom: 40px;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  border-bottom: 1px solid var(--glass-border);
  padding-bottom: 20px;
}

.header-stats {
  display: flex;
  gap: 30px;
}

.mini-stat {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.mini-stat .label {
  font-size: 0.7rem;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 1px;
}

.mini-stat .value {
  font-weight: bold;
  font-size: 1.1rem;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 30px;
}

.phase-steps {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-top: 20px;
}

.phase-steps li {
  display: flex;
  align-items: center;
  gap: 15px;
  opacity: 0.5;
  transition: all 0.3s ease;
}

.phase-steps li.active {
  opacity: 1;
  transform: translateX(10px);
}

.phase-steps li.done {
  opacity: 0.8;
}

.step-num {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--bg-dark);
  border: 2px solid var(--glass-border);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
}

.active .step-num {
  border-color: var(--primary);
  box-shadow: 0 0 10px var(--primary-glow);
}

.done .step-num {
  background: var(--primary);
  border-color: var(--primary);
  color: white;
}

.step-label p {
  font-weight: bold;
  margin: 0;
}

.step-label small {
  color: var(--text-muted);
  font-size: 0.75rem;
}

.pending-notice {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 20px;
  background: rgba(255, 215, 0, 0.05);
  border: 1px solid rgba(255, 215, 0, 0.2);
  border-radius: 12px;
  margin-top: 20px;
}

.clan-badge {
  width: 60px;
}

.badge-status {
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: bold;
}

.badge-status.pending {
  background: #6366f1;
  color: white;
}
.badge-status.validated {
  background: #10b981;
  color: white;
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

@media (max-width: 900px) {
  .dashboard-grid {
    grid-template-columns: 1fr;
  }
  .dashboard-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 20px;
  }
}
</style>
