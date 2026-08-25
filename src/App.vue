<template>
  <!-- ⭐ Esperar a que Pinia esté listo -->
  <div v-if="isAppReady">
    <router-view />
    <ToastNotification />
    <ConfirmModal />
    <PromptModal />
  </div>
  <div v-else class="loading-screen">
    <div class="spinner-border text-primary" role="status">
      <span class="visually-hidden">Cargando...</span>
    </div>
    <p class="mt-2 text-muted">Inicializando aplicación...</p>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import ToastNotification from './components/ui/ToastNotification.vue'
import ConfirmModal from './components/ui/ConfirmModal.vue'
import PromptModal from './components/ui/PromptModal.vue'

const isAppReady = ref(false)

onMounted(async () => {
  // ⭐ Esperar un tick para asegurar que Pinia esté listo
  await nextTick()
  isAppReady.value = true
})
</script>

<style>
.loading-screen {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background: #f8f6f4;
}

.loading-screen .spinner-border {
  width: 3rem;
  height: 3rem;
  color: #E85D3A !important;
}

.loading-screen p {
  color: #6b7280;
  font-size: 14px;
  margin-top: 16px;
}
</style>