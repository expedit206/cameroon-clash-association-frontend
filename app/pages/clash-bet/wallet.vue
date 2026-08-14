<template>
  <div class="min-h-screen bg-[#06070a] text-white pb-20 pt-24">

    <!-- ═══ ECRAN DE MAINTENANCE SI DESACTIVE EN BDD ═══ -->
    <div v-if="!canAccessClashBet" class="container mx-auto px-4 max-w-2xl py-20 text-center space-y-5">
      <div class="w-20 h-20 bg-gold/10 border border-gold/30 rounded-3xl flex items-center justify-center text-4xl mx-auto shadow-[0_0_30px_rgba(212,175,55,0.2)]">
        🔒
      </div>
      <h2 class="text-3xl font-black italic uppercase text-white tracking-tight">Accès Portefeuille Désactivé</h2>
      <p class="text-white/60 text-sm leading-relaxed max-w-md mx-auto">
        Le module Clash Bet P2P et l'accès au portefeuille sont actuellement suspendus par l'administration.
      </p>
      <NuxtLink to="/" class="inline-block px-6 py-3 bg-gradient-to-r from-gold to-yellow-600 text-black font-black text-xs uppercase tracking-wider rounded-xl hover:brightness-110 transition-all">
        ← Retourner à l'accueil
      </NuxtLink>
    </div>

    <div v-else class="container mx-auto px-4 max-w-4xl">

      <!-- ═══ PAGE HEADER ═══ -->
      <div class="flex items-center gap-3 mb-8">
        <NuxtLink to="/clash-bet"
          class="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:text-gold hover:border-gold/30 transition-all">
          ←
        </NuxtLink>
        <div>
          <h1 class="text-2xl sm:text-3xl font-black italic uppercase tracking-tight flex items-center gap-2">
            💳 CCA <span class="text-gold">WALLET</span>
          </h1>
          <p class="text-[11px] text-white/40">Rechargements, retraits et historique de vos fonds</p>
        </div>
      </div>

      <!-- ═══ BALANCE CARDS ═══ -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        <div class="balance-card border-gold/30 bg-gold/5">
          <span class="balance-label">Disponible</span>
          <span class="balance-value text-gold">{{ formatFcfa(wallet?.balance) }}</span>
        </div>
        <div class="balance-card">
          <span class="balance-label">En Jeu</span>
          <span class="balance-value text-orange-400">{{ formatFcfa(wallet?.locked_amount) }}</span>
        </div>
        <div class="balance-card">
          <span class="balance-label">Gains</span>
          <span class="balance-value text-green-400">+{{ formatFcfa(wallet?.total_won) }}</span>
        </div>
        <div class="balance-card">
          <span class="balance-label">Retraits</span>
          <span class="balance-value text-white/60">{{ formatFcfa(wallet?.total_withdrawn) }}</span>
        </div>
      </div>

      <!-- ═══ DEPOSIT / WITHDRAWAL TABS & FORMS ═══ -->
      <div class="mb-8">
        <!-- Navigation Onglets Dépôt / Retrait -->
        <div class="flex items-center gap-2 p-1 bg-white/5 border border-white/10 rounded-2xl mb-6 max-w-md mx-auto">
          <button @click="activeTab = 'deposit'"
            :class="['flex-1 py-2.5 px-4 rounded-xl text-xs font-black uppercase transition-all flex items-center justify-center gap-2', activeTab === 'deposit' ? 'bg-gold text-black shadow-lg shadow-gold/20' : 'text-white/60 hover:text-white']">
            <span>📥</span>
            <span>Dépôt</span>
          </button>
          <button @click="activeTab = 'withdraw'"
            :class="['flex-1 py-2.5 px-4 rounded-xl text-xs font-black uppercase transition-all flex items-center justify-center gap-2', activeTab === 'withdraw' ? 'bg-gold text-black shadow-lg shadow-gold/20' : 'text-white/60 hover:text-white']">
            <span>📤</span>
            <span>Retrait</span>
          </button>
        </div>

        <div class="max-w-xl mx-auto">

          <!-- SECTION DÉPÔT -->
          <div v-if="activeTab === 'deposit'" class="form-card">
            <div class="form-card-header">
              <span class="text-2xl">📥</span>
              <div>
                <h3 class="font-black text-base uppercase tracking-wide text-white">Recharger mon solde</h3>
                <p class="text-[11px] text-white/40">Guichet de paiement sécurisé (CinetPay / Mobile Money)</p>
              </div>
            </div>

            <form @submit.prevent="handleDeposit" class="space-y-4 mt-5">
              <div class="quick-amounts">
                <button v-for="q in [1000, 2000, 5000, 10000]" :key="q" type="button" @click="depositForm.amount = q"
                  :class="['quick-amount-btn', depositForm.amount === q ? 'active' : '']">
                  +{{ formatFcfaShort(q) }}
                </button>
              </div>

              <div class="field-group">
                <label class="field-label">Montant à recharger (FCFA)</label>
                <input v-model.number="depositForm.amount" type="number" min="100" required placeholder="Ex: 5000"
                  class="field-input text-lg font-black text-gold" />
              </div>

              <div class="p-3 bg-gold/10 border border-gold/20 rounded-xl text-xs text-gold/90 space-y-1">
                <div class="font-bold flex items-center gap-1.5">
                  <span>🔒 Paiement Direct & Sécurisé</span>
                </div>
                <p class="text-[10px] text-white/60">
                  Aucune information personnelle n'est requise ici. Vous saisirez votre numéro de téléphone et validerez
                  votre paiement directement sur la fenêtre sécurisée CinetPay.
                </p>
              </div>

              <button type="submit" :disabled="depositing || depositForm.amount < 100"
                class="w-full py-4 bg-gradient-to-r from-gold to-yellow-600 text-black font-black uppercase text-sm rounded-xl hover:shadow-[0_0_25px_rgba(212,175,55,0.4)] transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer">
                <span v-if="depositing">⏳ Ouverture du guichet...</span>
                <span v-else>Procéder au dépôt ({{ formatFcfa(depositForm.amount) }}) →</span>
              </button>
            </form>
          </div>

          <!-- SECTION RETRAIT -->
          <div v-else-if="activeTab === 'withdraw'" class="form-card">
            <div class="form-card-header">
              <span class="text-2xl">📤</span>
              <div>
                <h3 class="font-black text-base uppercase tracking-wide text-white">Demander un retrait</h3>
                <p class="text-[11px] text-white/40">Frais de plateforme : 10% — Traitement rapide</p>
              </div>
            </div>

            <form @submit.prevent="handleWithdraw" class="space-y-4 mt-5">
              <div class="quick-amounts">
                <button v-for="q in [5000, 10000, 20000, 50000]" :key="q" type="button" @click="withdrawForm.amount = q"
                  :class="['quick-amount-btn', withdrawForm.amount === q ? 'active' : '']">
                  {{ formatFcfaShort(q) }}
                </button>
              </div>

              <div class="field-group">
                <label class="field-label">Montant du retrait (FCFA) - Min 1 000 FCFA</label>
                <input v-model.number="withdrawForm.amount" type="number" min="100"  required
                  placeholder="Ex: 5000" class="field-input text-lg font-black text-gold" />
              </div>

              <div class="field-group">
                <label class="field-label">Nom du titulaire du compte (MoMo / OM)</label>
                <input v-model="withdrawForm.account_name" type="text" required
                  placeholder="Nom exact enregistré chez l'opérateur" class="field-input" />
                <span class="text-[9px] text-white/40">Entrez le nom et prénom de la personne détentrice de la
                  puce.</span>
              </div>

              <div class="field-group">
                <label class="field-label">Recevoir sur le réseau</label>
                <select v-model="withdrawForm.payment_method" class="field-input">
                  <option value="orange_money">🟠 Orange Money</option>
                  <option value="mtn_momo">🟡 MTN MoMo</option>
                </select>
              </div>

              <div class="field-group">
                <label class="field-label">Numéro de réception Mobile Money</label>
                <input v-model="withdrawForm.phone_number" type="tel" required placeholder="6XX XXX XXX"
                  class="field-input" />
              </div>

              <!-- Synthèse Frais & Montant Net -->
              <div class="p-3.5 bg-black/50 rounded-xl border border-white/10 space-y-2 text-xs">
                <div class="flex justify-between text-white/50">
                  <span>Frais de transfert (10%)</span>
                  <span class="text-amber-400 font-bold">- {{ formatFcfa(withdrawalFee) }}</span>
                </div>
                <div class="flex justify-between font-black text-white border-t border-white/10 pt-2">
                  <span>Montant net versé sur votre téléphone</span>
                  <span class="text-green-400 text-sm font-mono">{{ formatFcfa(netWithdrawal) }}</span>
                </div>
              </div>

              <button type="submit"
                :disabled="withdrawing  || !withdrawForm.account_name || !withdrawForm.phone_number || (wallet && wallet.balance < withdrawForm.amount)"
                class="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-black font-black uppercase text-sm rounded-xl hover:brightness-110 transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer">
                <span v-if="withdrawing">⏳ Soumission en cours...</span>
                <span v-else>Confirmer la demande de retrait →</span>
              </button>
            </form>
          </div>

        </div>
      </div>

      <!-- ═══ HISTORIQUE ═══ -->
      <div class="bg-white/[0.02] border border-white/[0.07] rounded-3xl p-5 sm:p-6">
        <div class="flex items-center justify-between mb-5">
          <h3 class="font-black text-sm uppercase tracking-wide flex items-center gap-2">
            📜 Historique <span class="text-gold">des Transactions</span>
          </h3>
          <button @click="fetchTransactions" class="text-xs text-white/30 hover:text-white transition-colors">
            <LucideRefreshCw :size="13" />
          </button>
        </div>

        <!-- Loading -->
        <div v-if="loadingHistory" class="space-y-2">
          <div v-for="n in 5" :key="n" class="h-10 bg-white/5 rounded-xl animate-pulse"></div>
        </div>

        <!-- Empty -->
        <div v-else-if="transactions.length === 0" class="flex flex-col items-center py-12 text-center">
          <span class="text-4xl mb-3">📭</span>
          <p class="text-white/30 text-sm">Aucune transaction enregistrée.</p>
        </div>

        <!-- Transactions list (mobile first: cards, then table on md+) -->
        <div v-else class="space-y-2">
          <div v-for="t in transactions" :key="t.id"
            class="flex items-center gap-3 px-4 py-3 rounded-2xl bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.04] transition-all">
            <!-- Icon -->
            <div
              :class="['w-9 h-9 rounded-xl flex items-center justify-center text-base flex-shrink-0', getTypeIconBg(t.type)]">
              {{ getTypeIcon(t.type) }}
            </div>
            <!-- Info -->
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2">
                <span class="text-xs font-black">{{ getTypeLabel(t.type) }}</span>
                <span class="text-[9px] text-white/30 truncate hidden sm:block">{{ t.description }}</span>
              </div>
              <div class="text-[10px] text-white/30 mt-0.5">{{ formatDate(t.created_at) }}</div>
            </div>
            <!-- Amount -->
            <div class="text-right flex-shrink-0">
              <div :class="['text-sm font-black tabular-nums', isPositive(t.type) ? 'text-green-400' : 'text-white']">
                {{ isPositive(t.type) ? '+' : '-' }}{{ formatFcfa(t.amount) }}
              </div>
              <div class="text-[10px] text-white/30 font-mono">→ {{ formatFcfa(t.balance_after) }}</div>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
const { $api, $toast } = useNuxtApp();
const { user, isLoggedIn } = useAuth();
// import ref
import { ref } from 'vue'

useHead({ title: 'Mon Wallet — CCA Clash Bet' });

const route = useRoute();
const activeTab = ref(route.query.tab === 'withdraw' || route.query.action === 'withdraw' ? 'withdraw' : 'deposit');

const wallet = ref(null);
const transactions = ref([]);
const loadingHistory = ref(true);
const depositing = ref(false);
const withdrawing = ref(false);

const depositForm = ref({
  amount: 2000,
});

const withdrawForm = ref({
  amount: 5000,
  payment_method: 'orange_money',
  phone_number: user.value?.phone_whatsapp || '',
});

const withdrawalFee = computed(() => Math.round((withdrawForm.value.amount || 0) * 0.07));
const netWithdrawal = computed(() => Math.max(0, (withdrawForm.value.amount || 0) - withdrawalFee.value));

const formatFcfa = (n) => { if (!n && n !== 0) return '0 FCFA'; return Number(n).toLocaleString('fr-FR') + ' FCFA'; };
const formatFcfaShort = (n) => { if (n >= 1000) return (n / 1000).toFixed(0) + 'k'; return n; };
const formatDate = (d) => { if (!d) return '-'; return new Date(d).toLocaleString('fr-FR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }); };

const getTypeLabel = (t) => ({ deposit: 'Dépôt', bet_place: 'Mise', bet_win: 'Gain', bet_refund: 'Remboursement', withdrawal: 'Retrait' }[t] || t);
const getTypeIcon = (t) => ({ deposit: '📥', bet_place: '🎯', bet_win: '🏆', bet_refund: '↩️', withdrawal: '📤' }[t] || '💸');
const getTypeIconBg = (t) => ({ deposit: 'bg-green-500/10', bet_place: 'bg-white/5', bet_win: 'bg-amber-500/10', bet_refund: 'bg-blue-500/10', withdrawal: 'bg-red-500/10' }[t] || 'bg-white/5');
const isPositive = (t) => ['deposit', 'bet_win', 'bet_refund'].includes(t);

const fetchWalletData = async () => {
  if (!isLoggedIn.value) return;
  try { wallet.value = await $api('/clash-bet/wallet'); } catch { }
};

const fetchTransactions = async () => {
  if (!isLoggedIn.value) return;
  loadingHistory.value = true;
  try {
    const res = await $api('/clash-bet/wallet/history');
    transactions.value = res.data || res || [];
  } catch { } finally { loadingHistory.value = false; }
};

const handleDeposit = async () => {
  depositing.value = true;
  try {
    const res = await $api('/clash-bet/wallet/deposit', { method: 'POST', body: depositForm.value });
    if (res.checkout_url) { window.location.href = res.checkout_url; }
    else { $toast.success('Redirection initiée.'); }
  } catch (e) { $toast.error(e?.data?.message || e?.message || 'Erreur initialisation dépôt.'); }
  finally { depositing.value = false; }
};

const handleWithdraw = async () => {
  withdrawing.value = true;
  try {
    const res = await $api('/clash-bet/wallet/withdraw', { method: 'POST', body: withdrawForm.value });
    $toast.success(res.message || 'Demande de retrait soumise.');
    await fetchWalletData();
    await fetchTransactions();
  } catch (e) { $toast.error(e?.data?.message || e?.message || 'Erreur retrait.'); }
  finally { withdrawing.value = false; }
};

const verifyPendingDeposit = async (ref) => {
  try {
    const res = await $api(`/clash-bet/wallet/verify-deposit/${ref}`, { method: 'POST' });
    if (res.success) {
      $toast.success('Dépôt vérifié et crédité avec succès !');
      await fetchWalletData();
      await fetchTransactions();
    } else if (res.status === 'pending') {
      $toast.info("Paiement en cours de traitement par l'opérateur.");
    } else {
      $toast.error('Statut du paiement : ' + res.status);
    }
  } catch (e) { console.error(e); }
};

const { canAccessClashBet, fetchPublicConfig } = useClashBetConfig();

onMounted(async () => {
  await fetchPublicConfig();
  if (!canAccessClashBet.value) return;

  const route = useRoute();
  const ref = route.query.reference || route.query.trx_reference;
  if (ref) {
    await verifyPendingDeposit(ref);
  } else if (route.query.payment === 'success' || route.query.payment === 'complete') {
    $toast.success('Dépôt effectué ! Vos fonds apparaissent dans votre solde.');
  } else if (route.query.payment === 'failed') {
    $toast.error('Le paiement NotchPay a été annulé ou a échoué.');
  }
  fetchWalletData();
  fetchTransactions();
});
</script>

<style scoped>
.balance-card {
  @apply flex flex-col gap-0.5 p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06] text-center;
}

.balance-label {
  @apply text-[9px] uppercase tracking-widest text-white/30 font-semibold;
}

.balance-value {
  @apply text-base font-black tabular-nums leading-tight mt-0.5;
}

.form-card {
  @apply bg-white/[0.02] border border-white/[0.07] rounded-3xl p-5;
}

.form-card-header {
  @apply flex items-start gap-3 pb-4 border-b border-white/[0.06];
}

.field-group {
  @apply flex flex-col gap-1;
}

.field-label {
  @apply text-[10px] font-bold text-white/40 uppercase tracking-wider;
}

.field-input {
  @apply w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white font-bold text-sm focus:border-gold/50 focus:outline-none focus:ring-1 focus:ring-gold/20 transition-all;
}

.quick-amounts {
  @apply flex gap-2 flex-wrap;
}

.quick-amount-btn {
  @apply flex-1 min-w-[60px] py-2 text-xs font-bold text-white/50 border border-white/10 rounded-xl hover:border-gold/40 hover:text-gold transition-all text-center bg-transparent;
}

.quick-amount-btn.active {
  @apply border-gold/60 text-gold bg-gold/10;
}
</style>
