<template>
  <!-- ⭐ Esperar a que Pinia esté listo -->
  <div v-if="isReady" id="appShell" class="active">
    <div class="app-layout">
      <Sidebar />
      <div class="content-col" :class="{ 'sidebar-collapsed': ui.sidebarCollapsed }">
        <Topbar />
        <div class="main">
          <router-view />
        </div>
      </div>
    </div>
  </div>
  <div v-else class="loading-screen">
    <div class="spinner-border text-primary" role="status">
      <span class="visually-hidden">Cargando...</span>
    </div>
    <p class="mt-2 text-muted">Inicializando aplicación...</p>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick, computed } from 'vue'
import { useUiStore } from '../../stores/ui'
import { useAuthStore } from '../../stores/auth'
import Sidebar from './Sidebar.vue'
import Topbar from './Topbar.vue'

// ⭐ Inicializar stores
const ui = useUiStore()
const auth = useAuthStore()

// ⭐ Estado de carga
const isReady = ref(false)

// ⭐ Computed para el estado del sidebar
const sidebarCollapsed = computed(() => ui.sidebarCollapsed)

// ⭐ Cargar estado del sidebar al inicio
onMounted(async () => {
  // Cargar estado guardado del sidebar
  ui.loadSidebarState()
  
  // Esperar un tick para asegurar que todo esté listo
  await nextTick()
  isReady.value = true
  
  console.log('✅ AppShell lista - Usuario:', auth.user?.nombre)
  console.log('✅ AppShell lista - Rol:', auth.user?.rol_nombre)
})
</script>

<style scoped>
/* ============================================
   APP LAYOUT - Ajuste para el sidebar
   ============================================ */
.app-layout {
  display: flex;
  min-height: 100vh;
  background: #f0f2f5;
}

.content-col {
  flex: 1;
  display: flex;
  flex-direction: column;
  margin-left: 260px;
  min-height: 100vh;
  transition: margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.content-col.sidebar-collapsed {
  margin-left: 72px;
}

.main {
  flex: 1;
  padding: 24px 28px;
  background: #f8f6f4;
  overflow-x: hidden;
}

/* ============================================
   LOADING SCREEN
   ============================================ */
.loading-screen {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background: #f8f6f4;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9999;
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

/* ============================================
   RESPONSIVE
   ============================================ */
@media (max-width: 768px) {
  .content-col {
    margin-left: 0 !important;
  }
  
  .content-col.sidebar-collapsed {
    margin-left: 0 !important;
  }
  
  .main {
    padding: 16px;
  }
}
</style>