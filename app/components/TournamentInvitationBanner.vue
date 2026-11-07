<template>
  <Transition name="slide-down">
    <div v-if="invitation && state" class="sm:left-auto z-[90] sm:max-w-sm overflow-hidden
             backdrop-blur-md shadow-2xl border text-white
             bg-gradient-to-r" :class="bannerClass">
      <!-- ═══ LIGNE 1 : message + actions ═══ -->
      <div class="flex items-start gap-2 pl-2.5 pr-1.5 py-2">

        <img v-if="invitation?.clan_badge" :src="invitation?.clan_badge" :alt="invitation?.clan_name"
          class="w-7 h-7 rounded object-contain bg-white/15 p-0.5 flex-shrink-0 mt-0.5" />

        <div class="flex-1 min-w-0">
          <!-- <p class="font-bold text-[0.8rem] leading-tight flex items-center gap-1.5">
            <span v-if="state.pulse" class="w-1.5 h-1.5 rounded-full bg-white animate-pulse flex-shrink-0" />
            <LucideCheckCircle v-if="state.icon === 'check'" class="w-3.5 h-3.5 flex-shrink-0" />
            <LucideXCircle v-if="state.icon === 'x'" class="w-3.5 h-3.5 flex-shrink-0" />
            {{ state.title }}
          </p> -->
          <p class="text-[0.68rem] opacity-85 leading-snug mt-0.5">
            {{ state.subtitle }}
          </p>
        </div>

        <div class="flex items-center gap-1.5 flex-shrink-0 mt-0.5">
          <template v-if="state.key === 'pending'">
            <button @click="acceptInvitation" :disabled="!!loading" title="Accepter" class="w-7 h-7 rounded-full bg-white/95 text-emerald-600 hover:bg-white
                     flex items-center justify-center transition-transform hover:scale-110
                     disabled:opacity-50 cursor-pointer">
              <LucideCheck v-if="loading !== 'accept'" class="w-4 h-4" />
              <span v-else
                class="w-3 h-3 border-2 border-emerald-600/30 border-t-emerald-600 rounded-full animate-spin" />
            </button>
            <button @click="declineInvitation" :disabled="!!loading" title="Refuser" class="w-7 h-7 rounded-full bg-white/15 border border-white/30
                     hover:bg-red-500/30 flex items-center justify-center
                     transition-colors disabled:opacity-50 cursor-pointer">
              <LucideX v-if="loading !== 'decline'" class="w-4 h-4" />
              <span v-else class="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            </button>
          </template>

          <button @click="dismiss" title="Masquer" class="w-6 h-6 rounded-full hover:bg-white/20 flex items-center justify-center
                   text-white/70 hover:text-white transition-colors cursor-pointer">
            <LucideX class="w-3 h-3" />
          </button>
        </div>
      </div>

      <!-- ═══ LIGNE 2 : formulaire de paiement (uniquement étape paiement) ═══ -->
      <div v-if="state.key === 'payment-form'" class="flex items-center gap-1.5 px-2.5 pb-2">
        <input v-model="paymentPhone" type="tel" placeholder="Ex : 6 90 00 00 00" maxlength="20" :disabled="!!loading"
          class="flex-1 px-2.5 py-1.5 rounded-md bg-white/95 text-gray-800
                 text-[0.72rem] font-semibold border-2 border-white/50
                 focus:outline-none focus:border-white
                 placeholder:text-gray-400 disabled:opacity-60" />
        <button @click="submitPayment" :disabled="!!loading || !paymentPhone" title="Soumettre le numéro" class="h-8 px-3 rounded-md bg-white/95 text-amber-600 hover:bg-white
                 flex items-center justify-center gap-1
                 font-bold text-[0.7rem] uppercase tracking-wider
                 transition-all hover:scale-[1.02] disabled:opacity-50 cursor-pointer">
          <span v-if="loading === 'pay'"
            class="w-3 h-3 border-2 border-amber-600/30 border-t-amber-600 rounded-full animate-spin" />
          <LucideSend v-else class="w-3.5 h-3.5" />
          <span v-if="loading !== 'pay'">Envoyer</span>
        </button>
      </div>

      <!-- Progression (barre ultra-fine) -->
      <div v-if="invitation?.all_players && invitation?.confirmation_status !== 'declined'" class="h-[2px] bg-white/15">
        <div class="h-full bg-white/80 transition-all duration-500" :style="{ width: confirmationProgress + '%' }" />
      </div>
    </div>
  </Transition>
</template>

<script setup>
const { fetchApi } = useApi();
const { $toast } = useNuxtApp();
const { user } = useAuth();

const invitation = ref(null);
const loading = ref(false);
const paymentPhone = ref('');
let pollInterval = null;

const bannerClass = computed(() => {
  if (!invitation.value) return '';
  const cs = invitation.value.confirmation_status;
  const ps = invitation.value.payment_status;
  if (cs === 'declined') return 'from-gray-600/95 to-gray-700/95 border-gray-400/30';
  if (ps === 'paid') return 'from-emerald-500/95 to-emerald-600/95 border-emerald-300/30';
  if (ps === 'pending') return 'from-amber-500/95 to-orange-600/95 border-amber-300/30';
  if (cs === 'accepted') return 'from-sky-500/95 to-indigo-500/95 border-sky-300/30';
  return 'from-indigo-500/95 to-purple-600/95 border-indigo-300/30';
});

const confirmedCount = computed(() =>
  invitation.value?.all_players?.filter(p => p.confirmation_status === 'accepted').length || 0
);
const totalCount = computed(() => invitation.value?.all_players?.length || 0);
const confirmationProgress = computed(() =>
  totalCount.value === 0 ? 0 : Math.round((confirmedCount.value / totalCount.value) * 100)
);

// ═══ État centralisé : titre + sous-titre par étape ═══
const state = computed(() => {
  const inv = invitation.value;
  if (!inv) return null;
  const cs = inv.confirmation_status;
  const ps = inv.payment_status;
  const rs = inv.registration_status;
  const hdv = inv.hdv_position || '—';
  const clan = inv.clan_name || 'votre clan';

  if (cs === 'declined') {
    return {
      key: 'declined',
      title: 'Invitation déclinée',
      subtitle: `Vous avez refusé de rejoindre ${clan}. Aucun frais ne sera prélevé.`,
      icon: 'x',
    };
  }

  if (ps === 'paid') {
    return {
      key: 'paid',
      title: 'Paiement validé',
      subtitle: 'Votre place dans le bracket est confirmée. Bonne chance pour la compétition !',
      icon: 'check',
    };
  }

  if (ps === 'pending') {
    return {
      key: 'payment-pending',
      title: 'Paiement en cours de vérification',
      subtitle: `Numéro soumis : ${inv.payment_phone || '—'}. Un admin validera sous 24h.`,
      pulse: true,
    };
  }

  if (cs === 'accepted' && ps === 'unpaid') {
    return {
      key: 'payment-form',
      title: 'Payez vos frais de participation',
      subtitle: `numéro (MTN ou Orange) avec lequel vous allez payer regler vos frais de participation de 1000f .`,
    };
  }

  if (cs === 'accepted' && rs === 'pending_confirmations') {
    return {
      key: 'waiting',
      title: 'Participation confirmée',
      subtitle: `En attente des confirmations des autres joueurs (${confirmedCount.value}/${totalCount.value}).`,
      pulse: true,
    };
  }

  if (cs === 'pending') {
    return {
      key: 'pending',
      title: 'Confirmez votre invitation',
      subtitle: `Clan ${clan} · vous êtes sélectionné(e) en HDV ${hdv}. Acceptez-vous de participer ?`,
    };
  }

  return null;
});

const fetchInvitation = async () => {
  if (!user.value) return;
  try {
    const data = await fetchApi('/tournament/my-invitation');
    invitation.value = Array.isArray(data) && data.length > 0 ? data[0] : null;
  } catch { /* silencieux */ }
};

const acceptInvitation = async () => {
  if (!invitation.value) return;
  loading.value = 'accept';
  try {
    await fetchApi(`/tournament/invitations/${invitation.value.id}/accept`, { method: 'POST' });
    $toast.success('Invitation acceptée !');
    await fetchInvitation();
  } catch (e) {
    $toast.error(e?.data?.message || "Erreur lors de l'acceptation.");
  } finally { loading.value = false; }
};

const declineInvitation = async () => {
  if (!invitation.value) return;
  loading.value = 'decline';
  try {
    await fetchApi(`/tournament/invitations/${invitation.value.id}/decline`, { method: 'POST' });
    $toast.success('Invitation déclinée.');
    await fetchInvitation();
  } catch (e) {
    $toast.error(e?.data?.message || "Erreur lors du déclin.");
  } finally { loading.value = false; }
};

const submitPayment = async () => {
  if (!invitation.value || !paymentPhone.value) return;
  loading.value = 'pay';
  try {
    await fetchApi(`/tournament/invitations/${invitation.value.id}/submit-payment`, {
      method: 'POST',
      body: { payment_phone: paymentPhone.value },
    });
    $toast.success('Numéro de paiement soumis !');
    paymentPhone.value = '';
    await fetchInvitation();
  } catch (e) {
    $toast.error(e?.data?.message || "Erreur lors de la soumission du paiement.");
  } finally { loading.value = false; }
};

const dismiss = () => { invitation.value = null; };

onMounted(async () => {
  await fetchInvitation();
  pollInterval = setInterval(fetchInvitation, 15000);
});
onUnmounted(() => pollInterval && clearInterval(pollInterval));
</script>

<style scoped>
.slide-down-enter-active,
.slide-down-leave-active {
  transition: transform 0.4s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.3s ease;
}

.slide-down-enter-from,
.slide-down-leave-to {
  transform: translateY(-12px);
  opacity: 0;
}
</style>