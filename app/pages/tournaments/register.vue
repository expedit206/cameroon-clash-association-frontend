<template>
  <div class="register-page min-h-screen pb-20">
    <div class="container mx-auto px-4 py-10 max-w-2xl">
      <!-- Header -->
      <header class="text-center mb-10">
        <NuxtLink to="/tournaments"
          class="inline-flex items-center gap-2 text-xs text-white/40 uppercase tracking-widest hover:text-gold transition-colors mb-6">
          ← Retour
        </NuxtLink>
        <h1 class="heading text-3xl md:text-4xl font-black italic tracking-tighter">
          Parcours <span class="text-gold">Inscription</span>
        </h1>
        <p class="text-white/40 text-sm mt-1 uppercase tracking-widest">
          CCA National League — Saison 1
        </p>
      </header>

      <!-- Error State -->
      <div v-if="error"
        class="glass-card !p-8 text-center animate-in flex flex-col items-center border border-red-500/20 bg-red-500/5 mb-10">
        <span class="text-4xl mb-4 block">⚠️</span>
        <h3 class="font-black text-xl mb-2 text-white">Accès restreint</h3>
        <p class="text-white/60 text-sm mb-6 leading-relaxed max-w-md mx-auto">
          {{ error }}
        </p>
        <div class="flex gap-4 justify-center">
          <NuxtLink to="/" class="btn-premium btn-outline text-xs">
            Retour à l'accueil
          </NuxtLink>
          <NuxtLink to="/tournaments" class="btn-premium btn-primary text-xs">
            Retour aux Tournois
          </NuxtLink>
        </div>
      </div>

      <div v-else>
        <!-- Progress Steps -->
        <div class="steps-bar flex items-center gap-0 mb-10 overflow-x-auto pb-4">
          <div v-for="(step, i) in steps" :key="i" class="flex items-center flex-1 min-w-[80px]">
            <div class="step-dot flex flex-col items-center gap-1 flex-1">
              <div
                class="step-num w-8 h-8 rounded-full flex items-center justify-center font-black text-xs transition-all"
                :class="{
                  'bg-gold text-black': currentStep === i,
                  'bg-green-500 text-white': currentStep > i,
                  'bg-white/5 text-white/50': currentStep < i,
                }">
                <span v-if="currentStep > i">✓</span>
                <span v-else>{{ i + 1 }}</span>
              </div>
              <span class="text-[8px] uppercase tracking-wider text-center"
                :class="currentStep >= i ? 'text-white' : 'text-white/50'">{{ step }}</span>
            </div>
            <div v-if="i < steps.length - 1" class="h-px flex-1 min-w-[20px] transition-all"
              :class="currentStep > i ? 'bg-gold' : 'bg-white/10'"></div>
          </div>
        </div>

        <!-- STEP 0: Clan Discovery -->
        <div v-if="currentStep === 0" class="step-content animate-in">
          <div class="glass-card !p-8">
            <h3 class="font-black text-xl mb-2 text-white">Mon Clan</h3>
            <p class="text-white/40 text-[10px] uppercase tracking-widest font-bold mb-4">
              Étape 1: Éligibilité
            </p>
            <p class="text-white/60 text-sm mb-6 leading-relaxed">
              Vérifiez si votre clan est éligible à participer à la CCA National
              League. Nous analysons en temps réel la localisation et le niveau
              HDV.
            </p>

            <div v-if="clanLoading" class="text-center py-10">
              <div class="spinner-sm mx-auto mb-3"></div>
              <p class="text-white/40 text-xs">Vérification de votre clan...</p>
            </div>

            <div v-else-if="myClan"
              class="clan-confirm-card p-6 rounded-2xl border border-gold/20 bg-gold/5 flex flex-col items-center text-center">
              <img :src="myClan.badge_url" class="w-20 h-20 object-contain mb-4" />
              <h4 class="font-black text-2xl text-white">{{ myClan.name }}</h4>
              <p class="text-white/40 text-[10px] uppercase tracking-[0.2em] mt-1">
                {{ myClan.tag_coc }} · Niveau {{ myClan.clan_level }}
              </p>
              <div v-if="myClan.location" class="mt-2 flex items-center gap-1">
                <span class="text-xs">{{
                  myClan.location.name === "Cameroon" ? "🇨🇲" : "🌍"
                }}</span>
                <span class="text-[9px] font-black uppercase tracking-widest" :class="myClan.location.name === 'Cameroon'
                  ? 'text-gold'
                  : 'text-red-500'
                  ">{{ myClan.location.name }}</span>
              </div>

              <div v-if="myClan" class="mt-4 px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest"
                :class="isEligible
                  ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                  : 'bg-red-500/10 text-red-400 border border-red-500/20'
                  ">
                {{ isEligible ? "Clan Éligible ✓" : "Clan Non Éligible ✕" }}
              </div>

              <div class="mt-6 pt-6 border-t border-white/5 w-full space-y-4">
                <!-- Location Error -->
                <div v-if="myClan.location?.name !== 'Cameroon'"
                  class="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex gap-3">
                  <span class="text-xl">🌍</span>
                  <p class="text-[10px] text-red-400 leading-relaxed font-bold">
                    <span class="block text-white uppercase mb-1">Localisation Invalide</span>
                    Désolé, seuls les clans d'origine Camerounaise peuvent
                    participer. Changez la localisation de votre clan dans CoC
                    ou rejoignez un clan Camerounais.
                  </p>
                </div>

                <!-- HDV Error -->
                <div v-if="user?.hdv_level < 14"
                  class="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex gap-3">
                  <span class="text-xl">🏗️</span>
                  <p class="text-[10px] text-red-400 leading-relaxed font-bold">
                    <span class="block text-white uppercase mb-1">HDV insuffisant ({{ user?.hdv_level }})</span>
                    Vous devez avoir un HDV 14 minimum pour initier le processus
                    d'inscription du clan.
                  </p>
                </div>

                <button class="btn-next w-full" @click="" :disabled="!isEligible || preRegistering">
                  <span v-if="preRegistering">Enregistrement...</span>
                  <span v-else-if="isEligible">Inscription des clans achevée</span>
                  <span v-else>Inéligible au Tournoi</span>
                </button>
              </div>
            </div>

            <div v-else class="text-center py-10">
              <h3 class="text-white font-black uppercase tracking-widest mb-4">
                Critères d'Éligibilité
              </h3>
              <p class="text-white/40 text-sm mb-6 leading-relaxed">
                Pour garantir l'intégrité et la compétitivité de la
                <span class="text-white font-bold italic text-gold">CCA National League</span>, votre clan doit remplir
                deux conditions majeures :
                <br /><br />
                <span class="text-[#d4af37]">1. Localisation :</span> Le clan
                doit être officiellement localisé au **Cameroun** sur Clash of
                Clans.
                <br />
                <span class="text-[#d4af37]">2. Niveau Requis :</span> Vous
                devez posséder un **HDV 14 minimum** pour initier le processus
                d'inscription au nom de votre clan.
              </p>
              <div class="p-4 bg-white/5 rounded-xl border border-white/10 mb-8 inline-block mx-auto">
                <p class="text-[10px] text-white/40 italic">
                  Veuillez synchroniser vos données via le bouton
                  <LucideRefreshCw :size="16" class="inline" /> si vous
                  venez de changer de clan ou de ligue.
                </p>
              </div>
              <NuxtLink to="/clans" class="btn-tournament primary">Découvrir les Clans</NuxtLink>
            </div>
          </div>
        </div>

        <!-- STEP 1: Composition Roster -->
        <div v-if="currentStep === 1" class="step-content animate-in">
          <div class="glass-card !p-8">
            <h3 class="font-black text-xl mb-2 text-white">
              Composition du Roster
            </h3>
            <p class="text-white/40 text-[10px] uppercase tracking-widest font-bold mb-4">
              Étape 2: Équipe d'Élite
            </p>

            <!-- CAS A: L'utilisateur n'est PAS le capitaine désigné -->
            <div v-if="!isClanCaptain" class="space-y-6 animate-in">
              <!-- Roster non composé -->
              <div v-if="!hasDraftedRoster" class="text-center py-10 space-y-4">
                <div class="p-4 bg-white/5 border border-white/10 rounded-xl">
                  <p class="text-white/60 text-sm leading-relaxed">
                    Le Capitaine de votre clan n'a pas encore composé le roster
                    pour ce tournoi.
                    <br /><br />
                    Seul le capitaine officiel désigné par l'administration peut
                    composer et valider le roster. Veuillez patienter ou le
                    contacter.
                  </p>
                </div>
                <NuxtLink to="/tournaments" class="btn-tournament secondary">
                  Retour au Tournoi
                </NuxtLink>
              </div>

              <!-- Roster composé -->
              <div v-else class="space-y-6">
                <div class="p-4 bg-white/5 border border-white/10 rounded-xl">
                  <p class="text-white/60 text-sm leading-relaxed">
                    Le Capitaine de votre clan a validé la composition de
                    l'équipe. Voici la composition actuelle :
                  </p>
                </div>

                <!-- Starters (Lecture Seule) -->
                <div class="space-y-3">
                  <p class="text-[10px] font-black uppercase text-gold tracking-widest">
                    Titulaires ({{ starters.length }}/5)
                  </p>
                  <div v-for="p in starters" :key="p.tag_coc"
                    class="p-3 bg-gold/5 border border-gold/10 rounded-xl flex items-center justify-between">
                    <span class="text-xs font-bold text-white">{{
                      p.name
                    }}</span>
                    <span class="text-[9px] uppercase font-bold text-gold">HDV {{ p.townHallLevel || p.hdv_position
                    }}</span>
                  </div>
                </div>

                <!-- Subs (Lecture Seule) -->
                <div class="space-y-3">
                  <p class="text-[10px] font-black uppercase text-white/40 tracking-widest">
                    Remplaçants ({{ substitutes.length }}/5)
                  </p>
                  <div v-for="p in substitutes" :key="p.tag_coc"
                    class="p-3 bg-white/3 border border-white/8 rounded-xl flex items-center justify-between opacity-60">
                    <span class="text-xs font-bold text-white">{{
                      p.name
                    }}</span>
                    <span class="text-[9px] uppercase font-bold text-white/60">HDV {{ p.townHallLevel || p.hdv_position
                    }}</span>
                  </div>
                </div>

                <div class="mt-10 pt-8 border-t border-white/5 flex gap-4">
                  <button class="btn-back flex-1" @click="currentStep = 0">
                    Retour
                  </button>
                  <button class="btn-next flex-2 cursor-pointer" @click="currentStep = 2">
                    Continuer vers la Confirmation →
                  </button>
                </div>
              </div>
            </div>

            <!-- CAS B: L'utilisateur EST le capitaine désigné -->
            <div v-else class="space-y-6">
              <p class="text-white/60 text-sm mb-6 leading-relaxed">
                Félicitations Capitaine ! Formez votre unité d'élite pour ce
                tournoi :
                <br /><br />
                1. <b>Titulaires (5) :</b> Sélectionnez 5 membres principaux.
                Ils doivent posséder chacun des HDV de 14 à 18 uniques.
                <br />
                2. <b>Remplaçants (jusqu'à 5) :</b> Ajoutez des joueurs de
                réserve.
              </p>

              <!-- (Reuse existing roster composition UI but with improved styling) -->
              <div class="space-y-6">
                <!-- Add Player / Filter Clan Members -->
                <div class="p-4 bg-white/3 border border-white/5 rounded-2xl">
                  <p class="text-[10px] font-black uppercase text-white/40 tracking-widest mb-4">
                    Ajouter au Roster
                  </p>
                  <!-- {{clanMembers}} -->
                  <select v-model="selectedMemberTag" class="field-input mb-3">
                    <option value="">Sélectionner un membre du clan...</option>
                    <option v-for="m in clanMembers.members" :key="m?.tag_coc" :value="m?.tag_coc" class="text-black">
                      {{ m?.name }}
                      <!-- {{ m }} -->
                      (HDV {{ m.townHallLevel }})
                    </option>
                  </select>
                  <div class="flex gap-2">
                    <button
                      class="flex-1 py-3 bg-white/5 text-white/60 text-[10px] font-black uppercase tracking-widest rounded-lg"
                      @click="addToRoster(false)">
                      + Titulaire
                    </button>
                    <button
                      class="flex-1 py-3 bg-white/5 text-white/60 text-[10px] font-black uppercase tracking-widest rounded-lg"
                      @click="addToRoster(true)">
                      + Remplaçant
                    </button>
                  </div>
                </div>

                <!-- Starters (Must Pay) -->
                <div class="space-y-3">
                  <p class="text-[10px] font-black uppercase text-gold tracking-widest flex justify-between">
                    Titulaires <span>{{ starters.length }}/5</span>
                  </p>
                  <div v-for="p in starters" :key="p.tag_coc"
                    class="p-3 bg-gold/5 border border-gold/10 rounded-xl flex items-center justify-between">
                    <span class="text-xs font-bold text-white">{{
                      p.name
                    }}</span>
                    <button @click="removeFromRoster(p.tag_coc)" class="text-white/20 hover:text-red-400">
                      ✕
                    </button>
                  </div>
                </div>

                <!-- Subs -->
                <div class="space-y-3">
                  <p class="text-[10px] font-black uppercase text-white/40 tracking-widest flex justify-between">
                    Remplaçants (De réserve)
                    <span>{{ substitutes.length }}/5</span>
                  </p>
                  <div v-for="p in substitutes" :key="p.tag_coc"
                    class="p-3 bg-white/3 border border-white/8 rounded-xl flex items-center justify-between opacity-60">
                    <span class="text-xs font-bold text-white">{{
                      p.name
                    }}</span>
                    <button @click="removeFromRoster(p.tag_coc)" class="text-white/20 hover:text-red-400">
                      ✕
                    </button>
                  </div>
                </div>
              </div>

              <div v-if="rosterValidationError"
                class="mt-4 p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-xl font-bold text-left">
                <LucideAlertCircle :size="16" class="inline mr-1" /> {{ rosterValidationError }}
              </div>

              <div class="mt-10 pt-8 border-t border-white/5 flex gap-4">
                <button class="btn-back flex-1" @click="currentStep = 0">
                  Retour
                </button>
                <button class="btn-next flex-2 cursor-pointer" :disabled="rosterValidationError !== null"
                  @click="submitRoster">
                  Valider l'Équipe →
                </button>
              </div>
              <div class="mt-4 text-center" v-if="roster.length > 0">
                <button class="text-white/60 text-xs italic hover:text-white cursor-pointer"
                  :disabled="rosterValidationError !== null" @click="currentStep = 2">
                  Ignorer les modifications et passer à l'étape suivante →
                </button>
              </div>
            </div>
          </div>
        </div>
        <!-- {{ currentStep }} -->
        <!-- STEP 2: Confirmation Finale -->
        <div v-if="currentStep === 2" class="step-content animate-in text-center">
          <div class="glass-card !p-12">
            <div
              class="w-20 h-20 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl">
              ✓
            </div>
            <h1 class="text-3xl font-black text-white italic mb-2">
              FÉLICITATIONS !
            </h1>
            <p class="text-white/40 text-[10px] uppercase tracking-widest font-bold mb-8">
              Étape 3: Inscription Terminée
            </p>

            <div class="glass-card !p-8 border-gold/40 mb-8 bg-gold/5">
              <p class="text-white/80 text-sm leading-relaxed mb-4">
                Le roster de votre clan a été enregistré avec succès et votre inscription est
                <b>confirmée</b> ! Voici la suite du processus : <br /><br />
                • <b>Guerres de tournois :</b> Les matchs débutent conformément au planning.
                <br />
                • <b>Engagement :</b> Votre présence aux guerres programmées est obligatoire.
                Veuillez rester en contact direct avec votre Capitaine.
              </p>
              <p class="text-gold text-xs font-black uppercase tracking-widest animate-pulse">
                Bonne chance pour la compétition ! ⚡️🏆
              </p>
            </div>

            <div class="flex flex-col sm:flex-row gap-4 mt-6">
              <NuxtLink to="/tournaments/my-clan" class="btn-premium btn-outline w-full text-xs !py-3 flex items-center justify-center">
                Accéder à mon Hub Clan
              </NuxtLink>
              <button
                v-if="isClanCaptain && !bracketsGenerated"
                class="btn-premium btn-primary w-full text-xs !py-3"
                @click="currentStep = 1">
                Modifier le Roster
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const { $api, $toast } = useNuxtApp();
const { user, fetchUser } = useAuth();
const route = useRoute();

const error = ref(null);

const competitionId = 1;
const currentStep = ref(0);
const steps = ["Mon Clan", "Roster", "Confirmation"];

const registration = ref(null);
const bracketsGenerated = ref(false);

const myPayment = computed(() => {
  if (!registration.value || !user.value) return null;
  return registration.value.payments?.find(
    (p) => p.user_id === user.value.id || p.player_tag === user.value.tag_coc,
  );
});

const hasPaid = computed(() => {
  return myPayment.value?.status === "confirmed";
});

const clanLoading = ref(true);
const myClan = ref(null);
const clanMembers = ref([]);
const roster = ref([]);
const selectedMemberTag = ref("");
const submitting = ref(false);
// toast
const paymentData = ref({ phone: "", ref: "" });
const payMethod = ref("orange");

const starters = computed(() => roster.value.filter((p) => !p.isSubstitute));
const substitutes = computed(() => roster.value.filter((p) => p.isSubstitute));
const isClanCaptain = computed(() => !!user.value?.capitained_clan);
const isStarter = computed(() =>
  starters.value.some((p) => p.tag_coc === user.value?.tag_coc),
);
const hasDraftedRoster = computed(() => roster.value.length > 0);
const isMemberOfRoster = computed(() => {
  if (!user.value || !roster.value.length) return false;
  return roster.value.some((p) => p.tag_coc === user.value.tag_coc);
});

const isEligible = computed(() => {
  const isCameroon = myClan.value?.location?.name === "Cameroon";
  const hasHdv = user.value?.hdv_level >= 14;
  return isCameroon && hasHdv;
});

const rosterValidationError = computed(() => {
  if (starters.value.length === 0) return null;

  if (starters.value.length !== 5) {
    return "Le roster principal doit contenir exactement 5 joueurs titulaires.";
  }

  const hdvLevels = starters.value.map((p) => {
    return parseInt(
      p.townHallLevel ||
      p.townHall_level ||
      p.townhall_level ||
      p.hdv_level ||
      p.hdv_position ||
      0,
      10,
    );
  });

  const requiredLevels = [14, 15, 16, 17, 18];
  for (const lvl of requiredLevels) {
    const count = hdvLevels.filter((h) => h === lvl).length;
    if (count !== 1) {
      return `Le roster principal doit comporter exactement un joueur d'HDV ${lvl} (actuel : ${count}).`;
    }
  }

  return null;
});

const fetchInitialData = async () => {
  clanLoading.value = true;
  error.value = null;
  try {
    const me = await $api("/auth/me");

    if (!me) {
      error.value = "Session expirée. Veuillez vous reconnecter.";
      return;
    }

    if (me.status !== "validated") {
      error.value =
        "Votre profil doit être validé par la CCA pour accéder aux détails de votre clan.";
      return;
    }

    if (me.current_clan_tag) {
      // On récupère les infos du clan via notre API (qui elle appelle CoC)
      const tag = me.current_clan_tag.replace("#", "");
      const cocClan = await $api(`/clans/${tag}`);

      if (cocClan) {
        myClan.value = {
          tag_coc: cocClan.tag_coc,
          name: cocClan.name,
          badge_url: cocClan.badge_url,
          clan_level: cocClan.clan_level,
          location: cocClan.location,
          captain_id: me.capitained_clan?.captain_id,
        };
        // Vérification de la localisation
        if (myClan.value.location?.name === "Cameroon") {
          await checkRegistrationStatus();
          await fetchClanMembers();
        }
      }
    }
  } catch (e) {
    console.error("Erreur lors de la récupération des données initiales:", e);
    if (e.response?.status === 403) {
      error.value =
        e.data?.message ||
        "Votre profil doit être validé par la CCA pour accéder aux détails de votre clan.";
    } else {
      error.value =
        e.data?.message || "Impossible de charger les données d'inscription.";
    }
  } finally {
    clanLoading.value = false;
  }
};

const checkRegistrationStatus = async () => {
  try {
    const response = await $api(
      `/competitions/${competitionId}/registration/status`,
    );
    // Le backend retourne soit l'objet directement, soit { registration: null }
    const reg = response?.registration !== undefined ? response.registration : response;
    registration.value = reg;
    if (reg) {
      if (reg.players) {
        // Restore roster
        roster.value = reg.players.map((p) => ({
          tag_coc: p.user?.tag_coc,
          name: p.user?.name,
          townHallLevel: p.hdv_position || p.user?.hdv_level,
          isSubstitute: p.is_substitute === 1 || p.is_substitute === true,
        }));
      }
      const bg = response?.brackets_generated ?? reg?.brackets_generated ?? false;
      bracketsGenerated.value = bg;

      if ((reg.status === 'confirmed' || reg.status === 'paid') && !(route.query.edit === 'true' && !bg)) {
        currentStep.value = 2;
      } else {
        currentStep.value = 1;
      }
    }
  } catch (e) {
    // Erreur réseau inattendue
    console.warn('Impossible de charger le statut d\'inscription.', e);
  }
};

const preRegistering = ref(false);

const goToRoster = async () => {
  if (!isEligible.value || preRegistering.value) return;
  preRegistering.value = true;
  try {
    await $api(`/competitions/${competitionId}/pre-register`, { method: 'POST' });
    await fetchUser(); // Met à jour l'utilisateur et son capitained_clan
    await checkRegistrationStatus();
    currentStep.value = 1;
  } catch (e) {
    $toast.error(e.data?.message || "Erreur lors du pré-enregistrement du clan.");
  } finally {
    preRegistering.value = false;
  }
};

const goToRosterStep = () => {
  currentStep.value = 1;
};

const fetchClanMembers = async () => {
  try {
    clanMembers.value = await $api(`/clans/my-clan/members`);
    // console.log(clanMembers.value);
  } catch (e) {
    console.log(e);
  }
};

const addToRoster = (isSub) => {
  if (!selectedMemberTag.value) return;
  const member = clanMembers.value.members.find(
    (m) => m.tag_coc === selectedMemberTag.value,
  );
  if (!member) return;
  if (roster.value.some((p) => p.tag_coc === member.tag_coc)) return;

  roster.value.push({ ...member, isSubstitute: isSub });
  selectedMemberTag.value = "";
};

const removeFromRoster = (tag) => {
  roster.value = roster.value.filter((p) => p.tag_coc !== tag);
};

const submitRoster = async () => {
  try {
    await $api(`/competitions/${competitionId}/register-team`, {
      method: "POST",
      body: {
        players: roster.value.map((p) => ({
          ...p,
          is_substitute: p.isSubstitute,
        })),
      },
    });
    $toast.success("Équipe enregistrée ! Inscription validée.");
    currentStep.value = 2;
  } catch (e) {
    $toast.error(e.data?.message || "Erreur lors de l'enregistrement");
  }
};

const submitPayment = async () => {
  try {
    const response = await $api(
      `/competitions/${competitionId}/registration/status`,
    );
    const reg = response?.registration !== undefined ? response.registration : response;
    if (!reg?.id) {
      $toast.error("Aucune inscription active trouvée pour ce tournoi.");
      return;
    }
    const res = await $api(`/registrations/${reg.id}/pay`, {
      method: "POST",
    });
    if (res.success && res.redirect_url) {
      $toast.success("Redirection vers la passerelle NotchPay...");
      window.location.href = res.redirect_url;
    } else {
      $toast.error(res.message || "Impossible d'initialiser le paiement.");
    }
  } catch (e) {
    $toast.error(e.data?.message || "Échec de l'initialisation du paiement");
    console.error("NotchPay init error:", e);
  }
};

onMounted(async () => {
  const router = useRouter();
  fetchInitialData()
  // router.replace({ path: "/tournaments", query: { showLaunchModal: "false" } });
});
</script>

<style scoped>
.register-page {
  background: #06070a;
  color: white;
}

.status-badge-compact {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 16px;
  border-radius: 40px;
  font-size: 0.65rem;
  font-weight: 900;
  background: rgba(212, 175, 55, 0.1);
  border: 1px solid rgba(212, 175, 55, 0.2);
  color: var(--gold);
}

.pulse-dot {
  width: 6px;
  height: 6px;
  background: var(--gold);
  border-radius: 50%;
}

.field-input {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 12px;
  color: white;
  width: 100%;
  font-size: 0.9rem;
}

.btn-next {
  background: var(--gold);
  color: rgb(253, 249, 249);
  font-weight: 900;
  padding: 14px;
  border-radius: 12px;
  font-size: 0.85rem;
  text-transform: uppercase;
}

.btn-next:disabled {
  opacity: 0.3;
}

.pay-method-btn {
  padding: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 800;
  color: white/40;
}

.pay-method-btn.active {
  border-color: var(--gold);
  background: rgba(212, 175, 55, 0.1);
  color: var(--gold);
}

.animate-in {
  animation: fadeIn 0.5s ease backwards;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
