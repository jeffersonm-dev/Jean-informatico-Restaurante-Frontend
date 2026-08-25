<!-- src/views/AdminUsuariosView.vue -->
<template>
  <div class="users-management">
    <!-- HEADER -->
    <div class="panel-header">
      <div>
        <div class="panel-title">
          <i class="bi bi-people-fill"></i>
          Gestión de Usuarios
        </div>
        <div class="panel-sub">
          <i class="bi bi-info-circle"></i>
          Administra los accesos al sistema.
          <span class="role-count">{{ roles.length }}</span> roles disponibles
        </div>
      </div>
      <div class="header-stats">
        <span class="stat-badge">
          <i class="bi bi-people"></i>
          {{ usuarios.length }}
        </span>
        <span class="stat-badge success">
          <i class="bi bi-check-circle-fill"></i>
          {{ usuarios.filter(u => u.activo !== false).length }}
        </span>
        <span class="stat-badge roles-stats">
          <i class="bi bi-tags"></i>
          {{ roles.length }}
        </span>
        <button class="btn btn-outline btn-sm" @click="refreshData" title="Actualizar datos">
          <i class="bi bi-arrow-clockwise" :class="{ spin: loading }"></i>
        </button>
      </div>
    </div>

    <!-- ALERTAS -->
    <div v-if="successMessage" class="alert alert-success">
      <div class="alert-icon">✅</div>
      <div class="alert-content">
        <h4>¡Éxito!</h4>
        <p>{{ successMessage }}</p>
        <button @click="successMessage = ''" class="btn btn-primary btn-sm">
          <i class="bi bi-check2"></i> Entendido
        </button>
      </div>
    </div>

    <div v-if="errorMessage" class="alert alert-danger">
      <div class="alert-icon">❌</div>
      <div class="alert-content">
        <h4>Error</h4>
        <p>{{ errorMessage }}</p>
        <button @click="errorMessage = ''" class="btn btn-secondary btn-sm">
          <i class="bi bi-x"></i> Cerrar
        </button>
      </div>
    </div>

    <div class="manage-grid">
      <!-- FORMULARIO -->
      <div class="manage-card form-card">
        <div class="card-title">
          <i class="bi" :class="isEditing ? 'bi-pencil-square' : 'bi-person-plus'"></i>
          <h3>{{ isEditing ? 'Editar Usuario' : 'Registrar Nuevo Usuario' }}</h3>
        </div>
        <p class="card-sub">
          {{ isEditing ? 'Modifica los datos del usuario seleccionado.' : 'Crea un nuevo usuario y asígnale un rol.' }}
        </p>

        <form @submit.prevent="handleSubmit" novalidate>
          <!-- Nombre -->
          <div class="field-group">
            <label>
              <i class="bi bi-person"></i>
              Nombre <span class="required">*</span>
            </label>
            <input 
              type="text" 
              v-model="form.nombre" 
              placeholder="Ej. Juan Carlos"
              :class="{ 'error': errors.nombre }"
              @blur="validateField('nombre')"
            >
            <span class="error-msg" v-if="errors.nombre">
              <i class="bi bi-exclamation-circle"></i> {{ errors.nombre }}
            </span>
          </div>

          <!-- Apellido -->
          <div class="field-group">
            <label>
              <i class="bi bi-person"></i>
              Apellido
            </label>
            <input 
              type="text" 
              v-model="form.apellido" 
              placeholder="Ej. Pérez"
            >
          </div>

          <!-- Email -->
          <div class="field-group">
            <label>
              <i class="bi bi-envelope"></i>
              Correo Electrónico <span class="required">*</span>
            </label>
            <input 
              type="email" 
              v-model="form.email" 
              placeholder="juan@restaurante.com"
              :class="{ 'error': errors.email }"
              @blur="validateField('email')"
            >
            <span class="error-msg" v-if="errors.email">
              <i class="bi bi-exclamation-circle"></i> {{ errors.email }}
            </span>
          </div>

          <!-- Contraseña -->
          <div class="field-group">
            <label>
              <i class="bi bi-key"></i>
              {{ isEditing ? 'Nueva Contraseña' : 'Contraseña' }}
              <span class="required" v-if="!isEditing">*</span>
            </label>
            <div class="password-wrapper">
              <input 
                :type="showPassword ? 'text' : 'password'" 
                v-model="form.password" 
                :placeholder="isEditing ? 'Dejar vacío para mantener' : 'Mínimo 6 caracteres'"
                :class="{ 'error': errors.password }"
                @blur="validateField('password')"
              >
              <button type="button" class="toggle-pwd" @click="showPassword = !showPassword">
                <i class="bi" :class="showPassword ? 'bi-eye-slash' : 'bi-eye'"></i>
              </button>
            </div>
            <span class="error-msg" v-if="errors.password">
              <i class="bi bi-exclamation-circle"></i> {{ errors.password }}
            </span>
            <span class="help-text" v-if="isEditing">
              <i class="bi bi-info-circle"></i> Deja vacío para mantener la contraseña actual.
            </span>
          </div>

          <!-- Teléfono -->
          <div class="field-group">
            <label><i class="bi bi-telephone"></i> Teléfono</label>
            <input 
              type="text" 
              v-model="form.telefono" 
              placeholder="+58 412-1234567"
            >
          </div>

          <!-- Cédula -->
          <div class="field-group">
            <label><i class="bi bi-card-text"></i> Cédula</label>
            <input 
              type="text" 
              v-model="form.cedula" 
              placeholder="V-12345678"
            >
          </div>

          <!-- Dirección -->
          <div class="field-group">
            <label><i class="bi bi-geo-alt"></i> Dirección</label>
            <input 
              type="text" 
              v-model="form.direccion" 
              placeholder="Dirección del usuario"
            >
          </div>

          <!-- Sede -->
          <div class="field-group">
            <label>
              <i class="bi bi-building"></i>
              Sede <span class="required">*</span>
            </label>
            <select 
              v-model="form.sede_id" 
              :class="{ 'error': errors.sede_id }"
              @change="validateField('sede_id')"
            >
              <option value="" disabled>-- Selecciona una sede --</option>
              <option 
                v-for="sede in sedes" 
                :key="sede.id" 
                :value="sede.id"
              >
                {{ sede.nombre }}
              </option>
            </select>
            <span class="error-msg" v-if="errors.sede_id">
              <i class="bi bi-exclamation-circle"></i> {{ errors.sede_id }}
            </span>
          </div>

          <!-- Rol -->
          <div class="field-group">
            <label>
              <i class="bi bi-shield-check"></i>
              Rol de Acceso <span class="required">*</span>
            </label>
            <select 
              v-model="form.rol_id" 
              :class="{ 'error': errors.rol_id }"
              @change="validateField('rol_id')"
            >
              <option value="" disabled>-- Selecciona un rol --</option>
              <option 
                v-for="rol in roles" 
                :key="rol.id" 
                :value="rol.id"
              >
                {{ getRolEmoji(rol.nombre) }} {{ rol.nombre }}
              </option>
            </select>
            <span class="error-msg" v-if="errors.rol_id">
              <i class="bi bi-exclamation-circle"></i> {{ errors.rol_id }}
            </span>
          </div>

          <!-- Verificado -->
          <div class="field-group checkbox-group">
            <label class="checkbox-label">
              <input type="checkbox" v-model="form.verificado">
              <span class="toggle-text">
                <i class="bi" :class="form.verificado ? 'bi-check-circle-fill text-success' : 'bi-circle text-muted'"></i>
                {{ form.verificado ? 'Verificado' : 'No verificado' }}
              </span>
            </label>
          </div>

          <!-- Notificaciones -->
          <div class="field-group checkbox-group">
            <label class="checkbox-label">
              <input type="checkbox" v-model="form.notificaciones_email">
              <span class="toggle-text">
                <i class="bi bi-envelope"></i>
                Notificaciones por Email
              </span>
            </label>
          </div>

          <div class="field-group checkbox-group">
            <label class="checkbox-label">
              <input type="checkbox" v-model="form.notificaciones_whatsapp">
              <span class="toggle-text">
                <i class="bi bi-whatsapp"></i>
                Notificaciones por WhatsApp
              </span>
            </label>
          </div>

          <!-- Activo -->
          <div class="field-group checkbox-group">
            <label class="checkbox-label">
              <input type="checkbox" v-model="form.activo">
              <span class="toggle-text">
                <i class="bi" :class="form.activo ? 'bi-toggle-on text-success' : 'bi-toggle-off text-muted'"></i>
                {{ form.activo ? 'Usuario Activo' : 'Usuario Inactivo' }}
              </span>
            </label>
          </div>

          <!-- Botones -->
          <div class="form-actions">
            <button 
              type="submit" 
              class="btn btn-primary" 
              :disabled="loading"
            >
              <i class="bi" :class="loading ? 'bi-arrow-repeat spin' : (isEditing ? 'bi-check2-circle' : 'bi-person-plus')"></i>
              {{ loading ? 'Procesando...' : (isEditing ? 'Actualizar' : 'Crear') }}
            </button>
            <button 
              type="button" 
              class="btn btn-outline" 
              @click="cancelEdit"
              v-if="isEditing"
            >
              <i class="bi bi-x-circle"></i> Cancelar
            </button>
          </div>
        </form>
      </div>

      <!-- LISTA DE USUARIOS -->
      <div class="manage-card list-card">
        <div class="card-title">
          <i class="bi bi-list-ul"></i>
          <h3>Usuarios Registrados</h3>
          <span class="user-count">{{ usuarios.length }}</span>
        </div>
        <p class="card-sub">Gestiona los usuarios del sistema.</p>

        <div class="search-box">
          <i class="bi bi-search"></i>
          <input 
            type="text" 
            v-model="searchTerm" 
            placeholder="Buscar por nombre o email..."
            class="search-input"
          >
          <button v-if="searchTerm" class="clear-btn" @click="searchTerm = ''">
            <i class="bi bi-x-circle"></i>
          </button>
        </div>

        <div class="user-list">
          <div 
            class="user-item" 
            v-for="u in filteredUsuarios" 
            :key="u.id"
            :class="{ 'is-editing': editingId === u.id }"
          >
            <div class="user-avatar" :class="getAvatarClass(u.rol_nombre)">
              {{ getInitials(u) }}
            </div>
            
            <div class="user-info">
              <div class="user-name">
                {{ u.nombre }} {{ u.apellido || '' }}
                <span class="email-tag">{{ u.email }}</span>
              </div>
              <div class="user-meta">
                <span class="rol-badge" :class="getRolBadgeClass(u.rol_nombre)">
                  <i class="bi" :class="getRolIcon(u.rol_nombre)"></i>
                  {{ u.rol_nombre || 'Sin rol' }}
                </span>
                
                <span class="meta-item" v-if="u.sede_id">
                  <i class="bi bi-building"></i>
                  Sede: {{ getSedeNombre(u.sede_id) }}
                </span>
                
                <span class="status-badge" :class="u.activo !== false ? 'active' : 'inactive'">
                  <i class="bi" :class="u.activo !== false ? 'bi-circle-fill' : 'bi-circle'"></i>
                  {{ u.activo !== false ? 'Activo' : 'Inactivo' }}
                </span>

                <span class="status-badge" :class="u.verificado ? 'verified' : 'unverified'">
                  <i class="bi" :class="u.verificado ? 'bi-check-circle-fill' : 'bi-x-circle-fill'"></i>
                  {{ u.verificado ? 'Verificado' : 'No verificado' }}
                </span>
              </div>
            </div>

            <div class="user-actions">
              <!-- Ver sesiones activas -->
              <button class="action-btn" @click="abrirSesiones(u)" title="Ver sesiones activas">
                <i class="bi bi-laptop"></i>
              </button>
              
              <!-- Cerrar todas las sesiones -->
              <button class="action-btn" @click="cerrarTodasSesiones(u)" title="Cerrar todas las sesiones">
                <i class="bi bi-power"></i>
              </button>
              
              <!-- Enviar enlace de recuperación -->
              <button class="action-btn" @click="enviarRecuperacion(u)" title="Enviar enlace de recuperación">
                <i class="bi bi-envelope-paper"></i>
              </button>
              
              <button class="action-btn" @click="editUsuario(u)" title="Editar">
                <i class="bi bi-pencil"></i>
              </button>
              <button class="action-btn" @click="toggleStatus(u)" :title="u.activo !== false ? 'Desactivar' : 'Activar'">
                <i class="bi" :class="u.activo !== false ? 'bi-toggle-on' : 'bi-toggle-off'"></i>
              </button>
              <button class="action-btn" @click="resetPass(u)" title="Restablecer contraseña">
                <i class="bi bi-key"></i>
              </button>
              <button 
                v-if="u.id !== 1" 
                class="action-btn danger" 
                @click="eliminar(u)" 
                title="Eliminar"
              >
                <i class="bi bi-trash3"></i>
              </button>
            </div>
          </div>

          <div v-if="!filteredUsuarios.length" class="empty-state">
            <i class="bi bi-inbox"></i>
            <p>{{ searchTerm ? 'No se encontraron resultados.' : 'No hay usuarios registrados.' }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- MODAL DE CONFIRMACIÓN ELIMINACIÓN -->
    <div v-if="showDeleteModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal">
        <div class="modal-header">
          <h3><i class="bi bi-exclamation-triangle" style="color: #dc2626;"></i> Confirmar Eliminación</h3>
          <button class="modal-close" @click="closeModal">×</button>
        </div>
        <div class="modal-body">
          <p>
            ¿Está seguro que desea eliminar al usuario 
            <strong>"{{ usuarioAEliminar?.nombre }}"</strong>?
          </p>
          <div class="modal-warning">
            <p>⚠️ Esta acción eliminará permanentemente:</p>
            <ul>
              <li>El usuario y todos sus datos</li>
              <li>Los registros de actividad del usuario</li>
              <li>Todas las sesiones activas</li>
              <li>Tokens de recuperación</li>
            </ul>
            <p style="color: #dc2626; font-weight: bold;">
              Esta acción no se puede deshacer.
            </p>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" @click="closeModal">Cancelar</button>
          <button class="btn btn-danger" @click="confirmDelete" :disabled="deleting">
            <i class="bi" :class="deleting ? 'bi-arrow-repeat spin' : 'bi-trash3'"></i>
            {{ deleting ? 'Eliminando...' : 'Sí, Eliminar Usuario' }}
          </button>
        </div>
      </div>
    </div>

    <!-- MODAL DE SESIONES -->
    <div v-if="showSesionesModal" class="modal-overlay" @click.self="closeSesionesModal">
      <div class="modal modal-sessions">
        <div class="modal-header">
          <h3>
            <i class="bi bi-laptop" style="color: #2F6FED;"></i>
            Sesiones de {{ usuarioSeleccionado?.nombre }}
          </h3>
          <button class="modal-close" @click="closeSesionesModal">×</button>
        </div>
        <div class="modal-body">
          <!-- Estadísticas rápidas -->
          <div class="session-stats">
            <span class="stat">
              <i class="bi bi-circle-fill text-success"></i>
              Activas: {{ sesionesActivas }}
            </span>
            <span class="stat">
              <i class="bi bi-circle text-muted"></i>
              Inactivas: {{ sesionesInactivas }}
            </span>
            <span class="stat">
              <i class="bi bi-hourglass-split"></i>
              Total: {{ sesiones.length }}
            </span>
          </div>

          <!-- Lista de sesiones -->
          <div class="session-list" v-if="!cargandoSesiones">
            <div 
              v-for="sesion in sesiones" 
              :key="sesion.id" 
              class="session-item"
              :class="{ 'inactive': !sesion.activo }"
            >
              <div class="session-info">
                <div class="session-device">
                  <i class="bi" :class="getDeviceIcon(sesion.user_agent)"></i>
                  {{ getDeviceName(sesion.user_agent) || 'Dispositivo desconocido' }}
                </div>
                <div class="session-ip">
                  <i class="bi bi-globe2"></i>
                  IP: {{ sesion.ip_address || 'N/A' }}
                </div>
                <div class="session-times">
                  <span>
                    <i class="bi bi-clock"></i>
                    Inicio: {{ formatDate(sesion.fecha_inicio) }}
                  </span>
                  <span>
                    <i class="bi bi-hourglass-split"></i>
                    Expira: {{ formatDate(sesion.fecha_expiracion) }}
                  </span>
                </div>
              </div>
              
              <div class="session-status">
                <span class="badge" :class="sesion.activo ? 'badge-success' : 'badge-secondary'">
                  {{ sesion.activo ? 'Activa' : 'Inactiva' }}
                </span>
                <span v-if="sesion.activo && sesion.fecha_expiracion" class="badge badge-info">
                  <i class="bi bi-clock"></i>
                  {{ getMinutosRestantes(sesion.fecha_expiracion) }} min
                </span>
                <button 
                  v-if="sesion.activo" 
                  class="btn-danger-small" 
                  @click="cerrarSesion(sesion.id)"
                  title="Cerrar esta sesión"
                >
                  <i class="bi bi-x-circle"></i>
                </button>
              </div>
            </div>
          </div>

          <div v-else class="loading-state">
            <i class="bi bi-arrow-repeat spin"></i>
            <p>Cargando sesiones...</p>
          </div>

          <div v-if="!cargandoSesiones && !sesiones.length" class="empty-state">
            <i class="bi bi-inbox"></i>
            <p>No hay sesiones registradas para este usuario</p>
          </div>
        </div>

        <div class="modal-footer">
          <button class="btn btn-secondary" @click="closeSesionesModal">Cerrar</button>
          <button class="btn btn-danger" @click="cerrarTodasSesionesModal" :disabled="!sesionesActivas">
            <i class="bi bi-power"></i>
            Cerrar todas las sesiones ({{ sesionesActivas }})
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { 
  UsuariosAPI, 
  RolesAPI, 
  SedesAPI,
  SesionesAPI,
  TokensAPI
} from '@/services/api'
import Swal from 'sweetalert2'

// ===== STATE =====
const sedes = ref([])
const usuarios = ref([])
const roles = ref([])
const loading = ref(false)
const isEditing = ref(false)
const editingId = ref(null)
const showPassword = ref(false)
const searchTerm = ref('')
const showDeleteModal = ref(false)
const usuarioAEliminar = ref(null)
const deleting = ref(false)
const successMessage = ref('')
const errorMessage = ref('')

// ===== SESIONES STATE =====
const showSesionesModal = ref(false)
const usuarioSeleccionado = ref(null)
const sesiones = ref([])
const cargandoSesiones = ref(false)

// ===== FORM =====
const defaultForm = {
  nombre: '',
  apellido: '',
  email: '',
  password: '',
  rol_id: '',
  sede_id: '',
  telefono: '',
  cedula: '',
  direccion: '',
  avatar_url: '',
  verificado: true,
  activo: true,
  notificaciones_email: true,
  notificaciones_whatsapp: false
}

const form = reactive({ ...defaultForm })

// ===== ERRORS =====
const errors = reactive({
  nombre: '',
  email: '',
  password: '',
  rol_id: '',
  sede_id: ''
})

// ===== COMPUTED =====
const filteredUsuarios = computed(() => {
  if (!searchTerm.value) return usuarios.value
  const term = searchTerm.value.toLowerCase()
  return usuarios.value.filter(u => 
    u.nombre?.toLowerCase().includes(term) ||
    u.apellido?.toLowerCase().includes(term) ||
    u.email?.toLowerCase().includes(term)
  )
})

const sesionesActivas = computed(() => 
  sesiones.value.filter(s => s.activo === true).length
)

const sesionesInactivas = computed(() => 
  sesiones.value.filter(s => s.activo === false).length
)

// ===== HELPER FUNCTIONS =====
function getInitials(u) {
  const first = u.nombre?.charAt(0) || ''
  const last = u.apellido?.charAt(0) || ''
  return (first + last).toUpperCase() || 'U'
}

function getRolEmoji(nombre) {
  const map = {
    'Super Administrador': '👑',
    'Administrador': '🛡️',
    'Gerente': '📊',
    'Supervisor': '🔍',
    'Cajero': '💰',
    'Mesero': '🍽️',
    'Cocinero': '👨‍🍳',
    'Delivery': '🛵',
    'Cliente': '👤'
  }
  return map[nombre] || '👤'
}

function getRolIcon(rolNombre) {
  const map = {
    'Super Administrador': 'bi-shield-fill-check',
    'Administrador': 'bi-shield-check',
    'Gerente': 'bi-graph-up',
    'Supervisor': 'bi-eye',
    'Cajero': 'bi-cash-stack',
    'Mesero': 'bi-egg-fried',
    'Cocinero': 'bi-cup-hot',
    'Delivery': 'bi-truck',
    'Cliente': 'bi-person'
  }
  return map[rolNombre] || 'bi-person'
}

function getRolBadgeClass(rolNombre) {
  const map = {
    'Super Administrador': 'badge-super',
    'Administrador': 'badge-admin',
    'Gerente': 'badge-gerente',
    'Supervisor': 'badge-supervisor',
    'Cajero': 'badge-cajero',
    'Mesero': 'badge-mesero',
    'Cocinero': 'badge-cocinero',
    'Delivery': 'badge-delivery',
    'Cliente': 'badge-cliente'
  }
  return map[rolNombre] || 'badge-default'
}

function getAvatarClass(rolNombre) {
  const map = {
    'Super Administrador': 'avatar-super',
    'Administrador': 'avatar-admin',
    'Gerente': 'avatar-gerente',
    'Supervisor': 'avatar-supervisor',
    'Cajero': 'avatar-cajero',
    'Mesero': 'avatar-mesero',
    'Cocinero': 'avatar-cocinero',
    'Delivery': 'avatar-delivery',
    'Cliente': 'avatar-cliente'
  }
  return map[rolNombre] || 'avatar-default'
}

function getSedeNombre(id) {
  const sede = sedes.value.find(s => s.id === id)
  return sede ? sede.nombre : 'N/A'
}

function getMinutosRestantes(fechaExpiracion) {
  if (!fechaExpiracion) return 0
  const diff = new Date(fechaExpiracion) - new Date()
  return Math.max(0, Math.floor(diff / 60000))
}

function getDeviceIcon(userAgent) {
  if (!userAgent) return 'bi-device-desktop'
  const ua = userAgent.toLowerCase()
  if (ua.includes('mobile')) return 'bi-phone'
  if (ua.includes('tablet')) return 'bi-tablet'
  if (ua.includes('windows')) return 'bi-windows'
  if (ua.includes('mac')) return 'bi-apple'
  if (ua.includes('linux')) return 'bi-ubuntu'
  return 'bi-device-desktop'
}

function getDeviceName(userAgent) {
  if (!userAgent) return null
  const match = userAgent.match(/\(([^)]+)\)/)
  return match ? match[1] : null
}

function formatDate(date) {
  if (!date) return 'N/A'
  return new Date(date).toLocaleString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// ===== VALIDATIONS =====
const validations = {
  nombre: (val) => {
    if (!val?.trim()) return 'El nombre es obligatorio'
    if (val.trim().length < 2) return 'Mínimo 2 caracteres'
    return ''
  },
  email: (val) => {
    if (!val?.trim()) return 'El email es obligatorio'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) return 'Email inválido'
    return ''
  },
  password: (val) => {
    if (!isEditing.value && !val) return 'La contraseña es obligatoria'
    if (val && val.length < 6) return 'Mínimo 6 caracteres'
    return ''
  },
  rol_id: (val) => {
    if (!val) return 'Debes seleccionar un rol'
    return ''
  },
  sede_id: (val) => {
    if (!val) return 'Debes seleccionar una sede'
    return ''
  }
}

function validateField(field) {
  const validator = validations[field]
  if (validator) errors[field] = validator(form[field])
}

function validateAll() {
  let isValid = true
  for (const field of Object.keys(validations)) {
    validateField(field)
    if (errors[field]) isValid = false
  }
  return isValid
}

// ===== FORM ACTIONS =====
function resetForm() {
  Object.assign(form, { ...defaultForm })
  isEditing.value = false
  editingId.value = null
  for (const key of Object.keys(errors)) errors[key] = ''
  showPassword.value = false
}

function cancelEdit() {
  resetForm()
}

function editUsuario(u) {
  isEditing.value = true
  editingId.value = u.id
  
  Object.assign(form, {
    nombre: u.nombre || '',
    apellido: u.apellido || '',
    email: u.email || '',
    password: '',
    rol_id: u.rol_id || '',
    sede_id: u.sede_id || '',
    telefono: u.telefono || '',
    cedula: u.cedula || '',
    direccion: u.direccion || '',
    avatar_url: u.avatar_url || '',
    verificado: u.verificado !== false,
    activo: u.activo !== false,
    notificaciones_email: u.notificaciones_email !== false,
    notificaciones_whatsapp: u.notificaciones_whatsapp || false
  })
  
  for (const key of Object.keys(errors)) errors[key] = ''
}

// ===== LOAD =====
async function load() {
  loading.value = true
  try {
    const [sedesRes, usuariosRes, rolesRes] = await Promise.all([
      SedesAPI.list(),
      UsuariosAPI.list(),
      RolesAPI.list()
    ])
    sedes.value = sedesRes.data.data || []
    usuarios.value = usuariosRes.data.data || []
    roles.value = rolesRes.data.data || []
  } catch (error) {
    console.error('Error cargando datos:', error)
    errorMessage.value = 'Error al cargar los datos'
  } finally {
    loading.value = false
  }
}

async function refreshData() {
  await load()
  successMessage.value = '✅ Datos actualizados'
  setTimeout(() => { successMessage.value = '' }, 3000)
}

// ===== HANDLE SUBMIT =====
async function handleSubmit() {
  if (!validateAll()) {
    errorMessage.value = '⚠️ Corrige los campos marcados.'
    return
  }

  loading.value = true
  errorMessage.value = ''
  
  try {
    const payload = {
      nombre: form.nombre.trim(),
      apellido: form.apellido?.trim() || '',
      email: form.email.trim(),
      rol_id: form.rol_id,
      sede_id: form.sede_id,
      telefono: form.telefono?.trim() || '',
      cedula: form.cedula?.trim() || '',
      direccion: form.direccion?.trim() || '',
      avatar_url: form.avatar_url || '',
      verificado: form.verificado,
      activo: form.activo,
      notificaciones_email: form.notificaciones_email,
      notificaciones_whatsapp: form.notificaciones_whatsapp
    }

    if (form.password) payload.password = form.password

    if (isEditing.value && editingId.value) {
      await UsuariosAPI.update(editingId.value, payload)
      successMessage.value = '✅ Usuario actualizado correctamente.'
    } else {
      if (!form.password) {
        errorMessage.value = 'La contraseña es obligatoria.'
        loading.value = false
        return
      }
      await UsuariosAPI.create(payload)
      successMessage.value = '✅ Usuario creado correctamente.'
    }

    await load()
    resetForm()
    
    setTimeout(() => {
      successMessage.value = ''
    }, 5000)
  } catch (error) {
    console.error('❌ Error:', error)
    errorMessage.value = error.response?.data?.message || 'Error al procesar la solicitud'
  } finally {
    loading.value = false
  }
}

// ===== TOGGLE STATUS =====
async function toggleStatus(u) {
  try {
    await UsuariosAPI.toggleStatus(u.id)
    await load()
    successMessage.value = `✅ Usuario ${u.activo !== false ? 'desactivado' : 'activado'} correctamente.`
    setTimeout(() => { successMessage.value = '' }, 4000)
  } catch (e) {
    errorMessage.value = 'No se pudo cambiar el estado.'
  }
}

// ===== RESET PASSWORD =====
function resetPass(u) {
  Swal.fire({
    title: `Restablecer contraseña`,
    text: `Ingresa la nueva contraseña para ${u.nombre}`,
    input: 'password',
    inputPlaceholder: 'Nueva contraseña (mínimo 6 caracteres)',
    inputAttributes: {
      minlength: 6
    },
    showCancelButton: true,
    confirmButtonColor: '#E85D3A',
    confirmButtonText: 'Cambiar contraseña',
    cancelButtonText: 'Cancelar',
    preConfirm: (value) => {
      if (!value || value.length < 6) {
        Swal.showValidationMessage('La contraseña debe tener al menos 6 caracteres')
      }
      return value
    }
  }).then(async (result) => {
    if (result.isConfirmed && result.value) {
      try {
        await UsuariosAPI.update(u.id, { password: result.value })
        successMessage.value = '✅ Contraseña restablecida correctamente.'
        setTimeout(() => { successMessage.value = '' }, 4000)
      } catch (e) {
        errorMessage.value = 'No se pudo restablecer la contraseña.'
      }
    }
  })
}

// ===== SESIONES MODAL =====
async function abrirSesiones(u) {
  usuarioSeleccionado.value = u
  showSesionesModal.value = true
  await cargarSesionesUsuario(u.id)
}

function closeSesionesModal() {
  showSesionesModal.value = false
  usuarioSeleccionado.value = null
  sesiones.value = []
}

async function cargarSesionesUsuario(usuarioId) {
  cargandoSesiones.value = true
  try {
    const res = await SesionesAPI.getByUser(usuarioId)
    sesiones.value = res.data || []
  } catch (error) {
    console.error('Error cargando sesiones:', error)
    errorMessage.value = 'Error al cargar las sesiones'
  } finally {
    cargandoSesiones.value = false
  }
}

async function cerrarSesion(sesionId) {
  const confirm = await Swal.fire({
    title: '¿Cerrar esta sesión?',
    text: 'El usuario será desconectado de este dispositivo',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí, cerrar',
    cancelButtonText: 'Cancelar'
  })
  
  if (confirm.isConfirmed) {
    try {
      await SesionesAPI.remove(sesionId)
      await cargarSesionesUsuario(usuarioSeleccionado.value.id)
      successMessage.value = '✅ Sesión cerrada correctamente'
      setTimeout(() => { successMessage.value = '' }, 4000)
    } catch (error) {
      errorMessage.value = 'No se pudo cerrar la sesión'
    }
  }
}

async function cerrarTodasSesionesModal() {
  const confirm = await Swal.fire({
    title: `¿Cerrar todas las sesiones de ${usuarioSeleccionado.value?.nombre}?`,
    text: 'Esto desconectará al usuario de todos los dispositivos',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#dc2626',
    confirmButtonText: 'Sí, cerrar todas',
    cancelButtonText: 'Cancelar'
  })
  
  if (confirm.isConfirmed) {
    try {
      await SesionesAPI.logoutAll(usuarioSeleccionado.value.id)
      await cargarSesionesUsuario(usuarioSeleccionado.value.id)
      successMessage.value = '✅ Todas las sesiones cerradas correctamente'
      setTimeout(() => { successMessage.value = '' }, 4000)
    } catch (error) {
      errorMessage.value = 'No se pudieron cerrar las sesiones'
    }
  }
}

async function cerrarTodasSesiones(u) {
  const confirm = await Swal.fire({
    title: `¿Cerrar todas las sesiones de ${u.nombre}?`,
    text: 'Esto cerrará sesión en todos los dispositivos donde esté conectado',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#dc2626',
    confirmButtonText: 'Sí, cerrar todas',
    cancelButtonText: 'Cancelar'
  })
  
  if (confirm.isConfirmed) {
    try {
      await SesionesAPI.logoutAll(u.id)
      successMessage.value = '✅ Todas las sesiones cerradas correctamente'
      setTimeout(() => { successMessage.value = '' }, 4000)
    } catch (error) {
      errorMessage.value = 'Error al cerrar las sesiones'
    }
  }
}

// ===== ENVIAR RECUPERACIÓN =====
async function enviarRecuperacion(u) {
  try {
    await TokensAPI.generate({
      usuario_id: u.id,
      tipo: 'password_reset',
      fecha_expiracion: new Date(Date.now() + 3600000).toISOString()
    })
    successMessage.value = `✅ Enlace de recuperación enviado a ${u.email}`
    setTimeout(() => { successMessage.value = '' }, 4000)
  } catch (error) {
    errorMessage.value = 'Error al enviar el enlace de recuperación'
    console.error(error)
  }
}

// ===== DELETE =====
function openDeleteModal(u) {
  usuarioAEliminar.value = u
  showDeleteModal.value = true
  errorMessage.value = ''
}

function closeModal() {
  showDeleteModal.value = false
  usuarioAEliminar.value = null
  deleting.value = false
}

async function confirmDelete() {
  if (!usuarioAEliminar.value) return
  
  deleting.value = true
  errorMessage.value = ''
  
  try {
    await UsuariosAPI.remove(usuarioAEliminar.value.id)
    closeModal()
    await load()
    if (isEditing.value && editingId.value === usuarioAEliminar.value.id) resetForm()
    successMessage.value = '✅ Usuario eliminado correctamente.'
    setTimeout(() => { successMessage.value = '' }, 4000)
  } catch (e) {
    closeModal()
    errorMessage.value = e.response?.data?.message || 'No se pudo eliminar el usuario.'
  } finally {
    deleting.value = false
    usuarioAEliminar.value = null
  }
}

function eliminar(u) {
  openDeleteModal(u)
}

// ===== ON MOUNT =====
onMounted(load)
</script>

<style scoped>
.users-management {
  padding: 24px;
  max-width: 1400px;
  margin: 0 auto;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding: 20px 24px;
  background: #ffffff;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  flex-wrap: wrap;
  gap: 12px;
}

.panel-title {
  font-size: 22px;
  font-weight: 700;
  color: #111827;
  margin: 0;
}

.panel-title i {
  color: #2F6FED;
  margin-right: 10px;
}

.panel-sub {
  color: #6b7280;
  font-size: 14px;
  margin: 2px 0 0;
}

.role-count {
  font-weight: 700;
  color: #2F6FED;
  background: #e8eeff;
  padding: 0 8px;
  border-radius: 10px;
}

.header-stats {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  align-items: center;
}

.stat-badge {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 4px 12px;
  background: #f3f4f6;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 600;
  color: #4b5563;
}

.stat-badge i {
  font-size: 14px;
}

.stat-badge.success i {
  color: #22c55e;
}

.stat-badge.roles-stats i {
  color: #2F6FED;
}

.btn-sm {
  padding: 4px 10px;
  font-size: 13px;
  border-radius: 6px;
}

.btn-outline {
  background: transparent;
  color: #4b5563;
  border: 1.5px solid #d1d5db;
}

.btn-outline:hover {
  background: #f9fafb;
  border-color: #9ca3af;
}

.alert {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  padding: 16px 20px;
  border-radius: 12px;
  margin-bottom: 20px;
  border: 1px solid transparent;
  animation: slideDown 0.3s ease;
}

.alert-success {
  background: #ecfdf5;
  border-color: #6ee7b7;
  color: #065f46;
}

.alert-danger {
  background: #fef2f2;
  border-color: #fca5a5;
  color: #991b1b;
}

.alert-icon {
  font-size: 28px;
  line-height: 1;
  flex-shrink: 0;
}

.alert-content {
  flex: 1;
}

.alert-content h4 {
  margin: 0 0 6px 0;
  font-size: 16px;
  font-weight: 600;
}

.alert-content p {
  margin: 0 0 12px 0;
  font-size: 14px;
  line-height: 1.5;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.2s ease;
}

.modal {
  background: #ffffff;
  border-radius: 16px;
  max-width: 500px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  animation: slideIn 0.3s ease;
}

.modal-sessions {
  max-width: 650px;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px;
  border-bottom: 1px solid #e5e7eb;
}

.modal-header h3 {
  margin: 0;
  font-size: 18px;
  color: #111827;
  display: flex;
  align-items: center;
  gap: 8px;
}

.modal-close {
  background: none;
  border: none;
  font-size: 28px;
  cursor: pointer;
  color: #6b7280;
  padding: 0 8px;
  line-height: 1;
}

.modal-body {
  padding: 24px;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 16px 24px;
  border-top: 1px solid #e5e7eb;
}

.modal-warning {
  background: #fef3c7;
  border: 1px solid #fcd34d;
  border-radius: 8px;
  padding: 16px;
  margin-top: 12px;
}

.modal-warning p {
  margin: 0 0 8px 0;
  color: #92400e;
}

.modal-warning ul {
  margin: 0;
  padding-left: 20px;
  color: #92400e;
  font-size: 14px;
}

.manage-grid {
  display: grid;
  grid-template-columns: 1fr 1.3fr;
  gap: 24px;
}

@media (max-width: 1024px) {
  .manage-grid {
    grid-template-columns: 1fr;
  }
}

.manage-card {
  background: #ffffff;
  border-radius: 12px;
  padding: 24px;
  border: 1px solid #e5e7eb;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
}

.card-title {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 2px;
}

.card-title i {
  font-size: 20px;
  color: #2F6FED;
}

.card-title h3 {
  font-size: 17px;
  font-weight: 600;
  color: #111827;
  margin: 0;
}

.user-count {
  margin-left: auto;
  background: #e8eeff;
  color: #2F6FED;
  font-weight: 700;
  font-size: 13px;
  padding: 0 12px;
  border-radius: 12px;
}

.card-sub {
  color: #6b7280;
  font-size: 13px;
  margin: 0 0 20px 0;
}

.field-group {
  margin-bottom: 16px;
}

.field-group label {
  display: flex;
  align-items: center;
  gap: 5px;
  font-weight: 500;
  font-size: 13px;
  color: #374151;
  margin-bottom: 4px;
}

.field-group label i {
  color: #9ca3af;
  font-size: 14px;
}

.required {
  color: #ef4444;
  font-weight: 700;
}

.field-group input,
.field-group select {
  width: 100%;
  padding: 9px 14px;
  border: 1.5px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
  background: #ffffff;
  transition: all 0.2s;
  color: #111827;
  font-family: inherit;
}

.field-group input:focus,
.field-group select:focus {
  outline: none;
  border-color: #2F6FED;
  box-shadow: 0 0 0 3px rgba(47, 111, 237, 0.08);
}

.field-group input.error,
.field-group select.error {
  border-color: #ef4444;
  background: #fef2f2;
}

.error-msg {
  color: #ef4444;
  font-size: 12px;
  display: flex;
  align-items: center;
  gap: 4px;
  margin-top: 3px;
}

.help-text {
  color: #9ca3af;
  font-size: 12px;
  display: flex;
  align-items: center;
  gap: 4px;
  margin-top: 3px;
  font-style: italic;
}

.password-wrapper {
  position: relative;
}

.password-wrapper input {
  padding-right: 44px;
}

.toggle-pwd {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #9ca3af;
  cursor: pointer;
  font-size: 18px;
  padding: 4px;
}

.toggle-pwd:hover {
  color: #2F6FED;
}

.checkbox-group {
  margin-top: 2px;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  font-weight: 400;
  font-size: 14px;
  color: #374151;
}

.checkbox-label input[type="checkbox"] {
  width: 18px;
  height: 18px;
  margin: 0;
  cursor: pointer;
  accent-color: #2F6FED;
}

.toggle-text {
  display: flex;
  align-items: center;
  gap: 6px;
}

.text-success { color: #22c55e; }
.text-muted { color: #9ca3af; }

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 9px 22px;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
  font-family: inherit;
}

.btn-primary {
  background: #2F6FED;
  color: #ffffff;
}

.btn-primary:hover:not(:disabled) {
  background: #1a5adf;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(47, 111, 237, 0.3);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-danger {
  background: #dc2626;
  color: #ffffff;
}

.btn-danger:hover:not(:disabled) {
  background: #b91c1c;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(220, 38, 38, 0.3);
}

.btn-secondary {
  background: #e5e7eb;
  color: #374151;
}

.btn-secondary:hover {
  background: #d1d5db;
}

.spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.form-actions {
  display: flex;
  gap: 12px;
  margin-top: 20px;
  flex-wrap: wrap;
}

.search-box {
  position: relative;
  margin: 12px 0 14px;
}

.search-box i {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #9ca3af;
}

.search-input {
  width: 100%;
  padding: 9px 40px 9px 38px;
  border: 1.5px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
  background: #ffffff;
  transition: all 0.2s;
}

.search-input:focus {
  outline: none;
  border-color: #2F6FED;
  box-shadow: 0 0 0 3px rgba(47, 111, 237, 0.08);
}

.clear-btn {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #9ca3af;
  cursor: pointer;
  font-size: 18px;
  padding: 4px;
}

.user-list {
  max-height: 480px;
  overflow-y: auto;
  margin-top: 2px;
}

.user-list::-webkit-scrollbar {
  width: 4px;
}

.user-list::-webkit-scrollbar-track {
  background: #f3f4f6;
  border-radius: 10px;
}

.user-list::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 10px;
}

.user-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  border-bottom: 1px solid #f3f4f6;
  transition: background 0.15s;
}

.user-item:hover {
  background: #f9fafb;
  border-radius: 8px;
}

.user-item.is-editing {
  background: #e8eeff;
  border-radius: 8px;
}

.user-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 13px;
  flex-shrink: 0;
  color: #ffffff;
}

.avatar-super { background: #7c3aed; }
.avatar-admin { background: #2563eb; }
.avatar-gerente { background: #0d9488; }
.avatar-supervisor { background: #059669; }
.avatar-cajero { background: #d97706; }
.avatar-mesero { background: #E85D3A; }
.avatar-cocinero { background: #b91c1c; }
.avatar-delivery { background: #2563eb; }
.avatar-cliente { background: #9ca3af; }
.avatar-default { background: #9ca3af; }

.user-info {
  flex: 1;
  min-width: 0;
}

.user-name {
  font-weight: 600;
  color: #111827;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
}

.email-tag {
  font-weight: 400;
  color: #9ca3af;
  font-size: 12px;
}

.user-meta {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-top: 2px;
  align-items: center;
}

.meta-item {
  font-size: 12px;
  color: #6b7280;
  display: flex;
  align-items: center;
  gap: 3px;
}

.meta-item i {
  font-size: 11px;
}

.rol-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 10px;
  font-weight: 700;
  padding: 1px 10px;
  border-radius: 12px;
  text-transform: uppercase;
  letter-spacing: 0.3px;
}

.badge-super { background: #ede9fe; color: #7c3aed; }
.badge-admin { background: #dbeafe; color: #2563eb; }
.badge-gerente { background: #ccfbf1; color: #0d9488; }
.badge-supervisor { background: #d1fae5; color: #059669; }
.badge-cajero { background: #fef3c7; color: #d97706; }
.badge-mesero { background: #fce4ec; color: #E85D3A; }
.badge-cocinero { background: #fecaca; color: #b91c1c; }
.badge-delivery { background: #dbeafe; color: #2563eb; }
.badge-cliente { background: #f3f4f6; color: #6b7280; }
.badge-default { background: #f3f4f6; color: #6b7280; }

.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  font-weight: 600;
}

.status-badge i {
  font-size: 7px;
}

.status-badge.active { color: #22c55e; }
.status-badge.inactive { color: #9ca3af; }
.status-badge.verified { color: #22c55e; }
.status-badge.unverified { color: #9ca3af; }

.user-actions {
  display: flex;
  gap: 2px;
  flex-shrink: 0;
}

.action-btn {
  width: 30px;
  height: 30px;
  border: none;
  border-radius: 6px;
  background: transparent;
  color: #9ca3af;
  cursor: pointer;
  transition: all 0.15s;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 15px;
}

.action-btn:hover {
  background: #f3f4f6;
  color: #2F6FED;
}

.action-btn.danger:hover {
  background: #fef2f2;
  color: #ef4444;
}

.session-stats {
  display: flex;
  gap: 20px;
  padding: 12px;
  background: #f9fafb;
  border-radius: 8px;
  margin-bottom: 16px;
}

.session-stats .stat {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  font-weight: 500;
  color: #374151;
}

.session-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.session-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: #f9fafb;
  border-radius: 8px;
  border-left: 4px solid #22c55e;
  transition: all 0.2s;
}

.session-item.inactive {
  border-left-color: #9ca3af;
  opacity: 0.7;
}

.session-item:hover {
  background: #f3f4f6;
}

.session-info {
  flex: 1;
}

.session-device {
  font-weight: 600;
  color: #111827;
  margin-bottom: 4px;
}

.session-device i {
  color: #2F6FED;
}

.session-ip {
  font-size: 13px;
  color: #6b7280;
}

.session-times {
  font-size: 12px;
  color: #9ca3af;
  display: flex;
  gap: 16px;
  margin-top: 4px;
}

.session-status {
  display: flex;
  align-items: center;
  gap: 8px;
}

.badge {
  padding: 2px 10px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
}

.badge-success {
  background: #dcfce7;
  color: #16a34a;
}

.badge-secondary {
  background: #f3f4f6;
  color: #6b7280;
}

.badge-info {
  background: #dbeafe;
  color: #2563eb;
}

.btn-danger-small {
  background: none;
  border: none;
  color: #dc2626;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 18px;
  transition: all 0.2s;
}

.btn-danger-small:hover {
  background: #fef2f2;
}

.loading-state {
  text-align: center;
  padding: 40px 20px;
  color: #9ca3af;
}

.loading-state i {
  font-size: 36px;
  display: block;
  margin-bottom: 12px;
}

.empty-state {
  text-align: center;
  padding: 40px 20px;
  color: #9ca3af;
}

.empty-state i {
  font-size: 36px;
  color: #d1d5db;
}

.empty-state p {
  margin: 8px 0 0;
  font-size: 14px;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideIn {
  from {
    transform: translateY(-30px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes slideDown {
  from {
    transform: translateY(-10px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@media (max-width: 768px) {
  .users-management {
    padding: 12px;
  }
  
  .panel-header {
    flex-direction: column;
    align-items: stretch;
    padding: 16px;
  }
  
  .panel-title {
    font-size: 18px;
  }
  
  .header-stats {
    justify-content: flex-start;
  }
  
  .manage-card {
    padding: 16px;
  }
  
  .card-title h3 {
    font-size: 15px;
  }
  
  .user-item {
    flex-wrap: wrap;
    padding: 10px;
  }
  
  .user-actions {
    margin-left: auto;
  }
  
  .form-actions {
    flex-direction: column;
  }
  
  .form-actions .btn {
    width: 100%;
    justify-content: center;
  }

  .modal {
    width: 95%;
  }

  .modal-sessions {
    max-width: 95%;
  }

  .session-item {
    flex-direction: column;
    align-items: stretch;
    gap: 8px;
  }

  .session-status {
    justify-content: flex-end;
  }
}

@media (max-width: 480px) {
  .user-meta {
    flex-direction: column;
    gap: 3px;
    align-items: flex-start;
  }
  
  .user-actions {
    width: 100%;
    justify-content: flex-end;
    padding-top: 4px;
    border-top: 1px solid #f3f4f6;
  }
  
  .stat-badge {
    font-size: 12px;
    padding: 3px 10px;
  }
  
  .rol-badge {
    font-size: 9px;
    padding: 0 8px;
  }
  
  .user-name {
    font-size: 13px;
  }

  .session-stats {
    flex-direction: column;
    gap: 4px;
  }

  .session-times {
    flex-direction: column;
    gap: 2px;
  }
}
</style>