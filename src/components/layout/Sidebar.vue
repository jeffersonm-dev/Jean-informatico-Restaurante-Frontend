<template>
  <aside 
    class="sidebar" 
    :class="{ 
      collapsed: ui.sidebarCollapsed, 
      'mobile-open': ui.sidebarMobileOpen 
    }"
  >
    <!-- Brand con botón de colapso integrado -->
    <div class="sidebar-brand">
      <div class="brand-left">
        <div class="brand-icon">
          <i class="bi bi-utensils fs-3 text-primary"></i>
        </div>
        <transition name="fade">
          <div v-if="!ui.sidebarCollapsed" class="brand-text">
            <div class="brand-name">
              <span class="a1">Restaurante</span>
              <span class="a2">Gourmet</span>
            </div>
            <div class="brand-tag">SISTEMA DE GESTIÓN</div>
          </div>
        </transition>
      </div>
      
      <!-- Botón de colapso/cierre -->
      <button class="collapse-toggle" @click="toggleSidebar" :title="isMobile ? 'Cerrar menú' : (ui.sidebarCollapsed ? 'Expandir' : 'Colapsar')">
        <i :class="isMobile ? 'bi bi-x-lg' : (ui.sidebarCollapsed ? 'bi bi-chevron-right' : 'bi bi-chevron-left')"></i>
      </button>
    </div>

    <!-- User Profile -->
    <div v-if="!ui.sidebarCollapsed" class="sidebar-user">
      <div class="user-avatar">
        <span class="avatar-text">{{ userInitials }}</span>
      </div>
      <div class="user-info">
        <div class="user-name">{{ userName }}</div>
        <div class="user-role">{{ userRole }}</div>
        <div v-if="userSede" class="user-empresa">
          <i class="bi bi-building"></i>
          {{ userSede }}
        </div>
      </div>
      <button class="logout-btn" @click="logout" title="Cerrar sesión">
        <i class="bi bi-box-arrow-right"></i>
      </button>
    </div>

    <!-- Versión colapsada del perfil -->
    <div v-else class="sidebar-user-collapsed">
      <button class="user-btn" @click="logout" title="Cerrar sesión">
        <span class="avatar-text">{{ userInitials }}</span>
      </button>
    </div>

    <!-- Navigation -->
    <nav class="sidebar-nav">
      <template v-for="section in sections" :key="section.section">
        <div v-if="!ui.sidebarCollapsed" class="nav-section-label">{{ section.section }}</div>
        <router-link
          v-for="item in section.items"
          :key="item.key"
          :to="{ name: item.key }"
          class="nav-item"
          :class="{ active: isActive(item.key) }"
          @click="handleNavClick"
          :title="ui.sidebarCollapsed ? item.label : ''"
        >
          <span class="nav-icon">
            <i :class="item.icon"></i>
          </span>
          <transition name="fade">
            <span v-if="!ui.sidebarCollapsed" class="nav-label">{{ item.label }}</span>
          </transition>
        </router-link>
      </template>
    </nav>

    <!-- Overlay para móvil -->
    <div class="sidebar-overlay" @click="closeMobile" v-if="ui.sidebarMobileOpen"></div>

    <!-- Footer -->
    <div class="sidebar-foot">
      <p v-if="!ui.sidebarCollapsed" class="footer-text">© 2026 · Jean Informático C.A.</p>
    </div>
  </aside>
</template>

<script setup>
import { ref, computed, onBeforeMount, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUiStore } from '../../stores/ui'
import { useAuthStore } from '../../stores/auth'
import { navConfig } from '../../utils/navConfig'

// ⭐ Inicializar stores
const ui = useUiStore()
const auth = useAuthStore()
const route = useRoute()
const router = useRouter()

const isMobile = ref(window.innerWidth <= 768)

// ============================================
// LOGS DE DEPURACIÓN
// ============================================
console.log('🟢 Sidebar - Usuario completo:', auth.user)
console.log('🟢 Sidebar - rol_nombre:', auth.user?.rol_nombre)

// Obtener el rol correctamente
const userRol = computed(() => {
  if (auth.userRoles) {
    return auth.userRoles
  }
  if (auth.user?.rol_nombre) {
    return auth.user.rol_nombre
  }
  if (auth.user?.rol) {
    return auth.user.rol
  }
  console.warn('⚠️ No se encontró rol en el usuario:', auth.user)
  return null
})

// Generar secciones basadas en el rol
const sections = computed(() => {
  const rol = userRol.value
  console.log('📋 Generando navegación para rol:', rol)
  const config = navConfig(rol)
  console.log('📋 Configuración generada:', config)
  return config
})

const userName = computed(() => {
  if (!auth.user) return 'Usuario'
  return auth.user.nombre || auth.user.username || auth.user.email || 'Usuario'
})

const userRole = computed(() => {
  if (!auth.user) return ''
  const rol = userRol.value
  if (!rol) return ''
  return rol.toUpperCase()
})

const userSede = computed(() => {
  if (!auth.user) return null
  return auth.user.sede_nombre || auth.user.sede || auth.user.empresa_nombre || null
})

const userInitials = computed(() => {
  if (!auth.user) return 'U'
  const nombre = auth.user.nombre || auth.user.username || 'Usuario'
  const apellido = auth.user.apellido || ''
  if (nombre && apellido) {
    return `${nombre.charAt(0)}${apellido.charAt(0)}`.toUpperCase()
  }
  return nombre.charAt(0).toUpperCase()
})

function isActive(key) {
  return route.name === key
}

// ============================================
// FUNCIONES
// ============================================
function toggleSidebar() {
  if (isMobile.value) {
    ui.sidebarMobileOpen = false
  } else {
    ui.toggleSidebar()
  }
}

function closeMobile() {
  if (isMobile.value) {
    ui.sidebarMobileOpen = false
  }
}

function handleNavClick() {
  if (isMobile.value) {
    ui.sidebarMobileOpen = false
  }
}

async function logout() {
  await auth.logout()
  router.push({ name: 'login' })
}

// ============================================
// DETECTAR CAMBIO DE TAMAÑO
// ============================================
function handleResize() {
  isMobile.value = window.innerWidth <= 768
  if (!isMobile.value) {
    ui.sidebarMobileOpen = false
  }
}

// ============================================
// LIFECYCLE
// ============================================
onBeforeMount(() => {
  // ⭐ Cargar estado del sidebar ANTES de montar
  ui.loadSidebarState()
})

onMounted(() => {
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
/* ============================================
   IMPORTAR BOOTSTRAP ICONS
   ============================================ */
@import 'bootstrap-icons/font/bootstrap-icons.css';

/* ============================================
   SIDEBAR BASE
   ============================================ */
.sidebar {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  width: 260px;
  background: #16213e;
  color: rgba(255, 255, 255, 0.7);
  display: flex;
  flex-direction: column;
  z-index: 1050;
  transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1), transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 2px 0 15px rgba(0, 0, 0, 0.3);
  overflow: hidden;
}

.sidebar.collapsed {
  width: 72px;
}

/* ============================================
   OVERLAY PARA MÓVIL
   ============================================ */
.sidebar-overlay {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1040;
}

.sidebar.mobile-open .sidebar-overlay {
  display: block;
}

/* ============================================
   BRAND
   ============================================ */
.sidebar-brand {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 14px 16px 18px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  min-height: 68px;
  flex-shrink: 0;
  background: rgba(255, 255, 255, 0.02);
}

.brand-left {
  display: flex;
  align-items: center;
  gap: 12px;
  overflow: hidden;
  flex: 1;
}

.brand-icon i {
  font-size: 26px;
  color: #E85D3A;
  flex-shrink: 0;
}

.brand-text {
  overflow: hidden;
  white-space: nowrap;
}

.brand-name {
  font-size: 17px;
  font-weight: 700;
  line-height: 1.2;
}

.brand-name .a1 { color: #ffffff; }
.brand-name .a2 { color: #E85D3A; }

.brand-tag {
  font-size: 8px;
  color: rgba(255, 255, 255, 0.25);
  letter-spacing: 1.5px;
  text-transform: uppercase;
  font-weight: 600;
}

/* Botón de colapso/cierre */
.collapse-toggle {
  background: rgba(255, 255, 255, 0.05);
  border: none;
  color: rgba(255, 255, 255, 0.3);
  cursor: pointer;
  padding: 4px 6px;
  border-radius: 4px;
  transition: all 0.2s ease;
  flex-shrink: 0;
  font-size: 16px;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.collapse-toggle:hover {
  background: rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.6);
}

.sidebar.collapsed .collapse-toggle {
  margin: 0 auto;
}

.sidebar.collapsed .collapse-toggle i {
  font-size: 18px;
}

/* ============================================
   USER PROFILE
   ============================================ */
.sidebar-user {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px 14px 18px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  flex-shrink: 0;
  background: rgba(255, 255, 255, 0.02);
}

.user-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: linear-gradient(135deg, #E85D3A, #F4A261);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.avatar-text {
  color: #fff;
  font-size: 14px;
  font-weight: 600;
  text-transform: uppercase;
}

.user-info {
  flex: 1;
  overflow: hidden;
  white-space: nowrap;
}

.user-name {
  font-size: 13px;
  font-weight: 600;
  color: #fff;
  margin-bottom: 1px;
}

.user-role {
  font-size: 9px;
  color: rgba(255, 255, 255, 0.3);
  font-weight: 600;
  letter-spacing: 0.8px;
  text-transform: uppercase;
}

.user-empresa {
  font-size: 10px;
  color: rgba(255, 255, 255, 0.4);
  display: flex;
  align-items: center;
  gap: 4px;
  margin-top: 2px;
  font-weight: 400;
}

.user-empresa i {
  font-size: 10px;
}

.logout-btn {
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.2);
  cursor: pointer;
  font-size: 16px;
  padding: 4px;
  transition: color 0.2s;
  border-radius: 4px;
}

.logout-btn:hover {
  color: #ef4444;
}

/* Usuario colapsado */
.sidebar-user-collapsed {
  display: flex;
  justify-content: center;
  padding: 12px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.user-btn {
  background: linear-gradient(135deg, #E85D3A, #F4A261);
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s;
}

.user-btn:hover {
  transform: scale(1.05);
}

.user-btn .avatar-text {
  color: #fff;
  font-size: 16px;
  font-weight: 600;
  text-transform: uppercase;
}

/* ============================================
   NAVIGATION
   ============================================ */
.sidebar-nav {
  flex: 1;
  overflow-y: auto;
  padding: 8px 0;
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 255, 255, 0.05) transparent;
}

.sidebar-nav::-webkit-scrollbar {
  width: 4px;
}

.sidebar-nav::-webkit-scrollbar-track {
  background: transparent;
}

.sidebar-nav::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 2px;
}

.nav-section-label {
  padding: 12px 20px 6px;
  font-size: 9px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1.2px;
  color: rgba(255, 255, 255, 0.15);
  white-space: nowrap;
  overflow: hidden;
}

.sidebar.collapsed .nav-section-label {
  display: none;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 9px 18px;
  margin: 1px 10px;
  border-radius: 8px;
  color: rgba(255, 255, 255, 0.4);
  text-decoration: none;
  transition: all 0.15s ease;
  cursor: pointer;
  position: relative;
  white-space: nowrap;
  overflow: hidden;
}

.nav-item:hover {
  background: rgba(255, 255, 255, 0.04);
  color: rgba(255, 255, 255, 0.7);
}

.nav-item.active {
  background: rgba(232, 93, 58, 0.15);
  color: #E85D3A;
}

.nav-item.active .nav-icon i {
  color: #E85D3A;
}

.nav-icon i {
  font-size: 17px;
  color: rgba(255, 255, 255, 0.25);
  transition: color 0.15s;
  width: 20px;
  text-align: center;
}

.nav-item:hover .nav-icon i {
  color: rgba(255, 255, 255, 0.5);
}

.nav-item.active .nav-icon i {
  color: #E85D3A;
}

.nav-label {
  font-size: 13px;
  font-weight: 500;
  flex: 1;
}

/* Sidebar collapsed */
.sidebar.collapsed .nav-item {
  padding: 10px;
  margin: 2px 8px;
  justify-content: center;
}

.sidebar.collapsed .nav-item .nav-label {
  display: none;
}

.sidebar.collapsed .nav-item .nav-icon i {
  font-size: 19px;
}

.sidebar.collapsed .nav-item.active {
  background: rgba(232, 93, 58, 0.15);
}

/* ============================================
   FOOTER
   ============================================ */
.sidebar-foot {
  padding: 12px 0 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.04);
  flex-shrink: 0;
  display: flex;
  justify-content: center;
}

.footer-text {
  font-size: 9px;
  color: rgba(255, 255, 255, 0.1);
  margin: 0;
  font-weight: 300;
  letter-spacing: 0.5px;
}

.sidebar.collapsed .footer-text {
  display: none;
}

/* ============================================
   ANIMATIONS
   ============================================ */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateX(-6px);
}

/* ============================================
   RESPONSIVE - MOBILE
   ============================================ */
@media (max-width: 768px) {
  .sidebar {
    transform: translateX(-100%);
    width: 280px;
    border-radius: 0 12px 12px 0;
  }

  .sidebar.mobile-open {
    transform: translateX(0);
    box-shadow: 4px 0 30px rgba(0, 0, 0, 0.5);
  }

  .sidebar.collapsed {
    width: 280px;
  }

  .sidebar.collapsed .nav-item {
    justify-content: flex-start;
    padding: 9px 18px;
  }

  .sidebar.collapsed .nav-item .nav-label {
    display: block;
  }

  .sidebar.collapsed .nav-section-label {
    display: block;
  }

  .sidebar.collapsed .sidebar-user-collapsed {
    display: none;
  }

  .sidebar.collapsed .sidebar-user {
    display: flex;
  }

  .sidebar.collapsed .footer-text {
    display: block;
  }

  .sidebar.collapsed .collapse-toggle {
    margin: 0;
  }
  
  .sidebar.collapsed .collapse-toggle i {
    font-size: 16px;
  }

  .sidebar.mobile-open .sidebar-overlay {
    display: block;
  }
}

/* ============================================
   TOOLTIP PARA COLLAPSED (Desktop)
   ============================================ */
@media (min-width: 769px) {
  .sidebar.collapsed .nav-item {
    position: relative;
  }

  .sidebar.collapsed .nav-item:hover::after {
    content: attr(title);
    position: absolute;
    left: 100%;
    top: 50%;
    transform: translateY(-50%);
    margin-left: 14px;
    padding: 4px 14px;
    background: #16213e;
    color: #fff;
    font-size: 12px;
    font-weight: 500;
    border-radius: 6px;
    white-space: nowrap;
    pointer-events: none;
    z-index: 1100;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);
    border: 1px solid rgba(255, 255, 255, 0.06);
  }
}
</style>