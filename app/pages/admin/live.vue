<template>
  <div class="live-admin-page min-h-screen pb-20 text-white">
    <div class="container mx-auto px-3 sm:px-6 py-4 sm:py-8 max-w-7xl pt-16">

      <!-- Top Action Bar & Header -->
      <div
        class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 sm:mb-8 pb-4 border-b border-white/10">
        <div>
          <div class="flex items-center gap-2">
            <span class="w-3 h-3 rounded-full bg-red-500 animate-ping"></span>
            <span class="text-red-500 font-bold uppercase tracking-widest text-[10px]">LIVE ARENA ADMIN</span>
          </div>
          <h1 class="text-2xl sm:text-4xl font-black italic tracking-tight uppercase mt-0.5">
            GESTION DU <span class="text-gold">TOURNOI</span>
          </h1>
        </div>

        <div class="flex flex-wrap gap-2 w-full md:w-auto">
          <NuxtLink to="/draw" target="_blank"
            class="flex-1 md:flex-none py-2.5 px-3.5 bg-red-600 hover:bg-red-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-red-600/20 transition-all flex items-center justify-center gap-1.5">
            <span class="animate-pulse">🔴</span>
            <span>Écran Public</span>
          </NuxtLink>

          <button @click="showDrawModal = true"
            class="flex-1 md:flex-none py-2.5 px-3.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-1.5">
            <span>🎲</span>
            <span>Tirage des Poules</span>
          </button>

          <button @click="openCreateMatchModal"
            class="flex-1 md:flex-none py-2.5 px-3.5 bg-gold hover:bg-yellow-400 text-black font-bold text-xs rounded-xl shadow-lg shadow-gold/20 transition-all flex items-center justify-center gap-1.5">
            <span>➕</span>
            <span>Programmer un Match</span>
          </button>

          <button @click="fetchData"
            class="py-2.5 px-3 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center"
            title="Actualiser les données">
            🔄
          </button>
        </div>
      </div>

      <!-- Navigation Tabs -->
      <div class="flex justify-center mb-6">
        <div
          class="inline-flex p-1 bg-black/80 backdrop-blur-md rounded-xl border border-white/10 w-full sm:w-auto max-w-md">
          <button @click="activeTab = 'standings'"
            class="flex-1 py-2.5 px-3 sm:px-6 font-black text-xs sm:text-sm uppercase tracking-wider rounded-lg transition-all flex items-center justify-center gap-1.5"
            :class="activeTab === 'standings' ? 'bg-gold text-black shadow-lg shadow-gold/20' : 'text-white/60 hover:text-white'">
            <span>📊</span>
            <span>Classements (Poules)</span>
          </button>

          <button @click="activeTab = 'matches'"
            class="flex-1 py-2.5 px-3 sm:px-6 font-black text-xs sm:text-sm uppercase tracking-wider rounded-lg transition-all flex items-center justify-center gap-1.5"
            :class="activeTab === 'matches' ? 'bg-gold text-black shadow-lg shadow-gold/20' : 'text-white/60 hover:text-white'">
            <span>⚔️</span>
            <span>Tous les Matchs ({{ allMatches.length }})</span>
          </button>
        </div>
      </div>

      <!-- TAB 1: CLASSEMENTS ET TIRAGE -->
      <div v-if="activeTab === 'standings'" class="space-y-6 sm:space-y-8">

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-8">

          <!-- Standings Group A -->
          <div class="glass-card p-3.5 sm:p-6 border-blue-500/30">
            <div class="flex justify-between items-center mb-3 sm:mb-5 border-b border-blue-500/20 pb-3">
              <h3 class="text-base sm:text-xl font-black italic text-blue-400 uppercase flex items-center gap-2">
                <span>🛡️</span> CLASSEMENT GROUPE A
              </h3>
              <span
                class="text-[9px] sm:text-xs text-blue-300/90 bg-blue-500/20 px-2 py-0.5 rounded-full font-bold uppercase">
                Top 2 Qualifiés
              </span>
            </div>

            <!-- Mobile View (< 640px) -->
            <div class="block sm:hidden space-y-2.5 mb-4">
              <div v-for="row in standings.A" :key="'adm-mob-a-' + row.clan_id"
                class="p-3 rounded-xl border transition-all"
                :class="row.rank <= 2 ? 'bg-blue-950/40 border-blue-500/50' : 'bg-white/5 border-white/10'">
                <div class="flex justify-between items-center mb-2">
                  <div class="flex items-center gap-2 truncate">
                    <span
                      class="w-5 h-5 rounded-full flex items-center justify-center font-black text-[10px] flex-shrink-0"
                      :class="row.rank <= 2 ? 'bg-blue-500 text-black' : 'bg-white/10 text-white/60'">
                      #{{ row.rank }}
                    </span>
                    <img :src="row.badge_url" class="w-6 h-6 object-contain flex-shrink-0" />
                    <span class="font-bold text-xs text-white truncate max-w-[130px]">{{ row.clan_name }}</span>
                  </div>
                  <span class="font-black text-gold text-sm flex-shrink-0">{{ row.points }} Pts</span>
                </div>
                <div class="grid grid-cols-3 gap-1.5 text-[10px] text-center bg-black/30 p-2 rounded">
                  <div>
                    <span class="text-white/40 block text-[8px]">BILAN</span>
                    <span class="font-bold text-white">{{ row.won }}V-{{ row.drawn }}N-{{ row.lost }}D</span>
                  </div>
                  <div>
                    <span class="text-white/40 block text-[8px]">ÉTOILES</span>
                    <span class="text-gold font-bold">{{ row.total_stars }} ⭐️</span>
                  </div>
                  <div>
                    <span class="text-white/40 block text-[8px]">DESTRUCTION</span>
                    <span class="font-bold text-white">{{ row.total_destruction }}%</span>
                  </div>
                </div>
              </div>

              <div v-if="!standings.A || standings.A.length === 0"
                class="text-center py-6 text-white/30 text-xs uppercase font-bold">
                Aucun clan assigné au Groupe A
              </div>
            </div>

            <!-- Desktop View (>= 640px) -->
            <div class="hidden sm:block overflow-x-auto mb-4">
              <table class="w-full text-left text-xs">
                <thead>
                  <tr class="border-b border-white/10 text-white/40 uppercase">
                    <th class="py-2" title="Rang">Rang</th>
                    <th class="py-2">Clan</th>
                    <th class="py-2 text-center" title="Matchs Joués">J (Joués)</th>
                    <th class="py-2 text-center text-green-400" title="Victoires">V (Victoires)</th>
                    <th class="py-2 text-center text-yellow-400" title="Matchs Nuls">N (Nuls)</th>
                    <th class="py-2 text-center text-red-400" title="Défaites">D (Défaites)</th>
                    <th class="py-2 text-center text-gold" title="Étoiles CoC">⭐️ (Étoiles)</th>
                    <th class="py-2 text-center" title="Pourcentage de destruction">% (Destr.)</th>
                    <th class="py-2 text-right text-gold" title="Points au classement">Pts (Points)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="row in standings.A" :key="row.clan_id" class="border-b border-white/5"
                    :class="row.rank <= 2 ? 'bg-blue-500/10 font-bold' : ''">
                    <td class="py-2.5 font-black" :class="row.rank <= 2 ? 'text-blue-400' : 'text-white/40'">
                      #{{ row.rank }}
                    </td>
                    <td class="py-2.5 flex items-center gap-2">
                      <img :src="row.badge_url" class="w-5 h-5 object-contain" />
                      <span class="truncate max-w-[120px]">{{ row.clan_name }}</span>
                    </td>
                    <td class="text-center font-semibold">{{ row.played }}</td>
                    <td class="text-center text-green-400 font-bold">{{ row.won }}</td>
                    <td class="text-center text-yellow-400 font-bold">{{ row.drawn }}</td>
                    <td class="text-center text-red-400 font-bold">{{ row.lost }}</td>
                    <td class="text-center text-gold font-bold">{{ row.total_stars }}</td>
                    <td class="text-center">{{ row.total_destruction }}%</td>
                    <td class="text-right font-black text-sm text-gold">{{ row.points }}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Légende -->
            <div
              class="p-2 rounded-lg bg-black/40 border border-white/5 text-[9px] sm:text-[10px] text-white/50 flex flex-wrap gap-x-3 gap-y-1">
              <span><b>J</b>: Matchs Joués</span>
              <span><b class="text-green-400">V</b>: Victoires</span>
              <span><b class="text-yellow-400">N</b>: Nuls</span>
              <span><b class="text-red-400">D</b>: Défaites</span>
              <span><b class="text-gold">⭐️</b>: Étoiles</span>
              <span><b>%</b>: % Destruction</span>
              <span><b class="text-gold">Pts</b>: Points (V=3, N=1)</span>
            </div>
          </div>

          <!-- Standings Group B -->
          <div class="glass-card p-3.5 sm:p-6 border-purple-500/30">
            <div class="flex justify-between items-center mb-3 sm:mb-5 border-b border-purple-500/20 pb-3">
              <h3 class="text-base sm:text-xl font-black italic text-purple-400 uppercase flex items-center gap-2">
                <span>🛡️</span> CLASSEMENT GROUPE B
              </h3>
              <span
                class="text-[9px] sm:text-xs text-purple-300/90 bg-purple-500/20 px-2 py-0.5 rounded-full font-bold uppercase">
                Top 2 Qualifiés
              </span>
            </div>

            <!-- Mobile View (< 640px) -->
            <div class="block sm:hidden space-y-2.5 mb-4">
              <div v-for="row in standings.B" :key="'adm-mob-b-' + row.clan_id"
                class="p-3 rounded-xl border transition-all"
                :class="row.rank <= 2 ? 'bg-purple-950/40 border-purple-500/50' : 'bg-white/5 border-white/10'">
                <div class="flex justify-between items-center mb-2">
                  <div class="flex items-center gap-2 truncate">
                    <span
                      class="w-5 h-5 rounded-full flex items-center justify-center font-black text-[10px] flex-shrink-0"
                      :class="row.rank <= 2 ? 'bg-purple-500 text-black' : 'bg-white/10 text-white/60'">
                      #{{ row.rank }}
                    </span>
                    <img :src="row.badge_url" class="w-6 h-6 object-contain flex-shrink-0" />
                    <span class="font-bold text-xs text-white truncate max-w-[130px]">{{ row.clan_name }}</span>
                  </div>
                  <span class="font-black text-gold text-sm flex-shrink-0">{{ row.points }} Pts</span>
                </div>
                <div class="grid grid-cols-3 gap-1.5 text-[10px] text-center bg-black/30 p-2 rounded">
                  <div>
                    <span class="text-white/40 block text-[8px]">BILAN</span>
                    <span class="font-bold text-white">{{ row.won }}V-{{ row.drawn }}N-{{ row.lost }}D</span>
                  </div>
                  <div>
                    <span class="text-white/40 block text-[8px]">ÉTOILES</span>
                    <span class="text-gold font-bold">{{ row.total_stars }} ⭐️</span>
                  </div>
                  <div>
                    <span class="text-white/40 block text-[8px]">DESTRUCTION</span>
                    <span class="font-bold text-white">{{ row.total_destruction }}%</span>
                  </div>
                </div>
              </div>

              <div v-if="!standings.B || standings.B.length === 0"
                class="text-center py-6 text-white/30 text-xs uppercase font-bold">
                Aucun clan assigné au Groupe B
              </div>
            </div>

            <!-- Desktop View (>= 640px) -->
            <div class="hidden sm:block overflow-x-auto mb-4">
              <table class="w-full text-left text-xs">
                <thead>
                  <tr class="border-b border-white/10 text-white/40 uppercase">
                    <th class="py-2" title="Rang">Rang</th>
                    <th class="py-2">Clan</th>
                    <th class="py-2 text-center" title="Matchs Joués">J (Joués)</th>
                    <th class="py-2 text-center text-green-400" title="Victoires">V (Victoires)</th>
                    <th class="py-2 text-center text-yellow-400" title="Matchs Nuls">N (Nuls)</th>
                    <th class="py-2 text-center text-red-400" title="Défaites">D (Défaites)</th>
                    <th class="py-2 text-center text-gold" title="Étoiles CoC">⭐️ (Étoiles)</th>
                    <th class="py-2 text-center" title="Pourcentage de destruction">% (Destr.)</th>
                    <th class="py-2 text-right text-gold" title="Points au classement">Pts (Points)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="row in standings.B" :key="row.clan_id" class="border-b border-white/5"
                    :class="row.rank <= 2 ? 'bg-purple-500/10 font-bold' : ''">
                    <td class="py-2.5 font-black" :class="row.rank <= 2 ? 'text-purple-400' : 'text-white/40'">
                      #{{ row.rank }}
                    </td>
                    <td class="py-2.5 flex items-center gap-2">
                      <img :src="row.badge_url" class="w-5 h-5 object-contain" />
                      <span class="truncate max-w-[120px]">{{ row.clan_name }}</span>
                    </td>
                    <td class="text-center font-semibold">{{ row.played }}</td>
                    <td class="text-center text-green-400 font-bold">{{ row.won }}</td>
                    <td class="text-center text-yellow-400 font-bold">{{ row.drawn }}</td>
                    <td class="text-center text-red-400 font-bold">{{ row.lost }}</td>
                    <td class="text-center text-gold font-bold">{{ row.total_stars }}</td>
                    <td class="text-center">{{ row.total_destruction }}%</td>
                    <td class="text-right font-black text-sm text-gold">{{ row.points }}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Légende -->
            <div
              class="p-2 rounded-lg bg-black/40 border border-white/5 text-[9px] sm:text-[10px] text-white/50 flex flex-wrap gap-x-3 gap-y-1">
              <span><b>J</b>: Matchs Joués</span>
              <span><b class="text-green-400">V</b>: Victoires</span>
              <span><b class="text-yellow-400">N</b>: Nuls</span>
              <span><b class="text-red-400">D</b>: Défaites</span>
              <span><b class="text-gold">⭐️</b>: Étoiles</span>
              <span><b>%</b>: % Destruction</span>
              <span><b class="text-gold">Pts</b>: Points (V=3, N=1)</span>
            </div>
          </div>

        </div>

      </div>

      <!-- TAB 2: GESTION DES MATCHS -->
      <div v-if="activeTab === 'matches'" class="space-y-4">

        <div class="flex justify-between items-center">
          <h2 class="text-lg sm:text-xl font-black italic uppercase text-gold">
            LISTE DES MATCHS ({{ allMatches.length }})
          </h2>
          <button @click="openCreateMatchModal"
            class="py-2 px-3 bg-gold text-black font-bold text-xs rounded-lg hover:bg-yellow-400 transition-all">
            ➕ Nouveau Match
          </button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          <div v-for="m in allMatches" :key="m.id"
            class="glass-card p-3.5 sm:p-4 border-white/10 hover:border-gold/30 transition-all flex flex-col justify-between">
            <div>
              <div class="flex justify-between items-center mb-2 text-[9px] sm:text-[10px]">
                <span class="font-black uppercase text-gold">
                  {{ m.phase === 'group_stage' ? `Groupe ${m.group || 'A'}` : m.phase }}
                </span>
                <span class="status-badge" :class="`status-${m.status}`">{{ m.status }}</span>
              </div>

              <!-- Date & Heure du match -->
              <div
                class="mb-2 flex items-center justify-between p-1.5 rounded bg-black/40 border border-white/5 text-[10px]">
                <span class="text-white/70 font-mono truncate">
                  📅 {{ formatScheduledDate(m.scheduled_at) }}
                </span>
                <button @click="openScheduleModal(m)"
                  class="ml-2 px-2 py-0.5 bg-gold/20 hover:bg-gold/40 text-gold font-bold text-[9px] rounded uppercase transition-colors flex-shrink-0">
                  {{ m.scheduled_at ? '✏️ Modifier Date' : '➕ Horaire' }}
                </button>
              </div>

              <div class="space-y-2 mb-3">
                <div class="flex justify-between items-center p-2 rounded-lg bg-white/5 text-xs"
                  :class="m.winner_clan_id === m.clan_home_id ? 'border-l-4 border-gold font-bold bg-gold/5' : ''">
                  <div class="flex items-center gap-2 truncate">
                    <img :src="m.clan_home?.badge_url || '/images/default-clan.png'"
                      class="w-5 h-5 object-contain flex-shrink-0" />
                    <span class="truncate max-w-[120px]">{{ m.clan_home?.name || 'TBD' }}</span>
                  </div>
                  <span class="font-black" :class="m.winner_clan_id === m.clan_home_id ? 'text-gold' : 'text-white/50'">
                    {{ m.total_stars_home ?? '-' }} ⭐️
                  </span>
                </div>

                <div class="flex justify-between items-center p-2 rounded-lg bg-white/5 text-xs"
                  :class="m.winner_clan_id === m.clan_away_id ? 'border-l-4 border-gold font-bold bg-gold/5' : ''">
                  <div class="flex items-center gap-2 truncate">
                    <img :src="m.clan_away?.badge_url || '/images/default-clan.png'"
                      class="w-5 h-5 object-contain flex-shrink-0" />
                    <span class="truncate max-w-[120px]">{{ m.clan_away?.name || 'TBD' }}</span>
                  </div>
                  <span class="font-black" :class="m.winner_clan_id === m.clan_away_id ? 'text-gold' : 'text-white/50'">
                    {{ m.total_stars_away ?? '-' }} ⭐️
                  </span>
                </div>
              </div>
            </div>

            <div class="flex gap-2 pt-2 border-t border-white/5">
              <button @click="openScoreModal(m)"
                class="flex-1 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-[11px] rounded-lg transition-all text-center">
                ✏️ Saisir Score
              </button>

              <button @click="deleteMatch(m.id)"
                class="py-1.5 px-2.5 bg-red-600/30 hover:bg-red-600 text-red-300 hover:text-white font-bold text-[11px] rounded-lg transition-all"
                title="Supprimer le match">
                🗑️
              </button>
            </div>
          </div>
        </div>

        <div v-if="allMatches.length === 0"
          class="text-center py-12 glass-card text-white/40 text-xs uppercase font-bold">
          Aucun match programmé pour le moment
        </div>

      </div>

      <!-- MODAL: TIRAGE AU SORT DES POULES -->
      <div v-if="showDrawModal"
        class="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 mt-16">
        <div class="glass-card w-full max-w-4xl p-4 sm:p-6 border-gold/30 max-h-[88vh] overflow-y-auto">
          <div class="flex justify-between items-center mb-4 border-b border-white/10 pb-3">
            <h2 class="text-lg sm:text-2xl font-black italic uppercase text-gold">
              🎲 TIRAGE AU SORT DES POULES
            </h2>
            <button @click="showDrawModal = false" class="text-white/40 hover:text-white text-xl">✖</button>
          </div>

          <p class="text-xs text-white/60 mb-4">
            Assignez chaque clan au Groupe A (<b>6 clans</b>) ou au Groupe B (<b>5 clans</b>). Une fois tous les clans
            assignés, générez les matchs automatiquement.
          </p>

          <!-- Alerte succès génération -->
          <div v-if="generateSuccess"
            class="mb-4 p-3 rounded-xl bg-green-500/20 border border-green-500/30 text-green-400 text-xs font-bold flex items-center gap-2">
            <span>✅</span> {{ generateSuccess }}
          </div>

          <!-- Clans Non Assignés -->
          <div v-if="unassignedClans.length > 0" class="mb-5 bg-white/5 p-3 rounded-xl">
            <h4 class="text-xs font-bold text-gold uppercase mb-2">⚠️ Clans non assignés ({{ unassignedClans.length }})
            </h4>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div v-for="r in unassignedClans" :key="r.id"
                class="flex justify-between items-center p-2 rounded bg-black/40 text-xs">
                <div class="flex items-center gap-2">
                  <img v-if="r.clan?.badge_url" :src="r.clan?.badge_url" class="w-5 h-5 object-contain" />
                  <span class="font-bold truncate max-w-[140px]">{{ r.clan?.name }}</span>
                </div>
                <div class="flex gap-1">
                  <button @click="assignGroup(r.clan_id, 'A')"
                    class="px-2 py-1 bg-blue-600 text-white font-bold text-[10px] rounded hover:bg-blue-500">
                    + A
                  </button>
                  <button @click="assignGroup(r.clan_id, 'B')"
                    class="px-2 py-1 bg-purple-600 text-white font-bold text-[10px] rounded hover:bg-purple-500">
                    + B
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Group A vs Group B Containers -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
            <div class="p-3 rounded-xl border border-blue-500/30 bg-blue-950/20">
              <h4 class="text-xs font-black text-blue-400 uppercase mb-2.5 flex items-center justify-between">
                <span>🛡️ Groupe A ({{ groupA.length }}/6)</span>
                <span :class="groupA.length === 6 ? 'text-green-400' : 'text-white/30'" class="text-[10px]">
                  {{ groupA.length === 6 ? '✅ Complet' : `${6 - groupA.length} manquant(s)` }}
                </span>
              </h4>
              <div class="space-y-1.5">
                <div v-for="(r, idx) in groupA" :key="r.id"
                  class="flex items-center gap-2 p-2 rounded bg-black/40 text-xs">
                  <span
                    class="w-5 h-5 rounded-full bg-blue-500/30 text-blue-300 font-black text-[9px] flex items-center justify-center flex-shrink-0">{{
                      idx + 1 }}</span>
                  <img v-if="r.clan?.badge_url" :src="r.clan?.badge_url" class="w-4 h-4 object-contain flex-shrink-0" />
                  <span class="font-bold truncate flex-1">{{ r.clan?.name }}</span>
                  <button @click="assignGroup(r.clan_id, null)"
                    class="text-red-400 hover:text-red-300 text-[10px] flex-shrink-0">✕</button>
                </div>
                <div v-if="groupA.length === 0" class="text-center py-2 text-white/20 text-[10px]">Aucun clan assigné
                </div>
              </div>
            </div>

            <div class="p-3 rounded-xl border border-purple-500/30 bg-purple-950/20">
              <h4 class="text-xs font-black text-purple-400 uppercase mb-2.5 flex items-center justify-between">
                <span>🛡️ Groupe B ({{ groupB.length }}/5)</span>
                <span :class="groupB.length === 5 ? 'text-green-400' : 'text-white/30'" class="text-[10px]">
                  {{ groupB.length === 5 ? '✅ Complet' : `${5 - groupB.length} manquant(s)` }}
                </span>
              </h4>
              <div class="space-y-1.5">
                <div v-for="(r, idx) in groupB" :key="r.id"
                  class="flex items-center gap-2 p-2 rounded bg-black/40 text-xs">
                  <span
                    class="w-5 h-5 rounded-full bg-purple-500/30 text-purple-300 font-black text-[9px] flex items-center justify-center flex-shrink-0">{{
                      idx + 1 }}</span>
                  <img v-if="r.clan?.badge_url" :src="r.clan?.badge_url" class="w-4 h-4 object-contain flex-shrink-0" />
                  <span class="font-bold truncate flex-1">{{ r.clan?.name }}</span>
                  <button @click="assignGroup(r.clan_id, null)"
                    class="text-red-400 hover:text-red-300 text-[10px] flex-shrink-0">✕</button>
                </div>
                <div v-if="groupB.length === 0" class="text-center py-2 text-white/20 text-[10px]">Aucun clan assigné
                </div>
              </div>
            </div>
          </div>

          <!-- Aperçu Grille des Matchs -->
          <div v-if="groupA.length >= 2 || groupB.length >= 2" class="mb-5 space-y-4">
            <h4 class="text-xs font-black uppercase text-white/60 tracking-widest flex items-center gap-2">
              <span>⚔️</span> APERÇU DES CONFRONTATIONS
              <span class="text-gold">({{ totalMatchesPreview }} matchs au total)</span>
            </h4>

            <!-- Grille Groupe A -->
            <div v-if="groupA.length >= 2" class="overflow-x-auto">
              <p class="text-[9px] text-blue-400 font-black uppercase mb-1.5">Groupe A — {{ groupMatrixCount(groupA) }}
                matchs</p>
              <table class="text-[9px] border-collapse">
                <thead>
                  <tr>
                    <th class="w-20 p-1 bg-blue-950/40 text-blue-300 text-left border border-white/5 text-[8px]">Clans
                    </th>
                    <th v-for="(r, j) in groupA" :key="'ah-' + j"
                      class="w-16 p-1 bg-blue-950/40 text-blue-300 text-center border border-white/5 truncate max-w-[60px]">
                      {{ r.clan?.name?.slice(0, 8) }}...</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(ri, i) in groupA" :key="'ar-' + i">
                    <td class="p-1 bg-blue-950/30 text-blue-300 font-bold border border-white/5 truncate max-w-[80px]">
                      {{ ri.clan?.name?.slice(0, 10) }}</td>
                    <td v-for="(rj, j) in groupA" :key="'ac-' + i + '-' + j"
                      class="p-1 text-center border border-white/5 text-[10px]"
                      :class="isMatrixMatchSkipped(groupA, i, j) ? (i === j ? 'bg-white/5 text-white/10' : 'bg-red-900/30 text-red-500/50') : 'bg-black/40 text-gold'">
                      {{ isMatrixMatchSkipped(groupA, i, j) ? '—' : '⚔️' }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Grille Groupe B -->
            <div v-if="groupB.length >= 2" class="overflow-x-auto">
              <p class="text-[9px] text-purple-400 font-black uppercase mb-1.5">Groupe B — {{ groupMatrixCount(groupB)
                }} matchs</p>
              <table class="text-[9px] border-collapse">
                <thead>
                  <tr>
                    <th class="w-20 p-1 bg-purple-950/40 text-purple-300 text-left border border-white/5 text-[8px]">
                      Clans</th>
                    <th v-for="(r, j) in groupB" :key="'bh-' + j"
                      class="w-16 p-1 bg-purple-950/40 text-purple-300 text-center border border-white/5 truncate max-w-[60px]">
                      {{ r.clan?.name?.slice(0, 8) }}...</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(ri, i) in groupB" :key="'br-' + i">
                    <td
                      class="p-1 bg-purple-950/30 text-purple-300 font-bold border border-white/5 truncate max-w-[80px]">
                      {{ ri.clan?.name?.slice(0, 10) }}</td>
                    <td v-for="(rj, j) in groupB" :key="'bc-' + i + '-' + j"
                      class="p-1 text-center border border-white/5 text-[10px]"
                      :class="i === j ? 'bg-white/5 text-white/10' : 'bg-black/40 text-gold'">
                      {{ i === j ? '—' : '⚔️' }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Actions Bas de Modal -->
          <div class="flex flex-col sm:flex-row gap-2 pt-4 border-t border-white/10">
            <button @click="generateAllGroupMatches" :disabled="(groupA.length < 2 && groupB.length < 2) || generating"
              class="flex-1 py-3 bg-green-600 hover:bg-green-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-black text-xs rounded-xl transition-all flex items-center justify-center gap-2">
              <span v-if="generating">⏳ Génération...</span>
              <span v-else>⚡ GÉNÉRER TOUS LES MATCHS ({{ totalMatchesPreview }})</span>
            </button>
            <button @click="showDrawModal = false"
              class="py-3 px-5 bg-white/10 text-white font-bold text-xs rounded-xl hover:bg-white/20">
              Fermer
            </button>
          </div>
        </div>
      </div>

      <!-- MODAL: PROGRAMMER UN MATCH -->
      <div v-if="showCreateMatchModal"
        class="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3">
        <div class="glass-card w-full max-w-lg p-4 sm:p-6 border-gold/30">
          <div class="flex justify-between items-center mb-4 border-b border-white/10 pb-3">
            <h2 class="text-lg sm:text-xl font-black italic uppercase text-gold">
              ➕ PROGRAMMER UN MATCH
            </h2>
            <button @click="showCreateMatchModal = false" class="text-white/40 hover:text-white text-xl">✖</button>
          </div>

          <form @submit.prevent="createMatch" class="space-y-4">
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-[10px] uppercase font-bold text-white/50 mb-1">Phase</label>
                <select v-model="createForm.phase"
                  class="w-full p-2.5 rounded-xl bg-black border border-white/20 text-white font-bold text-xs focus:border-gold">
                  <option value="group_stage">Phase de Groupes</option>
                  <option value="semi_final">Demi-Finale</option>
                  <option value="final">Grande Finale</option>
                </select>
              </div>

              <div v-if="createForm.phase === 'group_stage'">
                <label class="block text-[10px] uppercase font-bold text-white/50 mb-1">Groupe</label>
                <select v-model="createForm.group"
                  class="w-full p-2.5 rounded-xl bg-black border border-white/20 text-white font-bold text-xs focus:border-gold">
                  <option value="A">Groupe A</option>
                  <option value="B">Groupe B</option>
                </select>
              </div>
            </div>

            <div>
              <label class="block text-[10px] uppercase font-bold text-white/50 mb-1">Clan Domicile</label>
              <select v-model="createForm.clan_home_id" required
                class="w-full p-2.5 rounded-xl bg-black border border-white/20 text-white font-bold text-xs focus:border-gold">
                <option value="" disabled>-- Sélectionner Clan Domicile --</option>
                <option v-for="c in availableClansForCreation" :key="c.id" :value="c.id">{{ c.name }}</option>
              </select>
            </div>

            <div>
              <label class="block text-[10px] uppercase font-bold text-white/50 mb-1">Clan Extérieur</label>
              <select v-model="createForm.clan_away_id" required
                class="w-full p-2.5 rounded-xl bg-black border border-white/20 text-white font-bold text-xs focus:border-gold">
                <option value="" disabled>-- Sélectionner Clan Extérieur --</option>
                <option v-for="c in availableClansForCreation" :key="c.id" :value="c.id">{{ c.name }}</option>
              </select>
            </div>

            <div class="flex gap-2 pt-3 border-t border-white/10">
              <button type="button" @click="showCreateMatchModal = false"
                class="flex-1 py-2.5 bg-white/10 text-white font-bold text-xs rounded-xl hover:bg-white/20">
                Annuler
              </button>
              <button type="submit"
                class="flex-1 py-2.5 bg-gold text-black font-bold text-xs rounded-xl hover:bg-yellow-400">
                Créer le Match
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- MODAL: SAISIR SCORE DU MATCH -->
      <div v-if="showScoreModal && selectedMatch"
        class="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3">
        <div class="glass-card w-full max-w-md p-4 sm:p-6 border-gold/30">
          <div class="flex justify-between items-center mb-4 border-b border-white/10 pb-3">
            <h2 class="text-lg font-black italic uppercase text-gold">
              ✏️ SAISIE DES RÉSULTATS
            </h2>
            <button @click="showScoreModal = false" class="text-white/40 hover:text-white text-xl">✖</button>
          </div>

          <form @submit.prevent="saveScore" class="space-y-4">
            <div class="space-y-3 p-3 rounded-xl bg-black/40 border border-white/5">
              <div class="text-xs font-bold text-gold uppercase text-center border-b border-white/5 pb-1">
                {{ selectedMatch.clan_home?.name }} (Domicile)
              </div>
              <div class="grid grid-cols-2 gap-2">
                <div>
                  <label class="block text-[9px] uppercase text-white/50 mb-1">Étoiles (0-15)</label>
                  <input v-model.number="scoreForm.total_stars_home" type="number" min="0" max="15" required
                    class="w-full p-2 bg-black border border-white/20 rounded-lg text-white font-bold text-center" />
                </div>
                <div>
                  <label class="block text-[9px] uppercase text-white/50 mb-1">Destruction %</label>
                  <input v-model.number="scoreForm.total_destruction_home" type="number" step="0.01" min="0" max="100"
                    required
                    class="w-full p-2 bg-black border border-white/20 rounded-lg text-white font-bold text-center" />
                </div>
              </div>
            </div>

            <div class="space-y-3 p-3 rounded-xl bg-black/40 border border-white/5">
              <div class="text-xs font-bold text-purple-400 uppercase text-center border-b border-white/5 pb-1">
                {{ selectedMatch.clan_away?.name }} (Extérieur)
              </div>
              <div class="grid grid-cols-2 gap-2">
                <div>
                  <label class="block text-[9px] uppercase text-white/50 mb-1">Étoiles (0-15)</label>
                  <input v-model.number="scoreForm.total_stars_away" type="number" min="0" max="15" required
                    class="w-full p-2 bg-black border border-white/20 rounded-lg text-white font-bold text-center" />
                </div>
                <div>
                  <label class="block text-[9px] uppercase text-white/50 mb-1">Destruction %</label>
                  <input v-model.number="scoreForm.total_destruction_away" type="number" step="0.01" min="0" max="100"
                    required
                    class="w-full p-2 bg-black border border-white/20 rounded-lg text-white font-bold text-center" />
                </div>
              </div>
            </div>

            <div>
              <label class="block text-[10px] uppercase font-bold text-white/50 mb-1">Statut du Match</label>
              <select v-model="scoreForm.status"
                class="w-full p-2.5 bg-black border border-white/20 rounded-xl text-white font-bold text-xs">
                <option value="scheduled">Programmé</option>
                <option value="in_progress">En Cours</option>
                <option value="completed">Terminé (Valider)</option>
              </select>
            </div>

            <div class="flex gap-2 pt-3 border-t border-white/10">
              <button type="button" @click="showScoreModal = false"
                class="flex-1 py-2.5 bg-white/10 text-white font-bold text-xs rounded-xl hover:bg-white/20">
                Annuler
              </button>
              <button type="submit"
                class="flex-1 py-2.5 bg-gold text-black font-bold text-xs rounded-xl hover:bg-yellow-400">
                Enregistrer
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- MODAL: PROGRAMMER PROGRAMMATION (HEURE ET DATE DU MATCH) -->
      <div v-if="showScheduleModal && selectedMatchForScheduling"
        class="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3">
        <div class="glass-card w-full max-w-md p-4 sm:p-6 border-gold/30">
          <div class="flex justify-between items-center mb-4 border-b border-white/10 pb-3">
            <h2 class="text-lg font-black italic uppercase text-gold">
              📅 HORAIRE DU MATCH #{{ selectedMatchForScheduling.match_number || selectedMatchForScheduling.id }}
            </h2>
            <button @click="showScheduleModal = false" class="text-white/40 hover:text-white text-xl">✖</button>
          </div>

          <div class="mb-4 text-xs text-white/70">
            <p class="font-bold text-white mb-1">
              {{ selectedMatchForScheduling.clan_home?.name }} <span class="text-gold">VS</span> {{
                selectedMatchForScheduling.clan_away?.name }}
            </p>
            <p class="text-[10px] text-white/40">Définissez la date et l'heure prévues pour le coup d'envoi du match.</p>
          </div>

          <form @submit.prevent="saveSchedule" class="space-y-4">
            <div>
              <label class="block text-[10px] uppercase font-bold text-white/50 mb-1">Date et Heure du Match</label>
              <input type="datetime-local" v-model="scheduledAtInput" required
                class="w-full p-2.5 rounded-xl bg-black border border-white/20 text-white font-bold text-xs focus:border-gold outline-none" />
            </div>

            <div class="flex gap-2 pt-3 border-t border-white/10">
              <button type="button" @click="showScheduleModal = false"
                class="flex-1 py-2.5 bg-white/10 text-white font-bold text-xs rounded-xl hover:bg-white/20">
                Annuler
              </button>
              <button type="submit" :disabled="savingSchedule"
                class="flex-1 py-2.5 bg-gold text-black font-bold text-xs rounded-xl hover:bg-yellow-400 disabled:opacity-50">
                {{ savingSchedule ? 'Enregistrement...' : '💾 Enregistrer la Date' }}
              </button>
            </div>
          </form>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
const { $api } = useNuxtApp();

const activeTab = ref('standings');
const showDrawModal = ref(false);
const showCreateMatchModal = ref(false);
const showScoreModal = ref(false);
const showScheduleModal = ref(false);
const generating = ref(false);
const generateSuccess = ref('');
const selectedMatchForScheduling = ref(null);
const scheduledAtInput = ref('');
const savingSchedule = ref(false);

const openScheduleModal = (match) => {
  selectedMatchForScheduling.value = match;
  if (match.scheduled_at) {
    const d = new Date(match.scheduled_at);
    // Format YYYY-MM-DDTHH:mm for datetime-local
    const pad = (n) => String(n).padStart(2, '0');
    scheduledAtInput.value = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  } else {
    scheduledAtInput.value = '';
  }
  showScheduleModal.value = true;
};

const saveSchedule = async () => {
  if (!selectedMatchForScheduling.value || !scheduledAtInput.value) return;
  savingSchedule.value = true;
  try {
    await $api(`/admin/matches/${selectedMatchForScheduling.value.id}`, {
      method: 'PUT',
      body: { scheduled_at: scheduledAtInput.value },
    });
    showScheduleModal.value = false;
    await fetchData();
  } catch (e) {
    alert('Erreur lors de la programmation de la date du match.');
  } finally {
    savingSchedule.value = false;
  }
};

const formatScheduledDate = (dateStr) => {
  if (!dateStr) return 'Non programmé';
  const d = new Date(dateStr);
  return d.toLocaleString('fr-FR', {
    timeZone: 'Africa/Douala',
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const confirmedRegistrations = ref([]);
const standings = ref({ A: [], B: [] });
const allMatches = ref([]);

const selectedMatch = ref(null);

const createForm = ref({
  clan_home_id: '',
  clan_away_id: '',
  phase: 'group_stage',
  group: 'A',
});

const scoreForm = ref({
  total_stars_home: 0,
  total_destruction_home: 0,
  total_stars_away: 0,
  total_destruction_away: 0,
  status: 'completed',
});

const groupA = computed(() => confirmedRegistrations.value.filter(r => r.group === 'A'));
const groupB = computed(() => confirmedRegistrations.value.filter(r => r.group === 'B'));
const unassignedClans = computed(() => confirmedRegistrations.value.filter(r => !r.group));

// Nombre de matchs pour N clans en round-robin : N*(N-1)/2
// Exception : Pour le Groupe A (6 clans), chaque clan joue 4 matchs : total 12 matchs
const groupMatrixCount = (group) => {
  const n = group.length;
  if (n === 6) return 12;
  return n >= 2 ? (n * (n - 1)) / 2 : 0;
};

const isMatrixMatchSkipped = (groupData, i, j) => {
  if (i === j) return true; // On ne joue pas contre soi-même
  // Uniquement pour le groupe de 6 clans (Groupe A)
  if (groupData.length === 6) {
    if (
      (i === 0 && j === 1) || (i === 1 && j === 0) ||
      (i === 2 && j === 3) || (i === 3 && j === 2) ||
      (i === 4 && j === 5) || (i === 5 && j === 4)
    ) {
      return true;
    }
  }
  return false;
};

const totalMatchesPreview = computed(() =>
  groupMatrixCount(groupA.value) + groupMatrixCount(groupB.value)
);

const availableClansForCreation = computed(() => {
  if (createForm.value.phase === 'group_stage') {
    const targetGroup = createForm.value.group || 'A';
    return confirmedRegistrations.value
      .filter(r => r.group === targetGroup)
      .map(r => r.clan)
      .filter(Boolean);
  }
  return confirmedRegistrations.value.map(r => r.clan).filter(Boolean);
});

watch([() => createForm.value.phase, () => createForm.value.group], () => {
  createForm.value.clan_home_id = '';
  createForm.value.clan_away_id = '';
});

const fetchData = async () => {
  try {
    const [regs, groupData, matches] = await Promise.all([
      $api('/admin/competitions/1/confirmed-clans'),
      $api('/tournament/groups'),
      $api('/admin/competitions/1/matches'),
    ]);

    confirmedRegistrations.value = regs || [];
    standings.value = groupData || { A: [], B: [] };
    allMatches.value = matches || [];
  } catch (e) {
    console.error('Error fetching admin live data:', e);
  }
};

const assignGroup = async (clanId, group) => {
  try {
    await $api('/admin/competitions/1/assign-group', {
      method: 'POST',
      body: { clan_id: clanId, group },
    });
    fetchData();
  } catch (e) {
    alert('Erreur lors de l’assignation du groupe');
  }
};

const openCreateMatchModal = () => {
  createForm.value.clan_home_id = '';
  createForm.value.clan_away_id = '';
  showCreateMatchModal.value = true;
};

const createMatch = async () => {
  if (createForm.value.clan_home_id === createForm.value.clan_away_id) {
    alert('Veuillez sélectionner deux clans différents.');
    return;
  }

  try {
    await $api('/admin/competitions/1/matches', {
      method: 'POST',
      body: createForm.value,
    });
    showCreateMatchModal.value = false;
    fetchData();
  } catch (e) {
    alert('Erreur lors de la création du match');
  }
};

const openScoreModal = (match) => {
  selectedMatch.value = match;
  scoreForm.value = {
    total_stars_home: match.total_stars_home ?? 0,
    total_destruction_home: match.total_destruction_home ?? 0,
    total_stars_away: match.total_stars_away ?? 0,
    total_destruction_away: match.total_destruction_away ?? 0,
    status: match.status || 'completed',
  };
  showScoreModal.value = true;
};

const saveScore = async () => {
  if (!selectedMatch.value) return;

  try {
    await $api(`/admin/matches/${selectedMatch.value.id}`, {
      method: 'PUT',
      body: scoreForm.value,
    });
    showScoreModal.value = false;
    fetchData();
  } catch (e) {
    alert('Erreur lors de l’enregistrement du score');
  }
};

const deleteMatch = async (matchId) => {
  if (!confirm('Supprimer ce match ?')) return;

  try {
    await $api(`/admin/matches/${matchId}`, { method: 'DELETE' });
    fetchData();
  } catch (e) {
    alert('Erreur lors de la suppression du match');
  }
};

const generateAllGroupMatches = async () => {
  if (!confirm(`Confirmer la génération automatique de tous les matchs de poules (${totalMatchesPreview.value} matchs) ?`)) return;

  generating.value = true;
  generateSuccess.value = '';
  try {
    const res = await $api('/admin/competitions/1/generate-group-matches', {
      method: 'POST',
    });
    generateSuccess.value = res.message || 'Matchs de poule générés avec succès !';
    await fetchData();
  } catch (e) {
    alert(e?.data?.message || 'Erreur lors de la génération des matchs de poule.');
  } finally {
    generating.value = false;
  }
};

onMounted(fetchData);
</script>

<style scoped>
.live-admin-page {
  background:
    radial-gradient(circle at 50% 0%, rgba(212, 175, 55, 0.1) 0%, transparent 60%),
    linear-gradient(to bottom, #06070a, #0b1220);
}

.glass-card {
  background: rgba(10, 11, 18, 0.85);
  backdrop-filter: blur(12px);
  border-radius: 16px;
}

.status-badge {
  padding: 2px 7px;
  border-radius: 4px;
  font-size: 9px;
  font-weight: 900;
  text-transform: uppercase;
}

.status-completed {
  background: rgba(74, 222, 128, 0.2);
  color: #4ade80;
}

.status-in_progress {
  background: rgba(234, 179, 8, 0.2);
  color: #eab308;
}

.status-scheduled {
  background: rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.4);
}
</style>
