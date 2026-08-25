<!-- src/views/AdminRolesView.vue -->
<template>
  <div class="admin-roles">
    <!-- Header -->
    <div class="page-header">
      <div class="header-left">
        <div class="header-icon">
          <i class="bi bi-shield-lock-fill"></i>
        </div>
        <div>
          <h1 class="page-title">Gestión de Roles</h1>
          <p class="page-subtitle">Administra los roles y permisos de los usuarios del sistema</p>
        </div>
      </div>
      <button class="btn btn-primary" @click="openCreateModal">
        <i class="bi bi-plus-lg"></i>
        Nuevo Rol
      </button>
    </div>

    <!-- Stats -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon blue">
          <i class="bi bi-people"></i>
        </div>
        <div class="stat-content">
          <span class="stat-value">{{ roles.length }}</span>
          <span class="stat-label">Total Roles</span>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon green">
          <i class="bi bi-check-circle"></i>
        </div>
        <div class="stat-content">
          <span class="stat-value">{{ activeRoles }}</span>
          <span class="stat-label">Roles Activos</span>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon orange">
          <i class="bi bi-stars"></i>
        </div>
        <div class="stat-content">
          <span class="stat-value">{{ highestLevel }}</span>
          <span class="stat-label">Nivel Máximo</span>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon purple">
          <i class="bi bi-clock-history"></i>
        </div>
        <div class="stat-content">
          <span class="stat-value">{{ lastUpdated }}</span>
          <span class="stat-label">Última Actualización</span>
        </div>
      </div>
    </div>

    <!-- Tabla -->
    <div class="table-container">
      <div class="table-header">
        <div class="table-header-left">
          <span class="table-title">Lista de Roles</span>
          <span class="table-badge">{{ roles.length }} roles</span>
        </div>
        <div class="table-search">
          <i class="bi bi-search"></i>
          <input 
            type="text" 
            v-model="searchTerm" 
            placeholder="Buscar rol..."
            class="search-input"
          />
        </div>
      </div>

      <div class="table-wrapper">
        <table class="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Descripción</th>
              <th>Nivel</th>
              <th class="text-center">Usuarios</th>
              <th class="text-center">Permisos</th>
              <th class="text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="loading">
              <td colspan="7" class="text-center loading-cell">
                <div class="spinner"></div>
                <span>Cargando roles...</span>
              </td>
            </tr>
            <tr v-else-if="filteredRoles.length === 0">
              <td colspan="7" class="text-center empty-cell">
                <i class="bi bi-inbox"></i>
                <p>No hay roles registrados</p>
                <span class="empty-sub">Haz clic en "Nuevo Rol" para crear uno</span>
              </td>
            </tr>
            <tr v-for="rol in filteredRoles" :key="rol.id">
              <td>
                <span class="id-badge">#{{ rol.id }}</span>
              </td>
              <td>
                <div class="role-name">
                  <span class="role-dot" :style="{ background: getRoleColor(rol.nombre) }"></span>
                  <strong>{{ rol.nombre }}</strong>
                </div>
              </td>
              <td>
                <span class="role-description">{{ rol.descripcion || 'Sin descripción' }}</span>
              </td>
              <td>
                <span class="level-badge" :class="getLevelClass(rol.nivel)">
                  Nivel {{ rol.nivel }}
                </span>
              </td>
              <td class="text-center">
                <span class="user-count">{{ rol.total_usuarios || 0 }}</span>
              </td>
              <td class="text-center">
                <span class="permission-count">{{ rol.total_permisos || 0 }}</span>
              </td>
              <td>
                <div class="action-buttons">
                  <button class="btn btn-edit" @click="editRol(rol)" title="Editar rol">
                    <i class="bi bi-pencil"></i>
                  </button>
                  <button class="btn btn-permissions" @click="openPermissionsModal(rol)" title="Gestionar permisos">
                    <i class="bi bi-key"></i>
                  </button>
                  <button class="btn btn-delete" @click="deleteRol(rol.id)" title="Eliminar rol">
                    <i class="bi bi-trash3"></i>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal de Crear/Editar Rol -->
    <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal">
        <div class="modal-header">
          <h3>
            <i class="bi" :class="isEditing ? 'bi-pencil-square' : 'bi-shield-plus'"></i>
            {{ isEditing ? 'Editar Rol' : 'Nuevo Rol' }}
          </h3>
          <button class="modal-close" @click="closeModal">✕</button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label>Nombre del Rol <span class="required">*</span></label>
            <input 
              v-model="form.nombre" 
              type="text" 
              class="form-input"
              :class="{ 'error': errors.nombre }"
              placeholder="Ej. Super Administrador"
              @blur="validateField('nombre')"
            />
            <span class="error-msg" v-if="errors.nombre">
              <i class="bi bi-exclamation-circle"></i> {{ errors.nombre }}
            </span>
          </div>
          <div class="form-group">
            <label>Descripción</label>
            <textarea 
              v-model="form.descripcion" 
              class="form-input"
              :class="{ 'error': errors.descripcion }"
              placeholder="Descripción del rol..."
              rows="3"
              @blur="validateField('descripcion')"
            ></textarea>
            <span class="error-msg" v-if="errors.descripcion">
              <i class="bi bi-exclamation-circle"></i> {{ errors.descripcion }}
            </span>
          </div>
          <div class="form-group">
            <label>Nivel de Permisos <span class="required">*</span></label>
            <input 
              v-model.number="form.nivel" 
              type="number" 
              class="form-input"
              :class="{ 'error': errors.nivel }"
              placeholder="10"
              min="0"
              max="100"
              @blur="validateField('nivel')"
            />
            <span class="field-help">0 = sin permisos, 100 = máximo acceso</span>
            <span class="error-msg" v-if="errors.nivel">
              <i class="bi bi-exclamation-circle"></i> {{ errors.nivel }}
            </span>
          </div>
          <div class="form-group switch-group">
            <label>Estado</label>
            <div class="switch-container">
              <label class="switch">
                <input type="checkbox" v-model="form.activo" />
                <span class="slider"></span>
              </label>
              <span class="switch-label">
                <i :class="form.activo ? 'bi bi-check-circle text-success' : 'bi bi-x-circle text-danger'"></i>
                {{ form.activo ? 'Activo' : 'Inactivo' }}
              </span>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" @click="closeModal">Cancelar</button>
          <button class="btn btn-primary" @click="saveRol" :disabled="saving">
            <i class="bi" :class="saving ? 'bi-arrow-repeat spin' : (isEditing ? 'bi-check2' : 'bi-plus-lg')"></i>
            {{ saving ? 'Guardando...' : (isEditing ? 'Actualizar' : 'Crear') }}
          </button>
        </div>
      </div>
    </div>

    <!-- Modal de Permisos -->
    <div v-if="showPermissionsModal" class="modal-overlay" @click.self="closePermissionsModal">
      <div class="modal modal-lg">
        <div class="modal-header">
          <h3>
            <i class="bi bi-key-fill"></i>
            Gestionar Permisos - <span class="role-name-modal">{{ selectedRol?.nombre }}</span>
          </h3>
          <button class="modal-close" @click="closePermissionsModal">✕</button>
        </div>
        <div class="modal-body">
          <div class="permissions-grid">
            <div class="permission-group" v-for="group in groupedPermissions" :key="group.modulo">
              <div class="permission-group-header">
                <i class="bi bi-folder"></i>
                <span>{{ group.modulo || 'Sin módulo' }}</span>
                <span class="permission-count">{{ group.permisos.length }}</span>
              </div>
              <div class="permission-list">
                <label class="permission-item" v-for="perm in group.permisos" :key="perm.id">
                  <input 
                    type="checkbox" 
                    :value="perm.id" 
                    v-model="selectedPermissions"
                    class="permission-checkbox"
                  />
                  <span class="permission-name">{{ perm.nombre }}</span>
                  <span class="permission-desc">{{ perm.descripcion }}</span>
                </label>
              </div>
            </div>
            <div v-if="groupedPermissions.length === 0" class="empty-permissions">
              <i class="bi bi-shield-slash"></i>
              <p>No hay permisos disponibles</p>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <div class="permissions-actions">
            <button class="btn btn-secondary" @click="selectAllPermissions">Seleccionar Todos</button>
            <button class="btn btn-secondary" @click="deselectAllPermissions">Deseleccionar Todos</button>
          </div>
          <div class="permissions-actions-right">
            <button class="btn btn-secondary" @click="closePermissionsModal">Cancelar</button>
            <button class="btn btn-primary" @click="savePermissions" :disabled="savingPermissions">
              <i class="bi" :class="savingPermissions ? 'bi-arrow-repeat spin' : 'bi-check2'"></i>
              {{ savingPermissions ? 'Guardando...' : 'Guardar Permisos' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { RolesAPI, PermisosAPI } from '@/services/api'
import Swal from 'sweetalert2'

// ============================================
// ESTADO
// ============================================
const roles = ref([])
const permisos = ref([])
const loading = ref(false)
const saving = ref(false)
const savingPermissions = ref(false)
const searchTerm = ref('')
const showModal = ref(false)
const showPermissionsModal = ref(false)
const isEditing = ref(false)
const editingId = ref(null)
const selectedRol = ref(null)
const selectedPermissions = ref([])

const form = ref({
  nombre: '',
  descripcion: '',
  nivel: 10,
  activo: true
})

const errors = reactive({
  nombre: '',
  descripcion: '',
  nivel: ''
})

// ============================================
// COMPUTED
// ============================================
const filteredRoles = computed(() => {
  if (!searchTerm.value) return roles.value
  const term = searchTerm.value.toLowerCase()
  return roles.value.filter(r => 
    r.nombre.toLowerCase().includes(term) ||
    (r.descripcion && r.descripcion.toLowerCase().includes(term))
  )
})

const activeRoles = computed(() => {
  return roles.value.filter(r => r.activo !== false).length
})

const highestLevel = computed(() => {
  if (roles.value.length === 0) return 0
  return Math.max(...roles.value.map(r => r.nivel || 0))
})

const lastUpdated = computed(() => {
  if (roles.value.length === 0) return 'Nunca'
  const dates = roles.value.map(r => r.updated_at || r.fecha_creacion).filter(Boolean)
  if (dates.length === 0) return 'Nunca'
  const latest = new Date(Math.max(...dates.map(d => new Date(d).getTime())))
  return latest.toLocaleDateString('es-VE')
})

const groupedPermissions = computed(() => {
  const groups = {}
  permisos.value.forEach(p => {
    const modulo = p.modulo || 'Otros'
    if (!groups[modulo]) groups[modulo] = []
    groups[modulo].push(p)
  })
  return Object.keys(groups).map(modulo => ({
    modulo,
    permisos: groups[modulo]
  }))
})

// ============================================
// VALIDACIÓN
// ============================================
const validations = {
  nombre: (val) => {
    if (!val?.trim()) return 'El nombre del rol es obligatorio'
    if (val.trim().length < 3) return 'El nombre debe tener al menos 3 caracteres'
    return ''
  },
  descripcion: (val) => {
    if (val && val.trim().length < 5) return 'La descripción debe tener al menos 5 caracteres'
    return ''
  },
  nivel: (val) => {
    if (val === undefined || val === null || val === '') return 'El nivel es obligatorio'
    if (val < 0) return 'El nivel debe ser 0 o mayor'
    if (val > 100) return 'El nivel no puede ser mayor a 100'
    return ''
  }
}

function validateField(field) {
  const validator = validations[field]
  if (validator) errors[field] = validator(form.value[field])
}

function validateAll() {
  let isValid = true
  for (const field of Object.keys(validations)) {
    validateField(field)
    if (errors[field]) isValid = false
  }
  return isValid
}

// ============================================
// MÉTODOS - Roles
// ============================================
function getRoleColor(name) {
  const colors = {
    'Super Administrador': '#8B5CF6',
    'Administrador': '#2F6FED',
    'Gerente': '#F0A23D',
    'Supervisor': '#2FA868',
    'Cajero': '#E0524F',
    'Mesero': '#6B7280',
    'Cocinero': '#E85D3A',
    'Delivery': '#3B82F6',
    'Cliente': '#9CA3AF'
  }
  return colors[name] || '#6B7280'
}

function getLevelClass(level) {
  if (level >= 8) return 'level-high'
  if (level >= 5) return 'level-medium'
  return 'level-low'
}

async function loadRoles() {
  try {
    loading.value = true
    const response = await RolesAPI.list()
    if (response.data.success) {
      roles.value = response.data.data || []
    }
  } catch (error) {
    console.error('Error cargando roles:', error)
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'No se pudieron cargar los roles'
    })
  } finally {
    loading.value = false
  }
}

async function loadPermisos() {
  try {
    const response = await PermisosAPI.list()
    if (response.data.success) {
      permisos.value = response.data.data || []
    }
  } catch (error) {
    console.error('Error cargando permisos:', error)
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'No se pudieron cargar los permisos'
    })
  }
}

function openCreateModal() {
  isEditing.value = false
  editingId.value = null
  form.value = { 
    nombre: '', 
    descripcion: '', 
    nivel: 10,
    activo: true
  }
  for (const key of Object.keys(errors)) errors[key] = ''
  showModal.value = true
}

function editRol(rol) {
  isEditing.value = true
  editingId.value = rol.id
  form.value = {
    nombre: rol.nombre,
    descripcion: rol.descripcion || '',
    nivel: rol.nivel || 10,
    activo: rol.activo !== false
  }
  for (const key of Object.keys(errors)) errors[key] = ''
  showModal.value = true
}

function closeModal() {
  showModal.value = false
  form.value = { 
    nombre: '', 
    descripcion: '', 
    nivel: 10,
    activo: true
  }
}

async function saveRol() {
  if (!validateAll()) {
    Swal.fire({
      icon: 'warning',
      title: 'Corrige los errores',
      text: 'Por favor, completa todos los campos correctamente.',
      confirmButtonColor: '#E85D3A'
    })
    return
  }

  try {
    saving.value = true

    const payload = {
      nombre: form.value.nombre.trim(),
      descripcion: form.value.descripcion.trim() || null,
      nivel: form.value.nivel || 10,
      activo: form.value.activo
    }

    let response
    if (isEditing.value) {
      response = await RolesAPI.update(editingId.value, payload)
    } else {
      response = await RolesAPI.create(payload)
    }

    if (response.data.success) {
      Swal.fire({
        icon: 'success',
        title: isEditing.value ? 'Rol actualizado' : 'Rol creado',
        timer: 1500,
        showConfirmButton: false
      })
      closeModal()
      await loadRoles()
    }
  } catch (error) {
    console.error('Error guardando rol:', error)
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: error.response?.data?.message || 'Error al guardar el rol',
      confirmButtonColor: '#E85D3A'
    })
  } finally {
    saving.value = false
  }
}

async function deleteRol(id) {
  const result = await Swal.fire({
    title: '¿Eliminar este rol?',
    text: 'Esta acción no se puede deshacer. Los usuarios con este rol perderán sus permisos.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#dc3545',
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar'
  })

  if (result.isConfirmed) {
    try {
      await RolesAPI.remove(id)
      Swal.fire({
        icon: 'success',
        title: 'Rol eliminado',
        timer: 1500,
        showConfirmButton: false
      })
      await loadRoles()
    } catch (error) {
      console.error('Error eliminando rol:', error)
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.message || 'Error al eliminar el rol',
        confirmButtonColor: '#E85D3A'
      })
    }
  }
}

// ============================================
// MÉTODOS - Permisos
// ============================================
function openPermissionsModal(rol) {
  selectedRol.value = rol
  selectedPermissions.value = rol.permisos_ids || []
  showPermissionsModal.value = true
}

function closePermissionsModal() {
  showPermissionsModal.value = false
  selectedRol.value = null
  selectedPermissions.value = []
}

function selectAllPermissions() {
  const allIds = permisos.value.map(p => p.id)
  selectedPermissions.value = allIds
}

function deselectAllPermissions() {
  selectedPermissions.value = []
}

async function savePermissions() {
  if (!selectedRol.value) return

  try {
    savingPermissions.value = true

    // ⭐ Usar la API de Roles para asignar permisos
    const response = await RolesAPI.assignPermisos(selectedRol.value.id, selectedPermissions.value)

    if (response.data.success) {
      Swal.fire({
        icon: 'success',
        title: 'Permisos actualizados',
        timer: 1500,
        showConfirmButton: false
      })
      closePermissionsModal()
      await loadRoles()
    }
  } catch (error) {
    console.error('Error guardando permisos:', error)
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: error.response?.data?.message || 'Error al guardar los permisos',
      confirmButtonColor: '#E85D3A'
    })
  } finally {
    savingPermissions.value = false
  }
}

// ============================================
// CICLO DE VIDA
// ============================================
onMounted(() => {
  loadRoles()
  loadPermisos()
})
</script>

<style scoped>
.admin-roles {
  padding: 24px 32px;
  max-width: 1320px;
  margin: 0 auto;
}

/* ═══════════════════════════════════════════
   HEADER
   ═══════════════════════════════════════════ */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 28px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 14px;
}

.header-icon {
  width: 48px;
  height: 48px;
  background: #EAF0FD;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #2F6FED;
  font-size: 24px;
}

.page-title {
  font-size: 24px;
  font-weight: 700;
  color: #1a1a2e;
  margin: 0;
  line-height: 1.2;
}

.page-subtitle {
  font-size: 14px;
  color: #6B7280;
  margin: 2px 0 0 0;
}

/* ═══════════════════════════════════════════
   STATS
   ═══════════════════════════════════════════ */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 28px;
}

.stat-card {
  background: #fff;
  border: 1px solid #EAE5DA;
  border-radius: 12px;
  padding: 16px 20px;
  display: flex;
  align-items: center;
  gap: 14px;
  transition: box-shadow 0.2s ease;
}

.stat-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
}

.stat-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  font-size: 20px;
}

.stat-icon.blue { background: #EAF0FD; color: #2F6FED; }
.stat-icon.green { background: #E8F6EE; color: #2FA868; }
.stat-icon.orange { background: #FCF1DF; color: #F0A23D; }
.stat-icon.purple { background: #F1EBFE; color: #8B5CF6; }

.stat-content {
  display: flex;
  flex-direction: column;
}

.stat-value {
  font-size: 22px;
  font-weight: 700;
  color: #1a1a2e;
  line-height: 1.2;
}

.stat-label {
  font-size: 12px;
  color: #6B7280;
  font-weight: 500;
}

/* ═══════════════════════════════════════════
   TABLE
   ═══════════════════════════════════════════ */
.table-container {
  background: #fff;
  border: 1px solid #EAE5DA;
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #F0EBE0;
  flex-wrap: wrap;
  gap: 12px;
}

.table-header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.table-title {
  font-size: 16px;
  font-weight: 600;
  color: #1a1a2e;
}

.table-badge {
  background: #EAF0FD;
  color: #2F6FED;
  font-size: 12px;
  font-weight: 600;
  padding: 2px 12px;
  border-radius: 20px;
}

.table-search {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #F6F4EF;
  border: 1px solid #EAE5DA;
  border-radius: 8px;
  padding: 6px 12px;
  color: #6B7280;
}

.search-input {
  border: none;
  outline: none;
  background: transparent;
  font-size: 13px;
  color: #1a1a2e;
  min-width: 180px;
}

.search-input::placeholder {
  color: #6B7280;
}

.table-wrapper {
  overflow-x: auto;
}

.table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13.5px;
}

.table thead th {
  background: #FAF9F5;
  padding: 12px 18px;
  text-align: left;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: #6B7280;
  border-bottom: 1px solid #F0EBE0;
}

.table tbody td {
  padding: 12px 18px;
  border-bottom: 1px solid #F0EBE0;
  vertical-align: middle;
}

.table tbody tr:hover {
  background: #FBFAF6;
}

.table tbody tr:last-child td {
  border-bottom: none;
}

.text-center {
  text-align: center;
}

.id-badge {
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px;
  color: #6B7280;
  background: #F6F4EF;
  padding: 2px 10px;
  border-radius: 4px;
}

.role-name {
  display: flex;
  align-items: center;
  gap: 10px;
}

.role-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex-shrink: 0;
}

.role-name strong {
  font-weight: 600;
  color: #1a1a2e;
}

.role-description {
  color: #6B7280;
  font-size: 13px;
}

.level-badge {
  display: inline-block;
  padding: 2px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
}

.level-badge.level-high {
  background: #F1EBFE;
  color: #8B5CF6;
}

.level-badge.level-medium {
  background: #FCF1DF;
  color: #F0A23D;
}

.level-badge.level-low {
  background: #F3F4F6;
  color: #6B7280;
}

.user-count {
  display: inline-block;
  font-weight: 600;
  color: #1a1a2e;
}

.permission-count {
  display: inline-block;
  background: #F1EBFE;
  color: #8B5CF6;
  padding: 2px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
}

/* ═══════════════════════════════════════════
   ACTION BUTTONS
   ═══════════════════════════════════════════ */
.action-buttons {
  display: flex;
  gap: 6px;
  justify-content: center;
}

.btn {
  border: none;
  border-radius: 8px;
  padding: 8px 16px;
  font-size: 13px;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  transition: all 0.15s ease;
}

.btn:active {
  transform: scale(0.97);
}

.btn-primary {
  background: #2F6FED;
  color: #fff;
  box-shadow: 0 4px 12px rgba(47, 111, 237, 0.3);
}

.btn-primary:hover {
  background: #1E56C8;
  box-shadow: 0 6px 16px rgba(47, 111, 237, 0.4);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-secondary {
  background: #F6F4EF;
  color: #6B7280;
}

.btn-secondary:hover {
  background: #EDEAE0;
}

.btn-edit {
  background: transparent;
  color: #F0A23D;
  padding: 6px 8px;
  border-radius: 6px;
}

.btn-edit:hover {
  background: #FCF1DF;
}

.btn-permissions {
  background: transparent;
  color: #8B5CF6;
  padding: 6px 8px;
  border-radius: 6px;
}

.btn-permissions:hover {
  background: #F1EBFE;
}

.btn-delete {
  background: transparent;
  color: #E0524F;
  padding: 6px 8px;
  border-radius: 6px;
}

.btn-delete:hover {
  background: #FBEAE9;
}

/* ═══════════════════════════════════════════
   LOADING / EMPTY
   ═══════════════════════════════════════════ */
.loading-cell,
.empty-cell {
  padding: 48px 20px !important;
  text-align: center !important;
  color: #6B7280;
}

.spinner {
  display: inline-block;
  width: 28px;
  height: 28px;
  border: 3px solid #EAE5DA;
  border-top-color: #2F6FED;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin-bottom: 10px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.empty-cell i {
  font-size: 36px;
  color: #6B7280;
  opacity: 0.5;
  display: block;
  margin-bottom: 12px;
}

.empty-cell p {
  font-size: 15px;
  font-weight: 600;
  color: #6B7280;
  margin: 0 0 4px 0;
}

.empty-sub {
  font-size: 13px;
  color: #6B7280;
}

/* ═══════════════════════════════════════════
   MODAL
   ═══════════════════════════════════════════ */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
  animation: fadeIn 0.2s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.modal {
  background: #fff;
  border-radius: 16px;
  width: 100%;
  max-width: 480px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
  animation: slideUp 0.25s ease;
}

.modal.modal-lg {
  max-width: 700px;
}

@keyframes slideUp {
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid #F0EBE0;
}

.modal-header h3 {
  font-size: 18px;
  font-weight: 600;
  margin: 0;
  color: #1a1a2e;
  display: flex;
  align-items: center;
  gap: 10px;
}

.modal-header h3 i {
  color: #2F6FED;
}

.role-name-modal {
  color: #2F6FED;
}

.modal-close {
  background: none;
  border: none;
  font-size: 20px;
  color: #6B7280;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 6px;
  transition: background 0.15s;
}

.modal-close:hover {
  background: #F6F4EF;
}

.modal-body {
  padding: 24px;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding: 16px 24px 20px;
  border-top: 1px solid #F0EBE0;
}

/* ═══════════════════════════════════════════
   FORM
   ═══════════════════════════════════════════ */
.form-group {
  margin-bottom: 16px;
}

.form-group label {
  display: block;
  font-size: 13px;
  font-weight: 600;
  color: #6B7280;
  margin-bottom: 4px;
}

.required {
  color: #E0524F;
  font-weight: 700;
}

.form-input {
  width: 100%;
  background: #FAF9F5;
  border: 1px solid #EAE5DA;
  border-radius: 8px;
  padding: 10px 14px;
  font-size: 14px;
  color: #1a1a2e;
  outline: none;
  transition: border-color 0.15s, box-shadow 0.15s;
  font-family: inherit;
}

.form-input:focus {
  border-color: #2F6FED;
  box-shadow: 0 0 0 3px rgba(47, 111, 237, 0.12);
  background: #fff;
}

.form-input.error {
  border-color: #E0524F;
  background: #FBEAE9;
}

.form-input.error:focus {
  box-shadow: 0 0 0 3px rgba(224, 82, 79, 0.12);
}

.form-input::placeholder {
  color: #6B7280;
}

textarea.form-input {
  resize: vertical;
  min-height: 60px;
}

.field-help {
  display: block;
  font-size: 11px;
  color: #6B7280;
  margin-top: 4px;
}

.error-msg {
  color: #E0524F;
  font-size: 12px;
  display: flex;
  align-items: center;
  gap: 4px;
  margin-top: 4px;
}

.switch-group {
  margin-top: 8px;
}

.switch-container {
  display: flex;
  align-items: center;
  gap: 12px;
  padding-top: 4px;
}

.switch {
  position: relative;
  display: inline-block;
  width: 48px;
  height: 26px;
  flex-shrink: 0;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: #d1d5db;
  transition: 0.3s;
  border-radius: 26px;
}

.slider::before {
  content: '';
  position: absolute;
  height: 20px;
  width: 20px;
  left: 3px;
  bottom: 3px;
  background: #fff;
  transition: 0.3s;
  border-radius: 50%;
}

.switch input:checked + .slider {
  background: #E85D3A;
}

.switch input:checked + .slider::before {
  transform: translateX(22px);
}

.switch-label {
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  display: flex;
  align-items: center;
  gap: 6px;
}

.text-success {
  color: #10b981 !important;
}

.text-danger {
  color: #ef4444 !important;
}

/* ═══════════════════════════════════════════
   PERMISOS
   ═══════════════════════════════════════════ */
.permissions-grid {
  max-height: 400px;
  overflow-y: auto;
}

.permissions-grid::-webkit-scrollbar {
  width: 4px;
}

.permissions-grid::-webkit-scrollbar-track {
  background: #F6F4EF;
  border-radius: 10px;
}

.permissions-grid::-webkit-scrollbar-thumb {
  background: #EAE5DA;
  border-radius: 10px;
}

.permission-group {
  margin-bottom: 16px;
  border: 1px solid #F0EBE0;
  border-radius: 8px;
  overflow: hidden;
}

.permission-group-header {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  background: #FAF9F5;
  font-weight: 600;
  font-size: 13px;
  color: #6B7280;
  border-bottom: 1px solid #F0EBE0;
}

.permission-group-header i {
  color: #2F6FED;
}

.permission-count {
  margin-left: auto;
  background: #EAE5DA;
  color: #6B7280;
  font-size: 11px;
  padding: 0 10px;
  border-radius: 12px;
}

.permission-list {
  padding: 8px 0;
}

.permission-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 6px 14px;
  cursor: pointer;
  transition: background 0.15s;
  font-size: 13px;
}

.permission-item:hover {
  background: #FAF9F5;
}

.permission-checkbox {
  width: 16px;
  height: 16px;
  accent-color: #2F6FED;
  cursor: pointer;
}

.permission-name {
  font-weight: 500;
  color: #1a1a2e;
}

.permission-desc {
  font-size: 12px;
  color: #6B7280;
}

.empty-permissions {
  text-align: center;
  padding: 40px 20px;
  color: #6B7280;
}

.empty-permissions i {
  font-size: 36px;
  display: block;
  margin-bottom: 12px;
}

.permissions-actions {
  display: flex;
  gap: 8px;
}

.permissions-actions-right {
  display: flex;
  gap: 8px;
  margin-left: auto;
}

/* ═══════════════════════════════════════════
   RESPONSIVE
   ═══════════════════════════════════════════ */
@media (max-width: 1024px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .admin-roles {
    padding: 16px;
  }

  .page-header {
    flex-direction: column;
    align-items: stretch;
  }

  .page-title {
    font-size: 20px;
  }

  .stats-grid {
    grid-template-columns: 1fr 1fr;
    gap: 12px;
  }

  .stat-card {
    padding: 12px 16px;
  }

  .stat-value {
    font-size: 18px;
  }

  .table-header {
    flex-direction: column;
    align-items: stretch;
  }

  .table-search {
    width: 100%;
  }

  .search-input {
    width: 100%;
    min-width: unset;
  }

  .modal {
    max-width: 100%;
    margin: 0 16px;
  }

  .modal.modal-lg {
    max-width: 100%;
  }

  .action-buttons {
    gap: 4px;
  }

  .permissions-actions {
    flex-wrap: wrap;
  }

  .permissions-actions-right {
    margin-left: 0;
    flex-wrap: wrap;
  }

  .modal-footer {
    flex-direction: column;
  }

  .modal-footer .btn {
    width: 100%;
    justify-content: center;
  }

  .permissions-actions,
  .permissions-actions-right {
    flex-direction: column;
    width: 100%;
  }

  .permissions-actions .btn,
  .permissions-actions-right .btn {
    width: 100%;
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }

  .table thead {
    display: none;
  }

  .table tbody td {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 14px;
    border-bottom: 1px solid #F0EBE0;
  }

  .table tbody td::before {
    content: attr(data-label);
    font-weight: 600;
    font-size: 11px;
    text-transform: uppercase;
    color: #6B7280;
  }

  .table tbody td:last-child {
    border-bottom: 1px solid #F0EBE0;
  }

  .table tbody tr:last-child td:last-child {
    border-bottom: none;
  }
}
</style>