<template>
    <div class="suspension-page">
        <div class="suspension-card">
            <!-- Icône -->
            <div class="icon-wrapper">
                <svg xmlns="http://www.w3.org/2000/svg" width="56" height="56" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
                </svg>
            </div>

            <!-- Titre -->
            <h1 class="title">Clash Bet — Suspendu</h1>

            <!-- Message principal -->
            <p class="message">
                La fonctionnalité de paris <strong>Clash Bet</strong> a été temporairement suspendue.<br />
                Les <strong>conditions d'utilisation de Supercell</strong> interdisent les systèmes de paris
                au sein des compétitions officielles <em>Clash of Clans</em>.
            </p>

            <!-- Règle Supercell mise en avant -->
            <div class="supercell-notice">
                <img src="/images/logo cca.png" alt="CCA" class="cca-logo" />
                <p>
                    Conformément aux règles de la <strong>Fan Content Policy de Supercell</strong>,
                    toute forme de mise en argent réel ou simulé liée aux compétitions est interdite.
                    La CCA respecte strictement ces directives.
                </p>
            </div>

            <!-- CTA retour -->
            <NuxtLink to="/tournaments" class="btn-back">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                    class="inline">
                    <polyline points="15 18 9 12 15 6" />
                </svg>
                Retour aux Tournois
            </NuxtLink>
        </div>
    </div>
</template>

<script setup>
definePageMeta({
    layout: 'default',
});

useSeoMeta({
    title: 'Clash Bet Suspendu — CCA National League',
    description: 'La fonctionnalité Clash Bet est temporairement suspendue en conformité avec les règles Supercell.',
    robots: 'noindex, nofollow',
});
</script>

<style scoped>
.suspension-page {
    min-height: 80vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem 1rem;
    background: radial-gradient(ellipse at center, rgba(20, 10, 5, 0.8) 0%, transparent 70%);
}

.suspension-card {
    max-width: 560px;
    width: 100%;
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 100, 50, 0.2);
    border-radius: 20px;
    padding: 3rem 2.5rem;
    text-align: center;
    box-shadow: 0 8px 40px rgba(0, 0, 0, 0.5), 0 0 60px rgba(255, 80, 30, 0.05);
}

.icon-wrapper {
    width: 96px;
    height: 96px;
    border-radius: 50%;
    background: rgba(255, 80, 30, 0.1);
    border: 1px solid rgba(255, 80, 30, 0.25);
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 1.8rem;
    color: #ff6432;
}

.title {
    font-size: 1.75rem;
    font-weight: 900;
    color: #fff;
    margin-bottom: 1rem;
    letter-spacing: -0.5px;
}

.message {
    color: rgba(255, 255, 255, 0.65);
    font-size: 0.95rem;
    line-height: 1.7;
    margin-bottom: 1.75rem;
}

.message strong {
    color: rgba(255, 255, 255, 0.9);
}

.supercell-notice {
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 12px;
    padding: 1.25rem 1.5rem;
    display: flex;
    gap: 1rem;
    align-items: flex-start;
    text-align: left;
    margin-bottom: 2rem;
}

.cca-logo {
    width: 36px;
    height: 36px;
    object-fit: contain;
    flex-shrink: 0;
    margin-top: 2px;
}

.supercell-notice p {
    color: rgba(255, 255, 255, 0.55);
    font-size: 0.82rem;
    line-height: 1.6;
    margin: 0;
}

.supercell-notice p strong {
    color: rgba(255, 255, 255, 0.85);
}

.btn-back {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 0.75rem 1.75rem;
    background: linear-gradient(135deg, rgba(212, 175, 55, 0.15), rgba(212, 175, 55, 0.08));
    border: 1px solid rgba(212, 175, 55, 0.3);
    border-radius: 10px;
    color: #d4af37;
    font-weight: 700;
    font-size: 0.9rem;
    text-decoration: none;
    transition: all 0.25s ease;
}

.btn-back:hover {
    background: linear-gradient(135deg, rgba(212, 175, 55, 0.25), rgba(212, 175, 55, 0.15));
    border-color: rgba(212, 175, 55, 0.5);
    transform: translateY(-1px);
}
</style>
