<template>
  <div class="admin-payments-page min-h-screen pb-20">
    <div class="container mx-auto px-4 py-10 max-w-5xl">
      <!-- Header -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <NuxtLink to="/admin/dashboard"
            class="text-xs uppercase tracking-widest text-white/40 hover:text-gold mb-2 block">← Dashboard</NuxtLink>
          <h1 class="text-4xl font-black italic tracking-tighter uppercase">
            Paiements <span class="text-gold">Joueurs</span>
          </h1>
          <p class="text-white/40 text-sm mt-1 uppercase tracking-widest">
            Saison 2 — Validation des paiements individuels
          </p>
        </div>

        <div class="flex gap-3 items-center">
          <div class="text-right">
            <p class="text-[9px] uppercase tracking-widest text-white/40 font-black">En attente</p>
            <p class="text-2xl font-black text-gold">{{ pendingCount }}</p>
          </div>
          <button @click="fetchPayments"
            class="p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-white/60 hover:text-white"
            :disabled="loading">
            🔄
          </button>
        </div>
      </div>

      <!-- Tabs -->
      <div class="flex items-center gap-2 mb-8 bg-white/5 p-1 rounded-2xl w-fit border border-white/5">
        <button v-for="tab in tabs" :key="tab.key" @click="activeTab = tab.key"
          class="px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
          :class="activeTab === tab.key
            ? 'bg-gold text-black shadow-lg shadow-gold/20'
            : 'text-white/40 hover:text-white'
          ">
          {{ tab.label }} ({{ tab.count }})
        </button>
      </div>

      <!-- Loader -->
      <div v-if="loading" class="py-20 text-center">
        <div class="spinner-sm mx-auto mb-4"></div>
        <p class="text-[10px] uppercase font-black tracking-widest text-white/20">
          Chargement des paiements...
        </p>
      </div>

      <!-- Payments List -->
      <div v-else-if="filteredPayments.length > 0" class="space-y-3">
        <div v-for="payment in filteredPayments" :key="payment.id"
          class="glass-card !p-5 border-white/5 hover:border-white/10 transition-all">
          <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <!-- Player Info -->
            <div class="flex items-center gap-4 flex-1">
              <div class="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center text-gold font-black text-sm">
                {{ payment.hdv_position }}
              </div>
              <div>
                <p class="font-bold text-white text-sm">{{ payment.player_name }}</p>
                <p class="text-[10px] text-white/40 uppercase tracking-wider">
                  {{ payment.player_tag }} · {{ payment.clan_name }}
                  <span v-if="payment.is_substitute" class="ml-1 bg-white/10 px-2 py-0.5 rounded-full text-white/50">Remplaçant</span>
                </p>
              </div>
            </div>

            <!-- Payment Info -->
            <div class="flex items-center gap-4">
              <div class="text-right">
                <p class="text-[9px] uppercase tracking-widest text-white/40 font-black">Numéro paiement</p>
                <p class="text-sm font-bold text-white font-mono">{{ payment.payment_phone || '—' }}</p>
              </div>

              <!-- Status Badge -->
              <div class="status-badge" :class="`status-${payment.payment_status}`">
                {{ statusLabel(payment.payment_status) }}
              </div>
            </div>

            <!-- Actions -->
            <div class="flex gap-2" v-if="payment.payment_status === 'pending'">
              <button @click="confirmPayment(payment)"
                class="px-4 py-2 bg-green-500/20 text-green-400 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-green-500/30 transition-all"
                :disabled="processing === payment.id">
                <span v-if="processing === payment.id">⏳</span>
                <span v-else>✅ Valider</span>
              </button>
              <button @click="rejectPayment(payment)"
                class="px-4 py-2 bg-red-500/10 text-red-400 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-500/20 transition-all"
                :disabled="processing === payment.id">
                <span v-if="processing === payment.id">⏳</span>
                <span v-else>❌ Rejeter</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="py-20 text-center opacity-30">
        <div class="text-5xl mb-4">🎉</div>
        <p class="uppercase font-black tracking-widest text-sm">
          Aucun paiement dans cette catégorie
        </p>
      </div>

      <!-- Registrations Overview -->
      <div class="mt-12">
        <h2 class="text-xl font-black uppercase tracking-tight text-white mb-6">
          Inscriptions — <span class="text-gold">Vue d'ensemble</span>
        </h2>

        <div v-if="loadingRegistrations" class="py-10 text-center">
          <div class="spinner-sm mx-auto mb-4"></div>
        </div>

        <div v-else class="space-y-4">
          <div v-for="reg in registrations" :key="reg.id"
            class="glass-card !p-5 border-white/5">
            <div class="flex items-center justify-between mb-3">
              <div class="flex items-center gap-3">
                <img :src="reg.clan?.badge_url" class="w-8 h-8 object-contain" v-if="reg.clan?.badge_url" />
                <div>
                  <p class="font-bold text-sm text-white">{{ reg.clan?.name || '—' }}</p>
                  <p class="text-[9px] uppercase tracking-widest text-white/40">{{ reg.clan?.tag_coc }}</p>
                </div>
              </div>
              <span class="status-badge" :class="`status-${reg.status}`">
                {{ reg.status }}
              </span>
            </div>

            <!-- Players breakdown -->
            <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
              <div v-for="p in reg.players" :key="p.id"
                class="p-2 rounded-lg border text-center text-[10px]"
                :class="{
                  'bg-green-500/5 border-green-500/20': p.payment_status === 'paid',
                  'bg-yellow-500/5 border-yellow-500/20': p.payment_status === 'pending',
                  'bg-white/3 border-white/8': p.payment_status === 'unpaid',
                }">
                <p class="font-bold text-white truncate">{{ p.user?.name || '—' }}</p>
                <p class="text-white/40 mt-0.5">
                  <span :class="{
                    'text-green-400': p.confirmation_status === 'accepted',
                    'text-red-400': p.confirmation_status === 'declined',
                    'text-white/40': p.confirmation_status === 'pending',
                  }">
                    {{ p.confirmation_status === 'accepted' ? '✅' : p.confirmation_status === 'declined' ? '❌' : '⏳' }}
                  </span>
                  ·
                  <span :class="{
                    'text-green-400': p.payment_status === 'paid',
                    'text-yellow-400': p.payment_status === 'pending',
                    'text-white/30': p.payment_status === 'unpaid',
                  }">
                    {{ p.payment_status === 'paid' ? '💰' : p.payment_status === 'pending' ? '⏳' : '💳' }}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({ middleware: 'auth' });

const { $api, $toast } = useNuxtApp();

const loading = ref(true);
const loadingRegistrations = ref(true);
const processing = ref(null);
const activeTab = ref('pending');
const payments = ref([]);
const registrations = ref([]);

const tabs = computed(() => [
  { key: 'pending', label: 'En attente', count: payments.value.filter(p => p.payment_status === 'pending').length },
  { key: 'all', label: 'Tous', count: payments.value.length },
]);

const pendingCount = computed(() => payments.value.filter(p => p.payment_status === 'pending').length);

const filteredPayments = computed(() => {
  if (activeTab.value === 'pending') {
    return payments.value.filter(p => p.payment_status === 'pending');
  }
  return payments.value;
});

const statusLabel = (status) => {
  const labels = { unpaid: 'Non payé', pending: 'En attente', paid: 'Validé' };
  return labels[status] || status;
};

const fetchPayments = async () => {
  loading.value = true;
  try {
    payments.value = await $api('/admin/tournament-payments');
  } catch (e) {
    console.error('Erreur chargement paiements:', e);
    $toast?.error?.('Erreur lors du chargement des paiements.');
  } finally {
    loading.value = false;
  }
};

const fetchRegistrations = async () => {
  loadingRegistrations.value = true;
  try {
    registrations.value = await $api('/admin/registrations');
  } catch (e) {
    console.error('Erreur chargement inscriptions:', e);
  } finally {
    loadingRegistrations.value = false;
  }
};

const confirmPayment = async (payment) => {
  if (!confirm(`Valider le paiement de ${payment.player_name} (${payment.payment_phone}) ?`)) return;

  processing.value = payment.id;
  try {
    await $api(`/admin/tournament-payments/${payment.id}/confirm`, { method: 'PUT' });
    $toast?.success?.(`Paiement de ${payment.player_name} validé !`);
    await fetchPayments();
    await fetchRegistrations();
  } catch (e) {
    $toast?.error?.(e.data?.message || 'Erreur lors de la validation.');
  } finally {
    processing.value = null;
  }
};

const rejectPayment = async (payment) => {
  if (!confirm(`Rejeter le paiement de ${payment.player_name} ? Le joueur devra soumettre un nouveau numéro.`)) return;

  processing.value = payment.id;
  try {
    await $api(`/admin/tournament-payments/${payment.id}/reject`, { method: 'PUT' });
    $toast?.success?.(`Paiement de ${payment.player_name} rejeté.`);
    await fetchPayments();
    await fetchRegistrations();
  } catch (e) {
    $toast?.error?.(e.data?.message || 'Erreur lors du rejet.');
  } finally {
    processing.value = null;
  }
};

onMounted(async () => {
  await Promise.all([fetchPayments(), fetchRegistrations()]);
});

useHead({
  title: 'Admin — Paiements Joueurs | CCA National League',
});
</script>

<style scoped>
.admin-payments-page {
  background: radial-gradient(circle at 100% 0%,
      rgba(212, 175, 55, 0.08) 0%,
      transparent 40%);
}

.status-badge {
  padding: 4px 10px;
  border-radius: 8px;
  font-size: 9px;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  white-space: nowrap;
}

.status-pending,
.status-pending_confirmations {
  background: rgba(245, 158, 11, 0.15);
  color: #f59e0b;
}

.status-pending_payments {
  background: rgba(99, 102, 241, 0.15);
  color: #818cf8;
}

.status-confirmed,
.status-paid {
  background: rgba(74, 222, 128, 0.15);
  color: #4ade80;
}

.status-unpaid {
  background: rgba(255, 255, 255, 0.05);
  color: rgba(255, 255, 255, 0.4);
}

.status-pending_payment {
  background: rgba(245, 158, 11, 0.1);
  color: #d97706;
}

.spinner-sm {
  width: 30px;
  height: 30px;
  border: 2px solid rgba(255, 255, 255, 0.03);
  border-top-color: var(--gold, #d4af37);
  border-radius: 50%;
  animation: spin 0.8s infinite linear;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
