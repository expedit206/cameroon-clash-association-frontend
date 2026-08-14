<template>
  <div class="admin-bet-page min-h-screen bg-[#06070a] text-white pb-16 pt-24">
    <div class="container mx-auto px-4 max-w-6xl">
      <!-- Admin Header -->
      <div class="flex items-center justify-between gap-4 mb-8">
        <div>
          <span class="text-xs text-gold font-bold uppercase tracking-widest">⚙️ Administration V2</span>
          <h1 class="text-3xl font-black italic uppercase text-white tracking-tight">
            GESTION <span class="text-gold">CCA CLASH BET</span> — MARKET BUILDER
          </h1>
        </div>
        <NuxtLink to="/admin/dashboard" class="text-xs text-white/50 hover:text-white">
          ← Dashboard Admin
        </NuxtLink>
      </div>

      <!-- Stats KPIs Grid -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div class="glass-card !p-5 border-gold/20 bg-gold/5">
          <div class="text-[10px] text-white/40 uppercase tracking-widest mb-1">Commission Collectée</div>
          <div class="text-xl font-black text-gold italic">+{{ formatFcfa(stats.total_commission) }}</div>
        </div>

        <div class="glass-card !p-5 border-white/10">
          <div class="text-[10px] text-white/40 uppercase tracking-widest mb-1">Marchés Ouverts</div>
          <div class="text-xl font-black text-white italic">{{ stats.open_markets || 0 }} / {{ stats.total_markets || 0
            }}</div>
        </div>

        <div class="glass-card !p-5 border-white/10">
          <div class="text-[10px] text-white/40 uppercase tracking-widest mb-1">Tickets P2P</div>
          <div class="text-xl font-black italic">
            <span class="text-amber-400">{{ stats.open_tickets || 0 }}</span>
            <span class="text-white/30 text-sm"> open /</span>
            <span class="text-blue-400"> {{ stats.matched_tickets || 0 }}</span>
            <span class="text-white/30 text-sm"> match</span>
          </div>
        </div>

        <div class="glass-card !p-5"
          :class="stats.pending_withdrawals > 0 ? 'border-red-500/30 bg-red-500/5' : 'border-white/10'">
          <div class="text-[10px] uppercase tracking-widest mb-1"
            :class="stats.pending_withdrawals > 0 ? 'text-red-400' : 'text-white/40'">Retraits en Attente</div>
          <div class="text-xl font-black italic"
            :class="stats.pending_withdrawals > 0 ? 'text-amber-400' : 'text-white'">{{ stats.pending_withdrawals || 0
            }}</div>
        </div>
      </div>

      <!-- Main Admin Sections: Tabs -->
      <div class="flex flex-wrap items-center justify-between gap-4 mb-6 border-b border-white/10 pb-4">
        <div class="flex gap-2 flex-wrap">
          <button @click="activeSection = 'markets'"
            :class="['tab-admin-btn', activeSection === 'markets' ? 'active' : '']">
            📊 Marchés ({{ stats.total_markets || 0 }})
          </button>
          <button @click="activeSection = 'tickets'; fetchAdminTickets()"
            :class="['tab-admin-btn', activeSection === 'tickets' ? 'active' : '']">
            🎫 Tickets
          </button>
          <button @click="activeSection = 'withdrawals'; fetchWithdrawals()"
            :class="['tab-admin-btn', activeSection === 'withdrawals' ? 'active' : '']">
            📤 Retraits
            <span v-if="stats.pending_withdrawals > 0"
              class="ml-1 px-1.5 py-0.5 text-[9px] bg-red-500 text-white rounded-full font-bold">{{
                stats.pending_withdrawals }}</span>
          </button>
          <button @click="activeSection = 'audits'; fetchAudits()"
            :class="['tab-admin-btn', activeSection === 'audits' ? 'active' : '']">
            📜 Audits Log
          </button>
          <button @click="activeSection = 'settings'; fetchSettings()"
            :class="['tab-admin-btn', activeSection === 'settings' ? 'active' : '']">
            ⚙️ Config
          </button>
        </div>

        <div class="flex gap-2">
          <button @click="openBulkModal"
            class="px-3 py-2 bg-blue-600/30 border border-blue-500/40 text-blue-300 font-bold uppercase text-xs rounded-lg hover:bg-blue-600/40 transition-all flex items-center gap-1">
            🚀 Génération en Lot
          </button>
          <button @click="openBuilderModal"
            class="px-4 py-2 bg-gradient-to-r from-gold to-yellow-600 text-black font-black uppercase text-xs rounded-lg hover:shadow-[0_0_15px_rgba(212,175,55,0.4)] transition-all flex items-center gap-1">
            🛠️ Market Builder AST
          </button>
        </div>
      </div>

      <!-- SECTION 1: Liste des Marchés Redessinée avec Actions en Masse -->
      <div v-if="activeSection === 'markets'" class="space-y-4">
        <!-- Barre de Filtres -->
        <div class="glass-card !p-4 border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <!-- Filtres de Statut -->
          <div class="flex items-center gap-1.5 flex-wrap">
            <span class="text-[10px] font-black uppercase text-white/40 mr-1">Statut:</span>
            <button v-for="sf in marketStatusFilters" :key="sf.key" @click="marketStatusFilter = sf.key"
              :class="['px-2.5 py-1 rounded-lg text-xs font-bold transition-all', marketStatusFilter === sf.key ? 'bg-gold text-black' : 'bg-white/5 text-white/60 hover:text-white']">
              {{ sf.label }}
            </button>
          </div>

          <!-- Filtres de Catégorie -->
          <div class="flex items-center gap-1.5 flex-wrap">
            <span class="text-[10px] font-black uppercase text-white/40 mr-1">Catégorie:</span>
            <button v-for="cf in marketCategoryFilters" :key="cf.key" @click="marketCategoryFilter = cf.key"
              :class="['px-2.5 py-1 rounded-lg text-xs font-bold transition-all', marketCategoryFilter === cf.key ? 'bg-white/20 text-white font-black' : 'bg-white/5 text-white/60 hover:text-white']">
              {{ cf.label }}
            </button>
          </div>
        </div>

        <!-- BARRE D'ACTIONS EN MASSE (Visible quand au moins 1 marché est sélectionné) -->
        <div v-if="selectedMarketIds.length > 0"
          class="bg-gold/15 border border-gold/40 rounded-2xl p-3.5 flex flex-wrap items-center justify-between gap-3 animate-fade-in shadow-xl">
          <div class="flex items-center gap-2">
            <span class="px-2.5 py-1 bg-gold text-black font-black text-xs rounded-lg">
              {{ selectedMarketIds.length }} marché(s) sélectionné(s)
            </span>
            <button @click="selectedMarketIds = []" class="text-xs text-white/60 hover:text-white underline">
              Désélectionner tout
            </button>
          </div>

          <div class="flex items-center gap-2 flex-wrap">
            <button @click="bulkUpdateStatus('suspended')"
              class="px-3 py-1.5 bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-xl text-xs font-bold hover:bg-amber-500/30">
              ⏸️ Suspendre la sélection
            </button>
            <button @click="bulkUpdateStatus('open')"
              class="px-3 py-1.5 bg-green-500/20 text-green-300 border border-green-500/30 rounded-xl text-xs font-bold hover:bg-green-500/30">
              ▶️ Rouvrir la sélection
            </button>
            <button @click="bulkSettleAutoMarkets"
              class="px-3 py-1.5 bg-gradient-to-r from-emerald-600 to-green-600 text-white font-black text-xs rounded-xl shadow-lg hover:brightness-110">
              ⚡ Auto-Régler AST sélection
            </button>
            <button @click="bulkCancelMarkets"
              class="px-3 py-1.5 bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-xl text-xs font-bold hover:bg-amber-500/30">
              ❌ Annuler sélection
            </button>
            <button @click="bulkDeleteMarkets"
              class="px-3 py-1.5 bg-red-600 text-white rounded-xl text-xs font-black hover:bg-red-700 shadow-md">
              🗑️ Supprimer sélection
            </button>
          </div>
        </div>

        <!-- En-tête Tableau / Select All -->
        <div class="flex items-center justify-between text-xs px-2 text-white/50 font-bold">
          <div class="flex items-center gap-2">
            <input type="checkbox" :checked="isAllMarketsSelected" @change="toggleSelectAllMarkets"
              class="w-4 h-4 rounded accent-gold cursor-pointer" />
            <span>Sélectionner tout ({{ filteredMarkets.length }} marchés)</span>
          </div>
          <span>Total: {{ filteredMarkets.length }} marché(s)</span>
        </div>

        <!-- Liste des Marchés Détaillée -->
        <div v-if="loadingMarkets" class="text-center text-white/40 py-8">Chargement des marchés...</div>
        <div v-else-if="filteredMarkets.length === 0" class="glass-card !p-8 text-center text-white/40 text-xs">
          Aucun marché ne correspond à vos filtres.
        </div>
        <div v-else class="grid grid-cols-1 gap-3">
          <div v-for="market in filteredMarkets" :key="market.id"
            :class="['glass-card !p-5 border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-5 transition-all', selectedMarketIds.includes(market.id) ? 'border-gold/60 bg-gold/[0.04]' : '']">

            <div class="flex items-start gap-3 flex-1">
              <!-- Checkbox de sélection -->
              <input type="checkbox" :checked="selectedMarketIds.includes(market.id)"
                @change="toggleSelectMarket(market.id)" class="w-4 h-4 rounded accent-gold cursor-pointer mt-1" />

              <div class="space-y-2 flex-1">
                <!-- Badges & Métadonnées -->
                <div class="flex items-center gap-2 flex-wrap">
                  <span :class="getStatusBadgeClass(market.status)">{{ market.status }}</span>

                  <span class="px-2 py-0.5 rounded text-[10px] uppercase font-black tracking-wider" :class="{
                    'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30': market.category === 'team',
                    'bg-purple-500/20 text-purple-400 border border-purple-500/30': market.category === 'player',
                    'bg-blue-500/20 text-blue-400 border border-blue-500/30': market.category === 'comparison',
                    'bg-red-500/20 text-red-400 border border-red-500/30': market.category === 'duel',
                  }">
                    {{ market.category === 'team' ? '🏆 ÉQUIPE' : (market.category === 'player' ? '👤 JOUEUR' :
                      (market.category === 'duel' ? '🥊 DUEL H2H' : '⚔️ COMPARAISON')) }}
                  </span>

                  <span class="text-xs text-white/40 font-mono">Marché #{{ market.id }}</span>

                  <span class="text-xs text-white/50 border-l border-white/10 pl-2">
                    Pool: <strong class="text-gold font-mono">{{ formatFcfa(market.total_pool || 0) }}</strong>
                  </span>

                  <span class="text-xs text-white/50">
                    Tickets: <strong class="text-green-400">👍 {{ market.yes_tickets_count || 0 }}</strong> | <strong
                      class="text-red-400">👎 {{ market.no_tickets_count || 0 }}</strong>
                  </span>
                </div>

                <!-- Titre du Marché -->
                <div class="text-base font-black text-white leading-tight flex items-center gap-2">
                  <span class="text-gold">📌</span>
                  <span class="text-white drop-shadow">{{ market.title || (market.match?.clan_home + ' VS ' +
                    market.match?.clan_away) }}</span>
                </div>

                <!-- Match Associé -->
                <div class="text-xs text-white/60 flex items-center gap-2">
                  <span>Match #{{ market.match_id }}</span>
                  <span v-if="market.match" class="text-gold font-bold">({{ market.match.clan_home }} VS {{
                    market.match.clan_away }})</span>
                </div>

                <!-- Synthèse Règle AST Déclarative en Français Clair -->
                <div v-if="market.rule_definition"
                  class="p-3 bg-black/60 border border-gold/30 rounded-xl text-xs space-y-2">
                  <div class="flex items-center justify-between text-[10px]">
                    <span class="text-gold font-black uppercase tracking-wider flex items-center gap-1">
                      ⚡ Condition d'évaluation (Règle AST v{{ market.rule_version || 1 }})
                    </span>
                    <span class="text-white/40 font-mono text-[9px]">
                      {{ market.rule_definition.type === 'logical' ? 'Règle Composée (' +
                        market.rule_definition.operator + ')' : 'Règle Simple' }}
                    </span>
                  </div>

                  <!-- Traduction Humaine Position OUI / Position NON -->
                  <div class="space-y-1.5 pt-0.5">
                    <div
                      class="p-2 bg-green-500/10 border border-green-500/30 rounded-lg text-white font-bold text-xs flex items-start gap-2">
                      <span
                        class="px-1.5 py-0.5 bg-green-500 text-black text-[9px] font-black rounded shrink-0">POSITION
                        OUI</span>
                      <span class="text-green-300 font-semibold">{{ describeASTNode(market.rule_definition, market.match
                        || selectedMatchForMarket(market), false) }}</span>
                    </div>

                    <div
                      class="p-2 bg-red-500/10 border border-red-500/30 rounded-lg text-white font-bold text-xs flex items-start gap-2">
                      <span class="px-1.5 py-0.5 bg-red-500 text-white text-[9px] font-black rounded shrink-0">POSITION
                        NON</span>
                      <span class="text-red-300 font-semibold">{{ describeASTNode(market.rule_definition, market.match
                        || selectedMatchForMarket(market), true) }}</span>
                    </div>
                  </div>

                  <!-- AST Technique (dépliable) -->
                  <details class="text-[10px] text-white/40">
                    <summary class="cursor-pointer hover:text-white/70 font-mono py-1">🔍 Voir JSON AST Brut</summary>
                    <pre
                      class="font-mono text-green-400 text-[10px] p-2 bg-black rounded overflow-x-auto max-h-24 mt-1">{{ JSON.stringify(market.rule_definition, null, 2) }}</pre>
                  </details>
                </div>

                <!-- Panel 7 : Résultat du marché (Après Match) -->
                <div v-if="market.status === 'settled' || market.winning_side"
                  class="p-2.5 bg-black/60 border border-gold/30 rounded-xl space-y-1">
                  <div class="flex items-center justify-between text-[10px]">
                    <span class="text-gold uppercase font-bold">🏆 RÉSULTAT DU MARCHÉ</span>
                    <span class="px-2 py-0.5 bg-green-500/20 text-green-400 rounded font-black">✓ RÉGLÉ</span>
                  </div>
                  <div class="text-xs font-black text-white">
                    GAGNANT : <span :class="market.winning_side === 'YES' ? 'text-green-400' : 'text-red-400'">POSITION
                      {{ market.winning_side || 'NON DÉFINI' }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Actions Individuelles -->
            <div class="flex flex-wrap md:flex-col items-stretch gap-2 shrink-0">
              <button @click="toggleLiveBetting(market)"
                :class="['px-3 py-1.5 rounded-lg text-xs font-bold transition-all border flex items-center justify-center gap-1 cursor-pointer', market.allow_during_match ? 'bg-purple-500/20 text-purple-300 border-purple-500/40 font-black shadow-[0_0_15px_rgba(168,85,247,0.3)]' : 'bg-white/5 text-white/50 border-white/10 hover:border-white/30']">
                <span>⚡</span>
                <span>{{ market.allow_during_match ? 'Pendant Match : OUI' : 'Pendant Match : NON' }}</span>
              </button>
              <button v-if="market.status === 'open'" @click="updateMarketStatus(market, 'suspended')"
                class="px-3 py-1.5 bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-lg text-xs font-bold hover:bg-amber-500/30">
                ⏸️ Suspendre
              </button>
              <button v-if="market.status === 'suspended'" @click="updateMarketStatus(market, 'open')"
                class="px-3 py-1.5 bg-green-500/20 text-green-300 border border-green-500/30 rounded-lg text-xs font-bold hover:bg-green-500/30">
                ▶️ Rouvrir
              </button>
              <button v-if="market.rule_definition && market.status !== 'settled'" @click="triggerSettleAuto(market)"
                class="px-3 py-1.5 bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-lg text-xs font-black uppercase shadow-lg hover:brightness-110">
                ⚡ Auto-Régler
              </button>
              <button v-if="market.status !== 'settled'" @click="cancelMarket(market)"
                class="px-3 py-1.5 bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-lg text-xs font-bold hover:bg-amber-500/30">
                ❌ Annuler
              </button>
              <button @click="deleteMarket(market)"
                class="px-3 py-1.5 bg-red-600 text-white rounded-lg text-xs font-black hover:bg-red-700 shadow-md">
                🗑️ Supprimer
              </button>
            </div>

          </div>
          <div v-if="marketsPagination.last_page > 1"
            class="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-white/10 text-xs">
            <div class="text-white/50 font-bold">
              Page {{ marketsPagination.current_page }} sur {{ marketsPagination.last_page }} ({{
                marketsPagination.total }} marchés au total)
            </div>
            <div class="flex items-center gap-2">
              <button :disabled="marketsPagination.current_page === 1"
                @click="fetchMarkets(marketsPagination.current_page - 1)"
                class="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold disabled:opacity-30 transition-all cursor-pointer">
                ← Précédent
              </button>
              <span class="px-3 py-1.5 bg-gold/10 border border-gold/30 text-gold rounded-xl font-black">
                {{ marketsPagination.current_page }} / {{ marketsPagination.last_page }}
              </span>
              <button :disabled="marketsPagination.current_page === marketsPagination.last_page"
                @click="fetchMarkets(marketsPagination.current_page + 1)"
                class="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold disabled:opacity-30 transition-all cursor-pointer">
                Suivant →
              </button>
            </div>
          </div>
        </div>

        <!-- Barre de Pagination Frontend -->

      </div>

      <!-- SECTION 2: Tickets -->
      <div v-if="activeSection === 'tickets'" class="space-y-4">
        <div class="flex items-center gap-2 mb-4">
          <button v-for="f in ticketFilters" :key="f.key" @click="ticketStatus = f.key; fetchAdminTickets()"
            :class="['px-3 py-1.5 rounded-lg text-xs font-bold transition-all', ticketStatus === f.key ? 'bg-gold text-black' : 'bg-white/5 text-white/60 hover:text-white']">
            {{ f.label }}
          </button>
        </div>

        <div v-if="loadingAdminTickets" class="text-center text-white/40 py-8">Chargement des tickets...</div>
        <div v-else-if="adminTickets.length === 0" class="glass-card !p-8 text-center text-white/40 text-xs">Aucun
          ticket pour ce filtre.</div>
        <div v-else class="space-y-2">
          <div v-for="t in adminTickets" :key="t.id"
            class="glass-card !p-4 border-white/10 flex items-center justify-between gap-4 text-xs">
            <div>
              <div class="flex items-center gap-2">
                <span :class="getStatusBadgeClass(t.status)">{{ t.status }}</span>
                <span class="font-mono text-gold font-bold">#{{ t.ticket_number }}</span>
                <span class="px-2 py-0.5 rounded text-[10px] font-black uppercase"
                  :class="t.side === 'YES' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'">Position
                  {{ t.side || 'YES' }}</span>
              </div>
              <div class="text-white/80 font-bold mt-1">
                {{ t.market_title || 'Marché P2P' }}
              </div>
              <div class="text-white/40 text-[10px] mt-0.5">
                Créateur: User #{{ t.creator_id }} | Adversaire: {{ t.taker_id ? 'User #' + t.taker_id : 'En attente' }}
              </div>
            </div>
            <div class="text-right">
              <div class="text-gold font-black italic">{{ formatFcfa(t.amount) }}</div>
              <div class="text-[10px] text-white/40">Gain potentiel: {{ formatFcfa(t.net_payout) }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- SECTION 3: Retraits -->
      <div v-if="activeSection === 'withdrawals'" class="space-y-4">
        <div v-if="loadingWithdrawals" class="text-center text-white/40 py-8">Chargement des demandes de retrait...
        </div>
        <div v-else-if="withdrawals.length === 0" class="glass-card !p-8 text-center text-white/40 text-xs">Aucune
          demande de retrait.</div>
        <div v-else class="space-y-3">
          <div v-for="w in withdrawals" :key="w.id"
            class="glass-card !p-5 border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <div class="flex items-center gap-2 mb-1">
                <span :class="getStatusBadgeClass(w.status)">{{ w.status }}</span>
                <span class="font-bold text-white text-sm">{{ w.user?.name || 'Utilisateur #' + w.user_id }}</span>
                <span class="text-xs text-white/40">({{ w.phone_number }})</span>
              </div>
              <div class="text-xs text-white/60">
                Montant demandé : <strong class="text-white">{{ formatFcfa(w.amount) }}</strong> | Frais 10% : <strong
                  class="text-gold">{{ formatFcfa(w.fee) }}</strong> | Net à verser : <strong
                  class="text-green-400 font-bold">{{ formatFcfa(w.net_amount) }}</strong>
              </div>
              <div class="text-[10px] text-white/30 mt-1">Operateur: {{ w.payment_method }} | Date: {{
                formatDate(w.created_at) }}</div>
            </div>
            <div v-if="w.status === 'pending'" class="flex gap-2">
              <button @click="processWithdrawal(w, 'approve')"
                class="px-4 py-2 bg-green-500 text-black font-black uppercase text-xs rounded-lg hover:bg-green-400">Valider
                & Payer</button>
              <button @click="processWithdrawal(w, 'reject')"
                class="px-4 py-2 bg-red-500/20 text-red-300 border border-red-500/30 text-xs font-bold rounded-lg hover:bg-red-500/30">Rejeter</button>
            </div>
          </div>
        </div>
      </div>

      <!-- SECTION 4: Audits Log -->
      <div v-if="activeSection === 'audits'" class="space-y-4">
        <div v-if="loadingAudits" class="text-center text-white/40 py-8">Chargement des audits...</div>
        <div v-else-if="audits.length === 0" class="glass-card !p-8 text-center text-white/40 text-xs">Aucun audit
          enregistré.</div>
        <div v-else class="space-y-2">
          <div v-for="a in audits" :key="a.id" class="glass-card !p-4 border-white/10 text-xs">
            <div class="flex items-center justify-between mb-1">
              <span class="px-2 py-0.5 bg-gold/10 text-gold font-mono rounded text-[10px] uppercase font-bold">{{
                a.event_type }}</span>
              <span class="text-white/40 text-[10px]">{{ formatDate(a.created_at) }}</span>
            </div>
            <div class="text-white/80 font-bold">Admin #{{ a.admin_id || 'Système' }} — Marché #{{ a.market_id || 'N/A'
              }}</div>
            <pre
              class="mt-2 p-2 bg-black/50 rounded text-[10px] font-mono text-white/60 overflow-x-auto">{{ JSON.stringify(a.payload, null, 2) }}</pre>
          </div>
        </div>
      </div>

      <!-- SECTION 5: Configuration -->
      <div v-if="activeSection === 'settings'" class="glass-card !p-8 border-white/10 max-w-xl mx-auto space-y-6">
        <h2
          class="text-lg font-black uppercase text-white italic border-b border-white/10 pb-3 flex items-center justify-between">
          <span>Paramètres Généraux</span>
          <span class="text-xs px-2.5 py-1 rounded-full font-mono font-bold uppercase"
            :class="settings.clash_bet_public_enabled ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'">
            {{ settings.clash_bet_public_enabled ? '🌐 PUBLIC ACTIF' : '🔒 MODE ADMIN SEUL' }}
          </span>
        </h2>
        <div v-if="loadingSettings" class="text-center text-white/40">Chargement...</div>
        <div v-else class="space-y-5">
          <!-- Toggle Visibilité Publique -->
          <div class="p-4 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-between gap-4">
            <div>
              <div class="font-black text-sm text-white uppercase">Visibilité Publique du Clash Bet</div>
              <div class="text-[11px] text-white/50">Activez pour ouvrir le marché P2P à tout le public.</div>
            </div>
            <button @click="settings.clash_bet_public_enabled = !settings.clash_bet_public_enabled" type="button"
              :class="['px-4 py-2 rounded-xl font-black text-xs uppercase transition-all cursor-pointer border', settings.clash_bet_public_enabled ? 'bg-green-500 text-black border-green-400 shadow-lg shadow-green-500/20' : 'bg-white/10 text-white/60 border-white/20']">
              {{ settings.clash_bet_public_enabled ? '🟢 ACCESSIBLE (ON)' : '🔴 MASQUÉ (OFF)' }}
            </button>
          </div>

          <div v-for="(val, key) in settings" :key="key">
            <template v-if="key !== 'clash_bet_public_enabled'">
              <label class="block text-xs font-bold text-white/70 uppercase mb-1">{{ settingLabel(key) }}</label>
              <input v-model="settings[key]" type="text"
                class="w-full bg-black/60 border border-white/20 rounded-xl px-4 py-2.5 text-white font-mono text-xs focus:border-gold outline-none" />
            </template>
          </div>
          <button @click="saveSettings"
            class="w-full py-3.5 bg-gold text-black font-black uppercase text-xs rounded-xl hover:brightness-110 shadow-lg shadow-gold/20 cursor-pointer">
            Sauvegarder la Configuration
          </button>
        </div>
      </div>

      <!-- MODALE MARKET BUILDER NO-CODE AST V2 (PANEL 5 & LIVE PREVIEW) -->
      <div v-if="showBuilderModal"
        class="fixed inset-0 z-50 flex items-center justify-center pt-12 mt-12 p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
        <div class="glass-card !p-6 border-gold/30 max-w-6xl w-full my-6 space-y-5 text-xs">

          <!-- Header Modale -->
          <div class="flex items-center justify-between border-b border-white/10 pb-3">
            <div class="flex items-center gap-3">
              <span class="w-3 h-3 rounded-full bg-gold animate-ping"></span>
              <div>
                <span class="text-[10px] text-gold font-bold uppercase tracking-widest">Market Builder AST V2 (Admin
                  Engine)</span>
                <h3 class="font-black text-lg uppercase text-white flex items-center gap-2">
                  🛠️ Créateur de Marché No-Code
                </h3>
              </div>
            </div>
            <button @click="showBuilderModal = false" class="text-white/40 hover:text-white text-xl">✕</button>
          </div>

          <!-- Layout 3 Colonnes (Panel 5 & Live Preview) -->
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">

            <!-- COLONNE 1 : ÉLÉMENTS (PALETTE NO-CODE) -->
            <div class="lg:col-span-3 bg-white/[0.02] border border-white/10 rounded-2xl p-3.5 space-y-4">
              <h4
                class="font-black text-[11px] uppercase text-gold tracking-wider border-b border-white/10 pb-2 flex items-center justify-between">
                <span>🎨 Palette AST</span>
                <span class="text-[9px] text-white/40 font-mono">v2.0</span>
              </h4>

              <!-- Sujet -->
              <div>
                <span class="text-[10px] text-white/40 uppercase font-bold block mb-1.5">Sujet de la règle</span>
                <div class="grid grid-cols-2 gap-1">
                  <button @click="ruleDraft.subject_type = 'team'"
                    :class="['palette-btn', ruleDraft.subject_type === 'team' ? 'active' : '']">🏆 Équipe</button>
                  <button @click="ruleDraft.subject_type = 'player'"
                    :class="['palette-btn', ruleDraft.subject_type === 'player' ? 'active' : '']">👤 Joueur</button>
                  <button @click="ruleDraft.subject_type = 'match'"
                    :class="['palette-btn', ruleDraft.subject_type === 'match' ? 'active' : '']">⚔️ Match</button>
                  <button @click="ruleDraft.subject_type = 'duel'; ruleDraft.metric = 'winner'"
                    :class="['palette-btn', ruleDraft.subject_type === 'duel' ? 'active' : '']">🥊 Duel H2H</button>
                </div>
              </div>

              <!-- Statistiques disponibles (adaptées au sujet choisi) -->
              <div>
                <span class="text-[10px] text-white/40 uppercase font-bold block mb-1.5">Métrique Évaluée</span>
                <div class="space-y-1">
                  <!-- Métriques standard (équipe/joueur) -->
                  <template v-if="ruleDraft.subject_type !== 'duel'">
                    <button @click="ruleDraft.metric = 'total_stars'"
                      :class="['palette-btn w-full text-left', ruleDraft.metric === 'total_stars' ? 'active' : '']">⭐
                      Total Étoiles</button>
                    <button @click="ruleDraft.metric = 'average_destruction'"
                      :class="['palette-btn w-full text-left', ruleDraft.metric === 'average_destruction' ? 'active' : '']">💥
                      Destruction Moy. (%)</button>
                    <button @click="ruleDraft.metric = 'three_star_count'"
                      :class="['palette-btn w-full text-left', ruleDraft.metric === 'three_star_count' ? 'active' : '']">✨
                      Perfections 3★</button>
                    <button @click="ruleDraft.metric = 'stars'"
                      :class="['palette-btn w-full text-left', ruleDraft.metric === 'stars' ? 'active' : '']">🌟 Étoiles
                      Individuelles</button>
                    <button @click="ruleDraft.metric = 'winner'"
                      :class="['palette-btn w-full text-left', ruleDraft.metric === 'winner' ? 'active' : '']">🥇
                      Vainqueur du Match</button>
                  </template>
                  <!-- Métriques Duel H2H -->
                  <template v-else>
                    <button @click="ruleDraft.metric = 'winner'"
                      :class="['palette-btn w-full text-left', ruleDraft.metric === 'winner' ? 'active' : '']">🏆
                      Vainqueur du Duel</button>
                    <button @click="ruleDraft.metric = 'stars_home'"
                      :class="['palette-btn w-full text-left', ruleDraft.metric === 'stars_home' ? 'active' : '']">⭐
                      Étoiles Joueur Local</button>
                    <button @click="ruleDraft.metric = 'stars_away'"
                      :class="['palette-btn w-full text-left', ruleDraft.metric === 'stars_away' ? 'active' : '']">⭐
                      Étoiles Joueur Visiteur</button>
                    <button @click="ruleDraft.metric = 'destruction_home'"
                      :class="['palette-btn w-full text-left', ruleDraft.metric === 'destruction_home' ? 'active' : '']">💥
                      Destruction Local (%)</button>
                    <button @click="ruleDraft.metric = 'destruction_away'"
                      :class="['palette-btn w-full text-left', ruleDraft.metric === 'destruction_away' ? 'active' : '']">💥
                      Destruction Visiteur (%)</button>
                  </template>
                </div>
              </div>

              <!-- Opérateurs de Comparaison -->
              <div>
                <span class="text-[10px] text-white/40 uppercase font-bold block mb-1.5">Opérateur</span>
                <div class="grid grid-cols-3 gap-1 text-center font-mono font-bold">
                  <button v-for="op in ['>=', '>', '=', '!=', '<=', '<']" :key="op" @click="ruleDraft.operator = op"
                    :class="['palette-btn', ruleDraft.operator === op ? 'active' : '']">
                    {{ op }}
                  </button>
                </div>
              </div>

              <!-- Opérateurs Logiques -->
              <div>
                <span class="text-[10px] text-white/40 uppercase font-bold block mb-1.5">Structure de la Règle</span>
                <div class="space-y-1.5">
                  <button @click="isComposedRule = false"
                    :class="['palette-btn w-full text-left', !isComposedRule ? 'active' : '']">
                    🔹 Condition Simple
                  </button>
                  <button @click="isComposedRule = true; logicalOperator = 'AND'"
                    :class="['palette-btn w-full text-left', isComposedRule && logicalOperator === 'AND' ? 'active' : '']">
                    🔗 Composée : AND (ET)
                  </button>
                  <button @click="isComposedRule = true; logicalOperator = 'OR'"
                    :class="['palette-btn w-full text-left', isComposedRule && logicalOperator === 'OR' ? 'active' : '']">
                    🔀 Composée : OR (OU)
                  </button>
                </div>
              </div>
            </div>

            <!-- COLONNE 2 : PARAMÉTRAGE & CONSTRUCTEUR (CENTRE) -->
            <div class="lg:col-span-5 space-y-4">

              <!-- Sélection du Match & Auto-Catégorie -->
              <div class="space-y-3 bg-white/[0.02] border border-white/10 rounded-2xl p-4">
                <div>
                  <label class="block font-bold text-gold uppercase mb-1 text-[10px]">1. Match CCA Sélectionné</label>
                  <select v-model="builderForm.match_id"
                    class="w-full bg-black border border-white/20 rounded-xl px-3 py-2 text-white font-bold text-xs">
                    <option v-for="m in availableMatches" :key="m.id" :value="m.id">
                      Match #{{ m.id }} : {{ m.clan_home }} VS {{ m.clan_away }}
                    </option>
                  </select>
                </div>

                <div class="grid grid-cols-2 gap-3 items-center">
                  <div>
                    <label class="block font-bold text-white/50 uppercase mb-1 text-[10px]">Catégorie
                      (Automatique)</label>
                    <div
                      class="px-3 py-2 bg-gold/10 border border-gold/30 rounded-xl font-black text-gold text-xs uppercase flex items-center gap-1.5">
                      <span v-if="builderForm.category === 'team'">🏆 Équipe</span>
                      <span v-else-if="builderForm.category === 'player'">👤 Joueur</span>
                      <span v-else>⚔️ Comparaison</span>
                    </div>
                  </div>
                  <div>
                    <label class="block font-bold text-white/70 uppercase mb-1 text-[10px]">Titre (Personnalisé)</label>
                    <input v-model="builderForm.title" type="text" placeholder="Auto-généré si vide"
                      class="w-full bg-black border border-white/20 rounded-xl px-3 py-2 text-white text-xs" />
                  </div>
                </div>
              </div>

              <!-- Constructeur de Règle AST -->
              <div class="bg-white/[0.02] border border-white/10 rounded-2xl p-4 space-y-3">
                <div class="flex items-center justify-between border-b border-white/10 pb-2">
                  <span class="font-bold text-gold uppercase text-[11px]">
                    ⚡ 2. Constructeur AST {{ isComposedRule ? `(Règle Composée ${logicalOperator})` : '(Règle Simple)'
                    }}
                  </span>
                  <span class="text-[9px] bg-gold/10 text-gold px-2 py-0.5 rounded font-mono">AST V2 Engine</span>
                </div>

                <!-- Sélection du Clan Cible si Sujet = Équipe -->
                <div v-if="ruleDraft.subject_type === 'team'">
                  <label class="block text-[10px] text-white/50 font-bold uppercase mb-1">Cible : Clan Officiel</label>
                  <div class="grid grid-cols-2 gap-2">
                    <button @click="selectedClanSide = 'home'"
                      :class="['p-2.5 rounded-xl border text-left flex items-center gap-2 transition-all', selectedClanSide === 'home' ? 'bg-gold/15 border-gold text-gold font-black' : 'bg-black/40 border-white/10 text-white/70 hover:border-white/20']">
                      <img :src="selectedMatch?.clan_home_badge || '/default-clan.png'" class="w-5 h-5 object-contain"
                        @error="$event.target.src = '/default-clan.png'" />
                      <span class="truncate text-xs">{{ selectedMatch?.clan_home || 'Équipe Hôte' }}</span>
                    </button>
                    <button @click="selectedClanSide = 'away'"
                      :class="['p-2.5 rounded-xl border text-left flex items-center gap-2 transition-all', selectedClanSide === 'away' ? 'bg-gold/15 border-gold text-gold font-black' : 'bg-black/40 border-white/10 text-white/70 hover:border-white/20']">
                      <img :src="selectedMatch?.clan_away_badge || '/default-clan.png'" class="w-5 h-5 object-contain"
                        @error="$event.target.src = '/default-clan.png'" />
                      <span class="truncate text-xs">{{ selectedMatch?.clan_away || 'Équipe Invitée' }}</span>
                    </button>
                  </div>
                </div>

                <!-- Mode Duel H2H : Sélecteur de Duel HDV -->
                <div v-else-if="ruleDraft.subject_type === 'duel'" class="space-y-1">
                  <label class="block text-[10px] text-gold font-bold uppercase">
                    🥊 Cible : Sélection du Duel H2H (Niveau HDV)
                  </label>
                  <select v-model="selectedDuelHdv"
                    class="w-full bg-black border border-gold/40 rounded-xl px-3 py-2 text-white font-bold text-xs">
                    <option v-for="hdv in [14, 15, 16, 17, 18]" :key="hdv" :value="hdv">
                      ⚔️ Duel HDV {{ hdv }} — {{(selectedMatch?.duels || []).find(d => Number(d.hdv_level) ===
                        hdv)?.player_home_name || (selectedMatch?.clan_home || 'Local')}} VS {{(selectedMatch?.duels ||
                        []).find(d => Number(d.hdv_level) === hdv)?.player_away_name || (selectedMatch?.clan_away ||
                          'Visiteur')
                      }}
                    </option>
                  </select>
                </div>

                <!-- Sélection Dynamique du Joueur si Sujet = Joueur -->
                <div v-else-if="ruleDraft.subject_type === 'player'" class="space-y-1">
                  <label class="block text-[10px] text-white/50 font-bold uppercase">
                    👤 Joueur Sélectionné ({{ currentClanName }})
                  </label>
                  <select v-model="selectedPlayerId"
                    class="w-full bg-black border border-gold/30 rounded-xl px-3 py-2 text-white font-bold text-xs">
                    <option v-if="currentClanPlayers.length === 0" disabled value="">Aucun joueur inscrit trouvé
                    </option>
                    <option v-for="p in currentClanPlayers" :key="p.id" :value="p.id">
                      {{ p.name }} ({{ p.tag_coc || '#TAG' }}) — [{{ p.role_label }}]
                    </option>
                  </select>
                </div>

                <!-- Condition 1 : Opérateur et Valeur -->
                <div class="p-3 bg-black/40 border border-white/10 rounded-xl space-y-2">
                  <span class="text-[9px] text-gold font-bold uppercase block">Condition 1 (Métrique : {{
                    ruleDraft.metric
                  }})</span>
                  <div class="grid grid-cols-2 gap-2">
                    <div>
                      <label class="block text-[10px] text-white/40 mb-1">Opérateur</label>
                      <select v-model="ruleDraft.operator" :disabled="ruleDraft.metric === 'winner'"
                        class="w-full bg-black border border-white/20 rounded-lg p-2 text-gold font-mono font-bold text-xs disabled:opacity-50">
                        <option v-for="op in ['>=', '>', '=', '!=', '<=', '<']" :key="op" :value="op">{{ op }}</option>
                      </select>
                    </div>
                    <div>
                      <label class="block text-[10px] text-white/40 mb-1">Valeur Cible</label>
                      <select v-if="ruleDraft.metric === 'winner'" v-model="ruleDraft.value"
                        class="w-full bg-black border border-gold/40 rounded-lg p-2 text-gold font-bold text-xs">
                        <option value="home">🏆 Victoire de : {{ currentWinnerHomeLabel }}</option>
                        <option value="away">🏆 Victoire de : {{ currentWinnerAwayLabel }}</option>
                      </select>
                      <input v-else v-model="ruleDraft.value" type="text" placeholder="ex: 10 ou 85.5"
                        class="w-full bg-black border border-white/20 rounded-lg p-2 text-white font-mono text-xs font-bold" />
                    </div>
                  </div>
                </div>

                <!-- Condition 2 (Si Règle Composée AND / OR) -->
                <div v-if="isComposedRule" class="p-3 bg-gold/5 border border-gold/30 rounded-xl space-y-2">
                  <div class="flex items-center justify-between">
                    <span class="text-[9px] text-yellow-400 font-black uppercase">
                      Condition 2 (Lien : {{ logicalOperator }})
                    </span>
                    <span class="px-2 py-0.5 bg-yellow-400/20 text-yellow-400 text-[8px] font-black rounded uppercase">
                      COMPOSÉ
                    </span>
                  </div>
                  <div class="grid grid-cols-3 gap-2">
                    <div class="col-span-3">
                      <label class="block text-[10px] text-white/40 mb-1">Métrique Condition 2</label>
                      <select v-model="secondRuleDraft.metric"
                        class="w-full bg-black border border-white/20 rounded-lg p-2 text-white text-xs">
                        <option value="total_stars">Total Étoiles</option>
                        <option value="average_destruction">Destruction Moyenne (%)</option>
                        <option value="three_star_count">3 Étoiles (Perfections)</option>
                        <option value="stars">Étoiles Individuelles</option>
                      </select>
                    </div>
                    <div>
                      <label class="block text-[10px] text-white/40 mb-1">Opérateur 2</label>
                      <select v-model="secondRuleDraft.operator"
                        class="w-full bg-black border border-white/20 rounded-lg p-2 text-gold font-mono font-bold text-xs">
                        <option v-for="op in ['>=', '>', '=', '!=', '<=', '<']" :key="op" :value="op">{{ op }}</option>
                      </select>
                    </div>
                    <div class="col-span-2">
                      <label class="block text-[10px] text-white/40 mb-1">Valeur Seuil 2</label>
                      <input v-model="secondRuleDraft.value" type="text" placeholder="ex: 80"
                        class="w-full bg-black border border-white/20 rounded-lg p-2 text-white font-mono text-xs font-bold" />
                    </div>
                  </div>
                </div>

                <!-- Simulation Result Box -->
                <div v-if="simResult !== null" class="p-3 bg-black/60 rounded-xl border text-xs font-mono"
                  :class="simResult.result ? 'border-green-500 text-green-400' : 'border-red-500 text-red-400'">
                  <span v-if="simResult.result">✓ EVALUATION AST: <strong>TRUE (YES l'emporte)</strong></span>
                  <span v-else>✗ EVALUATION AST: <strong>FALSE (NO l'emporte)</strong></span>
                </div>
              </div>

            </div>

            <!-- COLONNE 3 : PREVISUALISATION EN DIRECT & AST JSON (RIGHT SIDEBAR) -->
            <div class="lg:col-span-4 space-y-4">

              <!-- Carte de Prévisualisation Joueur (Aperçu Live) -->
              <div class="bg-white/[0.02] border border-gold/30 rounded-2xl p-3.5 space-y-3">
                <div class="flex items-center justify-between border-b border-white/10 pb-2">
                  <h4 class="font-black text-[11px] uppercase text-gold tracking-wider flex items-center gap-1.5">
                    👁️ Prévisualisation Live Marché
                  </h4>
                  <span class="px-2 py-0.5 bg-green-500/20 text-green-400 text-[9px] font-black rounded uppercase">🟢
                    OPEN</span>
                </div>

                <!-- Rendu Exact de la Carte P2P -->
                <div class="bg-[#0b0c12] border border-white/15 rounded-xl p-3 space-y-2.5 shadow-xl">
                  <!-- Header Match -->
                  <div class="flex items-center justify-between text-[10px]">
                    <span class="px-2 py-0.5 bg-gold/15 text-gold font-black rounded uppercase">
                      {{ builderForm.category === 'team' ? '🏆 ÉQUIPE' : (builderForm.category === 'player' ? '👤JOUEUR':
                      '⚔️COMPARAISON') }}
                    </span>
                    <span class="text-white/40 font-mono">Match #{{ selectedMatch?.id || '?' }}</span>
                  </div>

                  <!-- Titre du Marché -->
                  <div class="text-xs font-black text-white leading-tight">
                    {{ generatedTitle }}
                  </div>

                  <!-- Confrontation Clans -->
                  <div class="flex items-center justify-between gap-2 pt-1 border-t border-white/5">
                    <div class="flex items-center gap-1.5">
                      <img :src="selectedMatch?.clan_home_badge || '/default-clan.png'" class="w-4 h-4 object-contain"
                        @error="$event.target.src = '/default-clan.png'" />
                      <span class="text-[10px] font-bold text-white/80 truncate max-w-[90px]">{{
                        selectedMatch?.clan_home || 'Équipe Hôte' }}</span>
                    </div>
                    <span class="text-[9px] font-black text-gold">VS</span>
                    <div class="flex items-center gap-1.5">
                      <span class="text-[10px] font-bold text-white/80 truncate max-w-[90px]">{{
                        selectedMatch?.clan_away || 'Équipe Invitée' }}</span>
                      <img :src="selectedMatch?.clan_away_badge || '/default-clan.png'" class="w-4 h-4 object-contain"
                        @error="$event.target.src = '/default-clan.png'" />
                    </div>
                  </div>

                  <!-- Cotes Fixes YES / NO (Boutons P2P avec Intitulés Précis) -->
                  <div class="grid grid-cols-2 gap-2 pt-1">
                    <div
                      class="px-2.5 py-2 bg-green-500/10 border border-green-500/30 rounded-xl text-left space-y-0.5">
                      <div class="flex items-center justify-between">
                        <span class="text-[9px] font-black text-green-400 uppercase">👍 OUI</span>
                        <span class="text-xs font-black text-gold">×2.00</span>
                      </div>
                      <div class="text-[9.5px] text-white/90 font-semibold leading-tight line-clamp-2">{{
                        yesPositionTitle }}</div>
                    </div>
                    <div class="px-2.5 py-2 bg-red-500/10 border border-red-500/30 rounded-xl text-left space-y-0.5">
                      <div class="flex items-center justify-between">
                        <span class="text-[9px] font-black text-red-400 uppercase">👎 NON</span>
                        <span class="text-xs font-black text-gold">×2.00</span>
                      </div>
                      <div class="text-[9.5px] text-white/90 font-semibold leading-tight line-clamp-2">{{
                        noPositionTitle }}</div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- JSON AST Output -->
              <div class="bg-white/[0.02] border border-white/10 rounded-2xl p-3 space-y-2">
                <span class="text-[10px] text-white/40 uppercase font-bold block">Arbre de Synthèse AST (Engine)</span>
                <pre
                  class="p-2.5 bg-black/90 rounded-xl border border-white/10 font-mono text-[9px] text-green-400 overflow-x-auto leading-relaxed">
            {{ JSON.stringify(buildFinalAST(), null, 2) }}</pre>
              </div>

            </div>

          </div>

          <!-- Actions Footer -->
          <div class="flex items-center justify-between pt-3 border-t border-white/10 gap-3">
            <button @click="runSimulation"
              class="px-4 py-2.5 bg-white/10 border border-white/20 text-white font-bold text-xs rounded-xl hover:bg-white/20 transition-all flex items-center gap-1.5">
              <span>⚡</span> SIMULER L'EVALUATION AST
            </button>

            <div class="flex gap-3">
              <button @click="showBuilderModal = false"
                class="px-4 py-2.5 bg-white/5 border border-white/10 text-white/60 font-bold text-xs rounded-xl hover:bg-white/10">
                Annuler
              </button>
              <button @click="submitBuilderMarket"
                class="px-6 py-2.5 bg-gradient-to-r from-gold to-yellow-600 text-black font-black uppercase text-xs rounded-xl hover:brightness-110 shadow-lg transition-all">
                🚀 PUBLIER LE MARCHÉ SUR LA MARKETPLACE
              </button>
            </div>
          </div>

        </div>
      </div>

      <!-- MODALE BULK GENERATOR -->
      <div v-if="showBulkModal"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <div class="glass-card !p-8 border-gold/30 max-w-md w-full space-y-6">
          <h3 class="font-black text-lg uppercase text-white">🚀 GÉNÉRATION DE MARCHÉS EN LOT</h3>
          <p class="text-xs text-white/70">
            Générez automatiquement 7 marchés P2P standards (Vainqueur, Étoiles 8/10/12, Attaques 3★) pour le match
            sélectionné.
          </p>

          <div>
            <label class="block text-xs font-bold text-white/60 uppercase mb-1">Match Cible</label>
            <select v-model="bulkMatchId"
              class="w-full bg-black border border-white/20 rounded-xl px-4 py-3 text-white text-xs font-bold">
              <option v-for="m in availableMatches" :key="m.id" :value="m.id">
                Match #{{ m.id }} : {{ m.clan_home }} VS {{ m.clan_away }}
              </option>
            </select>
          </div>

          <div class="flex gap-3">
            <button @click="submitBulkGenerate"
              class="flex-1 py-3 bg-gradient-to-r from-gold to-yellow-600 text-black font-black uppercase text-xs rounded-xl">Générer
              7 Marchés</button>
            <button @click="showBulkModal = false"
              class="py-3 px-4 bg-white/10 text-white font-bold text-xs rounded-xl">Annuler</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const { $api, $toast } = useNuxtApp();
useHead({ title: 'Admin Clash Bet P2P V2 — CCA National League' });

const activeSection = ref('markets');
const stats = ref({});
const markets = ref([]);
const withdrawals = ref([]);
const audits = ref([]);
const availableMatches = ref([]);
const adminTickets = ref([]);
const settings = ref({});

const loadingMarkets = ref(true);
const loadingWithdrawals = ref(false);
const loadingAdminTickets = ref(false);
const loadingSettings = ref(false);
const loadingAudits = ref(false);

const showBuilderModal = ref(false);
const showBulkModal = ref(false);
const bulkMatchId = ref(null);
const ticketStatus = ref('all');

const builderForm = ref({
  match_id: null,
  category: 'team',
  title: '',
  description: '',
});

const ruleDraft = ref({
  type: 'comparison',
  subject_type: 'team',
  target: 'home',
  metric: 'total_stars',
  operator: '>=',
  value: '9',
});

const simResult = ref(null);

// --- MARKET BUILDER V2 STATE & COMPUTED ---
const selectedClanSide = ref('home'); // 'home' or 'away'
const selectedPlayerId = ref(null);
const selectedDuelHdv = ref(16);

// --- ETAT SELECTION MULTIPLE ET FILTRES DES MARCHES ADMIN ---
const selectedMarketIds = ref([]);
const marketStatusFilter = ref('all');
const marketCategoryFilter = ref('all');

const marketStatusFilters = [
  { key: 'all', label: 'Tous' },
  { key: 'open', label: '🟢 Open' },
  { key: 'suspended', label: '⏸️ Suspendus' },
  { key: 'settled', label: '✅ Réglés' },
  { key: 'cancelled', label: '❌ Annulés' },
];

const marketCategoryFilters = [
  { key: 'all', label: 'Toutes catégories' },
  { key: 'team', label: '🏆 Équipe' },
  { key: 'player', label: '👤 Joueur' },
  { key: 'comparison', label: '⚔️ Comparaison' },
  { key: 'duel', label: '🥊 Duel H2H' },
];

const marketsPagination = ref({ current_page: 1, last_page: 1, total: 0, per_page: 20 });

const filteredMarkets = computed(() => {
  const statusPriority = { 'open': 1, 'suspended': 2, 'settled': 3, 'cancelled': 4 };
  return markets.value
    .filter(m => {
      const matchStatus = marketStatusFilter.value === 'all' || m.status === marketStatusFilter.value;
      const matchCategory = marketCategoryFilter.value === 'all' || (m.category || 'team') === marketCategoryFilter.value;
      return matchStatus && matchCategory;
    })
    .sort((a, b) => {
      const pA = statusPriority[a.status] || 5;
      const pB = statusPriority[b.status] || 5;
      if (pA !== pB) return pA - pB;
      return b.id - a.id;
    });
});

const isAllMarketsSelected = computed(() => {
  if (filteredMarkets.value.length === 0) return false;
  return filteredMarkets.value.every(m => selectedMarketIds.value.includes(m.id));
});

const toggleSelectAllMarkets = () => {
  if (isAllMarketsSelected.value) {
    selectedMarketIds.value = [];
  } else {
    selectedMarketIds.value = filteredMarkets.value.map(m => m.id);
  }
};

const toggleSelectMarket = (id) => {
  const index = selectedMarketIds.value.indexOf(id);
  if (index > -1) {
    selectedMarketIds.value.splice(index, 1);
  } else {
    selectedMarketIds.value.push(id);
  }
};

const toggleLiveBetting = async (market) => {
  try {
    const res = await $api(`/admin/clash-bet/markets/${market.id}/live-toggle`, { method: 'PUT' });
    market.allow_during_match = res.allow_during_match;
    $toast.success(res.message || 'Option Live Betting mise à jour.');
  } catch (e) {
    $toast.error('Erreur lors de la mise à jour du Live Betting.');
  }
};

const bulkUpdateStatus = async (status) => {
  if (selectedMarketIds.value.length === 0) return;
  try {
    await Promise.all(selectedMarketIds.value.map(id =>
      $api(`/admin/clash-bet/markets/${id}/status`, { method: 'PUT', body: { status } })
    ));
    $toast.success(`Statut '${status}' appliqué à ${selectedMarketIds.value.length} marché(s).`);
    selectedMarketIds.value = [];
    fetchMarkets();
  } catch (e) {
    $toast.error('Erreur lors de la mise à jour en masse.');
  }
};

const bulkCancelMarkets = async () => {
  if (selectedMarketIds.value.length === 0) return;
  if (!confirm(`Annuler définitivement ${selectedMarketIds.value.length} marché(s) ?`)) return;
  try {
    await Promise.all(selectedMarketIds.value.map(id =>
      $api(`/admin/clash-bet/markets/${id}/cancel`, { method: 'POST', body: { reason: 'Annulation en masse admin' } })
    ));
    $toast.success(`${selectedMarketIds.value.length} marché(s) annulé(s) et remboursé(s).`);
    selectedMarketIds.value = [];
    fetchMarkets(); fetchStats();
  } catch (e) {
    $toast.error('Erreur lors de l\'annulation en masse.');
  }
};

const bulkSettleAutoMarkets = async () => {
  if (selectedMarketIds.value.length === 0) return;
  try {
    let successCount = 0;
    for (const id of selectedMarketIds.value) {
      const market = markets.value.find(m => m.id === id);
      if (market && market.rule_definition && market.status !== 'settled') {
        await triggerSettleAuto(market);
        successCount++;
      }
    }
    $toast.success(`Règlement auto exécuté sur ${successCount} marché(s).`);
    selectedMarketIds.value = [];
    fetchMarkets(); fetchStats();
  } catch (e) {
    $toast.error('Erreur lors du règlement en masse.');
  }
};

const deleteMarket = async (market) => {
  if (!confirm(`Supprimer définitivement le marché #${market.id} "${market.title || ''}" ?`)) return;
  try {
    const res = await $api(`/admin/clash-bet/markets/${market.id}/delete`, { method: 'POST' });
    $toast.success(res.message || 'Marché supprimé avec succès.');
    fetchMarkets();
    fetchStats();
  } catch (e) {
    try {
      const res = await $api(`/admin/clash-bet/markets/${market.id}`, { method: 'DELETE' });
      $toast.success(res.message || 'Marché supprimé avec succès.');
      fetchMarkets();
      fetchStats();
    } catch (err) {
      $toast.error(err.data?.message || e.data?.message || 'Erreur lors de la suppression du marché.');
    }
  }
};

const bulkDeleteMarkets = async () => {
  if (selectedMarketIds.value.length === 0) return;
  if (!confirm(`Supprimer définitivement ${selectedMarketIds.value.length} marché(s) sélectionné(s) ?`)) return;
  try {
    await Promise.all(selectedMarketIds.value.map(id =>
      $api(`/admin/clash-bet/markets/${id}/delete`, { method: 'POST' })
    ));
    $toast.success(`${selectedMarketIds.value.length} marché(s) supprimé(s) définitivement.`);
    selectedMarketIds.value = [];
    fetchMarkets();
    fetchStats();
  } catch (e) {
    $toast.error('Erreur lors de la suppression en masse des marchés.');
  }
};

// --- LOGIQUE COMPOSÉE (AND / OR) ---
const isComposedRule = ref(false);
const logicalOperator = ref('AND');
const secondRuleDraft = ref({
  subject_type: 'team',
  target: 'home',
  metric: 'average_destruction',
  operator: '>=',
  value: '80',
});

// Auto-assign category and reset metrics based on subject_type
watch(() => ruleDraft.value.subject_type, (newType) => {
  if (newType === 'team') builderForm.value.category = 'team';
  else if (newType === 'player') builderForm.value.category = 'player';
  else if (newType === 'match') builderForm.value.category = 'comparison';
  else if (newType === 'duel') {
    builderForm.value.category = 'duel';
    ruleDraft.value.metric = 'winner';
    ruleDraft.value.operator = '=';
    ruleDraft.value.value = 'home';
    ruleDraft.value.target = Number(selectedDuelHdv.value || 16);
  }
}, { immediate: true });

// Auto-reset operator and value when selecting 'winner' metric
watch(() => ruleDraft.value.metric, (newMetric) => {
  if (newMetric === 'winner') {
    ruleDraft.value.operator = '=';
    if (ruleDraft.value.value !== 'home' && ruleDraft.value.value !== 'away') {
      ruleDraft.value.value = 'home';
    }
  } else if (ruleDraft.value.value === 'home' || ruleDraft.value.value === 'away') {
    ruleDraft.value.value = '9';
  }
});

const selectedMatch = computed(() => {
  if (!builderForm.value.match_id) return availableMatches.value[0] || null;
  return availableMatches.value.find(m => m.id === builderForm.value.match_id) || availableMatches.value[0] || null;
});

const currentClanName = computed(() => {
  if (!selectedMatch.value) return 'Clan';
  return selectedClanSide.value === 'home' ? selectedMatch.value.clan_home : selectedMatch.value.clan_away;
});

const currentClanPlayers = computed(() => {
  if (!selectedMatch.value) return [];
  return selectedClanSide.value === 'home'
    ? (selectedMatch.value.clan_home_players || [])
    : (selectedMatch.value.clan_away_players || []);
});

const currentWinnerHomeLabel = computed(() => {
  if (!selectedMatch.value) return 'Local';
  if (ruleDraft.value.subject_type === 'duel') {
    const hdv = Number(selectedDuelHdv.value || 16);
    const duel = (selectedMatch.value.duels || []).find(d => Number(d.hdv_level) === hdv);
    return duel?.player_home_name ? `${duel.player_home_name} (${selectedMatch.value.clan_home})` : `${selectedMatch.value.clan_home} (HDV${hdv})`;
  }
  return selectedMatch.value.clan_home || 'Clan Hôte';
});

const currentWinnerAwayLabel = computed(() => {
  if (!selectedMatch.value) return 'Visiteur';
  if (ruleDraft.value.subject_type === 'duel') {
    const hdv = Number(selectedDuelHdv.value || 16);
    const duel = (selectedMatch.value.duels || []).find(d => Number(d.hdv_level) === hdv);
    return duel?.player_away_name ? `${duel.player_away_name} (${selectedMatch.value.clan_away})` : `${selectedMatch.value.clan_away} (HDV${hdv})`;
  }
  return selectedMatch.value.clan_away || 'Clan Invité';
});

// Auto-sync player/duel target when selecting player, duel or side
watch([selectedClanSide, selectedPlayerId, selectedDuelHdv, () => ruleDraft.value.subject_type], () => {
  if (ruleDraft.value.subject_type === 'team') {
    ruleDraft.value.target = selectedClanSide.value;
  } else if (ruleDraft.value.subject_type === 'player') {
    ruleDraft.value.target = selectedPlayerId.value || (currentClanPlayers.value[0]?.id || 1);
  } else if (ruleDraft.value.subject_type === 'duel') {
    ruleDraft.value.target = Number(selectedDuelHdv.value || 16);
  }
});

// Construction de l'arbre AST final
const buildFinalAST = () => {
  const val1 = isNaN(Number(ruleDraft.value.value)) ? ruleDraft.value.value : Number(ruleDraft.value.value);
  const rule1 = {
    type: 'comparison',
    subject_type: ruleDraft.value.subject_type,
    target: ruleDraft.value.target,
    metric: ruleDraft.value.metric,
    operator: ruleDraft.value.operator,
    value: val1,
  };

  if (!isComposedRule.value) {
    return rule1;
  }

  const val2 = isNaN(Number(secondRuleDraft.value.value)) ? secondRuleDraft.value.value : Number(secondRuleDraft.value.value);
  const rule2 = {
    type: 'comparison',
    subject_type: secondRuleDraft.value.subject_type,
    target: secondRuleDraft.value.target,
    metric: secondRuleDraft.value.metric,
    operator: secondRuleDraft.value.operator,
    value: val2,
  };

  return {
    type: 'logical',
    operator: logicalOperator.value,
    children: [rule1, rule2],
  };
};

// --- GENERATEUR DE TITRES INTELLIGENTS DE POSITIONS (OUI / NON) ENGINE ---
const formatMetricName = (metric) => {
  const map = {
    total_stars: 'étoile(s)',
    average_destruction: '% de destruction',
    three_star_count: 'attaque(s) 3★',
    two_star_count: 'attaque(s) 2★',
    one_star_count: 'attaque(s) 1★',
    stars: 'étoile(s) individuelle(s)',
    destruction: '% de destruction individuelle',
    winner: 'victoire(s) du match',
    attacks: 'attaque(s)',
  };
  return map[metric] || metric;
};

const formatOperatorPhrase = (op, isNegated = false) => {
  if (!isNegated) {
    switch (op) {
      case '>=': return 'au moins';
      case '>': return 'strictement plus de';
      case '=': return 'exactement';
      case '!=': return 'différent de';
      case '<=': return 'au maximum';
      case '<': return 'strictement moins de';
      default: return op;
    }
  } else {
    // Inversion stricte (Lois de De Morgan pour position NON)
    switch (op) {
      case '>=': return 'strictement moins de';
      case '>': return 'au maximum';
      case '=': return 'différent de';
      case '!=': return 'exactement';
      case '<=': return 'strictement plus de';
      case '<': return 'au moins';
      default: return op;
    }
  }
};

const generateSingleRuleTitle = (rule, isNegated = false) => {
  const match = selectedMatch.value;
  if (!match) return isNegated ? 'Position NON' : 'Position OUI';

  // --- Cas Spécial : Duel H2H ---
  if (rule.subject_type === 'duel') {
    const hdv = Number(selectedDuelHdv.value || rule.target || 16);
    const duelObj = match.duels?.find(d => Number(d.hdv_level) === hdv);
    const pHome = duelObj?.player_home_name ? `l'HDV${hdv} (${duelObj.player_home_name})` : `l'HDV${hdv} de ${match.clan_home || 'Clan Hôte'}`;
    const pAway = duelObj?.player_away_name ? `l'HDV${hdv} (${duelObj.player_away_name})` : `l'HDV${hdv} de ${match.clan_away || 'Clan Invité'}`;

    if (rule.metric === 'winner') {
      const winnerName = rule.value === 'home' ? pHome : (rule.value === 'away' ? pAway : pHome);
      const loserName = rule.value === 'home' ? pAway : pHome;
      return isNegated
        ? `[Duel HDV${hdv}] ${winnerName} ne remporte pas le duel face à ${loserName}`
        : `[Duel HDV${hdv}] ${winnerName} remporte le duel face à ${loserName}`;
    }

    const metricText = formatMetricName(rule.metric);
    const opPhrase = formatOperatorPhrase(rule.operator, isNegated);
    return `[Duel HDV${hdv}] ${pHome} VS ${pAway} : ${metricText} ${opPhrase} ${rule.value}`;
  }

  // --- Cas Spécial : Vainqueur du Match ---
  if (rule.metric === 'winner') {
    const winnerSide = rule.value === 'home' ? 'home' : (rule.value === 'away' ? 'away' : rule.target);
    const winnerClan = winnerSide === 'home' ? (match.clan_home || 'Équipe Hôte') : (match.clan_away || 'Équipe Invitée');
    const loserClan = winnerSide === 'home' ? (match.clan_away || 'Équipe Invitée') : (match.clan_home || 'Équipe Hôte');
    return isNegated
      ? `${winnerClan} ne gagne pas le match (${loserClan} gagne ou nul)`
      : `${winnerClan} gagne le match`;
  }

  // Pour subject_type='team', rule.target est 'home' ou 'away'
  // Pour subject_type='player', rule.target est un ID numérique → on recherche le joueur dans les deux listes
  let clanName = match.clan_home || 'Clan Hôte';
  let playerName = null;

  if (rule.subject_type === 'player') {
    const playerId = Number(selectedPlayerId.value || rule.target);
    const homeP = (match.clan_home_players || []).find(p => p.id === playerId);
    const awayP = (match.clan_away_players || []).find(p => p.id === playerId);

    if (homeP) {
      playerName = homeP.name ? `l'HDV (${homeP.name})` : `l'HDV de ${match.clan_home}`;
      clanName = match.clan_home || 'Clan Hôte';
    } else if (awayP) {
      playerName = awayP.name ? `l'HDV (${awayP.name})` : `l'HDV de ${match.clan_away}`;
      clanName = match.clan_away || 'Clan Invité';
    } else {
      clanName = selectedClanSide.value === 'home' ? (match.clan_home || 'Clan Hôte') : (match.clan_away || 'Clan Invité');
      playerName = `l'HDV (Joueur #${rule.target || '?'})`;
    }
  } else {
    clanName = rule.target === 'home' ? (match.clan_home || 'Clan Hôte') : (match.clan_away || 'Clan Invité');
  }

  const metricText = formatMetricName(rule.metric);
  const opPhrase = formatOperatorPhrase(rule.operator, isNegated);

  if (rule.subject_type === 'team') {
    return `${clanName} aura ${opPhrase} ${rule.value} ${metricText}`;
  } else if (rule.subject_type === 'player') {
    return `${playerName} (${clanName}) aura ${opPhrase} ${rule.value} ${metricText}`;
  } else {
    return `Le match aura ${opPhrase} ${rule.value} ${metricText}`;
  }
};

const describeASTNode = (node, match, isNegated = false) => {
  if (!node) return isNegated ? 'Position NON' : 'Position OUI';

  if (node.type === 'logical') {
    const op = node.operator || 'AND';
    const linkWord = isNegated
      ? (op === 'AND' ? ' OU ' : ' ET ')
      : (op === 'AND' ? ' ET ' : ' OU ');
    return (node.children || [])
      .map(child => describeASTNode(child, match, isNegated))
      .join(linkWord);
  }

  const subjectType = node.subject_type || 'team';
  const target = node.target || 'home';
  const metric = node.metric || 'total_stars';
  const operator = node.operator || '>=';
  const value = node.value;

  const m = match || selectedMatch.value;

  // Duel H2H
  if (subjectType === 'duel') {
    const hdv = Number(target || 16);
    const duel = (m?.duels || []).find(d => Number(d.hdv_level) === hdv);
    const pHome = duel?.player_home_name ? `l'HDV${hdv} (${duel.player_home_name})` : `l'HDV${hdv} de ${m?.clan_home || 'Clan Hôte'}`;
    const pAway = duel?.player_away_name ? `l'HDV${hdv} (${duel.player_away_name})` : `l'HDV${hdv} de ${m?.clan_away || 'Clan Invité'}`;

    if (metric === 'winner') {
      const winnerName = value === 'home' ? pHome : (value === 'away' ? pAway : pHome);
      const loserName = value === 'home' ? pAway : pHome;
      return isNegated
        ? `[Duel HDV${hdv}] ${winnerName} ne remporte pas le duel face à ${loserName}`
        : `[Duel HDV${hdv}] ${winnerName} remporte le duel face à ${loserName}`;
    }

    const metricText = formatMetricName(metric);
    const opPhrase = formatOperatorPhrase(operator, isNegated);
    return `[Duel HDV${hdv}] ${pHome} VS ${pAway} : ${metricText} ${opPhrase} ${value}`;
  }

  // Match Winner
  if (metric === 'winner') {
    const winnerClan = value === 'home'
      ? (m?.clan_home || m?.home || 'Clan Hôte')
      : (m?.clan_away || m?.away || 'Clan Invité');
    const loserClan = value === 'home'
      ? (m?.clan_away || m?.away || 'Clan Invité')
      : (m?.clan_home || m?.home || 'Clan Hôte');
    return isNegated
      ? `${winnerClan} ne gagne pas le match (${loserClan} gagne ou nul)`
      : `${winnerClan} gagne le match`;
  }

  let entityName = 'L\'équipe';
  if (subjectType === 'team') {
    entityName = target === 'home'
      ? (m?.clan_home || m?.home || 'Clan Hôte')
      : (m?.clan_away || m?.away || 'Clan Invité');
  } else if (subjectType === 'player') {
    const playerId = Number(target);
    const homeP = (m?.clan_home_players || []).find(p => p.id === playerId);
    const awayP = (m?.clan_away_players || []).find(p => p.id === playerId);
    if (homeP) entityName = `${homeP.name} (${m?.clan_home || 'Hôte'})`;
    else if (awayP) entityName = `${awayP.name} (${m?.clan_away || 'Invité'})`;
    else entityName = `Joueur #${target}`;
  } else {
    entityName = 'Le match';
  }

  const metricText = formatMetricName(metric);
  const opPhrase = formatOperatorPhrase(operator, isNegated);

  return `${entityName} aura ${opPhrase} ${value} ${metricText}`;
};

const selectedMatchForMarket = (market) => {
  if (market.match) return market.match;
  return availableMatches.value.find(m => m.id === market.match_id) || null;
};

const yesPositionTitle = computed(() => {
  if (!isComposedRule.value) {
    return generateSingleRuleTitle(ruleDraft.value, false);
  }
  const title1 = generateSingleRuleTitle(ruleDraft.value, false);
  const title2 = generateSingleRuleTitle({
    subject_type: secondRuleDraft.value.subject_type,
    target: secondRuleDraft.value.target,
    metric: secondRuleDraft.value.metric,
    operator: secondRuleDraft.value.operator,
    value: secondRuleDraft.value.value,
  }, false);
  const op = logicalOperator.value === 'AND' ? 'ET' : 'OU';
  return `${title1} ${op} ${title2}`;
});

const noPositionTitle = computed(() => {
  if (!isComposedRule.value) {
    return generateSingleRuleTitle(ruleDraft.value, true);
  }
  const title1 = generateSingleRuleTitle(ruleDraft.value, true);
  const title2 = generateSingleRuleTitle({
    subject_type: secondRuleDraft.value.subject_type,
    target: secondRuleDraft.value.target,
    metric: secondRuleDraft.value.metric,
    operator: secondRuleDraft.value.operator,
    value: secondRuleDraft.value.value,
  }, true);
  const op = logicalOperator.value === 'AND' ? 'OU' : 'ET';
  return `${title1} ${op} ${title2}`;
});

// Auto-generate title for live preview & market creation
const generatedTitle = computed(() => {
  if (builderForm.value.title && builderForm.value.title.trim() !== '') {
    return builderForm.value.title;
  }
  return yesPositionTitle.value;
});

const ticketFilters = [
  { key: 'all', label: 'Tous' },
  { key: 'open', label: '🟡 Open' },
  { key: 'matched', label: '🔵 Matchés' },
  { key: 'settled', label: '✅ Réglés' },
];

const settingLabel = (key) => ({
  clash_bet_commission_percentage: 'Commission (%)',
  clash_bet_close_offset_minutes: 'Fermeture auto (min avant match)',
  clash_bet_min_amount: 'Mise minimale (FCFA)',
  clash_bet_max_amount: 'Mise maximale (FCFA)',
  clash_bet_withdrawal_fee_percentage: 'Frais retrait (%)',
}[key] || key);

const formatFcfa = (n) => { if (!n && n !== 0) return '0 FCFA'; return Number(n).toLocaleString('fr-FR') + ' FCFA'; };
const formatDate = (d) => { if (!d) return '-'; return new Date(d).toLocaleString('fr-FR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }); };

const getStatusBadgeClass = (s) => ({
  open: 'bg-green-500/10 text-green-400 border border-green-500/30 px-2 py-0.5 rounded text-[10px] font-bold uppercase',
  suspended: 'bg-amber-500/10 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded text-[10px] font-bold uppercase',
  matched: 'bg-blue-500/10 text-blue-400 border border-blue-500/30 px-2 py-0.5 rounded text-[10px] font-bold uppercase',
  closed: 'bg-blue-500/10 text-blue-400 border border-blue-500/30 px-2 py-0.5 rounded text-[10px] font-bold uppercase',
  settled: 'bg-gold/10 text-gold border border-gold/30 px-2 py-0.5 rounded text-[10px] font-bold uppercase',
  cancelled: 'bg-red-500/10 text-red-400 border border-red-500/30 px-2 py-0.5 rounded text-[10px] font-bold uppercase',
}[s] || 'bg-white/5 text-white');

const fetchStats = async () => {
  try { stats.value = await $api('/admin/clash-bet/stats'); } catch (e) { console.error(e); }
};

const fetchMarkets = async (page = 1) => {
  loadingMarkets.value = true;
  try {
    const params = { page };
    if (marketStatusFilter.value && marketStatusFilter.value !== 'all') {
      params.status = marketStatusFilter.value;
    }
    if (marketCategoryFilter.value && marketCategoryFilter.value !== 'all') {
      params.category = marketCategoryFilter.value;
    }
    const res = await $api('/admin/clash-bet/markets', { params });
    if (res && res.data) {
      markets.value = res.data;
      marketsPagination.value = {
        current_page: res.current_page || 1,
        last_page: res.last_page || 1,
        total: res.total || res.data.length,
        per_page: res.per_page || 10,
      };
    } else {
      markets.value = res || [];
    }
  } catch (e) {
    console.error(e);
  } finally {
    loadingMarkets.value = false;
  }
};

watch([marketStatusFilter, marketCategoryFilter], () => {
  fetchMarkets(1);
});

const fetchWithdrawals = async () => {
  loadingWithdrawals.value = true;
  try {
    const res = await $api('/admin/clash-bet/withdrawals');
    withdrawals.value = res.data || res || [];
  } catch (e) { console.error(e); } finally { loadingWithdrawals.value = false; }
};

const fetchAdminTickets = async () => {
  loadingAdminTickets.value = true;
  try {
    const params = ticketStatus.value !== 'all' ? { status: ticketStatus.value } : {};
    const res = await $api('/admin/clash-bet/tickets', { params });
    adminTickets.value = res.data || res || [];
  } catch (e) { console.error(e); } finally { loadingAdminTickets.value = false; }
};

const fetchAudits = async () => {
  loadingAudits.value = true;
  try {
    const res = await $api('/admin/clash-bet/audits');
    audits.value = res.data || res || [];
  } catch (e) { console.error(e); } finally { loadingAudits.value = false; }
};

const fetchSettings = async () => {
  loadingSettings.value = true;
  try {
    const res = await $api('/admin/clash-bet/settings');
    if (res) {
      res.clash_bet_public_enabled = res.clash_bet_public_enabled == true || res.clash_bet_public_enabled == '1' || res.clash_bet_public_enabled == 1;
      settings.value = res;
    }
  } catch (e) {
    console.error(e);
  } finally {
    loadingSettings.value = false;
  }
};

const saveSettings = async () => {
  try {
    await $api('/admin/clash-bet/settings', { method: 'PUT', body: settings.value });
    $toast.success('Configuration enregistrée.');
  } catch { $toast.error('Erreur lors de la sauvegarde.'); }
};

const openBuilderModal = async () => {
  try {
    const res = await $api('/admin/clash-bet/available-matches');
    availableMatches.value = res.data || res || [];
    console.log(res.value)
    if (availableMatches.value.length > 0) {
      builderForm.value.match_id = availableMatches.value[0].id;
    } else {
      $toast.info('Aucun match à venir n\'est disponible pour créer un marché.');
    }
    showBuilderModal.value = true;
  } catch (e) {
    console.error('Erreur openBuilderModal:', e);
    $toast.error('Impossible de charger les matchs disponibles.');
  }
};

const openBulkModal = async () => {
  try {
    const res = await $api('/admin/clash-bet/available-matches');
    availableMatches.value = res.data || res || [];
    if (availableMatches.value.length > 0) {
      bulkMatchId.value = availableMatches.value[0].id;
    }
    showBulkModal.value = true;
  } catch (e) {
    $toast.error('Impossible de charger les matchs.');
  }
};

const runSimulation = async () => {
  const rule = buildFinalAST();
  const mockDataset = {
    team: {
      home: { total_stars: 10, average_destruction: 84.5, three_star_count: 2 },
      away: { total_stars: 8, average_destruction: 72.0, three_star_count: 1 }
    },
    player: {
      42: { stars: 3, destruction: 100 }
    }
  };

  try {
    const res = await $api('/admin/clash-bet/markets/simulate', {
      method: 'POST',
      body: { rule_definition: rule, mock_dataset: mockDataset }
    });
    simResult.value = res.eval;
  } catch (e) {
    $toast.error('Erreur de simulation de règle.');
  }
};

const submitBuilderMarket = async () => {
  if (!builderForm.value.match_id) {
    $toast.error('Veuillez sélectionner un match CCA.');
    return;
  }
  const payload = {
    match_id: builderForm.value.match_id,
    category: builderForm.value.category || 'team',
    title: generatedTitle.value,
    rule_definition: buildFinalAST()
  };

  try {
    const res = await $api('/admin/clash-bet/markets/builder', { method: 'POST', body: payload });
    $toast.success(res?.message || '🚀 Marché P2P créé et publié sur la marketplace !');
    showBuilderModal.value = false;
    fetchMarkets();
    fetchStats();
  } catch (e) {
    console.error('Erreur submitBuilderMarket:', e);
    $toast.error(e?.data?.message || e?.message || 'Erreur lors de la publication du marché.');
  }
};

const submitBulkGenerate = async () => {
  if (!bulkMatchId.value) return;
  try {
    const res = await $api('/admin/clash-bet/markets/bulk-generate', {
      method: 'POST',
      body: { match_id: bulkMatchId.value }
    });
    $toast.success(res.message);
    showBulkModal.value = false;
    fetchMarkets(); fetchStats();
  } catch (e) {
    $toast.error(e?.data?.message || 'Erreur génération en lot.');
  }
};

const triggerSettleAuto = async (market) => {
  if (!confirm(`Confirmer le règlement automatique de "${market.title}" par le Rule Engine ?`)) return;
  try {
    const res = await $api(`/admin/clash-bet/markets/${market.id}/settle-auto`, { method: 'POST' });
    $toast.success(res.message);
    fetchMarkets(); fetchStats();
  } catch (e) {
    $toast.error(e?.data?.message || 'Erreur règlement automatique.');
  }
};

const updateMarketStatus = async (market, newStatus) => {
  try {
    await $api(`/admin/clash-bet/markets/${market.id}/status`, { method: 'PUT', body: { status: newStatus } });
    $toast.success(`Statut du marché mis à jour : ${newStatus}`);
    fetchMarkets();
  } catch { $toast.error('Erreur mise à jour statut.'); }
};

const cancelMarket = async (market) => {
  const reason = prompt('Raison de l\'annulation (remboursement intégral sans frais) :');
  if (!reason) return;
  try {
    const res = await $api(`/admin/clash-bet/markets/${market.id}/cancel`, { method: 'POST', body: { reason } });
    $toast.success(res.message || 'Marché annulé et tous les tickets remboursés.');
    fetchMarkets(); fetchStats();
  } catch { $toast.error('Erreur annulation marché.'); }
};

const processWithdrawal = async (withdrawal, action) => {
  const note = prompt(action === 'approve' ? 'Note d\'approbation (optionnel) :' : 'Motif du rejet :');
  if (action === 'reject' && !note) return;
  try {
    const res = await $api(`/admin/clash-bet/withdrawals/${withdrawal.id}/process`, { method: 'PUT', body: { action, admin_note: note } });
    $toast.success(res.message);
    fetchWithdrawals(); fetchStats();
  } catch { $toast.error('Erreur traitement du retrait.'); }
};

onMounted(() => {
  fetchStats();
  fetchMarkets();
  fetchWithdrawals();
  fetchSettings();
});
</script>

<style scoped>
.tab-admin-btn {
  padding: 0.5rem 1rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 0.75rem;
  font-size: 0.75rem;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.6);
  transition: all 0.2s;
}

.tab-admin-btn:hover {
  color: white;
  background: rgba(255, 255, 255, 0.1);
}

.tab-admin-btn.active {
  background: rgba(212, 175, 55, 0.1);
  color: #d4af37;
  border-color: rgba(212, 175, 55, 0.4);
}

.glass-card {
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(12px);
  border-radius: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 1.5rem;
}

.palette-btn {
  padding: 0.35rem 0.5rem;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 0.5rem;
  font-size: 10px;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.6);
  transition: all 0.2s;
  cursor: pointer;
}

.palette-btn:hover {
  background: rgba(255, 255, 255, 0.08);
  color: white;
  border-color: rgba(255, 255, 255, 0.2);
}

.palette-btn.active {
  background: rgba(212, 175, 55, 0.15);
  color: #d4af37;
  border-color: rgba(212, 175, 55, 0.4);
}
</style>
