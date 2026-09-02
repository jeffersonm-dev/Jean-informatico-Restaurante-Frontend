<template>
  <header class="topbar" :class="{ 'sidebar-collapsed': ui.sidebarCollapsed }">
    <div class="topbar-left">
      <button class="menu-toggle-btn" @click="toggleMobileMenu" title="Abrir / cerrar menú">
        <i class="bi bi-list"></i>
      </button>
      <div class="topbar-context">
        <span class="context-label">{{ context }}</span>
        <span class="context-period" v-if="currentPeriod">{{ currentPeriod }}</span>
      </div>
    </div>
    
    <div class="topbar-right">
      <div class="user-chip">
        <div class="user-avatar">{{ initials }}</div>
        <div class="user-info">
          <div class="user-name">{{ auth.user?.nombre || '—' }}</div>
          <div class="role-pill">{{ auth.isAdmin ? 'Administrador' : 'Empresa' }}</div>
        </div>
      </div>
      <button class="logout-btn" @click="logout" title="Cerrar sesión">
        <i class="bi bi-box-arrow-right"></i>
        <span class="logout-text">Salir</span>
      </button>
    </div>
  </header>
</template>

<script setup>
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth'
import { useUiStore } from '../../stores/ui'

const auth = useAuthStore()
const ui = useUiStore()
const route = useRoute()
const router = useRouter()

const isMobile = ref(window.innerWidth <= 768)

const titles = {
  bienvenida: 'Bienvenida',
  dashboard: 'Dashboard Principal',
  reporte_general: 'Reporte General',
  reporte: 'Reporte del Período',
  historial: 'Historial',
  config: 'Configuración',
  reportes: 'Reportes de Empresas',
  reporte_detalle: 'Detalle del Reporte',
  empresas: 'Empresas',
  usuarios: 'Usuarios y Accesos',
  roles: 'Roles y Permisos',
  logs: 'Bitácora de Actividad'
}

const context = computed(() => titles[route.name] || '—')

const currentPeriod = computed(() => {
  const now = new Date()
  const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
  return `${months[now.getMonth()]} ${now.getFullYear()}`
})

const initials = computed(() => (auth.user?.nombre || '?').trim().charAt(0).toUpperCase())

// ⭐ Función toggle mejorada para móvil
function toggleMobileMenu() {
  console.log('🟢 Topbar toggleMobileMenu - estado actual:', ui.sidebarMobileOpen)
  ui.sidebarMobileOpen = !ui.sidebarMobileOpen
  console.log('🟢 Topbar toggleMobileMenu - nuevo estado:', ui.sidebarMobileOpen)
}

function logout() {
  if (isMobile.value) {
    ui.sidebarMobileOpen = false
  }
  auth.logout()
  router.push({ name: 'login' })
}

function handleResize() {
  isMobile.value = window.innerWidth <= 768
  if (!isMobile.value && ui.sidebarMobileOpen) {
    ui.sidebarMobileOpen = false
  }
}

onMounted(() => {
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
/* ============================================
   TOPBAR
   ============================================ */
.topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 28px;
  background: #ffffff;
  border-bottom: 1px solid #e5e7eb;
  min-height: 68px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
}

.topbar-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.menu-toggle-btn {
  display: none;
  background: none;
  border: none;
  font-size: 22px;
  color: #4b5563;
  cursor: pointer;
  padding: 4px 6px;
  border-radius: 6px;
  transition: background 0.2s;
}

.menu-toggle-btn:hover {
  background: #f3f4f6;
}

.topbar-context {
  display: flex;
  align-items: center;
  gap: 12px;
}

.context-label {
  font-size: 18px;
  font-weight: 600;
  color: #1a1a2e;
}

.context-period {
  font-size: 13px;
  color: #6b7280;
  font-weight: 400;
  background: #f3f4f6;
  padding: 2px 12px;
  border-radius: 12px;
}

.topbar-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.user-chip {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 4px 12px 4px 4px;
  border-radius: 24px;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  transition: all 0.2s;
}

.user-chip:hover {
  background: #f3f4f6;
  border-color: #d1d5db;
}

.user-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: linear-gradient(135deg, #2F6FED, #6C63FF);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 14px;
  font-weight: 600;
  text-transform: uppercase;
  flex-shrink: 0;
}

.user-info {
  line-height: 1.3;
}

.user-name {
  font-size: 13px;
  font-weight: 600;
  color: #1a1a2e;
}

.role-pill {
  font-size: 10px;
  color: #6b7280;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.3px;
}

.logout-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  background: none;
  border: none;
  color: #6b7280;
  cursor: pointer;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  transition: all 0.2s;
}

.logout-btn:hover {
  background: #fef2f2;
  color: #dc2626;
}

.logout-btn i {
  font-size: 16px;
}

@media (max-width: 768px) {
  .topbar {
    padding: 12px 16px;
    min-height: 60px;
  }

  .menu-toggle-btn {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .context-label {
    font-size: 15px;
  }

  .context-period {
    font-size: 11px;
    padding: 1px 10px;
  }

  .user-chip {
    padding: 2px 8px 2px 2px;
  }

  .user-info .user-name {
    font-size: 12px;
  }

  .logout-text {
    display: none;
  }

  .logout-btn i {
    font-size: 18px;
  }

  .logout-btn {
    padding: 6px 8px;
  }
}

@media (max-width: 480px) {
  .context-period {
    display: none;
  }

  .user-info {
    display: none;
  }

  .user-chip {
    padding: 2px;
    border-radius: 50%;
    border: none;
    background: none;
  }

  .user-chip:hover {
    background: none;
  }
}
</style>