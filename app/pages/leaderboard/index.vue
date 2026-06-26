<template>
  <div class="leaderboard-page">
    <header class="page-header animate-float">
      <h1 class="heading">Classement <span class="text-gold">Général</span></h1>
      <p class="subtitle">
        Suivez l'évolution des clans basés sur leurs performances réelles.
      </p>
    </header>

    <div v-if="loading" class="loader-container">
      <div class="spinner"></div>
      <p>Calcul des statistiques...</p>
    </div>

    <div v-else class="leaderboard-container glass-card">
      <table class="leaderboard-table">
        <thead>
          <tr>
            <th>Rang</th>
            <th>Clan</th>
            <th>Matchs</th>
            <th>Étoiles ⭐</th>
            <th>Dégâts %</th>
            <th>Points</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(reg, index) in rankings"
            :key="reg.id"
            :class="{ 'top-3': index < 3 }"
          >
            <td class="rank">#{{ index + 1 }}</td>
            <td class="clan-cell">
              <div class="clan-info">
                <img :src="reg.clan.badge_url" alt="" class="mini-badge" />
                <span class="clan-name">{{ reg.clan.name }}</span>
              </div>
            </td>
            <td>{{ reg.matches_played || 0 }}</td>
            <td class="stars">{{ reg.total_stars || 0 }}</td>
            <td class="destruction">
              {{ reg.destruction_percentage || "0.00" }}%
            </td>
            <td class="points text-gold">{{ reg.total_points || 0 }}</td>
          </tr>
        </tbody>
      </table>

      <div v-if="rankings.length === 0" class="no-data">
        <p>
          Le tournoi n'a pas encore commencé. Les statistiques apparaîtront
          après les premiers duels.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
const { $api } = useNuxtApp();
const rankings = ref([]);
const loading = ref(true);

const fetchRankings = async () => {
  try {
    rankings.value = await $api("/tournament/leaderboard");
  } catch (e) {
    console.error(e);
  } finally {
    loading.value = false;
  }
};

onMounted(fetchRankings);
</script>

<style scoped>
.page-header {
  text-align: center;
  margin-bottom: 40px;
}

.leaderboard-container {
  overflow-x: auto;
  padding: 20px;
}

.leaderboard-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
}

.leaderboard-table th {
  padding: 15px;
  font-family: "Outfit", sans-serif;
  font-size: 0.75rem;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: var(--text-muted);
  border-bottom: 1px solid var(--glass-border);
}

.leaderboard-table td {
  padding: 20px 15px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.03);
  font-weight: 500;
}

.rank {
  font-family: "Outfit", sans-serif;
  font-weight: 800;
  font-size: 1.1rem;
}

.top-3:nth-child(1) .rank {
  color: #ffd700;
}
.top-3:nth-child(2) .rank {
  color: #c0c0c0;
}
.top-3:nth-child(3) .rank {
  color: #cd7f32;
}

.clan-cell .clan-info {
  display: flex;
  align-items: center;
  gap: 15px;
}

.mini-badge {
  width: 32px;
  height: 32px;
}

.clan-name {
  font-weight: 700;
  font-size: 1rem;
}

.stars {
  color: #fbbf24;
  font-weight: bold;
}

.points {
  font-weight: 800;
}

.no-data {
  text-align: center;
  padding: 40px;
  color: var(--text-muted);
}

.loader-container {
  text-align: center;
  padding: 80px 0;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid var(--glass-border);
  border-top-color: var(--primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 768px) {
  .leaderboard-table th:nth-child(3),
  .leaderboard-table td:nth-child(3) {
    display: none;
  }
}
</style>
