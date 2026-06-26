<template>
  <div v-if="election" class="election-module glass-card animate-scale">
    <div class="election-header">
      <div class="title-group">
        <h3 class="text-gold">🗳️ Élection du Capitaine</h3>
        <p class="subtitle">Soutenez votre leader pour la CCA National League</p>
      </div>
      <div class="timer">
        <span class="label">Ferme dans :</span>
        <span class="countdown">{{ timeLeft }}</span>
      </div>
    </div>

    <div v-if="election.status === 'open'" class="election-body">
      <div v-if="alreadyVoted" class="voted-message">
        <div class="check-icon">✓</div>
        <p>Merci ! Vous avez déjà voté pour <strong>{{ votedCandidateName }}</strong>.</p>
        <p class="sub">Les résultats seront proclamés à la fin du décompte.</p>
      </div>

      <div v-else class="voting-interface">
        <p class="instruction">Choisissez le membre qui dirigera votre clan pendant ce tournoi :</p>
        <div class="candidates-list">
          <div v-for="cand in eligibleCandidates" :key="cand.id" 
               class="candidate-row glass-card"
               :class="{ selected: selectedId === cand.id }"
               @click="selectedId = cand.id">
            <div class="cand-info">
              <span class="name">{{ cand.name }}</span>
              <span class="tag">{{ cand.tag_coc }}</span>
            </div>
            <div class="radio-circle"></div>
          </div>
        </div>

        <button @click="submitVote" 
                :disabled="!selectedId || voting" 
                class="btn-premium btn-primary btn-block mt-4">
          {{ voting ? 'Envoi...' : 'Confirmer mon vote' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  election: Object,
  members: Array
});

const emit = defineEmits(['voted']);

const { $api } = useNuxtApp();
const { user } = useAuth();

const selectedId = ref(null);
const voting = ref(false);
const timeLeft = ref('');

// Calculer les membres éligibles (validés sur plateforme)
const eligibleCandidates = computed(() => {
  return props.members
    .filter(m => m.is_registered && m.platform_user?.is_validated)
    .map(m => ({
        id: m.platform_user.id,
        name: m.name,
        tag_coc: m.tag_coc
    }));
});

const alreadyVoted = computed(() => {
    return props.election.votes?.some(v => v.voter_id === user.value?.id);
});

const votedCandidateName = computed(() => {
    const vote = props.election.votes?.find(v => v.voter_id === user.value?.id);
    if (!vote) return '';
    const cand = props.members.find(m => m.platform_user?.id === vote.candidate_id);
    return cand ? cand.name : 'un membre';
});

const submitVote = async () => {
  if (!selectedId.value) return;
  voting.value = true;
  try {
    await $api(`/elections/${props.election.id}/vote`, {
      method: 'POST',
      body: { candidate_id: selectedId.value }
    });
    emit('voted');
    alert("Vote pris en compte !");
  } catch (e) {
    alert(e.data?.message || "Erreur lors du vote.");
  } finally {
    voting.value = false;
  }
};

// Timer logic
const updateTimer = () => {
    const end = new Date(props.election.ends_at).getTime();
    const now = new Date().getTime();
    const diff = end - now;

    if (diff <= 0) {
        timeLeft.value = "Terminé";
        return;
    }

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    timeLeft.value = `${hours}h ${mins}m`;
};

let timerInterval;
onMounted(() => {
    updateTimer();
    timerInterval = setInterval(updateTimer, 60000);
});

onUnmounted(() => {
    clearInterval(timerInterval);
});
</script>

<style scoped>
.election-module {
    padding: 30px;
    margin-bottom: 40px;
    border-color: rgba(212, 175, 55, 0.3);
    background: linear-gradient(135deg, rgba(212, 175, 55, 0.05) 0%, rgba(10, 11, 18, 0.4) 100%);
}

.election-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 25px;
}

.timer {
    text-align: right;
}

.timer .label {
    display: block;
    font-size: 0.75rem;
    color: var(--text-muted);
}

.timer .countdown {
    font-size: 1.2rem;
    font-weight: bold;
    color: #ff4d4d;
}

.title-group h3 {
    margin: 0;
    font-size: 1.4rem;
}

.subtitle {
    font-size: 0.85rem;
    color: var(--text-muted);
}

.instruction {
    margin-bottom: 15px;
    font-size: 0.95rem;
}

.candidates-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.candidate-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 20px;
    cursor: pointer;
    transition: all 0.2s ease;
}

.candidate-row:hover {
    background: rgba(255, 255, 255, 0.05);
}

.candidate-row.selected {
    border-color: var(--primary);
    background: rgba(212, 175, 55, 0.1);
}

.cand-info .name {
    display: block;
    font-weight: bold;
}

.cand-info .tag {
    font-size: 0.75rem;
    color: var(--text-muted);
}

.radio-circle {
    width: 20px;
    height: 20px;
    border: 2px solid var(--glass-border);
    border-radius: 50%;
    position: relative;
}

.candidate-row.selected .radio-circle {
    border-color: var(--primary);
}

.candidate-row.selected .radio-circle::after {
    content: "";
    width: 10px;
    height: 10px;
    background: var(--primary);
    border-radius: 50%;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}

.voted-message {
    text-align: center;
    padding: 20px;
}

.check-icon {
    width: 50px;
    height: 50px;
    background: #10b981;
    color: white;
    font-size: 1.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    margin: 0 auto 15px;
}

.sub {
    font-size: 0.85rem;
    color: var(--text-muted);
    margin-top: 5px;
}

.btn-block {
    width: 100%;
}
</style>
