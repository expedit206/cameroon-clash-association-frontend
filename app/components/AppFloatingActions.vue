<template>
  <div class="fixed bottom-6 right-6 z-[100] flex flex-col gap-4 items-end">
    <!-- 1. Bouton Tournoi (L'icône d'épées est maintenant ici) -->
    <NuxtLink to="/tournaments"
      class="coc-fab group relative flex items-center justify-center w-12 h-12 rounded-xl transition-all duration-300"
      title="Accéder aux Tournois">
      <div
        class="absolute inset-0 bg-[#4e342e] border-2 border-[#d4af37] rounded-xl shadow-[0_5px_0_#2b1b18] group-hover:shadow-[0_2px_0_#2b1b18] group-hover:translate-y-[3px] transition-all">
      </div>
      <div class="relative z-10 group-hover:scale-110 transition-transform">
        <LucideSwords  class="inline icon w-5 h-5 text-[#d4af37]" />
      </div>

      <!-- Label Tooltip -->
      <div
        class="absolute right-full mr-4 px-3 py-1.5 bg-[#2b1b18] border border-[#d4af37]/30 rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-2xl">
        <p class="text-[10px] font-black uppercase text-[#d4af37] tracking-widest">
          Participer au Tournoi
        </p>
      </div>
    </NuxtLink>

    <!-- 2. Bouton Assistance Client (WhatsApp) -->
    <a href="https://wa.me/237640472357" target="_blank"
      class="coc-fab group relative flex items-center justify-center w-12 h-12 rounded-xl transition-all duration-300"
      title="Assistance WhatsApp">
      <div
        class="absolute inset-0 bg-[#3e2723] border-2 border-[#d4af37]/60 rounded-xl shadow-[0_4px_0_#1a0f0d] group-hover:shadow-[0_2px_0_#1a0f0d] group-hover:translate-y-[2px] transition-all">
      </div>
      <div class="relative z-10 group-hover:scale-110 transition-transform">
        <LucideMessageCircle class="w-5 h-5 text-green-400" :stroke-width="2" />
      </div>

      <!-- Label Tooltip -->
      <div
        class="absolute right-full mr-4 px-3 py-1.5 bg-[#2b1b18] border border-[#d4af37]/30 rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-2xl">
        <p class="text-[10px] font-black uppercase text-white/80 tracking-widest text-center">
          Assistance <br />
          <span class="text-green-400">WhatsApp</span>
        </p>
      </div>
    </a>

    <!-- 3. Bouton Synchronisation (Anciennement swords, maintenant refresh) -->
    <button v-if="user" @click="handleSync"
      class="coc-fab group relative flex items-center justify-center w-12 h-12 rounded-xl transition-all duration-300"
      :class="{ 'opacity-50 pointer-events-none': loading }" title="Synchroniser mes données CoC">
      <div
        class="absolute inset-0 bg-[#2b1b18] border-2 border-[#d4af37]/40 rounded-xl shadow-[0_4px_0_#150c0a] group-hover:shadow-[0_2px_0_#150c0a] group-hover:translate-y-[2px] transition-all">
      </div>
      <div class="relative z-10 group-hover:rotate-180 transition-transform duration-500">
        <LucideRefreshCw class="w-5 h-5 text-[#d4af37]/70" />
      </div>

      <!-- Label Tooltip -->
      <div
        class="absolute right-full mr-4 px-3 py-1.5 bg-[#2b1b18] border border-[#d4af37]/30 rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-2xl">
        <p class="text-[10px] font-black uppercase text-white/60 tracking-widest">
          Rafraîchir mes données
        </p>
      </div>
    </button>

    <!-- Modal de Synchronisation (Réutilisé de AppSyncButton) -->
    <div v-if="loading" class="fixed inset-0 z-[101] flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-black/85 backdrop-blur-md animate-fade-in"></div>
      <div class="relative max-w-sm w-full text-center animate-scale-in">
        <div class="absolute -top-12 left-1/2 -translate-x-1/2 w-24 h-24 z-20">
          <img src="/imagescoc/badge 2.webp" alt=""
            class="w-full h-full object-contain filter drop-shadow-[0_0_15px_rgba(212,175,55,0.5)]" />
        </div>
        <div
          class="bg-[#3e2723] border-4 border-[#d4af37] rounded-3xl p-10 pt-16 shadow-[0_15px_0_#2b1b18] relative overflow-hidden">
          <div class="absolute inset-x-0 top-0 h-1/2 bg-white/5 skew-y-[-10deg] -translate-y-1/2"></div>
          <div class="relative w-16 h-16 mx-auto mb-8">
            <div class="absolute inset-0 border-4 border-[#d4af37]/20 rounded-full"></div>
            <div class="absolute inset-0 border-4 border-[#d4af37] border-t-transparent rounded-full animate-spin">
            </div>
            <div class="absolute inset-0 flex items-center justify-center">
              <LucideRefreshCw class="w-7 h-7 text-[#d4af37]" />
            </div>
          </div>
          <h3 class="text-xl font-black italic text-white uppercase tracking-tight mb-3 drop-shadow-md">
            Synchronisation <span class="text-[#d4af37]">en cours</span>
          </h3>
          <p class="text-white/60 text-sm leading-relaxed mb-6">
            Nous récupérons vos dernières performances, votre clan et votre
            niveau de ligue directement depuis l'API officielle de
            <span class="text-white font-bold italic">Clash of Clans</span>.
          </p>
          <div class="mt-8 flex items-center justify-center gap-3">
            <div class="h-2 w-2 bg-[#d4af37] rounded-full animate-bounce [animation-delay:-0.32s]"></div>
            <div class="h-2 w-2 bg-[#d4af37] rounded-full animate-bounce [animation-delay:-0.16s]"></div>
            <div class="h-2 w-2 bg-[#d4af37] rounded-full animate-bounce"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const { user, fetchUser } = useAuth();
const { $api, $toast } = useNuxtApp();
const loading = ref(false);

const handleSync = async () => {
  if (loading.value) return;
  loading.value = true;
  try {
    const res = await $api("/auth/sync", { method: "POST" });
    await fetchUser();
    $toast.success(res.message || "Profil synchronisé !");
    setTimeout(() => {
      window.location.reload();
    }, 1500);
  } catch (e) {
    console.error("Sync error:", e);
    $toast.error(e.data?.message || "Erreur de synchronisation");
    loading.value = false;
  }
};
</script>

<style scoped>
.coc-fab {
  position: relative;
}

.animate-fade-in {
  animation: fadeIn 0.4s ease forwards;
}

.animate-scale-in {
  animation: scaleIn 0.5s cubic-bezier(0.18, 0.89, 0.32, 1.28) forwards;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.8) translateY(20px);
  }

  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

div[class*="absolute right-full"] {
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.8);
}
</style>
