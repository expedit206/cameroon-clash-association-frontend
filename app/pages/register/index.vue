<template>
  <div class="auth-page">
    <div class="glass-card auth-container">
      <div class="auth-header">
        <img src="/imagescoc/badge 1.webp" alt="Join" class="auth-icon" />
        <h1 class="heading">
          Rejoindre la <span class="text-gold">Légue</span>
        </h1>
        <p>Inscrivez-vous avec votre tag joueur pour commencer l'aventure.</p>
      </div>

      <form @submit.prevent="handleRegister" class="auth-form">
        <div class="form-grid">
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

          <div class="form-group">
            <label for="phone">Numéro WhatsApp</label>
            <input
              v-model="form.phone_whatsapp"
              type="tel"
              id="phone"
              placeholder="Ex: 677..."
              required
            />
          </div>

          <div class="form-group full-width">
            <label for="password">Mot de passe</label>
            <div class="input-with-icon">
              <input
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                id="password"
                placeholder="••••••••"
                required
              />
              <button type="button" class="eye-toggle" @click="showPassword = !showPassword" tabindex="-1">
                <span v-if="showPassword">👁️</span>
                <span v-else>🙈</span>
              </button>
            </div>
          </div>

          <div class="form-group full-width">
            <label for="proof">Capture d'écran du profil de votre compte Clash of Clans(votre id# doit etre visible)</label>
            <div
              class="file-upload glass-card"
              @click="$refs.fileInput.click()"
            >
              <div v-if="!fileName" class="upload-placeholder">
                <LucideFolder :size="40" class="inline mb-2" />
                <p>Cliquez pour choisir une image</p>
                <p class="small">Max 5Mo / Format JPG, PNG ou WEBP</p>
              </div>
              <div v-else class="upload-selected">
                <span>✅ {{ fileName }}</span>
              </div>
              <input
                ref="fileInput"
                type="file"
                hidden
                @change="handleFileChange"
                accept="image/*"
              />
            </div>
          </div>
        </div>

        <!-- Toast system will handle errors -->

        <div class="auth-footer">
          <button
            type="submit"
            class="btn-premium btn-primary btn-full"
            :disabled="loading"
          >
            <span v-if="loading">Vérification CoC...</span>
            <span v-else>Créer mon compte</span>
          </button>
          <p class="switch-auth">
            Déjà inscrit ?
            <NuxtLink to="/login" class="text-gold">Se connecter</NuxtLink>
          </p>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
const { fetchApi } = useApi();
const { $toast } = useNuxtApp();
const router = useRouter();

const showPassword = ref(false);
const form = reactive({
  tag_coc: "",
  phone_whatsapp: "",
  password: "",
  password_confirmation: "",
});

const fileProof = ref(null);
const fileName = ref("");
const loading = ref(false);

const handleFileChange = (e) => {
  const file = e.target.files[0];
  if (file) {
 
    fileProof.value = file;
    fileName.value = file.name;
  }
};

const handleRegister = async () => {
  loading.value = true;
  form.password_confirmation = form.password; // Sync for simplicity in UI

  try {
    const formData = new FormData();
    Object.keys(form).forEach((key) => formData.append(key, form[key]));
    if (fileProof.value) {
      formData.append("screenshot_proof", fileProof.value);
    }

    await fetchApi("/auth/register", {
      method: "POST",
      body: formData,
    });

    // Success -> Redirect to pending or login with message
    router.push("/login?registered=1");
  } catch (e) {
    let msg = "Une erreur est survenue lors de l'inscription.";
    if (e.data?.errors) {
      msg = Object.values(e.data.errors).flat()[0];
    } else if (e.data?.message) {
      msg = e.data.message;
    }
    $toast.error(msg);
  } finally {
    loading.value = false;
  }
};

useHead({
  title: "Inscription | CCA National League",
});
</script>

<style scoped>
.auth-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 90vh;
  padding: 40px 20px;
}

.auth-container {
  width: 100%;
  max-width: 650px;
  padding: 50px;
}

.auth-header {
  text-align: center;
  margin-bottom: 40px;
}

.auth-icon {
  width: 80px;
  margin-bottom: 20px;
  filter: drop-shadow(0 0 10px var(--primary-glow));
}

.auth-header h1 {
  font-size: 2.5rem;
  margin-bottom: 10px;
}

.auth-header p {
  color: var(--text-muted);
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group.full-width {
  grid-column: span 2;
}

.form-group label {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

input {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-sm);
  padding: 12px 15px;
  color: white;
  font-family: inherit;
  font-size: 1rem;
  transition: all 0.3s ease;
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
  align-items: center;
}

.input-with-icon .icon {
  position: absolute;
  left: 15px;
  color: var(--primary);
  font-weight: 800;
}

.input-with-icon input {
  padding-left: 35px;
  width: 100%;
}

.eye-toggle {
  position: absolute;
  right: 12px;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  opacity: 0.6;
  transition: opacity 0.2s;
  line-height: 1;
}

.eye-toggle:hover {
  opacity: 1;
}

.file-upload {
  padding: 20px;
  text-align: center;
  border: 2px dashed var(--glass-border);
  cursor: pointer;
}

.file-upload:hover {
  background: rgba(255, 255, 255, 0.05);
  border-color: var(--primary);
}

.upload-placeholder .small {
  margin-top: 5px;
  font-size: 0.8rem;
  opacity: 0.7;
}

.upload-selected {
  font-weight: 600;
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

@media (max-width: 600px) {
  .form-grid {
    grid-template-columns: 1fr;
  }
  .form-group.full-width {
    grid-column: span 1;
  }
  .auth-container {
    padding: 30px 20px;
  }
}
</style>
