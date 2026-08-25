<template>
  <div class="users-management">
    <div class="panel-header">
      <div>
        <div class="panel-title">
          <i class="bi bi-building-fill"></i>
          Gestión de Empresas
        </div>
        <div class="panel-sub">
          <i class="bi bi-info-circle"></i>
          Administra las empresas registradas en el sistema.
          <span class="company-count">{{ empresas.length }}</span> empresas registradas
        </div>
      </div>
      <div class="header-stats">
        <span class="stat-badge">
          <i class="bi bi-buildings"></i>
          {{ empresas.length }}
        </span>
        <span class="stat-badge success">
          <i class="bi bi-check-circle-fill"></i>
          {{ empresas.filter(e => e.activo !== false).length }}
        </span>
      </div>
    </div>

    <!-- ⭐ ALERTA DE ÉXITO AL ELIMINAR -->
    <div v-if="deleteSuccess" class="alert alert-success">
      <div class="alert-icon">✅</div>
      <div class="alert-content">
        <h4>¡Empresa Eliminada!</h4>
        <p>{{ deleteMessage }}</p>
        <button @click="deleteSuccess = false" class="btn btn-primary btn-sm">
          <i class="bi bi-check2"></i> Entendido
        </button>
      </div>
    </div>

    <!-- ⭐ ALERTA DE ERROR -->
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
      <div class="manage-card form-card">
        <div class="card-title">
          <i class="bi" :class="isEditing ? 'bi-pencil-square' : 'bi-building-add'"></i>
          <h3>{{ isEditing ? 'Editar Empresa' : 'Registrar Nueva Empresa' }}</h3>
        </div>
        <p class="card-sub">
          {{ isEditing ? 'Modifica los datos de la empresa seleccionada.' : 'Completa los datos de la empresa para registrarla en el sistema.' }}
        </p>

        <form @submit.prevent="handleSubmit" novalidate>
          <div class="field-group">
            <label>
              <i class="bi bi-tag"></i>
              Nombre de la Empresa <span class="required">*</span>
            </label>
            <input 
              type="text" 
              v-model="form.nombre" 
              placeholder="Ej. AGROGASOIL, C.A."
              :class="{ 'error': errors.nombre }"
              @blur="validateField('nombre')"
            >
            <span class="error-msg" v-if="errors.nombre">
              <i class="bi bi-exclamation-circle"></i> {{ errors.nombre }}
            </span>
          </div>

          <div class="field-group">
            <label><i class="bi bi-file-earmark-text"></i> RIF</label>
            <input 
              type="text" 
              v-model="form.rif" 
              placeholder="Ej. J-12345678-0"
              :class="{ 'error': errors.rif }"
              @blur="validateField('rif')"
            >
            <span class="error-msg" v-if="errors.rif">
              <i class="bi bi-exclamation-circle"></i> {{ errors.rif }}
            </span>
          </div>

          <div class="field-group">
            <label><i class="bi bi-geo-alt"></i> Dirección</label>
            <input 
              type="text" 
              v-model="form.direccion" 
              placeholder="Ej. Av. Principal, Local 1"
              :class="{ 'error': errors.direccion }"
              @blur="validateField('direccion')"
            >
            <span class="error-msg" v-if="errors.direccion">
              <i class="bi bi-exclamation-circle"></i> {{ errors.direccion }}
            </span>
          </div>

          <div class="field-group">
            <label><i class="bi bi-telephone"></i> Teléfono</label>
            <input 
              type="text" 
              v-model="form.telefono" 
              placeholder="+58 412-1234567"
              :class="{ 'error': errors.telefono }"
              @blur="validateField('telefono')"
            >
            <span class="error-msg" v-if="errors.telefono">
              <i class="bi bi-exclamation-circle"></i> {{ errors.telefono }}
            </span>
          </div>

          <div class="field-group">
            <label><i class="bi bi-envelope"></i> Correo Electrónico</label>
            <input 
              type="email" 
              v-model="form.email" 
              placeholder="info@empresa.com"
              :class="{ 'error': errors.email }"
              @blur="validateField('email')"
            >
            <span class="error-msg" v-if="errors.email">
              <i class="bi bi-exclamation-circle"></i> {{ errors.email }}
            </span>
          </div>

          <div class="field-group checkbox-group">
            <label class="checkbox-label">
              <input type="checkbox" v-model="form.activo">
              <span class="toggle-text">
                <i class="bi" :class="form.activo ? 'bi-toggle-on text-success' : 'bi-toggle-off text-muted'"></i>
                {{ form.activo ? 'Empresa Activa' : 'Empresa Inactiva' }}
              </span>
            </label>
          </div>

          <div class="form-actions">
            <button 
              type="submit" 
              class="btn btn-primary" 
              :disabled="loading"
            >
              <i class="bi" :class="loading ? 'bi-arrow-repeat spin' : (isEditing ? 'bi-check2-circle' : 'bi-building-add')"></i>
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

      <div class="manage-card list-card">
        <div class="card-title">
          <i class="bi bi-list-ul"></i>
          <h3>Empresas Registradas</h3>
          <span class="item-count">{{ empresas.length }}</span>
        </div>
        <p class="card-sub">Gestiona las empresas del sistema.</p>

        <div class="search-box">
          <i class="bi bi-search"></i>
          <input 
            type="text" 
            v-model="searchTerm" 
            placeholder="Buscar por nombre o RIF..."
            class="search-input"
          >
          <button v-if="searchTerm" class="clear-btn" @click="searchTerm = ''">
            <i class="bi bi-x-circle"></i>
          </button>
        </div>

        <div class="user-list">
          <div 
            class="user-item" 
            v-for="e in filteredEmpresas" 
            :key="e.id"
            :class="{ 'is-editing': editingId === e.id }"
          >
            <div class="user-avatar" :class="e.activo !== false ? 'avatar-active' : 'avatar-inactive'">
              <i class="bi bi-building"></i>
            </div>
            
            <div class="user-info">
              <div class="user-name">
                {{ e.nombre }}
                <span class="status-badge" :class="e.activo !== false ? 'active' : 'inactive'">
                  <i class="bi" :class="e.activo !== false ? 'bi-circle-fill' : 'bi-circle'"></i>
                  {{ e.activo !== false ? 'Activa' : 'Inactiva' }}
                </span>
              </div>
              <div class="user-meta">
                <span v-if="e.rif" class="meta-item">
                  <i class="bi bi-file-earmark-text"></i> {{ e.rif }}
                </span>
                <span v-if="e.direccion" class="meta-item">
                  <i class="bi bi-geo-alt"></i> {{ e.direccion }}
                </span>
                <span v-if="e.telefono" class="meta-item">
                  <i class="bi bi-telephone"></i> {{ e.telefono }}
                </span>
                <span v-if="e.email" class="meta-item">
                  <i class="bi bi-envelope"></i> {{ e.email }}
                </span>
              </div>
            </div>

            <div class="user-actions">
              <button class="action-btn" @click="editEmpresa(e)" title="Editar">
                <i class="bi bi-pencil"></i>
              </button>
              <button class="action-btn" @click="toggleStatus(e)" :title="e.activo !== false ? 'Desactivar' : 'Activar'">
                <i class="bi" :class="e.activo !== false ? 'bi-toggle-on' : 'bi-toggle-off'"></i>
              </button>
              <button class="action-btn danger" @click="eliminar(e)" title="Eliminar">
                <i class="bi bi-trash3"></i>
              </button>
            </div>
          </div>

          <div v-if="!filteredEmpresas.length" class="empty-state">
            <i class="bi bi-inbox"></i>
            <p>{{ searchTerm ? 'No se encontraron resultados.' : 'No hay empresas registradas.' }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- ⭐ MODAL DE CONFIRMACIÓN PARA ELIMINAR -->
    <div v-if="showDeleteModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal">
        <div class="modal-header">
          <h3><i class="bi bi-exclamation-triangle" style="color: #dc2626;"></i> Confirmar Eliminación</h3>
          <button class="modal-close" @click="closeModal">×</button>
        </div>
        <div class="modal-body">
          <p>
            ¿Está seguro que desea eliminar la empresa 
            <strong>"{{ empresaAEliminar?.nombre }}"</strong>?
          </p>
          <div class="modal-warning">
            <p>⚠️ Esta acción eliminará permanentemente:</p>
            <ul>
              <li>La empresa y todos sus datos</li>
              <li>Los <strong>usuarios</strong> asociados a esta empresa</li>
              <li>Los <strong>reportes financieros</strong> de esta empresa</li>
              <li>Los <strong>registros de actividad</strong> relacionados</li>
              <li>Todas las <strong>relaciones</strong> asociadas</li>
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
            {{ deleting ? 'Eliminando...' : 'Sí, Eliminar Empresa' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { useUiStore } from '../stores/ui'
import { EmpresasAPI } from '../services/api'

const ui = useUiStore()

// ===== STATE =====
const empresas = ref([])
const loading = ref(false)
const isEditing = ref(false)
const editingId = ref(null)
const searchTerm = ref('')
const showDeleteModal = ref(false)
const empresaAEliminar = ref(null)
const deleting = ref(false)
const deleteSuccess = ref(false)
const deleteMessage = ref('')
const errorMessage = ref('')

// ===== FORM =====
const defaultForm = {
  nombre: '',
  rif: '',
  direccion: '',
  telefono: '',
  email: '',
  activo: true
}

const form = reactive({ ...defaultForm })

// ===== ERRORS =====
const errors = reactive({
  nombre: '',
  rif: '',
  direccion: '',
  telefono: '',
  email: ''
})

// ===== COMPUTED =====
const filteredEmpresas = computed(() => {
  if (!searchTerm.value) return empresas.value
  const term = searchTerm.value.toLowerCase()
  return empresas.value.filter(e => 
    e.nombre?.toLowerCase().includes(term) ||
    e.rif?.toLowerCase().includes(term) ||
    e.email?.toLowerCase().includes(term) ||
    e.direccion?.toLowerCase().includes(term)
  )
})

// ===== VALIDATION =====
const validations = {
  nombre: (val) => {
    if (!val?.trim()) return 'El nombre de la empresa es obligatorio'
    if (val.trim().length < 3) return 'El nombre debe tener al menos 3 caracteres'
    return ''
  },
  rif: (val) => {
    if (!val) return ''
    if (!/^[A-Za-z0-9-]+$/.test(val.trim())) return 'RIF inválido. Solo letras, números y guiones'
    return ''
  },
  direccion: (val) => {
    if (!val) return ''
    if (val.trim().length < 3) return 'La dirección debe tener al menos 3 caracteres'
    return ''
  },
  telefono: (val) => {
    if (!val) return ''
    if (!/^[0-9+\s-()]+$/.test(val.trim())) return 'Teléfono inválido. Solo números, +, -, espacios y ()'
    return ''
  },
  email: (val) => {
    if (!val) return ''
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim())) return 'Email inválido. Ej: info@empresa.com'
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
}

function cancelEdit() {
  resetForm()
}

function editEmpresa(e) {
  console.log('📝 Editando empresa:', e)
  isEditing.value = true
  editingId.value = e.id
  Object.assign(form, {
    nombre: e.nombre || '',
    rif: e.rif || '',
    direccion: e.direccion || '',
    telefono: e.telefono || '',
    email: e.email || '',
    activo: e.activo !== false
  })
  console.log('📝 Formulario cargado:', form)
  for (const key of Object.keys(errors)) errors[key] = ''
}

// ===== LOAD =====
async function load() {
  try {
    const response = await EmpresasAPI.list()
    const empresasList = response.data || []
    
    console.log('📋 Empresas obtenidas (sin dirección):', empresasList)
    
    const empresasCompletas = await Promise.all(
      empresasList.map(async (empresa) => {
        try {
          const detalle = await EmpresasAPI.getById(empresa.id)
          console.log(`📋 Detalle empresa ${empresa.id}:`, detalle.data)
          return detalle.data
        } catch (e) {
          console.error(`Error obteniendo detalle de empresa ${empresa.id}:`, e)
          return empresa
        }
      })
    )
    
    empresas.value = empresasCompletas
    console.log('✅ Empresas cargadas (con dirección):', empresas.value)
  } catch (error) {
    console.error('Error cargando empresas:', error)
    ui.showError('No se pudieron cargar las empresas')
  }
}

// ===== HANDLE SUBMIT =====
async function handleSubmit() {
  if (!validateAll()) {
    ui.showError('⚠️ Corrige los campos marcados.')
    return
  }

  loading.value = true
  errorMessage.value = ''
  
  try {
    const payload = {
      nombre: form.nombre.trim(),
      rif: form.rif?.trim() || '',
      direccion: form.direccion?.trim() || '',
      telefono: form.telefono?.trim() || '',
      email: form.email?.trim() || '',
      activo: form.activo === true
    }

    console.log('📤 Payload enviado:', payload)

    if (isEditing.value && editingId.value) {
      await EmpresasAPI.update(editingId.value, payload)
      ui.showToast('✅ Empresa actualizada correctamente.')
    } else {
      await EmpresasAPI.create(payload)
      ui.showToast('✅ Empresa creada correctamente.')
    }

    await load()
    resetForm()
  } catch (error) {
    console.error('❌ Error:', error)
    const msg = error.response?.data?.message || error.response?.data?.title || 'Error al procesar la solicitud'
    ui.showError(msg)
  } finally {
    loading.value = false
  }
}

// ===== TOGGLE STATUS =====
async function toggleStatus(e) {
  try {
    ui.openConfirm(`¿Cambiar estado de "${e.nombre}"? La empresa pasará a estar ${e.activo !== false ? 'INACTIVA' : 'ACTIVA'}.`, async () => {
      await EmpresasAPI.toggleStatus(e.id)
      await load()
      ui.showToast('✅ Estado actualizado.')
    })
  } catch (error) {
    console.error('Error cambiando estado:', error)
    ui.showError('No se pudo cambiar el estado.')
  }
}

// ===== MODAL FUNCTIONS =====
function openDeleteModal(e) {
  empresaAEliminar.value = e
  showDeleteModal.value = true
  errorMessage.value = ''
}

function closeModal() {
  showDeleteModal.value = false
  empresaAEliminar.value = null
  deleting.value = false
}

// ⭐⭐⭐ MÉTODO ELIMINAR MODIFICADO ⭐⭐⭐
async function confirmDelete() {
  if (!empresaAEliminar.value) return
  
  deleting.value = true
  errorMessage.value = ''
  
  try {
    const response = await EmpresasAPI.remove(empresaAEliminar.value.id)
    
    console.log('📤 Respuesta de eliminación:', response.data)
    
    // Cerrar el modal
    closeModal()
    
    // ⭐ Mostrar mensaje de éxito con los detalles del backend
    if (response.data.success) {
      deleteSuccess.value = true
      deleteMessage.value = response.data.message || 'Empresa eliminada exitosamente'
      
      // Recargar la lista
      await load()
      
      // Si la empresa eliminada estaba en edición, resetear el formulario
      if (isEditing.value && editingId.value === empresaAEliminar.value.id) {
        resetForm()
      }
      
      // Ocultar el mensaje después de 6 segundos
      setTimeout(() => {
        deleteSuccess.value = false
        deleteMessage.value = ''
      }, 6000)
    } else {
      errorMessage.value = response.data.message || 'Error al eliminar la empresa'
    }
  } catch (error) {
    console.error('❌ Error eliminando empresa:', error)
    closeModal()
    
    const msg = error.response?.data?.message || 
                error.response?.data?.title || 
                'No se pudo eliminar la empresa'
    errorMessage.value = msg
  } finally {
    deleting.value = false
    empresaAEliminar.value = null
  }
}

function eliminar(e) {
  // Abre el modal en lugar del confirm de ui
  openDeleteModal(e)
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

.company-count {
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

/* ⭐ ALERTAS */
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

.btn-sm {
  padding: 6px 16px;
  font-size: 13px;
  border-radius: 6px;
}

/* ⭐ MODAL */
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

.modal-close:hover {
  color: #111827;
}

.modal-body {
  padding: 24px;
}

.modal-body p {
  margin: 0 0 12px 0;
  font-size: 15px;
  color: #374151;
  line-height: 1.6;
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

.modal-warning ul li {
  margin-bottom: 4px;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 16px 24px;
  border-top: 1px solid #e5e7eb;
}

/* ⭐ ANIMACIONES */
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

.item-count {
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

.field-group input {
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

.field-group input:focus {
  outline: none;
  border-color: #2F6FED;
  box-shadow: 0 0 0 3px rgba(47, 111, 237, 0.08);
}

.field-group input.error {
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

.btn-danger:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-secondary {
  background: #e5e7eb;
  color: #374151;
}

.btn-secondary:hover {
  background: #d1d5db;
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

.clear-btn:hover {
  color: #4b5563;
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

.user-item:last-child {
  border-bottom: none;
}

.user-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 16px;
  flex-shrink: 0;
  color: #ffffff;
}

.user-avatar.avatar-active {
  background: #7c3aed;
}

.user-avatar.avatar-inactive {
  background: #9ca3af;
}

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

.status-badge.active {
  color: #22c55e;
}

.status-badge.inactive {
  color: #9ca3af;
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
}

@media (max-width: 480px) {
  .user-meta {
    flex-direction: column;
    gap: 3px;
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
  
  .user-name {
    font-size: 13px;
  }
}
</style>