<template>
  <div class="auth-page">
    <div class="glass-card auth-container">
      <div class="auth-header">
        <img
          src="/imagescoc/skin barbarian.webp"
          alt="Login"
          class="auth-icon"
        />
        <h1 class="heading">Régiment <span class="text-gold">Connect</span></h1>
        <p>Entrez vos identifiants CoC pour rejoindre votre clan.</p>
      </div>

      <div v-if="registered" class="success-msg glass-card">
        ✅ Inscription réussie ! (veuillez vous connecter)
      </div>

      <form @submit.prevent="handleLogin" class="auth-form">
        <div class="form-group">
          <label for="tag">Tag CoC</label>
          <div class="input-with-icon">
            <span class="icon">#</span>
            <input
              v-model="form.tag_coc"
              type="text"
              id="tag"
              placeholder="P9QC9L..."
              required
            />
          </div>
        </div>

        <div class="form-group" style="margin-top: 20px">
          <label for="password">Mot de passe</label>
          <input
            v-model="form.password"
            type="password"
            id="password"
            placeholder="••••••••"
            required
          />
        </div>

        <div v-if="error" class="error-msg glass-card">⚠️ {{ error }}</div>

        <div class="auth-footer">
          <button
            type="submit"
            class="btn-premium btn-primary btn-full"
            :disabled="loading"
          >
            <span v-if="loading">Connexion...</span>
            <span v-else>Entrer dans l'arène</span>
          </button>
          <p class="switch-auth">
            Pas encore de compte ?
            <NuxtLink to="/register" class="text-gold"
              >Créer un compte</NuxtLink
            >
          </p>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
const { login, user } = useAuth();
const router = useRouter();
const route = useRoute();

const form = reactive({
  tag_coc: "",
  password: "",
});

const loading = ref(false);
const error = ref(null);
const registered = computed(() => route.query.registered === "1");

const handleLogin = async () => {
  loading.value = true;
  error.value = null;

  try {
    await login(form);

    // Redirection basée sur le rôle
    if (user.value.role === "admin") {
      router.push("/admin/dashboard");
    } else if (user.value.capitained_clan) {
      router.push("/dashboard");
    } else {
      // Simple joueur : vers l'accueil ou profil
      router.push("/");
    }
  } catch (e) {
    error.value =
      e.data?.message || "Identifiants incorrects ou compte non validé.";
  } finally {
    loading.value = false;
  }
};

useHead({
  title: "Connexion | CCA National League",
});
</script>

<style scoped>
/* Scopes mimic register page for consistency */
.auth-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80vh;
  padding: 40px 20px;
}

.auth-container {
  width: 100%;
  max-width: 450px;
  padding: 50px;
}

.auth-header {
  text-align: center;
  margin-bottom: 40px;
}

.auth-icon {
  width: 100px;
  margin-bottom: 20px;
  filter: drop-shadow(0 0 15px var(--primary-glow));
}

.auth-header h1 {
  font-size: 2.2rem;
  margin-bottom: 10px;
}

.auth-header p {
  color: var(--text-muted);
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--text-muted);
  text-transform: uppercase;
}

input {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-sm);
  padding: 12px 15px;
  color: white;
  font-family: inherit;
  font-size: 1rem;
}

input:focus {
  outline: none;
  border-color: var(--primary);
  background: rgba(255, 255, 255, 0.1);
  box-shadow: 0 0 10px var(--primary-glow);
}

.input-with-icon {
  position: relative;
  display: flex;
}

.input-with-icon .icon {
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--primary);
  font-weight: 800;
}

.input-with-icon input {
  padding-left: 35px;
  width: 100%;
}

.auth-footer {
  margin-top: 40px;
}

.btn-full {
  width: 100%;
}

.switch-auth {
  margin-top: 20px;
  text-align: center;
  color: var(--text-muted);
}

.error-msg {
  margin-top: 20px;
  background: rgba(255, 75, 75, 0.1);
  border-color: rgba(255, 75, 75, 0.3);
  color: #ff4b4b;
  padding: 15px;
  text-align: center;
}

.success-msg {
  margin-bottom: 30px;
  background: rgba(0, 255, 163, 0.1);
  border-color: rgba(0, 255, 163, 0.3);
  color: var(--accent-green);
  padding: 15px;
  text-align: center;
  font-weight: 600;
}
</style>
