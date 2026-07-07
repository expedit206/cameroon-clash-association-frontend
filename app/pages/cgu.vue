<template>
  <div class="cgu-page min-h-screen pb-16 bg-[#06070a] text-white">
    <header
      class="relative min-h-[25vh] flex flex-col items-center justify-center pt-20 pb-10 px-6 text-center border-b border-white/5"
    >
      <div
        class="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-20"
      >
        <img
          src="/images/tournaments/hero-bg.png"
          class="w-full h-full object-cover scale-105"
        />
        <div class="absolute inset-0 bg-[#06070a]/80"></div>
      </div>

      <div class="relative z-10 space-y-2">
        <div class="flex justify-center mb-2">
          <NuxtLink to="/">
            <img
              src="/images/logo cca.png"
              alt="CCA Logo"
              class="h-16 w-auto"
            />
          </NuxtLink>
        </div>
        <h1
          class="text-3xl md:text-5xl font-black italic tracking-tighter text-white uppercase"
        >
          CHARTE & <span class="text-gold">CGU</span>
        </h1>
        <p
          class="text-white/40 text-xs md:text-sm uppercase tracking-[0.3em] font-light"
        >
          Conditions Générales d'Utilisation & Confidentialité
        </p>
      </div>
    </header>

    <main class="container mx-auto px-4 max-w-4xl mt-12">
      <div
        class="glass-card !p-8 md:!p-12 border-white/5 space-y-10 leading-relaxed text-white/80"
      >
        <!-- SECTION 1 -->
        <section class="space-y-4">
          <h2
            class="text-xl md:text-2xl font-black italic text-gold uppercase tracking-tight flex items-center gap-3"
          >
            <span>01.</span> OBJET DE LA PLATEFORME
          </h2>
          <div class="h-0.5 w-16 bg-gold"></div>
          <p>
            La Cameroon Clash Association (CCA) met à disposition cette
            plateforme Web afin de gérer l'organisation de la
            <b>CCA National League</b>. Le site sert à l'inscription des
            joueurs, au rassemblement des rosters de clans, au suivi des
            brackets de la compétition, et à la validation des participations.
            En accédant ou en créant un compte sur cette plateforme, vous
            acceptez pleinement ces présentes conditions.
          </p>
        </section>

        <!-- SECTION 2 -->
        <section class="space-y-4">
          <h2
            class="text-xl md:text-2xl font-black italic text-gold uppercase tracking-tight flex items-center gap-3"
          >
            <span>02.</span> COLLECTE & UTILISATION DES DONNÉES
          </h2>
          <div class="h-0.5 w-16 bg-gold"></div>
          <p>
            Pour garantir le respect des règles sportives et la vérification des
            comptes, nous collectons les données suivantes lors de votre
            inscription et durant votre participation :
          </p>
          <ul class="list-disc pl-6 space-y-2">
            <li>
              <b>Tag Joueur Clash of Clans :</b> Utilisé pour synchroniser votre
              niveau d'Hôtel de Ville (HDV), votre rôle au sein du clan (Leader,
              Co-Leader, etc.) et votre historique de jeu via l'API officielle
              de Supercell.
            </li>
            <li>
              <b>Numéro WhatsApp/Téléphone :</b> Utilisé comme moyen de contact
              direct des capitaines par l'administration du tournoi et pour le
              suivi des inscriptions.
            </li>
            <li>
              <b>Preuve d'appartenance / Capture d'écran du profil :</b>
              Téléchargée lors de l'inscription pour certifier manuellement la
              possession du compte Clash of Clans lié.
            </li>
            <li>
              <b>Données de Transaction :</b> Les références bancaires ou de
              services mobiles transmises pour d'éventuelles transactions de
              validation de votre équipe.
            </li>
          </ul>
          <p class="text-white/60 text-xs italic">
            Vos informations personnelles sont conservées de manière sécurisée
            et ne seront jamais partagées avec des tiers étrangers à
            l'organisation de la CCA.
          </p>
        </section>

        <!-- SECTION 3 -->
        <section class="space-y-4">
          <h2
            class="text-xl md:text-2xl font-black italic text-gold uppercase tracking-tight flex items-center gap-3"
          >
            <span>03.</span> VALIDATION DES PROFILS & ROSTER
          </h2>
          <div class="h-0.5 w-16 bg-gold"></div>
          <p>
            Chaque inscription est sujette à une vérification par l'équipe
            administrative de la CCA :
          </p>
          <ul class="list-disc pl-6 space-y-2">
            <li>
              Les profils doivent correspondre à des joueurs réels et
              vérifiables sur Clash of Clans.
            </li>
            <li>
              La désignation du capitaine d'un clan est exclusivement gérée par
              les administrateurs pour éviter tout conflit interne.
            </li>
            <li>
              La composition des rosters doit respecter la règle stricte de
              répartition des niveaux d'Hôtel de Ville (un joueur par palier
              d'HDV de 14 à 18 pour les titulaires). Tout contournement ou
              falsification entraînera le rejet immédiat du clan.
            </li>
          </ul>
        </section>

        <!-- SECTION 4 -->
        <section class="space-y-4">
          <h2
            class="text-xl md:text-2xl font-black italic text-gold uppercase tracking-tight flex items-center gap-3"
          >
            <span>04.</span> AVIS DE NON-AFFILIATION (SUPERCELL DECLARES)
          </h2>
          <div class="h-0.5 w-16 bg-gold"></div>
          <p
            class="border-l-4 border-gold/40 pl-4 py-2 bg-white/2 italic text-sm"
          >
            Cette compétition et cette plateforme ne sont pas affiliées à,
            approuvées par, ou spécifiquement parrainées par Supercell. Toutes
            les images, logos, marques et droits associés à Clash of Clans
            utilisés ici sont la propriété exclusive de Supercell et sont
            affichés à des fins illustratives et sportives de communauté
            conformément aux directives d'utilisation de la marque Supercell.
          </p>
        </section>

        <!-- SECTION 5 -->
        <section class="space-y-4">
          <h2
            class="text-xl md:text-2xl font-black italic text-gold uppercase tracking-tight flex items-center gap-3"
          >
            <span>05.</span> ACCEPTATION ET MODIFICATION
          </h2>
          <div class="h-0.5 w-16 bg-gold"></div>
          <p>
            La CCA se réserve le droit de modifier les présentes conditions
            d'utilisation à tout moment pour s'adapter aux évolutions du
            tournoi. Les capitaines de clans seront notifiés de toute
            modification significative. L'inscription active sur le site vaut
            ratification automatique de la charte de comportement et des CGU du
            site.
          </p>
        </section>

        <div
          class="pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4"
        >
          <p class="text-xs text-white/40">
            Dernière mise à jour : 02 Juillet 2026
          </p>
          <NuxtLink
            to="/register"
            class="btn-tournament secondary !text-xs py-3 px-8 uppercase font-bold tracking-wider"
          >
            ← Retour à l'inscription
          </NuxtLink>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
useHead({
  title: "Conditions Générales & Charte | CCA National League",
});
</script>

<style scoped>
.cgu-page {
  background-color: #06070a;
}
.glass-card {
  background: rgba(14, 16, 23, 0.6);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 16px;
}
</style>
