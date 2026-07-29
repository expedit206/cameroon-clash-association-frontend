<template>
  <div class="bracket-page min-h-screen pb-20 text-white">
    <div class="container mx-auto px-3 sm:px-6 py-4 sm:py-8 max-w-7xl">

      <!-- Responsive Header -->
      <header class="page-header text-center mb-6 sm:mb-10">
        <h1 class="heading text-2xl sm:text-4xl md:text-5xl font-black italic tracking-tighter uppercase leading-tight">
          TABLEAU DU <span class="text-gold">TOURNOI</span>
        </h1>
        <p class="subtitle mt-1 text-[11px] sm:text-sm text-white/50 uppercase tracking-widest font-semibold px-2">
          Phase de Poules (11 Clans) & Arbre de Combat Knockout
        </p>
      </header>

      <!-- Mobile-Optimized Tab Switcher -->
      <div class="flex justify-center mb-6 sm:mb-8">
        <div
          class="inline-flex p-1 bg-black/80 backdrop-blur-md rounded-xl border border-white/10 w-full sm:w-auto max-w-md">
          <button @click="activeTab = 'groups'"
            class="flex-1 py-2.5 px-3 sm:px-6 font-black text-xs sm:text-sm uppercase tracking-wider rounded-lg transition-all flex items-center justify-center gap-1.5"
            :class="activeTab === 'groups' ? 'bg-gold text-black shadow-lg shadow-gold/20' : 'text-white/60 hover:text-white'">
            <span>🛡️</span>
            <span>Poules</span>
          </button>

          <button @click="activeTab = 'knockout'"
            class="flex-1 py-2.5 px-3 sm:px-6 font-black text-xs sm:text-sm uppercase tracking-wider rounded-lg transition-all flex items-center justify-center gap-1.5"
            :class="activeTab === 'knockout' ? 'bg-gold text-black shadow-lg shadow-gold/20' : 'text-white/60 hover:text-white'">
            <span>🏆</span>
            <span>Phase Finale</span>
          </button>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="py-16 text-center bg-black/20 rounded-2xl border border-white/5">
        <div class="spinner mx-auto mb-3"></div>
        <p class="text-gold font-bold tracking-widest animate-pulse uppercase text-xs">
          Chargement du Tableau...
        </p>
      </div>

      <div v-else>

        <!-- ================= TAB 1: PHASE DE GROUPES ================= -->
        <div v-if="activeTab === 'groups'" class="space-y-6 sm:space-y-10">

          <div class="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-8">

            <!-- GROUPE A -->
            <div class="glass-card p-3.5 sm:p-6 border-blue-500/30">
              <div class="flex justify-between items-center mb-3 sm:mb-5 border-b border-blue-500/20 pb-3">
                <h3 class="text-lg sm:text-2xl font-black italic text-blue-400 uppercase flex items-center gap-2">
                  <span>🛡️</span> GROUPE A
                </h3>
                <span
                  class="text-[9px] sm:text-xs text-blue-300/90 bg-blue-500/20 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full font-bold uppercase">
                  Top 2 Qualifiés
                </span>
              </div>

              <!-- Mobile Standings Cards (< 640px) -->
              <div class="block sm:hidden space-y-2.5 mb-4">
                <div v-for="row in standings.A" :key="'mob-a-' + row.clan_id"
                  class="p-3 rounded-xl border transition-all"
                  :class="row.rank <= 2 ? 'bg-blue-950/40 border-blue-500/50' : 'bg-white/5 border-white/10'">
                  <div class="flex items-center justify-between mb-2">
                    <div class="flex items-center gap-2 truncate">
                      <span
                        class="w-5 h-5 rounded-full flex items-center justify-center font-black text-[10px] flex-shrink-0"
                        :class="row.rank <= 2 ? 'bg-blue-500 text-black' : 'bg-white/10 text-white/60'">
                        #{{ row.rank }}
                      </span>
                      <img :src="row.badge_url || '/images/default-clan.png'"
                        class="w-6 h-6 object-contain flex-shrink-0" />
                      <div class="truncate">
                        <p class="font-bold text-xs text-white leading-tight truncate max-w-[130px]">{{ row.clan_name }}
                        </p>
                        <p class="text-[9px] text-white/40">#{{ row.clan_tag }}</p>
                      </div>
                    </div>
                    <div class="text-right flex-shrink-0">
                      <span class="text-sm font-black text-gold block leading-none">{{ row.points }} Pts</span>
                      <span class="text-[9px] text-white/50 font-semibold">{{ row.played }} Matchs</span>
                    </div>
                  </div>

                  <div class="grid grid-cols-3 gap-1.5 pt-2 border-t border-white/5 text-[10px] text-center">
                    <div class="bg-black/30 p-1.5 rounded">
                      <span class="text-white/40 block text-[8px] uppercase">Bilan V-N-D</span>
                      <span class="font-bold text-white">{{ row.won }}V • {{ row.drawn }}N • {{ row.lost }}D</span>
                    </div>
                    <div class="bg-black/30 p-1.5 rounded">
                      <span class="text-white/40 block text-[8px] uppercase">Étoiles</span>
                      <span class="font-bold text-gold">{{ row.total_stars }} ⭐️</span>
                    </div>
                    <div class="bg-black/30 p-1.5 rounded">
                      <span class="text-white/40 block text-[8px] uppercase">Destruction</span>
                      <span class="font-bold text-white">{{ row.total_destruction }}%</span>
                    </div>
                  </div>
                </div>

                <div v-if="!standings.A || standings.A.length === 0"
                  class="text-center py-6 text-white/30 text-xs uppercase font-bold">
                  Aucun clan dans le Groupe A
                </div>
              </div>

              <!-- Desktop Table (>= 640px) -->
              <div class="hidden sm:block overflow-x-auto mb-4">
                <table class="w-full text-left text-xs">
                  <thead>
                    <tr class="border-b border-white/10 text-white/40 uppercase">
                      <th class="py-2" title="Rang au classement">Rang</th>
                      <th class="py-2">Clan</th>
                      <th class="py-2 text-center" title="Matchs Joués">J (Joués)</th>
                      <th class="py-2 text-center text-green-400" title="Victoires">V (Victoires)</th>
                      <th class="py-2 text-center text-yellow-400" title="Matchs Nuls">N (Nuls)</th>
                      <th class="py-2 text-center text-red-400" title="Défaites">D (Défaites)</th>
                      <th class="py-2 text-center text-gold" title="Total Étoiles CoC">⭐️ (Étoiles)</th>
                      <th class="py-2 text-center" title="Pourcentage de destruction cumulé">% (Destr.)</th>
                      <th class="py-2 text-right text-gold" title="Points au classement (Victoire = 3, Nul = 1)">Pts
                        (Points)</th>
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

              <!-- Légende des abréviations -->
              <div
                class="p-2 sm:p-2.5 rounded-lg bg-black/40 border border-white/5 text-[9px] sm:text-[10px] text-white/50 flex flex-wrap gap-x-3 gap-y-1">
                <span><b>J</b>: Matchs Joués</span>
                <span><b class="text-green-400">V</b>: Victoires</span>
                <span><b class="text-yellow-400">N</b>: Nuls</span>
                <span><b class="text-red-400">D</b>: Défaites</span>
                <span><b class="text-gold">⭐️</b>: Étoiles</span>
                <span><b>%</b>: % Destruction</span>
                <span><b class="text-gold">Pts</b>: Points (V=3, N=1)</span>
              </div>

              <!-- Étoiles Performance Bar Chart -->
              <div class="space-y-2 pt-3 border-t border-white/10 mt-3">
                <p class="text-[9px] uppercase tracking-widest text-white/40 font-bold">Accumulation Étoiles (Groupe A)
                </p>
                <div v-for="row in standings.A" :key="'chart-pub-a-' + row.clan_id" class="space-y-1">
                  <div class="flex justify-between text-[10px]">
                    <span class="font-bold text-white/80 truncate max-w-[150px]">{{ row.clan_name }}</span>
                    <span class="text-gold font-black">{{ row.total_stars }} ⭐️ ({{ row.points }} pts)</span>
                  </div>
                  <div class="h-2 bg-white/5 rounded-full overflow-hidden flex">
                    <div class="h-full bg-gradient-to-r from-blue-500 to-gold rounded-full transition-all duration-700"
                      :style="{ width: Math.min(100, (row.total_stars / 60) * 100) + '%' }"></div>
                  </div>
                </div>
              </div>
            </div>

            <!-- GROUPE B -->
            <div class="glass-card p-3.5 sm:p-6 border-purple-500/30">
              <div class="flex justify-between items-center mb-3 sm:mb-5 border-b border-purple-500/20 pb-3">
                <h3 class="text-lg sm:text-2xl font-black italic text-purple-400 uppercase flex items-center gap-2">
                  <span>🛡️</span> GROUPE B
                </h3>
                <span
                  class="text-[9px] sm:text-xs text-purple-300/90 bg-purple-500/20 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full font-bold uppercase">
                  Top 2 Qualifiés
                </span>
              </div>

              <!-- Mobile Standings Cards (< 640px) -->
              <div class="block sm:hidden space-y-2.5 mb-4">
                <div v-for="row in standings.B" :key="'mob-b-' + row.clan_id"
                  class="p-3 rounded-xl border transition-all"
                  :class="row.rank <= 2 ? 'bg-purple-950/40 border-purple-500/50' : 'bg-white/5 border-white/10'">
                  <div class="flex items-center justify-between mb-2">
                    <div class="flex items-center gap-2 truncate">
                      <span
                        class="w-5 h-5 rounded-full flex items-center justify-center font-black text-[10px] flex-shrink-0"
                        :class="row.rank <= 2 ? 'bg-purple-500 text-black' : 'bg-white/10 text-white/60'">
                        #{{ row.rank }}
                      </span>
                      <img :src="row.badge_url || '/images/default-clan.png'"
                        class="w-6 h-6 object-contain flex-shrink-0" />
                      <div class="truncate">
                        <p class="font-bold text-xs text-white leading-tight truncate max-w-[130px]">{{ row.clan_name }}
                        </p>
                        <p class="text-[9px] text-white/40">#{{ row.clan_tag }}</p>
                      </div>
                    </div>
                    <div class="text-right flex-shrink-0">
                      <span class="text-sm font-black text-gold block leading-none">{{ row.points }} Pts</span>
                      <span class="text-[9px] text-white/50 font-semibold">{{ row.played }} Matchs</span>
                    </div>
                  </div>

                  <div class="grid grid-cols-3 gap-1.5 pt-2 border-t border-white/5 text-[10px] text-center">
                    <div class="bg-black/30 p-1.5 rounded">
                      <span class="text-white/40 block text-[8px] uppercase">Bilan V-N-D</span>
                      <span class="font-bold text-white">{{ row.won }}V • {{ row.drawn }}N • {{ row.lost }}D</span>
                    </div>
                    <div class="bg-black/30 p-1.5 rounded">
                      <span class="text-white/40 block text-[8px] uppercase">Étoiles</span>
                      <span class="font-bold text-gold">{{ row.total_stars }} ⭐️</span>
                    </div>
                    <div class="bg-black/30 p-1.5 rounded">
                      <span class="text-white/40 block text-[8px] uppercase">Destruction</span>
                      <span class="font-bold text-white">{{ row.total_destruction }}%</span>
                    </div>
                  </div>
                </div>

                <div v-if="!standings.B || standings.B.length === 0"
                  class="text-center py-6 text-white/30 text-xs uppercase font-bold">
                  Aucun clan dans le Groupe B
                </div>
              </div>

              <!-- Desktop Table (>= 640px) -->
              <div class="hidden sm:block overflow-x-auto mb-4">
                <table class="w-full text-left text-xs">
                  <thead>
                    <tr class="border-b border-white/10 text-white/40 uppercase">
                      <th class="py-2" title="Rang au classement">Rang</th>
                      <th class="py-2">Clan</th>
                      <th class="py-2 text-center" title="Matchs Joués">J (Joués)</th>
                      <th class="py-2 text-center text-green-400" title="Victoires">V (Victoires)</th>
                      <th class="py-2 text-center text-yellow-400" title="Matchs Nuls">N (Nuls)</th>
                      <th class="py-2 text-center text-red-400" title="Défaites">D (Défaites)</th>
                      <th class="py-2 text-center text-gold" title="Total Étoiles CoC">⭐️ (Étoiles)</th>
                      <th class="py-2 text-center" title="Pourcentage de destruction cumulé">% (Destr.)</th>
                      <th class="py-2 text-right text-gold" title="Points au classement (Victoire = 3, Nul = 1)">Pts
                        (Points)</th>
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

              <!-- Légende des abréviations -->
              <div
                class="p-2 sm:p-2.5 rounded-lg bg-black/40 border border-white/5 text-[9px] sm:text-[10px] text-white/50 flex flex-wrap gap-x-3 gap-y-1">
                <span><b>J</b>: Matchs Joués</span>
                <span><b class="text-green-400">V</b>: Victoires</span>
                <span><b class="text-yellow-400">N</b>: Nuls</span>
                <span><b class="text-red-400">D</b>: Défaites</span>
                <span><b class="text-gold">⭐️</b>: Étoiles</span>
                <span><b>%</b>: % Destruction</span>
                <span><b class="text-gold">Pts</b>: Points (V=3, N=1)</span>
              </div>

              <!-- Étoiles Performance Bar Chart -->
              <div class="space-y-2 pt-3 border-t border-white/10 mt-3">
                <p class="text-[9px] uppercase tracking-widest text-white/40 font-bold">Accumulation Étoiles (Groupe B)
                </p>
                <div v-for="row in standings.B" :key="'chart-pub-b-' + row.clan_id" class="space-y-1">
                  <div class="flex justify-between text-[10px]">
                    <span class="font-bold text-white/80 truncate max-w-[150px]">{{ row.clan_name }}</span>
                    <span class="text-gold font-black">{{ row.total_stars }} ⭐️ ({{ row.points }} pts)</span>
                  </div>
                  <div class="h-2 bg-white/5 rounded-full overflow-hidden flex">
                    <div
                      class="h-full bg-gradient-to-r from-purple-500 to-gold rounded-full transition-all duration-700"
                      :style="{ width: Math.min(100, (row.total_stars / 60) * 100) + '%' }">
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>

          <!-- Group Matches Results -->
          <div v-if="groupMatches.length > 0" class="space-y-4">
            <h3 class="text-base sm:text-xl font-black italic uppercase text-white tracking-tight flex items-center gap-3">
              RÉSULTATS DE PHASE DE POULES ({{ groupMatches.length }})
              <!-- Légende priorité -->
              <span class="flex items-center gap-3 text-[9px] font-normal not-italic normal-case tracking-normal">
                <span class="flex items-center gap-1"><span class="w-2 h-2 rounded-full bg-red-500 animate-pulse inline-block"></span>Aujourd'hui / Demain</span>
                <span class="flex items-center gap-1"><span class="w-2 h-2 rounded-full bg-orange-400 animate-pulse inline-block"></span>Dans 3 jours</span>
              </span>
            </h3>

            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5">
              <div v-for="m in groupMatches" :key="m.id"
                class="glass-card p-3.5 sm:p-4 border-white/5 hover:border-gold/30 transition-all relative"
                :class="{
                  'border-red-500/40 shadow-[0_0_12px_rgba(239,68,68,0.15)]': matchPriority(m) === 'urgent',
                  'border-orange-400/30 shadow-[0_0_10px_rgba(251,146,60,0.1)]': matchPriority(m) === 'soon',
                }">

                <!-- Priority blink indicator -->
                <span v-if="matchPriority(m) === 'urgent'"
                  class="absolute top-2.5 right-2.5 w-2.5 h-2.5 rounded-full bg-red-500 animate-ping inline-block"
                  title="Match imminent (< 24h)"></span>
                <span v-else-if="matchPriority(m) === 'soon'"
                  class="absolute top-2.5 right-2.5 w-2.5 h-2.5 rounded-full bg-orange-400 animate-pulse inline-block"
                  title="Match proche (< 3 jours)"></span>

                <div class="flex justify-between items-center mb-2.5 text-[9px] sm:text-[10px]">
                  <span class="font-black uppercase text-gold">Groupe {{ m.group || 'A' }}</span>
                  <span class="status-badge" :class="`status-${m.status}`">
                    {{ m.status === 'completed' ? 'Terminé' : (m.status === 'in_progress' ? 'En Cours' : 'Programmé') }}
                  </span>
                </div>

                <!-- Scheduled Date/Time -->
                <div class="mb-2.5 text-center">
                  <span v-if="m.scheduled_at"
                    class="inline-flex items-center gap-1.5 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full"
                    :class="{
                      'bg-red-500/20 text-red-400': matchPriority(m) === 'urgent',
                      'bg-orange-400/20 text-orange-300': matchPriority(m) === 'soon',
                      'bg-white/5 text-white/50': matchPriority(m) === 'none',
                    }">
                    📅 {{ formatDate(m.scheduled_at) }}
                  </span>
                  <span v-else class="text-[9px] text-white/20 italic font-mono">Non programmé</span>
                </div>

                <div class="space-y-2">
                  <div class="flex justify-between items-center p-2 rounded-lg bg-white/5 text-xs"
                    :class="m.winner_clan_id === m.clan_home_id ? 'border-l-4 border-gold font-bold bg-gold/5' : ''">
                    <div class="flex items-center gap-2 truncate">
                      <img :src="m.clan_home?.badge_url || '/images/default-clan.png'"
                        class="w-5 h-5 object-contain flex-shrink-0" />
                      <span class="truncate max-w-[120px]">{{ m.clan_home?.name || 'TBD' }}</span>
                    </div>
                    <span class="font-black"
                      :class="m.winner_clan_id === m.clan_home_id ? 'text-gold' : 'text-white/50'">
                      {{ m.status === 'completed' ? (m.total_stars_home ?? 0) + ' ⭐️' : '-' }}
                    </span>
                  </div>

                  <div class="flex justify-between items-center p-2 rounded-lg bg-white/5 text-xs"
                    :class="m.winner_clan_id === m.clan_away_id ? 'border-l-4 border-gold font-bold bg-gold/5' : ''">
                    <div class="flex items-center gap-2 truncate">
                      <img :src="m.clan_away?.badge_url || '/images/default-clan.png'"
                        class="w-5 h-5 object-contain flex-shrink-0" />
                      <span class="truncate max-w-[120px]">{{ m.clan_away?.name || 'TBD' }}</span>
                    </div>
                    <span class="font-black"
                      :class="m.winner_clan_id === m.clan_away_id ? 'text-gold' : 'text-white/50'">
                      {{ m.status === 'completed' ? (m.total_stars_away ?? 0) + ' ⭐️' : '-' }}
                    </span>
                  </div>
                </div>

                <div v-if="m.status === 'completed'"
                  class="mt-2.5 pt-2 border-t border-white/5 text-[9px] text-white/40 text-center uppercase tracking-wider font-semibold">
                  Destruction : {{ m.total_destruction_home ?? 0 }}% vs {{ m.total_destruction_away ?? 0 }}%
                </div>
              </div>
            </div>
          </div>

        </div>

        <!-- ================= TAB 2: PHASE FINALE (KNOCKOUT) ================= -->
        <div v-if="activeTab === 'knockout'" class="space-y-6 sm:space-y-10">

          <div class="text-center max-w-xl mx-auto">
            <h2 class="text-xl sm:text-3xl font-black italic uppercase text-gold tracking-tight mb-1">
              ARBRE DE LA PHASE FINALE
            </h2>
            <p class="text-[10px] sm:text-xs text-white/40 uppercase tracking-widest">
              Demi-finales (Croisées) &amp; Grande Finale Nationale
            </p>
          </div>

          <!-- Mobile Responsive Vertical Bracket -->
          <div class="space-y-6 lg:space-y-0 lg:grid lg:grid-cols-3 lg:gap-6 lg:items-center">

            <!-- Demi-Finale 1 -->
            <div class="glass-card p-4 sm:p-5 border-gold/20 relative">
              <div class="text-center mb-3">
                <span
                  class="text-[9px] uppercase font-black tracking-widest text-gold bg-gold/10 px-2.5 py-0.5 rounded-full border border-gold/20 inline-block mb-1">
                  DEMI-FINALE 1
                </span>
                <p class="text-[9px] text-white/40">1er Groupe A vs 2ème Groupe B</p>
                <p v-if="semiFinal1?.scheduled_at" class="text-[10px] font-mono text-white/60 mt-1">
                  📅 {{ formatDate(semiFinal1.scheduled_at) }}
                </p>
              </div>

              <div class="space-y-2">
                <div class="flex justify-between items-center p-2.5 rounded-xl bg-white/5 text-xs"
                  :class="semiFinal1?.winner_clan_id === semiFinal1?.clan_home_id ? 'border border-gold text-gold font-bold bg-gold/10' : ''">
                  <div class="flex items-center gap-2 truncate">
                    <img :src="semiFinal1?.clan_home?.badge_url || '/images/default-clan.png'"
                      class="w-6 h-6 object-contain flex-shrink-0" />
                    <span class="font-bold truncate max-w-[120px]">{{ semiFinal1?.clan_home?.name || '1er Groupe A' }}</span>
                  </div>
                  <span class="font-black text-base text-gold">{{ semiFinal1?.total_stars_home ?? '-' }}</span>
                </div>

                <div class="text-center text-[9px] font-black text-white/20 italic">VS</div>

                <div class="flex justify-between items-center p-2.5 rounded-xl bg-white/5 text-xs"
                  :class="semiFinal1?.winner_clan_id === semiFinal1?.clan_away_id ? 'border border-gold text-gold font-bold bg-gold/10' : ''">
                  <div class="flex items-center gap-2 truncate">
                    <img :src="semiFinal1?.clan_away?.badge_url || '/images/default-clan.png'"
                      class="w-6 h-6 object-contain flex-shrink-0" />
                    <span class="font-bold truncate max-w-[120px]">{{ semiFinal1?.clan_away?.name || '2ème Groupe B' }}</span>
                  </div>
                  <span class="font-black text-base text-gold">{{ semiFinal1?.total_stars_away ?? '-' }}</span>
                </div>
              </div>
            </div>

            <!-- GRANDE FINALE (Centerpiece) -->
            <div
              class="glass-card p-5 sm:p-7 border-gold shadow-[0_0_30px_rgba(212,175,55,0.2)] text-center relative lg:scale-105">
              <div class="trophy-icon text-4xl sm:text-5xl mb-2">🏆</div>
              <h3 class="text-lg sm:text-2xl font-black italic uppercase text-gold tracking-tight mb-1 sm:mb-2">
                GRANDE FINALE
              </h3>
              <p v-if="grandFinal?.scheduled_at" class="text-[10px] font-mono text-white/60 mb-3">
                📅 {{ formatDate(grandFinal.scheduled_at) }}
              </p>

              <div class="space-y-2.5">
                <div class="flex justify-between items-center p-3 rounded-xl bg-gold/10 border border-gold/30 text-xs"
                  :class="grandFinal?.winner_clan_id === grandFinal?.clan_home_id ? 'winner-glow' : ''">
                  <div class="flex items-center gap-2.5 truncate">
                    <img :src="grandFinal?.clan_home?.badge_url || '/images/default-clan.png'"
                      class="w-7 h-7 object-contain flex-shrink-0" />
                    <span class="font-black text-white truncate max-w-[130px]">{{ grandFinal?.clan_home?.name || 'Vainqueur Demi 1' }}</span>
                  </div>
                  <span class="font-black text-lg text-gold">{{ grandFinal?.total_stars_home ?? '-' }}</span>
                </div>

                <div class="text-[9px] font-black text-gold italic uppercase tracking-widest">FINAL SHOWDOWN</div>

                <div class="flex justify-between items-center p-3 rounded-xl bg-gold/10 border border-gold/30 text-xs"
                  :class="grandFinal?.winner_clan_id === grandFinal?.clan_away_id ? 'winner-glow' : ''">
                  <div class="flex items-center gap-2.5 truncate">
                    <img :src="grandFinal?.clan_away?.badge_url || '/images/default-clan.png'"
                      class="w-7 h-7 object-contain flex-shrink-0" />
                    <span class="font-black text-white truncate max-w-[130px]">{{ grandFinal?.clan_away?.name || 'Vainqueur Demi 2' }}</span>
                  </div>
                  <span class="font-black text-lg text-gold">{{ grandFinal?.total_stars_away ?? '-' }}</span>
                </div>
              </div>
            </div>

            <!-- Demi-Finale 2 -->
            <div class="glass-card p-4 sm:p-5 border-gold/20 relative">
              <div class="text-center mb-3">
                <span
                  class="text-[9px] uppercase font-black tracking-widest text-gold bg-gold/10 px-2.5 py-0.5 rounded-full border border-gold/20 inline-block mb-1">
                  DEMI-FINALE 2
                </span>
                <p class="text-[9px] text-white/40">1er Groupe B vs 2ème Groupe A</p>
                <p v-if="semiFinal2?.scheduled_at" class="text-[10px] font-mono text-white/60 mt-1">
                  📅 {{ formatDate(semiFinal2.scheduled_at) }}
                </p>
              </div>

              <div class="space-y-2">
                <div class="flex justify-between items-center p-2.5 rounded-xl bg-white/5 text-xs"
                  :class="semiFinal2?.winner_clan_id === semiFinal2?.clan_home_id ? 'border border-gold text-gold font-bold bg-gold/10' : ''">
                  <div class="flex items-center gap-2 truncate">
                    <img :src="semiFinal2?.clan_home?.badge_url || '/images/default-clan.png'"
                      class="w-6 h-6 object-contain flex-shrink-0" />
                    <span class="font-bold truncate max-w-[120px]">{{ semiFinal2?.clan_home?.name || '1er Groupe B' }}</span>
                  </div>
                  <span class="font-black text-base text-gold">{{ semiFinal2?.total_stars_home ?? '-' }}</span>
                </div>

                <div class="text-center text-[9px] font-black text-white/20 italic">VS</div>

                <div class="flex justify-between items-center p-2.5 rounded-xl bg-white/5 text-xs"
                  :class="semiFinal2?.winner_clan_id === semiFinal2?.clan_away_id ? 'border border-gold text-gold font-bold bg-gold/10' : ''">
                  <div class="flex items-center gap-2 truncate">
                    <img :src="semiFinal2?.clan_away?.badge_url || '/images/default-clan.png'"
                      class="w-6 h-6 object-contain flex-shrink-0" />
                    <span class="font-bold truncate max-w-[120px]">{{ semiFinal2?.clan_away?.name || '2ème Groupe A' }}</span>
                  </div>
                  <span class="font-black text-base text-gold">{{ semiFinal2?.total_stars_away ?? '-' }}</span>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>

    </div>
  </div>
</template>

<script setup>
const { $api } = useNuxtApp();

const activeTab = ref('groups');
const loading = ref(true);

const standings = ref({ A: [], B: [] });
const allMatches = ref([]);

const groupMatches = computed(() => allMatches.value.filter(m => m.phase === 'group_stage' || m.group));
const semiFinals = computed(() => allMatches.value.filter(m => m.phase === 'semi_final'));
const semiFinal1 = computed(() => semiFinals.value[0] || null);
const semiFinal2 = computed(() => semiFinals.value[1] || null);
const grandFinal = computed(() => allMatches.value.find(m => m.phase === 'final') || null);

/**
 * Retourne la priorité d'un match selon la date programmée :
 * - 'urgent' : dans moins de 24h
 * - 'soon'   : dans moins de 3 jours
 * - 'none'   : plus de 3 jours ou non programmé
 */
const matchPriority = (match) => {
  if (!match.scheduled_at || match.status === 'completed') return 'none';
  const now = new Date();
  const scheduled = new Date(match.scheduled_at);
  const diffHours = (scheduled - now) / (1000 * 60 * 60);
  if (diffHours < 0) return 'none'; // match passé non terminé
  if (diffHours <= 24) return 'urgent';
  if (diffHours <= 72) return 'soon';
  return 'none';
};

const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleString('fr-FR', {
    timeZone: 'Africa/Douala',
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const fetchData = async () => {
  loading.value = true;
  try {
    const [groupData, matchesData] = await Promise.all([
      $api('/tournament/groups'),
      $api('/tournament/matches').catch(() => $api('/admin/competitions/1/matches').catch(() => [])),
    ]);

    standings.value = groupData || { A: [], B: [] };
    allMatches.value = Array.isArray(matchesData) ? matchesData : Object.values(matchesData).flat();
  } catch (e) {
    console.error('Error loading tournament data:', e);
  } finally {
    loading.value = false;
  }
};

onMounted(fetchData);
</script>

<style scoped>
.bracket-page {
  background:
    radial-gradient(circle at 50% 0%, rgba(212, 175, 55, 0.12) 0%, transparent 60%),
    linear-gradient(to bottom, #06070a, #0a1122);
}

.glass-card {
  background: rgba(10, 11, 18, 0.85);
  backdrop-filter: blur(12px);
  border-radius: 16px;
}

.spinner {
  width: 36px;
  height: 36px;
  border: 3px solid rgba(255, 255, 255, 0.05);
  border-top-color: #ffd700;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.winner-glow {
  box-shadow: 0 0 20px rgba(212, 175, 55, 0.3);
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
