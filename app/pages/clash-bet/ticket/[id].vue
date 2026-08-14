<template>
  <div class="min-h-screen bg-[#06070a] text-white py-8 px-3">
    <!-- Maintenance Banner if disabled -->
    <div v-if="!canAccessClashBet" class="container mx-auto max-w-xl text-center py-16 space-y-4">
      <div class="text-5xl">🔒</div>
      <h1 class="text-2xl font-black italic uppercase">Module Clash Bet Indisponible</h1>
      <p class="text-white/60 text-xs">Le module de paris P2P est actuellement désactivé par l'administration.</p>
      <NuxtLink to="/" class="inline-block px-5 py-2.5 bg-gold text-black font-black text-xs uppercase rounded-xl">
        ← Retourner à l'accueil
      </NuxtLink>
    </div>

    <div v-else-if="pending" class="container mx-auto max-w-xl text-center py-20">
      <div class="w-10 h-10 border-4 border-gold/30 border-t-gold rounded-full animate-spin mx-auto mb-3"></div>
      <p class="text-xs text-white/50 font-bold uppercase tracking-wider">Chargement du ticket P2P...</p>
    </div>

    <div v-else-if="error || !ticket" class="container mx-auto max-w-xl text-center py-16 space-y-4">
      <div class="text-5xl">⚠️</div>
      <h1 class="text-2xl font-black uppercase">Ticket Introuvable</h1>
      <p class="text-white/60 text-xs">Ce ticket n'existe pas ou a été annulé par son créateur.</p>
      <NuxtLink to="/clash-bet" class="inline-block px-5 py-2.5 bg-white/10 text-white font-bold text-xs uppercase rounded-xl">
        Voir la liste des marchés →
      </NuxtLink>
    </div>

    <div v-else class="container mx-auto max-w-xl space-y-5">

      <!-- Navigation & Header -->
      <div class="flex items-center justify-between">
        <NuxtLink to="/clash-bet" class="text-xs text-white/60 hover:text-white flex items-center gap-1 font-bold">
          ← Tous les marchés
        </NuxtLink>
        <span class="px-2.5 py-0.5 rounded-full bg-gold/10 border border-gold/30 text-gold text-[10px] font-black uppercase tracking-wider">
          🎫 P2P exchange
        </span>
      </div>

      <!-- CARTE DU TICKET (PREVIEW VIRALE) -->
      <div class="bg-[#0b0c12] border border-white/15 rounded-3xl p-5 sm:p-6 space-y-5 relative overflow-hidden shadow-2xl">
        
        <!-- Glow Backdrop -->
        <div class="absolute -top-12 -right-12 w-48 h-48 bg-gold/10 rounded-full blur-3xl pointer-events-none"></div>

        <!-- En-tête Match & Badge Statut -->
        <div class="flex items-center justify-between pb-3 border-b border-white/10">
          <div>
            <div class="text-[10px] text-white/40 font-mono uppercase">PARI P2P #{{ ticket.ticket_number }}</div>
            <div class="text-xs font-black text-white mt-0.5">Par {{ ticket.creator_name }}</div>
          </div>
          <div>
            <span v-if="ticket.status === 'open'" class="px-2.5 py-1 bg-green-500/20 text-green-400 border border-green-500/30 rounded-lg text-xs font-black uppercase">
              ⚡ OUVERT
            </span>
            <span v-else-if="ticket.status === 'matched'" class="px-2.5 py-1 bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded-lg text-xs font-black uppercase">
              🔒 APPARIÉ
            </span>
            <span v-else class="px-2.5 py-1 bg-white/10 text-white/60 border border-white/20 rounded-lg text-xs font-black uppercase">
              {{ ticket.status }}
            </span>
          </div>
        </div>

        <!-- Confrontation Clans -->
        <div class="flex items-center justify-between gap-4 py-2 px-3 bg-white/[0.03] border border-white/5 rounded-2xl">
          <div class="flex items-center gap-2.5 flex-1 min-w-0">
            <img :src="ticket.match?.home_badge || '/default-clan.png'" class="w-8 h-8 object-contain shrink-0" @error="$event.target.src = '/default-clan.png'" />
            <span class="font-black text-sm text-white truncate">{{ ticket.match?.home }}</span>
          </div>
          <span class="text-xs font-black text-gold shrink-0 italic">VS</span>
          <div class="flex items-center justify-end gap-2.5 flex-1 min-w-0 text-right">
            <span class="font-black text-sm text-white truncate">{{ ticket.match?.away }}</span>
            <img :src="ticket.match?.away_badge || '/default-clan.png'" class="w-8 h-8 object-contain shrink-0" @error="$event.target.src = '/default-clan.png'" />
          </div>
        </div>

        <!-- Pari & Proposition -->
        <div class="space-y-3 bg-gradient-to-br from-white/[0.04] to-black p-4 rounded-2xl border border-white/10">
          <div class="text-[11px] text-white/50 uppercase font-bold tracking-wider">Intitulé du Pari :</div>
          <div class="text-base font-black text-white leading-tight">
            {{ ticket.market?.title }}
          </div>

          <div class="grid grid-cols-2 gap-3 pt-2">
            <div class="p-3 bg-black/60 border border-white/10 rounded-xl text-center">
              <span class="block text-[9px] text-white/40 uppercase font-bold">Position du Créateur</span>
              <span class="inline-block mt-1 px-3 py-0.5 rounded text-xs font-black" :class="ticket.side === 'YES' ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'">
                {{ ticket.side === 'YES' ? 'OUI' : 'NON' }}
              </span>
            </div>

            <div class="p-3 bg-gold/10 border border-gold/30 rounded-xl text-center">
              <span class="block text-[9px] text-gold uppercase font-bold">Votre Position Si Défi Pris</span>
              <span class="inline-block mt-1 px-3 py-0.5 rounded text-xs font-black" :class="ticket.opposite_side === 'YES' ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'">
                {{ ticket.opposite_side }} (Cote 2.00)
              </span>
            </div>
          </div>
        </div>

        <!-- Financial Summary -->
        <div class="grid grid-cols-3 gap-2 text-center pt-1">
          <div class="p-3 bg-white/[0.03] border border-white/5 rounded-xl">
            <span class="text-[9px] text-white/40 uppercase font-bold block">Mise à Engager</span>
            <span class="text-sm sm:text-base font-black text-white tabular-nums">{{ formatFcfa(ticket.amount) }}</span>
          </div>
          <div class="p-3 bg-white/[0.03] border border-white/5 rounded-xl">
            <span class="text-[9px] text-white/40 uppercase font-bold block">Cote Fixe</span>
            <span class="text-sm sm:text-base font-black text-gold">2.00</span>
          </div>
          <div class="p-3 bg-gold/10 border border-gold/30 rounded-xl">
            <span class="text-[9px] text-gold uppercase font-bold block">Gain Potentiel</span>
            <span class="text-sm sm:text-base font-black text-green-400 tabular-nums">{{ formatFcfa(ticket.gross_payout) }}</span>
          </div>
        </div>

        <!-- ACTION PRINCIPALE : PRENDRE LE PARI OU SE CONNECTER -->
        <div class="pt-2">
          <!-- Si ticket ouvert -->
          <template v-if="ticket.status === 'open'">
            
            <!-- Si non-connecté -->
            <NuxtLink v-if="!isLoggedIn" :to="`/login?redirect=/clash-bet/ticket/${ticket.ticket_number}`"
              class="w-full py-4 bg-gradient-to-r from-gold via-yellow-400 to-gold text-black font-black uppercase text-xs sm:text-sm rounded-2xl flex items-center justify-center gap-2 hover:brightness-110 shadow-[0_0_25px_rgba(212,175,55,0.3)] transition-all">
              <span>🔐 SE CONNECTER POUR RELEVER LE DÉFI ({{ formatFcfa(ticket.amount) }})</span>
            </NuxtLink>

            <!-- Si connecté mais l'utilisateur est le créateur -->
            <div v-else-if="user?.id === ticket.creator_id" class="p-4 bg-blue-500/10 border border-blue-500/30 rounded-2xl text-center space-y-1">
              <div class="text-xs font-bold text-blue-300"> Vous êtes le créateur de ce ticket</div>
              <p class="text-[11px] text-white/60">Partagez ce lien dans vos groupes WhatsApp ou amis pour trouver un preneur !</p>
            </div>

            <!-- Si connecté et peut prendre le ticket -->
            <button v-else @click="handleMatchTicket" :disabled="matching"
              class="w-full py-4 bg-gradient-to-r from-gold via-yellow-400 to-gold text-black font-black uppercase text-xs sm:text-sm rounded-2xl flex items-center justify-center gap-2 hover:brightness-110 shadow-[0_0_30px_rgba(212,175,55,0.4)] transition-all cursor-pointer">
              <span v-if="matching" class="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></span>
              <span v-else>⚡ RELEVER LE DÉFI & MISER {{ formatFcfa(ticket.amount) }}</span>
            </button>
          </template>

          <!-- Si ticket fermé ou apparié -->
          <div v-else class="p-4 bg-white/5 border border-white/10 rounded-2xl text-center text-xs text-white/60">
            Ce ticket a déjà été apparié par un autre joueur. Découvrez les autres marchés ouverts !
          </div>
        </div>

        <!-- BLOC DE PARTAGE SOCIAL (WHATSAPP, TELEGRAM, COPIE) -->
        <div class="pt-4 border-t border-white/10 space-y-3">
        

          <div class="grid grid-cols-3 gap-2">
            <a :href="whatsappShareUrl" target="_blank" rel="noopener noreferrer"
              class="py-2.5 px-3 bg-green-600/20 border border-green-500/40 hover:bg-green-600/30 text-green-400 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
              <span>WhatsApp</span>
            </a>

            <a :href="telegramShareUrl" target="_blank" rel="noopener noreferrer"
              class="py-2.5 px-3 bg-sky-600/20 border border-sky-500/40 hover:bg-sky-600/30 text-sky-300 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
              <span>Telegram</span>
            </a>

            <button @click="copyShareLink"
              class="py-2.5 px-3 bg-white/10 border border-white/20 hover:bg-white/20 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg>
              <span>Copier Link</span>
            </button>
          </div>
        </div>

      </div>

    </div>
  </div>
</template>

<script setup>
const route = useRoute();
const router = useRouter();
const { $api, $toast } = useNuxtApp();
const { user, isLoggedIn } = useAuth();
const { canAccessClashBet, fetchPublicConfig } = useClashBetConfig();

const ticketIdentifier = computed(() => route.params.id);

// Charge la configuration publique au chargement
onMounted(fetchPublicConfig);

// Fetch public ticket details
const { data, pending, error } = await useAsyncData(
  `public-ticket-${ticketIdentifier.value}`,
  () => $api(`/clash-bet/public/tickets/${ticketIdentifier.value}`)
);

const ticket = computed(() => data.value || null);
const matching = ref(false);

// Formatting FCFA
const formatFcfa = (val) => (val || 0).toLocaleString('fr-FR') + ' FCFA';

// Dynamic SEO & Open Graph Meta Tags
useSeoMeta({
  title: () => ticket.value?.share_meta?.title || 'Pari P2P CCA Clash Bet',
  ogTitle: () => ticket.value?.share_meta?.title || 'Pari P2P CCA Clash Bet',
  description: () => ticket.value?.share_meta?.description || 'Prenez ce pari P2P et tentez de doubler votre mise !',
  ogDescription: () => ticket.value?.share_meta?.description || 'Prenez ce pari P2P et tentez de doubler votre mise !',
  ogType: 'website',
  twitterCard: 'summary_large_image',
});

// URL & Messages de Partage
const shareFullUrl = computed(() => {
  if (process.client) {
    return window.location.href;
  }
  return `https://clashkamer.com/clash-bet/ticket/${ticketIdentifier.value}`;
});

const shareMessageText = computed(() => {
  if (!ticket.value) return '';
  const side = ticket.value.side === 'YES' ? 'OUI' : 'NON';
  const opposite = ticket.value.opposite_side;
  const amount = formatFcfa(ticket.value.amount);
  const payout = formatFcfa(ticket.value.gross_payout);
  return `🎫 *DEFI PARI P2P CCA CLASH BET* (#${ticket.value.ticket_number})\n\n` +
    `🏆 Match : *${ticket.value.match?.home} VS ${ticket.value.match?.away}*\n` +
    `📌 Pari : *${ticket.value.market?.title}*\n` +
    `💰 Proposition : Le créateur a misé ${amount} sur *${side}*.\n` +
    `⚡ Prends la position *${opposite}* (Cote 2.00) et gagne ${payout} !\n\n` +
    `Rejoins le pari ici : ${shareFullUrl.value}`;
});

const whatsappShareUrl = computed(() => {
  return `https://api.whatsapp.com/send?text=${encodeURIComponent(shareMessageText.value)}`;
});

const telegramShareUrl = computed(() => {
  return `https://t.me/share/url?url=${encodeURIComponent(shareFullUrl.value)}&text=${encodeURIComponent(shareMessageText.value)}`;
});

const copyShareLink = async () => {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(shareFullUrl.value);
    } else {
      const input = document.createElement('input');
      input.value = shareFullUrl.value;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
    }
    $toast.success('Lien du ticket copié dans le presse-papier !');
  } catch (e) {
    $toast.error('Impossible de copier le lien.');
  }
};

// Logique pour prendre le pari (matching)
const handleMatchTicket = async () => {
  if (!isLoggedIn.value) {
    router.push(`/login?redirect=/clash-bet/ticket/${ticketIdentifier.value}`);
    return;
  }

  matching.value = true;
  try {
    const res = await $api(`/clash-bet/tickets/${ticket.value.id}/match`, { method: 'POST' });
    $toast.success(res.message || 'Pari relevé avec succès ! Vos fonds ont été engagés.');
    router.push('/clash-bet/mes-tickets');
  } catch (e) {
    $toast.error(e?.data?.message || e?.message || 'Erreur lors de la prise du pari.');
  } finally {
    matching.value = false;
  }
};
</script>
