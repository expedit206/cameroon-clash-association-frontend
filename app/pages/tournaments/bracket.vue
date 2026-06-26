<template>
  <div class="bracket-page">
    <header class="page-header animate-float">
      <h1 class="heading">Tableau de <span class="text-gold">Tournoi</span></h1>
      <p class="subtitle">Le chemin vers la consécration ultime.</p>
    </header>

    <div v-if="loading" class="loader-container">
      <div class="spinner"></div>
      <p>Génération de l'arène...</p>
    </div>

    <!-- Si pas de matches -->
    <div
      v-else-if="Object.keys(bracket).length === 0"
      class="empty-bracket glass-card"
    >
      <p>
        Le tournoi n'a pas encore été généré. Dès que 16 clans d'élite seront
        confirmés, l'arbre de combat apparaîtra ici.
      </p>
      <div class="registration-status mt-6">
        <div class="progress-bar-bg">
          <div
            class="progress-bar-fill"
            :style="{ width: (confirmedCount / 16) * 100 + '%' }"
          ></div>
        </div>
        <p class="text-sm mt-2">{{ confirmedCount }} / 16 clans confirmés</p>
      </div>
    </div>

    <!-- L'Arbre de Tournoi -->
    <div v-else class="bracket-wrapper">
      <div class="bracket-scroll">
        <div class="bracket-container">
          <!-- Round 1: 8èmes (16 clans) -->
          <div class="bracket-round round-1">
            <h4 class="round-title">8èmes de Finale</h4>
            <div class="matches-list">
              <div
                v-for="match in bracket[1]"
                :key="match.id"
                class="match-item glass-card"
              >
                <div
                  class="clan-row"
                  :class="{
                    winner: isWinner(match, 1),
                    loser: isWinner(match, 2),
                  }"
                >
                  <img :src="match.clan1?.badge_url" alt="" class="badge-xs" />
                  <span class="name">{{
                    match.clan1?.name || "À déterminer"
                  }}</span>
                  <span class="score" v-if="match.status === 'completed'">{{
                    match.clan1_stars
                  }}</span>
                </div>
                <div class="match-vs">VS</div>
                <div
                  class="clan-row"
                  :class="{
                    winner: isWinner(match, 2),
                    loser: isWinner(match, 1),
                  }"
                >
                  <img :src="match.clan2?.badge_url" alt="" class="badge-xs" />
                  <span class="name">{{
                    match.clan2?.name || "À déterminer"
                  }}</span>
                  <span class="score" v-if="match.status === 'completed'">{{
                    match.clan2_stars
                  }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Round 2: Quarts -->
          <div class="bracket-round round-2">
            <h4 class="round-title">Quarts de Finale</h4>
            <div class="matches-list">
              <div
                v-for="match in bracket[2]"
                :key="match.id"
                class="match-item glass-card"
              >
                <div class="clan-row" :class="{ winner: isWinner(match, 1) }">
                  <span class="name">{{ match.clan1?.name || "TBD" }}</span>
                </div>
                <div class="match-vs">VS</div>
                <div class="clan-row" :class="{ winner: isWinner(match, 2) }">
                  <span class="name">{{ match.clan2?.name || "TBD" }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Round 3: Demis -->
          <div class="bracket-round round-3">
            <h4 class="round-title">Demi-Finales</h4>
            <div class="matches-list">
              <div
                v-for="match in bracket[3]"
                :key="match.id"
                class="match-item glass-card semi"
              >
                <div class="clan-row" :class="{ winner: isWinner(match, 1) }">
                  <span class="name">{{ match.clan1?.name || "TBD" }}</span>
                </div>
                <div class="match-vs">VS</div>
                <div class="clan-row" :class="{ winner: isWinner(match, 2) }">
                  <span class="name">{{ match.clan2?.name || "TBD" }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Round 4: Finale -->
          <div class="bracket-round round-4">
            <h4 class="round-title text-gold">Grande Finale</h4>
            <div class="matches-list">
              <div
                v-for="match in bracket[4]"
                :key="match.id"
                class="match-item glass-card final"
              >
                <div class="trophy">🏆</div>
                <div class="clan-row" :class="{ winner: isWinner(match, 1) }">
                  <span class="name">{{ match.clan1?.name || "TBD" }}</span>
                </div>
                <div class="match-vs">VS</div>
                <div class="clan-row" :class="{ winner: isWinner(match, 2) }">
                  <span class="name">{{ match.clan2?.name || "TBD" }}</span>
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
const bracket = ref({});
const confirmedCount = ref(0);
const loading = ref(true);

const fetchData = async () => {
  try {
    const [bracketData, clansData] = await Promise.all([
      $api("/tournament/bracket"),
      $api("/admin/stats"), // On réutilise stats pour le count
    ]);
    bracket.value = bracketData;
    confirmedCount.value = clansData.confirmed_registrations || 0;
  } catch (e) {
    console.error(e);
  } finally {
    loading.value = false;
  }
};

const isWinner = (match, clanNum) => {
  if (match.status !== "completed") return false;
  if (clanNum === 1) return match.winner_id === match.clan1_id;
  return match.winner_id === match.clan2_id;
};

onMounted(fetchData);
</script>

<style scoped>
.page-header {
  text-align: center;
  margin-bottom: 40px;
}

.bracket-wrapper {
  margin-top: 40px;
  position: relative;
}

.bracket-scroll {
  overflow-x: auto;
  padding: 40px 0;
}

.bracket-container {
  display: flex;
  gap: 60px;
  min-width: 1200px;
  justify-content: center;
}

.bracket-round {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.round-title {
  text-align: center;
  font-family: "Outfit", sans-serif;
  text-transform: uppercase;
  letter-spacing: 2px;
  font-size: 0.8rem;
  color: var(--text-muted);
  margin-bottom: 30px;
}

.matches-list {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  flex: 1;
  gap: 20px;
}

.match-item {
  padding: 15px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid var(--glass-border);
  position: relative;
  transition: all 0.3s;
}

.match-item:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: var(--primary);
  transform: scale(1.02);
}

.clan-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px;
  border-radius: 6px;
  font-weight: 600;
  font-size: 0.9rem;
}

.clan-row.winner {
  background: rgba(187, 0, 255, 0.1);
  color: white;
}
.clan-row.loser {
  opacity: 0.5;
}

.badge-xs {
  width: 24px;
  height: 24px;
}
.name {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.score {
  font-family: "Outfit", sans-serif;
  font-weight: 800;
  color: #fbbf24;
  margin-left: 10px;
}

.match-vs {
  text-align: center;
  font-size: 0.6rem;
  font-weight: bold;
  opacity: 0.4;
  margin: 4px 0;
}

/* Connecteurs (Simplifiés via CSS) */
/* Pour un vrai bracket complet, on utiliserait des pseudo-éléments complexes */

.empty-bracket {
  text-align: center;
  padding: 80px 40px;
}
.progress-bar-bg {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 50px;
  height: 12px;
  max-width: 400px;
  margin: 0 auto;
  overflow: hidden;
}
.progress-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--primary), #fbbf24);
  transition: width 1s ease-out;
}

.trophy {
  font-size: 2rem;
  position: absolute;
  top: -35px;
  left: 50%;
  transform: translateX(-50%);
}

.final {
  border: 2px solid var(--gold) !important;
  box-shadow: 0 0 20px rgba(251, 191, 36, 0.2);
}
</style>
